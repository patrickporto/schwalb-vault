export const SOTDL_AFFLICTIONS = [
    'asleep',
    'blinded',
    'charmed',
    'compelled',
    'dazed',
    'deafened',
    'defenseless',
    'diseased',
    'fatigued',
    'frightened',
    'grabbed',
    'immobilized',
    'impaired',
    'poisoned',
    'prone',
    'slowed',
    'stunned',
    'surprised',
    'unconscious'
] as const;

export const SOTDL_SENSES = [
    'shadowsight',
    'darksight',
    'sightless',
    'truesight'
] as const;

export type SotDLAffliction = typeof SOTDL_AFFLICTIONS[number];
export type SotDLSense = typeof SOTDL_SENSES[number];
