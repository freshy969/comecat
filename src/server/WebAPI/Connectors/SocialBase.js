/**  Base Controlelr for all Backend API Controllers */

var _ = require('lodash');
var async = require('async');

var pathTop = "../../";

var Const = require(pathTop + "lib/consts");
var Config = require(pathTop + "lib/init");
var DatabaseManager = require(pathTop + 'lib/DatabaseManager');
var Utils = require(pathTop + 'lib/utils');

const formidable = require('formidable');
const path = require('path');

var SocialBase = function () {

}

var Base = require('../BaseController');

_.extend(SocialBase.prototype, Base.prototype);

SocialBase.prototype.errorResponse = (response, httpCode) => {
    response.status(httpCode).send("");
}

SocialBase.prototype.successResponse = (response, code, data) => {
    response.status(Const.httpCodeSucceed);
    response.set('connection', 'Keep-alive');
    response.json(data);
}

module["exports"] = SocialBase;