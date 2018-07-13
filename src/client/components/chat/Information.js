import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import * as constant from "../../lib/const";
import * as actions from "../../actions";

import AvatarImage from "../AvatarImage";

import UserInfo from "./infoview/UserInfo";
import GroupInfo from "./infoview/GroupInfo";
import RoomInfo from "./infoview/RoomInfo";

class Information extends Component {
  static propTypes = {};

  //hidden-xs-down
  render() {
    let infoContainerClass = "info-container bg-lighter border-light ";
    if (this.props.infoViewState) infoContainerClass += " show";

    return (
      <div className={infoContainerClass}>
        {this.props.currentChatId ? (
          <div className="quickview-body ps-container ps-theme-default">
            {this.props.isLoading ? (
              <div className="spinner-linear">
                <div className="line" />
              </div>
            ) : null}

            <div className="card card-inverse bg-img">
              <div className="card-body pt-15 pb-15">

                <div className="row">
                  <div className="col-3 text-center pt-20">
                    <AvatarImage
                      className="avatar avatar-bordered"
                      fileId={this.props.chatAvatar.fileId}
                      type={this.props.chatAvatar.type}
                    />
                  </div>
                  <div className="col-9">
                    <h4 className="mt-2 mb-0 text-left">
                      <span className="text-white">
                        {this.props.chatAvatar.name}
                      </span>
                    </h4>
                    <p className="text-white">
                      {this.props.room.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {this.props.chatType == constant.ChatTypePrivate ? (
              <UserInfo />
            ) : null}
            {this.props.chatType == constant.ChatTypeGroup ? (
              <GroupInfo />
            ) : null}
            {this.props.chatType == constant.ChatTypeRoom ? <RoomInfo /> : null}
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    chatType: state.chat.chatType,
    chatAvatar: state.chat.chatAvatar,
    isLoading: state.infoView.isLoading,
    infoViewState: state.chatUI.infoViewState,
    currentChatId: state.chat.chatId,
    room: state.infoView.room,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Information);
