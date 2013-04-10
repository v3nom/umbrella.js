/// <reference path="DB/Database.ts" />

module Init {
    declare var window: any;

    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    var databases: DB.Database[] = [];

    function open(dbName: string, version: any, entityDefinition: any) {
        // Check if db already open and compare versions, close and recreate if new version
        var database = databases.filter(function (d) {
            return d.dbName === dbName && d.dbVersion === d.dbVersion;
        })[0];

        if (!database) {
            database = new DB.Database(dbName, version, entityDefinition);
            database.open();
            databases.push(database);
        }

        // Return db ready promise
        return database.ready;
    };

    window['Umbrella'] = {};
    window['Umbrella'].open = open;
}