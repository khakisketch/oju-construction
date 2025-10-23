#!/usr/bin/env node

/**
 * VERDI Template Project Initializer
 *
 * 새 외주 프로젝트를 시작할 때 프로젝트 정보를 입력받아
 * 모든 템플릿 파일의 {{변수}}를 실제 값으로 치환합니다.
 *
 * Usage: npm run init
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 색상 출력 헬퍼
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

// 프로젝트 루트 디렉토리
const projectRoot = path.resolve(__dirname, '../..');

// readline 인터페이스 생성
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 프롬프트 헬퍼
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(`${colors.blue}${question}${colors.reset}`, (answer) => {
      resolve(answer.trim());
    });
  });
}

// 기본값 생성 함수
function kebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toUpperSnakeCase(str) {
  return str
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// 메인 함수
async function main() {
  log('\n' + '='.repeat(60), colors.bright);
  log('  VERDI Template - Project Initializer', colors.bright);
  log('='.repeat(60) + '\n', colors.bright);

  logInfo('새 외주 프로젝트 정보를 입력해주세요.\n');

  try {
    // 1. 프로젝트 정보 수집
    const projectNameDisplay = await prompt('프로젝트 이름 (한글, 예: 클라이언트 컴퍼니): ');
    if (!projectNameDisplay) {
      throw new Error('프로젝트 이름은 필수입니다.');
    }

    const projectNameDefault = kebabCase(projectNameDisplay);
    const projectName = await prompt(`프로젝트 ID (영문, 기본: ${projectNameDefault}): `) || projectNameDefault;

    const companyName = await prompt(`회사명 (한글, 기본: ${projectNameDisplay}): `) || projectNameDisplay;

    const firebaseProjectIdDefault = `${projectName}-prod`;
    const firebaseProjectId = await prompt(`Firebase Project ID (기본: ${firebaseProjectIdDefault}): `) || firebaseProjectIdDefault;

    const contactEmailDefault = `contact@${projectName}.com`;
    const contactEmail = await prompt(`대표 이메일 (기본: ${contactEmailDefault}): `) || contactEmailDefault;

    const contactPhone = await prompt('대표 전화번호 (예: 02-1234-5678): ');
    if (!contactPhone) {
      throw new Error('대표 전화번호는 필수입니다.');
    }

    // 2. 템플릿 변수 맵핑
    const templateVars = {
      '{{PROJECT_NAME}}': projectName,
      '{{PROJECT_NAME_UPPER}}': toUpperSnakeCase(projectName),
      '{{PROJECT_NAME_DISPLAY}}': projectNameDisplay,
      '{{FIREBASE_PROJECT_ID}}': firebaseProjectId,
      '{{COMPANY_NAME}}': companyName,
      '{{CONTACT_EMAIL}}': contactEmail,
      '{{CONTACT_PHONE}}': contactPhone,
    };

    log('\n' + '-'.repeat(60), colors.bright);
    log('입력하신 정보:', colors.bright);
    log('-'.repeat(60), colors.bright);
    Object.entries(templateVars).forEach(([key, value]) => {
      log(`  ${key}: ${value}`);
    });
    log('-'.repeat(60) + '\n', colors.bright);

    const confirm = await prompt('위 정보로 프로젝트를 초기화하시겠습니까? (y/N): ');
    if (confirm.toLowerCase() !== 'y') {
      logWarning('초기화가 취소되었습니다.');
      rl.close();
      return;
    }

    log('');
    logInfo('프로젝트 초기화를 시작합니다...\n');

    // 3. 파일 치환 함수
    function replaceInFile(filePath, vars) {
      if (!fs.existsSync(filePath)) {
        return false;
      }

      let content = fs.readFileSync(filePath, 'utf8');
      let replaced = false;

      Object.entries(vars).forEach(([key, value]) => {
        if (content.includes(key)) {
          content = content.replace(new RegExp(key, 'g'), value);
          replaced = true;
        }
      });

      if (replaced) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
      }

      return false;
    }

    // 4. .env.local 생성
    logInfo('1. .env.local 파일 생성 중...');
    const envExamplePath = path.join(projectRoot, 'build-project/templates/config/.env.example');
    const envLocalPath = path.join(projectRoot, '.env.local');

    if (fs.existsSync(envLocalPath)) {
      logWarning('   .env.local 파일이 이미 존재합니다. 백업 생성...');
      fs.copyFileSync(envLocalPath, `${envLocalPath}.backup`);
    }

    fs.copyFileSync(envExamplePath, envLocalPath);
    replaceInFile(envLocalPath, templateVars);
    logSuccess('   .env.local 파일이 생성되었습니다.');

    // 5. package.json 업데이트
    logInfo('2. package.json 업데이트 중...');
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    packageJson.name = projectName;
    packageJson.description = `${projectNameDisplay} - Built with VERDI Template`;

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
    logSuccess('   package.json이 업데이트되었습니다.');

    // 6. .firebaserc 생성
    logInfo('3. .firebaserc 파일 생성 중...');
    const firebasercPath = path.join(projectRoot, '.firebaserc');
    const firebasercContent = {
      projects: {
        default: firebaseProjectId
      }
    };
    fs.writeFileSync(firebasercPath, JSON.stringify(firebasercContent, null, 2) + '\n', 'utf8');
    logSuccess('   .firebaserc 파일이 생성되었습니다.');

    // 7. src/shared/config/constants.ts 업데이트 (있는 경우)
    logInfo('4. constants.ts 파일 업데이트 중...');
    const constantsPath = path.join(projectRoot, 'src/shared/config/constants.ts');
    if (fs.existsSync(constantsPath)) {
      replaceInFile(constantsPath, templateVars);
      logSuccess('   constants.ts 파일이 업데이트되었습니다.');
    } else {
      logWarning('   constants.ts 파일이 없습니다. 건너뜀.');
    }

    // 8. 완료
    log('\n' + '='.repeat(60), colors.green);
    logSuccess('프로젝트 초기화가 완료되었습니다! 🎉');
    log('='.repeat(60) + '\n', colors.green);

    log('다음 단계:', colors.bright);
    log('  1. Firebase Console에서 프로젝트 생성:');
    log(`     https://console.firebase.google.com/`);
    log(`     프로젝트 ID: ${firebaseProjectId}\n`);
    log('  2. Firebase 설정 정보를 .env.local에 추가');
    log('     (NEXT_PUBLIC_FIREBASE_API_KEY 등)\n');
    log('  3. Firebase 로그인 및 프로젝트 연결:');
    log('     firebase login');
    log(`     firebase use ${firebaseProjectId}\n`);
    log('  4. 개발 서버 실행:');
    log('     npm run dev\n');

  } catch (error) {
    logError(`\n오류 발생: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// 스크립트 실행
main();
