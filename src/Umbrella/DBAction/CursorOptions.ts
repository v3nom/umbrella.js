/// <reference path="./CursorDirection.ts"/>
/// <reference path="./CursorRange.ts"/>

module DBAction {
    export class CursorOptions {
        private _cursorDirection: DBAction.CursorDirection;
        private _cursorRange: DBAction.CursorRange;

        constructor() {
            this._cursorDirection = new DBAction.CursorDirection();
            this._cursorRange = new DBAction.CursorRange();
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
}