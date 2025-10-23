// main.js - 모든 JS 파일 임포트 및 초기화

// 기존 모듈 임포트
import { initHeader } from './header.js';
import { initSliders } from './slider.js';
import { initAnimations } from './animations.js';
import { initForms } from './forms.js';
import * as utils from './utils.js';

// 새로 추가된 모듈 임포트
import { initTimelineAnimation } from './timeline-animation.js';
import { initContactForm } from './contact-form.js';

/**
 * 애플리케이션 초기화
 */
const initApp = () => {
    // 브라우저 지원 확인
    utils.checkBrowserSupport();

    // 헤더 초기화
    initHeader();

    // 슬라이더 초기화
    initSliders();

    // 애니메이션 초기화
    initAnimations();

    // 폼 초기화 (기존)
    initForms();

    // 타임라인 애니메이션 초기화 (새로 추가)
    initTimelineAnimation();

    // 문의 폼 초기화 (새로 추가)
    initContactForm();

    // 이미지 지연 로딩
    utils.lazyLoadImages();

    // 이미지 경로 확인
    utils.checkImagesPath();

    // 스크롤 탑 버튼
    utils.onWindowScroll(300, (isScrolled) => {
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        if (scrollTopBtn) {
            if (isScrolled) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    });

    // 컨텐츠 애니메이션 설정
    const animateItems = document.querySelectorAll('.animate-on-scroll');

    if (animateItems.length > 0) {
        const handleScroll = utils.throttle(() => {
            animateItems.forEach(item => {
                if (utils.isInViewport(item)) {
                    item.classList.add('animated');
                }
            });
        }, 100);

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);

        // 초기 실행
        setTimeout(handleScroll, 100);
    }

    console.log('오주건설 웹사이트가 초기화되었습니다.');
};

// 문서 로드 완료 시 앱 초기화
document.addEventListener('DOMContentLoaded', initApp);

// 페이지 완전 로드 후 추가 처리
window.addEventListener('load', () => {
    // 페이지 로딩 인디케이터 숨기기
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        pageLoader.classList.add('loaded');
        setTimeout(() => {
            pageLoader.style.display = 'none';
        }, 500);
    }
});

// 공통 기능 내보내기
export {
    utils
};