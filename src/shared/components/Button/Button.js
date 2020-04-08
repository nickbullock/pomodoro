import React from 'react';
import './Button.scss';
import cs from 'classnames';

export const Button = ({ children, className, ...rest }) => {
    return (
        <button className={cs('button', className)} {...rest}>
            {children}
        </button>
    );
}