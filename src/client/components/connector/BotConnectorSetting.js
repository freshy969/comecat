import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classNames from 'classnames';

import * as actions from '../../actions';
import * as constant from '../../lib/const';
import * as strings from '../../lib/strings';
import * as util from '../../lib/utils';
import * as config from '../../lib/config';
import user from '../../lib/user';

import {
    callSaveBotForConnector
} from '../../lib/api/';

import robotIcon from "../../assets/img/roboticonBlack.svg";
import UnderConstruction from '../UnderConstruction';

class BotConnectorSetting extends Component {

    state = {
        saving: false,
        botId: ""
    }

    static propTypes = {
    }

    onChange = (botId) => {

        this.setState({
            saving: true,
            botId: botId
        });

        const connector = this.props.connector;

        if (!connector)
            return;

        callSaveBotForConnector(
            connector.connectorIdentifier,
            botId
        )
            .then((data) => {

                this.setState({
                    saving: false
                });


            }).catch((err) => {

                this.setState({
                    saving: false
                });


                console.error(err);

            });


    }

    componentDidUpdate = (newState) => {

        console.log("newState", newState);
        console.log("connector", this.props.connector);
        console.log("test", this.props.test);

        if (this.props.connector && newState.connector != this.props.connector) {

            this.setState({
                botId: this.props.connector.botId
            })

        }

    }

    render() {

        console.log('this.state.botId', this.state.botId);

        return (

            <div className={classNames("card")}>

                <h4 className="card-title">

                    <span className={classNames(
                        'mr-10',
                        'badge',
                        'badge-xl',
                        'badge-dot',
                        { 'badge-info': this.state.botId != "" },
                        { 'badge-danger': !this.state.botId || this.state.botId == "" }
                    )
                    }></span>

                    < img className="mr-10" src={robotIcon} style={{ width: "25px" }} />

                    {strings.ConnectorBotSettingsTitle[user.lang]}

                    <i className={classNames(
                        'fa',
                        { 'fa-spinner': this.state.saving },
                        { 'fa-spin': this.state.saving },
                    )}></i>

                </h4>

                <div className="card-body">

                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect1">{strings.ConnectorBotSettingsLabel[user.lang]}</label>
                        <select
                            value={this.state.botId}
                            className="form-control"
                            id="exampleFormControlSelect1"
                            onChange={(e) => this.onChange(e.target.value)}>

                            <option value="">{strings.ConnectorBotSettingsDisable[user.lang]}</option>
                            {this.props.chatbots.map(chatbot => {

                                let chatbotName = "";
                                if (chatbot.chatbotIdentifier == 'dialogflow') {
                                    chatbotName = strings.ChatbotDialogFlow[user.lang];
                                }
                                if (chatbot.chatbotIdentifier == 'watson') {
                                    chatbotName = strings.ChatbotWatson[user.lang];
                                }
                                if (chatbot.chatbotIdentifier == 'witai') {
                                    chatbotName = strings.ChatbotWitAi[user.lang];
                                }
                                if (chatbot.chatbotIdentifier == 'chatbotsio') {
                                    chatbotName = strings.ChatbotChatbotsIO[user.lang];
                                }
                                if (chatbot.chatbotIdentifier == 'twyla') {
                                    chatbotName = strings.ChatbotTwyla[user.lang];
                                }
                                if (chatbot.chatbotIdentifier == 'msgai') {
                                    chatbotName = strings.ChatbotMsgAI[user.lang];
                                }


                                return <option key={chatbot._id} value={chatbot._id}>{chatbotName}</option>
                            })}
                        </select>
                    </div>

                </div>

            </div >

        );
    }

}

const mapStateToProps = (state) => {
    return {
        chatbots: state.connector.chatbots
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        subtabClick: (tab) => dispatch(actions.connector.subtabClick(tab))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BotConnectorSetting);
