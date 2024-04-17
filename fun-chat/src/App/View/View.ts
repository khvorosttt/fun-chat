import Component from '../utils/base-component';

export default abstract class View {
    protected container: HTMLDivElement | null;

    constructor(classes?: string[]) {
        this.container = null;
        this.createContainer();
        this.setClasses(classes);
    }

    createContainer() {
        this.container = new Component('div', '').getContainer<HTMLDivElement>();
    }

    getContainer() {
        return this.container;
    }

    setClasses(classes?: string[]) {
        if (typeof classes !== 'undefined') {
            classes.forEach((className) => {
                this.container?.classList.add(className);
            });
        }
    }
}
