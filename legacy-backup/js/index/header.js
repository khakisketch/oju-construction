// header.js - 헤더 관련 기능

/**
 * 헤더 스크롤 효과 처리
 */
const initHeaderScroll = () => {
    const header = document.getElementById('header');

    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);

    // 초기 로드 시 상태 확인
    handleScroll();
};

/**
 * 모바일 메뉴 토글 기능
 */
const initMobileMenu = () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const body = document.body;

    if (!hamburgerBtn) return;

    hamburgerBtn.addEventListener('click', () => {
        body.classList.toggle('menu-open');
    });

    // 모바일에서 서브메뉴 토글
    const hasSubmenuItems = document.querySelectorAll('.has-submenu');

    hasSubmenuItems.forEach(item => {
        const link = item.querySelector('.nav-link');

        if (!link) return;

        link.addEventListener('click', function(e) {
            // 모바일 화면에서만 클릭 이벤트 처리
            if (window.innerWidth <= 991) {
                e.preventDefault();
                item.classList.toggle('submenu-active');
            }
        });
    });

    // 링크 클릭 시 모바일 메뉴 닫기
    const navLinks = document.querySelectorAll('.nav-link:not(.has-submenu > .nav-link)');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (body.classList.contains('menu-open') && window.innerWidth <= 991) {
                body.classList.remove('menu-open');
            }
        });
    });

    // 리사이즈 시 모바일 메뉴 초기화
    window.addEventListener('resize', () => {
        if (window.innerWidth > 991 && body.classList.contains('menu-open')) {
            body.classList.remove('menu-open');
        }
    });
};

/**
 * 스크롤 시 현재 섹션에 해당하는 네비게이션 링크 활성화
 */
const initActiveNavigation = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    const handleScroll = () => {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');

                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleScroll);
};

/**
 * 맨 위로 스크롤 버튼 기능
 */
const initScrollToTop = () => {
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (!scrollTopBtn) return;

    // 스크롤 위치에 따라 버튼 표시 여부 결정
    const handleScroll = () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    };

    // 맨 위로 스크롤 이벤트
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', handleScroll);
};

/**
 * 부드러운 스크롤 앵커 링크
 */
const initSmoothScroll = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                // 헤더 높이 계산
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 0;

                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
};

/**
 * 헤더 관련 모든 기능 초기화
 */
export const initHeader = () => {
    initHeaderScroll();
    initMobileMenu();
    initActiveNavigation();
    initScrollToTop();
    initSmoothScroll();
};

// 문서 로드 완료 시 헤더 초기화
document.addEventListener('DOMContentLoaded', initHeader);