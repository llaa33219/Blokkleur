// 스타일 적용 함수
function applyStyle({ theme, color }) {
  const STYLE_ID = 'css-filter-switcher-style';
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();

  const styleEl = document.createElement('style');
  styleEl.id = STYLE_ID;

  let css = '';
  switch (theme) {
    case 'none':
      css = ``;
      break;
    case 'cave':
      css = `.block { filter: brightness(90%); }`;
      break;
    case 'shadow':
      css = `
        .svgBlockGroup, .blockMenu {
          filter: drop-shadow(2px 4px 6px black);
        }
      `;
      break;
    case 'darkmode':
      css = `
        .svgBlockGroup, .blockMenu {
          filter: saturate(0.5);
        }
      `;
      break;
    case 'rainbow':
      css = `
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .svgBlockGroup, .blockMenu {
          animation: rainbow 5s infinite;
        }
      `;
      break;
    case 'grayscale':
      css = `
        .svgBlockGroup, .blockMenu {
          filter: grayscale(1);
        }
      `;
      break;
    case 'blur':
      css = `
        .svgBlockGroup, .blockMenu {
          filter: blur(1px);
        }
      `;
      break;
    case 'custom':
      // 커스텀 색상: 내부 색감에만 적용되도록 hue-rotate + opacity 활용
      css = `
        .svgBlockGroup, .blockMenu {
          /* 색조 변경: 선택한 color 값에 근접한 색으로 hue-rotate */
          filter: hue-rotate(0deg) saturate(2) opacity(0.8) drop-shadow(0 0 0 ${color});
        }
      `;
      break;
    case 'neon':
      // ⬅️ 수정됨: 선택한 color로 네온 glow 효과 적용
      css = `
        .svgBlockGroup, .blockMenu {
          filter:
            drop-shadow(0 0 5px ${color});
        }
      `;
      break;
    case 'shake':
      // 흔들림 애니메이션
      css = `
        @keyframes shake {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(-2px, 0); }
          50%  { transform: translate(2px, 0); }
          75%  { transform: translate(-2px, 0); }
          100% { transform: translate(2px, 0); }
        }
        .svgBlockGroup, .blockMenu {
          animation: shake 0.5s infinite;
        }
      `;
      break;
    case '3d':
      // 3d 효과
      css = `
        @keyframes subtle3d {
          0%   { transform: perspective(600px) rotateY(0deg); }
          50%  { transform: perspective(600px) rotateY(15deg); } /* Adjusted rotation and perspective */
          100% { transform: perspective(600px) rotateY(0deg); }
        }
        .svgBlockGroup, .blockMenu {
          animation: subtle3d 4s infinite ease-in-out; /* Adjusted duration */
        }
      `;
      break;
    case 'glitch':
      // 글리치 효과
      css = `
        @keyframes glitch-anim {
          0% { transform: translate(0) skew(0deg); clip-path: inset(${Math.random()*100}% 0 ${Math.random()*100}% 0); }
          20% { transform: translate(${Math.random()*5-2.5}px, ${Math.random()*3-1.5}px) skew(${Math.random()*2-1}deg); clip-path: inset(${Math.random()*100}% 0 ${Math.random()*100}% 0); }
          40% { transform: translate(${Math.random()*5-2.5}px, ${Math.random()*3-1.5}px) skew(${Math.random()*2-1}deg); clip-path: inset(${Math.random()*100}% 0 ${Math.random()*100}% 0); }
          60% { transform: translate(${Math.random()*5-2.5}px, ${Math.random()*3-1.5}px) skew(${Math.random()*2-1}deg); opacity: ${0.8 + Math.random()*0.2}; }
          80% { transform: translate(${Math.random()*5-2.5}px, ${Math.random()*3-1.5}px) skew(${Math.random()*2-1}deg); opacity: ${0.8 + Math.random()*0.2}; }
          100% { transform: translate(0) skew(0deg); }
        }
        .svgBlockGroup, .blockMenu {
          position: relative;
          animation: glitch-anim ${0.3 + Math.random()*0.4}s infinite;
          animation-timing-function: steps(${Math.floor(Math.random()*3)+2}, end);
          transform-origin: center;
        }
      `;
      break;
    case 'Left/Right-Inversion':
      // 좌우 반전 효과
      css = `
        .svgBlockGroup, .blockMenu {
          transform-origin: center; /* 중앙 기준 설정 */
          transform: scaleX(-1) !important; /* 좌우 반전 */
        }
      `;
      break;
    case 'No-text':
      css = `
        .block g text {

          display: none !important; /* 텍스트 숨김 */
        }
      `;
      break;
    case '3d-shake':
      css = `
        @keyframes gentle3dshake {
          0%   { transform: rotate3d(0, 1, 0.5, 0deg); }
          25%  { transform: rotate3d(0.2, 1, 0.5, 90deg); }
          50%  { transform: rotate3d(0.2, 1, 0.5, 180deg); }
          75%  { transform: rotate3d(0.2, 1, 0.5, 270deg); }
          100% { transform: rotate3d(0, 1, 0.5, 360deg); }
        }
        .svgBlockGroup, .blockMenu {
          transform-style: preserve-3d;
          perspective: 800px;
          animation: gentle3dshake 4s infinite linear;
          transform-origin: center center;
        }
      `;
      break;
    default:
      css = '';
  }

  styleEl.textContent = css;
  document.head.appendChild(styleEl);
}

// 초기 로드 시 저장된 설정 적용
chrome.storage.sync.get(['theme', 'color'], (data) => {
  applyStyle({ theme: data.theme, color: data.color });
});

// 설정 변경 시 실시간 적용
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && (changes.theme || changes.color)) {
    chrome.storage.sync.get(['theme', 'color'], (data) => {
      applyStyle({ theme: data.theme, color: data.color });
    });
  }
});
