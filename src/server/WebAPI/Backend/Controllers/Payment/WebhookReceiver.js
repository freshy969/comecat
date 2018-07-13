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

var TransactionLog = require(pathTop + 'Models/TransactionLog');
var Order = require(pathTop + 'Models/Order');

var BackendBase = require('../BackendBase');

var WebhookReceiver = function () {
}

_.extend(WebhookReceiver.prototype, BackendBase.prototype);

WebhookReceiver.prototype.init = function (app) {

    var self = this;


    router.get('/', (request, response) => {

        console.log('get');
        console.log(request.headers);
        console.log(request.query);
        console.log(request.body);

    });

    router.post('/', (request, response) => {

        console.log('payment webhook received ---------------------');
        console.log(request.headers);
        console.log(request.query);
        console.log(request.body);
        console.log('payment webhook received ------------------------');

        const params = request.body;

        const transactionLogModel = TransactionLog.get();
        const orderId = params.vendor_order_id;
        let userId = null;

        if (orderId) {
            userId = orderId.split(':')[0];
        }

        var modelToSave = new transactionLogModel({
            message_type: params.message_type,
            invoice_id: params.invoice_id,
            user_id: userId,
            order_id: params.vendor_order_id,
            invoice_status: params.invoice_status,
            created: Utils.now(),
            original: params
        });

        modelToSave.save((err, saveResult) => {

            if (params.invoice_status == 'deposited') {

                const orderModel = Order.get();
                orderModel.update({
                    order_id: params.vendor_order_id
                }, {
                        payment_status: Const.paymentStatus.deposited
                    }, (err, updateResult) => {

                        if (err)
                            console.error(err);

                    });

            }

        });

        response.send('OK');

    });

    return router;

}


module["exports"] = new WebhookReceiver();
