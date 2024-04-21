import WebSocketApi from '../../WebSocketApi/WebSocketApi';
import {
    RequestType,
    RequestInfo,
    MessageSendResponseType,
    MessageResponseDeliveredType,
    MessageResponseReadType,
} from '../../WebSocketApi/types';
import Component from '../../utils/base-component';
import { isNull } from '../../utils/base-methods';
import { UserResponseType, UserType } from '../Validation/types';
import View from '../View';
import './chat.css';

export default class ChatView extends View {
    dialogContainer: HTMLDivElement;

    currentCompanion: string | null;

    currentUser: string | null;

    ws: WebSocketApi;

    constructor(ws: WebSocketApi) {
        super(['chat-container']);
        this.ws = ws;
        this.currentCompanion = null;
        this.currentUser = null;
        this.dialogContainer = new Component('div', '', 'Select a person to start a conversation.', [
            'dialog-container',
        ]).getContainer<HTMLDivElement>();
        this.initChat();
    }

    initChat() {
        const sessionInfo: string | null = sessionStorage.getItem('user');
        isNull(sessionInfo);
        const user: UserType = JSON.parse(sessionInfo);
        this.currentUser = user.login;
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
        this.sendHistoryMessagesRequared();
        this.ws.setHistoryMessageCallback({
            callback: (messages: MessageSendResponseType[]) => {
                this.setHistoryMessages(messagesContainer, messages);
            },
        });
        this.ws.setReceivingMessageFromUserCallback({
            callback: (message: MessageSendResponseType) => {
                this.ReceivingMessageFromUser(messagesContainer, message);
            },
        });
        this.dialogContainer.replaceChildren();
        this.dialogContainer.append(headerChat, messagesContainer);
        this.createWriteBox(messagesContainer);
    }

    sendHistoryMessagesRequared() {
        if (this.currentCompanion !== null) {
            const requared: RequestInfo = {
                id: '',
                type: RequestType.MSG_FROM_USER,
                payload: {
                    user: {
                        login: this.currentCompanion,
                    },
                },
            };
            this.ws.sendMessageToServer(requared);
        }
    }

    setHistoryMessages(messagesContainer: HTMLDivElement, messages: MessageSendResponseType[]) {
        const copyMsgContainer: HTMLDivElement = messagesContainer;
        this.ws.setChangeDeliveredCallback({
            callback: (message: MessageResponseDeliveredType) => {
                ChatView.changeDeliveredStatus(message);
            },
        });
        this.ws.setChangeReadedCallback({
            callback: (message: MessageResponseReadType) => {
                ChatView.changeReadedStatus(message);
            },
        });
        messages.forEach((message) => {
            this.ReceivingMessageFromUser(messagesContainer, message);
        });
        const notReadMessages: NodeListOf<HTMLDivElement> | null =
            messagesContainer.querySelectorAll('.not-read.companion-msg');
        if (notReadMessages !== null && notReadMessages.length) {
            const separator: HTMLDivElement = new Component('div', '', 'New messages', [
                'separator',
            ]).getContainer<HTMLDivElement>();
            notReadMessages[0].before(separator);
            copyMsgContainer.scrollTop = separator.offsetTop - 300;
        } else {
            copyMsgContainer.scrollTop = messagesContainer.scrollHeight;
        }
        messagesContainer.addEventListener('wheel', (event: Event) => this.readListener(event, messagesContainer));
        messagesContainer.addEventListener('touchend', (event: Event) => this.readListener(event, messagesContainer));
        messagesContainer.addEventListener('click', (event: Event) => this.readListener(event, messagesContainer));
    }

    static changeReadedStatus(messageInfo: MessageResponseReadType) {
        const messageWrapper: HTMLElement | null = document.getElementById(`${messageInfo.id}`);
        if (messageWrapper !== null) {
            messageWrapper.classList.remove('not-read');
            const statusWrapper: HTMLDivElement | null = messageWrapper.querySelector('.message-status');
            isNull(statusWrapper);
            if (messageInfo.status.isReaded && messageWrapper.classList.contains('own-msg')) {
                statusWrapper.textContent = '✓✓';
            }
        }
    }

    readListener(event: Event, messagesContainer: HTMLDivElement) {
        const separator: HTMLDivElement | null = document.querySelector('.separator');
        if (event.isTrusted) {
            if (separator !== null) {
                separator.remove();
            }
        }
        this.changeReadStatusSend(messagesContainer);
    }

    static changeDeliveredStatus(messageInfo: MessageResponseDeliveredType) {
        const messageWrapper: HTMLElement | null = document.getElementById(`${messageInfo.id}`);
        isNull(messageWrapper);
        const statusWrapper: HTMLDivElement | null = messageWrapper.querySelector('.message-status');
        isNull(statusWrapper);
        if (messageInfo.status.isDelivered) {
            statusWrapper.textContent = '✔';
        }
    }

    changeReadStatusSend(messagesContainer: HTMLDivElement) {
        const notReadMessages: NodeListOf<HTMLDivElement> | null =
            messagesContainer.querySelectorAll('.not-read.companion-msg');
        notReadMessages.forEach((message) => {
            const requared: RequestInfo = {
                id: '',
                type: RequestType.MSG_READ,
                payload: {
                    message: {
                        id: message.id,
                    },
                },
            };
            this.ws.sendMessageToServer(requared);
        });
    }

    static formatDateNumber(value: number) {
        if (value < 10) {
            return `0${value}`;
        }
        return value;
    }

    static dateFormat(date: number) {
        const dateMessage: Date = new Date(date);
        return `${ChatView.formatDateNumber(dateMessage.getHours())}:${ChatView.formatDateNumber(dateMessage.getMinutes())} 
            ${ChatView.formatDateNumber(dateMessage.getDate())}.${ChatView.formatDateNumber(dateMessage.getMonth() + 1)}.${ChatView.formatDateNumber(dateMessage.getFullYear())}`;
    }

    ReceivingMessageFromUser(messagesContainer: HTMLDivElement, message: MessageSendResponseType) {
        if (message.from === this.currentCompanion || message.from === this.currentUser) {
            const copyMsgContainer: HTMLDivElement = messagesContainer;
            const messageWrapper: HTMLDivElement = new Component('div', '', '', [
                'message-wrapper',
            ]).getContainer<HTMLDivElement>();
            messageWrapper.id = message.id;
            const messageInfo: HTMLDivElement = new Component('div', '', '', [
                'message-info-wrapper',
            ]).getContainer<HTMLDivElement>();
            const messageSender: HTMLDivElement = new Component('div', '', '', [
                'message-sender',
            ]).getContainer<HTMLDivElement>();
            const messageDate: HTMLDivElement = new Component('div', '', '', [
                'message-date',
            ]).getContainer<HTMLDivElement>();
            messageDate.textContent = ChatView.dateFormat(message.datetime);
            const messageText: HTMLDivElement = new Component('div', '', '', [
                'message-content',
            ]).getContainer<HTMLDivElement>();
            const messageStatus: HTMLDivElement = new Component('div', '', '', [
                'message-status',
            ]).getContainer<HTMLDivElement>();
            if (this.currentCompanion === message.from) {
                messageWrapper.classList.add('companion-msg');
                messageSender.textContent = message.from;
                if (!message.status.isReaded) {
                    messageWrapper.classList.add('not-read');
                }
                messageInfo.append(messageSender, messageDate);
            } else {
                messageWrapper.classList.add('own-msg');
                messageSender.textContent = 'You';
                if (!message.status.isDelivered) {
                    messageStatus.textContent = '🐝';
                } else if (!message.status.isReaded) {
                    messageStatus.textContent = '✔';
                } else {
                    messageStatus.textContent = '✓✓';
                }
                messageInfo.append(messageDate, messageSender);
            }
            messageText.textContent = message.text;
            messageWrapper.append(messageInfo, messageText, messageStatus);
            copyMsgContainer.append(messageWrapper);
            const separator: HTMLDivElement | null = document.querySelector('.separator');
            if (separator !== null) {
                copyMsgContainer.scrollTop = separator.offsetTop - 300;
            } else {
                copyMsgContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    }

    createWriteBox(messagesContainer: HTMLDivElement) {
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
        messageForm.addEventListener('submit', (event: Event) =>
            this.sendMessageToCompanion(event, messageText, messagesContainer)
        );
        messageText.addEventListener('keypress', (event: KeyboardEvent) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                this.sendMessageToCompanion(event, messageText, messagesContainer);
            }
        });
        this.dialogContainer.append(writeContainer);
    }

    sendMessageToCompanion(event: Event, messageText: HTMLTextAreaElement, messagesContainer: HTMLDivElement) {
        event.preventDefault();
        const copyMessageText: HTMLTextAreaElement = messageText;
        if (this.currentCompanion !== null && messageText.value !== '') {
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
            const separator: HTMLDivElement | null = document.querySelector('.separator');
            if (separator !== null) {
                separator.remove();
            }
            this.changeReadStatusSend(messagesContainer);
        }
    }
}
