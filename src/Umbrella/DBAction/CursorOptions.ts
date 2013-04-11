import CursorDirection = module('./CursorDirection');
import CursorRange = module('./CursorRange');


export class CursorOptions {
    private _cursorDirection: CursorDirection.CursorDirection;
    private _cursorRange: CursorRange.CursorRange;

    constructor() {
        this._cursorDirection = new CursorDirection.CursorDirection();
        this._cursorRange = new CursorRange.CursorRange();
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
