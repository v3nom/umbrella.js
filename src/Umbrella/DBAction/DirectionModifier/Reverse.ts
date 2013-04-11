import CursorOptions = module('../CursorOptions');
export class Reverse {
    constructor() {
    }

    execute(cursorOptions: CursorOptions.CursorOptions) {
        cursorOptions.cursorDirection.reverse = true;
    }
}
