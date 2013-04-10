/// <reference path="../CursorOptions.ts"/>
module DBAction {
    export class Reverse {
        constructor() {
        }

        execute(cursorOptions: DBAction.CursorOptions) {
            cursorOptions.cursorDirection.reverse = true;
        }
    }
}