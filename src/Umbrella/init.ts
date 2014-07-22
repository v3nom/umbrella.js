import Database = require('./DB/Database');

declare var window: any;
declare var Q: any;

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

export class Init {
    static databases: Database.Database[] = [];

    static open(dbName: string, version: any, entityDefinition: any) {
        var database;
        var newDatabaseCache = [];
        // Check if db already open and compare versions, close and recreate if new version
        Init.databases.forEach(function(db) {
            var isOpen = db.isOpen;

            if (isOpen && db.dbName === dbName) {
                if (db.dbVersion === version) {
                    database = db;
                } else {
                    db.close();
                }
            }
            if (isOpen) {
                newDatabaseCache.push(db);
            }
        });

        Init.databases = newDatabaseCache;

        if (!database) {
            database = new Database.Database(dbName, version, entityDefinition);
            database.open();
            Init.databases.push(database);
        }

        // Return db ready promise
        return database.ready;
    }

    static deleteDatabase(name: string) {
        var defer = Q.defer();
        Init.closeDatabase(name);

        var deleteRequest = indexedDB.deleteDatabase(name);
        deleteRequest.onsuccess = defer.resolve;
        deleteRequest.onerror = defer.reject;
        deleteRequest.onblocked = defer.reject;
        deleteRequest.onupgradeneeded = defer.resolve;
        return defer.promise;
    }

    static closeDatabase(name: string) {
        Init.databases.forEach(function(db) {
            if (db.dbName === name) {
                db.close();
            }
        });
    }
}