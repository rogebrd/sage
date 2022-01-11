import React, { FunctionComponent } from 'react';
import '../../styles/button.scss';

type ButtonProps = {
    text?: string;
    onClick?: any;
    className?: string;
};

export const Button: FunctionComponent<ButtonProps> = ({
    text,
    onClick,
    className,
}) => {
    return (
        <button onClick={onClick} className={className}>
            {text}
        </button>
    );
};
