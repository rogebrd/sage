export enum EntryStyle {
    DEBIT,
    CREDIT,
}

export enum AccountType {
    CASH,
    INVESTMENT,
    LIABILITY,
    POINT,
}

export enum AccountCategory {
    DAILY,
    SAVINGS,
    RETIREMENT,
    SPECIAL,
}

export const allEntryStyles = [EntryStyle.CREDIT, EntryStyle.DEBIT];
export const allAccountTypes = [
    AccountType.CASH,
    AccountType.INVESTMENT,
    AccountType.LIABILITY,
    AccountType.POINT,
];
export const allAccountCategories = [
    AccountCategory.DAILY,
    AccountCategory.SAVINGS,
    AccountCategory.RETIREMENT,
    AccountCategory.SPECIAL,
];
