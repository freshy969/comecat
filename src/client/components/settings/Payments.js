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

class Payments extends Component {

    state = {
    }

    static propTypes = {
    }

    componentDidMount = () => {


    }

    render() {

        return (
            <div className="col-12 pt-15">

                <div className={classNames("card invoice")}>

                    <div className="card-body">

                        <table className="table">

                            <tbody>

                                {this.props.payments.map(row => {

                                    const date = new Date(row.date);
                                    const amount = row.amount;

                                    return <tr key={row.date}>
                                        <td width="30%"><strong>
                                            {date.toLocaleDateString()}
                                        </strong></td>
                                        <td>
                                            {amount}
                                        </td>
                                    </tr>
                                })}

                            </tbody>


                        </table>

                    </div>

                </div>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        payments: state.settings.payments
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Payments);
