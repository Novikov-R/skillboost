/**
 * Модуль для бургер меню на мобильных устройствах
 */

export function initMobileMenu() {
	const mobileToggle = document.querySelector('.header__mobile-toggle');
	const navigation = document.querySelector('.navigation');
	const body = document.body;

	if (!mobileToggle || !navigation) return;

	mobileToggle.addEventListener('click', () => {
		mobileToggle.classList.toggle('active');
		navigation.classList.toggle('active');
		body.classList.toggle('menu-open');
	});

	const navLinks = document.querySelectorAll('.navigation__link');
	navLinks.forEach(link => {
		link.addEventListener('click', () => {
			mobileToggle.classList.remove('active');
			navigation.classList.remove('active');
			body.classList.remove('menu-open');
		});
	});
} 