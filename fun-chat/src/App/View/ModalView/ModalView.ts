import WebSocketApi from '../../WebSocketApi/WebSocketApi';
import { DeleteResponseType, MessageResponseEditedType, RequestType } from '../../WebSocketApi/types';
import Component from '../../utils/base-component';
import { isNull } from '../../utils/base-methods';
import View from '../View';
import './modal.css';

export default class ModalView extends View {
    id: string | null;

    text: string | null;

    textContainer: HTMLTextAreaElement;

    ws: WebSocketApi;

    constructor(ws: WebSocketApi) {
        super(['modal-background']);
        this.id = null;
        this.text = null;
        this.ws = ws;
        this.textContainer = new Component('textarea', '', '', [
            'message-change-text',
        ]).getContainer<HTMLTextAreaElement>();
        this.initModal();
    }

    initModal() {
        const modal: HTMLDivElement = new Component('div', '', '', ['modal']).getContainer<HTMLDivElement>();
        const buttonsWrapper: HTMLDivElement = new Component('div', '', '', [
            'buttons-change-wrapper',
        ]).getContainer<HTMLDivElement>();
        const sendButton: HTMLButtonElement = new Component('button', '', 'Edit', [
            'send-change-button',
        ]).getContainer<HTMLButtonElement>();
        sendButton.addEventListener('click', () => this.changeResponse(this.textContainer.value));
        const cancelButton: HTMLButtonElement = new Component('button', '', 'Cancel', [
            'cancel-change-button',
        ]).getContainer<HTMLButtonElement>();
        cancelButton.addEventListener('click', () => this.cancelLogic());
        const deleteButton: HTMLButtonElement = new Component('button', '', 'Delete', [
            'delete-button',
        ]).getContainer<HTMLButtonElement>();
        deleteButton.addEventListener('click', () => this.deleteResponse());
        this.ws.setDeleteCallback({
            callback: (message: DeleteResponseType) => {
                this.deleteLogic(message);
            },
        });
        this.ws.setEditCallback({
            callback: (message: MessageResponseEditedType) => {
                this.changeLogic(message);
            },
        });
        buttonsWrapper.append(sendButton, cancelButton, deleteButton);
        modal.append(this.textContainer, buttonsWrapper);
        this.container?.append(modal);
    }

    setMessageData(id: string, text: string | null) {
        this.id = id;
        this.text = text;
        if (text !== null) {
            this.textContainer.value = text;
        }
    }

    setClassActive() {
        this.container?.classList.add('modal-active');
    }

    cancelLogic() {
        this.id = null;
        this.text = null;
        this.container?.classList.remove('modal-active');
    }

    deleteResponse() {
        if (this.id !== null) {
            this.ws.sendMessageToServer({
                id: '',
                type: RequestType.MSG_DELETE,
                payload: {
                    message: {
                        id: this.id,
                    },
                },
            });
        }
    }

    changeResponse(text: string | null) {
        this.text = text;
        if (this.id !== null && this.text?.trim() !== '' && this.text !== null) {
            this.ws.sendMessageToServer({
                id: '',
                type: RequestType.MSG_EDIT,
                payload: {
                    message: {
                        id: this.id,
                        text: this.text,
                    },
                },
            });
        }
    }

    changeLogic(message: MessageResponseEditedType) {
        const messageWrapper: HTMLElement | null = document.getElementById(message.id);
        if (messageWrapper !== null && message.status.isEdited) {
            const messageText: HTMLDivElement | null = messageWrapper.querySelector('.message-content');
            isNull(messageText);
            const messageEdited: HTMLDivElement | null = messageWrapper.querySelector('.message-status-edited');
            isNull(messageEdited);
            messageText.textContent = message.text;
            messageEdited.textContent = '✏️';
            this.cancelLogic();
        }
    }

    deleteLogic(message: DeleteResponseType) {
        const messageWrapper: HTMLElement | null = document.getElementById(message.id);
        if (messageWrapper !== null && message.status.isDeleted) {
            messageWrapper.remove();
            this.cancelLogic();
        }
    }
}
