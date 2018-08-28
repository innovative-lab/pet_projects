import { Component } from 'react';
import Template from './RateIt.jsx';


class RateIt extends Component {
    state = {
        reviewCategories: ['Restaurant','Temple','Hill Station','Island','Pub','Theater','Movie','Tv show']
    }
    render() {
        var template = Template(this);
        return template
    }
}

export default RateIt;