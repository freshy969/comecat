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

import BotConnectorSetting from './BotConnectorSetting';
import Loading from './ConnectorLoading';

class ConnectorWeb extends Component {

    static propTypes = {
    }

    copyDone = () => {

        this.props.showToast(strings.ConnectorURLCopied[user.lang]);

    }

    render() {

        let defaultHomepageConnectorURL = "";

        if (this.props.defaultConnector) {
            defaultHomepageConnectorURL = config.serverBase + "/c/?c=" + this.props.defaultConnector.webhookIdentifier;
        }

        let defaultWebConnectorJS = "";

        if (this.props.defaultConnector) {
            const defaultWebConnectorURL = config.serverBase + "/c/l/loader.js?code=" + this.props.defaultConnector.webhookIdentifier;
            defaultWebConnectorJS = `<script type="text/javascript" id="comecat" src="${defaultWebConnectorURL}" ></script>`;
        }

        return (

            <div className={classNames("row", { hidden: this.props.tab !== 'web' })}>

                <div className="col-3">
                    <ul className="list-group">
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'homepage' })} onClick={e => { this.props.subtabClick('homepage') }}>{strings.ConnectorSubMenuHomePage[user.lang]}</li>
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'embed' })} onClick={e => { this.props.subtabClick('embed') }}>{strings.ConnectorSubMenuEmbed[user.lang]}</li>
                    </ul>
                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'homepage' })}>

                    <Loading />

                    <div className={classNames("card")}>

                        <h4 className="card-title">{strings.ConnectorDefaultHomepageLabel[user.lang]}</h4>

                        <div className="card-body">

                            <p>
                                {strings.ConnectorDefaultHomepageExplanation[user.lang]}
                            </p>

                            <div className="bg-lightest b-1 border-primary  p-15">
                                <strong>
                                    <a href={defaultHomepageConnectorURL} target="_blank">
                                        {defaultHomepageConnectorURL}
                                    </a>
                                </strong>


                                <CopyToClipboard
                                    text={defaultHomepageConnectorURL}
                                    onCopy={() => this.copyDone()}>

                                    <button className="btn btn-square btn-pure btn-primary">
                                        <i className="fa fa-clipboard"></i>
                                    </button>

                                </CopyToClipboard>

                            </div>

                        </div>

                    </div>

                    <BotConnectorSetting connector={this.props.defaultConnector} test="sss" />

                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'embed' })}>

                    <Loading />

                    <div className={classNames("card")}>

                        <h4 className="card-title">{strings.ConnectorDefaultJavascriptCodeLabel[user.lang]}</h4>

                        <div className="card-body">

                            <p>
                                {strings.ConnectorDefaultHomepageExplanation[user.lang]}
                            </p>

                            <div className="bg-lightest b-1 border-primary  p-15">
                                <strong>
                                    {defaultWebConnectorJS}
                                </strong>


                                <CopyToClipboard
                                    text={defaultWebConnectorJS}
                                    onCopy={() => this.copyDone()}>

                                    <button className="btn btn-square btn-pure btn-primary">
                                        <i className="fa fa-clipboard"></i>
                                    </button>

                                </CopyToClipboard>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        );
    }

}

const mapStateToProps = (state) => {
    return {
        isLoading: state.connector.loading,
        defaultConnector: state.connector.defaultConnector,
        tab: state.connector.tab,
        subtab: state.connector.subtab,
        chatbots: state.connector.chatbots
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        subtabClick: (tab) => dispatch(actions.connector.subtabClick(tab)),
        showToast: (text) => dispatch(actions.notification.showToast(text))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectorWeb);
