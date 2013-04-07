import Database = module('./DB/Database');
declare var window: any;

export class Umbrella {
    private static databases: Database.Database[] = [];

    static open(dbName: string, version: any, entityDefinition: any) {
        Umbrella.resolveApiNaming();
        // Check if db already open and compare versions, close and recreate if new version
        var database = Umbrella.databases.filter(function (d) {
            return d.dbName === dbName && d.dbVersion === d.dbVersion;
        })[0];

        if (!database) {
            database = new Database.Database(dbName, version, entityDefinition);
            database.open();
            Umbrella.databases.push(database);
        }

        // Return db ready promise
        return database.ready;
    };

    static resolveApiNaming() {
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    }
}