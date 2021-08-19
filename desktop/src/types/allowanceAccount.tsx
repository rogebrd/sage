import { AccountOptions, Account } from "./account";

export interface AllowanceAccountOptions extends AccountOptions {
    max: number;
}

export class AllowanceAccount extends Account implements AllowanceAccountOptions {
    max: number;

    constructor(options: AllowanceAccountOptions) {
        super(options)
        this.max = options.max;
    }

}