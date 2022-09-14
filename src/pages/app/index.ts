import MainPage from '../main';

class App {
    private container: HTMLElement | null;
    private firstPage: MainPage;

    constructor() {
        this.container = document.getElementById('page');
        this.firstPage = new MainPage('main');
    }

    run() {
        const firstPageHTML = this.firstPage.render();
        this.container?.append(firstPageHTML);
    }
}

export default App;
