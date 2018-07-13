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
var ConnectorModel = require(pathTop + 'Models/Connector');
var BackendBase = require('../BackendBase');

var ViberAdapter = require(pathTop + 'WebAPI/Connectors/adapters/Viber');
var KikAdapter = require(pathTop + 'WebAPI/Connectors/adapters/Kik');
var TelegramAdapter = require(pathTop + 'WebAPI/Connectors/adapters/Telegram');

var ServiceConnectorController = function () {
}

_.extend(ServiceConnectorController.prototype, BackendBase.prototype);
ServiceConnectorController.prototype.init = function (app) {

	var self = this;

	/**
	  * @api {post} /api/v2/connector/social Social Connector
	  * @apiName Social Connector
	  * @apiGroup WebAPI
	  * @apiDescription Return social connector for the user
	  * @apiHeader {String} access-token Users unique access-token.
	  * @apiSuccessExample Success-Response:
 
{}
 
 **/

	router.get('/:connectorIdentifier', tokenChecker, function (request, response) {

		var connectorModel = ConnectorModel.get();
		var connectorIdentifier = request.params.connectorIdentifier;

		if (connectorIdentifier === null || connectorIdentifier === undefined)
			return self.successResponse(response, Const.responsecodeWebhookNoURL);

		async.waterfall([function (done) {

			var result = {};

			connectorModel.findOne({
				userId: request.user._id.toString(),
				connectorIdentifier: connectorIdentifier
			}, function (err, findResult) {

				result.connector = findResult;
				done(err, result);

			});

		},
		function (result, done) {

			if (!result.connector) {

				const code = Utils.getRandomString(6);

				const params = {
					organizationId: request.user.organizationId,
					userId: request.user._id.toString(),
					connectorIdentifier: connectorIdentifier,
					webhookIdentifier: code,
					settings: {
						tmp: Utils.getRandomString(6)
					},
					created: Utils.now(),
					status: Const.integrationStateDisabled
				};

				if (connectorIdentifier == 'facebook') {
					params.settings.verifyToken = Utils.getRandomString(6);
				}

				if (connectorIdentifier == 'wechat') {
					params.settings.apiToken = Utils.getRandomString(12);
				}

				var modelToSave = new connectorModel(params);

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

	/**
  * @api {post} /api/v2/connector/service Save social settings for users
  * @apiName Save social settings
  * @apiGroup WebAPI
  * @apiDescription Return social connector for the user
  * @apiHeader {String} access-token Users unique access-token.
  * @apiSuccessExample Success-Response:
 
{}
 
**/

	router.post('/', tokenChecker, function (request, response) {

		var connectorModel = ConnectorModel.get();
		var connectorIdentifier = request.body.connectorIdentifier;
		var settings = request.body.settings;

		if (connectorIdentifier === null || connectorIdentifier === undefined)
			return self.successResponse(response, Const.responsecodeWrongParamForSocial);

		if (settings === null || settings === undefined)
			return self.successResponse(response, Const.responsecodeWrongParamForSocial);

		async.waterfall([function (done) {

			var result = {};

			connectorModel.findOne({
				userId: request.user._id.toString(),
				connectorIdentifier: connectorIdentifier
			}, function (err, findResult) {

				if (!findResult)
					return self.successResponse(response, Const.responsecodeWrongParamForSocial);

				result.connector = findResult;
				done(err, result);

			});


		},
		function (result, done) {

			connectorModel.update({
				userId: request.user._id.toString(),
				connectorIdentifier: connectorIdentifier
			}, {
					settings: settings,
					status: Const.integrationStateWaiting
				}, (err, updateResult) => {

					result.connector.settings = settings;
					result.connector.status = Const.integrationStateWaiting;

					done(err, result);

				});

		},
		function (result, done) {

			// do platform specific stuff
			if (connectorIdentifier == 'viber'
				&& settings.apiKey && settings.apiKey.length > 0) {

				ViberAdapter.setupWebHook(
					settings.apiKey,
					Config.serviceURL + "/social/" + result.connector.webhookIdentifier, (setupWebHookError, viberResult) => {

						if (setupWebHookError) {

							connectorModel.update({
								_id: result.connector._id
							}, {
									status: Const.integrationStateDisabled,
									error: setupWebHookError
								}, (err, updateResult) => {

									result.connector.status = Const.integrationStateDisabled;
									result.connector.error = setupWebHookError;

									done(null, result);

								});

						} else {
							done(null, result);
						}

					});
			} else if (connectorIdentifier == 'kik'
				&& settings.apiKey && settings.apiKey.length > 0) {

				KikAdapter.setupWebHook(
					settings,
					Config.serviceURL + "/social/" + result.connector.webhookIdentifier, (setupWebHookError, viberResult) => {

						if (setupWebHookError) {

							connectorModel.update({
								_id: result.connector._id
							}, {
									status: Const.integrationStateDisabled,
									error: setupWebHookError
								}, (err, updateResult) => {

									result.connector.status = Const.integrationStateDisabled;
									result.connector.error = setupWebHookError;

									done(null, result);

								});

						} else {
							done(null, result);
						}

					});

			} else if (connectorIdentifier == 'telegram'
				&& settings.accessToken && settings.accessToken.length > 0) {

				TelegramAdapter.setupWebHook(
					settings,
					Config.serviceURL + "/social/" + result.connector.webhookIdentifier, (setupWebHookError, viberResult) => {

						if (setupWebHookError) {

							connectorModel.update({
								_id: result.connector._id
							}, {
									status: Const.integrationStateDisabled,
									error: setupWebHookError
								}, (err, updateResult) => {

									result.connector.status = Const.integrationStateDisabled;
									result.connector.error = setupWebHookError;

									done(null, result);

								});

						} else {
							done(null, result);
						}

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

	/**
	* @api {post} /api/v2/connector/service/bot Save bot settings for connector
	* @apiName Save bot settings
	* @apiGroup WebAPI
	* @apiDescription Return social connector for the user
	* @apiHeader {String} access-token Users unique access-token.
	* @apiSuccessExample Success-Response:
	 
	{}
	 
	**/

	router.post('/bot', tokenChecker, function (request, response) {

		var connectorModel = ConnectorModel.get();
		var connectorIdentifier = request.body.connectorIdentifier;
		var botId = request.body.botId;

		if (connectorIdentifier === null || connectorIdentifier === undefined)
			return self.successResponse(response, Const.responsecodeWrongParamForSocial);

		if (botId === null || botId === undefined)
			return self.successResponse(response, Const.responsecodeWrongParamForSocial);

		async.waterfall([function (done) {

			var result = {};

			connectorModel.findOne({
				userId: request.user._id.toString(),
				connectorIdentifier: connectorIdentifier
			}, function (err, findResult) {

				if (!findResult)
					return self.successResponse(response, Const.responsecodeWrongParamForSocial);

				result.connector = findResult;
				done(err, result);

			});


		},
		function (result, done) {

			connectorModel.update({
				userId: request.user._id.toString(),
				connectorIdentifier: connectorIdentifier
			}, {
					botId: botId
				}, (err, updateResult) => {

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
					connector: result.connector
				});

			});

	});

	return router;

}

module["exports"] = new ServiceConnectorController();
