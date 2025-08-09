import { PackType, PackTypeItem } from '../enum/packs/PackType';
import { PackKind } from '../enum/packs/PackKind';
import { Option } from './Option';

export class PackInfo {
    private _options: Set<Option> = new Set();

    constructor(
        private _type: PackTypeItem,
        private _size: number,
        private _choices: number
    ) { }

    getOptions(): Set<Option> {
        return this._options;
    }

    setOptions(options: Set<Option>): void {
        this._options = options;
    }

    getType(): PackType {
        return this._type.getName();
    }

    getKind(): PackKind {
        return this._type.getKind();
    }

    containsOption(name: string): boolean {
        return Array.from(this._options).some(option => option.name.getName() === name);
    }

    setType(type: PackType): void {
        this._type = new PackTypeItem(type, PackTypeItem.VALUES[type]);
    }

    getSize(): number {
        return this._size;
    }

    setSize(size: number): void {
        this._size = size;
    }

    getChoices(): number {
        return this._choices;
    }

    setChoices(choices: number): void {
        this._choices = choices;
    }
}
