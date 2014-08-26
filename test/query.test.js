var entityDefinition = {
    customer: {
        key: 'id',
        indexes: [{ name: 'lastName', key: 'lastName', unique: false }]
    },
    emplopyee: {
        key: 'id',
        indexes: [{ name: 'lastName', key: 'lastName', unique: false }]
    },
    item: {
        key: 'id',
        indexes: []
    }
};

var dbPromise = Umbrella.open('queryTestDB', 13, entityDefinition);
var testO1 = { id: 1, firstName: 'Tomas', lastName: 'Gates' };
var test_customer_01 = { id: 3, firstName: 'Peter', lastName: 'Gandalf' };
var test_customer_02 = { id: 4, firstName: 'Robert', lastName: 'Gandalf' };
var test_customer_03 = { id: 5, firstName: 'Gabriel', lastName: 'Muresan' };
var test02 = { id: 2, firstName: 'Jonas', lastName: 'Bobyrot' };
var testItems = [{ id: 1, title: 'Toothpaste' }, { id: 2, title: 'Potato chips' }, { id: 3, title: 'Milk' }, { id: 4, title: 'Ketchup' },
{ id: 5, title: 'Froyo' }, { id: 6, title: 'Butter' }, { id: 7, title: 'Bread' }, { id: 8, title: 'Ice cream' }, { id: 9, title: 'Pizza' }];
var testItemsForRemove = [
    { id: 100, title: 'Toothpaste' },
    { id: 101, title: 'Potato chips' },
    { id: 102, title: 'Milk' },
    { id: 103, title: 'Ketchup' }
];
var testDB;

describe('Loading UmbrellaJS library', function () {
    it('should not be undefined', function () {
        expect(Umbrella).toBeDefined();
    });

    it('should load database', function () {
        var flag = false;

        runs(function () {
            dbPromise.then(function (db) {
                testDB = db;
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

describe('UmbrellaJS object manipulation specification', function () {
    it('should support adding new entities', function () {
        var flag = false;
        var result;

        runs(function () {
            var promise1 = testDB.store('customer').add(testO1);
            var promise2 = testDB.store('customer').add(test02);
            var promise3 = testDB.store('emplopyee').add(test_customer_01);
            var promise4 = testDB.store('emplopyee').add(test_customer_02);
            var promise5 = testDB.store('emplopyee').add(test_customer_03);
            Q.all([promise1, promise2, promise3, promise4, promise5]).then(function () {
                flag = true;
                result = true;
            }, function () {
                flag = true;
                result = false;
            });
        });

        waitsFor(function () {
            return flag;
        }, 2000);

        runs(function () {
            expect(result).toBe(true);
        });
    });

    it('should support batch put', function () {
        var flag = false;
        runs(function () {
            testDB.store('item').put(testItems).then(function () {
                expect(true).toBeTruthy();
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should run batch put second time without error', function () {
        var flag = false;
        runs(function () {
            testDB.store('item').put(testItems).then(function () {
                expect(true).toBeTruthy();
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });
});

describe('UmbrellaJS query specification', function () {
    it('should support toArray()', function () {
        var flag = false;
        runs(function () {
            testDB.store('customer', true).toArray().then(function (result) {
                expect(result.length).toBe(2);
                flag = true;
            });
        });
        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support reversed toArray()', function () {
        var flag = false;
        runs(function () {
            testDB.store('customer', true).reverse().toArray().then(function (result) {
                expect(result[0].id).toBe(2);
                expect(result[1].id).toBe(1);
                flag = true;
            });
        });
        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support take call', function () {
        var flag = false;
        runs(function () {
            testDB.store('customer', true).take(1).toArray().then(function (result) {
                expect(result.length).toBe(1);
                expect(result[0]).toBeDefined();
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support skip call', function () {
        var flag = false;
        runs(function () {
            testDB.store('item', true).skip(2).toArray().then(function (result) {
                expect(result.length).toBe(7);
                expect(result[0].id).toBe(3);
                expect(result[1].id, 4);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support take(1).skip(1) call', function () {
        var flag = false;
        runs(function () {
            testDB.store('item', true).take(1).skip(1).toArray().then(function (result) {
                expect(result.length).toBe(8);
                expect(result[0].id).toBe(1);
                expect(result[1].id).toBe(3);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support take(1).skip(1).take(1) call', function () {
        var flag = false;
        runs(function () {
            testDB.store('item', true).take(1).skip(1).take(1).toArray().then(function (result) {
                expect(result.length).toBe(2);
                expect(result[0].id).toBe(1);
                expect(result[1].id).toBe(3);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support filter call', function () {
        var flag = false;
        runs(function () {
            var filter = function (item) {
                return item.title[0] === 'B';
            };
            testDB.store('item', true).filter(filter).toArray().then(function (result) {
                expect(result.length).toBe(2);
                expect(result[0].id).toBe(6);
                expect(result[1].id).toBe(7);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });


    it('should support filter().skip(1) call', function () {
        var flag = false;
        runs(function () {
            var filter = function (item) {
                return item.title[0] === 'B';
            };
            testDB.store('item', true).filter(filter).skip(1).toArray().then(function (result) {
                expect(result.length).toBe(1);
                expect(result[0].id).toBe(7);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support filter().take(1) call', function () {
        var flag = false;
        runs(function () {
            var filter = function (item) {
                return item.title[0] === 'B';
            };
            testDB.store('item', true).filter(filter).take(1).toArray().then(function (result) {
                expect(result.length).toBe(1);
                expect(result[0].id).toBe(6);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support step(2) call', function () {
        var flag = false;
        runs(function () {
            testDB.store('item', true).step(2).toArray().then(function (result) {
                expect(result.length).toBe(5);
                expect(result[0].id).toBe(1);
                expect(result[4].id).toBe(9);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support step(2).filter().take(1) call', function () {
        var flag = false;
        runs(function () {
            var filter = function (item) {
                return item.title[0] === 'B';
            };
            testDB.store('item', true).step(2).filter(filter).take(1).toArray().then(function (result) {
                expect(result.length).toBe(1);
                expect(result[0].id).toBe(7);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support only(1) call', function () {
        var flag = false;
        runs(function () {
            testDB.store('item', true).only(1).toArray().then(function (result) {
                expect(result.length).toBe(1);
                expect(result[0].title).toBe('Toothpaste');
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support inRange(3,6) call', function () {
        var flag = false;
        runs(function () {
            testDB.store('item', true).inRange(3, 6).toArray().then(function (result) {
                expect(result.length).toBe(4);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support inRange(3,6, true, true) call', function () {
        var flag = false;
        runs(function () {
            testDB.store('item', true).inRange(3, 6, true, true).toArray().then(function (result) {
                expect(result.length).toBe(2);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support inRange(3,6, true) call', function () {
        var flag = false;
        runs(function () {
            testDB.store('item', true).inRange(3, 6, true).toArray().then(function (result) {
                expect(result.length).toBe(3);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support inRange(null,6) call', function () {
        var flag = false;
        runs(function () {
            testDB.store('item', true).inRange(null, 6).toArray().then(function (result) {
                expect(result.length).toBe(6);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support inRange(null,6).toObject() call', function () {
        var flag = false;
        runs(function () {
            testDB.store('item', true).inRange(null, 6).toObject().then(function (result) {
                expect(result).toBeDefined();
                expect(result.id).toBe(1);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support inRange(2,true) call', function () {
        var flag = false;
        runs(function () {
            testDB.store('item', true).inRange(2, true).toArray().then(function (result) {
                expect(result.length).toBe(7);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });
    // new test methods
    it('should support index.inRange call test #1', function () {
        var flag = false;
        runs(function () {
            testDB.store('emplopyee', true).index('lastName').inRange('Gandalf', 'Gandalf').toArray().then(function (result) {
                expect(result.length).toBe(2);
                expect(result[0].firstName).toBe('Peter');
                expect(result[1].firstName).toBe('Robert');
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });
    it('should support index.inRange.skip #1', function () {
        var flag = false;
        runs(function () {
            testDB.store('emplopyee', true).index('lastName').inRange('Gandalf', 'Gandalf').skip(2).toArray().then(function (result) {
                expect(result.length).toBe(0);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });
    it('should support index.inRange.skip #2', function () {
        var flag = false;
        runs(function () {
            testDB.store('emplopyee', true).index('lastName').inRange('Gandalf', 'Gandalf').skip(1).toArray().then(function (result) {
                expect(result.length).toBe(1);
                expect(result[0].firstName).toBe('Robert');
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });
    it('should support index.inRange.skip.take #1', function () {
        var flag = false;
        runs(function () {
            testDB.store('emplopyee', true).index('lastName').inRange('Gandalf', 'Gandalf').skip(1).take(1).toArray().then(function (result) {
                expect(result.length).toBe(1);
                expect(result[0].firstName).toBe('Robert');
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });
    it('should support index.inRange.skip.take #2', function () {
        var flag = false;
        runs(function () {
            testDB.store('emplopyee', true).index('lastName').inRange('Gandalf', 'Gandalf').skip(2).take(1).toArray().then(function (result) {
                expect(result.length).toBe(0);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });
    it('should support index.inRange.skip.take #2', function () {
        var flag = false;
        runs(function () {
            testDB.store('emplopyee', true).index('lastName').inRange('Gandalf', 'Gandalf').skip(1000).take(1).toArray().then(function (result) {
                expect(result.length).toBe(0);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });
    //end new test methods
    it('should support get(2) call', function () {
        var flag = false;
        runs(function () {
            testDB.store('item', true).get(2).then(function (result) {
                expect(result).toBeDefined();
                expect(result.title).toBe('Potato chips');
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });

    it('should support index.get("") call', function () {
        var flag = false;
        runs(function () {
            testDB.store('customer', true).index('lastName').get('Gates').then(function (result) {
                expect(result).toBeDefined();
                expect(result.id).toBe(1);
                flag = true;
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 1000);
    });
    //testing remove by array of keys
    it('should support remove([1,2,3])', function () {
        var flag = false;
        runs(function () {
            testDB.store('item').put(testItemsForRemove).then(function () {
                testDB.store('item').toArray().then(function (res) {
                    initialLength = res.length;
                    testDB.store('item').remove([100, 101]).then(function () {
                        testDB.store('item').toArray().then(function (res2) {
                            expect(res2.length).toBe(initialLength - 2);
                            testDB.store('item').remove([102, 103]).then(function () {
                                testDB.store('item').toArray().then(function (res3) {
                                    expect(res3.length).toBe(initialLength - 4);
                                    flag = true;
                                });
                            });
                        });
                    });
                });
            }, function (error) {
                expect(false).toBeTruthy();
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 2000);
    });
    it('should support deleting the database', function () {
        var flag = false;

        runs(function () {
            Umbrella.deleteDatabase('queryTestDB').then(function () {
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
