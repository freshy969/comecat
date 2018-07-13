/**  Search User */

var _ = require('lodash');
var async = require('async');

var Const = require("../lib/consts");
var Config = require("../lib/init");
var Utils = require("../lib/utils");

var DatabaseManager = require('../lib/DatabaseManager');
var SocketAPIHandler = require('../SocketAPI/SocketAPIHandler');

var PermissionLogic = require('./Permission');
var GetUserOnlineStatus = require('./GetUserOnlineStatus');

var UserModel = require('../Models/User');
var UserContactsModel = require('../Models/UserContacts');
var RoomModel = require('../Models/Room');
var GroupModel = require('../Models/Group');
var HistoryModel = require('../Models/History');
var OrganizationModel = require('../Models/Organization');

var SearchUser = {

    search: function (baseUser, keyword, page, onSuccess, onError) {

        if (Config.phoneNumberSignin)
            return this.searchContacts(baseUser, keyword, page, onSuccess, onError);


        if (keyword && keyword.length > 0)
            return this.searchOrganization(baseUser, keyword, page, onSuccess, onError);
        else
            return this.getUsersFromHistory(baseUser, keyword, page, onSuccess, onError);

    },

    getUsersFromHistory: function (baseUser, keyword, page, onSuccess, onError) {

        var user = baseUser;
        var organizationId = baseUser.organizationId;
        var historyModel = HistoryModel.get();
        var userModel = UserModel.get();

        async.waterfall([

            function (done) {

                const result = {};

                var conditions = {
                    userId: baseUser._id.toString(),
                    chatType: Const.chatTypePrivate
                };

                var query = historyModel.find(conditions)
                    .skip(Const.pagingRows * page)
                    .sort({ 'sortName': 'asc' })
                    .limit(Const.pagingRows);

                query.exec(function (err, data) {

                    if (err) {
                        done(err, null);
                        return;
                    }
                    data = data.map(function (item) {
                        return item.toObject();
                    });

                    result.history = data;

                    done(err, result);

                });

            },
            function (result, done) {

                var conditions = {
                    userId: baseUser._id.toString(),
                    chatType: Const.chatTypePrivate
                };

                historyModel.count(conditions, function (err, countResult) {

                    result.count = countResult;

                    done(null, result);

                });

            },
            function (result, done) {

                const userIds = result.history.map((row) => {
                    return row.chatId
                });

                userModel.find({
                    _id: userIds
                }, (err, findResult) => {
                    result.list = findResult.map(row => { return row.toObject() });
                    done(null, result);
                });

            },
            function (result, done) {

                var userIds = _.pluck(result.list, '_id');

                GetUserOnlineStatus.get(userIds, function (err, onlineStatusResult) {

                    _.forEach(onlineStatusResult, function (row) {

                        if (!row.userId)
                            return;

                        var key = _.findKey(result.list, function (userForKey) {

                            return userForKey._id == row.userId;

                        });

                        result.list[key].onlineStatus = row.onlineStatus;

                    });

                    done(null, result);

                });

            }
        ],
            function (err, result) {

                if (err) {
                    if (onError)
                        onError(err);

                    return;
                }

                if (onSuccess)
                    onSuccess(result);

            });

    },

    searchPerson: function (baseUser, keyword, page, onSuccess, onError) {

        var splitted = keyword.split("@");

        var userId = splitted[0];
        var organiztionId = splitted[1];

        if (!userId || !organiztionId) {

            onSuccess({
                list: [],
                count: 0
            });

            return;

        }

        async.waterfall([
            function (done) {

                var result = {};

                var organizationModel = OrganizationModel.get();

                organizationModel.findOne({ organizationId: organiztionId }, function (err, organizationResult) {

                    result.organization = organizationResult;

                    if (organizationResult) {
                        done(err, result)
                    } else {
                        done("no organization", result)
                    }


                });


            },
            function (result, done) {

                var userModel = UserModel.get();

                userModel.findOne({
                    userid: userId,
                    organizationId: result.organization._id,
                    isGuest: { $ne: 1 }
                }, function (err, userResult) {

                    result.user = userResult;
                    done(err, result)

                });

            },
            function (result, done) {

                done(null, result);

            }
        ],
            function (err, result) {

                if (result.user && result.organization) {

                    onSuccess({
                        list: [result.user],
                        count: 1
                    });

                } else {

                    onSuccess({
                        list: [],
                        count: 0
                    });

                }

            });


    },
    searchOrganization: function (baseUser, keyword, page, onSuccess, onError) {

        var user = baseUser;
        var organizationId = baseUser.organizationId;
        var model = UserModel.get();

        async.waterfall([

            function (done) {

                const result = {};

                var conditions = {
                    organizationId: organizationId,
                    status: 1,
                    isGuest: { $ne: 1 },
                    _id: { $ne: user._id },

                };

                if (!_.isEmpty(keyword)) {
                    conditions['$or'] = [
                        //{ name: new RegExp('^.*' + Utils.escapeRegExp(keyword) + '.*$', "i") },
                        //{ sortName: new RegExp('^.*' + Utils.escapeRegExp(keyword) + '.*$', "i") },
                        //{ description: new RegExp('^.*' + Utils.escapeRegExp(keyword) + '.*$', "i") },
                        { userid: keyword }
                    ];
                }

                var query = model.find(conditions)
                    .skip(Const.pagingRows * page)
                    .sort({ 'sortName': 'asc' })
                    .limit(Const.pagingRows);

                query.exec(function (err, data) {

                    if (err) {
                        done(err, null);
                        return;
                    }
                    data = data.map(function (item) {
                        return item.toObject();
                    });

                    result.list = data;

                    done(err, result);

                });

            },
            function (result, done) {

                var conditions = {
                    organizationId: organizationId,
                    status: 1,
                    groups: { $in: result.groups },
                    _id: { $ne: user._id }
                };

                if (!_.isEmpty(keyword)) {
                    conditions['$or'] = [
                        { name: new RegExp('^.*' + Utils.escapeRegExp(keyword) + '.*$', "i") },
                        { description: new RegExp('^.*' + Utils.escapeRegExp(keyword) + '.*$', "i") },
                    ];
                }

                model.count(conditions, function (err, countResult) {

                    result.count = countResult;

                    done(null, result);

                });

            },
            function (result, done) {

                var userIds = _.pluck(result.list, '_id');

                GetUserOnlineStatus.get(userIds, function (err, onlineStatusResult) {

                    _.forEach(onlineStatusResult, function (row) {

                        if (!row.userId)
                            return;

                        var key = _.findKey(result.list, function (userForKey) {

                            return userForKey._id == row.userId;

                        });

                        result.list[key].onlineStatus = row.onlineStatus;

                    });

                    done(null, result);

                });

            }
        ],
            function (err, result) {

                if (err) {
                    if (onError)
                        onError(err);

                    return;
                }

                if (onSuccess)
                    onSuccess(result);

            });

    },
    searchContacts: function (baseUser, keyword, page, onSuccess, onError) {

        var user = baseUser;
        var organizationId = baseUser.organizationId;

        var model = UserModel.get();
        var userContactsModel = UserContactsModel.get();

        async.waterfall([

            function (done) {

                var result = {};

                userContactsModel.find({ userId: user._id.toString() }, (err, findResult) => {

                    result.userContacts = findResult;
                    done(err, result);

                });

            },
            function (result, done) {

                var conditions = {
                    _id: { $in: _.map(result.userContacts, "contactId") }
                };

                if (!_.isEmpty(keyword)) {
                    conditions['$or'] = [
                        { name: new RegExp('^.*' + Utils.escapeRegExp(keyword) + '.*$', "i") },
                        { sortName: new RegExp('^.*' + Utils.escapeRegExp(keyword) + '.*$', "i") },
                        { description: new RegExp('^.*' + Utils.escapeRegExp(keyword) + '.*$', "i") }
                    ];
                }

                var query = model.find(conditions)
                    .skip(Const.pagingRows * page)
                    .sort({ 'sortName': 'asc' })
                    .limit(Const.pagingRows);

                query.exec(function (err, data) {

                    if (err) {
                        done(err, null);
                        return;
                    }

                    var userContactName = "";

                    data = data.map(function (item) {
                        item = item.toObject();

                        userContactName = _.find(result.userContacts, { contactId: item._id.toString() }).name;

                        if (userContactName) data
                        item.name = userContactName;

                        return item;
                    });

                    result.list = data;

                    done(err, result);

                });

            },
            function (result, done) {

                var conditions = {
                    _id: { $in: _.map(result.userContacts, "contactId") }
                };

                if (!_.isEmpty(keyword)) {
                    conditions['$or'] = [
                        { name: new RegExp('^.*' + Utils.escapeRegExp(keyword) + '.*$', "i") },
                        { sortName: new RegExp('^.*' + Utils.escapeRegExp(keyword) + '.*$', "i") },
                        { description: new RegExp('^.*' + Utils.escapeRegExp(keyword) + '.*$', "i") }
                    ];
                }

                model.count(conditions, function (err, countResult) {

                    result.count = countResult;

                    done(null, result);

                });

            },
            function (result, done) {

                var userIds = _.pluck(result.list, '_id');

                GetUserOnlineStatus.get(userIds, function (err, onlineStatusResult) {

                    _.forEach(onlineStatusResult, function (row) {

                        if (!row.userId)
                            return;

                        var key = _.findKey(result.list, function (userForKey) {

                            return userForKey._id == row.userId;

                        });

                        result.list[key].onlineStatus = row.onlineStatus;

                    });

                    done(null, result);

                });

            }
        ],
            function (err, result) {

                if (err) {
                    if (onError)
                        onError(err);

                    return;
                }

                if (onSuccess)
                    onSuccess(result);

            });

    }

};


module["exports"] = SearchUser;

