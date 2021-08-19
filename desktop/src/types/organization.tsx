import { Account } from "./account";

export interface OrganizationOptions {
    id: string;
    name: string;
    accounts: Account[];
}

export class Organization implements OrganizationOptions {
    id: string;
    name: string;
    accounts: Account[];

    constructor(options: OrganizationOptions) {
        this.id = options.id;
        this.name = options.name;
        this.accounts = options.accounts;
    }
}