import { Button, Modal } from "@material-ui/core";
import React, { FunctionComponent, useState } from "react";
import { Card } from "./base/card";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';

type StockAmountModalProps = {
    visible: boolean,
    setVisible: Function,
    setAmountCallback: Function
}

export const StockAmountModal: FunctionComponent<StockAmountModalProps> = ({ visible, setVisible, setAmountCallback }) => {
    const [symbol, setSymbol] = useState("");
    const [quantity, setQuantity] = useState(0.0);
    const [unitPrice, setUnitPrice] = useState(0.0);

    return (
        <Modal
            className="modal"
            open={visible}
        >
            <div className="modal__content">
                <Card>
                    <span className="modal__content--header">
                        <h1>Stock Amount</h1>
                        <Button onClick={() => setVisible(false)}><CloseOutlinedIcon /></Button>
                    </span>
                    <span className="modal__content--input">
                        <table>
                            <thead>
                                <td><h2>Symbol *</h2></td>
                                <td><h2>Quantity *</h2></td>
                                <td><h2>Unit Price*</h2></td>
                                <td></td>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input type="text" value={symbol} onChange={(event) => setSymbol(event.target.value)}></input>
                                    </td>
                                    <td>
                                        <input type="number" value={quantity} onChange={(event) => setQuantity(Number.parseFloat(event.target.value))}></input>
                                    </td>
                                    <td>
                                        <input type="number" value={unitPrice} onChange={(event) => setUnitPrice(Number.parseFloat(event.target.value))}></input>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </span>
                    <Button className="modal__addAccount__content--submit" onClick={() => setAmountCallback({ symbol: symbol, quantity: quantity, unitPrice: unitPrice })}><h2>Set Amount</h2></Button>
                </Card>
            </div>
        </Modal >
    );
}