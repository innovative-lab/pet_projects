import { Component } from 'react';
import axios from '../../axios';
import LoginTemplate from './Login.jsx';
import errorHandler from '../../hoc/ErrorHandler/ErrorHandler';

import classes from "./Login.css";
import classNames from 'classnames';

class Login extends Component {
    constructor() {
        super();
        this.message = "working";
    }
    state = {
        login: true,
        signup: false,
        loading: false
    }
    componentDidMount() {
        console.log(this.props);
    }
    selectAction = (actionType) => {

        console.log("actionType", actionType);
        if (actionType === 'SIGN_UP') {
            this.setState({
                signup: true,
                login: false
            })

        } else if (actionType === 'LOG_IN') {
            this.setState({
                login: true,
                signup: false
            })
        }
    }
    applyCssToActionButton = () => {
        var liClasses = classNames({
            [classes.btnSubmit]: true,
            [classes.login_btn]: true
        });
        this.login_liClasses = classNames({
            [liClasses]: true,
            [classes.active]: this.state.login ? true : false
        })
        this.signup_liClasses = classNames({
            [liClasses]: true,
            [classes.active]: this.state.signup ? true : false
        })
    }
    submitLogin = () => {
        this.setState({
            loading: true
        })
        var data = {
            phone: document.getElementById('phone').value,
            password: document.getElementById('pwd').value,
            tosAgreement: true
        };
        axios.get('login?phone=' + data.phone + '&pass=' + data.password)
            .then(response => {
                if (response.status == 200 && response.data) {
                    console.log('signup response', response);
                    this.setState({
                        loading: false
                    });
                    this.props.history.push('/main');
                }
            })
            .catch(error => {
                this.props.history.push('/unavialable');
            });


    }
    subitSignup = () => {
        this.setState({
            loading: true
        })
        var data = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            password: document.getElementById('pwd').value,
            tosAgreement: true
        };
        axios.post('signup', data)
            .then(response => {
                console.log('signup response', response);
                this.setState({
                    loading: false
                });
                this.props.history.push('/main');
            });
    }
    render() {
        this.applyCssToActionButton();
        var template = null;
        template = LoginTemplate(this);
        return template;
    }
}

export default errorHandler(Login, axios);