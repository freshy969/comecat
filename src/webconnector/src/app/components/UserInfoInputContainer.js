import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import classnames from 'classnames';
import * as actions from '../actions/index';
import * as config from '../lib/config';
import * as utils from '../lib/Utils';
import SocialContainer from './SocialContainer';

import loadingGif from '../../image/loading.gif';

class UserInfoInputContainer extends Component {

    constructor() {
        super();
    }

    state = {
        isSkipped: false,
        isSent: false,
        acceptPrivacyPolicy: false,
        privacyPolicyError: ""
    }

    componentDidMount = () => {

        if (localStorage["savedname"])
            this.props.typeName(localStorage["savedname"]);

        if (localStorage["savedemail"])
            this.props.typeEmail(localStorage["savedemail"]);

    }

    send = () => {

        if (this.props.loading)
            return;

        if (!this.state.acceptPrivacyPolicy) {

            this.setState({
                privacyPolicyError: "Please accept privacy policy. "
            });

            return;
        }

        this.setState({
            isSent: true
        });

        const validation = {};
        const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (this.props.name.length == 0)
            validation.name = "Please input name.";
        else
            validation.name = "";

        if (this.props.email.length == 0)
            validation.email = "Please input email.";
        else if (!reEmail.test(this.props.email.toLowerCase()))
            validation.email = "Please input correct email.";
        else
            validation.email = "";

        if (validation.name.length == 0 &&
            validation.email.length == 0) {

            this.props.send(this.props.name, this.props.email);

        } else {
            this.props.validation(validation);
        }

    }

    skip = () => {

        if (this.props.loading)
            return;

        this.setState({
            isSkipped: true
        });

        this.props.skip();

    }

    render() {

        let nameFormClass = "input";
        if (this.props.nameError && this.props.nameError.length > 0)
            nameFormClass += " err";

        let emailFormClass = "input";
        if (this.props.emailError && this.props.emailError.length > 0)
            emailFormClass += " err";

        let mainClass = "nameinputform";
        if (this.props.hide)
            mainClass += " hide";

        return <div className={mainClass}>

            <h2>Welcome</h2>

            {utils.isMob() && Object.keys(this.props.connectors).length > 0 ?
                <div>
                    <p> Please select your favorite messenger to start chat with us.</p>

                    <SocialContainer />

                    <hr />

                    <h2> Or.. </h2>

                </div> : null}

            <p> Please input your name and email and start web chat with us.</p>

            <div className="form">
                <input type="text" name="name" className={nameFormClass} placeholder="Name" value={this.props.name} onChange={e => this.props.typeName(e.target.value)} />
                {this.props.validationError && this.props.validationError.name.length != 0 ? <small className="err">{this.props.validationError.name}</small> : null}
                <input type="text" name="email" className={emailFormClass} placeholder="Email" value={this.props.email} onChange={e => this.props.typeEmail(e.target.value)} />
                {this.props.validationError && this.props.validationError.email.length != 0 ? <small className="err">{this.props.validationError.email}</small> : null}

                <input type="checkbox" className="checkbox"
                    checked={this.state.acceptPrivacyPolicy}
                    onChange={e => { this.setState({ acceptPrivacyPolicy: !this.state.acceptPrivacyPolicy }) }} />

                Accept <a href="https://come.cat/privacypolicy" target="_blank">Privacy Policy</a><br />
                {this.state.privacyPolicyError.length != 0 ? <small className="err">{this.state.privacyPolicyError}</small> : null}

                <button className="button" onClick={this.send}>Send Your Info and Start Chat</button>
                {this.state.isSent && this.props.loading ? <img src={loadingGif} /> : null}
            </div>

            <hr style={{ "marginTop": "30px" }} />

            <h2> Or.. </h2>
            <p> You can chat with us without input your information.</p>
            <button className="button" onClick={this.skip} >Just Start Chat</button>
            {this.state.isSkipped && this.props.loading ? <img src={loadingGif} /> : null}
        </div >

    }

}

function mapStateToProps(state) {
    return {
        validationError: state.userform.validationResult,
        name: state.userform.name,
        email: state.userform.email,
        hide: state.userform.hide,
        loading: state.userform.loading,
        connectors: state.userform.connectors
    };
}

function mapDispatchToProps(dispatch) {
    return {
        typeName: text => dispatch(actions.userform.typeName(text)),
        typeEmail: text => dispatch(actions.userform.typeEmail(text)),
        validation: obj => dispatch(actions.userform.validation(obj)),
        skip: () => dispatch(actions.userform.skip()),
        send: (name, email) => dispatch(actions.userform.send(name, email)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserInfoInputContainer);


