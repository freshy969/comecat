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

var tokenChecker = require(pathTop + 'lib/authApi');

var BackendBase = require('../BackendBase');

var GetPaymentHistory = function () {
}

_.extend(GetPaymentHistory.prototype, BackendBase.prototype);

GetPaymentHistory.prototype.init = function (app) {

    var self = this;

    router.get('/', tokenChecker, (request, response) => {

        const transactionLogModel = TransactionLog.get();

        new Promise((res, rej) => {

            transactionLogModel.find({

                user_id: request.user._id,
                invoice_status: "deposited"

            }, (err, findResult) => {

                if (err)
                    rej(err);

                res(findResult.map(o => { return o.toObject() }));

            });

        }).then((result) => {


            self.successResponse(response, Const.responsecodeSucceed, {

                payments: result.map(o => {

                    return {
                        date: o.created,
                        amount: o.original.invoice_usd_amount + " USD"
                    }

                }).sort((a, b) => {

                    return b.date - a.date;

                })

            });

        }).catch((err) => {

            console.error(err);
            self.errorResponse(response, Const.httpCodeServerError);

        });



    });

    return router;

};


module["exports"] = new GetPaymentHistory();
