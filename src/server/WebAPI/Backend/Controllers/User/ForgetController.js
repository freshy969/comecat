/** Called for /api/v2/user/signup API */

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var async = require('async');
var sha1 = require('sha1');
var formidable = require('formidable');
var fs = require('fs-extra');
var easyimg = require('easyimage');
var url = require('url');

var pathTop = "../../../../";

var Const = require(pathTop + "lib/consts");
var Config = require(pathTop + "lib/init");
var Utils = require(pathTop + 'lib/utils');
var UserModel = require(pathTop + 'Models/User');
var GroupModel = require(pathTop + 'Models/Group');
var OrganizationModel = require(pathTop + 'Models/Organization');
var OrganizationSettingsModel = require(pathTop + 'Models/OrganizationSettings');
var NewUserLogic = require(pathTop + 'Logics/NewUser');

var tokenChecker = require(pathTop + 'lib/authApi');

var BackendBase = require('../BackendBase');

var ForgetController = function () {
}

_.extend(ForgetController.prototype, BackendBase.prototype);

ForgetController.prototype.init = function (app) {

    var self = this;

    /**
  * @api {post} /api/v2/user/forget Send New Password Email
  * @apiName Send New Password Email
  * @apiGroup WebAPI
  * @apiDescription Send New Password Email
  *   
  * @apiParam {String} email email 
  * 
  * @apiSuccessExample Success-Response:
     {
         code: 1,
         time: 1454417582385,
         data: {}
     }
 
 */

    router.post('/', (request, response) => {

        var email = request.body.email;

        var activationCode = Utils.getRandomNumber();
        var password = Utils.getRandomString(6);

        var userModel = UserModel.get();
        var organizationModel = OrganizationModel.get();

        async.waterfall([
            validate,
            checkEmail,
            sendEmail
        ], endAsync);

        /**********************
        ****** FUNCTIONS ******
        **********************/

        function validate(done) {

            // get organization 
            organizationModel.findOne({ organizationId: Config.personamOrganizationName }, (err, findResult) => {

                if (err)
                    return done(err);

                if (_.isEmpty(findResult))
                    return done({ handledError: Const.responsecodeSigninWrongOrganizationId });

                done(null, { organization: findResult.toObject() });

            });

        };

        function checkEmail(result, done) {

            userModel.findOne({
                userid: email,
                organizationId: result.organization._id.toString(),
            }, (err, findResult) => {

                if (findResult) {

                    result.registeredUser = findResult;
                    done(err, result);

                }
                else {

                    done({ handledError: Const.responsecodeForgetPasswordNoEmail }, result);

                }

            });

        };

        function sendEmail(result, done) {

            userModel.update(
                {
                    _id: result.registeredUser._id
                },
                {
                    password: Utils.getHash(password)
                },
                (err, updateResult) => {

                    const signinURL = "";

                    Utils.sendEmail(
                        email,
                        Const.emailTypeForget,
                        {
                            email: email,
                            password: password,
                            signinURL: Config.serviceURL + Config.frontEndUrl
                        },
                        (err, emailResult) => {

                            result.emailResult = emailResult;
                            done(err, result);
                        }
                    );


                }

            )

        }

        function endAsync(err, result) {

            if (err) {
                if (err.handledError) {
                    self.successResponse(response, err.handledError);
                }
                else {
                    console.log(err);
                    self.successResponse(response, Const.responsecodeUnknownError);
                }
            }
            else {
                self.successResponse(response, Const.responsecodeSucceed, {
                    code: activationCode
                });
            }

        };

    });

    return router;

}

module["exports"] = new ForgetController();
