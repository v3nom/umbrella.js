export class ToArray {
    onSuccess(resultList, deferedResult) {
        deferedResult.resolve(resultList);
    }

    onError(error, deferedResult) {
        deferedResult.reject(error);
        console.log(error);
    }

    onAbort(error, deferedResult) {
        deferedResult.reject(error);
        console.log(error);
    }
}
