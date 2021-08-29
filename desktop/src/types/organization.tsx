import { Account, AccountType } from "./account";

export interface OrganizationOptions {
    id: string;
    name: string;
    primaryType: AccountType;
    accounts: Account[];
}

export class Organization implements OrganizationOptions {
    id: string;
    name: string;
    primaryType: AccountType;
    accounts: Account[];

    constructor(options: OrganizationOptions) {
        this.id = options.id;
        this.name = options.name;
        this.primaryType = options.primaryType;
        this.accounts = options.accounts;
    }

    getBalance() {
        let totalBalance: { [key: number]: number } = {};

        if (this.accounts) {
            for (let childAccount of this.accounts) {
                let childBalance = childAccount.getBalance();
                for (let [currency, balance] of Object.entries(childBalance)) {
                    let newBalance = 0;
                    if (totalBalance[Number.parseInt(currency)]) {
                        newBalance += totalBalance[Number.parseInt(currency)];
                    }
                    newBalance += balance;
                    totalBalance[Number.parseInt(currency)] = newBalance;
                }
            }
        }

        return totalBalance;
    }
}