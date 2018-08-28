import React from 'react';
import classes from './Header.css';

const header = (props) => {
    return (
        <div className={classes.header}>
            {props.children}
        </div>
    )
}

export default header;