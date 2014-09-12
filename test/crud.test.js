var CrudEntityDefinition = {
    customer: {
        key: 'id',
        indexes: [{
            name: 'lastName',
            key: 'lastName',
            unique: false
        }]
    },
    item: {
        key: 'id',
        indexes: [],
        autoIncrement: true
    }
};

var crudDBPromise = Umbrella.open('crudTestDB', 13, CrudEntityDefinition);
var testO1 = {
    id: 1,
    firstName: 'Tomas',
    lastName: 'Gates'
};
var test02 = {
    id: 2,
    firstName: 'Jonas',
    lastName: 'Bobyrot'
};

var crudDB;

describe('Loading UmbrellaJS library', function () {
    it('should not be undefined', function () {
        expect(Umbrella).toBeDefined();
    });

    it('should load database', function () {
        var flag = false;

        runs(function () {
            crudDBPromise.then(function (db) {
                crudDB = db;
                expect(true).toBe(true);
                flag = true;
            }, function (error) {
                expect(false).toBe(true);
            });
        });

        waitsFor(function () {
            return flag;
        }, 'database should become ready', 2000);
    });
});

describe('UmbrellaJS crud operations', function () {
    it('should support add', function () {
        var flag = false;
        var result;

        runs(function () {
            var promise1 = crudDB.store('customer').add(testO1);
            var promise2 = crudDB.store('customer').add(test02);
            Q.all([promise1, promise2]).then(function () {
                crudDB.store('customer', true).toArray().then(function (result) {
                    expect(result[0].id).toBe(1);
                    expect(result[1].id).toBe(2);
                    expect(result.length).toBe(2);
                    flag = true;
                });
            }, function () {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 3000);
    });

    it('should support remove by object', function () {
        var flag = false;
        var result;

        runs(function () {
            var promise1 = crudDB.store('customer').remove(testO1);

            Q.all([promise1]).then(function () {
                crudDB.store('customer', true).toArray().then(function (result) {
                    expect(result[0].id).toBe(2);
                    expect(result.length).toBe(1);
                    flag = true;
                });
            }, function () {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 3000);
    });

    it('should support remove by key', function () {
        var flag = false;
        var result;

        runs(function () {
            var promise1 = crudDB.store('customer').remove(2);

            Q.all([promise1]).then(function () {
                crudDB.store('customer', true).toArray().then(function (result) {
                    expect(result.length).toBe(0);
                    flag = true;
                });
            }, function () {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 3000);
    });

    it('should support autoIncrement', function () {
        var flag = false;
        var result;

        runs(function () {
            var promise1 = crudDB.store('item').add([{
                itemName: 'item1'
            }, {
                itemName: 'item2'
            }]);

            Q.all([promise1]).then(function () {
                crudDB.store('item', true).toArray().then(function (result) {
                    expect(result[0].id).toBe(1);
                    expect(result[1].id).toBe(2);
                    expect(result.length).toBe(2);
                    flag = true;
                });
            }, function () {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 3000);
    });

    it('should support update', function () {
        var flag = false;

        runs(function () {
            crudDB.store('customer').add({
                id: 99,
                name: 'Testy'
            });
            var promise1 = crudDB.store('customer').put({
                id: 99,
                name: 'Testy2'
            })

            Q.all([promise1]).then(function () {
                crudDB.store('customer', true).toArray().then(function (result) {
                    expect(result[0].id).toBe(99);
                    expect(result[0].name).toBe('Testy2');
                    expect(result.length).toBe(1);
                    flag = true;
                });
            }, function () {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 3000);
    });

    it('should support multi store add', function () {
        var flag = false;

        runs(function () {
            crudDB.stores(['customer', 'item'], function (arrayOfStores) {
                var customerStore = arrayOfStores['customer'];
                var itemStore = arrayOfStores['item'];
                expect(customerStore).toBeDefined();
                expect(itemStore).toBeDefined();
                customerStore.add({
                    id: 123,
                    name: 'Bubbles'
                });
                itemStore.add({
                    id: 321,
                    brand: 'Sony'
                });
            }).then(function () {
                Q.all([crudDB.store('customer').get(123), crudDB.store('item').get(321)]).then(function (results) {
                    expect(results.length).toBe(2);
                    var customer = results[0];
                    var item = results[1];
                    expect(customer.name).toBe('Bubbles');
                    expect(item.brand).toBe('Sony');
                    flag = true;
                }, function () {
                    expect(false).toBeTruthy();
                    flag = true;
                });
            }, function (err) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 5000);
    });

    it('should support clear the store', function () {
        var flag = false;

        runs(function () {
            crudDB.store('customer').put(testO1).then(function () {
                crudDB.store('item').put(test02).then(function () {
                    crudDB.store('customer').clear().then(function () {
                        crudDB.store('customer').toArray().then(function (res) {
                            expect(res.length).toBe(0);
                            crudDB.store('item').clear().then(function () {
                                crudDB.store('item').toArray().then(function (res2) {
                                    expect(res2.length).toBe(0);
                                    flag = true;
                                })
                            })
                        })
                    });
                })
            }, function () {
                expect(false).toBe(true);
                flag = true;
            })
        });

        waitsFor(function () {
            return flag;
        }, 'database should be deleted', 10000);
    });

    it('should support deleting the database', function () {
        var flag = false;

        runs(function () {
            Umbrella.deleteDatabase('crudTestDB').then(function () {
                expect(true).toBe(true);
                flag = true;
            }, function (e) {
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 'database should be deleted', 10000);
    });
});