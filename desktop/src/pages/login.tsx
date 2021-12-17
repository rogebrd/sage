import { Button } from '@material-ui/core';
import React, { FunctionComponent, useState } from 'react';
import { client, setAuthHeader } from '../util/axios';

type LoginPageProps = {
    setPage: Function
}

export const LoginPage: FunctionComponent<LoginPageProps> = ({ setPage }) => {
    const [password, setPassword] = useState('');

    const login = () => {
        window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
            .then((digestedHash) => {
                const hashArray = Array.from(new Uint8Array(digestedHash));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                console.log(hashHex);
                client.post("/login", {
                    "login_sha": hashHex
                }).then((response) => {
                    setAuthHeader(response.data.access_token);
                    setPage("HOME");
                    setPassword('');
                });
            })
    }

    return (
        <div className="app">
            <div className="app__header">
                <h1 className="app__header__text">
                    Sage
                </h1>
            </div>
            <div className="app__content">
                <div className="app__content__login">
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    <Button onClick={login}>Login</Button>
                </div>
            </div>
        </div>
    )
}