import Product from './products';
import { ISortItem } from './types';

const sortItems = [
    {
        title: '',
        value: 'default',
    },
    {
        title: 'Lowest Price',
        value: 'price_up',
        sortFunc: (a: Product, b: Product) => a.price - b.price,
    },
    {
        title: 'Highest Price',
        value: 'price_down',
        sortFunc: (a: Product, b: Product) => b.price - a.price,
    },
    {
        title: 'A - Z',
        value: 'az',
        sortFunc: (a: Product, b: Product) => Sort.collator.compare(a.title, b.title),
    },
    {
        title: 'Z - A',
        value: 'za',
        sortFunc: (a: Product, b: Product) => Sort.collator.compare(b.title, a.title),
    },
];

class Sort {
    private sortItems: ISortItem[] = [];
    private select: HTMLSelectElement;
    private sortContainer: HTMLElement;
    private currentSort: string;
    private eventName = 'changeSort';
    static collator = new Intl.Collator('en');

    constructor() {
        this.sortContainer = document.createElement('div');
        this.sortContainer.classList.add('sort');

        this.select = document.createElement('select');
        this.select.classList.add('sort__select');
        this.select.dataset.testid = 'sort';

        this.currentSort = localStorage.getItem('sort') || this.select.value;
    }

    changeHandler = () => {
        this.currentSort = this.select.value;
        this.select.dispatchEvent(new Event(this.eventName, { bubbles: true }));
        localStorage.setItem('sort', this.currentSort);
    };

    getCurrentSort() {
        return this.select.value;
    }

    getEventName() {
        return this.eventName;
    }

    getSortedProducts(items: Product[]): Product[] {
        const func = sortItems.find((item) => item.value === this.currentSort)?.sortFunc;
        if (!func) return items;
        return items.sort(func);
    }

    draw() {
        this.select.addEventListener('change', this.changeHandler);

        sortItems.forEach(({ title, value }) => {
            const option = document.createElement('option');
            option.setAttribute('value', value);
            option.innerText = title;

            if (value === this.currentSort) option.selected = true;

            this.sortItems.push(option);
            this.select.append(option);
        });
        this.sortContainer.append(this.select);

        return this.sortContainer;
    }
}

export default Sort;
