/**  Hook Model */

var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');

var Const = require("../lib/consts");
var Config = require("../lib/init");
var DatabaseManager = require('../lib/DatabaseManager');
var Utils = require("../lib/utils");

var BaseModel = require('./BaseModel');


var Order = function () { };

_.extend(Order.prototype, BaseModel.prototype);

Order.prototype.init = function (mongoose) {

    this.schema = new mongoose.Schema({
        user_id: { type: String, index: true },
        order_id: { type: String, index: true },
        plan_name: String,
        payment_status: String,
        created: Number,
        transaction: Object
    });

    this.model = mongoose.model(Config.dbCollectionPrefix + "orders", this.schema);

}

Order.get = function () {

    return DatabaseManager.getModel('Order').model;

}

module["exports"] = Order;
