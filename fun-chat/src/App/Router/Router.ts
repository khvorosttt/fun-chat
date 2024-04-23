export interface PageInfo {
    pagePath: string;
    callback: () => void;
}

export enum PagePath {
    LOGIN = 'login',
    CHAT = 'chat',
    ABOUT = 'about',
}

export class Router {
    pages: PageInfo[];

    constructor(pages: PageInfo[]) {
        this.pages = pages;
    }

    navigate(path: string) {
        const userInfo: string | null = sessionStorage.getItem('user');
        if (userInfo) {
            const pageInfo: PageInfo | undefined = this.pages.find((item) => item.pagePath === path);
            if (pageInfo) {
                pageInfo.callback();
                return;
            }
            this.pages.find((item) => item.pagePath === 'chat')?.callback();
            return;
        }
        if (path === 'about') {
            this.pages.find((item) => item.pagePath === path)?.callback();
        } else {
            this.pages.find((item) => item.pagePath === 'login')?.callback();
        }
    }
}
