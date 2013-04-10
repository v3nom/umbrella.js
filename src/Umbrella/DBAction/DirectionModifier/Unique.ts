/// <reference path="../CursorOptions.ts"/>
module DBAction {
    export class Unique {
        constructor() {
        }

        execute(cursorOptions: DBAction.CursorOptions) {
            cursorOptions.cursorDirection.unique = true;
        }
    }
}