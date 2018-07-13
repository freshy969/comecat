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

import UnderConstruction from '../UnderConstruction';
import Loading from './ChatbotLoading';

class ChatbotConversation extends Component {

    static propTypes = {
    }

    state = {
        DFAccessToken: ""
    }

    componentWillUpdate = (newProps) => {

        if (newProps.dialogflow != this.props.dialogflow
            && newProps.dialogflow
            && newProps.dialogflow.settings) {

            this.setState({
                DFAccessToken: newProps.dialogflow.settings.accessToken,
            })

        }

        if (newProps.watson != this.props.watson
            && newProps.watson
            && newProps.watson.settings) {

            this.setState({
                WatsonUsername: newProps.watson.settings.username,
                WatsonPassword: newProps.watson.settings.pass,
                WatsonWorkspaceID: newProps.watson.settings.workspaceID,

            })

        }

    }

    saveDFSettings = () => {

        this.props.saveSettings(this.props.subtab, {
            accessToken: this.state.DFAccessToken
        })

    }

    saveWatsonSettings = () => {

        this.props.saveSettings(this.props.subtab, {
            username: this.state.WatsonUsername,
            pass: this.state.WatsonPassword,
            workspaceID: this.state.WatsonWorkspaceID
        })

    }

    render() {

        const facebookWebHookURL = "";

        return (

            <div className={classNames("row", { hidden: this.props.tab !== 'conversation' })}>

                <div className="col-3">
                    <ul className="list-group">
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'dialogflow' })} onClick={e => { this.props.subtabClick('dialogflow') }}>{strings.ChatbotDialogFlow[user.lang]}</li>
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'watson' })} onClick={e => { this.props.subtabClick('watson') }}>{strings.ChatbotWatson[user.lang]}</li>
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'witai' })} onClick={e => { this.props.subtabClick('witai') }}>{strings.ChatbotWitAi[user.lang]}</li>
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'chatbotsio' })} onClick={e => { this.props.subtabClick('chatbotsio') }}>{strings.ChatbotChatbotsIO[user.lang]}</li>
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'twyla' })} onClick={e => { this.props.subtabClick('twyla') }}>{strings.ChatbotTwyla[user.lang]}</li>
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'msgai' })} onClick={e => { this.props.subtabClick('msgai') }}>{strings.ChatbotMsgAI[user.lang]}</li>
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'chatteron' })} onClick={e => { this.props.subtabClick('chatteron') }}>{strings.ChatbotChatteron[user.lang]}</li>
                    </ul>
                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'dialogflow' })}>

                    <Loading />

                    <div className={classNames("card")}>

                        <h4 className="card-title">
                            <span className={classNames(
                                'mr-10',
                                'badge',
                                'badge-xl',
                                'badge-dot',
                                { 'badge-info': this.props.dialogflow && this.props.dialogflow.status == constant.IntegrationStateEnabled },
                                { 'badge-danger': this.props.dialogflow && this.props.dialogflow.status == constant.IntegrationStateDisabled },
                                { 'badge-warning': this.props.dialogflow && this.props.dialogflow.status == constant.IntegrationStateWaiting },
                            )
                            }></span>
                            {strings.ChatbotDialogFlowTitle[user.lang]}</h4>

                        <div className="card-body">

                            {this.props.dialogflow &&
                                this.props.dialogflow.status == constant.IntegrationStateDisabled &&
                                this.props.dialogflow.error &&
                                this.props.dialogflow.error.length > 0 ?

                                <div>
                                    <div className="callout callout-danger" role="alert">
                                        <h5>{strings.ConnectorErrorTitle[user.lang]}</h5>
                                        <p className="text-danger">{strings.ConnectorErrorText[user.lang]}</p>
                                    </div>
                                    <pre>
                                        {this.props.dialogflow.error}
                                    </pre>
                                </div> : null


                            }

                            <div className="form-group">
                                <label>{strings.ChatbotDFAccessToken[user.lang]}</label>
                                <input type="text" value={this.state.DFAccessToken} className="form-control" onChange={e => this.setState({ DFAccessToken: e.target.value })} />
                                <div className="invalid-feedback">{this.props.errorMessageWebHookURL}</div>
                            </div>

                            <div className="text-right button-container">
                                <button onClick={this.saveDFSettings} className="btn btn-label btn-primary">
                                    <label>
                                        <i className={classNames(
                                            'fa',
                                            { 'fa-save': !this.props.saving },
                                            { 'fa-spinner': this.props.saving },
                                            { 'fa-spin': this.props.saving },
                                        )}></i>
                                    </label>
                                    {strings.Save[user.lang]}
                                </button>
                            </div>

                        </div>

                    </div>

                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'watson' })}>

                    <Loading />

                    <div className={classNames("card")}>

                        <h4 className="card-title">
                            <span className={classNames(
                                'mr-10',
                                'badge',
                                'badge-xl',
                                'badge-dot',
                                { 'badge-info': this.props.watson && this.props.watson.status == constant.IntegrationStateEnabled },
                                { 'badge-danger': this.props.watson && this.props.watson.status == constant.IntegrationStateDisabled },
                                { 'badge-warning': this.props.watson && this.props.watson.status == constant.IntegrationStateWaiting },
                            )
                            }></span>
                            {strings.ChatbotWatsonTitle[user.lang]}</h4>

                        <div className="card-body">

                            {this.props.watson &&
                                this.props.watson.status == constant.IntegrationStateDisabled &&
                                this.props.watson.error &&
                                this.props.watson.error.length > 0 ?

                                <div>
                                    <div className="callout callout-danger" role="alert">
                                        <h5>{strings.ConnectorErrorTitle[user.lang]}</h5>
                                        <p className="text-danger">{strings.ConnectorErrorText[user.lang]}</p>
                                    </div>
                                    <pre>
                                        {this.props.watson.error}
                                    </pre>
                                </div> : null


                            }

                            <div className="form-group">
                                <label>{strings.ChatbotWatsonUsername[user.lang]}</label>
                                <input type="text" value={this.state.WatsonUsername} className="form-control" onChange={e => this.setState({ WatsonUsername: e.target.value })} />
                                <div className="invalid-feedback">{this.props.errorMessageWebHookURL}</div>
                            </div>

                            <div className="form-group">
                                <label>{strings.ChatbotWatsonPassword[user.lang]}</label>
                                <input type="text" value={this.state.WatsonPassword} className="form-control" onChange={e => this.setState({ WatsonPassword: e.target.value })} />
                                <div className="invalid-feedback">{this.props.errorMessageWebHookURL}</div>
                            </div>

                            <div className="form-group">
                                <label>{strings.ChatbotWatsonWorkspaceID[user.lang]}</label>
                                <input type="text" value={this.state.WatsonWorkspaceID} className="form-control" onChange={e => this.setState({ WatsonWorkspaceID: e.target.value })} />
                                <div className="invalid-feedback">{this.props.errorMessageWebHookURL}</div>
                            </div>

                            <div className="text-right button-container">
                                <button onClick={this.saveWatsonSettings} className="btn btn-label btn-primary">
                                    <label>
                                        <i className={classNames(
                                            'fa',
                                            { 'fa-save': !this.props.saving },
                                            { 'fa-spinner': this.props.saving },
                                            { 'fa-spin': this.props.saving },
                                        )}></i>
                                    </label>
                                    {strings.Save[user.lang]}
                                </button>
                            </div>

                        </div>

                    </div>

                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'witai' })}>
                    <UnderConstruction />
                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'chatbotsio' })}>
                    <UnderConstruction />
                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'twyla' })}>
                    <UnderConstruction />
                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'msgai' })}>
                    <UnderConstruction />
                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'chatteron' })}>
                    <UnderConstruction />
                </div>

            </div>

        );
    }

}

const mapStateToProps = (state) => {
    return {
        saving: state.chatbot.saving,
        tab: state.chatbot.tab,
        subtab: state.chatbot.subtab,
        settings: state.chatbot.settings,
        dialogflow: state.chatbot.dialogflow,
        watson: state.chatbot.watson
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        subtabClick: (tab) => dispatch(actions.chatbot.subtabClick(tab)),
        saveSettings: (tab, settings) => dispatch(actions.chatbot.saveSettings(tab, settings)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatbotConversation);
