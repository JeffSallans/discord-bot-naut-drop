import { Schema, model } from 'mongoose';

const nautPrefSchema = new Schema({
  /** The name of the given player */
  player: String,
  /** The naut preferences of the player */
  nautPref: Array,
});
const NautPref = model('naut-preferences', nautPrefSchema);

export default NautPref;
