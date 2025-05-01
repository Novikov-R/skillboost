/**
 * Загрузка данных из XML файла
 * @param {string} url - путь к XML файлу
 * @returns {Promise<Document>} - промис с документом XML
 */
function loadXmlData(url) {

	return fetch(url)
		.then(response => {
			if (!response.ok) {
				console.error(`Ошибка HTTP! Статус: ${response.status}`);
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			return response.text();
		})
		.then(data => {

			if (!data || data.trim() === '') {
				console.error('Получены пустые данные');
				throw new Error('Empty XML data received');
			}

			try {
				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(data, 'text/xml');

				const parserError = xmlDoc.querySelector('parsererror');
				if (parserError) {
					console.error('Ошибка парсинга XML:', parserError.textContent);
					throw new Error('XML parsing error: ' + parserError.textContent);
				}

				const courses = xmlDoc.getElementsByTagName('course');

				if (courses.length === 0) {
					console.warn('Внимание: в XML файле не найдено ни одного курса');
				}

				return xmlDoc;
			} catch (error) {
				console.error('Ошибка при парсинге XML:', error);
				throw new Error('Failed to parse XML: ' + error.message);
			}
		})
		.catch(error => {
			console.error(`Ошибка при загрузке XML файла ${url}:`, error);
			throw error;
		});
}

/**
 * Обработка формы обратной связи
 * @param {HTMLFormElement} form - элемент формы
 */
function setupContactForm(form) {
	if (!form) return;

	form.addEventListener('submit', function(event) {
		event.preventDefault();

		let isValid = true;
		const inputs = this.querySelectorAll('input');

		inputs.forEach(input => {
			if (!input.value.trim()) {
				input.style.borderColor = '#ff0000';
				isValid = false;
			} else {
				input.style.borderColor = '';
			}
		});

		if (isValid) {
			const submitButton = this.querySelector('button[type="submit"]');
			submitButton.textContent = 'Отправляем...';
			submitButton.disabled = true;

			setTimeout(() => {
				alert('Спасибо! Ваша заявка отправлена. Мы скоро с вами свяжемся.');
				this.reset();
				submitButton.textContent = 'Отправить';
				submitButton.disabled = false;
			}, 1500);
		}
	});
}

export { loadXmlData, setupContactForm }; 