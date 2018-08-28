import React from 'react';
import classes from './Card.css';
const Card = (props) => {
    var imageURL = props.data.imageURL;
    return (
        <span>
            <div className={classes.card}>
                {/* <div className={classes.card_head}>
                </div> */}
                <div className={classes.card_body}>
                    <div className={classes.card_body__title}>
                        {props.data.title}
                    </div>
                    <div className={classes.card_body__subject}>
                        {props.data.body}
                    </div>
                </div>
            </div>
        </span>
    )
}

export default Card;