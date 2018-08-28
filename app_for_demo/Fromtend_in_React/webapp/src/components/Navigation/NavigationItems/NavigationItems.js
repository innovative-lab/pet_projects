import React from 'react';

import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/main/news-feed" exact>News Feed</NavigationItem>
        <NavigationItem link="/main/profile"  exact>Profile</NavigationItem>
        <NavigationItem link="/main/rate"  exact>Rate It</NavigationItem>
    </ul>
);

export default navigationItems;