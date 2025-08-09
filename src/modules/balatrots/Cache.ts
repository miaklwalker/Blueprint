export class Cache {
    private nodes: Map<string, number>;
    private generatedFirstPack: boolean;

    constructor() {
        this.nodes = new Map();
        this.generatedFirstPack = false;
    }

    public isGeneratedFirstPack(): boolean {
        return this.generatedFirstPack;
    }

    public setGeneratedFirstPack(generatedFirstPack: boolean): void {
        this.generatedFirstPack = generatedFirstPack;
    }

    public getNode(key: string) {
        return this.nodes.get(key);
    }

    public setNode(key: string, value: number) {
        this.nodes.set(key, value);
    }
}