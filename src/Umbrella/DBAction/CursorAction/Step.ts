class Step {
    private _step: number;

    constructor(step: number) {
        this._step = step;
    }

    execute(cursorAction, value, resultList: any[]): boolean {
        cursorAction.cursorAction.method = 'advance';
        cursorAction.cursorAction.arg = this._step;
        return true;
    }
}
export = Step;