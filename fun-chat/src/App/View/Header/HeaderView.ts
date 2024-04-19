import { Router } from '../../Router/Router';
import WebSocketApi from '../../WebSocketApi/WebSocketApi';
import { RequestType, RequestInfo } from '../../WebSocketApi/types';
import Component from '../../utils/base-component';
import { isNull } from '../../utils/base-methods';
import View from '../View';
import './header.css';

export default class HeaderView extends View {
    currentUser: HTMLDivElement | null;

    constructor(router: Router, ws: WebSocketApi) {
        super(['header']);
        this.currentUser = null;
        this.initHeader(router, ws);
    }

    initHeader(router: Router, ws: WebSocketApi) {
        const nameApp: HTMLHeadingElement = new Component('h1', '', 'Fun Chat', [
            'name-app',
        ]).getContainer<HTMLHeadingElement>();
        const logoutButton: HTMLButtonElement = new Component('button', '', 'LOGOUT', [
            'logout-button',
        ]).getContainer<HTMLButtonElement>();
        logoutButton.addEventListener('click', () => HeaderView.logoutUser(router, ws));
        this.currentUser = new Component('div', '', '', ['current-user-name']).getContainer<HTMLDivElement>();
        this.setNameUser();
        this.container?.append(nameApp, this.currentUser, logoutButton);
    }

    static logoutUser(router: Router, ws: WebSocketApi) {
        const sessionInfo: string | null = sessionStorage.getItem('user');
        isNull(sessionInfo);
        const request: RequestInfo = {
            id: '',
            type: RequestType.LOGOUT,
            payload: {
                user: JSON.parse(sessionInfo),
            },
        };
        ws.sendMessageToServer(request);
        ws.setLogoutCallback({
            callback: () => {
                sessionStorage.clear();
                router.navigate('login');
            },
        });
    }

    setNameUser() {
        const sessionInfo: string | null = sessionStorage.getItem('user');
        let name: string;
        if (sessionInfo) {
            name = sessionInfo;
        } else {
            name = '';
        }
        isNull(this.currentUser);
        this.currentUser.textContent = name;
    }
}
