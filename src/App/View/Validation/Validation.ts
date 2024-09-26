import WebSocketApi from '../../WebSocketApi/WebSocketApi';
import { RequestType, RequestInfo } from '../../WebSocketApi/types';
import { isNull } from '../../utils/base-methods';
import { UserType } from './types';

export default class ValidationForm {
    loginButton: HTMLButtonElement;

    constructor(button: HTMLButtonElement) {
        this.loginButton = button;
    }

    static user: UserType = {
        login: '',
        password: '',
    };

    static invalidListenner(element: HTMLInputElement) {
        if (element.validity.valueMissing) {
            element.setCustomValidity('Is a required input field');
        }
    }

    static inputListenner(element: HTMLInputElement, label: HTMLLabelElement, state: 'name' | 'password') {
        const errorLabel = label;
        errorLabel.textContent = '';
        element.setCustomValidity('');
        if (element.validity.tooShort) {
            errorLabel.textContent += `The minimum name length is ${element.minLength} characters.`;
            element.setCustomValidity(' ');
        } else if (element.validity.patternMismatch) {
            if (state === 'name') {
                errorLabel.textContent +=
                    'Start typing with a capital letter. Acceptable characters are the English alphabet and the «-» symbol.';
            } else if (state === 'password') {
                errorLabel.textContent +=
                    'Acceptable characters are the English alphabet and digits. At least one uppercase English letter, one lowercase English letter, one digit.';
            }
            element.setCustomValidity(' ');
        }
        if (element.checkValidity()) {
            if (element.id === 'name') {
                ValidationForm.user.login = element.value;
            } else if (element.id === 'password') {
                ValidationForm.user.password = element.value;
            }
        }
    }

    static setInputListeners(element: HTMLInputElement, label: HTMLLabelElement, state: 'name' | 'password') {
        element.addEventListener('invalid', () => ValidationForm.invalidListenner(element));
        element.addEventListener('input', () => ValidationForm.inputListenner(element, label, state));
    }

    static formListener(event: Event, ws: WebSocketApi) {
        event.preventDefault();
        sessionStorage.clear();
        const request: RequestInfo = {
            id: '',
            type: RequestType.LOGIN,
            payload: {
                user: ValidationForm.user,
            },
        };
        ws.setMaybeCurrentUser(ValidationForm.user);
        ws.sendMessageToServer(request);
    }

    setFormListeners(form: HTMLFormElement, ws: WebSocketApi) {
        form.addEventListener('input', () => {
            const nameInput: HTMLInputElement | null = form.querySelector<HTMLInputElement>('.name-input');
            const passwordInput: HTMLInputElement | null = form.querySelector<HTMLInputElement>('.password-input');
            isNull(nameInput);
            isNull(passwordInput);
            if (nameInput.checkValidity() && passwordInput.checkValidity()) {
                this.loginButton.disabled = false;
            } else {
                this.loginButton.disabled = true;
            }
        });
        form.addEventListener('submit', (event: Event) => ValidationForm.formListener(event, ws));
    }
}
