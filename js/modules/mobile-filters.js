/**
 * Модуль для управления фильтрами на мобильных устройствах
 */

export function initMobileFilters() {
	const filtersContainer = document.querySelector('.catalog-filters');
	if (!filtersContainer) return;

	const isMobile = window.innerWidth < 768;

	if (isMobile) {
		const filtersToggle = document.createElement('button');
		filtersToggle.className = 'filters-toggle';
		filtersToggle.innerHTML = 'Фильтры <span class="filters-toggle__icon"></span>';

		const catalogSection = document.querySelector('.catalog');
		if (!catalogSection) return;

		const catalogTitle = document.querySelector('.catalog-title');

		if (catalogTitle) {
			catalogTitle.parentNode.insertBefore(filtersToggle, catalogTitle);
		}

		filtersContainer.classList.add('filters-collapsed');

		filtersToggle.addEventListener('click', () => {
			filtersContainer.classList.toggle('filters-collapsed');
			filtersToggle.classList.toggle('filters-toggle--active');
		});
		
		// Предотвращаем закрытие фильтров при клике на поля ввода
		const inputField = document.querySelector('.catalog-filter__input');
		if (inputField) {
			inputField.addEventListener('click', (e) => {
				e.stopPropagation();
				filtersContainer.classList.remove('filters-collapsed');
				filtersToggle.classList.add('filters-toggle--active');
			});
		}

		window.addEventListener('resize', () => {
			if (window.innerWidth >= 768) {
				filtersContainer.classList.remove('filters-collapsed');
			} else {
				filtersContainer.classList.add('filters-collapsed');
			}
		});
	}
} 