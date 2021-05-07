import React, { FunctionComponent } from "react";

type AccountProps = {
    accountName: string
}

export const Account: FunctionComponent<AccountProps> = ({ accountName }) => {
    return (
        <li>
            {accountName}
        </li>
    );
}