import { Component } from 'react';
import NewsFeedTemplate from './NewsFeed.jsx';


class NewsFeed extends Component {
    render() {
        var template = NewsFeedTemplate(this);
        return template
    }
}

export default NewsFeed;