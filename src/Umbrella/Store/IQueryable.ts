export interface IQueryable {
    take(count: number);
    skip(count: number);
    filter(filter: Function);
    step(step: number);
    only(key: any);
    unique();
    inRange(lower, upper, lowerOpen: Boolean, upperOpen: Boolean);
    reverse();
    toArray();
    toObject();
    get (key: any);
}