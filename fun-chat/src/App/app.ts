import { PageInfo, PagePath, Router } from './Router/Router';
import FooterView from './View/Footer/FooterView';
import HeaderView from './View/Header/HeaderView';
import View from './View/View';
import { isNull } from './utils/base-methods';
import './app.css';
import '../components/css/normalize.css';
import LoginView from './View/LoginView/LoginView';
import Component from './utils/base-component';
import WebSocketApi from './WebSocketApi/WebSocketApi';
import ChatView from './View/ChatView/ChatView';
import { RequestType, RequestInfo } from './WebSocketApi/types';
import AboutView from './View/AboutView/AboutView';
import ModalView from './View/ModalView/ModalView';

export default class App {
    container: HTMLElement;

    header: HeaderView;

    footer: FooterView;

    router: Router;

    contentContainer: HTMLDivElement;

    modal: ModalView;

    ws: WebSocketApi;

    constructor() {
        this.container = document.body;
        const pages: PageInfo[] = this.initPages();
        this.router = new Router(pages);
        this.footer = new FooterView();
        this.ws = new WebSocketApi();
        this.modal = new ModalView(this.ws);
        this.header = new HeaderView(this.router, this.ws);
        this.contentContainer = new Component('div', '', '', ['content-container']).getContainer<HTMLDivElement>();
        this.initApp();
    }

    initApp() {
        const headerContainer: HTMLDivElement | null = this.header.getContainer();
        isNull(headerContainer);
        const footerContainer: HTMLDivElement | null = this.footer.getContainer();
        isNull(footerContainer);
        const modalContainer: HTMLDivElement | null = this.modal.getContainer();
        isNull(modalContainer);
        this.container.append(headerContainer, this.contentContainer, footerContainer, modalContainer);
        this.createView();
    }

    createView() {
        const userInfo: string | null = sessionStorage.getItem('user');
        if (userInfo) {
            const sessionInfo: string | null = sessionStorage.getItem('user');
            isNull(sessionInfo);
            const request: RequestInfo = {
                id: '',
                type: RequestType.LOGIN,
                payload: {
                    user: JSON.parse(sessionInfo),
                },
            };
            this.ws.sendMessageToServer(request);
            this.router.navigate('chat');
        } else {
            this.router.navigate('login');
        }
    }

    initPages() {
        const pages: PageInfo[] = [
            {
                pagePath: PagePath.LOGIN,
                callback: () => {
                    const loginView: LoginView = new LoginView(this.router, this.ws);
                    this.setView(loginView);
                },
            },
            {
                pagePath: PagePath.CHAT,
                callback: () => {
                    const chatView: ChatView = new ChatView(this.ws, this.header, this.modal);
                    this.setView(chatView);
                },
            },
            {
                pagePath: PagePath.ABOUT,
                callback: () => {
                    const aboutView: AboutView = new AboutView(this.router);
                    this.setView(aboutView);
                },
            },
        ];
        return pages;
    }

    setView(view: View) {
        const viewContainer: HTMLDivElement | null = view.getContainer();
        isNull(viewContainer);
        this.contentContainer.replaceChildren();
        this.contentContainer.append(viewContainer);
    }
}
