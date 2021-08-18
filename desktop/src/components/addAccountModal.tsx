import React, { FunctionComponent } from "react";
import { Modal } from "./base/modal";
import { Button } from "./base/button";
import { Account, AccountCurrency, AccountType } from "../types/account";

type AddAccountModalProps = {
    addAccountCallback: Function
}

export const AddAccountModal: FunctionComponent<AddAccountModalProps> = ({ addAccountCallback }) => {
    const [isVisible, setVisibility] = React.useState(false);
    const [newAccountName, setNewAccountName] = React.useState('');
    const [newAccountType, setNewAccountType] = React.useState<string>(AccountType.CASH.toString());
    const [newAccountCurrency, setNewAccountCurrency] = React.useState<string>(AccountCurrency.USD.toString());

    const addAccount = (event: any) => {
        event.preventDefault()
        let newAccount: Account = new Account({
            id: "10",
            name: newAccountName,
            balance: 0.0,
            type: AccountType.CASH,
            currency: AccountCurrency.USD
        })
        addAccountCallback(newAccount);
        clearState();
    }

    const clearState = () => {
        setVisibility(false);
        setNewAccountName('');
        setNewAccountType(AccountType.CASH.toString());
        setNewAccountCurrency(AccountCurrency.USD.toString());
    }

    return (
        <>
            <Button text="Add Account" onClick={() => setVisibility(true)} />
            <Modal
                title="New Account"
                content={
                    <>
                        <label>Name: </label>
                        <input id="accountName" type="text" value={newAccountName} onChange={(change) => setNewAccountName(change.target.value)}></input>
                        <label>Type: </label>
                        <select id="accountType" value={newAccountType} onChange={(change) => setNewAccountType(change.target.value)}>
                            <option value={AccountType.CASH}>Cash</option>
                            <option value={AccountType.INVESTMENT}>Investment</option>
                            <option value={AccountType.LIABILITY}>Liability</option>
                        </select>
                        <select id="accountCurrency" value={newAccountCurrency} onChange={(change) => setNewAccountCurrency(change.target.value)}>
                            <option value={AccountCurrency.USD}>USD</option>
                            <option value={AccountCurrency.POINT}>POINT</option>
                        </select>
                    </>
                }
                onSubmit={addAccount}
                onCancel={clearState}
                isVisible={isVisible}
            />
        </>
    );
}