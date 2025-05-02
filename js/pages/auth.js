document.addEventListener('DOMContentLoaded', () => {
	const authContainer = document.querySelector('.auth__container');
	const registerForm = document.getElementById('register-form');
	const loginForm = document.getElementById('login-form');
	const showLoginBtn = document.getElementById('show-login');
	const showRegisterBtn = document.getElementById('show-register');

	showLoginBtn.addEventListener('click', () => {
		authContainer.classList.add("login");
		registerForm.classList.remove('active');
		registerForm.classList.add('inactive');
		document.title = 'Вход - SkillBoost';

		loginForm.classList.remove('inactive');
		loginForm.classList.add('active');
	});

	showRegisterBtn.addEventListener('click', () => {
		authContainer.classList.remove("login");
		loginForm.classList.remove('active');
		loginForm.classList.add('inactive');
		document.title = 'Регистрация - SkillBoost';

		registerForm.classList.remove('inactive');
		registerForm.classList.add('active');
	});

	registerForm.classList.add('active');

	const passwordToggles = document.querySelectorAll('.auth__password-toggle');
	passwordToggles.forEach(toggle => {
		toggle.addEventListener('click', function() {
			const targetId = this.getAttribute('data-target');
			const passwordInput = document.getElementById(targetId);

			if (passwordInput.type === 'password') {
				passwordInput.type = 'text';
			} else {
				passwordInput.type = 'password';
			}
		});
	});
});