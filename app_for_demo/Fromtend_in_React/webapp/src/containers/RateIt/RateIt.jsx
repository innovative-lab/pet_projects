import React from 'react';

import NewsFeedContainer from '../../components/UI/NewsFeedContainer/NewsFeedContainer';
import classes from './RateIt.css';

const Template = (scope) => {
    var items = scope.state.reviewCategories.map((item, index) => {
        return (
            <div className={classes.place}  key={index}>
                {item}
            </div>
        )
    })
    return (
        <NewsFeedContainer >
            <div className={classes.category}>
                <div className={classes.title}>Select Place</div>
                <div className={classes.categoryHolder}>
                    {items}
                </div>
            </div>
            <div className={classes.category}>
                <div className={classes.title}>Name</div>
                <div className={classes.categoryHolder}>
                    <input className={classes.input}/>
                </div>         
            </div>
            <div className={classes.category}>
                <div className={classes.title}>Location</div>
                <div className={classes.categoryHolder}>
                    <textarea className={classes.input}></textarea>
                </div>
            </div>
            <div className={classes.category}>
                <div className={classes.title}>Rating</div>
                <div className={classes.categoryHolder}>
                    <input className={classes.input}/>
                </div>
            </div>
        </NewsFeedContainer>
    )
};

export default Template;