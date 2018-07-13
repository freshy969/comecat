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

var WebhookModel = require(pathTop + 'Models/Webhook');

var BackendBase = require('../BackendBase');

var WebhookController = function () {
}

_.extend(WebhookController.prototype, BackendBase.prototype);
WebhookController.prototype.init = function (app) {

	var self = this;

	/**
	  * @api {post} /api/v2/webhook Set Webhook
	  * @apiName Set Webhook
	  * @apiGroup WebAPI
	  * @apiDescription Return default web connector for the user.
	  * @apiHeader {String} access-token Users unique access-token.
	  * @apiSuccessExample Success-Response:
 
{}
 
 **/

	router.post('/', tokenChecker, function (request, response) {

		var webhookModel = WebhookModel.get();
		var url = request.body.url;

		if (url === null || url === undefined)
			return self.successResponse(response, Const.responsecodeWebhookNoURL);

		async.waterfall([function (done) {

			var result = {};

			webhookModel.findOne({
				userId: request.user._id.toString()
			}, function (err, findResult) {

				if (findResult)
					result.webhook = findResult.toObject();
				done(err, result);

			});

		},
		function (result, done) {

			if (!result.webhook) {

				const code = Utils.getRandomString(Const.APIKeyLength);

				var modelToSave = new webhookModel({
					organizationId: request.user.organizationId,
					userId: request.user._id.toString(),
					url: url,
					created: Utils.now()
				});

				modelToSave.save((err, saveResult) => {
					result.webhook = saveResult;
					done(err, result);
				});


			} else {

				webhookModel.update({
					userId: request.user._id.toString(),
					organizationId: request.user.organizationId
				}, {
						url: url
					}, (err, updateResult) => {

						result.webhook.url = url;
						done(err, result);

					});

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
					webhook: result.webhook
				});

			});


	});

	router.get('/', tokenChecker, function (request, response) {

		var webhookModel = WebhookModel.get();

		async.waterfall([function (done) {

			var result = {};

			webhookModel.findOne({
				userId: request.user._id.toString()
			}, function (err, findResult) {

				if (findResult)
					result.webhook = findResult.toObject();
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
					webhook: result.webhook
				});

			});


	});

	return router;

}

module["exports"] = new WebhookController();
