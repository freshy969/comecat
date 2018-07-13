/**  Hook Model */

var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');

var Const = require("../lib/consts");
var Config = require("../lib/init");
var DatabaseManager = require('../lib/DatabaseManager');
var Utils = require("../lib/utils");

var BaseModel = require('./BaseModel');


var TransactionLog = function () { };

_.extend(TransactionLog.prototype, BaseModel.prototype);

TransactionLog.prototype.init = function (mongoose) {

    this.schema = new mongoose.Schema({
        message_type: String,
        user_id: { type: String, index: true },
        order_id: { type: String, index: true },
        invoice_id: { type: String, index: true },
        invoice_status: String,
        created: Number,
        original: Object
    });

    this.model = mongoose.model(Config.dbCollectionPrefix + "transaction_log", this.schema);

}

TransactionLog.get = function () {

    return DatabaseManager.getModel('TransactionLog').model;

}

module["exports"] = TransactionLog;
