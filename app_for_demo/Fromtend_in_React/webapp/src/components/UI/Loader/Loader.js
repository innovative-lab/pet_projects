import React from 'react';

import classes from './Loader.css';

const spinner = (props) => {
    return (
        <div style={{ textAlign: 'center', margin: props.margin }}>
            <div className={classes.ldsGrid}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    )
}

export default spinner;