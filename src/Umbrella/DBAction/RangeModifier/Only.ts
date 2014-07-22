import CursorOptions = require('../CursorOptions');
declare var IDBKeyRange: any;
class Only {
    private _key: any;
    constructor(key: any) {
        this._key = key;
    }

    execute(cursorOptions: CursorOptions) {
        cursorOptions.cursorRange.cursorRange = IDBKeyRange.only(this._key);
    }
}
export = Only;