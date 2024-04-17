import { CallbackErrorInfo, CallbackInfo, RequestInfo, ResponseInfo, ResponseType } from './types';

export default class WebSocketApi {
    ws: WebSocket = new WebSocket('ws://localhost:4000');

    loginErrorCallback: CallbackErrorInfo | null;

    loginCallback: CallbackInfo | null;

    constructor() {
        this.loginErrorCallback = null;
        this.loginCallback = null;
        this.connectionToServer();
    }

    connectionToServer() {
        this.ws = new WebSocket('ws://localhost:4000');

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
            default:
                break;
        }
    }

    getWebSocket() {
        return this.ws;
    }

    sendMessageToServer(msg: RequestInfo) {
        this.ws.send(JSON.stringify(msg));
    }

    setLoginErrorCallback(callback: CallbackErrorInfo) {
        this.loginErrorCallback = callback;
    }

    setLoginCallback(callback: CallbackInfo) {
        this.loginCallback = callback;
    }
}
