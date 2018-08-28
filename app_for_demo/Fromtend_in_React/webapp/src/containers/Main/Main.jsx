import React from 'react';
import { NavLink } from 'react-router-dom';

import Header from '../../components/UI/Header/Header';
import classes from './Main.css';
import NewsFeed from '../NewsFeed/NewsFeed';
import Profile from '../Profile/Profile';
import Rate from '../RateIt/RateIt';
import MicroControl from '../MicroControl/MicroControl';
import NavigationItems from '../../components/Navigation/NavigationItems/NavigationItems';


const mainTemplate = (scope) => {
    console.log(scope);
    var viewToRender = null;
    switch(scope.state.navigateTo){
        case '/main/news-feed':
             viewToRender = <NewsFeed />;
             break;
        case '/main/profile':
             viewToRender = <Profile />;
             break;
        case '/main/rate':
             viewToRender = <Rate />;
             break;
    }
    return (
        <div className={classes.Main}>
            <Header >
                <div className={classes.NavigationLinks}>
                    <NavigationItems />
                </div>
            </Header >
            <div className={classes.mainContent}>
                <div className={classes.MicroControl}>
                    <MicroControl userInfo={scope.state.userInfo} />
                </div>
                <div className={classes.NewsFeed}>
                    {viewToRender}
                </div>
                <div></div>

            </div>
        </div>
    )
}

export default mainTemplate;

