import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import login from './containers/Login/Login';
import main from './containers/Main/Main';
import PageNotFound from './hoc/PageNotFound/PageNotFound';
import newsfeed from './containers/NewsFeed/NewsFeed';
import profile from './containers/Profile/Profile';
import rateIt from './containers/RateIt/RateIt';

const appRoute = (props) => {
    var redirect = props.location.pathname === "/" ?
        <Route path="/" exact component={login} />:
        <Route component={PageNotFound} />;
    return (
        < Switch >
            <Route path="/login" component={login} />
            <Route path="/main" component={main} />
            <Route path='/main/news-feed' exact component={newsfeed}/>
            <Route path="/main/profile" exact component={profile} />
            <Route path="/main/rate" exact component={rateIt} />

            <Route path='/unavialable' component={PageNotFound}/>         
            {redirect}
        </Switch >
    )
}

export default withRouter(appRoute);