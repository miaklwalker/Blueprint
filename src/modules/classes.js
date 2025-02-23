export class Buy{
    constructor({selectedAnte, selectedBlind, cardName, location, itemType}){
        this.ante=selectedAnte;
        this.blind=selectedBlind;
        this.location=location;
        this.cardName=cardName;
        this.itemType = itemType;
    }
}