export const ALL_CATEGORY_NAME = 'all';

class FilterByCategory {
    private categories: HTMLOptionElement[];
    private select: HTMLSelectElement;
    private eventName = 'categoryChange';
    private currentCategoryName: string;

    constructor(currentCategory: string, categories: string[]) {
        this.categories = this.getList([ALL_CATEGORY_NAME, ...categories]);
        this.select = document.createElement('select');
        this.currentCategoryName = currentCategory || this.categories[0].label;
    }

    private getList(categories: string[]) {
        return categories.map((item) => {
            const option = document.createElement('option');
            option.innerText = item;
            return option;
        });
    }

    private clickHandler = () => {
        this.currentCategoryName = this.select.selectedOptions[0].label;

        const ev = new Event(this.eventName, { bubbles: true });
        this.select.dispatchEvent(ev);
    };

    getEventName(): string {
        return this.eventName;
    }

    getCurrentCategory() {
        return this.currentCategoryName;
    }

    draw() {
        this.select.append(...this.categories);
        this.select.selectedIndex = this.categories.findIndex((item) => item.innerText === this.currentCategoryName);
        this.select.addEventListener('change', this.clickHandler);

        return this.select;
    }

    reset() {
        this.currentCategoryName = ALL_CATEGORY_NAME;
        this.select.selectedIndex = 0;
    }
}

export default FilterByCategory;
