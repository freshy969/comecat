/** Copy this file when create new controller  */

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var async = require('async');

var pathTop = "../../../../";

var Const = require(pathTop + "lib/consts");
var Config = require(pathTop + "lib/init");
var DatabaseManager = require(pathTop + 'lib/DatabaseManager');
var Utils = require(pathTop + 'lib/utils');

var UserModel = require(pathTop + 'Models/User');
var TransactionLog = require(pathTop + 'Models/TransactionLog');
var Order = require(pathTop + 'Models/Order');
var tokenChecker = require(pathTop + 'lib/authApi');

var BackendBase = require('../BackendBase');

var CheckoutRedirect = function () {
}

_.extend(CheckoutRedirect.prototype, BackendBase.prototype);

CheckoutRedirect.prototype.init = function (app) {

    var self = this;


    router.get('/', (request, response) => {

        if (request.query.postbody) {
            const originalPostBody = JSON.parse(request.query.postbody);
            this.processPayment(response, originalPostBody);
        }

    });

    router.post('/', (request, response) => {

        if (request.body.custom_redirect && !request.headers.redirected) {

            const postBody = request.body;

            // convert to json
            const postBodyJson = JSON.stringify(postBody);
            response.redirect(request.body.custom_redirect + "?postbody=" + encodeURI(postBodyJson));

        } else {
            this.processPayment(response, request.body);
        }

    });

    return router;

}

CheckoutRedirect.prototype.processPayment = function (response, postBody) {

    //console.log("redirect", postBody);
    //response.redirect(Config.serviceURL + '/settings/account?result=success');

    const transactionLog = TransactionLog.get();
    const userModel = UserModel.get();
    const orderModel = Order.get();

    if (postBody
        && postBody.credit_card_processed == 'Y'
        && postBody.invoice_id
        && postBody.custom_userid
        && postBody.custom_planname) {

    }
    else
        response.redirect(Config.paymentRedirectUrl + '/settings/account');

    const invoice_id = postBody.invoice_id;
    const order_id = postBody.merchant_order_id;
    const user_id = postBody.custom_userid;
    const planName = postBody.custom_planname;

    new Promise((res, rej) => {

        const result = {};

        transactionLog.findOne({
            order_id: order_id,
            invoice_status: Const.paymentStatus.deposited
        }, (err, findResult) => {

            if (err)
                return rej(err);

            if (findResult)
                result.paymentLog = findResult.toObject();

            res(result);

        });


    }).then((result) => {

        return new Promise((res, rej) => {

            userModel.findOne({
                _id: user_id
            }, (err, findResult) => {

                if (err || !findResult)
                    return rej(err);

                result.user = findResult.toObject();

                res(result);

            });


        });

    }).then((result) => {

        return new Promise((res, rej) => {

            userModel.update({
                _id: result.user._id
            }, {
                    subscription: planName
                }, (err, updateResult) => {

                    if (err || !updateResult)
                        return rej(err);

                    res(result);

                });

        });

    }).then((result) => {

        return new Promise((res, rej) => {

            const paymentStauts = result.paymentLog ? Const.paymentStatus.deposited : Const.paymentStatus.approved;

            var modelToSave = new orderModel({
                user_id: user_id,
                invoice_id: invoice_id,
                order_id: order_id,
                plan_name: planName,
                payment_status: paymentStauts,
                created: Utils.now(),
                transaction: postBody
            });

            modelToSave.save((err, saveResult) => {

                if (err || !saveResult)
                    return rej(err);

                res(result);

            });

        });


    }).then((result) => {

        response.redirect(Config.paymentRedirectUrl + '/settings/account?result=success&plan=' + planName);

    }).catch((e) => {
        response.redirect(Config.paymentRedirectUrl + '/settings/account');
    });

}

module["exports"] = new CheckoutRedirect();
