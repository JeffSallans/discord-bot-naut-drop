import { Schema, model } from 'mongoose';

/** A user of the naut-drops app, and their corresponding data */
export interface IPlayer {
    /** The name of the given player */
    player: string,
    /** How many goldens the player has */
    goldenCount: number,
    /** How many goldens the player has earned total */
    earnedGoldenCount: number,
};

const playerSchema = new Schema({
  player: String,
  goldenCount: Number,
  earnedGoldenCount: Number,
});

/** The mongoose Model for interacting with the db */
export const Player = model('players', playerSchema);
