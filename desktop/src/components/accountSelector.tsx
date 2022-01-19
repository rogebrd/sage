import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { useSageContext } from "../data/provider";
import { Account } from "../types";
import SubdirectoryArrowRightOutlinedIcon from '@material-ui/icons/SubdirectoryArrowRightOutlined';
import { InputLabel, MenuItem, Select } from "@material-ui/core";

export interface AccountSelectorProps {
    value: string | undefined;
    onChange: (newValue: string) => void;
    includeChildAccounts: boolean;
    includeNoSelection: boolean;
}

export const AccountSelector: FunctionComponent<AccountSelectorProps> = ({value, onChange, includeChildAccounts, includeNoSelection}) => {
    const {state} = useSageContext();
    const [selectOptions, setSelectOptions] = useState<any[]>();

    useEffect(() => {
        let options = [];
        if(includeNoSelection){
            options.push({
                value: {undefined},
                label: "Select Account"
            })
        }

        state.accounts
            .filter((possibleParentAccount: Account) => !possibleParentAccount.parentAccountId)
            .sort()
            .map((account: Account) => {
                options.push({
                    value: account.id,
                    label: account.name
                })

                if (includeChildAccounts){
                    state.accounts
                        .filter((possibleChildAccount) => possibleChildAccount.parentAccountId && possibleChildAccount.parentAccountId === account.id)
                        .map((childAccount: Account) => {
                            options.push({
                                value: childAccount.id,
                                label: childAccount.name,
                                icon: <SubdirectoryArrowRightOutlinedIcon />
                            })
                        }) 
                }
            })
        setSelectOptions(options);
    }, []);

    return (
        <Select
            className="account-selector"
            value={value}
            label="account"
            onChange={(event: ChangeEvent<{ value: unknown }>, child) => onChange(event.target.value as string)}
        >
            {
                includeNoSelection ? 
                    (
                        <MenuItem value={undefined}>
                            Select Account
                        </MenuItem>
                    ) : null
            }
            {
                state.accounts
                    .filter((possibleParentAccount: Account) => !possibleParentAccount.parentAccountId)
                    .sort()
                    .map((account: Account) => [
                        <MenuItem key={account.id} value={account.id}>
                            {account.name}
                        </MenuItem>,
                        includeChildAccounts ? state.accounts
                                .filter((possibleChildAccount: Account) => possibleChildAccount.parentAccountId && possibleChildAccount.parentAccountId === account.id)
                                .map((childAccount: Account) => (
                                    <MenuItem key={childAccount.id} value={childAccount.id}>
                                        <SubdirectoryArrowRightOutlinedIcon />
                                        {childAccount.name}
                                    </MenuItem>
                                )) : null
                    ])
            }
        </Select>
    )
}