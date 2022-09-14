import { IProduct } from '../components/types';
import MainPage from '../pages/main';

const expected: { products: IProduct[] } = {
    products: [
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
    ],
};

describe('Fetch', () => {
    let page: MainPage;

    beforeAll(() => {
        page = new MainPage('main');

        const mockFetchPromise = () => {
            const fetchResponse = {
                ok: true,
                json: () => Promise.resolve(expected),
            } as Response;
            return Promise.resolve(fetchResponse);
        };

        global.fetch = jest.fn().mockImplementation(mockFetchPromise);
    });

    test('should load products', async () => {
        const json = await page.getData();

        expect(json).toBeDefined();
        expect(json.length).toEqual(2);
    });
});
