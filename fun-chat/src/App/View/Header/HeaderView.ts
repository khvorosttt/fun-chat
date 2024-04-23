import { Router } from '../../Router/Router';
import WebSocketApi from '../../WebSocketApi/WebSocketApi';
import { RequestType, RequestInfo } from '../../WebSocketApi/types';
import Component from '../../utils/base-component';
import { isNull } from '../../utils/base-methods';
import { UserType } from '../Validation/types';
import View from '../View';
import './header.css';

export default class HeaderView extends View {
    currentUser: HTMLDivElement | null;

    logoutButton: HTMLButtonElement | null;

    constructor(router: Router, ws: WebSocketApi) {
        super(['header']);
        this.currentUser = null;
        this.logoutButton = null;
        this.initHeader(router, ws);
    }

    initHeader(router: Router, ws: WebSocketApi) {
        const nameApp: HTMLHeadingElement = new Component('h1', '', 'Fun Chat', [
            'name-app',
        ]).getContainer<HTMLHeadingElement>();
        this.logoutButton = new Component('button', '', 'Logout', ['logout-button']).getContainer<HTMLButtonElement>();
        isNull(this.logoutButton);
        this.logoutButton.addEventListener('click', () => this.logoutUser(router, ws));
        this.currentUser = new Component('div', '', '', ['current-user-name']).getContainer<HTMLDivElement>();
        this.setNameUser();
        this.container?.append(nameApp, this.currentUser, this.logoutButton);
    }

    logoutUser(router: Router, ws: WebSocketApi) {
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
                this.logoutButton?.classList.remove('show');
                sessionStorage.clear();
                router.navigate('login');
            },
        });
    }

    setNameUser() {
        const sessionInfo: string | null = sessionStorage.getItem('user');
        let user: UserType | null;
        if (sessionInfo) {
            user = JSON.parse(sessionInfo);
        } else {
            user = null;
        }
        isNull(this.currentUser);
        this.currentUser.textContent = user ? user.login : '';
    }

    showLogoutButton() {
        this.logoutButton?.classList.add('show');
    }
}
