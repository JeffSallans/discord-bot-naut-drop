import { find, map } from 'lodash';
import { IPlayer, Player } from '../../db/collections/Player'

/** Returns the list of players */
export const getPlayerList = async (): Promise<IPlayer[]> => {
  return new Promise((resolve, reject) => {
    Player.find((err, resultList) => {
      if (err) reject(err);

      const players = map(resultList, (result) => {
        return result.toObject() as IPlayer;
      })
      resolve(players);
    })
  });
}

/** Returns a player for the given id */
export const getPlayer = async (playerName: string): Promise<IPlayer> => {
  const playerList = await getPlayerList();
  const player = find(playerList, (target) => {
    return target.player === playerName;
  });
  return player;
}

export const createPlayers = (newPlayer: IPlayer) => {

}