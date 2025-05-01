/**
 * Файл для страницы "О нас"
 */
import { setupContactForm } from '../modules/common.js';
import { initMobileMenu } from '../modules/mobile-menu.js';


document.addEventListener('DOMContentLoaded', function() {

	initMobileMenu();

	const contactForm = document.querySelector('.footer__contact-form');
	if (contactForm) {
		setupContactForm(contactForm);
	}
}); 