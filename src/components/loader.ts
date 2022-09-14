class Loader {
    private loader: HTMLDivElement;
    private container: HTMLElement;
    private isAdd = false;

    constructor(container: HTMLElement) {
        this.loader = document.createElement('div');
        this.loader.classList.add('spinner', 'd-none');
        this.loader.innerHTML = `
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>`;
        this.container = container;
    }

    show(): void {
        if (!this.isAdd) this.container.insertAdjacentElement('beforebegin', this.loader);
        this.loader.classList.remove('d-none');
    }
    hide(): void {
        this.loader.classList.add('d-none');
    }
}

export default Loader;
