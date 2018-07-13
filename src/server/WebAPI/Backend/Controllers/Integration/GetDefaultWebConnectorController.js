/** Called for /api/v2/connector/default API */

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var async = require('async');

var pathTop = "../../../../";

var Const = require(pathTop + "lib/consts");
var Config = require(pathTop + "lib/init");
var DatabaseManager = require(pathTop + 'lib/DatabaseManager');
var Utils = require(pathTop + 'lib/utils');

var tokenChecker = require(pathTop + 'lib/authApi');

var Connector = require(pathTop + 'Models/Connector');

var BackendBase = require('../BackendBase');

var GetDefaultWebConnectorController = function () {
}

_.extend(GetDefaultWebConnectorController.prototype, BackendBase.prototype);
GetDefaultWebConnectorController.prototype.init = function (app) {

	var self = this;

	/**
	  * @api {get} /api/v2/connector/default Default Connector
	  * @apiName Default Connector
	  * @apiGroup WebAPI
	  * @apiDescription Return default web connector for the user.
	  * @apiHeader {String} access-token Users unique access-token.
	  * @apiSuccessExample Success-Response:
 
{}
 
 **/

	router.get('/default', tokenChecker, function (request, response) {

		var connectorModel = Connector.get();

		async.waterfall([function (done) {

			var result = {};

			connectorModel.findOne({
				userId: request.user._id.toString(),
				isDefault: true
			}, function (err, findResult) {

				result.connector = findResult;

				done(err, result);

			});


		},
		function (result, done) {

			if (!result.connector) {

				const code = Utils.getRandomString(6);

				var modelToSave = new connectorModel({
					userId: request.user._id.toString(),
					isDefault: true,
					connectorIdentifier: "web",
					webhookIdentifier: code,
					created: Utils.now()
				});

				modelToSave.save((err, saveResult) => {

					result.connector = saveResult;
					done(err, result);
				});


			} else {
				done(null, result);
			}

		}
		],
			function (err, result) {

				if (err) {
					console.log("critical err", err);
					self.errorResponse(response, Const.httpCodeServerError);
					return;
				}

				self.successResponse(response, Const.responsecodeSucceed, {
					connector: result.connector
				});

			});

	});

	return router;

}

module["exports"] = new GetDefaultWebConnectorController();
