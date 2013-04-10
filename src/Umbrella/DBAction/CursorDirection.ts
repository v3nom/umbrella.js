module DBAction {
    export class CursorDirection {
        private _optionMatrix = [['next', 'nextunique'], ['prev', 'prevunique']];
        private _reverse: number;
        private _unique: number;

        constructor() {
            this._reverse = 0;
            this._unique = 0;
        }

        set reverse(value: bool) {
            this._reverse = value ? 1 : 0;
        }

        set unique(value: bool) {
            this._unique = value ? 1 : 0;
        }

        get reverse(): bool {
            return this._reverse === 1;
        }

        get unique(): bool {
            return this._unique === 1;
        }

        getValue() {
            return this._optionMatrix[this._reverse][this._unique];
        }
    }
}