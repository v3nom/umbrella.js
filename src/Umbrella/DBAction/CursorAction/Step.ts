module DBAction {
    export class Step {
        private _step: number;

        constructor(step: number) {
            this._step = step;
        }

        execute(cursorAction, value, resultList: any[]): bool {
            cursorAction.cursorAction.method = 'advance';
            cursorAction.cursorAction.arg = this._step;
            return true;
        }
    }
}