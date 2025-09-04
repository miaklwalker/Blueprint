



// R_CARD_TYPE can also include numbers 1 - 39 after it "cdt1", "cdt2", etc
export type cdtType = `cdt${number}` | "cdt";
export type arType = `ar${number}`;
export type plType = `pl${number}`;
export enum RandomQueueNames {
    R_Joker_Common = "Joker1",
    R_Joker_Uncommon = "Joker2",
    R_Joker_Rare = "Joker3",
    R_Joker_Legendary = "Joker4",
    R_Joker_Rarity = "rarity",
    R_Joker_Edition = "edi",
    R_Misprint = "misprint",
    R_Standard_Has_Enhancement = "stdset",
    R_Enhancement = "Enhanced",
    R_Card = "front",
    R_Cert = "certsl",
    R_Cert_Seal = "cert_fr",
    R_Standard_Edition = "standard_edition",
    R_Standard_Has_Seal = "stdseal",
    R_Standard_Seal = "stdsealtype",
    R_Shop_Pack = "shop_pack",
    R_Tarot = "Tarot",
    R_Spectral = "Spectral",
    R_Tags = "Tag",
    R_Shuffle_New_Round = "nr",
    R_Card_Type = "cdt",
    R_Planet = "Planet",
    R_Lucky_Mult = "lucky_mult",
    R_Lucky_Money = "lucky_money",
    R_Sigil = "sigil",
    R_Ouija = "ouija",
    R_Wheel_of_Fortune = "wheel_of_fortune",
    R_Aura = "aura",
    R_Gros_Michel = "gros_michel",
    R_Cavendish = "cavendish",
    R_Voucher = "Voucher",
    R_Voucher_Tag = "Voucher_fromtag",
    R_Orbital_Tag = "orbital",
    R_Soul = "soul_",
    R_Erratic = "erratic",
    R_Eternal = "stake_shop_joker_eternal",
    R_Perishable = "ssjp",
    R_Rental = "ssjr",
    R_Eternal_Perishable = "etperpoll",
    R_Rental_Pack = "packssjr",
    R_Eternal_Perishable_Pack = "packetper",
    R_Boss = "boss",
}
export enum RNGSource {
    S_Shop = "sho",
    S_Emperor = "emp",
    S_High_Priestess = "pri",
    S_Judgement = "jud",
    S_Wraith = "wra",
    S_Arcana = "ar1",
    S_Celestial = "pl1",
    S_Spectral = "spe",
    S_Standard = "sta",
    S_Buffoon = "buf",
    S_Vagabond = "vag",
    S_Superposition = "sup",

    S_8_Ball = "8ba",
    S_Seance = "sea",
    S_Sixth_Sense = "sixth",
    S_Top_Up = "top",
    S_Rare_Tag = "rta",
    S_Uncommon_Tag = "uta",
    S_Blue_Seal = "blusl",
    S_Purple_Seal = "8ba",
    S_Soul = "sou",
    S_Riff_Raff = "rif",
    S_Cartomancer = "car",
}

export type QueueNames = RandomQueueNames | RNGSource | cdtType | arType | plType;

