import CursorOptions = require('../CursorOptions');
declare var IDBKeyRange: any;

class InRange {
    private _lower;
    private _upper;
    private _lowerOpen;
    private _upperOpen;

    constructor(lower, upper, lowerOpen, upperOpen) {
        this._lower = lower;
        this._upper = upper;
        this._lowerOpen = lowerOpen;
        this._upperOpen = upperOpen;
    }

    execute(cursorOptions: CursorOptions) {
        var bound;
        // Lower bound
        if (this._lower && (typeof this._upper === 'boolean' || this._upper === undefined)) {
            bound = IDBKeyRange.lowerBound(this._lower, this._upper);
        }
        // Upper bound
        if (!bound && !this._lower) {
            bound = IDBKeyRange.upperBound(this._upper, this._lowerOpen);
        }
        // Full bound
        if (!bound && this._lower && this._upper) {
            bound = IDBKeyRange.bound(this._lower, this._upper, this._lowerOpen, this._upperOpen);
        }
        if (bound) {
            cursorOptions.cursorRange.cursorRange = bound;
        }
    }
}
export = InRange;