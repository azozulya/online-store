import * as noUiSlider from 'nouislider';
import '../../node_modules/nouislider/dist/nouislider.css';

class SliderRange {
    private title: string;
    private slider: noUiSlider.target;
    private eventName = 'rangeChange';
    private isInit = false;

    constructor(id: string, title: string, { min, max }: { min: number; max: number }) {
        this.title = title;

        this.slider = <noUiSlider.target>document.createElement('div');
        this.slider.classList.add('slider');

        noUiSlider.create(this.slider, {
            start: [min, max],
            connect: true,
            step: 1,
            range: {
                min,
                max,
            },
        });
    }

    draw() {
        const container = this.createElement('div', 'filter__price');
        container.innerHTML = `<h4>${this.title}</h4>`;

        const min = this.createElement('span', 'slider__min');
        const max = this.createElement('span', 'slider__max');

        const sliderInner = this.createElement('div', 'filter__price--inner');
        sliderInner.append(min, this.slider, max);
        container.append(sliderInner);

        if (this.slider)
            this.slider.noUiSlider?.on('update', (values, handle) => {
                const [minVal, maxVal] = values;

                if (handle) max.innerHTML = parseInt(maxVal.toString()).toString() + '€';
                else min.innerHTML = parseInt(minVal.toString()).toString() + '€';

                if (!this.isInit) {
                    container.dispatchEvent(
                        new Event(this.eventName, {
                            bubbles: true,
                        })
                    );
                } else {
                    this.isInit = false;
                }
            });
        return container;
    }

    getRange() {
        return this.slider.noUiSlider?.get() as number[];
    }

    getEventName() {
        return this.eventName;
    }

    setRange({ min, max }: { min: number; max: number }, isInit = false): void {
        this.isInit = isInit;

        this.slider.noUiSlider?.updateOptions(
            {
                range: {
                    min,
                    max,
                },
            },
            true
        );
    }

    reset = () => {
        const options = this.slider.noUiSlider?.options;

        options &&
            options.range &&
            this.slider.noUiSlider?.set([
                parseInt(options.range.min.toString()),
                parseInt(options.range.max.toString()),
            ]);
    };

    private createElement(type: string, classes: string): HTMLElement {
        const el = document.createElement(type);
        el.classList.add(classes);

        return el;
    }
}

export default SliderRange;
