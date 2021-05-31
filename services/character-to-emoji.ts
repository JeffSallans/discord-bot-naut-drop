import { Enum } from './enum';

export class CharacterToEmoji extends Enum {
    static ADMIRAL = new CharacterToEmoji('admiral', 'Swiggins')
    static AYLA = new CharacterToEmoji('ayla', 'Ayla')
    static CHUCHO = new CharacterToEmoji('chucho', 'ChuchoKrokk')
    static CLUNK = new CharacterToEmoji('clunk', 'Clunk')
    static COCO = new CharacterToEmoji('coco', 'Coco')
    static COMMANDER = new CharacterToEmoji('commander', 'Rocket')
    static DEADLIFT = new CharacterToEmoji('deadlift', 'SamuelDeadlift')
    static DERPL = new CharacterToEmoji('derpl', 'Derpl')
    static DIZZY = new CharacterToEmoji('dizzy', 'Dizzy')
    static FROGGY = new CharacterToEmoji('froggy', 'Froggy')
    static GENJI = new CharacterToEmoji('genji', 'Genji')
    static GNAW = new CharacterToEmoji('gnaw', 'Gnaw')
    static IX = new CharacterToEmoji('ix', 'Ix')
    static JIMMY = new CharacterToEmoji('jimmy', 'Jimmy')
    static KSENIA = new CharacterToEmoji('ksenia', 'Ksenia')
    static LEON = new CharacterToEmoji('leon', 'Leon')
    static LONESTAR = new CharacterToEmoji('lonestar', 'Lonestar')
    static MAX = new CharacterToEmoji('max', 'MaxFocus')
    static NIBBS = new CharacterToEmoji('nibbs', 'Nibbs')
    static PENNY = new CharacterToEmoji('penny', 'Penny')
    static QITARA = new CharacterToEmoji('qitara', 'Qitara')
    static RAELYNN = new CharacterToEmoji('raelynn', 'Raelynn')
    static ROCCO = new CharacterToEmoji('rocco', 'Rocco')
    static SCOOP = new CharacterToEmoji('scoop', 'Scoop')
    static SENTRY = new CharacterToEmoji('sentry', 'Sentry')
    static SKREE = new CharacterToEmoji('skree', 'Skree')
    static SKROLLDER = new CharacterToEmoji('skrollder', 'Skolldir')
    static SMILES = new CharacterToEmoji('smiles', 'Smiles')
    static SNORK = new CharacterToEmoji('snork', 'SnorkGunk')
    static TED = new CharacterToEmoji('ted', 'Ted')
    static VINNIE = new CharacterToEmoji('vinnie', 'VinnieandSpike')
    static VOLTAR = new CharacterToEmoji('voltar', 'Voltar')
    static YOOLIP = new CharacterToEmoji('yoolip', 'Yoolip')
    static YURI = new CharacterToEmoji('yuri', 'Yuri')

    constructor(value, description) {
        super(value, description);
    }
}