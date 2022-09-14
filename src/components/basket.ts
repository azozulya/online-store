import Product from './products';

class Basket {
    private basket: Map<number, Product>;
    private basketTotalContainer: HTMLSpanElement | null;
    total = 0;

    constructor() {
        const basket = localStorage.getItem('basket');
        this.basket = basket ? new Map(JSON.parse(basket)) : new Map();
        this.total = this.basket.size;

        this.basketTotalContainer = document.querySelector<HTMLSpanElement>('.basket__total');

        if (this.total > 0 && this.basketTotalContainer) {
            this.basketTotalContainer.innerText = this.total.toString();
        }
    }

    add(item: Product) {
        this.basket.set(item.id, item);
        this.total += 1;
        this.update();
    }

    remove(id: number) {
        this.basket.delete(id);
        this.total -= 1;
        this.update();
    }

    isProductInBasket(id: number) {
        return this.basket.has(id);
    }

    private update() {
        localStorage.setItem('basket', JSON.stringify(Array.from(this.basket.entries())));
        if (!this.basketTotalContainer) return;
        this.basketTotalContainer.innerText = this.total.toString();
    }
}

export default Basket;
