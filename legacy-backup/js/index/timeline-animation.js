// timeline-animation.js - 타임라인 애니메이션

/**
 * 타임라인 애니메이션 초기화
 */
export const initTimelineAnimation = () => {
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (!timelineItems.length) return;

    /**
     * 요소가 뷰포트에 있는지 확인
     * @param {HTMLElement} element - 확인할 요소
     * @returns {boolean} - 뷰포트 내 존재 여부
     */
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    };

    // 스크롤 이벤트에서 타임라인 항목 확인
    const handleTimelineAnimation = () => {
        timelineItems.forEach(item => {
            if (isInViewport(item)) {
                item.classList.add('animate');
            }
        });
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleTimelineAnimation);

    // 초기 로드 시 한 번 체크
    setTimeout(handleTimelineAnimation, 300);
};

/**
 * 페이지 로드 시 타임라인 애니메이션 초기화
 */
document.addEventListener('DOMContentLoaded', initTimelineAnimation);