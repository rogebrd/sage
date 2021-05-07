import React, { FunctionComponent } from "react";
import { Account } from "./account";

type AccountTableProps = {
    accountName: string
}

export const AccountTable: FunctionComponent<AccountTableProps> = ({ accountName }) => {
    return (
        <div>
            <h2>
                Accounts
            </h2>
            <ul>
                <Account accountName={accountName} />
                <Account accountName={accountName} />
                <Account accountName={accountName} />
                <Account accountName={accountName} />
            </ul>
        </div>
    );
}