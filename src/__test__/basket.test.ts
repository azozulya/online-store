//import jest from '@jest/globals';
//import { Basket } from '../components/basket';

import Basket from '../components/basket';
import Favorite from '../components/favorite';
import Product from '../components/products';

describe('Basket', () => {
    let component: Basket;
    beforeAll(() => {
        component = new Basket();
    });
    test('should create', () => {
        expect(component).toBeTruthy();
    });
    test('should add product', () => {
        const testProduct = new Product(
            {
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
            },
            (null as unknown) as Basket,
            (null as unknown) as Favorite
        );
        component.add(testProduct);
        expect(component.total).toEqual(1);
        expect(component.isProductInBasket(testProduct.id)).toEqual(true);
    });
});
