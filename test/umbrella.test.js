define(['Umbrella/init', 'lib/q.min'], function (_umbrella, _q) {
    var Umbrella = _umbrella.Umbrella;
    Q = _q;

    var entityDefinition = {
        customer: {
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
    var test02 = { id: 2, firstName: 'Jonas', lastName: 'Bobyrot' };
    var testItems = [{ id: 1, title: 'Toothpaste' }, { id: 2, title: 'Potato chips' }, { id: 3, title: 'Milk' }, { id: 4, title: 'Ketchup' },
    { id: 5, title: 'Froyo' }, { id: 6, title: 'Butter' }, { id: 7, title: 'Bread' }, { id: 8, title: 'Ice cream' }, { id: 9, title: 'Pizza' }];

    var testDB;

    describe('Jasmine', function () {
        it('baseline test', function () {
            expect(true).toBeTruthy();
        });
    });

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
        it('should support putting new entities', function () {
            var flag = false;
            var result;

            runs(function () {
                var promise1 = testDB.store('customer').put(testO1);
                var promise2 = testDB.store('customer').put(test02);
                Q.all([promise1, promise2]).then(function () {
                    flag = true;
                    result = true;
                }, function () {
                    flag = true;
                    result = false;
                });
            });

            waitsFor(function () {
                return flag;
            }, 1000);

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
        })
    });
});
