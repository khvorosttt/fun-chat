import Component from '../../utils/base-component';
import View from '../View';
// import './footer.css';

export default class FooterView extends View {
    constructor() {
        super(['footer']);
        this.initFooter();
    }

    initFooter() {
        const footerWrapper: HTMLDivElement = new Component('div', '', '', [
            'footer_info',
        ]).getContainer<HTMLDivElement>();
        const authorGit: HTMLAnchorElement = new Component('a', '', 'khvorosttt', [
            'author-git',
        ]).getContainer<HTMLAnchorElement>();
        const logoGit: HTMLDivElement = new Component('div', '', '', ['git_logo']).getContainer<HTMLDivElement>();
        authorGit.target = '_blank';
        authorGit.href = 'https://github.com/khvorosttt';
        authorGit.append(logoGit);
        const copyright: HTMLDivElement = new Component('div', '', 'Copyright Fun Chat, 2024', [
            'copyright',
        ]).getContainer<HTMLDivElement>();
        const rssAnchor: HTMLAnchorElement = new Component('a', '', '', ['rss-logo']).getContainer<HTMLAnchorElement>();
        rssAnchor.target = '_blank';
        rssAnchor.href = 'https://rs.school/js/';
        const rssLogo: HTMLDivElement = new Component('div', '', '', ['rss_logo']).getContainer<HTMLDivElement>();
        rssAnchor.append(rssLogo);
        footerWrapper.append(authorGit, copyright, rssAnchor);
        this.container?.append(footerWrapper);
    }
}
