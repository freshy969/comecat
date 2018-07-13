/** Create Room */
const async = require('async');
const _ = require('lodash');
const Const = require("../../lib/consts");
const Config = require("../../lib/init");
const Utils = require("../../lib/utils");
const Path = require('path');
const easyImg = require('easyimage');
const fs = require('fs');
const mime = require('mime');

const RoomModel = require('../../Models/Room');
const UserModel = require('../../Models/User');
const Connector = require('../../Models/Connector');

const HistoryModel = require('../../Models/History');
const OrganizationModel = require('../../Models/Organization');
const UpdateOrganizationDiskUsageLogic = require('./UpdateOrganizationDiskUsage')
const PermissionLogic = require('./Permission');
const AvatarLogic = require('./Avatar');
const UpdateHistoryLogic = require('./UpdateHistory');
const SocketAPIHandler = require('../../SocketAPI/SocketAPIHandler');

const Room = {
    search: (user, params, onSuccess, onError) => {
        const roomModel = RoomModel.get();
        async.waterfall([
            // Get Rooms
            (done) => {
                let conditions = { users: user.id.toString() };
                if (!_.isEmpty(params.keyword)) {
                    conditions.$or = [
                        { name: new RegExp('^.*' + Utils.escapeRegExp(params.keyword) + '.*$', "i") },
                        { description: new RegExp('^.*' + Utils.escapeRegExp(params.keyword) + '.*$', "i") },
                    ]
                }

                const query = roomModel.find(conditions, params.fields)
                    .skip(params.offset)
                    .sort(params.sort)
                    .limit(params.limit);

                query.exec((err, data) => {
                    if (err) return done(err, null);
                    result = {
                        list: Utils.ApiV3StyleId(data)
                    }
                    done(err, result);
                });
            },
            // Get user's data
            (result, done) => {
                const userLists = _.pluck(result.list, 'users');
                // Skip when select fields is set except users
                if (_.contains(userLists, undefined)) done(null, result);
                const flattenUserIds = _.flatten(userLists);
                const uniqUserIds = _.uniq(flattenUserIds);
                const userModel = UserModel.get();
                userModel.find({ _id: { $in: uniqUserIds } }, { name: 1 }, (err, foundUsers) => {
                    // Replace users list to list including username
                    _.forEach(result.list, (group, index) => {
                        const matched = _.filter(foundUsers, (user) => {
                            return _.includes(group.users, user._id.toString());
                        });
                        result.list[index].users = Utils.ApiV3StyleId(matched);
                    });
                    done(err, result);
                });
            }
        ],
            (err, result) => {
                if (err) {
                    if (onError) onError(err);
                    return;
                }
                if (onSuccess) onSuccess(result);
            });
    },
    create: (baseUser, params, avatar, onSuccess, onError) => {
        const roomModel = RoomModel.get();
        const userModel = UserModel.get();
        const organizationId = baseUser.organizationId;
        async.waterfall([
            // Get all users by organizationId      
            (done) => {
                userModel.find({ organizationId: organizationId }, { _id: 1 }, (err, findResult) => {
                    if (err) {
                        return done({ code: Const.httpCodeServerError, message: err.text }, result);
                    }
                    done(err, { usersInOrg: findResult });
                });
            },
            // Get max room number from organization       
            (result, done) => {
                const organizationModel = OrganizationModel.get();
                organizationModel.findOne({ _id: organizationId }, { maxRoomNumber: 1 }, (err, findResult) => {
                    if (err) {
                        return done({ code: Const.httpCodeServerError, message: err.text }, result);
                    }
                    result.maxRoomNumber = findResult.maxRoomNumber;
                    done(err, result);
                });
            },
            // Check the number of room in organization
            (result, done) => {
                const userIds = _.pluck(result.usersInOrg, "_id");
                roomModel.count({ owner: { $in: userIds } }, (err, numberOfRooms) => {
                    if (err) {
                        const error = { code: Const.httpCodeServerError, message: err.text };
                        return done(error, result);
                    }
                    if (numberOfRooms >= result.maxRoomNumber) {
                        const error = {
                            code: Const.httpCodeBadParameter,
                            message: Const.errorMessage.responsecodeMaxRoomNumber
                        };
                        done(error, result);
                    } else {
                        done(err, result);
                    }
                });
            },
            // Create a new Room data
            (result, done) => {
                if (params.users) {
                    params.users.push(baseUser.id);
                    params.users = _.uniq(params.users);
                } else {
                    params.users = [baseUser.id];
                }

                if (_.isEmpty(params.name))
                    params.name = Utils.shorten(baseUser.name);

                result.saveData = {
                    name: params.name,
                    description: params.description,
                    created: Utils.now(),
                    owner: baseUser._id,
                    users: params.users
                }

                // little modification for user support system
                if (params.ownerID)
                    result.saveData.owner = params.ownerID

                if (avatar) {
                    AvatarLogic.createRoomAvatarData(avatar, (err, avatarData) => {
                        if (avatarData)
                            result.saveData.avatar = avatarData;
                        done(err, result);
                    });
                } else {
                    done(null, result);
                }
            },
            // Save Data
            (result, done) => {
                const newRoom = new roomModel(result.saveData);
                newRoom.save((err, saved) => {
                    result.createdRoom = saved.toObject();
                    result.createdRoom.id = saved._id;
                    delete result.createdRoom._id;
                    done(err, result);
                });
            },
            // Send socket to notice room creating
            (result, done) => {
                if (result.createdRoom) {
                    UpdateHistoryLogic.newRoom(result.createdRoom);
                    done(null, result);

                    _.forEach(result.createdRoom.users, (userId) => {
                        if (userId) {
                            SocketAPIHandler.emitToUser(userId, 'new_room', {
                                conversation: result.createdRoom
                            });
                        }
                    });
                }
            },
            // Join to room
            (result, done) => {
                const users = params.users;
                if (users) {
                    users.push(baseUser._id);
                    users.forEach((userId) => {
                        SocketAPIHandler.joinTo(userId, Const.chatTypeRoom, result.createdRoom.id.toString());
                    });
                }
                done(null, result);
            },
            // Update organization disk usage
            (result, done) => {
                const file = result.saveData.avatar;
                if (file) {
                    const size = file.picture.size + file.thumbnail.size;
                    UpdateOrganizationDiskUsageLogic.update(organizationId, size, (err, updated) => {
                        done(err, result);
                    });
                } else {
                    done(null, result);
                }
            }
        ], (err, result) => {
            if (err) {
                if (onError) onError(err);
                return;
            }
            if (onSuccess) onSuccess(result.createdRoom);
        });
    },
    createForWebSupport: (baseUser, params, defaultAvatarFile, onSuccess, onError) => {
        const roomModel = RoomModel.get();
        const userModel = UserModel.get();
        const connectorModel = Connector.get();

        const organizationId = baseUser.organizationId;
        async.waterfall([
            // Get all users by organizationId      
            (done) => {
                userModel.find({ organizationId: organizationId }, { _id: 1 }, (err, findResult) => {
                    if (err) {
                        return done({ code: Const.httpCodeServerError, message: err.text }, result);
                    }
                    done(err, { usersInOrg: findResult });
                });
            },
            // Get max room number from organization       
            (result, done) => {
                const organizationModel = OrganizationModel.get();
                organizationModel.findOne({ _id: organizationId }, { maxRoomNumber: 1 }, (err, findResult) => {
                    if (err) {
                        return done({ code: Const.httpCodeServerError, message: err.text }, result);
                    }
                    result.maxRoomNumber = findResult.maxRoomNumber;
                    done(err, result);
                });
            },
            // Check the number of room in organization
            (result, done) => {
                const userIds = _.pluck(result.usersInOrg, "_id");
                roomModel.count({ owner: { $in: userIds } }, (err, numberOfRooms) => {
                    if (err) {
                        const error = { code: Const.httpCodeServerError, message: err.text };
                        return done(error, result);
                    }
                    if (numberOfRooms >= result.maxRoomNumber) {
                        const error = {
                            code: Const.httpCodeBadParameter,
                            message: Const.errorMessage.responsecodeMaxRoomNumber
                        };
                        done(error, result);
                    } else {
                        done(err, result);
                    }
                });
            },
            // Get Connector
            (result, done) => {

                connectorModel.findOne({
                    connectorIdentifier: 'web',
                    userId: params.ownerID
                }, (err, findResult) => {

                    result.connector = findResult;
                    done(err, result);

                });
            },

            // Create a new Room data
            (result, done) => {
                if (params.users) {
                    params.users.push(baseUser.id);
                    params.users = _.uniq(params.users);
                } else {
                    params.users = [baseUser.id];
                }

                if (_.isEmpty(params.name))
                    params.name = Utils.shorten(baseUser.name);

                result.saveData = {
                    organizationId: baseUser.organizationId,
                    name: params.name,
                    description: params.description,
                    created: Utils.now(),
                    owner: Config.personalAccountAdminId,
                    users: params.users,
                    external: {
                        connectorIdentifier: "web"
                    },
                    bot: {
                        botEnabled: 1,
                        botDisabledAt: 0
                    }
                }

                if (result.connector) {

                    result.saveData.external.serviceSettingId = result.connector._id.toString();

                    // get another user id
                    const anotherUserId = params.users.find((userId) => {
                        return userId != params.ownerID;
                    });

                    result.saveData.external.userIdentifier = anotherUserId;

                }

                // little modification for user support system
                //if (params.ownerID)
                //    result.saveData.owner = params.ownerID


                // find default avatar files

                if (!defaultAvatarFile) {

                    const files = fs.readdirSync(Config.publicPath + "/images/defaultAvatars/");
                    let index = Math.floor(Math.random() * Math.floor(files.length));

                    if (index >= files.length)
                        index = files.length - 1;

                    defaultAvatarFile = files[index];

                }

                const stats = fs.statSync(Config.publicPath + "/images/defaultAvatars/" + defaultAvatarFile);

                const avatar = {
                    path: Config.publicPath + "/images/defaultAvatars/" + defaultAvatarFile,
                    name: defaultAvatarFile,
                    type: mime.lookup(defaultAvatarFile),
                    size: stats.size
                }


                AvatarLogic.createRoomAvatarData(avatar, (err, avatarData) => {
                    if (avatarData)
                        result.saveData.avatar = avatarData;
                    done(err, result);
                });

            },
            // Save Data
            (result, done) => {
                const newRoom = new roomModel(result.saveData);
                newRoom.save((err, saved) => {
                    result.createdRoom = saved.toObject();
                    result.createdRoom.id = saved._id;
                    delete result.createdRoom._id;
                    done(err, result);
                });
            },
            // Send socket to notice room creating
            (result, done) => {
                if (result.createdRoom) {
                    UpdateHistoryLogic.newRoom(result.createdRoom);
                    done(null, result);

                    _.forEach(result.createdRoom.users, (userId) => {
                        if (userId) {
                            SocketAPIHandler.emitToUser(userId, 'new_room', {
                                conversation: result.createdRoom
                            });
                        }
                    });
                }
            },
            // Join to room
            (result, done) => {
                const users = params.users;
                if (users) {
                    users.push(baseUser._id);
                    users.forEach((userId) => {
                        SocketAPIHandler.joinTo(userId, Const.chatTypeRoom, result.createdRoom.id.toString());
                    });
                }
                done(null, result);
            },
            // Update organization disk usage
            (result, done) => {
                const file = result.saveData.avatar;
                if (file) {
                    const size = file.picture.size + file.thumbnail.size;
                    UpdateOrganizationDiskUsageLogic.update(organizationId, size, (err, updated) => {
                        done(err, result);
                    });
                } else {
                    done(null, result);
                }
            }
        ], (err, result) => {
            if (err) {
                if (onError) onError(err);
                return;
            }
            if (onSuccess) onSuccess(result.createdRoom);
        });
    },

    getDetails: (roomId, fields, onSuccess, onError) => {
        const roomModel = RoomModel.get();
        roomModel.findOne({ _id: roomId }, fields, (err, foundRoom) => {
            if (err && onError) return onError({ code: err.status, message: err.text });
            result = foundRoom.toObject();
            result.id = foundRoom._id;
            delete result._id;
            if (onSuccess) onSuccess(result);
        });
    },
    update: (roomId, baseUser, params, avatar, onSuccess, onError) => {
        const roomModel = RoomModel.get();
        async.waterfall([
            // Validate the roomId is correct, or not
            (done) => {
                roomModel.findOne({ _id: roomId }, (err, found) => {
                    if (!found) {
                        return done({
                            code: Const.httpCodeBadParameter,
                            message: Const.roomidIsWrong
                        }, null);
                    }
                    done(err, { original: found });
                });
            },
            (result, done) => {
                const newName = params.name ? params.name : result.original.name;
                const newDescription = params.description ? params.description : result.original.description;
                result.updateParams = {
                    name: newName,
                    description: newDescription
                };
                if (avatar) {
                    AvatarLogic.createAvatarData(avatar, (err, avatarData) => {
                        if (avatarData)
                            result.updateParams.avatar = avatarData;
                        done(err, result);
                    });
                } else {
                    done(null, result);
                }
            },
            // Update data
            (result, done) => {
                roomModel.update({ _id: roomId }, result.updateParams, (err, updated) => {
                    done(err, result);
                });
            },
            // Update organization disk usage
            (result, done) => {
                if (avatar) {
                    let size = 0;
                    const newSize = result.updateParams.avatar.picture.size + result.updateParams.avatar.thumbnail.size;
                    if (result.original.avatar.picture.size) {
                        const originalSize = result.original.avatar.picture.size + result.original.avatar.thumbnail.size;
                        size = newSize - originalSize;
                    } else {
                        size = newSize;
                    }
                    UpdateOrganizationDiskUsageLogic.update(baseUser.organizationId, size, (err, updated) => {
                        done(err, result);
                    });
                } else {
                    done(null, result);
                }
            }
        ],
            (err, result) => {
                if (err && onError) return onError(err);
                if (onSuccess) onSuccess(result);
            });
    },
    delete: (room, user, onSuccess, onError) => {
        const roomModel = RoomModel.get();
        async.waterfall([
            (done) => {
                roomModel.remove({ _id: room.id }, (err, deleted) => {
                    done(err, null);
                });
            },
            // Update organization disk usage
            (result, done) => {
                const pictureSize = room.avatar.picture.size;
                const thumbnailSize = room.avatar.thumbnail.size;
                if (pictureSize) {
                    let size = - (pictureSize + thumbnailSize);
                    UpdateOrganizationDiskUsageLogic.update(user.organizationId, size, (err, updated) => {
                        done(err, result);
                    });
                } else {
                    done(null, result);
                }
            },
            // remove room from user's rooms
            (result, done) => {
                roomModel.remove({ _id: room.id }, (err, removed) => {
                    if (err) return done(err, null);
                    done(null, result);
                });
            },
            // remove history
            (result, done) => {
                const historyModel = HistoryModel.get();
                historyModel.remove({ chatId: room.id }, (err, deleted) => {
                    done(err, result);
                });
            },
            // Send socket
            (result, done) => {
                // send socket
                _.forEach(room.users, (userId) => {
                    if (userId) {
                        SocketAPIHandler.emitToUser(userId, 'delete_room', { conversation: room.toObject() });
                    }
                });
                done(null, result);
            }
        ],
            (err, result) => {
                if (err && onError) return onError(err);
                if (onSuccess) onSuccess(result);
            });
    },
    leave: (loginUser, room, onSuccess, onError) => {
        async.waterfall([
            // Remove login user from usrs list of room
            (done) => {
                _.remove(room.users, (userId) => {
                    return userId == loginUser._id;
                });
                done(null, room);
            },
            // Remove history
            (room, done) => {
                const historyModel = HistoryModel.get();
                historyModel.remove({ chatId: room.id.toString(), userId: loginUser._id }, (err, removed) => {
                    if (err) return done(err, null);
                    done(null, room);
                });
            },
            // Remove room
            (room, done) => {
                const roomModel = RoomModel.get();
                roomModel.update({ _id: room.id }, { modified: Utils.now(), users: room.users }, (err, updated) => {
                    if (err)
                        return done({ code: err.status, message: err.text }, null);
                    done(null, room);
                });
            }
        ],
            (err, result) => {
                if (err && onError) return onError(err);
                SocketAPIHandler.leaveFrom(loginUser._id, Const.chatTypeRoom, room.id);
                if (onSuccess) onSuccess(result);
            });

    }
};

module["exports"] = Room;