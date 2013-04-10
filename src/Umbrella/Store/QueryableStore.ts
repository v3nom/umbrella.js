/// <reference path="./IQueryable.ts"/>
/// <reference path="./IModifiable.ts"/>
/// <reference path="../DBAction/ActionExecutor.ts"/>
/// <reference path="../DBAction/CursorAction/Take.ts"/>
/// <reference path="../DBAction/ActionCompleter/ToArray.ts"/>
/// <reference path="../DBAction/ActionCompleter/ToObject.ts"/>
/// <reference path="../DBAction/DirectionModifier/Unique.ts"/>
/// <reference path="../DBAction/RangeModifier/Only.ts"/>
/// <reference path="../DBAction/RangeModifier/InRange.ts"/>
/// <reference path="../DBAction/DirectionModifier/Reverse.ts"/>
/// <reference path="../DBAction/CursorAction/Skip.ts"/>
/// <reference path="../DBAction/CursorAction/Filter.ts"/>
/// <reference path="../DBAction/CursorAction/Step.ts"/>

declare var Q: any;
module Store {
    export class QueryableStore implements Store.IQueryable {
        private _dbActionExecutor: DBAction.ActionExecutor;
        private _nativeObjectStore;

        constructor(transaction, objectStore) {
            this._nativeObjectStore = objectStore;
            this._dbActionExecutor = new DBAction.ActionExecutor(transaction, objectStore);
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
            this._dbActionExecutor.addCursorAction(new DBAction.Skip(count));
            return this;
        }

        take(count: number) {
            this._dbActionExecutor.addCursorAction(new DBAction.Take(count));
            return this;
        }

        filter(filter: Function) {
            this._dbActionExecutor.addCursorAction(new DBAction.Filter(filter));
            return this;
        }

        step(step: number) {
            this._dbActionExecutor.addCursorAction(new DBAction.Step(step));
            return this;
        }

        only(key: any) {
            this._dbActionExecutor.addCursorModifier(new DBAction.Only(key));
            return this;
        }

        unique() {
            this._dbActionExecutor.addCursorModifier(new DBAction.Unique());
            return this;
        }

        inRange(lower, upper, lowerOpen, upperOpen) {
            this._dbActionExecutor.addCursorModifier(new DBAction.InRange(lower, upper, lowerOpen, upperOpen));
            return this;
        }

        reverse() {
            this._dbActionExecutor.addCursorModifier(new DBAction.Reverse());
            return this;
        }

        toArray() {
            this._dbActionExecutor.addActionCompleter(new DBAction.ToArray());
            return this._dbActionExecutor.getResultPromise();
        }

        toObject() {
            this._dbActionExecutor.addActionCompleter(new DBAction.ToObject());
            return this._dbActionExecutor.getResultPromise();
        }
    }
}