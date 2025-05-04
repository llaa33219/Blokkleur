document.addEventListener('DOMContentLoaded', () => {
    const themeSelect = document.getElementById('theme');
    const colorInput = document.getElementById('color');
    const customContainer = document.getElementById('customColorContainer');
    const applyBtn = document.getElementById('apply');
  
    // 저장된 설정 불러오기
    chrome.storage.sync.get(['theme', 'color'], (data) => {
      if (data.theme) themeSelect.value = data.theme;
      if (data.color) colorInput.value = data.color;
      customContainer.style.display = themeSelect.value === 'custom' ? 'block' : 'none';
    });
  
    // 테마 변경 시 컬러 피커 노출 제어
    themeSelect.addEventListener('change', () => {
      // ⬅️ 수정됨: 'neon'도 컬러 선택 가능하게
      customContainer.style.display = (themeSelect.value === 'custom' || themeSelect.value === 'neon') ? 'block' : 'none';
    });
    
    // 적용 버튼
    applyBtn.addEventListener('click', () => {
      const selectedTheme = themeSelect.value;
      const selectedColor = colorInput.value;
      // 저장 후 팝업 닫기 → content.js에서 자동 적용
      chrome.storage.sync.set({ theme: selectedTheme, color: selectedColor }, () => {
        window.close();
      });
    });
  });
  