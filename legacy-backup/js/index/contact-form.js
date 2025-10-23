// contact-form.js - 문의 폼 기능

/**
 * 문의 폼 기능 초기화
 */
export const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    const fieldCategory = document.getElementById('category');

    if (!contactForm) return;

    /**
     * 입력값 유효성 검사
     * @param {HTMLInputElement|HTMLTextAreaElement} field - 입력 필드
     * @returns {boolean} - 유효성 여부
     */
    const validateField = (field) => {
        // 값이 없는 경우 (필수 필드만)
        if (field.required && !field.value.trim()) {
            showError(field, '필수 입력 항목입니다.');
            return false;
        }

        // 이메일 형식 검사
        if (field.type === 'email' && field.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(field.value.trim())) {
                showError(field, '유효한 이메일 주소를 입력하세요.');
                return false;
            }
        }

        // 전화번호 형식 검사
        if (field.id === 'phone' && field.value.trim()) {
            const phonePattern = /^[0-9]{2,3}-?[0-9]{3,4}-?[0-9]{4}$/;
            if (!phonePattern.test(field.value.trim().replace(/-/g, ''))) {
                showError(field, '유효한 전화번호를 입력하세요.');
                return false;
            }
        }

        clearError(field);
        return true;
    };

    /**
     * 오류 메시지 표시
     * @param {HTMLElement} field - 입력 필드
     * @param {string} message - 오류 메시지
     */
    const showError = (field, message) => {
        // 필드에 오류 스타일 추가
        field.classList.add('is-invalid');

        // 기존 오류 메시지 제거
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // 새 오류 메시지 생성
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;

        // 오류 메시지 삽입
        field.parentElement.appendChild(errorElement);
    };

    /**
     * 오류 메시지 제거
     * @param {HTMLElement} field - 입력 필드
     */
    const clearError = (field) => {
        field.classList.remove('is-invalid');

        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    };

    /**
     * 전화번호 자동 하이픈 추가
     * @param {HTMLInputElement} input - 전화번호 입력 필드
     */
    const formatPhoneNumber = (input) => {
        let value = input.value.replace(/[^0-9]/g, '');

        if (value.length > 3 && value.length <= 7) {
            // 000-0000 형식
            value = value.replace(/(\d{3})(\d+)/, '$1-$2');
        } else if (value.length > 7) {
            // 000-0000-0000 형식
            value = value.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
        }

        input.value = value;
    };

    // 전화번호 필드에 자동 하이픈 이벤트 등록
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', () => formatPhoneNumber(phoneField));
    }

    // 폼 제출 이벤트
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 모든 입력 필드 가져오기
        const fields = contactForm.querySelectorAll('input, textarea, select');

        // 유효성 검사
        let isValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        // 동의 체크박스 검사
        const consentCheckbox = document.getElementById('consent');
        if (consentCheckbox && !consentCheckbox.checked) {
            showError(consentCheckbox, '개인정보 수집 및 이용에 동의해주세요.');
            isValid = false;
        }

        if (isValid) {
            // 제출 버튼 상태 변경
            const submitBtn = contactForm.querySelector('.form-submit-btn');
            const submitText = submitBtn.querySelector('span');
            const submitIcon = submitBtn.querySelector('i');

            submitBtn.disabled = true;
            submitText.textContent = '제출 중...';
            submitIcon.className = 'fas fa-spinner fa-spin form-submit-icon';

            // 폼 데이터 수집
            const formData = new FormData(contactForm);
            const formDataObj = Object.fromEntries(formData.entries());

            // 실제로는 서버에 AJAX 요청을 보내야 하지만, 예시로 setTimeout 사용
            setTimeout(() => {
                // 성공 메시지 표시
                alert('문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.');

                // 폼 초기화
                contactForm.reset();

                // 버튼 상태 복구
                submitBtn.disabled = false;
                submitText.textContent = '문의 제출';
                submitIcon.className = 'fas fa-paper-plane form-submit-icon';

                console.log('제출된 데이터:', formDataObj);
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

    // 폼 필드 변경 시 실시간 유효성 검사
    const fields = contactForm.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));

        // 입력 중에는 오류 메시지 제거
        field.addEventListener('input', () => {
            if (field.classList.contains('is-invalid')) {
                clearError(field);
            }
        });
    });

    // 개인정보처리방침 모달 기능
    const privacyBtn = document.getElementById('privacyBtn');
    const privacyModal = document.getElementById('privacyModal');
    const closeModal = document.getElementById('closeModal');

    if (privacyBtn && privacyModal) {
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
    }
};

/**
 * 문서 로드 완료 시 초기화
 */
document.addEventListener('DOMContentLoaded', initContactForm);