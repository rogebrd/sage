import React, { FunctionComponent } from "react";
import { Modal } from "./base/modal";
import { Button } from "./base/button";

type AddAccountModalProps = {
}

export const AddAccountModal: FunctionComponent<AddAccountModalProps> = ({ }) => {
    const [isVisible, setVisibility] = React.useState(false);

    const addAccount = () => {
        // get account name and type and submit
        setVisibility(false);
    }

    return (
        <>
            <Button text="Add Account" onClick={() => setVisibility(true)} />
            <Modal
                title="Add Account"
                content={
                    <>
                        <input type="text"></input>
                        <input type="dropdown"></input>
                    </>
                }
                onSubmit={() => addAccount()}
                onCancel={() => setVisibility(false)}
                isVisible={isVisible}
            />
        </>
    );
}