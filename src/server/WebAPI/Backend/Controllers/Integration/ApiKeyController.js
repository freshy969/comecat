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

var APIKeyModel = require(pathTop + 'Models/APIKey');

var BackendBase = require('../BackendBase');

var ApiKeyController = function () {
}

_.extend(ApiKeyController.prototype, BackendBase.prototype);
ApiKeyController.prototype.init = function (app) {

	var self = this;

	/**
	  * @api {get} /api/v2/apikey Default Apikey
	  * @apiName Default Apikey
	  * @apiGroup WebAPI
	  * @apiDescription Return default web connector for the user.
	  * @apiHeader {String} access-token Users unique access-token.
	  * @apiSuccessExample Success-Response:
 
{}
 
 **/

	router.get('/', tokenChecker, function (request, response) {


		var apiKeyModel = APIKeyModel.get();

		async.waterfall([function (done) {

			var result = {};

			apiKeyModel.findOne({
				userId: request.user._id.toString(),
				isDefault: true
			}, function (err, findResult) {

				result.apikey = findResult;

				done(err, result);

			});


		},
		function (result, done) {

			if (!result.apikey) {

				const code = Utils.getRandomString(Const.APIKeyLength);

				var modelToSave = new apiKeyModel({
					organizationId: request.user.organizationId,
					userId: request.user._id.toString(),
					isDefault: true,
					key: code,
					state: 1,
					created: Utils.now()
				});

				modelToSave.save((err, saveResult) => {
					result.apikey = saveResult;
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
					apikey: result.apikey
				});

			});


	});

	router.post('/reset', tokenChecker, function (request, response) {


		var apiKeyModel = APIKeyModel.get();

		async.waterfall([function (done) {

			var result = {};

			apiKeyModel.remove({
				userId: request.user._id.toString(),
				isDefault: true
			}, function (err, findResult) {

				done(err, result);

			});


		},
		function (result, done) {

			const code = Utils.getRandomString(Const.APIKeyLength);

			var modelToSave = new apiKeyModel({
				organizationId: request.user.organizationId,
				userId: request.user._id.toString(),
				isDefault: true,
				key: code,
				state: 1,
				created: Utils.now()
			});

			modelToSave.save((err, saveResult) => {
				result.apikey = saveResult;
				done(err, result);
			});

		}
		],
			function (err, result) {

				if (err) {
					console.log("critical err", err);
					self.errorResponse(response, Const.httpCodeServerError);
					return;
				}

				self.successResponse(response, Const.responsecodeSucceed, {
					apikey: result.apikey
				});

			});


	});

	return router;

}

module["exports"] = new ApiKeyController();
