import QueryableStore = module('./QueryableStore');
import IQueryable = module('./IQueryable');
import IModifiable = module('./IModifiable');

declare var Q: any;
export class ObjectStore implements IQueryable.IQueryable, IModifiable.IModifiable {
    private _nativeObjectStore: IDBObjectStore;
    private _nativeTransaction: IDBTransaction;

    constructor(transaction: IDBTransaction, objectStoreName: string) {
        this._nativeTransaction = transaction;
        this._nativeObjectStore = transaction.objectStore(objectStoreName);
    }

    index(name: string) {
        var indexStore = this._nativeObjectStore.index(name);
        return this._createQueryableStore(indexStore);
    }

    add(o) {
        var defered = Q.defer();
        try {
            if (Array.isArray(o)) {
                o.forEach((e) => {
                    this._nativeObjectStore.add(e);
                });
            } else {
                var addRequest = this._nativeObjectStore.add(o);
                addRequest.onerror = defered.reject;
                addRequest.onsuccess = defered.resolve;
            }
            this._nativeTransaction.oncomplete = defered.resolve;
            this._nativeTransaction.onerror = defered.reject;
            this._nativeTransaction.onabort = defered.reject;
        } catch (e) {
            defered.reject(e);
        }
        return defered.promise;
    }

    put(o) {
        var defered = Q.defer();
        try {
            if (Array.isArray(o)) {
                o.forEach((e) => {
                    this._nativeObjectStore.put(e);
                });
            } else {
                this._nativeObjectStore.put(o);
            }
        } catch (error) {
            defered.reject(error);
        }
        this._nativeTransaction.oncomplete = defered.resolve;
        this._nativeTransaction.onerror = defered.reject;
        this._nativeTransaction.onabort = defered.reject;
        return defered.promise;
    }

    remove(o) {
        var defered = Q.defer();
        var store: any = this._nativeObjectStore;
        var key;

        if (o && typeof o === 'object') {
            key = o[this._nativeObjectStore.keyPath];
        } else {
            key = o;
        }

        // 0 is a bad key :evil
        if (key) {
            store['delete'](key);
        } else {
            defered.reject('Key was not provided for remove operation or passed object does not contain key');
        }

        this._nativeTransaction.oncomplete = defered.resolve;
        this._nativeTransaction.onerror = defered.reject;
        this._nativeTransaction.onabort = defered.reject;
        return defered.promise;
    }

    get (key) {
        var defered = Q.defer();
        this._nativeObjectStore.get(key).onsuccess = (evt: any) => {
            defered.resolve(evt.target.result);
        };
        this._nativeTransaction.onerror = defered.reject;
        this._nativeTransaction.onabort = defered.reject;
        return defered.promise;
    }

    private _createQueryableStore(objectStore: any = this._nativeObjectStore) {
        return new QueryableStore.QueryableStore(this._nativeTransaction, objectStore);
    }

    take(count: number) {
        return this._createQueryableStore().take(count);
    }

    skip(count: number) {
        return this._createQueryableStore().skip(count);
    }

    filter(filter: Function) {
        return this._createQueryableStore().filter(filter);
    }

    step(step: number) {
        return this._createQueryableStore().step(step);
    }

    only(key: any) {
        return this._createQueryableStore().only(key);
    }

    unique() {
        return this._createQueryableStore().unique();
    }

    inRange(lower, upper, lowerOpen: Boolean, upperOpen: Boolean) {
        return this._createQueryableStore().inRange(lower, upper, lowerOpen, upperOpen);
    }

    reverse() {
        return this._createQueryableStore().reverse();
    }

    toArray() {
        return this._createQueryableStore().toArray();
    }

    toObject() {
        return this._createQueryableStore().toObject();
    }
}
