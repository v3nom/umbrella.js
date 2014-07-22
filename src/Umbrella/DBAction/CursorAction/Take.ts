import ICursorAction = require('./ICursorAction');
class Take implements ICursorAction {

    private _timesToExecute: number;

    constructor(count: number) {
        this._timesToExecute = count;
    }

    execute(cursorAction, value, resultList: any[]): boolean {
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
export = Take;