export type Nft = {
  name: string;
  attributes: {
    rarity: "unique";
    "facial hair": string;
  };
};

const data: Record<string, Nft> = {
  "1": {
    name: "Bajoran Bunny",
    attributes: {
      rarity: "unique",
      "facial hair": "stubble",
    },
  },
  "2": {
    name: "Assassin de la Police",
    attributes: {
      rarity: "unique",
      "facial hair": "long stubble",
    },
  },
  "3": {
    name: "Küss Mich",
    attributes: {
      rarity: "unique",
      "facial hair": "stubble",
    },
  },
  "4": {
    name: "Beach Boy",
    attributes: {
      rarity: "unique",
      "facial hair": "baby skin",
    },
  },
  "5": {
    name: "Moustache TRex",
    attributes: {
      rarity: "unique",
      "facial hair": "moustache",
    },
  },
  "6": {
    name: "Biceps Bomb",
    attributes: {
      rarity: "unique",
      "facial hair": "stubble",
    },
  },
  "7": {
    name: "Profile Pic",
    attributes: {
      rarity: "unique",
      "facial hair": "full beard",
    },
  },
  "8": {
    name: "Forever Young",
    attributes: {
      rarity: "unique",
      "facial hair": "baby skin",
    },
  },
  "9": {
    name: "No Country for Old Men",
    attributes: {
      rarity: "unique",
      "facial hair": "garibaldi",
    },
  },
  "10": {
    name: "Zen Zubrovka",
    attributes: {
      rarity: "unique",
      "facial hair": "long stubble",
    },
  },
  "11": {
    name: "Sexy Asana",
    attributes: {
      rarity: "unique",
      "facial hair": "full beard",
    },
  },
  "12": {
    name: "Hipster Barber",
    attributes: {
      rarity: "unique",
      "facial hair": "bandholz",
    },
  },
};

export default data;
