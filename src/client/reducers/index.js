import { routerReducer as routing } from "react-router-redux";
import { combineReducers } from "redux";
import * as types from "../actions/types";

import login from "./login";
import toast from "./toast";
import chatUI from "./chatUI";
import history from "./history";
import userlist from "./userlist";
import grouplist from "./grouplist";
import chat from "./chat";
import infoView from "./infoview";
import stickers from "./stickers";
import room from "./room";
import call from "./call";
import files from "./files";
import imageView from "./imageView";
import searchMessage from "./searchMessage";
import favorites from "./favorites";
import profile from "./profile";
import password from "./password";
import notification from "./notification";
import messageInfo from "./messageInfo";
import messageForward from "./messageForward";
import note from "./note";
import connector from "./connector";
import signup from "./signup";
import forget from "./forget";
import api from "./api";
import chatbot from "./chatbot";
import userData from './userData';
import settings from './settings';
import niceAlert from './niceAlert';

const filter = (state = "", action) => {
    switch (action.type) {
        case types.FILTER:
            return action.filter;
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    login,
    toast,
    filter,
    routing,
    chatUI,
    history,
    userlist,
    grouplist,
    chat,
    infoView,
    stickers,
    call,
    files,
    imageView,
    room,
    call,
    searchMessage,
    favorites,
    profile,
    password,
    notification,
    messageInfo,
    messageForward,
    note,
    connector,
    signup,
    forget,
    api,
    chatbot,
    userData,
    settings,
    niceAlert
});

export default rootReducer;
