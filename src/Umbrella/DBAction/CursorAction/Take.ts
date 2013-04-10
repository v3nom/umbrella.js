/// <reference path="./ICursorAction.ts"/>
module DBAction {
    export class Take implements DBAction.ICursorAction {

        private _timesToExecute: number;

        constructor(count: number) {
            this._timesToExecute = count;
        }

        execute(cursorAction, value, resultList: any[]): bool {
            if (this._timesToExecute > 0) {
                this._timesToExecute--;
                cursorAction.resultAction = 'take';
                return false;
            } else {
                cursorAction.resultAction = 'skip';
                cursorAction.cursorAction.method = 'stop';
                return true;
            }
        }
    }
}