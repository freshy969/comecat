import { push, goBack } from 'react-router-redux'

import * as utils from '../lib/utils';

import * as types from './types';
import * as actions from '../actions';
import * as constant from '../lib/const';
import * as config from '../lib/config';
import * as strings from '../lib/strings';
import user from '../lib/user';

import {
    callSearchUserList,
    callCreateRoom,
    callUpdateRoom,
    callGetRoomDetail,
    callAddMemberToRoom,
    callRemoveUserFromRoom,
    callEnableBot,
} from '../lib/api/';


import { store } from '../index';

export function startRoomCreate() {
    return {
        type: types.RoomStartCreatingRoom
    }
}

export function initRoomEditng(baseRoomData) {
    return {
        type: types.RoomInitEditingRoom,
        data: baseRoomData
    }
}

export function setBotStatus(roomId, status) {

    return (dispatch, getState) => {

        callEnableBot(roomId, status)
            .then((data) => {

                return callGetRoomDetail(roomId);

            }).then((data) => {

                const room = getState().infoView.room;
                room.botEnabled = status;
                dispatch({
                    type: types.UpdateRoomInfo,
                    room: Object.assign({}, room)
                });

            }).catch((err) => {

                console.error(err);
                dispatch(actions.notification.showToast(strings.FailedToChangeBotStatus[user.lang]));

            });

    }
}

export function startRoomEdit(roomId) {

    return (dispatch, getState) => {

        callGetRoomDetail(roomId)
            .then((data) => {

                dispatch({
                    type: types.RoomStartEditingRoom,
                    room: data.room
                });


                const room = data.room;

                if (room) {

                    dispatch(typeName(room.name));

                    if (room.description)
                        dispatch(typeDescription(room.description));

                    room.userModels.forEach((memberUser) => {

                        dispatch(addMember(memberUser));

                    });

                    let fileId = null;

                    if (room.avatar && room.avatar.thumbnail) {
                        fileId = room.avatar.thumbnail.nameOnServer;

                        dispatch(selectFileByURL(config.APIEndpoint + constant.ApiUrlGetRoomAvatar + fileId));
                    }

                }

            })
            .catch((err) => {

                console.error(err);
                dispatch(actions.notification.showToast(strings.FailedToGetRoomDetail[user.lang]));

            });

    }

}

export function searchUserList(value) {

    return (dispatch, getState) => {

        dispatch({
            type: types.RoomSearchUserStart,
            keyword: value
        });

        callSearchUserList(value)
            .then((data) => {

                dispatch({
                    type: types.RoomSearchUserSucceed,
                    data,
                    members: getState().room.members
                });

            })
            .catch((err) => {

                console.error(err);

                dispatch(actions.notification.showToast(strings.FailedToSearchUserList[user.lang]));

                dispatch({
                    type: types.RoomSearchUserFailed
                });

            });

    };

}

export function save() {

    return (dispatch, getState) => {

        dispatch({
            type: types.RoomSaveStart
        });

        const state = getState();

        const editingRoomId = state.room.editingRoomId;
        const oldRoomData = state.room.editingRoomData;
        const newUsers = state.room.members;

        if (editingRoomId) {

            const usersAdd = newUsers.filter((newUser) => {

                let isExist = false;

                oldRoomData.users.forEach((userId) => {

                    if (userId == newUser._id)
                        isExist = true;

                });

                return !isExist;

            });

            const usersDeleted = oldRoomData.users.filter((userId) => {

                if (user.userData._id == userId)
                    return false;

                let isExist = false;

                newUsers.forEach((newUser) => {

                    if (userId == newUser._id)
                        isExist = true;

                });

                return !isExist;

            });

            let updatedRoom = null;

            callUpdateRoom(
                editingRoomId,
                state.room.name,
                state.room.description,
                state.room.avatarImage
            )
                .then((room) => {

                    updatedRoom = room;

                    return callAddMemberToRoom(
                        editingRoomId,
                        usersAdd.map((userToAdd) => {
                            return userToAdd._id
                        })
                    )
                })
                .then((addUserResult) => {


                    return callRemoveUserFromRoom(
                        editingRoomId,
                        usersDeleted
                    )

                })
                .then((removeUserResult) => {

                    const chatId = constant.ChatTypeRoom + "-" + editingRoomId;

                    dispatch({
                        type: types.RoomSaveSucceed,
                        room: updatedRoom
                    });

                    dispatch(actions.chat.changeCurrentChat(chatId));
                    dispatch(actions.chat.openChatByRoom(updatedRoom));


                }).catch((err) => {

                    console.error(err);

                    dispatch(actions.notification.showToast(strings.FailedToUpdateRoom[user.lang]));

                    dispatch({
                        type: types.RoomSaveFailed
                    });

                });

        } else {

            callCreateRoom(
                state.room.members,
                state.room.name,
                state.room.description,
                state.room.avatarImage
            ).then((room) => {

                const chatId = utils.chatIdByRoom(room);

                dispatch({
                    type: types.RoomSaveSucceed,
                    room
                });

                dispatch(actions.chat.openChatByRoom(room));
                dispatch(actions.chat.changeCurrentChat(chatId));
                dispatch({
                    type: types.ChatLoadMessageSucceed,
                    messages: []
                });

            }).catch((err) => {

                console.error(err);

                dispatch(actions.notification.showToast(strings.FailedToCreateRoom[user.lang]));

                dispatch({
                    type: types.RoomSaveFailed
                });

            });

        }

    }
}

export function typeKeyword(keyword) {

    return {
        type: types.RoomTypeKeyword,
        keyword
    }

}

export function typeName(name) {

    return {
        type: types.RoomTypeName,
        name
    }

}

export function typeDescription(description) {

    return {
        type: types.RoomTypeDescription,
        description
    }

}

export function selectFile(file) {

    return (dispatch, getState) => {

        let reader = new FileReader();

        reader.onloadend = () => {

            dispatch({
                type: types.RoomSelectFile,
                file,
                fileUrl: reader.result
            });

        }

        reader.readAsDataURL(file)

    }

}

export function selectFileByURL(url) {

    return {
        type: types.RoomSelectFileByURL,
        url
    }

}

export function deleteFile(file) {

    return {
        type: types.RoomDeleteFile
    }

}


export function addMember(user) {
    return {
        type: types.RoomAddMember,
        user
    }
}

export function deleteMember(user) {

    return {
        type: types.RoomDeleteMember,
        user
    }

}


export function cancel() {

    return (dispatch, getState) => {

        dispatch({
            type: types.RoomCancel
        });

        store.dispatch(goBack());

    }

}

export function newRoom(obj) {
    return (dispatch, getState) => {
        dispatch(actions.history.loadHistoryInitial());
    }
}


export function deleteRoom(obj) {

    return (dispatch, getState) => {
        dispatch(actions.history.loadHistoryInitial());
    }

}
