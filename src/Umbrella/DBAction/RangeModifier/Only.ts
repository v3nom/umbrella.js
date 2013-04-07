import CursorOptions = module('../CursorOptions');
declare var IDBKeyRange: any;
export class Only {
    private _key: any;
    constructor(key: any) {
        this._key = key;
    }

    execute(cursorOptions: CursorOptions.CursorOptions) {
        cursorOptions.cursorRange.cursorRange = IDBKeyRange.only(this._key);
    }
}