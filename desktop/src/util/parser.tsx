import { Account } from "../model/account";
import { Entry, StockAmount } from "../model/entry";
import { AccountCategory, AccountType, EntryStyle } from "../model/enums";
import { Transaction } from "../model/transaction";

export const accountFromDynamoDB = (accountRaw: any): Account => {
    return new Account({
        id: accountRaw.AccountId.S,
        name: accountRaw.Name.S,
        type: AccountType[accountRaw.Type.S as keyof typeof AccountType],
        category: AccountCategory[accountRaw.Category?.S as keyof typeof AccountCategory],
        parentAccountId: accountRaw.ParentAccountId?.S,
        maxValue: parseAmount(accountRaw.MaxValue?.S) as number
    })
}

export const entryFromDynamoDB = (entryRaw: any): Entry => {
    return new Entry({
        id: entryRaw.EntryId.S,
        accountId: entryRaw.AccountId.S,
        style: EntryStyle[entryRaw.Style.S as keyof typeof EntryStyle],
        amount: parseAmount(entryRaw.Amount.S),
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

const parseAmount = (amountString: string): number | StockAmount => {
    try {
        return Number.parseFloat(amountString);
    } catch (Execption) {
        const amountRaw = JSON.parse(amountString);
        return {
            quantity: amountRaw.quantity,
            unitPrice: amountRaw.unitPrice,
            symbol: amountRaw.symbol
        };
    }
}