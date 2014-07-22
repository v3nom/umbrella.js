class CursorRange {
    private _keyRange: IDBKeyRange;

    constructor() {
        // null is valid value, there will be no range
        this._keyRange = null;
    }

    set cursorRange(value: IDBKeyRange) {
        this._keyRange = value;
    }

    getValue() {
        return this._keyRange;
    }
}

export = CursorRange;
