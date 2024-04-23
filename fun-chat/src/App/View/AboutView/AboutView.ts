import Component from '../../utils/base-component';
import View from '../View';
import { Router } from '../../Router/Router';
import './about.css';

const ABOUT_TEXT: string =
    'This application is intended for communication. Select your interlocutor from the list of registered users and start chatting.';

export default class AboutView extends View {
    constructor(router: Router) {
        super(['about']);
        this.initAboutView(router);
    }

    initAboutView(router: Router) {
        const aboutWrapper: HTMLDivElement = new Component('div', '', '', [
            'about-wrapper',
        ]).getContainer<HTMLDivElement>();
        const aboutText: HTMLDivElement = new Component('div', '', ABOUT_TEXT, [
            'about-text',
        ]).getContainer<HTMLDivElement>();
        const buttonBack: HTMLButtonElement = new Component('button', '', 'Back', [
            'button-back',
        ]).getContainer<HTMLButtonElement>();
        buttonBack.addEventListener('click', () => AboutView.backLogic(router));
        aboutWrapper.append(aboutText, buttonBack);
        this.container?.append(aboutWrapper);
    }

    static backLogic(router: Router) {
        const sessionInfo: string | null = sessionStorage.getItem('user');
        if (sessionInfo !== null) {
            router.navigate('chat');
        } else {
            router.navigate('login');
        }
    }
}
