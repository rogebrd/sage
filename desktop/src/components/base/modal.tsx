import React, { FunctionComponent } from "react";
import { Button } from "./button";
import "../../styles/modal.scss";

type ModalProps = {
    title: string,
    content: any,
    onSubmit: any,
    onCancel: any,
    isVisible: boolean
}

export const Modal: FunctionComponent<ModalProps> = ({ title, content, onSubmit, onCancel, isVisible }) => {
    return (
        <>
            { isVisible &&
                <div className="modal">
                    <h1 className="modal__header">{title}</h1>
                    <div className="modal__content">
                        {content}
                    </div>
                    <div className="modal__action">
                        <Button className="modal__action--submit" text="Submit" onClick={onSubmit} />
                        <Button className="modal__action--cancel" text="Cancel" onClick={onCancel} />
                    </div>
                </div >
            }
        </>
    );
}