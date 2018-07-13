import PropTypes, { string } from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classNames from 'classnames';
import hljs from 'highlight.js';

import * as actions from '../actions';

import * as constant from '../lib/const';
import * as strings from '../lib/strings';
import * as util from '../lib/utils';
import * as config from '../lib/config';

import user from '../lib/user';
import { store } from '../index';

import Base from './Base';

import Modals from '../components/Modals';
import SideBar from '../components/chat/SideBar';
import Header from '../components/chat/Header';
import History from '../components/chat/History';
import AvatarImage from '../components/AvatarImage';
import DateTime from '../components/DateTime';

class APIWebhook extends Base {

    constructor() {
        super();

    }

    static propTypes = {
    }

    componentDidMount() {
        this.props.initView(user.userData);
    }

    componentWillUnmount() {
    }


    render() {

        let sideBarClass = "pace-done sidebar-folded";
        if (this.props.sidebarState)
            sideBarClass += " sidebar-open";

        let asideBarHolderClass = "layout-chat";
        if (this.props.historyBarState)
            asideBarHolderClass += " aside-open";

        let defaultHomepageConnectorURL = "";

        if (this.props.defaultConnector) {
            defaultHomepageConnectorURL = config.serverBase + "/c/?c=" + this.props.defaultConnector.code;
        }

        let defaultWebConnectorJS = "";

        if (this.props.defaultConnector) {
            const defaultWebConnectorURL = config.serverBase + "/c/l/loader.js?code=" + this.props.defaultConnector.code;
            defaultWebConnectorJS = `<script type="text/javascript" id="comecat" src="${defaultWebConnectorURL}" ></script>`;
        }

        const nodejsTutorial = "const express = require('express');\nconst bodyParser = require('body-parser');\nvar request = require('request');\nconst app = express();\napp.use(bodyParser.urlencoded({ extended: true }));\napp.use(bodyParser.json());\n\napp.post('/', (req, res) => {\n\n    const roomID = req.body.room.id;\n    const userName = req.body.sender.name;\n    const isGuest = req.body.sender.isGuest == 1;\n\n    const serverUrl = 'http://localhost:8080/api/v3/cc/send';\n    const apiKey = 'GtZX9bkKKiWpJKauL06ugOCZS2BwrJEY';\n\n    if(!isGuest)\n        return;\n\n    request.post({\n        headers: {\n            'apikey': apiKey,\n        },\n        uri: serverUrl,\n        body: { \n            roomID: roomID,\n            message: 'Hi ' + userName\n        },\n        json: true,\n        method: 'POST'\n    }, (err, res, body) => {\n\n        console.log(body);\n        \n    });\n\n});\n\napp.listen(3003, () => console.log('Example app listening on port 3003!'));\n\n";
        const nodejsHighLight = hljs.highlight("javascript", nodejsTutorial).value
            .replace(/\r/g, "<br />")
            .replace(/\n/g, "<br />")
            .replace(/  /g, "&nbsp;&nbsp;")
            .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
        ;


        return (

            <div className={sideBarClass} onClick={this.globalClick}>

                <SideBar />
                <Header />

                <main className={asideBarHolderClass}>

                    {this.props.isLoading ?
                        <div className="spinner-linear">
                            <div className="line"></div>
                        </div> : null
                    }

                    <History />

                    <header className="header bg-ui-general">
                        <div className="header-info form-type-line">
                            <h1 className="header-title">
                                <strong>{strings.APITitle[user.lang]}</strong>
                                <small>{strings.APISubTitle[user.lang]}</small>
                            </h1>
                        </div>
                        <div className="header-action">
                            <nav className="nav">
                                <span className={classNames("nav-link", "cursor-pointer", { active: this.props.tab == 'api' })} onClick={e => { this.props.tabClick('api') }}>{strings.APIHeaderMenuAPI[user.lang]}</span>
                                <span className={classNames("nav-link", "cursor-pointer", { active: this.props.tab == 'webhook' })} onClick={e => { this.props.tabClick('webhook') }}>{strings.APIHeaderMenuWebhook[user.lang]}</span>
                                {/*
                                    <span className={classNames("nav-link", "cursor-pointer", { active: this.props.tab == 'tutorial' })} onClick={e => { this.props.tabClick('tutorial') }}>{strings.APIHeaderMenuTutorial[user.lang]}</span>
                                    <span className={classNames("nav-link", "cursor-pointer", { active: this.props.tab == 'nodejs' })} onClick={e => { this.props.tabClick('nodejs') }}>{strings.APIHeaderMenuNodeJS[user.lang]}</span>
                                */}
                            </nav>
                        </div>

                    </header>

                    <div className="main-content integration">

                        <div className="col-12 pt-15">

                            <div className={classNames("card", { hidden: this.props.tab !== 'api' })} >

                                <div className="alert alert-success" role="alert">
                                    <h4 className="alert-heading">Hire Us</h4>
                                    We can develop your custome chatbot to help your business from $499 !<br />
                                    Please <a href="mailto:info@clover-studio">conatct us</a>.
                                </div>

                                <div className="card-body">

                                    <p>
                                        {strings.APIAPIExplnation[user.lang]}
                                        <a target="_blank" className="help" href="https://doc.come.cat/5_apiwebhook/1_API">
                                            <i className="fa fa-question-circle"></i>
                                        </a>
                                    </p>

                                    <div className="bg-lightest b-1 border-primary  p-15 fs-20 fw-500 row">

                                        <div className="col-9 apikey-container">
                                            {this.props.apiKey}
                                        </div>

                                        <div className="col-3 text-right">

                                            <button className="btn btn-label btn-danger" onClick={this.props.resetApiKey} >
                                                <label><i className={classNames(
                                                    'fa',
                                                    { 'fa-refresh': !this.props.isLoadingReset },
                                                    { 'fa-spinner': this.props.isLoadingReset },
                                                    { 'fa-spin': this.props.isLoadingReset },
                                                )}></i></label>
                                                {strings.APIAPIReset[user.lang]}
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className={classNames("card", { hidden: this.props.tab !== 'webhook' })}  >


                                <div className="alert alert-success" role="alert">
                                    <h4 className="alert-heading">Hire Us</h4>
                                    We can develop your custome chatbot to help your business from $499 !<br />
                                    Please <a href="mailto:info@clover-studio">conatct us</a>.
                                </div>


                                <div className="card-body">

                                    <p>
                                        {strings.APIWebHookExplnation[user.lang]}
                                        <a target="_blank" className="help" href="https://doc.come.cat/5_apiwebhook/2_webhook">
                                            <i className="fa fa-question-circle"></i>
                                        </a>
                                    </p>

                                    <div className="form-group">
                                        <label>{strings.APIWebhookReset[user.lang]}</label>
                                        <input type="text" value={this.props.webhookURL} className="form-control" onChange={e => { this.props.typeURL(e.target.value) }} />
                                        <div className="invalid-feedback">{this.props.errorMessageWebHookURL}</div>
                                    </div>

                                    <div className="text-right button-container">
                                        <button onClick={this.props.saveWebhook} className="btn btn-label btn-primary">
                                            <label>
                                                <i className={classNames(
                                                    'fa',
                                                    { 'fa-save': !this.props.isSavingWebhook },
                                                    { 'fa-spinner': this.props.isSavingWebhook },
                                                    { 'fa-spin': this.props.isSavingWebhook },
                                                )}></i>
                                            </label>
                                            {strings.Save[user.lang]}
                                        </button>
                                    </div>

                                </div>

                            </div>

                            <div className={classNames("card", { hidden: this.props.tab !== 'tutorial' })} >

                                <div className="card-body">
                                    <h4> 1. Setup server </h4>

                                    <p> Please setup server which has global DNS or global IP Address. </p>
                                </div>

                            </div>

                            <div className={classNames("card", { hidden: this.props.tab !== 'nodejs' })} >

                                <div className="card-body">

                                    <pre className="line-numbers">
                                        <code className="language-javascript" dangerouslySetInnerHTML={{ __html: nodejsHighLight }}></code>
                                    </pre>

                                </div>
                            </div>

                        </div>

                    </div>

                </main>

                <Modals />

            </div >
        );
    }

}

const mapStateToProps = (state) => {
    return {
        tab: state.api.tab,
        isLoading: state.api.loading,
        isLoadingReset: state.api.resetLoading,
        apiKey: state.api.apiKey,
        webhookURL: state.api.webhookURL,
        errorMessageWebHookURL: state.api.errorMessageWebHookURL,
        isSavingWebhook: state.api.isSavingWebhook,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        hideNotifications: () => dispatch(actions.chatUI.hideNotification()),
        hideUsersView: () => dispatch(actions.chatUI.hideUsersView()),
        hideGroupsView: () => dispatch(actions.chatUI.hideGroupsView()),
        hideStickersView: () => dispatch(actions.chatUI.hideStickersView()),
        hideSidebar: () => dispatch(actions.chatUI.hideSidebar()),
        hideHistory: () => dispatch(actions.chatUI.hideHistory()),

        tabClick: (tab) => dispatch(actions.api.tabClick(tab)),
        initView: (user) => dispatch(actions.api.loadInitialData(user)),
        resetApiKey: () => dispatch(actions.api.resetApiKey()),

        typeURL: (v) => dispatch(actions.api.typeURL(v)),
        saveWebhook: () => dispatch(actions.api.save()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(APIWebhook);
