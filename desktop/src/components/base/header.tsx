import React, { FunctionComponent } from 'react';
import '../../styles/header.scss';

type HeaderProps = {
    text: string;
};

export const Header: FunctionComponent<HeaderProps> = ({ text }) => {
    return (
        <div className="header">
            <h2 className="header__text">{text}</h2>
        </div>
    );
};
