class CursorDirection {
    private _optionMatrix = [['next', 'nextunique'], ['prev', 'prevunique']];
    private _reverse: boolean;
    private _unique: boolean;

    constructor() {
        this._reverse = false;
        this._unique = false;
    }

    set reverse(value: boolean) {
        this._reverse = value;
    }

    set unique(value: boolean) {
        this._unique = value;
    }

    get reverse(): boolean {
        return this._reverse;
    }

    get unique(): boolean {
        return this._unique;
    }

    getValue() {
        var firstIndex = this._reverse ? 1 : 0;
        var secondIndex = this._unique ? 1 : 0;
        return this._optionMatrix[firstIndex][secondIndex];
    }
}
export = CursorDirection;