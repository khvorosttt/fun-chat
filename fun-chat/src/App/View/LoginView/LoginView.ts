import { PagePath, Router } from '../../Router/Router';
import WebSocketApi from '../../WebSocketApi/WebSocketApi';
import Component from '../../utils/base-component';
import { isNull } from '../../utils/base-methods';
import ValidationForm from '../Validation/Validation';
import View from '../View';
import './login.css';

interface Info {
    id: string;
    minLength: number;
    text: string;
    classes: string[];
    error: string;
    pattern: string;
}
const nameInfo: Info = {
    id: 'name',
    minLength: 3,
    text: 'Name',
    classes: ['name-input'],
    error: 'error-name-msg',
    pattern: '^[A-Z][A-Za-z]*-?[A-Za-z]*',
};
const passwordInfo: Info = {
    id: 'password',
    minLength: 6,
    text: 'Password',
    classes: ['password-input'],
    error: 'error-password-msg',
    pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}',
};

const nameLabel: Pick<Info, 'text' | 'classes'> = {
    text: 'Enter Name',
    classes: ['name-info'],
};

const passwordLabel = {
    text: 'Enter password',
    classes: ['password-info'],
};

export default class LoginView extends View {
    static serverErrorBox: HTMLLabelElement | null;

    constructor(router: Router, ws: WebSocketApi) {
        super(['login']);
        LoginView.serverErrorBox = null;
        this.createForm('', '', ['login-form'], router, ws);
    }

    createForm(id: string, text: string, classes: string[], router: Router, ws: WebSocketApi) {
        const form: Component = new Component('form', id, text, classes);
        const formName: HTMLHeadingElement = new Component('h1', '', 'Log in', [
            'login-name',
        ]).getContainer<HTMLHeadingElement>();
        LoginView.serverErrorBox = LoginView.createLabel('', ['server-error-msg']);
        const button = LoginView.createButton('login-button', 'Login', ['login-button']);
        const validation: ValidationForm = new ValidationForm(button);
        const nameBox = LoginView.createNameBox(nameInfo, nameLabel, ['nameBox'], 'name');
        const passwordBox = LoginView.createNameBox(passwordInfo, passwordLabel, ['passwordBox'], 'password');
        form.setChildren(formName, LoginView.serverErrorBox, nameBox, passwordBox, button);
        const formContainer: HTMLFormElement = form.getContainer<HTMLFormElement>();
        ws.setLoginErrorCallback({
            callback: LoginView.setServerError,
        });
        ws.setLoginCallback({
            callback: () => {
                LoginView.addUser();
                router.navigate(PagePath.CHAT);
            },
        });
        validation.setFormListeners(formContainer, ws);
        this.container?.append(formContainer);
    }

    static setServerError(msg: string) {
        isNull(LoginView.serverErrorBox);
        LoginView.serverErrorBox.textContent = msg;
    }

    static addUser() {
        sessionStorage.setItem('user', JSON.stringify(ValidationForm.user));
    }

    static createNameBox(
        name: Info,
        label: Pick<Info, 'text' | 'classes'>,
        classes: string[],
        state: 'name' | 'password'
    ) {
        const nameBox: Component = new Component('div', '', '', classes);
        const inputName: HTMLInputElement = LoginView.createInput(
            true,
            name.id,
            name.text,
            name.minLength,
            name.pattern,
            state,
            name.classes
        );
        const nameInfoLabel: HTMLLabelElement = LoginView.createLabel(label.text, label.classes, inputName);
        const errorNameBox: HTMLLabelElement = LoginView.createLabel('', [name.error]);
        ValidationForm.setInputListeners(inputName, errorNameBox, state);
        nameBox.setChildren(nameInfoLabel, inputName, errorNameBox);
        return nameBox.getContainer<HTMLDivElement>();
    }

    static createLabel(text: string, classes?: string[], input?: HTMLInputElement) {
        const label: Component = new Component('label', '', text, classes);
        if (typeof input !== 'undefined') {
            label.getContainer<HTMLLabelElement>().htmlFor = input.id;
        }
        return label.getContainer<HTMLLabelElement>();
    }

    static createInput(
        required: boolean,
        id: string,
        text: string,
        minLength: number,
        validatePattern: string,
        state: 'name' | 'password',
        classes?: string[]
    ) {
        const input: Component = new Component('input', id, text, classes);
        const inputContainer: HTMLInputElement = input.getContainer<HTMLInputElement>();
        inputContainer.required = required;
        inputContainer.minLength = minLength;
        inputContainer.pattern = validatePattern;
        if (state === 'password') {
            inputContainer.type = 'password';
            inputContainer.autocomplete = 'current-password';
        } else {
            inputContainer.autocomplete = 'username';
            inputContainer.maxLength = 20;
        }
        return input.getContainer<HTMLInputElement>();
    }

    static createButton(id: string, text: string, classes: string[]) {
        const button: Component = new Component('button', id, text, classes);
        const buttonContainer: HTMLButtonElement = button.getContainer<HTMLButtonElement>();
        buttonContainer.disabled = true;
        return buttonContainer;
    }
}
