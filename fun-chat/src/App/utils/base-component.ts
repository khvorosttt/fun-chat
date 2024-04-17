import { isNull } from './base-methods';

interface CallBackParam {
    eventName?: string;
    callback?: (event?: Event) => void;
}

export default class Component {
    protected container: HTMLElement;

    constructor(tag: string, id?: string, text: string = '', classes?: string[], callback?: CallBackParam) {
        this.container = Component.createComponent(tag);
        this.setId(id);
        this.setTextContent(text);
        this.setClasses(classes);
        this.setCallback(callback);
    }

    getContainer<T>(): T {
        return <T>this.container;
    }

    static createComponent(tag: string) {
        const component: HTMLElement = document.createElement(tag);
        return component;
    }

    setId(id?: string) {
        if (id) {
            this.container.id = id;
        }
    }

    setTextContent(text: string) {
        if (this.container instanceof HTMLInputElement) {
            this.container.placeholder = text;
        } else {
            this.container.textContent = text;
        }
    }

    setClasses(classes?: string[]) {
        if (typeof classes !== 'undefined') {
            classes.forEach((className) => {
                this.container.classList.add(className);
            });
        }
    }

    setCallback(callbackParam?: CallBackParam) {
        isNull(callbackParam);
        if (typeof callbackParam !== 'undefined') {
            if (typeof callbackParam.eventName !== 'undefined' && typeof callbackParam.callback === 'function') {
                this.container.addEventListener(callbackParam.eventName, (event?: Event) => {
                    if (typeof callbackParam.callback !== 'undefined') {
                        callbackParam.callback(event);
                    }
                });
            }
        }
    }

    setChildren(...children: HTMLElement[]) {
        children.forEach((child: HTMLElement) => {
            this.container.append(child);
        });
    }
}
