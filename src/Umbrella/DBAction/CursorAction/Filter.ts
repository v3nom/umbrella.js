class Filter {
    private _filter: Function;

    constructor(filter: Function) {
        this._filter = filter;
    }

    execute(cursorAction, value, resultList: any[]): boolean {
        if (this._filter(value)) {
            cursorAction.resultAction = 'take';
            return true;
        } else {
            cursorAction.resultAction = 'skip';
            return false;
        }
    }
}
export = Filter;