const _ = require("lodash");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const async = require("async");

const pathTop = "../../../";
const Const = require(pathTop + "lib/consts");
const Config = require(pathTop + "lib/init");
const Utils = require(pathTop + "lib/utils");
const checkAPIKey = require(pathTop + "lib/authApiV3");
const APIBase = require("./APIBase");
const checkUserAdmin = require("../../../lib/authV3.js").checkUserAdmin;
const formidable = require("formidable");

const Connector = require(pathTop + "Models/Connector");
const UserModel = require(pathTop + "Models/User");

const UserLogic = require(pathTop + "Logics/v3/User");

const WebConnectorController = function () { };
_.extend(WebConnectorController.prototype, APIBase.prototype);

WebConnectorController.prototype.init = function (app) {
  var self = this;

  /**
   * @api {get} /api/v3/webconnector/{code} get web connector
   **/
  router.get("/:code", (request, response) => {
    const code = request.params.code;
    const query = self.checkQueries(request.query);

    const connectorModel = Connector.get();
    const userModel = UserModel.get();

    async.waterfall(
      [
        done => {
          const result = {};

          connectorModel.findOne(
            {
              webhookIdentifier: code
            }, (err, findResult) => {

              if (!findResult) {
                return response
                  .status(Const.httpCodeBadParameter);
              }

              result.webconnector = findResult.toObject();
              done(err, result);
            }
          );
        }, (result, done) => {
          // find all connectors
          connectorModel.find(
            {
              userId: result.webconnector.userId
            }, (err, findResult) => {

              result.connectors = findResult;
              done(err, result);
            }
          );
        },
        (result, done) => {

          userModel.findOne(
            {
              _id: result.webconnector.userId
            }, (err, findResult) => {

              if (!findResult) {
                return response
                  .status(Const.httpCodeBadParameter);
              }

              result.user = findResult.toObject();
              done(err, result);
            }
          );
        }
      ],
      (err, result) => {
        if (err) {
          if (err.status && err.message)
            response.status(err.status).send(err.message);
          else response.status(500).send("Server Error");

          return;
        }

        result.user.id = result.user._id;

        // filter connectors
        const connectors = result.connectors.map((connector) => {

          if (connector.connectorIdentifier == 'facebook') {
            return ['facebook', { pageName: connector.settings.pageName }];

          } else if (connector.connectorIdentifier == 'line') {
            return ['line', { lineID: connector.settings.lineID }];

          } else if (connector.connectorIdentifier == 'viber') {
            return ['viber', { URI: connector.settings.URI }];

          } else if (connector.connectorIdentifier == 'telegram') {
            return ['telegram', { botName: connector.settings.botName }];

          } else if (connector.connectorIdentifier == 'kik') {
            return ['kik', { botName: connector.settings.botName }];


          } else {
            return null;
          }

        });

        const connectorsReformed = {};

        connectors.forEach((connector) => {

          if (connector) {
            connectorsReformed[connector[0]] = connector[1];
          }

        });

        if (result.connectors.find((connector) => {

        }));

        self.successResponse(response, Const.responsecodeSucceed, {
          user: {
            id: result.user.id,
            name: result.user.name,
            avatar: result.user.avatar,
            cover: result.user.cover,
            background: result.user.background,
            description: result.user.description
          },
          webconnector: result.webconnector,
          connectors: connectorsReformed
        });
      }

    );

  });


  return router;

}

module["exports"] = new WebConnectorController();
