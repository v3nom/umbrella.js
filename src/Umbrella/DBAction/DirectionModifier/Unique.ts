import CursorOptions = module('../CursorOptions');

export class Unique {
    constructor() {
    }

    execute(cursorOptions: CursorOptions.CursorOptions) {
        cursorOptions.cursorDirection.unique = true;
    }
}