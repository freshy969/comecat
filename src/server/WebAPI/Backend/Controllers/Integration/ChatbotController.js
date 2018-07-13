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

var ChatbotSettingsModel = require(pathTop + 'Models/ChatbotSettings');

var BackendBase = require('../BackendBase');

var ChatbotController = function () {
}

_.extend(ChatbotController.prototype, BackendBase.prototype);
ChatbotController.prototype.init = function (app) {

	var self = this;

	/**
  * @api {post} /api/v2/chatbot/all get all enabled bot
  * @apiName Get all enabled bot
  * @apiGroup WebAPI
  * @apiDescription Get all enabled bot
  * @apiHeader {String} access-token Users unique access-token.
  * @apiSuccessExample Success-Response:
 
{}
 
**/

	router.get('/all', tokenChecker, function (request, response) {

		var chatbotSettingsModel = ChatbotSettingsModel.get();

		async.waterfall([function (done) {

			var result = {};

			chatbotSettingsModel.find({
				userId: request.user._id.toString()
			}, function (err, findResult) {

				result.chatbots = findResult;
				done(err, result);

			});

		},
		function (result, done) {

			done(null, result);

		}], (err, result) => {

			if (err) {
				console.log("critical err", err);
				self.errorResponse(response, Const.httpCodeServerError);
				return;
			}

			self.successResponse(response, Const.responsecodeSucceed, {
				chatbots: result.chatbots
			});

		});

	});

	/**
	  * @api {post} /api/v2/chatbot save chatbot settings
	  * @apiName Chatbot Settings
	  * @apiGroup WebAPI
	  * @apiDescription Save chatbot settings
	  * @apiHeader {String} access-token Users unique access-token.
	  * @apiSuccessExample Success-Response:
 
{}
 
 **/

	router.get('/:chatbotIdentifier', tokenChecker, function (request, response) {

		var chatbotSettingsModel = ChatbotSettingsModel.get();
		var chatbotIdentifier = request.params.chatbotIdentifier;

		if (chatbotIdentifier === null || chatbotIdentifier === undefined)
			return self.successResponse(response, Const.responsecodeWebhookNoURL);

		async.waterfall([function (done) {

			var result = {};

			chatbotSettingsModel.findOne({
				userId: request.user._id.toString(),
				chatbotIdentifier: chatbotIdentifier
			}, function (err, findResult) {

				result.settings = findResult;
				done(err, result);

			});

		},
		function (result, done) {

			if (!result.settings) {

				const params = {
					organizationId: request.user.organizationId,
					userId: request.user._id.toString(),
					chatbotIdentifier: chatbotIdentifier,
					settings: {
					},
					status: Const.integrationStateDisabled,
					created: Utils.now()
				};

				var modelToSave = new chatbotSettingsModel(params);

				modelToSave.save((err, saveResult) => {
					result.settings = saveResult;
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
					settings: result.settings
				});

			});

	});

	/**
  * @api {post} /api/v2/connector/social Save social settings for users
  * @apiName Save social settings
  * @apiGroup WebAPI
  * @apiDescription Return social connector for the user
  * @apiHeader {String} access-token Users unique access-token.
  * @apiSuccessExample Success-Response:
 
{}
 
**/

	router.post('/', tokenChecker, function (request, response) {

		var chatbotSettingsModel = ChatbotSettingsModel.get();
		var chatbotIdentifier = request.body.chatbotIdentifier;
		var settings = request.body.settings;

		if (chatbotIdentifier === null || chatbotIdentifier === undefined)
			return self.successResponse(response, Const.responsecodeWrongParamForSocial);

		if (settings === null || settings === undefined)
			return self.successResponse(response, Const.responsecodeWrongParamForSocial);

		async.waterfall([function (done) {

			var result = {};

			chatbotSettingsModel.findOne({
				userId: request.user._id.toString(),
				chatbotIdentifier: chatbotIdentifier
			}, function (err, findResult) {

				if (!findResult)
					return self.successResponse(response, Const.responsecodeWrongParamForSocial);

				result.settings = findResult;
				done(err, result);

			});

		},
		function (result, done) {

			let status = result.settings.status;

			if (chatbotIdentifier == 'dialogflow') {

				if (settings.accessToken &&
					settings.accessToken.length > 0)

					status = Const.integrationStateWaiting;
				else
					status = Const.integrationStateDisabled;
			}

			if (chatbotIdentifier == 'watson') {

				if (
					settings.username &&
					settings.username.length > 0 &&
					settings.pass &&
					settings.pass.length > 0 &&
					settings.workspaceID &&
					settings.workspaceID.length > 0
				)

					status = Const.integrationStateWaiting;
				else
					status = Const.integrationStateDisabled;
			}

			chatbotSettingsModel.update({
				userId: request.user._id.toString(),
				chatbotIdentifier: chatbotIdentifier
			}, {
					settings: settings,
					status: status
				}, (err, updateResult) => {

					result.settings.settings = settings;
					result.settings.status = status;

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
					settings: result.settings
				});

			});

	});

	return router;

}

module["exports"] = new ChatbotController();
