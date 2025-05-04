/**
 * Функции для работы с карточками курсов
 */

/**
 * Создает HTML для карточки курса
 * @param {string} title - название курса
 * @param {string} duration - продолжительность курса
 * @param {string} imgSrc - путь к изображению курса
 * @param {boolean} isIndexPage - находимся ли мы на главной странице
 * @returns {string} - HTML код карточки
 */
function createCourseCardHTML(title, duration, imgSrc = 'images/python_course.png', isIndexPage = false) {
	return `
    <div class="course-card__header">
      <div class="course-card__title-wrapper">
        <span class="course-card__label">Курс</span>
        <h3 class="course-card__title">${title}</h3>
      </div>
      <div class="course-card__image">
        <img src="${imgSrc}" alt="${title}">
      </div>
    </div>
    <span class="${isIndexPage ? 'course-card__modules' : 'course-card__duration'}">${duration}</span>
  `;
}

/**
 * Создает DOM элемент карточки курса
 * @param {string} title - название курса
 * @param {string} duration - продолжительность курса
 * @param {string} imgSrc - путь к изображению курса
 * @param {boolean} isIndexPage - находимся ли мы на главной странице
 * @param {string} courseId - ID курса
 * @returns {HTMLElement} - DOM элемент карточки
 */
function createCourseCard(title, duration, imgSrc = 'images/python_course.png', isIndexPage = false, courseId = '') {

	const courseCard = document.createElement('div');
	courseCard.className = 'course-card';
	courseCard.dataset.courseId = courseId;

	try {
		courseCard.innerHTML = createCourseCardHTML(title, duration, imgSrc, isIndexPage);

		courseCard.addEventListener('click', () => {
			window.location.href = `course.html?id=${courseId}`;
		});
	} catch (e) {
		console.error(`Ошибка при создании карточки для курса ${title}:`, e);
	}

	return courseCard;
}

/**
 * Создает DOM элемент карточки курса из XML элемента
 * @param {Element} courseElement - XML элемент курса
 * @param {boolean} isIndexPage - находимся ли мы на главной странице
 * @returns {HTMLElement} - DOM элемент карточки
 */
function createCourseCardFromXML(courseElement, isIndexPage = false) {
	try {
		if (!courseElement) {
			console.error('courseElement не существует');
			throw new Error('courseElement is null or undefined');
		}

		const titleElement = courseElement.getElementsByTagName('title')[0];
		const durationElement = courseElement.getElementsByTagName('duration')[0];

		if (!titleElement || !durationElement) {
			console.error('Отсутствуют необходимые элементы в XML');
			if (!titleElement) console.error('Элемент title не найден');
			if (!durationElement) console.error('Элемент duration не найден');

			throw new Error('Missing required elements in XML');
		}

		const title = titleElement.textContent;
		const duration = durationElement.textContent;
		const courseId = courseElement.getAttribute('id');

		return createCourseCard(title, duration, 'images/python_course.png', isIndexPage, courseId);
	} catch (e) {
		console.error('Ошибка при создании карточки из XML:', e);

		const fallbackCard = document.createElement('div');
		fallbackCard.className = 'course-card';
		fallbackCard.innerHTML = `
      <div class="course-card__header">
        <div class="course-card__title-wrapper">
          <span class="course-card__label">Курс</span>
          <h3 class="course-card__title">Ошибка загрузки курса</h3>
        </div>
        <div class="course-card__image">
          <img src="images/python_course.png" alt="Ошибка">
        </div>
      </div>
      <span class="${isIndexPage ? 'course-card__modules' : 'course-card__duration'}">Нет данных</span>
    `;
		return fallbackCard;
	}
}

export { createCourseCardHTML, createCourseCard, createCourseCardFromXML }; 
