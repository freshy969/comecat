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

import logoPic from '../../assets/img/logoCatBig.png';

class Account extends Component {

    state = {
    }

    static propTypes = {
    }

    submitStarterMonthly = () => {
        //this.starterMonthlyForm.submit();

        this.props.showNiceAlert({
            img: "",
            title: "It's Beta now",
            message: "You can use all feature unlimited until August.31"
        });

    }

    submitProMonthly = () => {
        //this.proMonthlyForm.submit();

        this.props.showNiceAlert({
            img: "",
            title: "It's Beta now",
            message: "You can use all feature unlimited until August.31"
        });

    }

    render() {

        const startDate = new Date(user.userData.created);

        const OrderIdStarter = user.userData._id + ":" + util.getDateTime();
        const OrderIdPro = user.userData._id + ":" + util.getDateTime();
        const isSandbox = user.userData.sandbox === true;

        let peymentUrl = config.checkoutURL.production;
        if (isSandbox)
            peymentUrl = config.checkoutURL.sandbox;

        let peymentSid = config.PaymentSID.production;
        if (isSandbox)
            peymentSid = config.PaymentSID.sandbox;

        return (

            <div className="col-12 pt-15">

                <div className={classNames("card basic-info")}>

                    <div className="card-body">

                        <h3>{strings.SettingsAccountBasicInformation[user.lang]}</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <td width="30%">{strings.SettingsAccountEmail[user.lang]}</td>
                                    <td>{user.userData.userid}</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td width="30%">{strings.SettingsAccountStartedAt[user.lang]}</td>
                                    <td>{startDate.toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td width="30%">{strings.SettingsAccountSubscription[user.lang]}</td>
                                    <td>
                                        <strong>Beta</strong>
                                        <p> You can use all feature without any limit until August.31 </p>

                                        {/*
                                        <strong>{strings.Subscriptions[user.lang][user.userData.subscription]}</strong>
                                        {user.userData.subscription != constant.subscriptions.free ?
                                            <p> {strings.PricePerMonth[user.lang][user.userData.subscription]} </p> : null}

                                        */}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>

                </div>

                <div className={classNames("card plans")}>

                    <div className="card-title">
                        <h3>
                            {strings.SettingsAccountSubscriptionTitle[user.lang]}
                        </h3>
                    </div>
                    <div className="card-body">

                        <div className="row no-gutters">

                            <div className="col-lg-4">
                                <div className="card">
                                    <div className="card-body text-center">
                                        <h5 className="text-uppercase text-muted">
                                            {strings.SettingsAccountSubscriptionPlans.free.label[user.lang]}
                                        </h5>
                                        <br />
                                        <h3 className="price">
                                            <sup>$</sup>
                                            {strings.SettingsAccountSubscriptionPlans.free.price1[user.lang]}
                                            <span>
                                                {strings.SettingsAccountSubscriptionPlans.free.price2[user.lang]}
                                            </span>
                                        </h3>

                                        <hr />
                                        <p>
                                            <strong>{strings.SettingsAccountSubscriptionPlans.free.feature1[user.lang]}</strong>
                                            {strings.SettingsAccountSubscriptionPlans.free.feature2[user.lang]}
                                        </p>
                                        <p><strong>
                                            {strings.SettingsAccountSubscriptionPlans.free.feature2[user.lang]}
                                        </strong></p>
                                        <p><strong>
                                            {strings.SettingsAccountSubscriptionPlans.free.feature3[user.lang]}
                                        </strong></p>
                                        <p><strong>
                                            {strings.SettingsAccountSubscriptionPlans.free.feature4[user.lang]}
                                        </strong></p>

                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="card">
                                    <div className="card-body text-center">
                                        <h5 className="text-uppercase text-muted">
                                            {strings.SettingsAccountSubscriptionPlans.start.label[user.lang]}
                                        </h5>
                                        <br />
                                        <h3 className="price">
                                            <sup>$</sup>
                                            {strings.SettingsAccountSubscriptionPlans.start.price1[user.lang]}
                                            <sup>
                                                {strings.SettingsAccountSubscriptionPlans.start.price2[user.lang]}
                                            </sup>
                                        </h3>

                                        <hr />
                                        <p>
                                            <strong>{strings.SettingsAccountSubscriptionPlans.start.feature1[user.lang]}</strong>
                                            {strings.SettingsAccountSubscriptionPlans.start.feature2[user.lang]}
                                        </p>
                                        <p><strong>
                                            {strings.SettingsAccountSubscriptionPlans.start.feature3[user.lang]}
                                        </strong></p>
                                        <p><strong>
                                            {strings.SettingsAccountSubscriptionPlans.start.feature4[user.lang]}
                                        </strong></p>
                                        <p><strong>
                                            {strings.SettingsAccountSubscriptionPlans.start.feature5[user.lang]}
                                        </strong></p>


                                        {user.userData.subscription != constant.subscriptions.starter ?

                                            <div>

                                                <br /> <br />
                                                <br /> <br />
                                                <a href="javascript:void()" disabled="disabled" className="btn btn-bold btn-block btn-secondary" onClick={this.submitStarterMonthly}>Select plan</a>

                                                <form action={peymentUrl} method='post' ref={form => this.starterMonthlyForm = form}>
                                                    <input type='hidden' name='sid' value={peymentSid} />
                                                    <input type='hidden' name='quantity' value='1' />
                                                    <input type='hidden' name='product_id' value='1' />
                                                    <input type='hidden' name='merchant_order_id' value={OrderIdStarter} />
                                                    <input type='hidden' name='demo' value={config.PaymentDemoMode} />
                                                    {isSandbox ? <input type='hidden' name='custom_redirect' value={config.PaymentRedirectURL} /> : null}
                                                    <input type='hidden' name='custom_userid' value={user.userData._id} />
                                                    <input type='hidden' name='custom_planname' value={constant.subscriptions.starter} />
                                                </form>
                                            </div> : null
                                        }

                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="card">
                                    <div className="card-body text-center">
                                        <h5 className="text-uppercase text-muted">
                                            {strings.SettingsAccountSubscriptionPlans.pro.label[user.lang]}
                                        </h5>
                                        <br />
                                        <h3 className="price">
                                            <sup>$</sup>
                                            {strings.SettingsAccountSubscriptionPlans.pro.price1[user.lang]}
                                            <sup>
                                                {strings.SettingsAccountSubscriptionPlans.pro.price2[user.lang]}
                                            </sup>
                                        </h3>

                                        <hr />
                                        <p>
                                            <strong>{strings.SettingsAccountSubscriptionPlans.pro.feature1[user.lang]}</strong>
                                            {strings.SettingsAccountSubscriptionPlans.pro.feature2[user.lang]}
                                        </p>
                                        <p><strong>
                                            {strings.SettingsAccountSubscriptionPlans.pro.feature3[user.lang]}
                                        </strong></p>
                                        <p><strong>
                                            {strings.SettingsAccountSubscriptionPlans.pro.feature4[user.lang]}
                                        </strong></p>
                                        <p><strong>
                                            {strings.SettingsAccountSubscriptionPlans.pro.feature5[user.lang]}
                                        </strong></p>

                                        {user.userData.subscription != constant.subscriptions.unlimited ?
                                            <div>

                                                <br /> <br />
                                                <br /> <br />
                                                <a href="javascript:void()" className="btn btn-bold btn-block btn-secondary" onClick={this.submitProMonthly}>Select plan</a>

                                                <form action={peymentUrl} method='post' ref={form => this.proMonthlyForm = form}>
                                                    <input type='hidden' name='sid' value={peymentSid} />
                                                    <input type='hidden' name='quantity' value='1' />
                                                    <input type='hidden' name='product_id' value='2' />
                                                    <input type='hidden' name='merchant_order_id' value={OrderIdPro} />
                                                    <input type='hidden' name='demo' value={config.PaymentDemoMode} />

                                                    {isSandbox ? <input type='hidden' name='custom_redirect' value={config.PaymentRedirectURL} /> : null}
                                                    <input type='hidden' name='custom_userid' value={user.userData._id} />
                                                    <input type='hidden' name='custom_planname' value={constant.subscriptions.unlimited} />
                                                </form>
                                            </div> : null
                                        }

                                    </div>
                                </div>
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showNiceAlert: (params) => dispatch(actions.notification.showNiceAlert(params)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Account);
