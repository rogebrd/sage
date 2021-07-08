import React, { FunctionComponent } from "react";
import { Modal } from "./base/modal";
import { Button } from "./base/button";

type AddAccountModalProps = {
}

export const AddAccountModal: FunctionComponent<AddAccountModalProps> = ({ }) => {
    const [isVisible, setVisibility] = React.useState(false);
    const [newAccountName, setNewAccountName] = React.useState('');
    const [newAccountType, setNewAccountType] = React.useState('');

    const addAccount = (event: any) => {
        event.preventDefault()
        console.log(newAccountName);
        clearState();
    }

    const clearState = () => {
        setVisibility(false);
        setNewAccountName('');
        setNewAccountType('');
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