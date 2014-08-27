import IModifiable = require('./IModifiable');

class SharedObjectStore implements IModifiable {
    private _nativeObjectStore: IDBObjectStore;
    private _nativeTransaction: IDBTransaction;

    constructor(transaction: IDBTransaction, objectStoreName: string) {
        this._nativeTransaction = transaction;
        this._nativeObjectStore = transaction.objectStore(objectStoreName);
    }

    add(o) {
        if (Array.isArray(o)) {
            o.forEach((e) => {
                this._nativeObjectStore.add(e);
            });
        } else {
            this._nativeObjectStore.add(o);
        }
    }

    put(o) {
        if (Array.isArray(o)) {
            o.forEach((e) => {
                this._nativeObjectStore.put(e);
            });
        } else {
            this._nativeObjectStore.put(o);
        }
    }

    remove(o) {
        var store: any = this._nativeObjectStore;
        var key;
		if (Array.isArray(o)) {
            o.forEach((e) => {
                store['delete'](e);
            });
        } else if (o && typeof o === 'object') {
            key = o[this._nativeObjectStore.keyPath];
        } else {
            key = o;
        }

        // 0 is a bad key :evil
        if (key) {
            store['delete'](key);
        } else if(!Array.isArray(o)) {
            console.error('No key provided. Remove skipped.');
        }
    }
}
export = SharedObjectStore;