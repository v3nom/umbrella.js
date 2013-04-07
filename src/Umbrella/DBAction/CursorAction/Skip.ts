import ICursorAction = module('./ICursorAction');

export class Skip implements ICursorAction.ICursorAction {

    private _skipCount: number;

    constructor(skipCount: number) {
        this._skipCount = skipCount;
    }

    execute(cursorAction, value, resultList: any[]): bool {
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