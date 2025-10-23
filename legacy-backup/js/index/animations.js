// animations.js - 애니메이션 관련 기능

/**
 * AOS(Animate On Scroll) 라이브러리 초기화
 */
const initAOS = () => {
    // AOS가 로드되었는지 확인
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            once: true,
            mirror: false,
            offset: 50,
            disable: 'mobile'
        });

        // 리사이즈 이벤트 발생 시 AOS 리프레시
        window.addEventListener('resize', () => {
            AOS.refresh();
        });
    }
};

/**
 * 카운터 애니메이션 초기화
 */
const initCounterAnimation = () => {
    const counters = document.querySelectorAll('.counter-number');
    let counted = false;

    if (!counters.length) return;

    /**
     * 숫자 카운트 애니메이션 함수
     * @param {HTMLElement} counter - 카운터 요소
     * @param {number} target - 목표 숫자
     * @param {number} duration - 애니메이션 지속 시간(ms)
     */
    const animateCounter = (counter, target, duration = 2000) => {
        let start = 0;
        const step = target / (duration / 16); // 16ms는 대략적인 requestAnimationFrame 간격
        let now = 0;

        const updateCounter = () => {
            now += step;

            if (now < target) {
                counter.textContent = Math.ceil(now).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = parseInt(target).toLocaleString();
            }
        };

        updateCounter();
    };

    /**
     * 요소가 뷰포트에 있는지 확인
     * @param {HTMLElement} element - 확인할 요소
     * @returns {boolean} - 뷰포트 내 존재 여부
     */
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    };

    // 스크롤 이벤트에서 카운터 요소 확인
    const handleScroll = () => {
        // 카운터 섹션 체크
        if (counters.length > 0) {
            const counterSection = counters[0].closest('.counter-section') || counters[0].parentElement.parentElement.parentElement;

            if (isInViewport(counterSection) && !counted) {
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count') || '0');
                    animateCounter(counter, target);
                });
                counted = true;
            }
        }
    };

    window.addEventListener('scroll', handleScroll);

    // 초기 로드 시 한 번 체크
    handleScroll();
};

/**
 * 사용자 정의 스크롤 애니메이션 초기화
 */
const initScrollAnimations = () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (!animatedElements.length) return;

    /**
     * 요소가 뷰포트에 있는지 확인
     * @param {HTMLElement} element - 확인할 요소
     * @returns {boolean} - 뷰포트 내 존재 여부
     */
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    };

    // 스크롤 이벤트에서 애니메이션 요소 확인
    const handleScroll = () => {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('animated');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);

    // 초기 로드 시 한 번 체크
    handleScroll();
};

/**
 * 스크롤 인디케이터 애니메이션
 */
const initScrollIndicator = () => {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');

    if (!scrollIndicator) return;

    // 스크롤 시 인디케이터 숨기기
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
};

/**
 * 애니메이션 관련 모든 기능 초기화
 */
export const initAnimations = () => {
    initAOS();
    initCounterAnimation();
    initScrollAnimations();
    initScrollIndicator();
};

// 문서 로드 완료 시 애니메이션 초기화
document.addEventListener('DOMContentLoaded', initAnimations);

// 페이지 완전 로드 후 추가 초기화 (이미지 등이 모두 로드된 후)
window.addEventListener('load', () => {
    // AOS 리프레시
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
});