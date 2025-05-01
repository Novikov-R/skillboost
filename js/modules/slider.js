/**
 * Инициализация слайдера для карточек курсов
 */
function initializeCoursesSlider() {
	const coursesSlider = {
		container: document.querySelector('.courses__list'),
		wrapper: document.querySelector('.courses__list-wrapper'),
		prevButton: document.querySelector('.slider-nav__button--prev'),
		nextButton: document.querySelector('.slider-nav__button--next'),
		cards: document.querySelectorAll('.course-card'),
		currentIndex: 0,
		touchStartX: 0,
		touchEndX: 0,
		minCardWidth: 300,
		maxCardWidth: 400,

		init: function() {
			if (this.container && this.cards.length > 0) {
				setTimeout(() => {
					this.setupContainer();
					this.setupEventListeners();
					this.updateSliderState();
					this.updateVisibility();
				}, 10);

				window.addEventListener('resize', () => {
					this.setupContainer();
					this.updateVisibility();
					this.updateSliderState();
				});
			}
		},

		setupContainer: function() {
			const wrapperStyle = getComputedStyle(this.wrapper);
			const paddingLeft = parseInt(wrapperStyle.paddingLeft || 0, 10);
			const paddingRight = parseInt(wrapperStyle.paddingRight || 0, 10);

			const containerWidth = this.wrapper.clientWidth - paddingLeft - paddingRight;
			const visibleCards = this.getVisibleCardsCount();

			const windowWidth = window.innerWidth;
			let gap = 56;

			if (windowWidth < 576) {
				gap = 15;
			} else if (windowWidth < 768) {
				gap = 20;
			} else if (windowWidth < 992) {
				gap = 30;
			}

			const totalGapWidth = gap * (visibleCards - 1);
			let cardWidth = Math.floor((containerWidth - totalGapWidth - 1) / visibleCards);

			if (visibleCards === 1) {
				cardWidth = Math.max(this.minCardWidth, cardWidth);
			} else {
				cardWidth = Math.max(this.minCardWidth, Math.min(cardWidth, this.maxCardWidth));
			}

			const maxFittingCards = Math.floor((containerWidth + gap) / (cardWidth + gap));
			const actualVisibleCards = Math.min(visibleCards, maxFittingCards);

			if (actualVisibleCards !== visibleCards && this.currentIndex > 0) {
				if (this.currentIndex > this.cards.length - actualVisibleCards) {
					this.currentIndex = Math.max(0, this.cards.length - actualVisibleCards);
				}
			}

			this.cards.forEach(card => {
				card.style.width = cardWidth + 'px';
			});

			this.container.style.gap = gap + 'px';
		},

		setupEventListeners: function() {
			if (this.prevButton) {
				this.prevButton.addEventListener('click', () => {
					this.slideTo(this.currentIndex - this.getVisibleCardsCount());
				});
			}

			if (this.nextButton) {
				this.nextButton.addEventListener('click', () => {
					this.slideTo(this.currentIndex + this.getVisibleCardsCount());
				});
			}

			if (this.wrapper) {
				this.wrapper.addEventListener('touchstart', (e) => {
					this.touchStartX = e.changedTouches[0].screenX;
				}, { passive: true });

				this.wrapper.addEventListener('touchend', (e) => {
					this.touchEndX = e.changedTouches[0].screenX;
					this.handleSwipe();
				}, { passive: true });
			}
		},

		handleSwipe: function() {
			const swipeThreshold = 50;
			const swipeDistance = this.touchEndX - this.touchStartX;

			if (swipeDistance > swipeThreshold) {
				this.slideTo(this.currentIndex - 1);
			} else if (swipeDistance < -swipeThreshold) {
				this.slideTo(this.currentIndex + 1);
			}
		},

		slideTo: function(index) {
			if (index < 0) {
				index = 0;
			} else if (index > this.cards.length - this.getVisibleCardsCount()) {
				index = this.cards.length - this.getVisibleCardsCount();
			}

			this.currentIndex = index;
			this.updateVisibility();
			this.updateSliderState();
		},

		getVisibleCardsCount: function() {
			const windowWidth = window.innerWidth;

			const containerWidth = this.wrapper.clientWidth;
			const gap = this.getGapSize();
			const maxPossibleCards = Math.floor((containerWidth + gap) / (this.minCardWidth + gap));

			let standardCount;
			if (windowWidth < 576) {
				standardCount = 1;
			} else if (windowWidth < 768) {
				standardCount = 1;
			} else if (windowWidth < 992) {
				standardCount = 2;
			} else {
				standardCount = 3;
			}

			return Math.min(standardCount, maxPossibleCards);
		},

		getGapSize: function() {
			const windowWidth = window.innerWidth;

			if (windowWidth < 576) {
				return 15;
			} else if (windowWidth < 768) {
				return 20;
			} else if (windowWidth < 992) {
				return 30;
			}
			return 56;
		},

		updateVisibility: function() {
			const gap = parseInt(getComputedStyle(this.container).gap || 0, 10) || this.getGapSize();

			const cardWidth = this.cards[0].offsetWidth;
			const offset = -1 * (cardWidth + gap) * this.currentIndex;

			this.container.style.transform = `translateX(${offset}px)`;
		},

		updateSliderState: function() {
			if (this.prevButton) {
				this.prevButton.disabled = this.currentIndex === 0;
				this.prevButton.classList.toggle('disabled', this.currentIndex === 0);
			}

			if (this.nextButton) {
				const isLast = this.currentIndex >= this.cards.length - this.getVisibleCardsCount();
				this.nextButton.disabled = isLast;
				this.nextButton.classList.toggle('disabled', isLast);
			}
		},
	};

	coursesSlider.init();
}

export { initializeCoursesSlider }; 