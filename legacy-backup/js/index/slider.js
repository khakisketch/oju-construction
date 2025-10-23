// slider.js - 슬라이더 관련 기능

/**
 * 히어로 슬라이더 초기화
 */
const initHeroSlider = () => {
    const heroSlider = document.querySelector('.hero-slider');

    if (!heroSlider) return;

    // Swiper 인스턴스 생성
    const heroSwiperInstance = new Swiper(heroSlider, {
        loop: true,
        effect: 'fade',
        speed: 1500,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.hero-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return `<span class="${className}"></span>`;
            },
        },
        navigation: {
            nextEl: '.hero-next',
            prevEl: '.hero-prev',
        },
        on: {
            slideChangeTransitionStart: function() {
                // 슬라이드 애니메이션 요소들 초기화
                const activeSlide = this.slides[this.activeIndex];
                const animElements = activeSlide.querySelectorAll('.animate-element');

                animElements.forEach(element => {
                    element.classList.remove('animated');
                    void element.offsetWidth; // 리플로우 트리거
                    element.classList.add('animated');
                });
            }
        }
    });

    return heroSwiperInstance;
};

/**
 * 사업분야 슬라이더 초기화
 */
const initBusinessSlider = () => {
    const businessSlider = document.querySelector('.business-slider');

    if (!businessSlider) return;

    // Swiper 인스턴스 생성
    const businessSwiperInstance = new Swiper(businessSlider, {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.business-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.business-next',
            prevEl: '.business-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });

    return businessSwiperInstance;
};

/**
 * 포트폴리오 슬라이더 초기화
 */
const initPortfolioSlider = () => {
    const portfolioSlider = document.querySelector('.portfolio-slider');

    if (!portfolioSlider) return;

    // Swiper 인스턴스 생성
    const portfolioSwiperInstance = new Swiper(portfolioSlider, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        speed: 1000,
        pagination: {
            el: '.portfolio-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.portfolio-next',
            prevEl: '.portfolio-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            1280: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
        },
    });

    return portfolioSwiperInstance;
};

/**
 * 슬라이더 화살표 동적 생성
 * Swiper에서 기본으로 제공하는 화살표 대신 커스텀 화살표 사용
 */
const createCustomArrows = () => {
    const prevButtons = document.querySelectorAll('.swiper-button-prev');
    const nextButtons = document.querySelectorAll('.swiper-button-next');

    // 이전 버튼 화살표 교체
    prevButtons.forEach(button => {
        button.innerHTML = '<i class="fas fa-chevron-left"></i>';
    });

    // 다음 버튼 화살표 교체
    nextButtons.forEach(button => {
        button.innerHTML = '<i class="fas fa-chevron-right"></i>';
    });
};

/**
 * 슬라이더 관련 모든 기능 초기화
 */
export const initSliders = () => {
    const heroSwiper = initHeroSlider();
    const businessSwiper = initBusinessSlider();
    const portfolioSwiper = initPortfolioSlider();

    createCustomArrows();

    // 모든 슬라이더 인스턴스 반환
    return {
        heroSwiper,
        businessSwiper,
        portfolioSwiper
    };
};

// 문서 로드 완료 시 슬라이더 초기화
document.addEventListener('DOMContentLoaded', initSliders);