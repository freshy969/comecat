/** Generate users for testing purpose  */

var fs = require('fs-extra');
var _ = require('lodash');
var sha1 = require('sha1');
var http = require('http');
var Stream = require('stream').Transform;
var async = require('async');

var DatabaseManager = require('../server/lib/DatabaseManager');
var UserModel = require('../server/Models/User');
var UsageModel = require('../server/Models/Usage');
var RoomModel = require('../server/Models/Room');
var MessageModel = require('../server/Models/Message');

var Utils = require('../server/lib/utils');
var init = require('../server/lib/init');
var Const = require('../server/lib/consts');

init.uploadPath = init.uploadPath + "/";

const messageType = {
    free: 1,
    paid: 2
}

const baseDate = new Date();
baseDate.setDate(baseDate.getDate() - 1);

let monthStr = baseDate.getMonth() + 1;
if (monthStr < 10)
    monthStr = "0" + monthStr;

let date = baseDate.getDate();
if (date < 10)
    date = "0" + date;

const today = baseDate.getFullYear() + "-" + monthStr + "-" + date;
const month = baseDate.getFullYear() + "-" + monthStr;

const unixTSTodayFrom = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - 1, 0, 0, 0, 000).getTime();
const unixTSTodayTo = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - 1, 23, 59, 59, 999).getTime() * 2;

//const unixTSTodayFrom = 0;
//const unixTSTodayTo = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - 1, 23, 59, 59, 999).getTime() * 2;

function getTodaysMessages() {

    return new Promise((res, rej) => {

        const messageModel = MessageModel.get();

        var date = new Date();

        messageModel.find({
            $and: [
                { created: { $gt: unixTSTodayFrom } },
                { created: { $lt: unixTSTodayTo } }
            ]
        }, (err, findResult) => {

            if (err)
                return rej(err);

            res(findResult);

        });

    });

}

function getUsers(userIds) {

    return new Promise((res, rej) => {

        const userModel = UserModel.get();

        userModel.find({
            _id: userIds
        }, (err, findResult) => {

            if (err)
                return rej(err);

            res(findResult);

        });

    });

}

function getRooms(roomIds) {

    return new Promise((res, rej) => {

        const roomModel = RoomModel.get();

        roomModel.find({
            _id: roomIds
        }, (err, findResult) => {

            if (err)
                return rej(err);

            res(findResult);

        });

    });

}

function updateUsage(messageCounts) {

    return new Promise((res, rej) => {

        async.eachLimit(messageCounts, 10, (messageCount, done) => {

            updateUsageByDate(messageCount).then(() => {

                done();

            }).catch((err) => {

                done(err);

            });

        }, (err) => {

            if (err)
                return rej(err);

            res();


        });

    });

}

function updateUsageByDate(messageCount) {

    const usageModel = UsageModel.get();

    const userId = messageCount.userId;
    const organizationId = messageCount.organizationId;
    const paymentType = messageCount.type;
    const count = messageCount.count;

    if (!userId || !organizationId)
        return Promise.resolve();

    return new Promise((res, rej) => {

        // search existing usage for the date
        usageModel.findOne({
            paymentType: paymentType,
            dateType: 1,
            dateIdentifier: today,
            userId: userId
        }, (err, findResult) => {

            if (err) {
                return rej(err);
            }

            res(findResult);

        });

    }).then((existingDailyData) => {

        return new Promise((res, rej) => {

            if (!existingDailyData) {

                // insert
                const model = new usageModel({
                    organizationId: organizationId,
                    userId: userId,
                    dateType: 1,
                    paymentType: paymentType,
                    dateIdentifier: today,
                    count: count,
                    lastcount: 0,
                    lastUpdateDate: null,
                    updated: 0,
                    created: Utils.now()
                })

                model.save((err, modelSaved) => {

                    if (err)
                        return rej(err);

                    res();

                });

            } else {

                usageModel.update({
                    _id: existingDailyData._id

                }, {
                        count: count,
                        updated: Utils.now()
                    }, (err, updateResult) => {

                        if (err)
                            return rej(err);

                        res();

                    });

            }

        }).then(() => {

            return new Promise((res, rej) => {

                // search existing usage for the month
                usageModel.findOne({
                    paymentType: paymentType,
                    dateType: 2,
                    dateIdentifier: month,
                    userId: userId
                }, (err, findResult) => {

                    if (err) {
                        return rej(err);
                    }

                    res(findResult);

                });

            });

        }).then((existingMonthlyData) => {

            return new Promise((res, rej) => {

                if (!existingMonthlyData) {

                    // insert
                    const model = new usageModel({
                        organizationId: organizationId,
                        userId: userId,
                        dateType: 2,
                        paymentType: paymentType,
                        dateIdentifier: month,
                        count: count,
                        lastCount: 0,
                        lastUpdateDate: today,
                        updated: 0,
                        created: Utils.now()
                    })

                    model.save((err, modelSaved) => {

                        if (err)
                            return rej(err);

                        res();

                    });

                } else {

                    const updateParams = {
                        count: existingMonthlyData.lastCount + count,
                        lastUpdateDate: today,
                        updated: Utils.now()
                    };

                    if (existingMonthlyData.lastUpdateDate == today) {

                    } else {
                        updateParams.lastCount = existingMonthlyData.count;
                    }

                    usageModel.update({
                        _id: existingMonthlyData._id
                    }, updateParams, (err, updateResult) => {

                        if (err)
                            return rej(err);

                        res();

                    });

                }

            });

        });

    });
}

DatabaseManager.init(function (success) {

    if (!success) {

        console.log('Failed to connect DB');
        process.exit(1);

    } else {

        const result = {
            freeMessageCount: {
            },
            paidMessageCount: {
            },
        };

        getTodaysMessages().then((messages) => {

            result.messages = messages;

            result.userIds = messages.map((message) => {
                return message.userID;
            }).filter((value, index, self) => {
                return self.indexOf(value) === index;
            });

            return getUsers(result.userIds)

        }).then((users) => {

            result.users = users;

            result.organizationIds = {};

            users.map((users) => {
                result.organizationIds[users._id.toString()] = users.organizationId;
            });

            result.chatIds = result.messages.map((message) => {
                return message.roomID;
            }).filter((value, index, self) => {
                return self.indexOf(value) === index;
            });

            result.roomIds = result.chatIds.filter((value, index, self) => {
                return value.substr(0, 1) == Const.chatTypeRoom
            }).map((chatId) => {

                return chatId.substr(2);

            });

            return getRooms(result.roomIds);

        }).then((rooms) => {

            const freeMessageCount = {};

            // count free messages
            result.messages.forEach((message) => {

                const firstChar = message.roomID.substr(0, 1);

                if (firstChar == Const.chatTypePrivate ||
                    firstChar == Const.chatTypeGroup) {

                    if (!freeMessageCount[message.userID])
                        freeMessageCount[message.userID] = 0;

                    freeMessageCount[message.userID]++;

                }

            });

            const paidMessageCount = {};

            // count free messages
            result.messages.forEach((message) => {

                const firstChar = message.roomID.substr(0, 1);

                if (firstChar == Const.chatTypeRoom) {

                    // check paid or free

                    // find room
                    const roomId = message.roomID.substr(2);
                    const room = rooms.find((room) => {
                        return room._id.toString() == roomId;
                    });

                    if (room && room.external) {

                        if (!paidMessageCount[message.userID])
                            paidMessageCount[message.userID] = 0;

                        paidMessageCount[message.userID]++;

                    } else {

                        if (!freeMessageCount[message.userID])
                            freeMessageCount[message.userID] = 0;

                        freeMessageCount[message.userID]++;

                    }


                }


            });

            result.freeMessageCount = freeMessageCount;
            result.paidMessageCount = paidMessageCount;

            // merge
            const allMessageCount = [];

            Object.keys(freeMessageCount).forEach((userID) => {

                const messageCount = {
                    count: freeMessageCount[userID]
                };

                messageCount.userId = userID;
                messageCount.organizationId = result.organizationIds[userID];
                messageCount.type = messageType.free;
                allMessageCount.push(messageCount);

            });

            Object.keys(paidMessageCount).forEach((userID) => {

                const messageCount = {
                    count: paidMessageCount[userID]
                };


                messageCount.userId = userID;
                messageCount.organizationId = result.organizationIds[userID];
                messageCount.type = messageType.paid;
                allMessageCount.push(messageCount);

            });

            return updateUsage(allMessageCount);

        }).then(() => {
            process.exit(1);
        }).catch((err) => {
            console.error(err);
            process.exit(0);
        });


    } //} else {

}); // DatabaseManager.init
