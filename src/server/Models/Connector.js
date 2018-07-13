/**  Hook Model */

var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');

var Const = require("../lib/consts");
var Config = require("../lib/init");
var DatabaseManager = require('../lib/DatabaseManager');
var Utils = require("../lib/utils");

var BaseModel = require('./BaseModel');


var Connector = function () { };

_.extend(Connector.prototype, BaseModel.prototype);

Connector.prototype.init = function (mongoose) {

    this.schema = new mongoose.Schema({
        organizationId: { type: String, index: true },
        userId: { type: String, index: true },
        botId: { type: String, index: true },
        connectorIdentifier: String,
        webhookIdentifier: { type: String, index: true },
        settings: Object,
        created: Number,
        isDefault: Boolean,
        status: Number, // 0: disabled 1: enabled 2: waiting
        error: String
    });

    this.model = mongoose.model(Config.dbCollectionPrefix + "connectors", this.schema);

}

Connector.get = function () {

    return DatabaseManager.getModel('Connector').model;

}

module["exports"] = Connector;
