// utils.js - 유틸리티 함수

/**
 * 윈도우 스크롤 위치에 따라 특정 동작 수행
 * @param {number} scrollPos - 스크롤 임계값
 * @param {function} callback - 콜백 함수
 */
export const onWindowScroll = (scrollPos, callback) => {
    const handleScroll = () => {
        if (window.scrollY > scrollPos) {
            callback(true);
        } else {
            callback(false);
        }
    };

    window.addEventListener('scroll', handleScroll);

    // 초기 로드 시 한 번 체크
    handleScroll();

    // 클린업 함수 반환
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
};

/**
 * 요소가 뷰포트에 있는지 확인
 * @param {HTMLElement} element - 확인할 요소
 * @param {number} offset - 뷰포트 임계값(기본값: 0.8)
 * @returns {boolean} - 뷰포트 내 존재 여부
 */
export const isInViewport = (element, offset = 0.8) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * offset &&
        rect.bottom >= 0
    );
};

/**
 * 요소에 애니메이션 지연 설정
 * @param {NodeList} elements - 애니메이션 요소 목록
 * @param {number} baseDelay - 기본 지연 시간(ms)
 * @param {number} increment - 각 요소별 증가 지연 시간(ms)
 */
export const setStaggeredAnimations = (elements, baseDelay = 100, increment = 100) => {
    elements.forEach((element, index) => {
        const delay = baseDelay + (index * increment);
        element.style.animationDelay = `${delay}ms`;
        element.style.transitionDelay = `${delay}ms`;
    });
};

/**
 * 이미지 지연 로딩 설정
 * @param {string} selector - 이미지 선택자
 */
export const lazyLoadImages = (selector = 'img[data-src]') => {
    const images = document.querySelectorAll(selector);

    if (!images.length) return;

    // IntersectionObserver 지원 여부 확인
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    const src = image.getAttribute('data-src');

                    if (src) {
                        image.src = src;
                        image.removeAttribute('data-src');
                        image.classList.add('loaded');
                    }

                    imageObserver.unobserve(image);
                }
            });
        });

        images.forEach(image => {
            imageObserver.observe(image);
        });
    } else {
        // 폴백: 기본 지연 로딩
        const lazyLoad = () => {
            let active = false;

            if (active === false) {
                active = true;

                setTimeout(() => {
                    images.forEach(image => {
                        if ((image.getBoundingClientRect().top <= window.innerHeight && image.getBoundingClientRect().bottom >= 0) && getComputedStyle(image).display !== 'none') {
                            const src = image.getAttribute('data-src');

                            if (src) {
                                image.src = src;
                                image.removeAttribute('data-src');
                                image.classList.add('loaded');
                            }

                            if (images.length === 0) {
                                document.removeEventListener('scroll', lazyLoad);
                                window.removeEventListener('resize', lazyLoad);
                                window.removeEventListener('orientationChange', lazyLoad);
                            }
                        }
                    });

                    active = false;
                }, 200);
            }
        };

        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
        lazyLoad();
    }
};

/**
 * 이미지 경로 확인 및 에러 처리
 */
export const checkImagesPath = () => {
    const images = document.querySelectorAll('img:not(.no-error-handling)');

    images.forEach(img => {
        img.addEventListener('error', function() {
            // 이미지 로드 실패 시 대체 이미지 표시
            this.src = '/html/index/images/placeholder.jpg';
            this.alt = '이미지를 불러올 수 없습니다';
            this.classList.add('img-error');
        });
    });
};

/**
 * 테마 모드 토글(라이트/다크)
 */
export const initThemeToggle = () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    if (!themeToggleBtn) return;

    // 현재 테마 확인
    const currentTheme = localStorage.getItem('theme') || 'light';

    // 초기 테마 설정
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        themeToggleBtn.classList.add('active');
    }

    // 테마 토글 이벤트
    themeToggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');

        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.classList.add('active');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.classList.remove('active');
        }
    });
};

/**
 * 브라우저 지원 여부 확인
 * @returns {boolean} - 지원 여부
 */
export const checkBrowserSupport = () => {
    const isWebpSupported = () => {
        const elem = document.createElement('canvas');

        if (elem.getContext && elem.getContext('2d')) {
            return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }

        return false;
    };

    const isIE = () => {
        return navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Trident/') !== -1;
    };

    // IE 사용 시 경고 메시지
    if (isIE()) {
        const body = document.body;
        const warningDiv = document.createElement('div');

        warningDiv.className = 'browser-warning';
        warningDiv.innerHTML = `
            <div class="container">
                <p>Internet Explorer는 더 이상 지원되지 않습니다. <a href="https://www.google.com/chrome/" target="_blank">Chrome</a>, <a href="https://www.mozilla.org/firefox/" target="_blank">Firefox</a> 또는 <a href="https://www.microsoft.com/edge" target="_blank">Edge</a>와 같은 최신 브라우저를 사용해 주세요.</p>
            </div>
        `;

        body.insertBefore(warningDiv, body.firstChild);
    }

    // WebP 지원 여부에 따른 클래스 추가
    document.documentElement.classList.add(isWebpSupported() ? 'webp' : 'no-webp');

    return !isIE();
};

/**
 * 날짜 포맷팅
 * @param {Date|string} date - 날짜 객체 또는 문자열
 * @param {string} format - 포맷 (기본값: 'YYYY-MM-DD')
 * @returns {string} - 포맷된 날짜 문자열
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
};

/**
 * 디바운스 함수
 * @param {function} func - 실행할 함수
 * @param {number} wait - 대기 시간(ms)
 * @returns {function} - 디바운스된 함수
 */
export const debounce = (func, wait) => {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * 쓰로틀 함수
 * @param {function} func - 실행할 함수
 * @param {number} limit - 제한 시간(ms)
 * @returns {function} - 쓰로틀된 함수
 */
export const throttle = (func, limit) => {
    let inThrottle;

    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
};