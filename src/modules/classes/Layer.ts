export class Layer {
    pos: { x: number, y: number };
    name: string;
    order: number;
    source: string;
    rows: number;
    columns: number;
    animated: boolean;

    constructor({pos, name, order, source, rows, columns, animated=false}: {
        pos: { x: number, y: number },
        name: string,
        order: number,
        source: string
        rows: number,
        columns: number,
        animated?: boolean
    }) {
        this.pos = pos;
        this.name = name;
        this.order = order;
        this.source = source;
        this.rows = rows;
        this.columns = columns;
        this.animated = animated;
    }
}
