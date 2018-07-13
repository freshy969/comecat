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
import Loading from './ConnectorLoading';

import BotConnectorSetting from './BotConnectorSetting';

class ConnectorSocial extends Component {

    static propTypes = {
    }

    state = {
        facebookVerifyToken: "",
        facebookAccessToken: "",
        facebookPageName: "",
        lineID: "",
        lineSecret: "",
        lineAccessToken: "",
        viberURI: "",
        viberApiKey: "",
        kikApiKey: "",
        kikBotName: "",
        telegramAccessToken: "",
        telegramBotName: "",
        wechatToken: ""
    }

    copyDone = () => {

        this.props.showToast(strings.ConnectorURLCopied[user.lang]);

    }

    saveFacebookSettings = () => {

        this.props.saveSettings(this.props.subtab, {
            pageName: this.state.facebookPageName,
            verifyToken: this.state.facebookVerifyToken,
            accessToken: this.state.facebookAccessToken
        });

    }

    saveLineSettings = () => {

        this.props.saveSettings(this.props.subtab, {
            lineID: this.state.lineID,
            secret: this.state.lineSecret,
            accessToken: this.state.lineAccessToken
        });

    }

    saveViberSettings = () => {

        this.props.saveSettings(this.props.subtab, {
            URI: this.state.viberURI,
            apiKey: this.state.viberApiKey
        });

    }

    saveKikSettings = () => {

        this.props.saveSettings(this.props.subtab, {
            apiKey: this.state.kikApiKey,
            botName: this.state.kikBotName
        });

    }

    saveTelegramSettings = () => {

        this.props.saveSettings(this.props.subtab, {
            botName: this.state.telegramBotName,
            accessToken: this.state.telegramAccessToken
        });

    }

    saveWechatSettings = () => {

        this.props.saveSettings(this.props.subtab, {
            apiToken: this.state.wechatToken,
            appId: this.state.wechatAppId,
            appSecret: this.state.wechatAppSecret
        });

    }

    componentWillUpdate = (newProps) => {

        if (newProps.facebookConnector != this.props.facebookConnector && newProps.facebookConnector && newProps.facebookConnector.settings) {

            this.setState({
                facebookPageName: newProps.facebookConnector.settings.pageName,
                facebookVerifyToken: newProps.facebookConnector.settings.verifyToken,
                facebookAccessToken: newProps.facebookConnector.settings.accessToken
            })

        }

        if (newProps.lineConnector != this.props.lineConnector && newProps.lineConnector && newProps.lineConnector.settings) {

            this.setState({
                lineID: newProps.lineConnector.settings.lineID,
                lineSecret: newProps.lineConnector.settings.secret,
                lineAccessToken: newProps.lineConnector.settings.accessToken
            })

        }

        if (newProps.viberConnector != this.props.viberConnector && newProps.viberConnector && newProps.viberConnector.settings) {

            this.setState({
                viberURI: newProps.viberConnector.settings.URI,
                viberApiKey: newProps.viberConnector.settings.apiKey
            })

        }

        if (newProps.kikConnector != this.props.kikConnector && newProps.kikConnector && newProps.kikConnector.settings) {

            this.setState({
                kikBotName: newProps.kikConnector.settings.botName,
                kikApiKey: newProps.kikConnector.settings.apiKey
            })

        }

        if (newProps.telegramConnector != this.props.telegramConnector && newProps.telegramConnector && newProps.telegramConnector.settings) {

            this.setState({
                telegramBotName: newProps.telegramConnector.settings.botName,
                telegramAccessToken: newProps.telegramConnector.settings.accessToken
            })

        }

        if (newProps.wechatConnector != this.props.wechatConnector && newProps.wechatConnector && newProps.wechatConnector.settings) {

            this.setState({
                wechatToken: newProps.wechatConnector.settings.apiToken,
                wechatAppId: newProps.wechatConnector.settings.appId,
                wechatAppSecret: newProps.wechatConnector.settings.appSecret
            })

        }

    }

    render() {

        let facebookWebHookURL = "";

        if (this.props.facebookConnector) {
            facebookWebHookURL = config.serverBase + "/social/" + this.props.facebookConnector.webhookIdentifier;
        }

        let lineWebHookURL = "";

        if (this.props.lineConnector) {
            lineWebHookURL = config.serverBase + "/social/" + this.props.lineConnector.webhookIdentifier;
        }

        let viberWebHookURL = "";

        if (this.props.viberConnector) {
            viberWebHookURL = config.serverBase + "/social/" + this.props.viberConnector.webhookIdentifier;
        }

        let kikWebHookURL = "";

        if (this.props.kikConnector) {
            kikWebHookURL = config.serverBase + "/social/" + this.props.kikConnector.webhookIdentifier;
        }

        let telegramWebHookURL = "";

        if (this.props.telegramConnector) {
            telegramWebHookURL = config.serverBase + "/social/" + this.props.telegramConnector.webhookIdentifier;
        }

        let wechatWebHookURL = "";

        if (this.props.wechatConnector) {
            wechatWebHookURL = config.serverBase + "/social/" + this.props.wechatConnector.webhookIdentifier;
        }

        return (
            <div className={classNames("row", { hidden: this.props.tab !== 'social' })}>

                <div className="col-3">
                    <ul className="list-group">
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'facebook' })} onClick={e => { this.props.subtabClick('facebook') }}>{strings.ConnectorSubMenuFacebook[user.lang]}</li>
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'line' })} onClick={e => { this.props.subtabClick('line') }}>{strings.ConnectorSubMenuLine[user.lang]}</li>
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'wechat' })} onClick={e => { this.props.subtabClick('wechat') }}>{strings.ConnectorSubMenuWeChat[user.lang]}</li>
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'viber' })} onClick={e => { this.props.subtabClick('viber') }}>{strings.ConnectorSubMenuViber[user.lang]}</li>
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'kik' })} onClick={e => { this.props.subtabClick('kik') }}>{strings.ConnectorSubMenuKik[user.lang]}</li>
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'telegram' })} onClick={e => { this.props.subtabClick('telegram') }}>{strings.ConnectorSubMenuTelegram[user.lang]}</li>
                    </ul>
                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'facebook' })}>

                    <Loading />

                    <div className={classNames("card")}>

                        <h4 className="card-title">

                            <span className={classNames(
                                'mr-10',
                                'badge',
                                'badge-xl',
                                'badge-dot',
                                { 'badge-info': this.props.facebookConnector && this.props.facebookConnector.status == constant.IntegrationStateEnabled },
                                { 'badge-danger': this.props.facebookConnector && this.props.facebookConnector.status == constant.IntegrationStateDisabled },
                                { 'badge-warning': this.props.facebookConnector && this.props.facebookConnector.status == constant.IntegrationStateWaiting },
                            )
                            }></span>

                            {strings.ConnectorFacebookTitle[user.lang]}
                        </h4>

                        <div className="card-body">

                            {this.props.facebookConnector &&
                                this.props.facebookConnector.status == constant.IntegrationStateDisabled &&
                                this.props.facebookConnector.error &&
                                this.props.facebookConnector.error.length > 0 ?

                                <div>
                                    <div className="callout callout-danger" role="alert">
                                        <h5>{strings.ConnectorErrorTitle[user.lang]}</h5>
                                        <p className="text-danger">{strings.ConnectorErrorText[user.lang]}</p>
                                    </div>
                                    <pre>
                                        {this.props.facebookConnector.error}
                                    </pre>
                                </div> : null


                            }

                            <p>
                                <strong>{strings.ConnectorFacebookWebHook[user.lang]}</strong>
                            </p>

                            <div className="bg-lightest b-1 border-primary  p-15">

                                <strong>
                                    {facebookWebHookURL}
                                </strong>

                                <CopyToClipboard
                                    text={facebookWebHookURL}
                                    onCopy={() => this.copyDone()}>

                                    <button className="btn btn-square btn-pure btn-primary">
                                        <i className="fa fa-clipboard"></i>
                                    </button>

                                </CopyToClipboard>

                            </div>

                            <hr />

                            <div className="form-group">
                                <label>{strings.ConnectorFacebookPageName[user.lang]}</label>
                                <input type="text" value={this.state.facebookPageName} className="form-control" onChange={e => { this.setState({ facebookPageName: e.target.value }) }} />
                            </div>

                            <div className="form-group">
                                <label>{strings.ConnectorFacebookVerifyToken[user.lang]}</label>
                                <input type="text" value={this.state.facebookVerifyToken} className="form-control" onChange={e => { this.setState({ facebookVerifyToken: e.target.value }) }} />
                            </div>

                            <div className="form-group">
                                <label>{strings.ConnectorFacebookAccessToken[user.lang]}</label>
                                <input type="text" value={this.state.facebookAccessToken} className="form-control" onChange={e => { this.setState({ facebookAccessToken: e.target.value }) }} />
                            </div>

                            <div className="text-right button-container">
                                <button onClick={this.saveFacebookSettings} className="btn btn-label btn-primary">
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

                    <BotConnectorSetting connector={this.props.facebookConnector} />

                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'line' })}>

                    <Loading />

                    <div className={classNames("card")}>

                        <h4 className="card-title">

                            <span className={classNames(
                                'mr-10',
                                'badge',
                                'badge-xl',
                                'badge-dot',
                                { 'badge-info': this.props.lineConnector && this.props.lineConnector.status == constant.IntegrationStateEnabled },
                                { 'badge-danger': this.props.lineConnector && this.props.lineConnector.status == constant.IntegrationStateDisabled },
                                { 'badge-warning': this.props.lineConnector && this.props.lineConnector.status == constant.IntegrationStateWaiting },
                            )
                            }></span>

                            {strings.ConnectorLineTitle[user.lang]}
                        </h4>

                        <div className="card-body">

                            {this.props.lineConnector &&
                                this.props.lineConnector.status == constant.IntegrationStateDisabled &&
                                this.props.lineConnector.error &&
                                this.props.lineConnector.error.length > 0 ?

                                <div>
                                    <div className="callout callout-danger" role="alert">
                                        <h5>{strings.ConnectorErrorTitle[user.lang]}</h5>
                                        <p className="text-danger">{strings.ConnectorErrorText[user.lang]}</p>
                                    </div>
                                    <pre>
                                        {this.props.lineConnector.error}
                                    </pre>
                                </div> : null


                            }

                            <p>
                                <strong>{strings.ConnectorLineWebHook[user.lang]}</strong>
                            </p>

                            <div className="bg-lightest b-1 border-primary  p-15">

                                <strong>
                                    {lineWebHookURL}
                                </strong>

                                <CopyToClipboard
                                    text={lineWebHookURL}
                                    onCopy={() => this.copyDone()}>

                                    <button className="btn btn-square btn-pure btn-primary">
                                        <i className="fa fa-clipboard"></i>
                                    </button>

                                </CopyToClipboard>

                            </div>

                            <hr />

                            <div className="form-group">
                                <label>{strings.ConnectorLineID[user.lang]}</label>
                                <input type="text" value={this.state.lineID} className="form-control" onChange={e => { this.setState({ lineID: e.target.value }) }} />
                                <small>{strings.ConnectorLineIDExplanation[user.lang]}</small>
                            </div>

                            <div className="form-group">
                                <label>{strings.ConnectorLineChannelSecret[user.lang]}</label>
                                <input type="text" value={this.state.lineSecret} className="form-control" onChange={e => { this.setState({ lineSecret: e.target.value }) }} />
                            </div>

                            <div className="form-group">
                                <label>{strings.ConnectorLineChannelAccessToken[user.lang]}</label>
                                <input type="text" value={this.state.lineAccessToken} className="form-control" onChange={e => { this.setState({ lineAccessToken: e.target.value }) }} />
                            </div>

                            <div className="text-right button-container">
                                <button onClick={this.saveLineSettings} className="btn btn-label btn-primary">
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

                    <BotConnectorSetting connector={this.props.lineConnector} />


                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'wechat' })}>

                    <Loading />

                    <div className={classNames("card")}>

                        <h4 className="card-title">

                            <span className={classNames(
                                'mr-10',
                                'badge',
                                'badge-xl',
                                'badge-dot',
                                { 'badge-info': this.props.wechatConnector && this.props.wechatConnector.status == constant.IntegrationStateEnabled },
                                { 'badge-danger': this.props.wechatConnector && this.props.wechatConnector.status == constant.IntegrationStateDisabled },
                                { 'badge-warning': this.props.wechatConnector && this.props.wechatConnector.status == constant.IntegrationStateWaiting },
                            )
                            }></span>

                            {strings.ConnectorWeChatTitle[user.lang]}
                        </h4>

                        <div className="card-body">

                            {this.props.wechatConnector &&
                                this.props.wechatConnector.status == constant.IntegrationStateDisabled &&
                                this.props.wechatConnector.error &&
                                this.props.wechatConnector.error.length > 0 ?

                                <div>
                                    <div className="callout callout-danger" role="alert">
                                        <h5>{strings.ConnectorErrorTitle[user.lang]}</h5>
                                        <p className="text-danger">{strings.ConnectorErrorText[user.lang]}</p>
                                    </div>
                                    <pre>
                                        {this.props.wechatConnector.error}
                                    </pre>
                                </div> : null


                            }

                            <p>
                                <strong>{strings.ConnectorWeChatWebHook[user.lang]}</strong>
                            </p>

                            <div className="bg-lightest b-1 border-primary  p-15">

                                <strong>
                                    {wechatWebHookURL}
                                </strong>

                                <CopyToClipboard
                                    text={wechatWebHookURL}
                                    onCopy={() => this.copyDone()}>

                                    <button className="btn btn-square btn-pure btn-primary">
                                        <i className="fa fa-clipboard"></i>
                                    </button>

                                </CopyToClipboard>

                            </div>

                            <hr />

                            <div className="form-group">
                                <label>{strings.ConnectorWeChatToken[user.lang]}</label>
                                <input type="text" value={this.state.wechatToken} className="form-control" onChange={e => { this.setState({ wechatToken: e.target.value }) }} />
                                <small>{strings.ConnectorWeChatTokenExplanation[user.lang]}</small>
                            </div>

                            <div className="form-group">
                                <label>{strings.ConnectorWeChatAppId[user.lang]}</label>
                                <input type="text" value={this.state.wechatAppId} className="form-control" onChange={e => { this.setState({ wechatAppId: e.target.value }) }} />
                            </div>

                            <div className="form-group">
                                <label>{strings.ConnectorWeChatAppSecret[user.lang]}</label>
                                <input type="text" value={this.state.wechatAppSecret} className="form-control" onChange={e => { this.setState({ wechatAppSecret: e.target.value }) }} />
                            </div>

                            <div className="text-right button-container">
                                <button onClick={this.saveWechatSettings} className="btn btn-label btn-primary">
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

                    <BotConnectorSetting connector={this.props.wechatConnector} />

                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'viber' })}>

                    <Loading />

                    <div className={classNames("card")}>

                        <h4 className="card-title">

                            <span className={classNames(
                                'mr-10',
                                'badge',
                                'badge-xl',
                                'badge-dot',
                                { 'badge-info': this.props.viberConnector && this.props.viberConnector.status == constant.IntegrationStateEnabled },
                                { 'badge-danger': this.props.viberConnector && this.props.viberConnector.status == constant.IntegrationStateDisabled },
                                { 'badge-warning': this.props.viberConnector && this.props.viberConnector.status == constant.IntegrationStateWaiting },
                            )
                            }></span>

                            {strings.ConnectorViberTitle[user.lang]}
                        </h4>

                        <div className="card-body">

                            {this.props.viberConnector &&
                                this.props.viberConnector.status == constant.IntegrationStateDisabled &&
                                this.props.viberConnector.error &&
                                this.props.viberConnector.error.length > 0 ?

                                <div>
                                    <div className="callout callout-danger" role="alert">
                                        <h5>{strings.ConnectorErrorTitle[user.lang]}</h5>
                                        <p className="text-danger">{strings.ConnectorErrorText[user.lang]}</p>
                                    </div>
                                    <pre>
                                        {this.props.viberConnector.error}
                                    </pre>
                                </div> : null

                            }

                            <p>
                                <strong>{strings.ConnectorViberWebHook[user.lang]}</strong>
                            </p>

                            <div className="bg-lightest b-1 border-primary  p-15">

                                <strong>
                                    {viberWebHookURL}
                                </strong>

                                <CopyToClipboard
                                    text={viberWebHookURL}
                                    onCopy={() => this.copyDone()}>

                                    <button className="btn btn-square btn-pure btn-primary">
                                        <i className="fa fa-clipboard"></i>
                                    </button>

                                </CopyToClipboard>

                            </div>

                            <hr />


                            <div className="form-group">
                                <label>{strings.ConnectorViberBotURI[user.lang]}</label>
                                <input type="text" value={this.state.viberURI} className="form-control" onChange={e => { this.setState({ viberURI: e.target.value }) }} />
                            </div>

                            <div className="form-group">
                                <label>{strings.ConnectorViberApiToken[user.lang]}</label>
                                <input type="text" value={this.state.viberApiKey} className="form-control" onChange={e => { this.setState({ viberApiKey: e.target.value }) }} />
                            </div>

                            <div className="text-right button-container">
                                <button onClick={this.saveViberSettings} className="btn btn-label btn-primary">
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

                    <BotConnectorSetting connector={this.props.viberConnector} />

                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'kik' })}>

                    <Loading />

                    <div className={classNames("card")}>

                        <h4 className="card-title">

                            <span className={classNames(
                                'mr-10',
                                'badge',
                                'badge-xl',
                                'badge-dot',
                                { 'badge-info': this.props.kikConnector && this.props.kikConnector.status == constant.IntegrationStateEnabled },
                                { 'badge-danger': this.props.kikConnector && this.props.kikConnector.status == constant.IntegrationStateDisabled },
                                { 'badge-warning': this.props.kikConnector && this.props.kikConnector.status == constant.IntegrationStateWaiting },
                            )
                            }></span>

                            {strings.ConnectorKikTitle[user.lang]}
                        </h4>

                        <div className="card-body">

                            {this.props.kikConnector &&
                                this.props.kikConnector.status == constant.IntegrationStateDisabled &&
                                this.props.kikConnector.error &&
                                this.props.kikConnector.error.length > 0 ?

                                <div>
                                    <div className="callout callout-danger" role="alert">
                                        <h5>{strings.ConnectorErrorTitle[user.lang]}</h5>
                                        <p className="text-danger">{strings.ConnectorErrorText[user.lang]}</p>
                                    </div>
                                    <pre>
                                        {this.props.kikConnector.error}
                                    </pre>
                                </div> : null

                            }

                            <p>
                                <strong>{strings.ConnectorKikWebHook[user.lang]}</strong>
                            </p>

                            <div className="bg-lightest b-1 border-primary  p-15">

                                <strong>
                                    {kikWebHookURL}
                                </strong>

                                <CopyToClipboard
                                    text={kikWebHookURL}
                                    onCopy={() => this.copyDone()}>

                                    <button className="btn btn-square btn-pure btn-primary">
                                        <i className="fa fa-clipboard"></i>
                                    </button>

                                </CopyToClipboard>

                            </div>

                            <hr />

                            <div className="form-group">
                                <label>{strings.ConnectorKikBotName[user.lang]}</label>
                                <input type="text" value={this.state.kikBotName} className="form-control" onChange={e => { this.setState({ kikBotName: e.target.value }) }} />
                            </div>

                            <div className="form-group">
                                <label>{strings.ConnectorKikApiToken[user.lang]}</label>
                                <input type="text" value={this.state.kikApiKey} className="form-control" onChange={e => { this.setState({ kikApiKey: e.target.value }) }} />
                            </div>

                            <div className="text-right button-container">
                                <button onClick={this.saveKikSettings} className="btn btn-label btn-primary">
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

                    <BotConnectorSetting connector={this.props.kikConnector} />


                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'telegram' })}>

                    <Loading />

                    <div className={classNames("card")}>

                        <h4 className="card-title">

                            <span className={classNames(
                                'mr-10',
                                'badge',
                                'badge-xl',
                                'badge-dot',
                                { 'badge-info': this.props.telegramConnector && this.props.telegramConnector.status == constant.IntegrationStateEnabled },
                                { 'badge-danger': this.props.telegramConnector && this.props.telegramConnector.status == constant.IntegrationStateDisabled },
                                { 'badge-warning': this.props.telegramConnector && this.props.telegramConnector.status == constant.IntegrationStateWaiting },
                            )
                            }></span>

                            {strings.ConnectorTelegramTitle[user.lang]}
                        </h4>

                        <div className="card-body">

                            {this.props.telegramConnector &&
                                this.props.telegramConnector.status == constant.IntegrationStateDisabled &&
                                this.props.telegramConnector.error &&
                                this.props.telegramConnector.error.length > 0 ?

                                <div>
                                    <div className="callout callout-danger" role="alert">
                                        <h5>{strings.ConnectorErrorTitle[user.lang]}</h5>
                                        <p className="text-danger">{strings.ConnectorErrorText[user.lang]}</p>
                                    </div>
                                    <pre>
                                        {this.props.telegramConnector.error}
                                    </pre>
                                </div> : null

                            }

                            <p>
                                <strong>{strings.ConnectorTelegramWebHook[user.lang]}</strong>
                            </p>

                            <div className="bg-lightest b-1 border-primary  p-15">

                                <strong>
                                    {telegramWebHookURL}
                                </strong>

                                <CopyToClipboard
                                    text={telegramWebHookURL}
                                    onCopy={() => this.copyDone()}>

                                    <button className="btn btn-square btn-pure btn-primary">
                                        <i className="fa fa-clipboard"></i>
                                    </button>

                                </CopyToClipboard>

                            </div>

                            <hr />

                            <div className="form-group">
                                <label>{strings.ConnectorTelegramBotName[user.lang]}</label>
                                <input type="text" value={this.state.telegramBotName} className="form-control" onChange={e => { this.setState({ telegramBotName: e.target.value }) }} />
                            </div>

                            <div className="form-group">
                                <label>{strings.ConnectorTelegramAccessToken[user.lang]}</label>
                                <input type="text" value={this.state.telegramAccessToken} className="form-control" onChange={e => { this.setState({ telegramAccessToken: e.target.value }) }} />
                            </div>

                            <div className="text-right button-container">
                                <button onClick={this.saveTelegramSettings} className="btn btn-label btn-primary">
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

                    <BotConnectorSetting connector={this.props.telegramConnector} />

                </div>
            </div>

        );
    }

}

const mapStateToProps = (state) => {
    return {
        tab: state.connector.tab,
        subtab: state.connector.subtab,
        facebookConnector: state.connector.facebookConnector,
        lineConnector: state.connector.lineConnector,
        viberConnector: state.connector.viberConnector,
        kikConnector: state.connector.kikConnector,
        telegramConnector: state.connector.telegramConnector,
        wechatConnector: state.connector.wechatConnector,
        saving: state.connector.saving,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        subtabClick: (tab) => dispatch(actions.connector.subtabClick(tab)),
        showToast: (text) => dispatch(actions.notification.showToast(text)),
        saveSettings: (tab, settings) => dispatch(actions.connector.saveSettings(tab, settings)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectorSocial);
