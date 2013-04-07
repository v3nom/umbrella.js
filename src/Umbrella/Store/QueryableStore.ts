import IQueryable = module('./IQueryable');
import IModifiable = module('./IModifiable');
import ActionExecutor = module('../DBAction/ActionExecutor');
import Take = module('../DBAction/CursorAction/Take');
import ToArray = module('../DBAction/ActionCompleter/ToArray');
import ToObject = module('../DBAction/ActionCompleter/ToObject');
import Unique = module('../DBAction/DirectionModifier/Unique');
import Only = module('../DBAction/RangeModifier/Only');
import InRange = module('../DBAction/RangeModifier/InRange');
import Reverse = module('../DBAction/DirectionModifier/Reverse');
import Skip = module('../DBAction/CursorAction/Skip');
import Filter = module('../DBAction/CursorAction/Filter');
import Step = module('../DBAction/CursorAction/Step');

declare var Q: any;

export class QueryableStore implements IQueryable.IQueryable {
    private _dbActionExecutor: ActionExecutor.ActionExecutor;
    private _nativeObjectStore;

    constructor(transaction, objectStore) {
        this._nativeObjectStore = objectStore;
        this._dbActionExecutor = new ActionExecutor.ActionExecutor(transaction, objectStore);
    }

    get (key) {
        var defered = Q.defer();
        var request = this._nativeObjectStore.get(key)

        request.onsuccess = (evt: any) => {
            defered.resolve(evt.target.result);
        };

        request.onerror = defered.reject;

        return defered.promise;
    }

    skip(count: number) {
        this._dbActionExecutor.addCursorAction(new Skip.Skip(count));
        return this;
    }

    take(count: number) {
        this._dbActionExecutor.addCursorAction(new Take.Take(count));
        return this;
    }

    filter(filter: Function) {
        this._dbActionExecutor.addCursorAction(new Filter.Filter(filter));
        return this;
    }

    step(step: number) {
        this._dbActionExecutor.addCursorAction(new Step.Step(step));
        return this;
    }

    only(key: any) {
        this._dbActionExecutor.addCursorModifier(new Only.Only(key));
        return this;
    }

    unique() {
        this._dbActionExecutor.addCursorModifier(new Unique.Unique());
        return this;
    }

    inRange(lower, upper, lowerOpen, upperOpen) {
        this._dbActionExecutor.addCursorModifier(new InRange.InRange(lower, upper, lowerOpen, upperOpen));
        return this;
    }

    reverse() {
        this._dbActionExecutor.addCursorModifier(new Reverse.Reverse());
        return this;
    }

    toArray() {
        this._dbActionExecutor.addActionCompleter(new ToArray.ToArray());
        return this._dbActionExecutor.getResultPromise();
    }

    toObject() {
        this._dbActionExecutor.addActionCompleter(new ToObject.ToObject());
        return this._dbActionExecutor.getResultPromise();
    }
}
