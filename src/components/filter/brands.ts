import { IBrand } from '../types';

class FilterByBrands {
    private container: HTMLDivElement;
    private brands: HTMLInputElement[];

    constructor(brands: IBrand, activeBrands: string[] = []) {
        this.container = document.createElement('div');
        this.brands = this.init(brands, activeBrands);
    }

    private init(brands: IBrand, activeBrands: string[] = []) {
        const brandsArray: HTMLInputElement[] = [];

        Object.entries(brands).forEach(([name, total]: [string, number]) => {
            const brandContainer = document.createElement('div');
            brandContainer.classList.add('form-check');

            const brandName = document.createElement('label');
            brandName.classList.add('form-check-label');

            const brandCheckbox = document.createElement('input');
            brandCheckbox.classList.add('form-check-input');
            brandCheckbox.setAttribute('name', 'brand');
            brandCheckbox.setAttribute('type', 'checkbox');
            brandCheckbox.setAttribute('value', name);

            if (activeBrands.includes(name)) {
                brandCheckbox.checked = true;
            }

            brandsArray.push(brandCheckbox);
            brandName.append(brandCheckbox);
            brandName.insertAdjacentHTML('beforeend', `${name} (${total})`);

            brandContainer.append(brandName);
            this.container.append(brandContainer);
        });
        return brandsArray;
    }

    getActiveBrands(): string[] {
        return this.brands.filter((item) => item.checked).map((item) => item.value);
    }

    draw() {
        this.container.classList.add('brand-filter');

        return this.container;
    }

    reset() {
        this.brands.forEach((item) => (item.checked = false));
    }
}

export default FilterByBrands;
