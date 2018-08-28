import React from "react";
import classes from "./Login.css";
import Loader from '../../components/UI/Loader/Loader';
import Header from '../../components/UI/Header/Header';

const loginTemplate = (props) => {

    var actionContent = props.state.login ? (
        <div className={classes.loginForm}>
            <div className={classes.form_header}>
                <h3>Log In</h3>
            </div>
            <div className='form-group'>
                <div className={classes.formGroup__haeder}>
                    <label >Phone Num:</label>
                </div>
                <div>
                    <input type="number" className={classes.formControl} id="phone" />
                </div>
            </div>
            <div className="form-group">
                <div className={classes.formGroup__haeder}>
                    <label >Password:</label>
                </div>
                <div>
                    <input type="password" className={classes.formControl} id="pwd" />
                </div>
            </div>
            <div className="checkbox">
                <label><input type="checkbox" /> Remember me</label>
            </div>
            <button
                className={classes.btnSubmit}
                onClick={props.submitLogin}>Log In</button>
        </div>
    ) : (
            <div className={classes.loginForm}>
                <div className={classes.form_header}>
                    <h3>Sign Up</h3>
                </div>
                <div className='form-group'>
                    <div className={classes.formGroup__haeder}>
                        <label >Name:</label>
                    </div>
                    <div>
                        <input type="name" className={classes.formControl} id="name" />
                    </div>
                </div>
                <div className='form-group'>
                    <div className={classes.formGroup__haeder}>
                        <label >Phone Num:</label>
                    </div>
                    <div>
                        <input type="number" className={classes.formControl} id="phone" />
                    </div>
                </div>
                <div className='form-group'>
                    <div className={classes.formGroup__haeder}>
                        <label >Email address:</label>
                    </div>
                    <div>
                        <input type="email" className={classes.formControl} id="email" />
                    </div>
                </div>
                <div className="form-group">
                    <div className={classes.formGroup__haeder}>
                        <label >Password:</label>
                    </div>
                    <div>
                        <input type="password" className={classes.formControl} id="pwd" />
                    </div>
                </div>
                <div className="checkbox">
                    <label><input type="checkbox" /> Remember me</label>
                </div>
                <button
                    className={classes.btnSubmit}
                    onClick={props.subitSignup}>Sign Up</button>
            </div>
        )
    var loader = <Loader margin='10rem' />
    return (

        <div className={classes.login}>
            <Header>
                <div className={classes.title}>
                    Demo App
                </div>
                <div className={classes.actions}>
                    <button
                        className={props.login_liClasses}
                        onClick={props.selectAction.bind(this, "LOG_IN")}>Log in</button>
                    <button
                        className={props.signup_liClasses}
                        onClick={props.selectAction.bind(this, 'SIGN_UP')}>Sign up</button>
                </div>
            </Header>
            <div className={classes.login_box}>
                {props.state.loading ? loader : actionContent}
            </div>
        </div>
    )
}

export default loginTemplate;