/**
 * Файл для страницы каталога курсов
 */
import { loadXmlData, setupContactForm } from '../modules/common.js';
import { createCourseCardFromXML } from '../modules/courses.js';
import { initMobileMenu } from '../modules/mobile-menu.js';
import { initMobileFilters } from '../modules/mobile-filters.js';

let allCourses = [];
let filteredCourses = [];
let visibleCoursesCount = 0;

document.addEventListener('DOMContentLoaded', function() {
	initMobileMenu();
	initMobileFilters();
	setupContactForm(document.querySelector('.footer__contact-form'));

	if (document.querySelector('.courses-grid')) {
		loadXmlData('courses_list.xml')
			.then(xmlDoc => {
				allCourses = Array.from(xmlDoc.getElementsByTagName('course'));
				filteredCourses = [...allCourses];

				renderCourses();

				initSearchFilter();
				initCategoryFilters();
				initDifficultyFilter();
				initDurationFilter();
			})
			.catch(error => {
				console.error('Ошибка загрузки файла курсов:', error);
			});
	}
});

/**
 * Инициализирует фильтр поиска по тексту
 */
function initSearchFilter() {
	const searchInput = document.querySelector('.catalog-filter__input');
	if (!searchInput) return;

	searchInput.addEventListener('input', function() {
		const searchText = this.value.toLowerCase().trim();
		applyFilters();
	});
}

/**
 * Инициализирует фильтры по категориям
 */
function initCategoryFilters() {
	const categoryButtons = document.querySelectorAll('.tag-button');
	if (categoryButtons.length === 0) return;

	categoryButtons.forEach(button => {
		button.addEventListener('click', function(e) {
			e.preventDefault();

			categoryButtons.forEach(btn => {
				btn.classList.remove('tag-button--active');
			});

			this.classList.add('tag-button--active');

			applyFilters();
		});
	});
}

/**
 * Инициализирует фильтр по уровню сложности
 */
function initDifficultyFilter() {
	const difficultyOptions = document.querySelectorAll('input[name="difficulty"]');
	if (difficultyOptions.length === 0) return;

	difficultyOptions.forEach(option => {
		option.addEventListener('change', function() {
			applyFilters();
		});
	});
}

/**
 * Инициализирует фильтр по длительности
 */
function initDurationFilter() {
	const durationLabel = document.querySelector('.duration-filter__label');
	const durationTrack = document.querySelector('.range-slider__track');

	const rangeSlider = document.querySelector('.range-slider');
	if (!rangeSlider) return;

	const oldThumb = rangeSlider.querySelector('.range-slider__thumb');
	if (oldThumb) oldThumb.remove();

	const minThumb = document.createElement('div');
	minThumb.className = 'range-slider__thumb range-slider__thumb--min';

	const maxThumb = document.createElement('div');
	maxThumb.className = 'range-slider__thumb range-slider__thumb--max';

	rangeSlider.appendChild(minThumb);
	rangeSlider.appendChild(maxThumb);

	const minValue = 5;
	const maxValue = 10;
	let currentMinValue = minValue;
	let currentMaxValue = maxValue;

	minThumb.style.left = '0%';
	maxThumb.style.left = '100%';
	if (durationTrack) {
		durationTrack.style.left = '0%';
		durationTrack.style.width = '100%';
	}

	if (durationLabel) {
		durationLabel.textContent = `От ${minValue} до ${maxValue} месяцев`;
	}

	let activeThumb = null;

	function addThumbListeners(thumb) {
		thumb.addEventListener('mousedown', (e) => startDrag(e, thumb));
		thumb.addEventListener('touchstart', (e) => startDrag(e, thumb));
	}

	addThumbListeners(minThumb);
	addThumbListeners(maxThumb);

	function startDrag(e, thumb) {
		e.preventDefault();
		activeThumb = thumb;

		document.addEventListener('mousemove', updatePosition);
		document.addEventListener('touchmove', updatePosition);
		document.addEventListener('mouseup', stopDrag);
		document.addEventListener('touchend', stopDrag);
	}

	function updatePosition(e) {
		if (!activeThumb) return;

		let clientX;
		if (e.type.includes('touch')) {
			clientX = e.touches[0].clientX;
		} else {
			clientX = e.clientX;
		}

		const rect = rangeSlider.getBoundingClientRect();
		let position = (clientX - rect.left) / rect.width;
		position = Math.max(0, Math.min(1, position));

		if (activeThumb === minThumb) {
			const maxPosition = parseFloat(maxThumb.style.left) / 100;
			position = Math.min(position, maxPosition - 0.05);

			minThumb.style.left = `${position * 100}%`;
			currentMinValue = Math.max(minValue, Math.round(position * (maxValue - minValue)) + minValue);
		} else if (activeThumb === maxThumb) {
			const minPosition = parseFloat(minThumb.style.left) / 100;
			position = Math.max(position, minPosition + 0.05);

			maxThumb.style.left = `${position * 100}%`;
			currentMaxValue = Math.min(maxValue, Math.round(position * (maxValue - minValue)) + minValue);
		}

		if (durationTrack) {
			const minPos = parseFloat(minThumb.style.left);
			const maxPos = parseFloat(maxThumb.style.left);
			durationTrack.style.left = `${minPos}%`;
			durationTrack.style.width = `${maxPos - minPos}%`;
		}

		if (durationLabel) {
			durationLabel.textContent = `От ${currentMinValue} до ${currentMaxValue} месяцев`;
		}
	}

	function stopDrag() {
		if (activeThumb) {
			activeThumb = null;
			document.removeEventListener('mousemove', updatePosition);
			document.removeEventListener('touchmove', updatePosition);
			document.removeEventListener('mouseup', stopDrag);
			document.removeEventListener('touchend', stopDrag);

			applyFilters();
		}
	}
}

/**
 * Применяет все активные фильтры и обновляет список курсов
 */
function applyFilters() {

	filteredCourses = [...allCourses];

	const searchInput = document.querySelector('.catalog-filter__input');
	if (searchInput && searchInput.value.trim()) {
		const searchText = searchInput.value.toLowerCase().trim();
		filteredCourses = filteredCourses.filter(course => {
			const title = course.getElementsByTagName('title')[0]?.textContent || '';
			const description = course.getElementsByTagName('description')[0]?.textContent || '';
			return title.toLowerCase().includes(searchText) ||
				description.toLowerCase().includes(searchText);
		});
	}

	const activeCategory = document.querySelector('.tag-button--active');
	if (activeCategory && activeCategory.textContent.trim().toLowerCase() !== 'все программы') {
		const category = activeCategory.textContent.trim().toLowerCase();
		filteredCourses = filteredCourses.filter(course => {
			const title = course.getElementsByTagName('title')[0]?.textContent.toLowerCase() || '';
			const description = course.getElementsByTagName('description')[0]?.textContent.toLowerCase() || '';
			const content = title + ' ' + description;

			switch (category) {
				case 'бэкенд-разработка':
					return content.includes('python') || content.includes('backend') ||
						content.includes('бэкенд') || content.includes('java') ||
						content.includes('серверн') || content.includes('api') ||
						content.includes('базы данных') || content.includes('sql');
				case 'веб-разработка':
					return content.includes('frontend') || content.includes('web') ||
						content.includes('верстка') || content.includes('html') ||
						content.includes('css') || content.includes('javascript') ||
						content.includes('веб') || content.includes('сайт');
				case 'анализ данных':
					return content.includes('data') || content.includes('analyst') ||
						content.includes('аналитик') || content.includes('данных') ||
						content.includes('статистик') || content.includes('machine learning') ||
						content.includes('big data') || content.includes('визуализация');
				case 'it-инфраструктура':
					return content.includes('devops') || content.includes('admin') ||
						content.includes('сети') || content.includes('system') ||
						content.includes('инфраструктур') || content.includes('cloud') ||
						content.includes('облачн') || content.includes('docker');
				default:
					return true;
			}
		});
	}

	const activeLevel = document.querySelector('input[name="difficulty"]:checked');
	if (activeLevel) {
		const levelText = activeLevel.nextElementSibling.textContent.trim().toLowerCase();

		if (levelText !== 'любой') {
			filteredCourses = filteredCourses.filter(course => {
				const employment = course.getElementsByTagName('employment')[0]?.textContent.toLowerCase() || '';

				if (levelText === 'для новичков') {
					return employment === 'junior' || employment === 'стажер' || employment === 'intern';
				} else if (levelText === 'для специалистов') {
					return employment === 'middle' || employment === 'senior';
				}

				return true;
			});
		}
	}

	const minThumb = document.querySelector('.range-slider__thumb--min');
	const maxThumb = document.querySelector('.range-slider__thumb--max');

	if (minThumb && maxThumb) {
		const minPosition = parseFloat(minThumb.style.left) / 100;
		const maxPosition = parseFloat(maxThumb.style.left) / 100;

		const maxMonths = 10;
		const minValue = 5;

		const selectedMinMonths = Math.max(minValue, Math.round(minPosition * (maxMonths - minValue)) + minValue);
		const selectedMaxMonths = Math.min(maxMonths, Math.round(maxPosition * (maxMonths - minValue)) + minValue);

		filteredCourses = filteredCourses.filter(course => {
			const durationText = course.getElementsByTagName('duration')[0]?.textContent || '';
			const match = durationText.match(/(\d+)/);

			if (match && match[1]) {
				const months = parseInt(match[1], 10);
				return months >= selectedMinMonths && months <= selectedMaxMonths;
			}

			return true;
		});
	}

	renderCourses();
}

/**
 * Отображает курсы на странице
 */
function renderCourses() {
	const coursesGrid = document.querySelector('.courses-grid');
	if (!coursesGrid) return;

	coursesGrid.innerHTML = '';

	const catalogTitle = document.querySelector('.catalog-title');
	if (catalogTitle) {
		catalogTitle.textContent = `Онлайн-курсы по IT-профессиям (${filteredCourses.length})`;
	}

	const initialCount = Math.min(10, filteredCourses.length);
	visibleCoursesCount = initialCount;

	for (let i = 0; i < initialCount; i++) {
		if (i >= filteredCourses.length) break;

		try {
			const card = createCourseCardFromXML(filteredCourses[i]);
			coursesGrid.appendChild(card);
		} catch (e) {
			console.error(`Ошибка при создании карточки курса ${i}:`, e);
		}
	}

	updateShowMoreButton();
}

/**
 * Обновляет состояние кнопки "Показать еще"
 */
function updateShowMoreButton() {
	const moreCoursesContainer = document.querySelector('.more-courses');
	const moreCoursesButton = document.querySelector('.more-courses__button');

	if (!moreCoursesContainer || !moreCoursesButton) return;

	if (visibleCoursesCount >= filteredCourses.length) {
		moreCoursesContainer.style.display = 'none';
		return;
	}

	moreCoursesContainer.style.display = 'flex';

	const remainingCourses = filteredCourses.length - visibleCoursesCount;
	const nextBatch = Math.min(10, remainingCourses);
	moreCoursesButton.textContent = `Еще ${nextBatch} курсов из ${remainingCourses}`;

	const newButton = moreCoursesButton.cloneNode(true);
	moreCoursesButton.parentNode.replaceChild(newButton, moreCoursesButton);

	newButton.addEventListener('click', loadMoreCourses);
}

/**
 * Загружает дополнительные курсы
 */
function loadMoreCourses() {
	const coursesGrid = document.querySelector('.courses-grid');
	if (!coursesGrid) return;

	const remainingCourses = filteredCourses.length - visibleCoursesCount;
	const coursesToAdd = Math.min(10, remainingCourses);

	for (let i = 0; i < coursesToAdd; i++) {
		const index = visibleCoursesCount + i;
		if (index >= filteredCourses.length) break;

		try {
			const card = createCourseCardFromXML(filteredCourses[index]);
			coursesGrid.appendChild(card);
		} catch (e) {
			console.error(`Ошибка при добавлении карточки курса ${index}:`, e);
		}
	}

	visibleCoursesCount += coursesToAdd;
	updateShowMoreButton();
} 