import React, { Component } from 'react';
import MainTemplate from './Main.jsx';
import axios from '../../axios';

class Main extends Component {
    state = {
        baseLocation: '/main',
        navigateTo: null,
        userInfo: {
            name: null,
            email: null,
            phone: null
        }
    }
    componentWillMount() {
        if (this.props.location.pathname === this.state.baseLocation) {
            this.setState({
                navigateTo: '/main/news-feed'
            })
            this.props.history.push('/main/news-feed');
        } else {
            this.setState({
                navigateTo: this.props.location.pathname
            })
        }
    }

    componentWillUpdate() {
        if (this.state.navigateTo !== this.props.history.location.pathname) {
            this.setState({
                navigateTo: this.props.location.pathname
            });
        }
    }
    componentDidMount() {
        axios.get('main?phone=1122112211')
            .then(res => {
                if (res.status == 200 && res.data) {
                    this.setState({
                        ...this.state,
                        userInfo: {
                            name: res.data.name,
                            phone: res.data.phone,
                            email: res.data.email
                        }
                    })
                }
            })
            .catch(err => {
                console.log('error', err);
            })
    }
    render() {
        // this.checkLocationToNavigate();
        var mainTemplate = MainTemplate(this);
        return mainTemplate;
    }
}

export default Main;