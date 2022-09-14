import Basket from './basket';
import Favorite from './favorite';
import { IProduct } from './types';

class Product implements IProduct {
    title: string;
    price: number;
    description: string;
    category: string;
    thumbnail: string;
    stock: number;
    rating: number;
    brand: string;
    id: number;
    isFavorite = false;
    inBasket = false;
    private basket: Basket | undefined;
    private favorite: Favorite;
    private btn: HTMLButtonElement;
    private favoriteBtn: HTMLButtonElement;

    constructor(
        { id, title, price, description, category, thumbnail, stock, rating, brand }: IProduct,
        basket: Basket,
        favorite: Favorite
    ) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.category = category;
        this.thumbnail = thumbnail;
        this.stock = stock;
        this.rating = rating;
        this.brand = brand;
        this.basket = basket;
        this.favorite = favorite;
        this.btn = document.createElement('button');
        this.favoriteBtn = document.createElement('button');
    }

    draw(): HTMLDivElement {
        const div = document.createElement('div');
        div.classList.add('product');
        div.dataset.id = this.id.toString();
        div.innerHTML = `
          <div class="product__img" style="background-image: url(${this.thumbnail})"></div>
          <div class="product__content">
            <h2 class="product__title">${this.title}</h2>
            <div class="product__desc">${this.description}</div>
            <div class="product__rating">
              <span class="rating"><span class="rating--active" style="width:${this.rating * 20}%"></span></span>
              ${this.rating}
            </div>
            <div class="product__info"><b>Brand</b>: ${this.brand}</div>
            <div class="product__info"><b>Category</b>: ${this.category}</div>
            <div class="product__info"> ${this.stock > 0 ? '<b>Stock</b>: ' + this.stock : '<b>Not available</b>'}</div>
          </div>
          <div class="product__price">€ ${this.price}</div>
        `;

        this.btn.classList.add('btn', 'btn-sm', 'product__add-btn');

        if (this.basket?.isProductInBasket(this.id)) {
            this.inBasket = true;
            this.btn.classList.add('btn-primary');
        } else {
            this.inBasket = false;
            this.btn.classList.add('btn-dark');
        }

        this.btn.dataset.id = this.id.toString();
        this.btn.innerText = 'Add to basket';
        this.btn.addEventListener('click', this.clickHandler);
        div.append(this.btn);

        this.favoriteBtn.classList.add('product__favorite');
        this.favoriteBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="product__favorite--icon" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
            </svg>  
        `;
        if (this.favorite.isProductFavorite(this.id)) {
            this.isFavorite = true;
            this.favoriteBtn.classList.add('product__favorite--active');
        } else {
            this.isFavorite = false;
        }

        this.favoriteBtn.addEventListener('click', this.addFavoriteHandler);

        div.insertAdjacentElement('afterbegin', this.favoriteBtn);

        return div;
    }

    private addFavoriteHandler = () => {
        this.isFavorite ? this.favorite.remove(this.id) : this.favorite.add(this);
        this.isFavorite = !this.isFavorite;
        this.favoriteBtn.classList.toggle('product__favorite--active');
    };

    private basketAlert(): HTMLDivElement {
        const div = document.createElement('div');
        div.classList.add('alert', 'alert-danger', 'product__alert');
        div.setAttribute('role', 'alert');
        div.innerText = 'Извините, все слоты заполнены';
        setTimeout(() => {
            div.remove();
        }, 2000);
        return div;
    }

    clickHandler = () => {
        if (this.basket && this.basket.total >= 20 && !this.inBasket) {
            this.btn.insertAdjacentElement('beforebegin', this.basketAlert());
            return;
        }

        if (this.inBasket) {
            this.inBasket = false;
            this.btn.classList.replace('btn-primary', 'btn-dark');
            this.btn.innerText = 'Add to basket';
            this.basket?.remove(this.id);
        } else {
            this.inBasket = true;
            this.btn.classList.replace('btn-dark', 'btn-primary');
            this.btn.innerText = 'In the basket';
            this.basket?.add(this);
        }
    };
}

export default Product;
