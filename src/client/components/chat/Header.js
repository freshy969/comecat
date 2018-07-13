import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as strings from "../../lib/strings";
import * as actions from '../../actions';
import * as constant from "../../lib/const";
import * as utils from "../../lib/utils";

import spikaLogoPic from '../../assets/img/logoLight.png';

import UserList from './UserList';
import GroupList from './GroupList';
import Notification from './Notification';


import user from "../../lib/user";

import AvatarImage from "../AvatarImage";


class Header extends Component {

    constructor() {
        super();
        this.initialUserListLoaded = false;
        this.initialGroupsLoaded = false;
    }

    static propTypes = {
    }

    toggleUsersView = (e) => {
        if (!this.props.usersViewState) {
            this.props.showUsersView();

            if (!this.initialUserListLoaded) {
                this.props.loadUserList(1);
                this.initialUserListLoaded = true;
            }

        }
        else
            this.props.hideUsersView();
    }

    toggleGroupsView = (e) => {
        if (!this.props.groupsViewState) {
            this.props.showGroupsView();

            if (!this.initialGroupsLoaded) {
                this.props.loadGroupList(1);
                this.initialGroupsLoaded = true;
            }

        }
        else
            this.props.hideGroupsView();
    }

    tuggleSidebar = (e) => {

        if (this.props.sidebarState)
            this.props.hideSidebar();
        else
            this.props.showSidebar();

    }

    toggleInfoView = (e) => {

        if (this.props.infoViewState)
            this.props.hideInfoView();
        else
            this.props.showInfoView();

    }

    toggleUserProfile = (e) => {

        if (this.props.profileViewState)
            this.props.hideProfileView();
        else
            this.props.showProfileView();

    }

    render() {

        let fileId = "";
        if (
            user.userData &&
            user.userData.avatar &&
            user.userData.avatar.thumbnail
        ) {
            fileId = user.userData.avatar.thumbnail.nameOnServer;
        } else {
            fileId = user.userData._id;
        }


        let usersViewClass = "quickview";
        if (this.props.usersViewState)
            usersViewClass += " reveal";

        let groupsViewClass = "quickview";
        if (this.props.groupsViewState)
            groupsViewClass += " reveal";


        let profileViewClass = "avatar-dropdown dropdown-menu dropdown-menu-right";
        if (this.props.profileViewState)
            profileViewClass += " show";

        return (

            <header className="topbar">

                <div className="topbar-left">
                    <span onClick={this.tuggleSidebar} className="topbar-btn sidebar-toggler">
                        <i className="sidebar-icon">&#9776;</i></span>
                </div>

                <div className="topbar-right">

                    <a className="topbar-btn hidden-sm-up" onClick={this.toggleInfoView}>
                        <i className="fa fa-info-circle"></i>
                    </a>

                    <div className="topbar-divider hidden-sm-up"></div>

                    <a className="topbar-btn" onClick={this.toggleUserProfile}>
                        <AvatarImage fileId={fileId} type={constant.AvatarUser} />
                    </a>
                    <div className={profileViewClass}>
                        {user.userData.sandbox ?
                            <div className="sandbox dropdown-item"> Sandbox Mode </div> : null
                        }
                        <Link to={`${utils.url("/profile")}`} className="dropdown-item">
                            <i className="ti-user"></i>  {strings.SidebarProfile[user.lang]}
                        </Link>
                        <Link to={`${utils.url("/settings")}`} className="dropdown-item">
                            <i className="ti-settings"></i> {strings.SidebarSettings[user.lang]}
                        </Link>
                        <div className="dropdown-divider"></div>
                        <Link to={`${utils.url("/logout")}`} className="dropdown-item">
                            <i className="ti-power-off"></i> {strings.SidebarLogout[user.lang]}
                        </Link>
                    </div>

                    <a className="topbar-btn" onClick={this.toggleUsersView}><i className="fa fa-user"></i></a>
                    <div className={usersViewClass}>
                        <UserList />
                    </div>

                    {/*
                    <a className="topbar-btn" onClick={this.toggleGroupsView}><i className="fa fa-users"></i></a>
                    <div className={groupsViewClass}>
                        <GroupList />
                    </div>

                    <div className="topbar-divider"></div>
                    */}

                    <ul className="topbar-btns">
                        <Notification />
                    </ul>

                </div >

            </header >

        );
    }

}

const mapStateToProps = (state) => {
    return {
        usersViewState: state.chatUI.usersViewState,
        groupsViewState: state.chatUI.groupsViewState,
        sidebarState: state.chatUI.sidebarState,
        infoViewState: state.chatUI.infoViewState,
        profileViewState: state.chatUI.profileViewState
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showUsersView: () => dispatch(actions.chatUI.showUsersView()),
        hideUsersView: () => dispatch(actions.chatUI.hideUsersView()),
        showGroupsView: () => dispatch(actions.chatUI.showGroupsView()),
        hideGroupsView: () => dispatch(actions.chatUI.hideGroupsView()),
        loadUserList: page => dispatch(actions.userlist.loadUserList(page)),
        loadGroupList: page => dispatch(actions.grouplist.loadGroupList(page)),
        showSidebar: () => dispatch(actions.chatUI.showSidebar()),
        hideSidebar: () => dispatch(actions.chatUI.hideSidebar()),
        showInfoView: () => dispatch(actions.chatUI.showInfoView()),
        hideInfoView: () => dispatch(actions.chatUI.hideInfoView()),
        showProfileView: () => dispatch(actions.chatUI.showProfileView()),
        hideProfileView: () => dispatch(actions.chatUI.hideProfileView()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
