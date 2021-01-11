import { isEmpty, trim } from 'lodash';
import { Naut } from './services/naut';
import { NautDataService } from './services/naut-data.service';
import { NautToEmoji } from './services/naut-to-emoji';
import { TierToEmoji } from './services/tier-to-emoji';
const _ = require('lodash');
require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

const commands = {};
const nautDataService = new NautDataService();

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});


/**
 * Displays all possible funtionality to help the user
 * @param msg Discord message object
 */
commands['help'] = (msg, args) => {
  msg.reply(`Command: Help
Command format is: @naut-packs <command> <argument1> <argument2>
All <command> options: verbose-help, drop, drop-get, drop-reroll, users, naut-names, golden-count-add, golden-count, naut-pref-get, naut-pref-set, naut-pref-get-bulk, naut-pref-set-bulk, health
`);
}

/**
 * Displays all possible funtionality to help the user
 * @param msg Discord message object
 */
commands['verbose-help'] = (msg, args) => {
  msg.reply(`Command: Verbose Help
Command format is: @naut-packs <command> <arguments1> <argument2>
All <command> options: verbose-help, drop, drop-get, drop-reroll, users, naut-names, golden-count-add, golden-count, naut-pref-get, naut-pref-set, naut-pref-get-bulk, naut-pref-set-bulk, health, verbose-help

@naut-packs users
@naut-packs naut-names
@naut-packs naut-pref-get <userTag> <nautName>
- userTag is the person the preference is for
- nautName is the awesomenaut name (see the values returned in naut-names)
@naut-packs naut-pref-set <userTag> <nautName> <rarity>
- userTag is the person the preference is for
- nautName is the awesomenaut name (see the values returned in naut-pref-get)
- rarity is to set the preference value (0 - ban, 1 - common, 2 - epic, 3 - legendary)
@naut-packs naut-pref-bulk-get <userTag>
- userTag is the person the current rarity is for
@naut-packs naut-pref-bulk-set <userTag> <rarityString>
- userTag is the person the preference is for
- rarityString is the rarity of all the awesomenauts in alphabetical order
@drop-get <userTag>
- userTag is the person the drop is for
@drop-reroll <userTag>
- userTag is the person the drop is for
@golden-count <userTag>
- userTag is the person the drop is for
@golden-count-add <userTag>
- userTag is the person the drop is for
  `);
}

/**
 * Sample discord function
 * @param msg Discord message object
 */
commands['health'] = (msg, args) => {
  msg.reply('this bot is up and running');
}

commands['users'] = (msg, args) => {
  msg.reply(`Command: Get User Names
hasp, mathmatical, mlripper, thynix, qazwode
`);
}

commands['naut-names'] = (msg, args) => {
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

commands['naut-pref-get'] = (msg, args) => {
  const [command, nameTag, nautDescription] = args;
  if (isEmpty(nameTag)) {
    msg.reply(`Command: Get Naut Preference
Invalid message format, missing nameTag argument. See @naut-drop help for details.
    `);
    return;
  }
  if (isEmpty(nautDescription)) {
    msg.reply(`Command: Get Naut Preference
Invalid message format, missing nautName argument. See @naut-drop help for details.
    `);
    return;
  }
  const nautName = _.get(NautToEmoji.getEnumFromDescription(nautDescription), 'value', '');
  if (isEmpty(nautName)) {
    msg.reply(`Command: Get Naut Preference
Invalid message format, invalid nautName argument. See @naut-drop help for details.
    `);
    return;
  }

  const nautPref = nautDataService.getNautsForPlayer(nameTag);
  msg.reply(`Command: Get Naut Preference
Player: ${nameTag} Naut: ${nautName}
Pref: ${JSON.stringify(nautPref.find(naut => naut.id === nautName), null, '\t')}
`);
}

commands['naut-pref-set'] = (msg, args) => {
  msg.reply('Not Implemented');
}

commands['naut-pref-bulk-get'] = (msg, args) => {
  msg.reply('Not Implemented');
}

commands['naut-pref-bulk-set'] = (msg, args) => {
  msg.reply('Not Implemented');
}

commands['drop'] = (msg, args) => {
  const allUsers = ['hasp', 'mathmatical', 'mlripper', 'thynix', 'qazwode'];

  const fullMessage = _.reduce(allUsers, (resultSoFar, user) => {
    const message = getDropMessage(msg, user);
    return `${resultSoFar}
${message}`;
  }, '');

  msg.reply(fullMessage);
}

commands['drop-get'] = (msg, args) => {
  const [command, nameTag] = args;
  if (isEmpty(nameTag)) {
    msg.reply(`Command: Get Naut Preference
Invalid message format, missing nameTag argument. See @naut-drop help for details.
    `);
    return;
  }

  const message = getDropMessage(msg, nameTag);
  msg.reply(message);
}

let dropCount = 0;
let cachedDropMap = {};
let cacheTimeouts = {};
const getDropMessage = (msg, nameTag: string): string => {
  const cachedDrop = getDropCache(nameTag);
  if (!_.isNil(cachedDrop)) {
    return cachedDrop;
  }

  dropCount++;
  const pack = nautDataService.getRandomNautsPack(nameTag)
  const nautEmojis = _.map(pack, (naut: Naut) => {
    const emojiString = NautToEmoji.getEnumFromValue(naut.name).description;
    const tierString = TierToEmoji.getEnumFromValue(`${_.get(naut, 'tier', 'rare')}-${(naut.isGolden) ? 'golden' : ''}`).description;
    return `${getEmoji(msg, tierString)}${getEmoji(msg, emojiString)}`;
  });
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
commands['drop-reroll'] = (msg, args) => {
  const [command, nameTag] = args;
  if (isEmpty(nameTag)) {
    msg.reply(`Command: Reroll Drop
Invalid message format, missing nameTag argument. See @naut-drop help for details.
    `);
    return;
  }

  const goldenCount = _.get(goldens, nameTag, 0);

  if (goldenCount === 0) {
    msg.reply(`Command: Reroll Drop
No golden counts to spend for a reroll
    `);
    return;
  }

  goldens[nameTag]--;
  clearDropCache(nameTag);
  commands['drop-get'](msg, ['drop-get', nameTag]);
}

commands['golden-count'] = (msg, args) => {
  const [command, nameTag] = args;
  if (isEmpty(nameTag)) {
    msg.reply(`Command: Golden Count
Invalid message format, missing nameTag argument. See @naut-drop help for details.
    `);
    return;
  }

  const goldenCount = _.get(goldens, nameTag, 0);

  msg.reply(`Command: Golden Count
Player: ${nameTag} Count: ${goldenCount}
  `);
}

commands['golden-count-add'] = (msg, args) => {
  const [command, nameTag] = args;
  if (isEmpty(nameTag)) {
    msg.reply(`Command: Increment Golden Count
Invalid message format, missing nameTag argument. See @naut-drop help for details.
    `);
    return;
  }

  const goldenCount = _.get(goldens, nameTag, 0);
  goldens[nameTag] = goldenCount + 1;

  msg.reply(`Command: Increment Golden Count
Player: ${nameTag} Count: ${goldens[nameTag]}
  `);
}

const getEmoji = (msg, emojiName) => {
  const emoji = msg.guild.emojis.cache.find(emoji => emoji.name == emojiName);
  return emoji;
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
