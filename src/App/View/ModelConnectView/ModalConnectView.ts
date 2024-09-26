import { PagePath, Router } from '../../Router/Router';
import WebSocketApi from '../../WebSocketApi/WebSocketApi';
import Component from '../../utils/base-component';
import ModalView from '../ModalView/ModalView';
import View from '../View';
import './modal.css';

export default class ModalConnectView extends View {
    ws: WebSocketApi;

    modalChange: ModalView;

    constructor(ws: WebSocketApi, router: Router, modal: ModalView) {
        super(['modal-background-connection']);
        this.ws = ws;
        this.modalChange = modal;
        this.initModal(router);
    }

    initModal(router: Router) {
        const modal: HTMLDivElement = new Component('div', '', 'Wait for connection to the server...', [
            'modal-connection',
        ]).getContainer<HTMLDivElement>();
        this.container?.append(modal);
        this.ws.setOpenCallback({
            callback: () => {
                this.removeClassActive();
                const sessionInfo: string | null = sessionStorage.getItem('user');
                if (sessionInfo !== null) {
                    router.navigate(PagePath.CHAT);
                }
                this.modalChange.resetMessageData();
            },
        });
        this.ws.setCloseCallback({
            callback: () => {
                this.setClassActive();
            },
        });
    }

    setClassActive() {
        this.container?.classList.add('modal-active');
    }

    removeClassActive() {
        this.container?.classList.remove('modal-active');
    }
}
