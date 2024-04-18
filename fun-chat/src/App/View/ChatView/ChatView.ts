import WebSocketApi from '../../WebSocketApi/WebSocketApi';
import { RequestType, RequestInfo } from '../../WebSocketApi/types';
import Component from '../../utils/base-component';
import { isNull } from '../../utils/base-methods';
import { UserResponseType, UserType } from '../Validation/types';
import View from '../View';
import './chat.css';

export default class ChatView extends View {
    constructor(ws: WebSocketApi) {
        super(['chat-container']);
        this.initChat(ws);
    }

    initChat(ws: WebSocketApi) {
        this.setUsersContainer(ws);
        const dialogContainer: HTMLDivElement = new Component('div', '', '', [
            'dialog-container',
        ]).getContainer<HTMLDivElement>();
        this.container?.append(dialogContainer);
    }

    setUsersContainer(ws: WebSocketApi) {
        const usersContainer: HTMLDivElement = new Component('div', '', '', [
            'users-container',
        ]).getContainer<HTMLDivElement>();
        const searchUser: HTMLInputElement = new Component('input', '', '', [
            'search-user-input',
        ]).getContainer<HTMLInputElement>();
        const usersWrapper: HTMLUListElement = new Component('ul', '', '', [
            'users-list-wrapper',
        ]).getContainer<HTMLUListElement>();
        ChatView.sendUserSearchMessage(ws, usersWrapper);
        usersContainer.append(searchUser, usersWrapper);
        this.container?.append(usersContainer);
    }

    static sendUserSearchMessage(ws: WebSocketApi, usersWrapper: HTMLUListElement) {
        const activeUsers: RequestInfo = {
            id: '',
            type: RequestType.USER_ACTIVE,
            payload: null,
        };
        ws.sendMessageToServer(activeUsers);
        const unactiveUsers: RequestInfo = {
            id: '',
            type: RequestType.USER_INACTIVE,
            payload: null,
        };
        usersWrapper.replaceChildren();
        ws.setShowUserCallback({
            callback: (users: UserResponseType[]) => {
                ChatView.showUsersInList(usersWrapper, users);
            },
        });
        ws.sendMessageToServer(unactiveUsers);
    }

    static showUsersInList(usersList: HTMLUListElement, users: UserResponseType[]) {
        const sessionInfo: string | null = sessionStorage.getItem('user');
        isNull(sessionInfo);
        const currentUser: UserType = JSON.parse(sessionInfo);
        users.forEach((user) => {
            if (currentUser.login !== user.login) {
                const userNameContainer: HTMLLIElement = new Component('li', '', `${user.login}`, [
                    'user-li-wrapper',
                ]).getContainer<HTMLLIElement>();
                if (user.isLogined) {
                    userNameContainer.classList.add('active-user');
                } else {
                    userNameContainer.classList.add('inactive-user');
                }
                usersList.append(userNameContainer);
            }
        });
    }
}
