/**
 * Файл для страницы отдельного курса
 * Загружает информацию о курсе из XML и генерирует контент
 */
import { loadXmlData, setupContactForm } from '../modules/common.js';
import { initMobileMenu } from '../modules/mobile-menu.js';

document.addEventListener('DOMContentLoaded', function() {

	initMobileMenu();

	setupContactForm(document.querySelector('.footer__contact-form'));

	const urlParams = new URLSearchParams(window.location.search);
	const courseId = urlParams.get('id');

	if (!courseId) {
		showError('Курс не найден. Пожалуйста, вернитесь в каталог и выберите курс.');
		return;
	}

	loadXmlData('courses_list.xml')
		.then(xmlDoc => {
			loadCourseInfo(xmlDoc, courseId);
		})
		.catch(error => {
			console.error('Ошибка загрузки файла курсов:', error);
			showError('Не удалось загрузить информацию о курсе. Пожалуйста, попробуйте позже.');
		});
});

/**
 * Инициализирует аккордеон для программы курса
 */
function initAccordion() {
	const accordionButtons = document.querySelectorAll('.accordion-button');

	accordionButtons.forEach(button => {
		button.addEventListener('click', function() {
			this.classList.toggle('active');
			const content = this.nextElementSibling;

			if (content.style.maxHeight) {
				content.style.maxHeight = null;
			} else {
				content.style.maxHeight = content.scrollHeight + 'px';
			}
		});
	});
}

/**
 * Загружает информацию о курсе из XML и заполняет страницу
 * @param {Document} xmlDoc - XML документ с курсами
 * @param {string} courseId - ID курса для отображения
 */
function loadCourseInfo(xmlDoc, courseId) {
	const courses = xmlDoc.getElementsByTagName('course');
	let courseElement = null;

	for (let i = 0; i < courses.length; i++) {
		if (courses[i].getAttribute('id') === courseId) {
			courseElement = courses[i];
			break;
		}
	}

	if (!courseElement) {
		showError('Запрашиваемый курс не найден. Пожалуйста, вернитесь в каталог и выберите другой курс.');
		return;
	}

	try {
		fillCourseInfo(courseElement);
	} catch (error) {
		console.error('Ошибка при заполнении информации о курсе:', error);
		showError('Произошла ошибка при загрузке информации о курсе. Пожалуйста, попробуйте позже.');
	}
}

/**
 * Заполняет страницу информацией о курсе
 * @param {Element} courseElement - XML элемент с информацией о курсе
 */
function fillCourseInfo(courseElement) {

	const title = getElementText(courseElement, 'title');
	const tagline = getElementText(courseElement, 'tagline');
	const duration = getElementText(courseElement, 'duration');
	const practicePercent = getElementText(courseElement, 'practicePercent');
	const projectsCount = getElementText(courseElement, 'projectsCount');
	const description = getElementText(courseElement, 'description');
	const enrollUrl = getElementText(courseElement, 'enrollUrl');

	document.title = `${title} - SkillBoost`;

	fillCourseHero(title, tagline, enrollUrl);
	fillCourseDescription(description);
	fillCourseHeader(duration, practicePercent, projectsCount);

	loadCourseProgram(courseElement);
}

/**
 * Заполняет блок hero курса
 * @param {string} title - название курса
 * @param {string} tagline - краткое описание курса
 * @param {string} enrollUrl - URL для записи на курс
 */
function fillCourseHero(title, tagline, enrollUrl) {

	const heroTitle = document.querySelector('.course-hero__title');
	const heroSubtitle = document.querySelector('.course-hero__subtitle');
	const enrollButton = document.querySelector('.btn--primary.btn--large');

	if (heroTitle) {
		heroTitle.textContent = title;
	} else {
		console.warn('Элемент заголовка не найден на странице');
	}

	if (heroSubtitle) {
		heroSubtitle.textContent = tagline;
	} else {
		console.warn('Элемент подзаголовка не найден на странице');
	}

	if (enrollButton && enrollUrl) {
		enrollButton.addEventListener('click', function() {
			window.location.href = enrollUrl;
		});
	} else {
		console.warn('Элемент кнопки записи или URL не найден');
	}
}

/**
 * Заполняет описание курса
 * @param {string} description - описание курса
 */
function fillCourseDescription(description) {

	const courseDescription = document.querySelector('.course-description');
	if (courseDescription) {
		courseDescription.textContent = description;
	} else {
		console.warn('Элемент описания не найден на странице');
	}
}

/**
 * Заполняет информацию о продолжительности, практике и проектах
 * @param {string} duration - продолжительность курса
 * @param {string} practicePercent - процент практики
 * @param {string} projectsCount - количество проектов
 */
function fillCourseHeader(duration, practicePercent, projectsCount) {

	const headerItems = document.querySelectorAll('.course-header__item');

	if (headerItems.length >= 3) {
		const durationText = headerItems[0].querySelector('.course-header__item--text');
		if (durationText) {
			durationText.textContent = `${duration} обучения`;
		}

		const practiceText = headerItems[1].querySelector('.course-header__item--text');
		if (practiceText) {
			practiceText.textContent = `${practicePercent}% курса — практика`;
		}

		const projectsText = headerItems[2].querySelector('.course-header__item--text');
		if (projectsText) {
			projectsText.textContent = `${projectsCount} крупных проектов`;
		}
	} else {
		console.warn('Недостаточно элементов для заполнения хедера');
	}
}

/**
 * Загружает программу курса из XML документа и группирует по категориям
 * @param {Element} courseElement XML элемент с данными о курсе
 */
function loadCourseProgram(courseElement) {

	const programContainer = document.querySelector('.course-program__wrapper');
	if (!programContainer) {
		console.error('Не найден контейнер для программы курса');
		return;
	}

	const existingAccordions = programContainer.querySelectorAll('.accordion-container');
	existingAccordions.forEach(accordion => accordion.remove());

	const programElement = courseElement.getElementsByTagName('program')[0];

	if (!programElement) {
		programContainer.innerHTML += '<p class="no-modules-message">Программа курса находится в разработке.</p>';
		return;
	}

	const modules = programElement.getElementsByTagName('module');

	if (modules.length === 0) {
		programContainer.innerHTML += '<p class="no-modules-message">Программа курса находится в разработке.</p>';
		return;
	}

	const introductoryModules = [];
	const coreModules = [];
	const advancedModules = [];

	for (let i = 0; i < modules.length; i++) {
		const module = modules[i];
		const categoryElem = module.getElementsByTagName('category')[0];
		const category = categoryElem ? categoryElem.textContent : 'Core';

		if (category === 'Introductory') {
			introductoryModules.push(module);
		} else if (category === 'Advanced') {
			advancedModules.push(module);
		} else {
			coreModules.push(module);
		}
	}

	if (introductoryModules.length > 0) {
		createCategoryAccordion(programContainer, 'Вводный курс', introductoryModules);
	}

	if (coreModules.length > 0) {
		createCategoryAccordion(programContainer, 'Основные курсы', coreModules);
	}

	if (advancedModules.length > 0) {
		createCategoryAccordion(programContainer, 'Продвинутые навыки', advancedModules);
	}

	initAccordion();
}

/**
 * Создает аккордеон для категории модулей
 * @param {HTMLElement} container - контейнер для добавления аккордеона
 * @param {string} categoryTitle - заголовок категории
 * @param {*[]} modules - модули для этой категории
 * @param {string} employment - уровень квалификации
 */
function createCategoryAccordion(container, categoryTitle, modules, employment = 'junior') {

	const categoryContainer = document.createElement('div');
	categoryContainer.className = 'accordion-container';

	const categoryHeading = document.createElement('h3');
	categoryHeading.className = 'category-title';
	categoryHeading.textContent = categoryTitle;
	categoryContainer.appendChild(categoryHeading);

	const accordion = document.createElement('div');
	accordion.className = 'accordion';

	for (let i = 0; i < modules.length; i++) {
		const module = modules[i];
		const moduleTitle = module.getElementsByTagName('name')[0]?.textContent || 'Без названия';
		const moduleDesc = module.getElementsByTagName('description')[0]?.textContent || '';
		const subtopics = module.getElementsByTagName('subtopic');

		const moduleItem = document.createElement('div');
		moduleItem.className = 'accordion-item';

		const button = document.createElement('button');
		button.className = 'accordion-button';
		button.innerHTML = `
      <h3 class="accordion-button__title">Модуль ${i + 1}: ${moduleTitle}</h3>
      <div class="accordion-button__descr">${moduleDesc}</div>
      <span class="accordion-button__icon"></span>
    `;

		const content = document.createElement('div');
		content.className = 'accordion-content';

		if (subtopics.length > 0) {
			const topicsList = document.createElement('ul');
			topicsList.className = 'accordion-content__list';

			for (let j = 0; j < subtopics.length; j++) {
				const topic = subtopics[j];
				const topicTitle = topic.textContent;
				const seconds = topic.getAttribute('seconds');
				formatDuration(parseInt(seconds, 10));

				const topicItem = document.createElement('li');
				topicItem.className = 'course-subtopic';
				topicItem.textContent = topicTitle;

				topicsList.appendChild(topicItem);
			}

			content.appendChild(topicsList);
		}

		moduleItem.appendChild(button);
		moduleItem.appendChild(content);

		accordion.appendChild(moduleItem);
	}

	if (categoryTitle === 'Основные курсы') {
		const div = document.createElement('div');
		div.className = 'accordion-item accordion-item--end';
		div.innerHTML = `
			<img class="end__image" src="./images/end.png" alt="end" />
			<div class="end__title">Трудоустройство на позицию ${employment}</div>
		`;
		accordion.appendChild(div);
	}

	categoryContainer.appendChild(accordion);
	container.appendChild(categoryContainer);
}

/**
 * Получает текстовое содержимое элемента XML
 * @param {Element} parentElement - родительский XML элемент
 * @param {string} tagName - имя тега
 * @returns {string} - текстовое содержимое или пустая строка, если элемент не найден
 */
function getElementText(parentElement, tagName) {
	const element = parentElement.getElementsByTagName(tagName)[0];
	return element ? element.textContent : '';
}

/**
 * Отображает сообщение об ошибке на странице
 * @param {string} message - текст сообщения об ошибке
 */
function showError(message) {
	const courseHero = document.querySelector('.course-hero');
	const courseAbout = document.querySelector('.course-about');
	const courseProgram = document.querySelector('.course-program');

	if (courseHero) courseHero.style.display = 'none';
	if (courseAbout) courseAbout.style.display = 'none';
	if (courseProgram) courseProgram.style.display = 'none';

	const errorElement = document.createElement('div');
	errorElement.className = 'error-container container';
	errorElement.innerHTML = `
    <div class="error-message">
      <h2>Ошибка</h2>
      <p>${message}</p>
      <a href="courses.html" class="btn btn--primary">Вернуться в каталог</a>
    </div>
  `;

	document.querySelector('main').prepend(errorElement);
}

/**
 * Форматирует секунды в текстовый формат
 * @param {number} seconds - длительность в секундах
 * @returns {string} - отформатированная строка времени
 */
function formatDuration(seconds) {
	if (!seconds || isNaN(seconds)) return '';

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);

	function formatHours(hours) {
		if (hours === 0) return '';
		if (hours === 1) return '1 час';
		if (hours >= 2 && hours <= 4) return `${hours} часа`;
		return `${hours} часов`;
	}

	function formatMinutes(minutes) {
		if (minutes === 0) return '';
		if (minutes === 1 || minutes % 10 === 1 && minutes !== 11) return `${minutes} минута`;
		if ([2, 3, 4].includes(minutes % 10) && ![12, 13, 14].includes(minutes)) return `${minutes} минуты`;
		return `${minutes} минут`;
	}

	if (hours > 0 && minutes > 0) {
		return `${formatHours(hours)} ${formatMinutes(minutes)}`;
	} else if (hours > 0) {
		return formatHours(hours);
	} else if (minutes > 0) {
		return formatMinutes(minutes);
	} else {
		return 'меньше минуты';
	}
} 