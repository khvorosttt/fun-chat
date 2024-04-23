import WebSocketApi from '../../WebSocketApi/WebSocketApi';
import { DeleteResponseType, RequestType } from '../../WebSocketApi/types';
import Component from '../../utils/base-component';
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
        this.textContainer = new Component('textarea', '', 'mmm', [
            'message-change-text',
        ]).getContainer<HTMLTextAreaElement>();
        this.initModal();
    }

    initModal() {
        const modal: HTMLDivElement = new Component('div', '', '', ['modal']).getContainer<HTMLDivElement>();
        const buttonsWrapper: HTMLDivElement = new Component('div', '', '', [
            'buttons-change-wrapper',
        ]).getContainer<HTMLDivElement>();
        const sendButton: HTMLButtonElement = new Component('button', '', 'Send', [
            'send-change-button',
        ]).getContainer<HTMLButtonElement>();
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

    deleteLogic(message: DeleteResponseType) {
        const messageWrapper: HTMLElement | null = document.getElementById(message.id);
        if (messageWrapper !== null && message.status.isDeleted) {
            messageWrapper.remove();
            this.cancelLogic();
        }
    }
}
