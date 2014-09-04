import ObjectStore = require('../Store/ObjectStore');
import SharedObjectStore = require('../Store/SharedObjectStore');
declare var Q: any;

export class Database {
    private objectStores: string[];
    private nativeDBInstance: IDBDatabase;
    private databaseReadyDefer = Q.defer();
    private entityDefinition;
    private _dbName: string;
    private _dbVersion: any;
    private _isOpen: Boolean;
    /**
        ** Creates new instance of index database representation
        ** @constructor
    **/
    constructor(dbName: string, version: any, entityDefinition: any) {
        this.entityDefinition = entityDefinition;
        this._dbName = dbName;
        this._dbVersion = version;
        this._isOpen = false;
    }

    get dbName() {
        return this._dbName;
    }

    get dbVersion() {
        return this._dbVersion;
    }

    get isOpen() {
        return this._isOpen;
    }

    private upgradeHandler(e: any) {
        var database: IDBDatabase = e.target.result;
        var existingStores = database.objectStoreNames;
        var definedStores: string[] = [];
        // Iterate through entity definition and create object stores or indices if needed
        Object.keys(this.entityDefinition).forEach((key, index) => {
            definedStores.push(key);
            var objectStore: IDBObjectStore;
            var objectStoreDefinition = this.entityDefinition[key];

            // Delete if already exists
            if (existingStores.contains(key)) {
                database.deleteObjectStore(key);
            }
            // create object store
            objectStore = database.createObjectStore(key, { keyPath: objectStoreDefinition.key, autoIncrement: objectStoreDefinition.autoIncrement });

            if (objectStoreDefinition.indexes) {
                var existingIndexes = objectStore.indexNames;
                objectStoreDefinition.indexes.forEach((indexDefinition) => {
                    if (existingIndexes.contains(indexDefinition.name)) {
                        objectStore.deleteIndex(indexDefinition.name);
                    }
                    objectStore.createIndex(indexDefinition.name, indexDefinition.key, { unique: indexDefinition.unique });
                });
            }
        });
        // Remove object stores, which are no longer defined
        var length = existingStores.length;
        for (var a = 0; a < length; a++) {
            var name = existingStores[a];
            if (definedStores.indexOf(name) === -1) {
                database.deleteObjectStore(name);
            }
        }
    }

    open() {
        var request: IDBOpenDBRequest = window.indexedDB.open(this.dbName, this.dbVersion);
        request.onupgradeneeded = this.upgradeHandler.bind(this);
        request.onsuccess = (e: any) => {
            this.nativeDBInstance = e.target.result;
            this._isOpen = true;
            this.databaseReadyDefer.resolve(this);
        };

        request.onerror = (e: any) => {
            this.databaseReadyDefer.reject(e);
            console.error(e);
        };
    }

    close() {
        if (this._isOpen) {
            this._isOpen = false;
            this.nativeDBInstance.close();
        }
    }

    get ready() {
        return this.databaseReadyDefer.promise;
    }

    stores(storeNames: string[], callback: Function) {
        var defered = Q.defer();
        var transaction = this.nativeDBInstance.transaction(storeNames, 'readwrite');
        transaction.onerror = defered.reject;
        transaction.onabort = defered.reject;
		
		var assocArray = {};
		storeNames.forEach((storeName, index) => {
			assocArray[storeName] = new SharedObjectStore(transaction, storeName);
		});
		       
        callback.call(transaction, assocArray);
        transaction.oncomplete = defered.resolve;
        return defered.promise;
    }

    store(objectStoreName: string, readonly: Boolean = false) {
        // Every operation on object store is executed with a new transaction
        var transaction = this.nativeDBInstance.transaction([objectStoreName], readonly ? 'readonly' : 'readwrite');
        var objectStore = new ObjectStore(transaction, objectStoreName);
        return objectStore;
    }
}