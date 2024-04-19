import WebSocketApi from '../../WebSocketApi/WebSocketApi';
import { RequestType, RequestInfo } from '../../WebSocketApi/types';
import Component from '../../utils/base-component';
import { isNull } from '../../utils/base-methods';
import { UserResponseType, UserType } from '../Validation/types';
import View from '../View';
import './chat.css';

export default class ChatView extends View {
    dialogContainer: HTMLDivElement;

    currentCompanion: string | null;

    ws: WebSocketApi;

    constructor(ws: WebSocketApi) {
        super(['chat-container']);
        this.ws = ws;
        this.currentCompanion = null;
        this.dialogContainer = new Component('div', '', 'Select a person to start a conversation.', [
            'dialog-container',
        ]).getContainer<HTMLDivElement>();
        this.initChat();
    }

    initChat() {
        this.setUsersContainer();
        this.container?.append(this.dialogContainer);
    }

    setUsersContainer() {
        const usersContainer: HTMLDivElement = new Component('div', '', '', [
            'users-container',
        ]).getContainer<HTMLDivElement>();
        const searchUser: HTMLInputElement = new Component('input', '', '', [
            'search-user-input',
        ]).getContainer<HTMLInputElement>();
        const usersWrapper: HTMLUListElement = new Component('ul', '', '', [
            'users-list-wrapper',
        ]).getContainer<HTMLUListElement>();
        this.sendUserSearchMessage(usersWrapper);
        this.ws.setSendUserSearchMessageCallback({
            callback: () => {
                this.sendUserSearchMessage(usersWrapper);
            },
        });
        usersContainer.append(searchUser, usersWrapper);
        this.container?.append(usersContainer);
    }

    sendUserSearchMessage(usersWrapper: HTMLUListElement) {
        this.ws.setShowActiveUserCallback({
            callback: (users: UserResponseType[]) => {
                usersWrapper.replaceChildren();
                this.showUsersInList(usersWrapper, users);
            },
        });
        this.ws.setShowInactiveUserCallback({
            callback: (users: UserResponseType[]) => {
                this.showUsersInList(usersWrapper, users);
            },
        });
        const activeUsers: RequestInfo = {
            id: '',
            type: RequestType.USER_ACTIVE,
            payload: null,
        };
        this.ws.sendMessageToServer(activeUsers);
        const unactiveUsers: RequestInfo = {
            id: '',
            type: RequestType.USER_INACTIVE,
            payload: null,
        };
        this.ws.sendMessageToServer(unactiveUsers);
    }

    showUsersInList(usersList: HTMLUListElement, users: UserResponseType[]) {
        const sessionInfo: string | null = sessionStorage.getItem('user');
        if (sessionInfo !== null) {
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
                    userNameContainer.addEventListener('click', (event: Event) => this.selectChat(event));
                    usersList.append(userNameContainer);
                }
            });
        }
    }

    selectChat(event: Event) {
        const currentElem: HTMLLIElement | null = <HTMLLIElement>event.currentTarget;
        isNull(currentElem);
        this.currentCompanion = currentElem.textContent;
        const headerChat: HTMLDivElement = new Component('div', '', `${currentElem.textContent}`, [
            'chat-header',
        ]).getContainer<HTMLDivElement>();
        if (currentElem.classList.contains('active-user')) {
            headerChat.classList.add('active-user');
        }
        const messagesContainer: HTMLDivElement = new Component('div', '', '', [
            'messages-container',
        ]).getContainer<HTMLDivElement>();
        this.dialogContainer.replaceChildren();
        this.dialogContainer.append(headerChat, messagesContainer);
        this.createWriteBox();
    }

    createWriteBox() {
        const writeContainer: HTMLDivElement = new Component('div', '', '', [
            'write-container',
        ]).getContainer<HTMLDivElement>();
        const messageForm: HTMLFormElement = new Component('form', '', '', [
            'message-form',
        ]).getContainer<HTMLFormElement>();
        const messageText: HTMLTextAreaElement = new Component('textarea', '', '', [
            'message-text',
        ]).getContainer<HTMLTextAreaElement>();
        const sendButton: HTMLButtonElement = new Component('button', '', '', [
            'send-button',
        ]).getContainer<HTMLButtonElement>();
        messageForm.append(messageText, sendButton);
        writeContainer.append(messageForm);
        messageForm.addEventListener('submit', (event: Event) => this.sendMessageToCompanion(event, messageText));
        this.dialogContainer.append(writeContainer);
    }

    sendMessageToCompanion(event: Event, messageText: HTMLTextAreaElement) {
        event.preventDefault();
        const copyMessageText: HTMLTextAreaElement = messageText;
        if (this.currentCompanion !== null && messageText.textContent !== null) {
            const message: RequestInfo = {
                id: '',
                type: RequestType.MSG_SEND,
                payload: {
                    message: {
                        to: this.currentCompanion,
                        text: messageText.value,
                    },
                },
            };
            copyMessageText.value = '';
            this.ws.sendMessageToServer(message);
        }
    }
}
