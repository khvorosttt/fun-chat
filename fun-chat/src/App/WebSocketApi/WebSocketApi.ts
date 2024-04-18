import { CallbackErrorInfo, CallbackInfo, CallbackUsersInfo, RequestInfo, ResponseInfo, ResponseType } from './types';

export default class WebSocketApi {
    ws: WebSocket;

    loginErrorCallback: CallbackErrorInfo | null;

    loginCallback: CallbackInfo | null;

    showUserCallback: CallbackUsersInfo | null;

    constructor() {
        this.ws = new WebSocket('ws://127.0.0.1:4000');
        this.loginErrorCallback = null;
        this.loginCallback = null;
        this.showUserCallback = null;
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
                this.loginCallback?.callback();
                break;
            case ResponseType.USER_ACTIVE:
                this.showUserCallback?.callback(response.payload.users);
                break;
            case ResponseType.USER_INACTIVE:
                this.showUserCallback?.callback(response.payload.users);
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

    setShowUserCallback(callback: CallbackUsersInfo) {
        this.showUserCallback = callback;
    }
}
