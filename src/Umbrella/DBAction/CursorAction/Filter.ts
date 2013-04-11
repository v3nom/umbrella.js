export class Filter {
    private _filter: Function;

    constructor(filter: Function) {
        this._filter = filter;
    }

    execute(cursorAction, value, resultList: any[]): bool {
        if (this._filter(value)) {
            cursorAction.resultAction = 'take';
            return true;
        } else {
            cursorAction.resultAction = 'skip';
            return false;
        }
    }
}
