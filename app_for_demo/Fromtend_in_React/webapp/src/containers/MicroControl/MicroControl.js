import React, { Component } from 'react';

import classes from './MicroControl.css';
import profilePic from '../../assets/images/gandhi.jpg'

class MicroControl extends Component {
    render() {
        console.log(this.props);
        return (
            <div className={classes.MicroControl}>
                <div className={classes.Profile_header}>
                    <div className={classes.Profile_header__profile_pic}>
                        <img src={profilePic} />
                    </div>
                    <div className={classes.Profile_header__profile_desc}>
                        <span className={classes.Profile_header__profile_desc__name}>{this.props.userInfo.name}</span>
                        <span className={classes.Profile_header__profile_desc__email}>{this.props.userInfo.email}</span>
                        <span className={classes.Profile_header__profile_desc__phone}>Ph :{this.props.userInfo.phone}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default MicroControl;