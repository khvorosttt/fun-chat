import { UserType } from '../View/Validation/types';
import {
    CallbackDeliveredInfo,
    CallbackErrorInfo,
    CallbackInfo,
    CallbackMessageInfo,
    CallbackMessagesInfo,
    CallbackReadedInfo,
    CallbackUsersInfo,
    RequestInfo,
    ResponseInfo,
    ResponseType,
    CallbackDeleteInfo,
    CallbackEditInfo,
    RequestType,
} from './types';

export default class WebSocketApi {
    ws: WebSocket;

    currentUser: UserType | null;

    openCallback: CallbackInfo | null;

    closeCallback: CallbackInfo | null;

    loginErrorCallback: CallbackErrorInfo | null;

    loginCallback: CallbackInfo | null;

    logoutCallback: CallbackInfo | null;

    showActiveUserCallback: CallbackUsersInfo | null;

    showInactiveUserCallback: CallbackUsersInfo | null;

    sendUserSearchMessageCallback: CallbackInfo | null;

    historyMessage: CallbackMessagesInfo | null;

    receivingMessageFromUser: CallbackMessageInfo | null;

    changeDeliveredStatus: CallbackDeliveredInfo | null;

    changeReadedStatus: CallbackReadedInfo | null;

    deleteMessage: CallbackDeleteInfo | null;

    editMessage: CallbackEditInfo | null;

    constructor() {
        this.ws = new WebSocket('ws://127.0.0.1:4000');
        this.currentUser = null;
        this.openCallback = null;
        this.closeCallback = null;
        this.loginErrorCallback = null;
        this.loginCallback = null;
        this.logoutCallback = null;
        this.showActiveUserCallback = null;
        this.showInactiveUserCallback = null;
        this.sendUserSearchMessageCallback = null;
        this.historyMessage = null;
        this.receivingMessageFromUser = null;
        this.changeDeliveredStatus = null;
        this.changeReadedStatus = null;
        this.deleteMessage = null;
        this.editMessage = null;
        this.connectionToServer();
    }

    connectionToServer() {
        this.ws.onopen = () => {
            console.log('Connection to server established');
            this.openCallback?.callback();
        };
        this.ws.addEventListener('message', (event) => {
            const response: ResponseInfo = JSON.parse(event.data);
            this.switchTypeMessage(response);
        });
        this.ws.onclose = () => {
            console.log('Connection to the server was interrupted');
            this.closeCallback?.callback();
            this.reconnection();
        };
    }

    reconnection() {
        this.ws = new WebSocket('ws://127.0.0.1:4000');
        const sessionInfo: string | null = sessionStorage.getItem('user');
        if (sessionInfo !== null) {
            const request: RequestInfo = {
                id: '',
                type: RequestType.LOGIN,
                payload: {
                    user: JSON.parse(sessionInfo),
                },
            };
            this.sendMessageToServer(request);
        }
        this.connectionToServer();
    }

    switchTypeMessage(response: ResponseInfo) {
        switch (response.type) {
            case ResponseType.ERROR:
                this.loginErrorCallback?.callback(response.payload.error);
                break;
            case ResponseType.LOGIN:
                if (this.currentUser !== null) {
                    sessionStorage.setItem('user', JSON.stringify(this.currentUser));
                    this.sendUserSearchMessageCallback?.callback();
                }
                this.loginCallback?.callback();
                break;
            case ResponseType.USER_ACTIVE:
                this.showActiveUserCallback?.callback(response.payload.users);
                break;
            case ResponseType.USER_INACTIVE:
                this.showInactiveUserCallback?.callback(response.payload.users);
                break;
            case ResponseType.LOGOUT:
                this.logoutCallback?.callback();
                break;
            case ResponseType.USER_EXTERNAL_LOGIN:
                this.sendUserSearchMessageCallback?.callback();
                break;
            case ResponseType.USER_EXTERNAL_LOGOUT:
                this.sendUserSearchMessageCallback?.callback();
                break;
            case ResponseType.MSG_FROM_USER:
                this.historyMessage?.callback(response.payload.messages);
                break;
            case ResponseType.MSG_SEND:
                this.receivingMessageFromUser?.callback(response.payload.message);
                break;
            case ResponseType.MSG_DELIVER:
                this.changeDeliveredStatus?.callback(response.payload.message);
                break;
            case ResponseType.MSG_READ:
                this.changeReadedStatus?.callback(response.payload.message);
                break;
            case ResponseType.MSG_DELETE:
                this.deleteMessage?.callback(response.payload.message);
                break;
            case ResponseType.MSG_EDIT:
                this.editMessage?.callback(response.payload.message);
                break;
            default:
                break;
        }
    }

    getWebSocket() {
        return this.ws;
    }

    sendMessageToServer(msg: RequestInfo) {
        this.waitingForConnection(
            {
                callback: () => {
                    this.ws.send(JSON.stringify(msg));
                },
            },
            1000
        );
    }

    waitingForConnection(callback: CallbackInfo, resendInterval: number) {
        if (this.ws.readyState === this.ws.OPEN) {
            callback.callback();
        } else {
            setTimeout(() => this.waitingForConnection(callback, resendInterval), resendInterval);
        }
    }

    setOpenCallback(callback: CallbackInfo) {
        this.openCallback = callback;
    }

    setCloseCallback(callback: CallbackInfo) {
        this.closeCallback = callback;
    }

    setLoginErrorCallback(callback: CallbackErrorInfo) {
        this.loginErrorCallback = callback;
    }

    setLoginCallback(callback: CallbackInfo) {
        this.loginCallback = callback;
    }

    setLogoutCallback(callback: CallbackInfo) {
        this.logoutCallback = callback;
    }

    setShowActiveUserCallback(callback: CallbackUsersInfo) {
        this.showActiveUserCallback = callback;
    }

    setShowInactiveUserCallback(callback: CallbackUsersInfo) {
        this.showInactiveUserCallback = callback;
    }

    setSendUserSearchMessageCallback(callback: CallbackInfo) {
        this.sendUserSearchMessageCallback = callback;
    }

    setMaybeCurrentUser(user: UserType) {
        this.currentUser = user;
    }

    setHistoryMessageCallback(callback: CallbackMessagesInfo) {
        this.historyMessage = callback;
    }

    setReceivingMessageFromUserCallback(callback: CallbackMessageInfo) {
        this.receivingMessageFromUser = callback;
    }

    setChangeDeliveredCallback(callback: CallbackDeliveredInfo) {
        this.changeDeliveredStatus = callback;
    }

    setChangeReadedCallback(callback: CallbackReadedInfo) {
        this.changeReadedStatus = callback;
    }

    setDeleteCallback(callback: CallbackDeleteInfo) {
        this.deleteMessage = callback;
    }

    setEditCallback(callback: CallbackEditInfo) {
        this.editMessage = callback;
    }
}
