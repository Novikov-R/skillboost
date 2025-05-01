/**
 * Файл для главной страницы
 */
import { loadXmlData, setupContactForm } from '../modules/common.js';
import { initializeCoursesSlider } from '../modules/slider.js';
import { createCourseCard } from '../modules/courses.js';
import { initMobileMenu } from '../modules/mobile-menu.js';

document.addEventListener('DOMContentLoaded', function() {

	initMobileMenu();

	setupContactForm(document.querySelector('.footer__contact-form'));

	if (document.querySelector('.courses__list')) {
		loadXmlData('courses_list.xml')
			.then(xmlDoc => {
				loadFeaturedCourses(xmlDoc);
				setTimeout(() => {
					initializeCoursesSlider();
					window.addEventListener('orientationchange', function() {
						setTimeout(() => {
							initializeCoursesSlider();
						}, 300);
					});
				}, 100);
			})
			.catch(error => {
				console.error('Ошибка загрузки файла курсов:', error);
			});
	}
});

/**
 * Загружает избранные курсы в слайдер на главной странице
 * @param {Document} xmlDoc - XML документ с курсами
 */
function loadFeaturedCourses(xmlDoc) {
	const coursesContainer = document.querySelector('.courses__list');
	if (!coursesContainer) return;

	coursesContainer.innerHTML = '';

	const courses = xmlDoc.getElementsByTagName('course');

	if (courses.length > 0) {
		const firstCourse = courses[0];
		firstCourse.getElementsByTagName('futured');
	}

	let featuredCount = 0;
	const maxCourses = window.innerWidth < 576 ? 4 : 6;
	const loadedImages = [];

	for (let i = 0; i < courses.length; i++) {
		const course = courses[i];
		const featuredElement = course.getElementsByTagName('futured')[0];
		const isFeatured = featuredElement && featuredElement.textContent === 'true';

		if (isFeatured && featuredCount < maxCourses) {
			featuredCount++;
			const title = course.getElementsByTagName('title')[0].textContent;
			const duration = course.getElementsByTagName('duration')[0].textContent;
			const courseId = course.getAttribute('id');
			const card = createCourseCard(title, duration, 'images/python_course.png', true, courseId);
			coursesContainer.appendChild(card);

			const img = card.querySelector('img');
			if (img) {
				loadedImages.push(new Promise((resolve) => {
					if (img.complete) {
						resolve();
					} else {
						img.onload = resolve;
					}
				}));
			}
		}
	}

	if (featuredCount === 0) {
		for (let i = 0; i < Math.min(maxCourses, courses.length); i++) {
			const course = courses[i];
			const title = course.getElementsByTagName('title')[0].textContent;
			const duration = course.getElementsByTagName('duration')[0].textContent;
			const courseId = course.getAttribute('id');

			const card = createCourseCard(title, duration, 'images/python_course.png', true, courseId);
			coursesContainer.appendChild(card);

			const img = card.querySelector('img');
			if (img) {
				loadedImages.push(new Promise((resolve) => {
					if (img.complete) {
						resolve();
					} else {
						img.onload = resolve;
					}
				}));
			}
		}
	}

	Promise.all(loadedImages).then(() => {
		setTimeout(() => {
			initializeCoursesSlider();

			setTimeout(() => {
				const container = document.querySelector('.courses__list');
				const cards = document.querySelectorAll('.course-card');

				if (container && cards.length > 0) {
					const windowWidth = window.innerWidth;
					const isSingleCardView = windowWidth < 992;

					const cardWidth = parseInt(getComputedStyle(cards[0]).width, 10);

					let fixedWidth;
					if (isSingleCardView) {
						fixedWidth = Math.max(300, cardWidth);
					} else {
						fixedWidth = Math.max(300, Math.min(cardWidth, 420));
					}

					cards.forEach(card => {
						card.style.width = fixedWidth + 'px';
					});
				}
			}, 100);
		}, 50);
	});
} 