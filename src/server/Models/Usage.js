/**  Hook Model */

var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');

var Const = require("../lib/consts");
var Config = require("../lib/init");
var DatabaseManager = require('../lib/DatabaseManager');
var Utils = require("../lib/utils");

var BaseModel = require('./BaseModel');


var UsageModel = function () { };

_.extend(UsageModel.prototype, BaseModel.prototype);

UsageModel.prototype.init = function (mongoose) {

    this.schema = new mongoose.Schema({
        organizationId: { type: String, index: true },
        userId: { type: String, index: true },
        dateType: Number, // 1: daily, 2: monthly
        paymentType: Number, // 1: free, 2: paid
        dateIdentifier: { type: String, index: true },
        count: Number,
        lastCount: Number, // only for monthly needs to recovery batch fail
        lastUpdateDate: String, // only for monthly needs to recovery batch fail
        updated: Number,
        created: Number
    });

    this.model = mongoose.model(Config.dbCollectionPrefix + "usage", this.schema);

}

UsageModel.get = function () {

    return DatabaseManager.getModel('Usage').model;

}

module["exports"] = UsageModel;
