import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import Toast from '../components/Toast';
import * as actions from '../actions';

import comecatLogin from '../assets/img/comecatLogin.png';
import loginPic from '../assets/img/loginPic.jpg';

import * as util from '../lib/utils';
import * as constnat from '../lib/const';
import * as strings from '../lib/strings';
import * as config from '../lib/config';
import user from '../lib/user';

class Login extends Component {

    constructor({ match }) {
        super();
        this.activationCode = match.params.code;
    }

    static propTypes = {
    }

    handleLoginClick = (e) => {
        e.preventDefault();

        this.props.onLoginClick(
            this.props.organization,
            this.props.username,
            this.props.password,
            this.props.remember
        );
    }

    handleOrg = (v) => {
        this.props.onOrgChange(v);
    }

    handleUserName = (v) => {
        this.props.onUserNameChange(v);
    }

    handlePassword = (v) => {
        this.props.onPasswordChange(v);
    }

    handleRememberCheck = (v) => {
        this.props.onRememberCheck(v);
    }

    componentDidMount() {
        if (this.activationCode) {

            this.props.startCheckingActivationCode(this.activationCode);

        }
    }

    render() {

        if (user.token) {
            return <Redirect to={`${util.url('/chat')}`} />
        }


        return (
            <div className="row no-gutters min-h-fullscreen bg-white">

                <div className="col-md-6 col-lg-7 col-xl-8 d-none d-md-block bg-img" style={{ backgroundImage: `url(${loginPic})` }} data-overlay="5">

                    <div className="row h-100 pl-50">
                        <div className="col-md-10 col-lg-8 align-self-end">
                            <img src={comecatLogin} alt="..." />
                            <br />
                            <h4 className="text-white">{strings.EnterTitle1[user.lang]}</h4>
                            <p className="text-white">
                                {strings.EnterText1[user.lang]}
                            </p>
                            <br /><br />
                        </div>
                    </div>

                </div>

                <div className="col-md-6 col-lg-5 col-xl-4 align-self-center">

                    <div className="login-panel">
                        <h4>{strings.LoginTitle1[user.lang]}</h4>
                        <p><small>{strings.LoginText2[user.lang]}</small></p>
                        <br />

                        <form className="form-type-material" onSubmit={this.handleLoginClick}>

                            <div className="form-group">
                                <input type="text" className="form-control" placeholder={strings.LoginFormPlaceholderUsername[user.lang]}
                                    value={this.props.username}
                                    onChange={e => this.handleUserName(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <input type="password" className="form-control" placeholder={strings.LoginFormPlaceholderPassword[user.lang]}
                                    value={this.props.password}
                                    onChange={e => this.handlePassword(e.target.value)} />
                            </div>

                            <div className="form-group flexbox">
                                <label className="custom-control custom-checkbox" htmlFor="remember">
                                    <input id="remember" type="checkbox" className="custom-control-input"
                                        checked={this.props.remember}
                                        onChange={e => this.handleRememberCheck(e.target.checked)} />
                                    <span className="custom-control-indicator"></span>
                                    <span className="custom-control-description">{strings.LoginFormRemember[user.lang]}</span>
                                </label>
                                <Link to={config.BasePath + '/forget'} className="text-muted hover-primary fs-13" href="javascript:void(0)">{strings.LoginFormForgetPassword[user.lang]}</Link>
                            </div>

                            <div className="form-group">
                                <button className="btn btn-bold btn-block btn-primary" type="submit">
                                    {this.props.loadingLogin ? <i className="fa fa-spinner fa-spin fa-fw"></i> : null}
                                    {strings.LoginButtonTitle[user.lang]}
                                </button>
                            </div>

                        </form>

                        <hr className="w-30px" />

                        <p className="text-center text-muted fs-13 mt-20">{strings.LoginText3[user.lang]}<br />
                            &nbsp; <Link to={config.BasePath + '/signup'} className="text-primary fw-500">{strings.LoginLink1[user.lang]}</Link>
                        </p>
                    </div>
                </div>

                <Toast />

                {this.props.activationCheckingState ? <div
                    className="swal2-container swal2-fade swal2-shown"
                    style={{ "overflowY": "auto" }}>

                    <div className="swal2-modal swal2-show"
                        style={{
                            "width": "500px",
                            "padding": "20px",
                            "background": "rgb(255, 255, 255)",
                            "display": "block",
                        }}>

                        {this.props.activationCheckingState == 2 ? <div className="swal2-icon swal2-success swal2-animate-success-icon" style={{ "display": "block" }}>
                            <div className="swal2-success-circular-line-left" style={{ "background": "rgb(255, 255, 255)" }}></div>
                            <span className="swal2-success-line-tip swal2-animate-success-line-tip"></span>
                            <span className="swal2-success-line-long swal2-animate-success-line-long"></span>
                            <div className="swal2-success-ring"></div>
                            <div className="swal2-success-fix" style={{ "background": "rgb(255, 255, 255)" }}></div>
                            <div className="swal2-success-circular-line-right" style={{ "background": "rgb(255, 255, 255" }}></div>
                        </div> : null}

                        {this.props.activationCheckingState == 1 ? <div className="swal2-icon swal2-info" style={{ "display": "block" }}>i</div> : null}

                        {this.props.activationCheckingState == 1 ? <h2 className="swal2-title" id="swal2-title">{strings.LoginActivateState1Title[user.lang]}</h2> : null}
                        {this.props.activationCheckingState == 1 ? <div id="swal2-content" className="swal2-content" style={{ "display": "block" }}>{strings.LoginActivateState1Text[user.lang]}</div> : null}

                        {this.props.activationCheckingState == 2 ? <h2 className="swal2-title" id="swal2-title">{strings.LoginActivateState2Title[user.lang]}</h2> : null}
                        {this.props.activationCheckingState == 2 ? <div id="swal2-content" className="swal2-content" style={{ "display": "block" }}>{strings.LoginActivateState2Text[user.lang]}</div> : null}

                        {this.props.activationCheckingState == 5 ? <h2 className="swal2-title" id="swal2-title">{strings.LoginActivateState5Title[user.lang]}</h2> : null}
                        {this.props.activationCheckingState == 5 ? <div id="swal2-content" className="swal2-content" style={{ "display": "block" }}>{strings.LoginActivateState5Text[user.lang]}</div> : null}

                        {this.props.activationCheckingState > 1 ? <div className="swal2-buttonswrapper" style={{ "display": "block" }}>
                            <button type="button" className="swal2-confirm btn btn-bold btn-primary" onClick={this.props.checkCodeDone}>OK</button>
                        </div> : null}

                    </div>
                </div> : null}

            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        loadingLogin: state.login.loadingLogin,
        organization: state.login.organization,
        username: state.login.username,
        password: state.login.password,
        remember: state.login.remember,
        activationCheckingState: state.login.activationCheckingState
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoginClick: (org, username, password, remember) => dispatch(actions.login.onLoginClick(org, username, password, remember)),
        onOrgChange: (v) => dispatch(actions.login.onOrgChange(v)),
        onUserNameChange: (v) => dispatch(actions.login.onUserNameChange(v)),
        onPasswordChange: (v) => dispatch(actions.login.onPasswordChange(v)),
        onRememberCheck: (v) => dispatch(actions.login.onRememberCheck(v)),

        startCheckingActivationCode: (code) => dispatch(actions.login.checkActivationCode(code)),
        checkCodeDone: () => dispatch(actions.login.checkCodeDone()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
