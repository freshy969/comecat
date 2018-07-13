import PropTypes, { string } from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import * as actions from '../actions';

import * as config from '../lib/config';
import * as constant from '../lib/const';
import * as strings from '../lib/strings';
import * as util from '../lib/utils';

import user from '../lib/user';
import { store } from '../index';

import Base from './Base';

import Modals from '../components/Modals';
import SideBar from '../components/chat/SideBar';
import Header from '../components/chat/Header';
import History from '../components/chat/History';
import AvatarImage from '../components/AvatarImage';
import DateTime from '../components/DateTime';
import ReLogin from "../components/ReLogin";

import Usage from "../components/settings/Usage";
import Account from "../components/settings/Account";
import Payments from "../components/settings/Payments";

import logoPic from '../assets/img/logoCatBig.png';

class Settings extends Base {

    constructor() {
        super();
        this.lastSearchTimeout = null;
        this.page = 1;
        this.chatId = null;
    }


    state = {
        tab: 'usage'
    }

    static propTypes = {
    }

    componentDidMount = () => {

        if (typeof this.props.match.params.tab !== 'undefined') {

            this.tabClick(this.props.match.params.tab);

            const queryStr = this.props.routing.location.search;

            if (/result/.test(queryStr)) {

                if (/success/.test(queryStr)) {

                    this.props.showNiceAlert({
                        img: logoPic,
                        title: strings.SettingsAccountChangePlanSuccessTitle[user.lang],
                        message: strings.SettingsAccountChangePlanSuccessMessage[user.lang]
                    });

                    // get new subscription plan name
                    const splitText = queryStr.split(/plan=/);
                    if (splitText.length > 1) {
                        user.userData.subscription = splitText[1];
                        user.updateUserData(user.userData);
                    }


                } else {

                    // do nothing

                }

            }
        }

    }

    tabClick = (tabName) => {

        this.setState({
            tab: tabName
        })

        if (tabName == 'payment') {
            this.props.loadPayments();
        }
    }

    render() {

        if (!user.token) return <ReLogin />;

        let sideBarClass = "pace-done sidebar-folded";
        if (this.props.sidebarState)
            sideBarClass += " sidebar-open";

        let asideBarHolderClass = "layout-chat";
        if (this.props.historyBarState)
            asideBarHolderClass += " aside-open";

        return (

            <div className={sideBarClass} onClick={this.globalClick}>

                <SideBar />
                <Header />

                <main className={asideBarHolderClass}>

                    {this.props.isLoading ?
                        <div className="spinner-linear settings">
                            <div className="line"></div>
                        </div> : null
                    }

                    <History />

                    <header className="header bg-ui-general">
                        <div className="header-info form-type-line">
                            <h1 className="header-title">
                                <strong>{strings.SettingsTitle[user.lang]}</strong>
                            </h1>
                        </div>

                        <div className="header-action">
                            <nav className="nav">
                                <span className={classNames("nav-link", "cursor-pointer", { active: this.state.tab == 'usage' })} onClick={e => { this.tabClick('usage') }}>{strings.SettingsTabLabelUsage[user.lang]}</span>
                                <span className={classNames("nav-link", "cursor-pointer", { active: this.state.tab == 'account' })} onClick={e => { this.tabClick('account') }}>{strings.SettingsTabLabelAccount[user.lang]}</span>
                                <span className={classNames("nav-link", "cursor-pointer", { active: this.state.tab == 'payment' })} onClick={e => { this.tabClick('payment') }}>{strings.SettingsTabLabelPayments[user.lang]}</span>
                            </nav>
                        </div>

                    </header>

                    <div className="main-content settings">

                        {this.state.tab == 'usage' ? <Usage /> : null}
                        {this.state.tab == 'account' ? <Account /> : null}
                        {this.state.tab == 'payment' ? <Payments /> : null}

                    </div>

                </main>

                <Modals />

            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        isLoading: state.settings.loading,
        routing: state.routing
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
        hideProfileView: () => dispatch(actions.chatUI.hideProfileView()),

        showNiceAlert: (params) => dispatch(actions.notification.showNiceAlert(params)),
        loadPayments: () => dispatch(actions.settings.loadPayments()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings);
