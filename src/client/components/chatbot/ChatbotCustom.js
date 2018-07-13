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

class ChatbotCustom extends Component {

    static propTypes = {
    }

    state = {
    }

    render() {

        return (

            <div className={classNames("row", { hidden: this.props.tab !== 'custom' })}>

                <div className={classNames("col-12", "m-15")}>

                    <div className={classNames("card")}>

                        <div className="card-body">

                            <div className="callout callout-success" role="alert">
                                <h5>Hire Us</h5>
                                <p>
                                    We can develop your custome chatbot to help your business from $499 !<br />
                                    Please <a href="mailto:info@clover-studio">conatct us</a>.
                                </p>
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
        tab: state.chatbot.tab,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatbotCustom);
