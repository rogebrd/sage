import React, { FunctionComponent } from "react";
import { Modal } from "./base/modal";
import { Button } from "./base/button";
import { Account } from "../types/account";

type AddAccountModalProps = {
    addAccountCallback: Function
}

export const AddAccountModal: FunctionComponent<AddAccountModalProps> = ({ addAccountCallback }) => {
    const [isVisible, setVisibility] = React.useState(false);
    const [newAccountName, setNewAccountName] = React.useState('');
    const [newAccountType, setNewAccountType] = React.useState('Cash');

    const addAccount = (event: any) => {
        event.preventDefault()
        let newAccount: Account = {
            id: 10,
            name: newAccountName,
            balance: 0.0,
            type: newAccountType
        }
        addAccountCallback(newAccount);
        clearState();
    }

    const clearState = () => {
        setVisibility(false);
        setNewAccountName('');
        setNewAccountType('Cash');
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
                        <select id="accountType" value={newAccountType.toString()} onChange={(change) => setNewAccountType(change.target.value)}>
                            <option value="Cash">Cash</option>
                            <option value="Investment">Investment</option>
                            <option value="Liability">Liability</option>
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