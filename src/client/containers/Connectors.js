import PropTypes, { string } from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classNames from 'classnames';

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

import ConnectorWeb from '../components/connector/ConnectorWeb';
import ConnectorSocial from '../components/connector/ConnectorSocial';
import ConnectorSpeaker from '../components/connector/ConnectorSpeaker';
import ConnectorOther from '../components/connector/ConnectorOther';

class Connectors extends Base {

    constructor() {
        super();
    }

    static propTypes = {
    }

    copyDone() {
        this.props.showToast(strings.ConnectorCopied[user.lang]);
    }

    componentDidMount() {
        this.props.initConnectorsView(user.userData);
        this.props.tabClick('web');
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


        return (

            <div className={sideBarClass} onClick={this.globalClick}>

                <SideBar />
                <Header />

                <main className={asideBarHolderClass}>

                    <History />

                    <header className="header bg-ui-general">
                        <div className="header-info form-type-line">
                            <h1 className="header-title">
                                <strong>{strings.ConnectorTitle[user.lang]}</strong>
                            </h1>
                        </div>
                        <div className="header-action">
                            <nav className="nav">
                                <span className={classNames("nav-link", "cursor-pointer", { active: this.props.tab == 'web' })} onClick={e => { this.props.tabClick('web') }}>{strings.ConnectorTabWeb[user.lang]}</span>
                                <span className={classNames("nav-link", "cursor-pointer", { active: this.props.tab == 'social' })} onClick={e => { this.props.tabClick('social') }}>{strings.ConnectorTabSocial[user.lang]}</span>
                                <span className={classNames("nav-link", "cursor-pointer", { active: this.props.tab == 'speaker' })} onClick={e => { this.props.tabClick('speaker') }}>{strings.ConnectorTabSmartSpeaker[user.lang]}</span>
                                <span className={classNames("nav-link", "cursor-pointer", { active: this.props.tab == 'other' })} onClick={e => { this.props.tabClick('other') }}>{strings.ConnectorTabOther[user.lang]}</span>
                            </nav>
                        </div>
                    </header>

                    <div className="main-content integration">

                        <ConnectorWeb />
                        <ConnectorSocial />
                        <ConnectorSpeaker />
                        <ConnectorOther />

                    </div>

                </main>

                <Modals />

            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        tab: state.connector.tab,
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

        initConnectorsView: (userData) => dispatch(actions.connector.initConnectorsView(userData)),
        showToast: (text) => dispatch(actions.notification.showToast(text)),
        tabClick: (tab) => dispatch(actions.connector.tabClick(tab)),
        subtabClick: (tab) => dispatch(actions.connector.subtabClick(tab)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Connectors);
