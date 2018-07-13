/**  User Model */

var _ = require('lodash');
var mongoose = require('mongoose');

var Const = require("../lib/consts");
var Config = require("../lib/init");
var DatabaseManager = require('../lib/DatabaseManager');
var Utils = require("../lib/utils");

var BaseModel = require('./BaseModel');
var User = function () { };

_.extend(User.prototype, BaseModel.prototype);

User.prototype.init = function (mongoose) {

    this.schema = new mongoose.Schema({
        name: String,
        sortName: String,
        description: String,
        userid: String,
        password: String,
        created: Number,
        token: [],
        pushToken: [],
        webPushSubscription: [
            {
                endpoint: String,
                expiration: mongoose.Schema.Types.Mixed,
                keys: {}
            }
        ],
        voipPushToken: [],
        organizationId: { type: String, index: true },
        status: Number, // 1: Enabled, 0: Disabled
        avatar: {
            picture: {
                originalName: String,
                size: Number,
                mimeType: String,
                nameOnServer: String
            },
            thumbnail: {
                originalName: String,
                size: Number,
                mimeType: String,
                nameOnServer: String
            }
        },
        cover: {
            picture: {
                originalName: String,
                size: Number,
                mimeType: String,
                nameOnServer: String
            },
            thumbnail: {
                originalName: String,
                size: Number,
                mimeType: String,
                nameOnServer: String
            }
        },
        background: {
            picture: {
                originalName: String,
                size: Number,
                mimeType: String,
                nameOnServer: String
            },
            thumbnail: {
                originalName: String,
                size: Number,
                mimeType: String,
                nameOnServer: String
            }
        },
        groups: [String],
        permission: Number, // 1: user (za web client), 2: organizatinAdmin, 3: subAdmin,
        isGuest: Number,
        muted: [],
        blocked: [],
        devices: [],
        UUID: [],
        phoneNumber: String,
        activationCode: String,
        subscription: String,
        sandbox: Boolean
    });

    this.model = mongoose.model(Config.dbCollectionPrefix + "User", this.schema);

}

User.get = function () {

    return DatabaseManager.getModel('User').model;

}


User.getUsersById = function (userIds, callBack) {

    var model = DatabaseManager.getModel('User').model;

    model.find({ _id: { "$in": userIds } }, function (err, result) {

        if (err) throw err;

        if (callBack)
            callBack(result);

    });

};

User.getUserById = function (userId, callBack) {

    var model = DatabaseManager.getModel('User').model;

    model.findOne({ _id: userId }, function (err, result) {

        // comment out here because sometime webhook can send text which is not objectid
        //if (err) throw err;

        if (callBack)
            callBack(result);

    });

};

User.findUsersbyId = function (aryId, callBack) {

    var conditions = [];
    aryId.forEach(function (userId) {

        conditions.push({
            _id: userId
        });

    });

    var model = this.get();

    var query = model.find({
        $or: conditions
    }).sort({ 'created': 1 });

    query.exec(function (err, data) {

        if (err)
            console.error(err);

        if (callBack)
            callBack(err, data)

    });

};

User.defaultResponseFields = {
    _id: true,
    description: true,
    name: true,
    organizationId: true,
    userid: true,
    avatar: true
}

module["exports"] = User;
