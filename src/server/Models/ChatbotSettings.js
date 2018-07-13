/**  Hook Model */

var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');

var Const = require("../lib/consts");
var Config = require("../lib/init");
var DatabaseManager = require('../lib/DatabaseManager');
var Utils = require("../lib/utils");

var BaseModel = require('./BaseModel');


var ChatbotSettings = function () { };

_.extend(ChatbotSettings.prototype, BaseModel.prototype);

ChatbotSettings.prototype.init = function (mongoose) {

    this.schema = new mongoose.Schema({
        organizationId: { type: String, index: true },
        userId: { type: String, index: true },
        chatbotIdentifier: String,
        settings: Object,
        created: Number,
        status: Number, // 0: disabled 1: enabled 2: waiting
        error: String
    });

    this.model = mongoose.model(Config.dbCollectionPrefix + "chatbot_settings", this.schema);

}

ChatbotSettings.get = function () {

    return DatabaseManager.getModel('ChatbotSettings').model;

}

module["exports"] = ChatbotSettings;
