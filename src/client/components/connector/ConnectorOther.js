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
import BotConnectorSetting from './BotConnectorSetting'
import Loading from './ConnectorLoading';

class ConnectorOther extends Component {

    static propTypes = {
    }

    state = {
        twilioTelephoneNumber: "",
        twilioSID: "",
        twilioAuthToken: ""
    }

    saveTwilioSettings = () => {

        this.props.saveSettings(this.props.subtab, {
            telephoneNumber: this.state.twilioTelephoneNumber,
            sid: this.state.twilioSID,
            authToken: this.state.twilioAuthToken
        });

    }

    componentWillUpdate = (newProps) => {

        if (newProps.twilioConnector != this.props.twilioConnector && newProps.twilioConnector && newProps.twilioConnector.settings) {

            this.setState({
                twilioTelephoneNumber: newProps.twilioConnector.settings.telephoneNumber,
                twilioSID: newProps.twilioConnector.settings.sid,
                twilioAuthToken: newProps.twilioConnector.settings.authToken

            })

        }

    }

    render() {

        let twilioWebHookURL = "";

        if (this.props.twilioConnector) {
            twilioWebHookURL = config.serverBase + "/social/" + this.props.twilioConnector.webhookIdentifier;
        }


        return (

            <div className={classNames("row", { hidden: this.props.tab !== 'other' })}>

                <div className="col-3">
                    <ul className="list-group">
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'email' })} onClick={e => { this.props.subtabClick('email') }}>{strings.ConnectorSubMenuEmail[user.lang]}</li>
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'twilio' })} onClick={e => { this.props.subtabClick('twilio') }}>{strings.ConnectorSubMenuTwilio[user.lang]}</li>
                    </ul>
                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'email' })}>

                    <UnderConstruction />

                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'twilio' })}>

                    <Loading />

                    <div className={classNames("card")}>

                        <h4 className="card-title">

                            <span className={classNames(
                                'mr-10',
                                'badge',
                                'badge-xl',
                                'badge-dot',
                                { 'badge-info': this.props.twilioConnector && this.props.twilioConnector.status == constant.IntegrationStateEnabled },
                                { 'badge-danger': this.props.twilioConnector && this.props.twilioConnector.status == constant.IntegrationStateDisabled },
                                { 'badge-warning': this.props.twilioConnector && this.props.twilioConnector.status == constant.IntegrationStateWaiting },
                            )
                            }></span>

                            {strings.ConnectorTwilioTitle[user.lang]}
                        </h4>

                        <div className="card-body">

                            {this.props.twilioConnector &&
                                this.props.twilioConnector.status == constant.IntegrationStateDisabled &&
                                this.props.twilioConnector.error &&
                                this.props.twilioConnector.error.length > 0 ?

                                <div>
                                    <div className="callout callout-danger" role="alert">
                                        <h5>{strings.ConnectorErrorTitle[user.lang]}</h5>
                                        <p className="text-danger">{strings.ConnectorErrorText[user.lang]}</p>
                                    </div>
                                    <pre>
                                        {this.props.twilioConnector.error}
                                    </pre>
                                </div> : null

                            }

                            <p>
                                <strong>{strings.ConnectorTwilioWebHook[user.lang]}</strong>
                            </p>

                            <div className="bg-lightest b-1 border-primary  p-15">

                                <strong>
                                    {twilioWebHookURL}
                                </strong>

                                <CopyToClipboard
                                    text={twilioWebHookURL}
                                    onCopy={() => this.copyDone()}>

                                    <button className="btn btn-square btn-pure btn-primary">
                                        <i className="fa fa-clipboard"></i>
                                    </button>

                                </CopyToClipboard>

                            </div>

                            <hr />


                            <div className="form-group">
                                <label>{strings.ConnectorTwilioTelephoneNumber[user.lang]}</label>
                                <input type="text" value={this.state.twilioTelephoneNumber} className="form-control" onChange={e => { this.setState({ twilioTelephoneNumber: e.target.value }) }} />
                            </div>

                            <div className="form-group">
                                <label>{strings.ConnectorTwilioSID[user.lang]}</label>
                                <input type="text" value={this.state.twilioSID} className="form-control" onChange={e => { this.setState({ twilioSID: e.target.value }) }} />
                            </div>

                            <div className="form-group">
                                <label>{strings.ConnectorTwilioAuthToken[user.lang]}</label>
                                <input type="text" value={this.state.twilioAuthToken} className="form-control" onChange={e => { this.setState({ twilioAuthToken: e.target.value }) }} />
                            </div>

                            <div className="text-right button-container">
                                <button onClick={this.saveTwilioSettings} className="btn btn-label btn-primary">
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

                    <BotConnectorSetting connector={this.props.twilioConnector} />

                </div>

            </div>

        );
    }

}

const mapStateToProps = (state) => {
    return {
        tab: state.connector.tab,
        subtab: state.connector.subtab,
        twilioConnector: state.connector.twilioConnector,
        saving: state.connector.saving,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        subtabClick: (tab) => dispatch(actions.connector.subtabClick(tab)),
        saveSettings: (tab, settings) => dispatch(actions.connector.saveSettings(tab, settings)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectorOther);
