import React from 'react';
import classes from './NewsFeedContainer.css';

const newsFeedContainer = (props) => {
    return (
        <div className={classes.newsFeedContainer}>
            {props.children}
        </div>
    )
}

export default newsFeedContainer