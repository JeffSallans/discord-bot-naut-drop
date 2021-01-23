import { defaultTo, isEmpty, trim } from 'lodash';
import { Naut } from './services/naut';
import { NautDataService } from './services/naut-data.service';
import { NautToEmoji } from './services/naut-to-emoji';
import { TierToEmoji } from './services/tier-to-emoji';
import { setupConnection } from './db/mongodbConnection';
import { getEmoji, getPlayer, getPlayerList, nautPrefToString, parseNautPref, savePlayer } from './services/player-data/player-data.service';
import { connections } from 'mongoose';
import { IPlayer } from './db/collections/Player';

const _ = require('lodash');
require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

const commands = {};
const nautDataService = new NautDataService();

bot.login(TOKEN);

bot.on('ready', async () => {
  console.info(`Logged in as ${bot.user.tag}!`);

  const dbConnection = await setupConnection();
});

/**
 * Displays all possible funtionality to help the user
 * @param msg Discord message object
 */
commands['help'] = (msg, args) => {
  msg.reply(`Command: Help
Command format is: @naut-packs <command> <argument1> <argument2>
All <command> options: verbose-help, drop, setup, reroll, users, nauts, goldens-add, goldens, preference, health
`);
}

/**
 * Displays all possible funtionality to help the user
 * @param msg Discord message object
 */
commands['verbose-help'] = (msg, args) => {
  msg.reply(`Command: Verbose Help
Command format is: @naut-packs <command> <arguments1> <argument2>
All <command> options: verbose-help, drop, setup, reroll, users, nauts, goldens-add, goldens, preference, health, verbose-help

@naut-packs users
@naut-packs nauts
@setup <userTag> :Legendary: <naut1> <naut2> <naut3> :Epic: <naut1> <naut2> <naut3> <naut4> <naut5> :Ban: <naut1> <naut2> <naut3> <naut4> <naut5>
- userTag is the person the preference is for
@naut-packs drop <userTag1> <userTag2> <...>
- userTag is the people to roll for
@naut-packs preference <userTag>
- userTag is the person display a preference for
@reroll <userTag>
- userTag is the person the drop is for
@goldens <userTag>
- userTag is the person the drop is for
@goldens-add <userTag>
- userTag is the person the drop is for
  `);
}

/**
 * Sample discord function
 * @param msg Discord message object
 */
commands['health'] = (msg, args) => {
  if (connections.length < 1) {
    msg.reply('this bot is not connected to the database');
  }

  msg.reply('this bot is up and running');
}

commands['users'] = async (msg, args) => {
  const userList = await getPlayerList();
  const userListString = _.reduce(userList, (resultSoFar, player) => {
    if (resultSoFar === '') {
      resultSoFar = player.player;
    } else {
      resultSoFar += `, ${player.player}`;
    }
    return resultSoFar;
  }, '');
  msg.reply(`Command: Get User Names
${userListString}
`);
}

commands['nauts'] = (msg, args) => {
  const allNauts = NautToEmoji.getAllPairs();
  const allNautsString = _.reduce(allNauts, (resultSoFar, naut) => {
    if (resultSoFar === '') {
      resultSoFar = naut.description;
    } else {
      resultSoFar += `, ${naut.description}`;
    }
    return resultSoFar;
  }, '');
  msg.reply(`Command: Get Naut Names
${allNautsString}
`);
}

commands['preference'] = async (msg, args) => {
  const [command, nameTag] = args;
  if (isEmpty(nameTag)) {
    msg.reply(`Command: Get Naut Preference
Invalid message format, missing nameTag argument. See @naut-drop help for details.
    `);
    return;
  }

  const player = await getPlayer(nameTag);
  const nautPrefString = nautPrefToString(msg, player.nautPref);

  msg.reply(`Command: Get Naut Preference
${nameTag} ${nautPrefString}
`);
}

commands['setup'] = async (msg, args) => {
  const [
    command,
    nameTag,
    legendaryIcon, legNaut1, legNaut2, legNaut3,
    epicIcon, epicNaut1, epicNaut2, epicNaut3, epicNaut4, epicNaut5,
    banIcon, banNaut1, banNaut2, banNaut3, banNaut4, banNaut5
  ] = args;
  if (isEmpty(nameTag)) {
    msg.reply(`Command: Get Naut Preference
Invalid message format, missing nameTag argument. See @naut-drop help for details.
    `);
    return;
  }
  if (isEmpty(banNaut5)) {
    msg.reply(`Command: Get Naut Preference
Invalid message format, not enough arguments. See @naut-drop help for details.
    `);
    return;
  }

  if (legendaryIcon !== getEmoji(msg, TierToEmoji.LEGENDARY.description).toString() ||
    epicIcon !== getEmoji(msg, TierToEmoji.EPIC.description).toString() ||
    banIcon !== getEmoji(msg, TierToEmoji.BAN.description)) {
    msg.reply(`Command: Get Naut Preference
Invalid message format, incorrect number of legendary/epic nauts. See @naut-drop help for details.
    `);
    return;
  }

  let player = await getPlayer(nameTag);
  if (player) {
    player = {
      player: nameTag,
      discordUserId: nameTag,
      goldenCount: 0,
      earnedGoldenCount: 0,
      nautPref: [],
    };
  }

  player.nautPref = parseNautPref(msg,
    [legNaut1, legNaut2, legNaut3],
    [epicNaut1, epicNaut2, epicNaut3, epicNaut4, epicNaut5],
    [banNaut1, banNaut2, banNaut3, banNaut4, banNaut5]
  );

  await savePlayer(player);

  msg.reply(`Command: Setup
${nameTag} preference updated
`);
}

commands['drop'] = async (msg, args) => {
  const playerList = await getPlayerList();
  const allMessages = await Promise.all(_.map(playerList, async (player: IPlayer) => {
    return await getDropMessage(msg, player.player);
  }));
  const fullMessage = _.reduce(allMessages, (resultSoFar, message) => {
    return `${resultSoFar}
${message}`;
  }, '');

  msg.reply(fullMessage);
}

commands['drop-get'] = async (msg, args) => {
  const [command, nameTag] = args;
  if (isEmpty(nameTag)) {
    msg.reply(`Command: Get Naut Preference
Invalid message format, missing nameTag argument. See @naut-drop help for details.
    `);
    return;
  }

  const message = await getDropMessage(msg, nameTag);
  msg.reply(message);
}

let dropCount = 0;
let cachedDropMap = {};
let cacheTimeouts = {};
const getDropMessage = async (msg, nameTag: string): Promise<string> => {
  const cachedDrop = getDropCache(nameTag);
  if (!_.isNil(cachedDrop)) {
    return cachedDrop;
  }

  const player = await getPlayer(nameTag);
  const pack = nautDataService.getRandomNautsPack(player)
  const nautEmojis = _.map(pack, (naut: Naut) => {
    const emojiString = NautToEmoji.getEnumFromValue(naut.name).description;
    const tierString = TierToEmoji.getEnumFromValue(`${_.get(naut, 'tier', 'rare')}-${(naut.isGolden) ? 'golden' : ''}`).description;
    return `${getEmoji(msg, tierString)}${getEmoji(msg, emojiString)}`;
  });

  dropCount++;
  const message = `${nautEmojis[0]}  ${nautEmojis[1]}  ${nautEmojis[2]}  ${nautEmojis[3]}  ${nautEmojis[4]} -- Drop #${dropCount} ${nameTag} `;
  setDropCache(nameTag, message);
  return message;
}

const getDropCache = (nameTag) => {
  return cachedDropMap[nameTag];
}

const setDropCache = (nameTag, message) => {
  cachedDropMap[nameTag] = message;
  cacheTimeouts[nameTag] = setTimeout(() => {
    cachedDropMap[nameTag] = null;
  }, 5 * 1000 * 60);
}
const clearDropCache = (nameTag) => {
  clearTimeout(cacheTimeouts[nameTag]);
  cachedDropMap[nameTag] = null;
}

let goldens = {};
commands['reroll'] = async (msg, args) => {
  const [command, nameTag] = args;
  if (isEmpty(nameTag)) {
    msg.reply(`Command: Reroll Drop
Invalid message format, missing nameTag argument. See @naut-drop help for details.
    `);
    return;
  }

  const player = await getPlayer(nameTag);
  const goldenCount = defaultTo(player.goldenCount, 0);

  if (goldenCount === 0) {
    msg.reply(`Command: Reroll Drop
No golden counts to spend for a reroll
    `);
    return;
  }

  player.goldenCount--;
  await savePlayer(player);
  clearDropCache(nameTag);
  commands['drop-get'](msg, ['drop-get', nameTag]);
}

commands['goldens'] = async (msg, args) => {
  const [command, nameTag] = args;
  if (isEmpty(nameTag)) {
    msg.reply(`Command: Golden Count
Invalid message format, missing nameTag argument. See @naut-drop help for details.
    `);
    return;
  }

  const player = await getPlayer(nameTag);
  const goldenCount = defaultTo(player.goldenCount, 0);

  msg.reply(`Command: Golden Count
Player: ${nameTag} Count: ${goldenCount}
  `);
}

commands['goldens-add'] = async (msg, args) => {
  const [command, nameTag] = args;
  if (isEmpty(nameTag)) {
    msg.reply(`Command: Increment Golden Count
Invalid message format, missing nameTag argument. See @naut-drop help for details.
    `);
    return;
  }

  const player = await getPlayer(nameTag);
  player.goldenCount = defaultTo(player.goldenCount, 0) + 1;
  player.earnedGoldenCount = defaultTo(player.earnedGoldenCount, 0) + 1;
  await savePlayer(player);

  msg.reply(`Command: Increment Golden Count
Player: ${nameTag} Count: ${player.goldenCount}
  `);
}

bot.on('message', msg => {
  const content: string = msg.content;
  const taggedUser = msg.mentions.users.first();

  // Only run logic if bot is mentioned
  if (bot.user.id === _.get(taggedUser, 'id', '')) {

    try {
      // Trigger the appropriate function from the given command
      const parsedCommandArray = content.split(`<@!${bot.user.id}>`);
      const parsedCommand = _.trim(_.get(parsedCommandArray, '[1]'));
      const args = _.map(parsedCommand.split(' '), (argument) => {
        return _.trim(argument)
      });
      const command = _.get(commands, args[0], commands['help']);

      command(msg, args);
    } catch (e) {
      console.error(e);
      msg.reply('An error has occured, talk to Jeff.');
    }
  }
});
