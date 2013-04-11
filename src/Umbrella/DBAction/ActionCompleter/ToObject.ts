export class ToObject {
    onSuccess(resultList, deferedResult) {
        deferedResult.resolve(resultList[0]);
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
