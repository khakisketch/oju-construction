// forms.js - 폼 관련 기능

/**
 * 문의 폼 유효성 검사 및 제출 처리
 */
const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    /**
     * 입력값 유효성 검사
     * @param {HTMLInputElement|HTMLTextAreaElement} input - 입력 요소
     * @returns {boolean} - 유효성 여부
     */
    const validateInput = (input) => {
        // 필수 필드인 경우
        if (input.hasAttribute('required') && !input.value.trim()) {
            showError(input, '필수 입력 항목입니다.');
            return false;
        }

        // 이메일 형식 검사
        if (input.type === 'email' && input.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value.trim())) {
                showError(input, '유효한 이메일 주소를 입력하세요.');
                return false;
            }
        }

        // 전화번호 형식 검사
        if (input.type === 'tel' && input.value.trim()) {
            const telPattern = /^[\d\s\-\+\(\)]{8,20}$/;
            if (!telPattern.test(input.value.trim())) {
                showError(input, '유효한 전화번호를 입력하세요.');
                return false;
            }
        }

        // 체크박스 검사
        if (input.type === 'checkbox' && input.hasAttribute('required') && !input.checked) {
            const formCheck = input.closest('.form-check');
            if (formCheck) {
                formCheck.classList.add('is-invalid');
            }
            return false;
        }

        clearError(input);
        return true;
    };

    /**
     * 오류 메시지 표시
     * @param {HTMLElement} input - 입력 요소
     * @param {string} message - 오류 메시지
     */
    const showError = (input, message) => {
        input.classList.add('is-invalid');

        // 기존 오류 메시지 제거
        let errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }

        // 새 오류 메시지 생성
        errorElement = document.createElement('div');
        errorElement.className = 'error-message text-red-500 text-sm mt-1';
        errorElement.textContent = message;

        // 입력 요소 뒤에 오류 메시지 삽입
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    };

    /**
     * 오류 메시지 제거
     * @param {HTMLElement} input - 입력 요소
     */
    const clearError = (input) => {
        input.classList.remove('is-invalid');

        // 오류 메시지 제거
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }

        // 체크박스 오류 제거
        if (input.type === 'checkbox') {
            const formCheck = input.closest('.form-check');
            if (formCheck) {
                formCheck.classList.remove('is-invalid');
            }
        }
    };

    // 입력 필드 변경 시 유효성 검사
    const handleInputChange = (e) => {
        validateInput(e.target);
    };

    // 모든 입력 요소에 이벤트 리스너 추가
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', handleInputChange);
        input.addEventListener('input', handleInputChange);

        // 체크박스는 change 이벤트 사용
        if (input.type === 'checkbox') {
            input.addEventListener('change', handleInputChange);
        }
    });

    // 폼 제출 처리
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 모든 필드 유효성 검사
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            // 로딩 상태 표시
            const submitBtn = contactForm.querySelector('.submit-btn');
            const submitBtnText = submitBtn.querySelector('span');
            const submitBtnIcon = submitBtn.querySelector('i');

            submitBtnText.textContent = '제출 중...';
            submitBtnIcon.className = 'fas fa-spinner fa-spin';
            submitBtn.disabled = true;

            // 폼 제출 (실제로는 AJAX나 Fetch API 사용)
            setTimeout(() => {
                // 성공 메시지 표시
                alert('문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.');

                // 폼 초기화
                contactForm.reset();

                // 버튼 상태 복원
                submitBtnText.textContent = '문의 제출';
                submitBtnIcon.className = 'fas fa-paper-plane';
                submitBtn.disabled = false;

                // 오류 메시지 모두 제거
                document.querySelectorAll('.error-message').forEach(errorMsg => {
                    errorMsg.remove();
                });
            }, 1500);
        } else {
            // 첫 번째 오류 필드로 스크롤
            const firstErrorField = contactForm.querySelector('.is-invalid');
            if (firstErrorField) {
                firstErrorField.focus();
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
};

/**
 * 개인정보 처리방침 모달 기능
 */
const initPrivacyModal = () => {
    const privacyBtn = document.getElementById('privacyBtn');
    const privacyModal = document.getElementById('privacyModal');
    const closeModal = document.getElementById('closeModal');

    if (!privacyBtn || !privacyModal) return;

    // 모달 열기
    privacyBtn.addEventListener('click', () => {
        privacyModal.classList.add('open');
        document.body.classList.add('overflow-hidden');
    });

    // 모달 닫기
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            privacyModal.classList.remove('open');
            document.body.classList.remove('overflow-hidden');
        });
    }

    // 모달 바깥 클릭 시 닫기
    privacyModal.addEventListener('click', (e) => {
        if (e.target === privacyModal) {
            privacyModal.classList.remove('open');
            document.body.classList.remove('overflow-hidden');
        }
    });

    // ESC 키 눌러서 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && privacyModal.classList.contains('open')) {
            privacyModal.classList.remove('open');
            document.body.classList.remove('overflow-hidden');
        }
    });
};

/**
 * 폼 관련 모든 기능 초기화
 */
export const initForms = () => {
    initContactForm();
    initPrivacyModal();
};

// 문서 로드 완료 시 폼 초기화
document.addEventListener('DOMContentLoaded', initForms);