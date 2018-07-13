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
var UsageModel = require(pathTop + 'Models/Usage');
var UserModel = require(pathTop + 'Models/User');
var OrganizationModel = require(pathTop + 'Models/Organization');
var tokenChecker = require(pathTop + 'lib/authApi');
var SocketAPIHandler = require(pathTop + 'SocketAPI/SocketAPIHandler');

var BackendBase = require('../BackendBase');

var GetUsageController = function () {
}

_.extend(GetUsageController.prototype, BackendBase.prototype);

GetUsageController.prototype.init = function (app) {

    var self = this;

    /**
      * @api {post} /api/v2/user/usage get usage
      * @apiName get usage
      * @apiGroup WebAPI
      * @apiDescription get usage
      * @apiHeader {String} access-token Users unique access-token.
 
      * @apiParam {String} Month
      
      * @apiSuccessExample Success-Response:
 {}
 
 **/

    router.get('/:monthIdentifier', tokenChecker, function (request, response) {

        var monthIdentifier = request.params.monthIdentifier;

        if (!/[0-9]{4}-[0-9]{2}/.test(monthIdentifier)) {
            self.successResponse(response, Const.responsecodeInvalidDateCode);
            return;
        }

        const usageModel = UsageModel.get();

        const result = {};

        async.waterfall([(done) => {

            // get all monthly data
            usageModel.find({
                dateType: Const.usageTypeMonth,
                userId: request.user._id
            }, (err, findResult) => {

                result.monthlyData = findResult;
                done(err, result);

            });

        }
            , (result, done) => {

                // get all daily data
                usageModel.find({
                    dateType: Const.usageTypeDate,
                    userId: request.user._id,
                    dateIdentifier: new RegExp('^' + monthIdentifier + '.*$', "i")
                }, (err, findResult) => {

                    result.dailyData = findResult;
                    done(err, result);

                });

            }], (err, result) => {

                if (err) {
                    console.log("critical err", err);
                    self.errorResponse(response, Const.httpCodeServerError);
                    return;
                }

                self.successResponse(response, Const.responsecodeSucceed, result);

            });

    });

    return router;

}

module["exports"] = new GetUsageController();
