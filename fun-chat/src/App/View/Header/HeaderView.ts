import Component from '../../utils/base-component';
import { isNull } from '../../utils/base-methods';
import View from '../View';
import './header.css';

export default class HeaderView extends View {
    currentUser: HTMLDivElement | null;

    constructor() {
        super(['header']);
        this.currentUser = null;
        this.initHeader();
    }

    initHeader() {
        const nameApp: HTMLHeadingElement = new Component('h1', '', 'Fun Chat', [
            'name-app',
        ]).getContainer<HTMLHeadingElement>();
        const logoutButton: HTMLButtonElement = new Component('button', '', 'LOGOUT', [
            'logout-button',
        ]).getContainer<HTMLButtonElement>();
        this.currentUser = new Component('div', '', '', ['current-user-name']).getContainer<HTMLDivElement>();
        this.setNameUser();
        this.container?.append(nameApp, this.currentUser, logoutButton);
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
