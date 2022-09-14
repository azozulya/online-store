import Product from './products';

class Favorite {
    private favoriteList: Map<number, Product>;
    private favoriteTotalContainer: HTMLSpanElement | null;
    total = 0;

    constructor() {
        const favoriteList = localStorage.getItem('favorite');
        this.favoriteList = favoriteList ? new Map(JSON.parse(favoriteList)) : new Map();
        this.total = this.favoriteList.size;

        this.favoriteTotalContainer = document.querySelector<HTMLSpanElement>('.favorite__total');

        if (this.total > 0 && this.favoriteTotalContainer) {
            this.favoriteTotalContainer.innerText = this.total.toString();
        }
    }

    add(item: Product) {
        this.favoriteList.set(item.id, item);
        this.total += 1;
        this.update();
    }

    remove(id: number) {
        this.favoriteList.delete(id);
        this.total -= 1;
        this.update();
    }

    isProductFavorite(id: number) {
        return this.favoriteList.has(id);
    }

    private update() {
        localStorage.setItem('favorite', JSON.stringify(Array.from(this.favoriteList.entries())));
        if (this.favoriteTotalContainer) this.favoriteTotalContainer.innerText = this.total.toString();
    }
}

export default Favorite;
