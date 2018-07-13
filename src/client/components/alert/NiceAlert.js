import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../actions';

import * as constant from '../../lib/const';
import * as config from '../../lib/config';

class NiceAlert extends Component {

    constructor(props) {
        super(props);

    }

    render() {

        return (
            <div>
                {this.props.show ?

                    <div
                        className="swal2-container swal2-fade swal2-shown"
                        style={{ "overflowY": "auto" }}>

                        <div className="swal2-modal swal2-show"
                            style={{
                                "width": "500px",
                                "padding": "20px",
                                "background": "rgb(255, 255, 255)",
                                "display": "block"
                            }}>

                            {this.props.img ?
                                <div className="swal2-icon" style={{ " display": "block" }}>
                                    <img src={this.props.img} />
                                </div> : null}

                            <h2 className="swal2-title" id="swal2-title">{this.props.title}</h2>
                            <div id="swal2-content" className="swal2-content" style={{ "display": "block" }}>{this.props.message}</div>

                            <div className="swal2-buttonswrapper" style={{ "display": "block" }}>
                                <button type="button" className="swal2-confirm btn btn-bold btn-primary" onClick={this.props.hide}>OK</button>
                            </div>
                        </div>
                    </div> : null

                }
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        show: state.niceAlert.show,
        img: state.niceAlert.image,
        title: state.niceAlert.title,
        message: state.niceAlert.message,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        hide: () => dispatch(actions.notification.hideNiceAlert())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NiceAlert);
