import CursorOptions = require('../CursorOptions');
class Unique {
    constructor() {
    }

    execute(cursorOptions: CursorOptions) {
        cursorOptions.cursorDirection.unique = true;
    }
}
export = Unique;
