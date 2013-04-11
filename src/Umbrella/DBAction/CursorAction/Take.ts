import ICursorAction = module('./ICursorAction');
export class Take implements ICursorAction.ICursorAction {

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
