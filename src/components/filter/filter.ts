import SliderRange from '../sliderRange';
import { IBrand, IFilter } from '../types';
import FilterByBrands from './brands';
import FilterByCategory, { ALL_CATEGORY_NAME } from './categories';

class Filter {
    private container: HTMLElement;
    private categoriesFilter: FilterByCategory | undefined;
    private categoriesContainer: HTMLDivElement;
    private brandsFilter: FilterByBrands | undefined;
    private brandContainer: HTMLDivElement;
    private priceSliderRange: SliderRange;
    private eventName = 'filterChange';
    private state: IFilter;
    private initState = {
        category: ALL_CATEGORY_NAME,
        brand: [],
        rating: 0,
        price: {
            min: 0,
            max: 2000,
        },
        inStock: false,
    };

    constructor() {
        this.container = document.createElement('div');
        this.container.classList.add('filter');

        const saveState = localStorage.getItem('state');
        this.state = saveState
            ? JSON.parse(saveState, function (k, v) {
                  if (['min', 'max'].includes(k)) {
                      return parseFloat(v);
                  }
                  return v;
              })
            : { ...this.initState };

        this.state = saveState
            ? JSON.parse(saveState, function (k, v) {
                  if (['min', 'max'].includes(k)) {
                      return parseFloat(v);
                  }
                  return v;
              })
            : { ...this.initState };

        const { min, max } = this.state.price;
        this.priceSliderRange = new SliderRange('price-range', 'Price', {
            min,
            max,
        });

        this.brandContainer = document.createElement('div');
        this.categoriesContainer = document.createElement('div');
    }

    private dispatchEvent = new Event(this.eventName, { bubbles: true });

    private serializeState() {
        localStorage.setItem('state', JSON.stringify(this.state));
    }

    setPriceRange(price: { min: number; max: number }, isInit = false) {
        if (!localStorage.getItem('state')) {
            this.state.price = price;
        }
        this.priceSliderRange.setRange(price, isInit);
    }

    getEventName(): string {
        return this.eventName;
    }

    getState() {
        return this.state;
    }

    private filterByCategoryHandler = () => {
        this.state.category = this.categoriesFilter?.getCurrentCategory() || this.initState.category;
        this.container.dispatchEvent(this.dispatchEvent);
        this.serializeState();
    };

    private priceChangeHandler = () => {
        const [min, max] = this.priceSliderRange.getRange();

        this.state.price = { min, max };
        this.container.dispatchEvent(this.dispatchEvent);
        this.serializeState();
    };

    drawCategories(categories: string[]) {
        this.categoriesFilter = new FilterByCategory(this.state.category, categories);

        this.categoriesContainer.classList.add('categories');
        this.categoriesContainer.insertAdjacentHTML('afterbegin', '<h4>Category</h4>');
        this.categoriesContainer.append(this.categoriesFilter.draw());

        this.container.addEventListener(this.categoriesFilter.getEventName(), this.filterByCategoryHandler);
    }

    drawBrandsFilter(brands: IBrand) {
        this.brandsFilter = new FilterByBrands(brands, this.state.brand);
        const brandsHTML = this.brandsFilter.draw();

        brandsHTML.addEventListener('change', () => {
            this.state.brand = this.brandsFilter?.getActiveBrands() || [];
            this.container.dispatchEvent(this.dispatchEvent);
            this.serializeState();
        });

        this.brandContainer.append(brandsHTML);
    }

    draw() {
        this.brandContainer.classList.add('filter__brand');
        this.brandContainer.innerHTML = '<h4>Brand</h4>';

        this.container.append(
            this.categoriesContainer,
            this.drawAvailabilityFilter(),
            this.drawRatingFilter(),
            this.brandContainer,
            this.priceSliderRange.draw(),
            this.drawResetButtons()
        );

        this.container.addEventListener(this.priceSliderRange.getEventName(), this.priceChangeHandler);

        return this.container;
    }

    private createBtn(title: string, classes = '') {
        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-secondary', 'btn-sm', classes);
        btn.innerText = title;
        return btn;
    }

    private drawResetButtons = () => {
        const btnResetFilter = this.createBtn('Clear filters', 'btn__clear-filter');
        const btnReset = this.createBtn('Reset localStorage', 'btn__reset');

        btnResetFilter.addEventListener('click', this.resetFilterHandler);
        btnReset.addEventListener('click', this.resetLocalStorageHandler);

        const div = document.createElement('div');
        div.classList.add('filter__btns');
        div.append(btnResetFilter, btnReset);

        return div;
    };

    private resetFilterHandler = () => {
        this.state = { ...this.initState };
        this.container.dispatchEvent(this.dispatchEvent);

        this.categoriesFilter?.reset();
        this.brandsFilter?.reset();
        this.priceSliderRange.reset();

        document.querySelector('.rating-filter__item--active')?.classList.remove('rating-filter__item--active');

        const inp = document.querySelector<HTMLInputElement>('#flexSwitchCheckDefault');

        if (inp) inp.checked = false;
    };

    private resetLocalStorageHandler = () => {
        localStorage.clear();
    };

    private drawAvailabilityFilter = () => {
        const container = document.createElement('div');
        container.classList.add('filter__availability');
        container.innerHTML = '<h4>Availability</h4>';

        const inp = document.createElement('input');
        inp.classList.add('form-check-input');
        inp.type = 'checkbox';
        inp.setAttribute('role', 'switch');
        inp.id = 'flexSwitchCheckDefault';
        inp.checked = this.state.inStock;

        inp.addEventListener('click', () => {
            this.state.inStock = !this.state.inStock;
            container.dispatchEvent(this.dispatchEvent);
            this.serializeState();
        });

        const div = document.createElement('div');
        div.classList.add('form-check', 'form-switch');

        div.append(inp);
        div.insertAdjacentHTML(
            'beforeend',
            '<label class="form-check-label" for="flexSwitchCheckDefault">In stock</label>'
        );

        container.append(div);

        return container;
    };

    private drawRatingFilter = () => {
        const initRating = this.state.rating;

        const div = document.createElement('div');
        div.classList.add('filter__rating');
        div.innerHTML = `
            <h4>Customer Review</h4>
            <ul class="rating-filter">
                <li class="rating-filter__item ${initRating === 4 ? 'rating-filter__item--active' : ''}" data-star="4">
                    <span class="rating">
                        <span class="rating--active" style="width:80%"></span>
                    </span> & Up
                </li>
                 <li class="rating-filter__item ${initRating === 3 ? 'rating-filter__item--active' : ''}" data-star="3">
                    <span class="rating">
                        <span class="rating--active" style="width:60%"></span>
                    </span> & Up
                </li>
                 <li class="rating-filter__item ${initRating === 2 ? 'rating-filter__item--active' : ''}" data-star="2">
                    <span class="rating">
                        <span class="rating--active" style="width:40%"></span>
                    </span> & Up
                </li>
                 <li class="rating-filter__item ${initRating === 1 ? 'rating-filter__item--active' : ''}" data-star="1">
                    <span class="rating">
                        <span class="rating--active" style="width:20%"></span>
                    </span> & Up
                </li>
            </ul>
        `;

        div.addEventListener('click', (e) => {
            const el = (e.target as HTMLElement).closest('.rating-filter__item');

            if (!el) return;

            const stars = el.getAttribute('data-star') || '0';
            this.state.rating = parseInt(stars);

            el.parentNode
                ?.querySelector('.rating-filter__item--active')
                ?.classList.remove('rating-filter__item--active');
            el.classList.add('rating-filter__item--active');
            this.container.dispatchEvent(this.dispatchEvent);
            this.serializeState();
        });
        return div;
    };
}

export default Filter;
