import { ItemImpl } from "../../interface/Item";

export enum Planet {
    MERCURY = "Mercury",
    VENUS = "Venus",
    EARTH = "Earth",
    MARS = "Mars",
    JUPITER = "Jupiter",
    SATURN = "Saturn",
    URANUS = "Uranus",
    NEPTUNE = "Neptune",
    PLUTO = "Pluto",
    PLANET_X = "Planet X",
    CERES = "Ceres",
    ERIS = "Eris"
}

export class PlanetItem extends ItemImpl {
    constructor(readonly name: Planet) {
        super(name);
    }

    getName(): string {
        return this.name;
    }
}