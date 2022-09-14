import Basket from '../components/basket';
import Favorite from '../components/favorite';
import Product from '../components/products';

const testProduct = {
    id: 1,
    title: 'iPhone 9',
    description: 'An apple mobile which is nothing like apple',
    price: 549,
    discountPercentage: 12.96,
    rating: 4.69,
    stock: 94,
    brand: 'Apple',
    category: 'smartphones',
    thumbnail: 'https://dummyjson.com/image/i/products/1/thumbnail.jpg',
};

describe('Product', () => {
    let product: Product;
    let basket: Basket;

    beforeAll(() => {
        basket = new Basket();
        product = new Product(testProduct, basket, (null as unknown) as Favorite);
    });

    test('should create', () => {
        expect(product).toBeTruthy();
    });

    test("shouldn't be in basket", async () => {
        expect(product.inBasket).toBe(false);
    });

    test('should call basket.add', () => {
        const spy = jest.spyOn(basket, 'add');
        product.clickHandler();
        expect(spy).toHaveBeenCalled();
    });

    test('should be in basket', () => {
        expect(product.inBasket).toBe(true);
        expect(basket.total).toEqual(1);
    });

    test('second click should be removed product from basket', () => {
        product.clickHandler();
        expect(product.inBasket).toBe(false);
        expect(basket.total).toEqual(0);
    });
});
