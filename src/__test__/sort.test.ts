import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Basket from '../components/basket';
import Favorite from '../components/favorite';
import Product from '../components/products';
import Sort from '../components/sort';

describe('Sort', () => {
    let component: Sort;

    const testProducts = [
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
        {
            id: 2,
            title: 'iPhone X',
            description:
                'SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ...',
            price: 899,
            discountPercentage: 17.94,
            rating: 4.44,
            stock: 34,
            brand: 'Apple',
            category: 'smartphones',
            thumbnail: 'https://dummyjson.com/image/i/products/2/thumbnail.jpg',
        },
        {
            id: 3,
            title: 'Samsung Universe 9',
            description: "Samsung's new variant which goes beyond Galaxy to the Universe",
            price: 1249,
            discountPercentage: 15.46,
            rating: 3.09,
            stock: 36,
            brand: 'Samsung',
            category: 'smartphones',
            thumbnail: 'https://dummyjson.com/image/i/products/3/thumbnail.jpg',
        },
        {
            id: 4,
            title: 'OPPOF19',
            description: 'OPPO F19 is officially announced on April 2021.',
            price: 280,
            discountPercentage: 17.91,
            rating: 1.3,
            stock: 0,
            brand: 'OPPO',
            category: 'smartphones',
            thumbnail: 'https://dummyjson.com/image/i/products/4/thumbnail.jpg',
        },
    ].map((product) => new Product(product, (null as unknown) as Basket, (null as unknown) as Favorite));

    const testProductSortedPriceUp = testProducts.sort((a, b) => a.price - b.price);

    beforeAll(() => {
        component = new Sort();
    });

    test('should create', () => {
        expect(component).toBeTruthy();
    });

    test('should sort products on price_up option', async () => {
        document.body.append(component.draw());

        await userEvent.selectOptions(screen.getByTestId('sort'), ['price_up']);

        expect(component.getCurrentSort()).toEqual('price_up');
        expect(component.getSortedProducts(testProducts)).toEqual(testProductSortedPriceUp);
    });
});
