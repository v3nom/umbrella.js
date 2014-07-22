import CursorDirection = require('./CursorDirection');
import CursorRange = require('./CursorRange');


class CursorOptions {
    private _cursorDirection: CursorDirection;
    private _cursorRange: CursorRange;

    constructor() {
        this._cursorDirection = new CursorDirection();
        this._cursorRange = new CursorRange();
    }

    get cursorDirection() {
        return this._cursorDirection;
    }

    get cursorRange() {
        return this._cursorRange;
    }

    get cursorDirectionValue() {
        return this._cursorDirection.getValue();
    }

    get cursorRangeValue() {
        return this._cursorRange.getValue();
    }
}
export = CursorOptions;