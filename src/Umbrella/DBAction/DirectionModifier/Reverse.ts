import CursorOptions = require('../CursorOptions');
class Reverse {
    constructor() {
    }

    execute(cursorOptions:CursorOptions) {
        cursorOptions.cursorDirection.reverse = true;
    }
}
export = Reverse;