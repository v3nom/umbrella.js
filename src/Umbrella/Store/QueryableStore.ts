import IQueryable = require('./IQueryable');
import IModifiable = require('./IModifiable');

import ActionExecutor = require('../DBAction/ActionExecutor');
import CursorAction = require('./IModifiable');
import Take = require('../DBAction/CursorAction/Take');
import ToArray = require('../DBAction/ActionCompleter/ToArray');
import ToObject = require('../DBAction/ActionCompleter/ToObject');
import Unique = require('../DBAction/DirectionModifier/Unique');
import Only = require('../DBAction/RangeModifier/Only');
import InRange = require('../DBAction/RangeModifier/InRange');
import Reverse = require('../DBAction/DirectionModifier/Reverse');
import Skip = require('../DBAction/CursorAction/Skip');
import Filter = require('../DBAction/CursorAction/Filter');
import Step = require('../DBAction/CursorAction/Step');

declare var Q: any;

class QueryableStore implements IQueryable {
    private _dbActionExecutor: ActionExecutor;
    private _nativeObjectStore;

    constructor(transaction, objectStore) {
        this._nativeObjectStore = objectStore;
        this._dbActionExecutor = new ActionExecutor(transaction, objectStore);
    }

    get(key) {
        var defered = Q.defer();
        var request = this._nativeObjectStore.get(key)

        request.onsuccess = (evt: any) => {
            defered.resolve(evt.target.result);
        };

        request.onerror = defered.reject;

        return defered.promise;
    }

    skip(count: number) {
        this._dbActionExecutor.addCursorAction(new Skip(count));
        return this;
    }

    take(count: number) {
        this._dbActionExecutor.addCursorAction(new Take(count));
        return this;
    }

    filter(filter: Function) {
        this._dbActionExecutor.addCursorAction(new Filter(filter));
        return this;
    }

    step(step: number) {
        this._dbActionExecutor.addCursorAction(new Step(step));
        return this;
    }

    only(key: any) {
        this._dbActionExecutor.addCursorModifier(new Only(key));
        return this;
    }

    unique() {
        this._dbActionExecutor.addCursorModifier(new Unique());
        return this;
    }

    inRange(lower, upper, lowerOpen, upperOpen) {
        this._dbActionExecutor.addCursorModifier(new InRange(lower, upper, lowerOpen, upperOpen));
        return this;
    }

    reverse() {
        this._dbActionExecutor.addCursorModifier(new Reverse());
        return this;
    }

    toArray() {
        this._dbActionExecutor.addActionCompleter(new ToArray());
        return this._dbActionExecutor.getResultPromise();
    }

    toObject() {
        this._dbActionExecutor.addActionCompleter(new ToObject());
        return this._dbActionExecutor.getResultPromise();
    }
}
export = QueryableStore;
