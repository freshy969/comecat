/** Constants */

var Const = {};

Const.responsecodeSucceed = 1;
Const.responsecodeUnknownError = 4000000;

Const.responsecodeSigninNoUserid = 4000001;
Const.responsecodeSigninNoPassword = 4000002;
Const.responsecodeSigninNoOrganizationId = 4000003;
Const.responsecodeSigninWrongSecret = 4000004;
Const.responsecodeSigninWrongOrganizationId = 4000005;
Const.responsecodeSigninWrongUserCredentials = 4000006;
Const.responsecodeSigninInvalidToken = 4000007;
Const.responsecodeUpdateProfileInvalidName = 4000008;
Const.responsecodeUpdateProfileInvalidFile = 4000009;
Const.responsecodeUpdatePasswordWrongCurrentPassword = 4000010;
Const.responsecodeUpdatePasswordWrongNewPassword = 4000011;
Const.responsecodeUpdateRoomWrongRoomId = 4000012;
Const.responsecodeUpdateRoomWrongRoomName = 4000013;
Const.responsecodeUpdateRoomWrongFile = 4000014;
Const.responsecodeLeaveRoomWrongRoomId = 4000015;
Const.responsecodeGetOnlineStatusInvalidUserId = 4000016;
Const.responsecodeUserDetailInvalidUserId = 4000017;
Const.responsecodeGroupDetailInvalidGroupId = 4000018;
Const.responsecodeRoomDetailInvalidRoomId = 4000019;
Const.responsecodeAddToFavoriteNoMessageId = 4000020;
Const.responsecodeAddToFavoriteInvalidMessageId = 4000021;
Const.responsecodeAddToFavoriteExistedMessageId = 4000022;
Const.responsecodeRemoveFromFavoriteNoMessageId = 4000023;
Const.responsecodeRemoveFromFavoriteInvalidMessageId = 4000024;
Const.responsecodeAddUsersToRoomWrongRoomId = 4000025;
Const.responsecodeAddUsersToRoomWrongUserId = 4000026;
Const.responsecodeRemoveUsersFromRoomWrongRoomId = 4000027;
Const.responsecodeRemoveUsersFromRoomWrongUserId = 4000028;
Const.responsecodeForwardMessageInvalidChatId = 4000029;
Const.responsecodeForwardMessageInvalidMessageId = 4000030;
Const.responsecodeSavePushTokenWrongToken = 4000031;
Const.responsecodeStickersWrongOrganizationId = 4000032;
Const.responsecodeAddInboundHookWrongTargetType = 4000033;
Const.responsecodeAddInboundHookWrongTargetId = 4000034;
Const.responsecodeAddInboundHookWrongUserId = 4000035;
Const.responsecodeAddOutgoingHookWrongURL = 4000036;
Const.responsecodeAddOutgoingHookWrongUserId = 4000037;
Const.responsecodeUpdateInboundHookWrongTargetType = 4000038;
Const.responsecodeUpdateInboundHookWrongTargetId = 4000039;
Const.responsecodeUpdateInboundHookWrongHookId = 4000040;
Const.responsecodeUpdateOutgoingHookWrongURL = 4000041;
Const.responsecodeUpdateOutgoingHookWrongHookId = 4000042;
Const.responsecodeRemoveInboundHookWrongHookId = 4000043;
Const.responsecodeRemoveOutgoingHookWrongHookId = 4000044;
Const.responsecodeAddOutgoingHookWrongTargetType = 4000045;
Const.responsecodeAddOutgoingHookWrongTargetId = 4000046;
Const.responsecodeUpdateOutgoingHookWrongTargetType = 4000047;
Const.responsecodeUpdateOutgoingHookWrongTargetId = 4000048;
Const.responsecodeInboundHookWringIdentifier = 4000049;
Const.responsecodeSigninNoOrganizationid = 4000050;
Const.responsecodePingOKInvalidParam = 4000051;
Const.responsecodeLoginInvalidParam = 4000052;
Const.responsecodeCallingInvalidParamInvalidUserId = 4000053;
Const.responsecodeCallingInvalidParamNoMediaType = 4000054;
Const.responsecodeCallingInvalidParamNoRejectType = 4000055;
Const.responsecodeFailedToSendMessage = 4000056;
Const.responsecodeMaxRoomNumber = 4000057;
Const.responsecodeMuteWrongParam = 4000058;
Const.responsecodeBlockWrongParam = 4000059;
Const.responsecodeUserBlocked = 4000060;
Const.responsecodeDeviceRejected = 4000061;
Const.responsecodeSignupNoOrganizationId = 4000062;
Const.responsecodeSignupUserAlreadyVerified = 4000063;
Const.responsecodeSignupInvalidActivationCode = 4000064;
Const.responsecodeSignupInvalidUserName = 4000065;
Const.responsecodeSignupInvalidPassword = 4000066;
Const.responsecodeMessageNoPermission = 4000067;

Const.responsecodeMessageListInvalidParam = 4000068;
Const.responsecodeMessageFileUploadFailed = 4000069;

Const.resCodeSocketSendMessageNoRoomID = 4000070;
Const.resCodeSocketSendMessageNoUserId = 4000071;
Const.resCodeSocketSendMessageNoType = 4000072;
Const.resCodeSocketSendMessageNoMessage = 4000073;
Const.resCodeSocketSendMessageNoLocation = 4000074;
Const.resCodeSocketDeleteNoMessageID = 4000075;
Const.resCodeSocketDeleteNoUserID = 4000076;
Const.resCodeSocketUnknownError = 4000077;
Const.resCodeSocketTypingNoUserID = 4000078;
Const.resCodeSocketTypingNoRoomID = 4000079;
Const.resCodeSocketTypingNoType = 4000080;
Const.resCodeSocketTypingFaild = 4000081;
Const.resCodeSocketOpenMessageWrongMessageID = 4000082;
Const.resCodeSocketOpenMessageNoUserId = 4000083;

Const.responsecodeSeenByInvalidMessageId = 4000084;

Const.responsecodeNoOrganizationName = 4000085;
Const.responsecodeWrongOrganizationName = 4000086;

Const.responsecodeSigninUserNotFound = 4000087;
Const.responsecodeWrongUserContactId = 4000088;

Const.responsecodeAddUsersToRoomUserIsNotOwner = 4000089;
Const.responsecodeRemoveUsersFromRoomUserIsNotOwner = 4000090;

Const.resCodeSocketUpdateNoMessageID = 4000091;
Const.resCodeSocketUpdateNoUserID = 4000092;

Const.resCodeSaveNoteNoChatID = 4000093;
Const.resCodeLoadNoteNoChatID = 4000094;

Const.resCodeSocketDeliverMessageNoUserId = 4000095;
Const.resCodeSocketDeliverMessageNoMessageId = 4000096;
Const.resCodeSocketDeliverMessageWrongUserId = 4000097;
Const.resCodeSocketDeliverMessageWrongMessageId = 4000098;

Const.responsecodeDeliverMessageNoMessageId = 4000099;
Const.responsecodeDeliverMessageWrongMessageId = 4000100;
Const.responsecodeDeliverMessageUserIsSender = 4000101;

Const.responsecodeSigninNoActivationCode = 5000001;
Const.responsecodeForgetPasswordNoEmail = 5000002;
Const.responsecodeWebhookNoURL = 5000003;
Const.responsecodeWrongParamForSocial = 5000004;
Const.responsecodeEnableBotWrongRoomId = 5000005;
Const.responsecodeInvalidDateCode = 5000006;
Const.responsecodePinChatWrongPinParam = 4000102;
Const.responsecodePinChatWrongChatIdParam = 4000103;

Const.httpCodeSucceed = 200;
Const.httpCodeForbidden = 403;
Const.httpCodeFileNotFound = 404;
Const.httpCodeBadParameter = 422;
Const.httpCodeServerError = 500;

Const.thumbSize = 256;
Const.searchLimit = 10;

Const.REUsername = /^[0-9A-Za-z._+-@]{6,}$/;
Const.REPassword = /^[0-9A-Za-z._+-]{6,}$/;
Const.RENumbers = /^[0-9]*$/;

Const.sessionkey = "spikaenterprisesession";
Const.sessionsalt = "8zgqvU6LaziThJI1uz3PevYd";

Const.tokenLength = 16;
Const.pagingRows = 20;
Const.pagingRowsHistoryAndMessages = 10;

Const.tokenValidInteval = 60 * 60 * 24 * 1000 * 30;
//Const.tokenValidInteval = 1000 * 60 * 2; // ms

Const.chatTypePrivate = 1;
Const.chatTypeGroup = 2;
Const.chatTypeRoom = 3;

Const.maxBatchSizeFindResult = 5000;

Const.redisKeyOnlineStatus = 'onlinestatus_';
Const.redisKeySocketId = "socketid_";
Const.redisKeyUserId = "userid_";
Const.redisKeyCurrentRoomId = "currentroom_";
Const.redisKeySocketIdPool = "socketidpool_";
Const.redisCallQueue = "callqueue_";
Const.redisCallQueue = "callqueue_";
Const.adminForcelogoutList = "adminforcelogoutlist";

Const.groupType = { group: 1, department: 2 };

Const.pushTokenThreadSize = 50;
Const.apnCategoryMessage = "message";

Const.hookTypeInbound = 1;
Const.hookTypeOutgoing = 2;

Const.userPermission = { webClient: 1, organizationAdmin: 2, subAdmin: 3 };

Const.stickerType = { owner: 1, admin: 2 };

Const.botUserIdPrefix = "b0200000000000000000";

Const.heartBeatInterval = 10; // sec

Const.hostidFile = "hostid"; // sec

Const.callFaildOffline = 1;
Const.callFaildUserBusy = 2;
Const.callFaildUserRejected = 2;

Const.gigabyteToByteMultiplier = 1000000000;

Const.messageTypeText = 1;
Const.messageTypeFile = 2;
Const.messageTypeLocation = 3;
Const.messageTypeContact = 4;
Const.messageTypeSticker = 5;

Const.pushTypeNewMessage = 1;
Const.pushTypeCall = 2;
Const.pushTypeCallClose = 3;

Const.muteActionMute = 'mute';
Const.muteActionUnmute = 'unmute';

Const.blockActionBlock = 'block';
Const.blockActionUnblock = 'unblock';

Const.userStatus = {
    disabled: 0,
    enabled: 1
};

Const.onlineCheckerIntertal = 180 * 1000;
Const.offlineTimeLimit = 180 * 1000;

Const.messageTypeText = 1;
Const.messageTypeFile = 2;
Const.messageTypeLocation = 3;
Const.messageTypeContact = 4;
Const.messageTypeSticker = 5;

Const.pagingLimit = 50;

Const.MessageLoadDirection = {
    appendNoLimit: 'allto',
    append: 'new',
    prepend: 'old'
};


Const.typingOff = 0;
Const.typingOn = 1;

Const.APIKeyLength = 32;

// For validation of api v3
Const.inputInfoMinLength = 6;
Const.nameMaxLength = 64;
Const.descriptionMaxLength = 512;

Const.errorMessage = {
    offsetIsMinus: "offset parameter can not be minus.",
    nameIsEmpty: "name is empty. Please input name.",
    userIdIsEmpty: "userid is empty. Please input userid.",
    passwordIsEmpty: "password is empty. Please input password.",
    messageIsEmpty: "message is empty.",
    roomNotExist: "room is not existed.",
    userNotExistInOrganization: "user does not exist in organization.",
    userNotExistInRoom: "user does not exist in room.",
    messageNotExist: "message data does not exist.",
    useridTooShort: "userid is too short. Please input more than 6 characters.",
    passwordTooShort: "password is too short. Please input more than 6 characters.",
    nameTooLarge: "name is too large. Please input shorter than 64 characters.",
    useridTooLarge: "userid is too large. Please input shorter than 64 characters.",
    sortNameTooLarge: "sortName is too large. Please input shorter than 64 characters.",
    passwordTooLarge: "password is too large. Please input shorter than 64 characters.",
    descriptionTooLarge: "description is too large. Please input shorter than 512 characters.",
    groupDuplicated: "You already have the same name group. Please change the name.",
    userDuplicated: "You already have the same name user. Please change the name.",
    groupidIsWrong: "groupId is wrong. Please input the correct id.",
    useridIsWrong: "userid is wrong. Please input the correct id.",
    roomidIsWrong: "roomId is wrong. Please input the correct id.",
    messageidIsWrong: "messageId is wrong. Please input the correct id.",
    fileIsWrong: "file only can be set by jpeg, gif and png.",
    includeUsersNotExist: "Wrong users.",
    includeUsersNotExistInOrganiation: "Some userid in users doesn't exist.",
    includeGroupsNotExist: "Wrong groups.",
    includeGroupsNotExistInOrganiation: "Some groupId in groups doesn't exist.",
    responsecodeMaxRoomNumber: "You've already had the max number of rooms.",
    ownerCannotLeaveRoom: "The room owner can\'t leave room.",
    includeGroupsNotExistInOrganiation: "Some groupId in groups doesn't exist in your organization.",
    wrongUserIds: "users parameter is wrong.",
    cannotUpdateRoom: "you can't update this room because you are not owner",
    cannotDeleteRoom: "you can't delete this room because you are not owner.",
    cannotUpdateMessage: "you can't update this message because you are not sender",
    cannotDeleteMessage: "you can't delete this message because you are not sender.",
    wrongUserPermission: "User permission must be 1 (web client) or 3 (sub-admin)"
}

Const.webhookEventMessage = "message";
Const.webhookEventStartConversation = "start_conversation";

Const.emailTypeSignUp = "signup";
Const.emailTypeForget = "forget";

Const.integrationStateDisabled = 0;
Const.integrationStateEnabled = 1;
Const.integrationStateWaiting = 2;

Const.usageTypeDate = 1;
Const.usageTypeMonth = 2;

Const.subscriptions = {
    free: "personal_free",
    starter: "personal_starter",
    unlimited: "personal_unlimited",
};

Const.subscriptionLimit = {};
Const.subscriptionLimit[Const.subscriptions.free] = 500;
Const.subscriptionLimit[Const.subscriptions.starter] = 500;
Const.subscriptionLimit[Const.subscriptions.unlimited] = 500;
Const.paymentStatus = {
    approved: "approved",
    deposited: "deposited",
}

// Exports ----------------------------------------------
module["exports"] = Const;