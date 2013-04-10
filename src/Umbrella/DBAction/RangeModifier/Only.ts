/// <reference path="../CursorOptions.ts"/>

module DBAction {
    declare var IDBKeyRange: any;
    export class Only {
        private _key: any;
        constructor(key: any) {
            this._key = key;
        }

        execute(cursorOptions: DBAction.CursorOptions) {
            cursorOptions.cursorRange.cursorRange = IDBKeyRange.only(this._key);
        }
    }
}