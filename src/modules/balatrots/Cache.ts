export class Cache {
    private nodes: Map<string, number>;
    private generatedFirstPack: boolean;
    private tracking: boolean;
    private changes: Map<string, number | undefined>;

    constructor() {
        this.nodes = new Map();
        this.generatedFirstPack = false;
        this.tracking = false;
        this.changes = new Map();
    }

    /**
     * Runs `fn` and rolls back any cache mutations performed during the call.
     * Used for "peek" operations that should not consume RNG/cache state.
     *
     * Cost is proportional to the number of keys mutated during the call (not total cache size).
     */
    public withRollback<T>(fn: () => T): T {
        const prevGeneratedFirstPack = this.generatedFirstPack;
        const prevTracking = this.tracking;
        const prevChanges = this.changes;

        this.tracking = true;
        this.changes = new Map();

        try {
            return fn();
        } finally {
            for (const [key, prevValue] of this.changes.entries()) {
                if (prevValue === undefined) {
                    this.nodes.delete(key);
                } else {
                    this.nodes.set(key, prevValue);
                }
            }

            this.generatedFirstPack = prevGeneratedFirstPack;

            // Restore nesting state
            this.tracking = prevTracking;
            this.changes = prevChanges;
        }
    }

    public exportState(): { nodes: Map<string, number>; generatedFirstPack: boolean } {
        return {
            nodes: new Map(this.nodes),
            generatedFirstPack: this.generatedFirstPack,
        };
    }

    public importState(state: { nodes: Map<string, number>; generatedFirstPack: boolean }): void {
        this.nodes = new Map(state.nodes);
        this.generatedFirstPack = state.generatedFirstPack;
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
        if (this.tracking && !this.changes.has(key)) {
            this.changes.set(key, this.nodes.get(key));
        }
        this.nodes.set(key, value);
    }
}