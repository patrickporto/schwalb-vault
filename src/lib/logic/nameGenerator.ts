export const DEMON_LORD_NAMES = [
    "Alistair", "Baelor", "Caelum", "Daeron", "Eldric", "Fenris", "Gareth", "Havelock", "Ignis", "Jarek",
    "Kaelen", "Lucius", "Malacor", "Nyx", "Orion", "Pireus", "Quintus", "Rurik", "Severus", "Thorne",
    "Ulric", "Valerius", "Wulfric", "Xander", "Yoric", "Zephyr", "Azura", "Bellatrix", "Celeste", "Dahlia"
];

export const WEIRD_WIZARD_NAMES = [
    "Aethelgard", "Bramble", "Cinder", "Driftwood", "Ember", "Fable", "Gossamer", "Hollow", "Ivy", "Juniper",
    "Kestrel", "Lark", "Moss", "Nettle", "Omen", "Pebble", "Quill", "Rowan", "Sage", "Thistle",
    "Umber", "Vesper", "Willow", "Yarrow", "Zephyr", "Ash", "Birch", "Crow", "Dusk"
];

export const EPITHETS = [
    "the Brave", "the Cursed", "the Swift", "the Wise", "the Fool", "the Strong", "the Shadow", "the Light",
    "of the North", "of the South", "the Wanderer", "the Lost", "the Broken", "the Eternal", "the Mad"
];

export function generateRandomName(type: 'person' | 'campaign' = 'person'): string {
    const list = Math.random() > 0.5 ? DEMON_LORD_NAMES : WEIRD_WIZARD_NAMES;
    const name = list[Math.floor(Math.random() * list.length)];

    if (type === 'person') {
        return Math.random() > 0.7 ? `${name} ${EPITHETS[Math.floor(Math.random() * EPITHETS.length)]}` : name;
    } else {
        const noun = ["Shadow", "Legacy", "Curse", "Fall", "Rise", "Revenge", "Secret", "Tale", "Legend", "Doom"];
        const connector = ["of", "of the", "from", "and"];
        return `The ${noun[Math.floor(Math.random() * noun.length)]} ${connector[Math.floor(Math.random() * connector.length)]} ${name}`;
    }
}
