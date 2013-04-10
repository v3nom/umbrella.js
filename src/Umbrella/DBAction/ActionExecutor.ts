/// <reference path="./CursorOptions.ts"/>

module DBAction {
    declare var Q: any;

    export class ActionExecutor {

        private _resultList;
        private _resultDefer;
        private _cursor;
        private _objectStore;
        private _transaction: IDBTransaction;
        private _cursorModifiers: any[];
        private _actionCompleter = null;
        private _cursorActions: any[];

        constructor(transaction: IDBTransaction, objectStore: IDBObjectStore) {
            this._resultDefer = Q.defer();
            this._transaction = transaction;
            this._cursorModifiers = [];
            this._resultList = [];
            this._cursorActions = [];
            this._objectStore = objectStore;
        }

        addCursorModifier(cursorModifier) {
            this._cursorModifiers.push(cursorModifier);
        }

        addCursorAction(cursorAction) {
            this._cursorActions.push(cursorAction);
        }

        addActionCompleter(completer) {
            if (!this._actionCompleter) {
                this._actionCompleter = completer;
                this._transaction.oncomplete = (ev) => {
                    this._actionCompleter.onSuccess(this._resultList, this._resultDefer);
                };

                this._transaction.onabort = (ev) => {
                    this._actionCompleter.onAbort(ev, this._resultDefer);
                };

                this._transaction.onerror = (ev) => {
                    this._actionCompleter.onError(ev, this._resultDefer);
                };

                this._executeQuery();
            } else {
                throw 'Only one completer per query allowed';
            }
        }

        getResultPromise() {
            return this._resultDefer.promise;
        }

        private _openCursor(): IDBRequest {
            var cursorOptions = new DBAction.CursorOptions();
            this._cursorModifiers.forEach((modifier: any) => {
                modifier.execute(cursorOptions);
            });

            return this._objectStore.openCursor(cursorOptions.cursorRangeValue, cursorOptions.cursorDirectionValue);
        }

        private _createQuaryAction() {
            // cursorAction.method: continue, advance, stop
            // resultAction: take, skip
            return { cursorAction: { method: 'continue', arg: undefined }, resultAction: 'take' };
        }

        private _executeQuery() {
            // Create cursor
            var cursorRequest: any = this._openCursor();

            cursorRequest.onsuccess = (e) => {
                var queryAction = this._createQuaryAction();
                var result = e.target.result;


                if (result) {
                    this._cursorActions.every((action) => {
                        return action.execute(queryAction, result.value, this._resultList);
                    });

                    if (queryAction.resultAction == 'take') {
                        this._resultList.push(result.value);
                    }
                    if (queryAction.cursorAction.method !== 'stop') {
                        if (queryAction.cursorAction.method === 'continue') {
                            // continue does not like parameters and closure compiler does not like continue :D
                            result['continue']();
                        } else {
                            result.advance(queryAction.cursorAction.arg);
                        }
                    }

                }
            };

            cursorRequest.onerror = (error) => {
                console.log(error);
            };

            cursorRequest.onabort = (error) => {
                console.log(error);
            };
        }
    }
}