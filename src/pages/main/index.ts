// https://dummyjson.com/
import Product from '../../components/products';
import { IBrand, IProduct } from '../../components/types';
import Filter from '../../components/filter/filter';
import Sort from '../../components/sort';
import Loader from '../../components/loader';
import './style.scss';
import Basket from '../../components/basket';
import Favorite from '../../components/favorite';
import { ALL_CATEGORY_NAME } from '../../components/filter/categories';

class MainPage {
    private container: HTMLElement;
    private initProducts: Product[] = [];
    private products: Product[] = [];
    private productsHTMLContainer: HTMLElement;
    private filter: Filter;
    private sort: Sort;
    private loader: Loader;
    private searchInput: HTMLInputElement | undefined;
    private basket: Basket;
    private favorite: Favorite;
    private static messageContainer: HTMLHeadElement;

    constructor(className: string) {
        this.container = document.createElement('div');
        this.container.classList.add(className);

        this.productsHTMLContainer = document.createElement('div');
        this.productsHTMLContainer.classList.add('products-list');
        this.productsHTMLContainer.dataset.testid = 'products-list';

        this.filter = new Filter();
        this.sort = new Sort();
        this.basket = new Basket();
        this.favorite = new Favorite();

        this.loader = new Loader(this.productsHTMLContainer);

        MainPage.messageContainer = document.createElement('h3');

        this.searchInput = <HTMLInputElement>document.getElementById('search');
        this.searchInput?.addEventListener('input', this.searchHandler());
    }

    private errorHandler(res: Response) {
        if (!res.ok) {
            throw Error(res.statusText);
        }
        return res;
    }

    getData(): Promise<Product[]> {
        return fetch('./db/products.json')
            .then(this.errorHandler)
            .then<{ products: IProduct[] }, never>((res) => res.json())
            .then((data) => {
                this.initProducts = data.products.map((item: IProduct) => {
                    return new Product(item, this.basket, this.favorite);
                });
                return this.initProducts;
            })
            .catch((err) => {
                const empty: Product[] = [];
                console.error(err);

                return empty;
            });
    }

    private setParams() {
        const categories: Set<string> = new Set();
        const brands: IBrand = {};

        this.products.forEach((item) => {
            if (brands[item.brand]) {
                brands[item.brand] += 1;
            } else {
                brands[item.brand] = 1;
            }

            if (!categories.has(item.category)) {
                categories.add(item.category);
            }
        });

        this.filter.drawBrandsFilter(brands);
        this.filter.drawCategories(Array.from(categories));

        const sortedItems = [...this.initProducts].sort((a: Product, b: Product) => a.price - b.price);

        if (sortedItems.length)
            this.filter.setPriceRange(
                {
                    min: sortedItems[0].price,
                    max: sortedItems[sortedItems.length - 1].price,
                },
                true
            );
    }

    private addContent(items: Product[]) {
        MainPage.addMessage(`${items.length} items`);

        const productsHTML = items.map((item) => item.draw());

        this.productsHTMLContainer.innerText = '';
        this.productsHTMLContainer.append(...productsHTML);
        this.loader.hide();
    }

    private searchHandler() {
        return () => {
            const str = this.searchInput?.value;

            if (!str) {
                MainPage.addMessage(`Find ${this.products.length} items`);
                this.addContent(this.products);
                return;
            }

            if (str.length > 0) {
                this.loader.show();

                const searchResult = [...this.products].filter((item) => {
                    return item.title.toLowerCase().includes(str.toLowerCase());
                });

                const total = searchResult.length;

                if (!total) {
                    MainPage.addMessage('Sorry, no matches found');
                    this.productsHTMLContainer.innerText = '';
                    this.loader.hide();
                    return;
                }

                MainPage.addMessage(`Find ${total} items`);

                this.addContent(searchResult);
            }
        };
    }

    private filterHandler() {
        return () => {
            const { category, brand, rating, price, inStock } = this.filter.getState();

            this.loader.show();

            this.products = [...this.initProducts].filter((item) => {
                return (
                    (category === ALL_CATEGORY_NAME || item.category === category) &&
                    (brand.length === 0 || brand.includes(item.brand)) &&
                    (rating === 0 || item.rating >= rating) &&
                    item.price >= price.min &&
                    item.price <= price.max &&
                    ((inStock && item.stock > 0) || !inStock)
                );
            });

            const total = this.products.length;

            if (!total) {
                MainPage.addMessage('Sorry, no matches found');
                this.productsHTMLContainer.innerText = '';
                this.loader.hide();
                return;
            }

            MainPage.addMessage(`Find ${total} items`);
            this.sortHandler();
        };
    }

    private sortHandler = () => {
        const sortedProducts = this.sort.getSortedProducts(this.products);
        this.addContent(sortedProducts);
    };

    static addMessage = (message: string) => {
        MainPage.messageContainer.innerText = message;
    };

    render() {
        this.loader.show();

        const sortContainer = document.createElement('div');
        sortContainer.classList.add('sort__wrapper');
        sortContainer.append(MainPage.messageContainer, this.sort.draw());

        this.container.append(this.filter.draw(), sortContainer, this.productsHTMLContainer);

        this.getData().then((products) => {
            this.products = [...products];
            this.addContent(products);
            this.setParams();
        });

        this.container.addEventListener(this.filter.getEventName(), this.filterHandler());
        this.container.addEventListener(this.sort.getEventName(), this.sortHandler);

        return this.container;
    }
}

export default MainPage;
