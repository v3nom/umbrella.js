import ICursorAction = require('./ICursorAction');

class Skip implements ICursorAction {

    private _skipCount: number;

    constructor(skipCount: number) {
        this._skipCount = skipCount;
    }

    execute(cursorAction, value, resultList: any[]): boolean {
        if (this._skipCount > 0) {
            this._skipCount--;
            cursorAction.resultAction = 'skip';
            cursorAction.cursorAction.method = 'continue';
            return false;
        } else {
            cursorAction.resultAction = 'take';
            cursorAction.cursorAction.method = 'continue';
            return true;
        }
    }
}
export = Skip;