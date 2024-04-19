import { UserType } from '../View/Validation/types';
import { CallbackErrorInfo, CallbackInfo, CallbackUsersInfo, RequestInfo, ResponseInfo, ResponseType } from './types';

export default class WebSocketApi {
    ws: WebSocket;

    currentUser: UserType | null;

    loginErrorCallback: CallbackErrorInfo | null;

    loginCallback: CallbackInfo | null;

    logoutCallback: CallbackInfo | null;

    showActiveUserCallback: CallbackUsersInfo | null;

    showInactiveUserCallback: CallbackUsersInfo | null;

    sendUserSearchMessageCallback: CallbackInfo | null;

    constructor() {
        this.ws = new WebSocket('ws://127.0.0.1:4000');
        this.currentUser = null;
        this.loginErrorCallback = null;
        this.loginCallback = null;
        this.logoutCallback = null;
        this.showActiveUserCallback = null;
        this.showInactiveUserCallback = null;
        this.sendUserSearchMessageCallback = null;
        this.connectionToServer();
    }

    connectionToServer() {
        this.ws.onopen = () => {
            console.log('Connection to server established');
        };

        this.ws.addEventListener('message', (event) => {
            const response: ResponseInfo = JSON.parse(event.data);
            this.switchTypeMessage(response);
        });
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
}
