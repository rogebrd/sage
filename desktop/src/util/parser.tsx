import { Account } from "../model/account";
import { Entry } from "../model/entry";
import { AccountCurrency, AccountType, EntryStyle } from "../model/enums";
import { Transaction } from "../model/transaction";

export const accountFromDynamoDB = (accountRaw: any): Account => {
    return new Account({
        id: accountRaw.AccountId.S,
        name: accountRaw.Name.S,
        type: AccountType[accountRaw.Type.S as keyof typeof AccountType],
        currency: AccountCurrency[accountRaw.Currency.S as keyof typeof AccountCurrency],
        category: accountRaw.Category?.S
    })
}

export const entryFromDynamoDB = (entryRaw: any): Entry => {
    console.log(entryRaw);
    console.log(entryRaw.Amount.N);
    console.log(Number.parseFloat(entryRaw.Amount.N));
    return new Entry({
        id: entryRaw.EntryId.S,
        accountId: entryRaw.AccountId.S,
        style: EntryStyle[entryRaw.Style.S as keyof typeof EntryStyle],
        amount: Number.parseFloat(entryRaw.Amount.S),
        date: new Date(entryRaw.Date.N),
        category: entryRaw.Category?.S,
        tags: entryRaw.Tags?.S,
        description: entryRaw.Description?.S,
    })
}

export const transactionFromDynamoDB = (transactionRaw: any): Transaction => {
    return new Transaction({
        id: transactionRaw.TransactionId.S,
        entryIds: transactionRaw.EntryIds.SS
    })
}