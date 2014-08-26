var entityDefinition = {
    customer: {
        key: 'id',
        indexes: [{ name: 'lastName', key: 'lastName', unique: false }]
    },
    order: {
        key: 'id'
    }
};

var entityDefinition2 = {
    customer: {
        key: 'id',
        indexes: [{ name: 'lastName', key: 'lastName', unique: false }]
    },
    order: {
        key: 'id'
    },
    orderItem: {
        key: 'id'
    }
};

describe('Umbrella.open', function () {
    it('should create database with passed definition', function () {
        var flag = false;

        runs(function () {
            var dbPromise = Umbrella.open('testDB', 1, entityDefinition);
            dbPromise.then(function (db) {
                expect(db.nativeDBInstance.objectStoreNames.contains('customer')).toBeTruthy();
                expect(db.nativeDBInstance.objectStoreNames.contains('order')).toBeTruthy();
                expect(db.nativeDBInstance.objectStoreNames.contains('orderItem')).toBe(false);
                flag = true;
            }, function () {
                expect(false).toBe(true);
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 'database should be created', 10000);
    });

    it('should support database upgrade', function () {
        var flag = false;

        runs(function () {
            var dbPromise = Umbrella.open('testDB', 2, entityDefinition2);
            dbPromise.then(function (db) {
                expect(db.nativeDBInstance.objectStoreNames.contains('customer')).toBeTruthy();
                expect(db.nativeDBInstance.objectStoreNames.contains('order')).toBeTruthy();
                expect(db.nativeDBInstance.objectStoreNames.contains('orderItem')).toBeTruthy();
                flag = true;
            }, function () {
                expect(false).toBe(true);
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 'database should be created', 10000);
    });

    it('should support deleting the database', function () {
        var flag = false;

        runs(function () {
            Umbrella.deleteDatabase('testDB').then(function () {
                expect(true).toBe(true);
                flag = true;
            }, function (e) {
                console.log(e);
                expect(false).toBe(true);
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 'database should be deleted', 10000);
    });
});