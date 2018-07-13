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

class ConnectorSpeaker extends Component {

    static propTypes = {
    }

    render() {

        return (

            <div className={classNames("row", { hidden: this.props.tab !== 'speaker' })}>

                <div className="col-3">
                    <ul className="list-group">
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'alexa' })} onClick={e => { this.props.subtabClick('alexa') }}>{strings.ConnectorSubMenuAlexa[user.lang]}</li>
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'googlehome' })} onClick={e => { this.props.subtabClick('googlehome') }}>{strings.ConnectorSubMenuGoogleHome[user.lang]}</li>
                        <li className={classNames("list-group-item", "cursor-pointer", { active: this.props.subtab == 'homepod' })} onClick={e => { this.props.subtabClick('homepod') }}>{strings.ConnectorSubMenuHomePod[user.lang]}</li>
                    </ul>
                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'alexa' })}>

                    <UnderConstruction />

                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'googlehome' })}>

                    <UnderConstruction />

                </div>

                <div className={classNames("col-9", "pt-15", "pl-0", "pr-0", { hidden: this.props.subtab !== 'homepod' })}>

                    <UnderConstruction />

                </div>


            </div>

        );
    }

}

const mapStateToProps = (state) => {
    return {
        tab: state.connector.tab,
        subtab: state.connector.subtab
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
)(ConnectorSpeaker);
