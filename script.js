document.addEventListener('DOMContentLoaded', function() {
    const markdownInput = document.getElementById('markdownInput');
    const slidePreview = document.getElementById('slidePreview');
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    const slideNumber = document.getElementById('slideNumber');
    const toggleEditorBtn = document.getElementById('toggleEditor');
    const fullscreenBtn = document.getElementById('fullscreen');
    const editorSection = document.querySelector('.editor-section');
    const previewSection = document.querySelector('.preview-section');
    const themeSelect = document.getElementById('themeSelect');
    const layoutSelect = document.getElementById('layoutSelect');

    let currentSlide = 0;
    let isEditorCollapsed = false;
    let isFullscreen = false;
    let currentTheme = 'default';
    let currentLayout = 'content';

    // 收合編輯器
    toggleEditorBtn.addEventListener('click', () => {
        isEditorCollapsed = !isEditorCollapsed;
        editorSection.classList.toggle('collapsed', isEditorCollapsed);
        toggleEditorBtn.textContent = isEditorCollapsed ? '🔄 展開編輯器' : '🔄 收合編輯器';
    });

    // 全螢幕預覽
    fullscreenBtn.addEventListener('click', () => {
        isFullscreen = !isFullscreen;
        previewSection.classList.toggle('fullscreen', isFullscreen);
        fullscreenBtn.textContent = isFullscreen ? '❌ 退出全螢幕' : '⛶ 全螢幕';
        
        if (isFullscreen) {
            // 全螢幕時自動收合編輯器
            editorSection.classList.add('collapsed');
            isEditorCollapsed = true;
            toggleEditorBtn.textContent = '🔄 展開編輯器';
        } else {
            // 退出全螢幕時展開編輯器
            editorSection.classList.remove('collapsed');
            isEditorCollapsed = false;
            toggleEditorBtn.textContent = '🔄 收合編輯器';
        }
    });

    // ESC 鍵退出全螢幕
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isFullscreen) {
            fullscreenBtn.click();
        }
    });
    let slides = [];

    // 設置默認的 Markdown 內容
    const defaultMarkdown = `# Markdown 簡報示例
## 使用 Markdown 製作簡報

---

# 功能特色

- 支援多種專業布局
- 豐富的主題選擇
- 完整的 Markdown 支援
- 即時預覽更新

---

# 左側內容 | # 右側內容

- 使用下拉選單
- 選擇布局風格
- 即時切換主題

| - 標題布局
| - 內容布局
| - 兩欄布局

---

# 程式碼展示

\`\`\`javascript
function createSlide() {
    return {
        layout: '自由切換',
        theme: '隨心所欲',
        effect: '專業美觀'
    };
}
\`\`\`

---

# 投影片主題

## 精美主題展示

1. 預設主題 - 簡潔大方
2. 深色主題 - 專業沉穩
3. 藍色主題 - 科技現代
4. 綠色主題 - 活力自然

---

# 開始使用！
## 讓你的簡報更出色`;

    markdownInput.value = defaultMarkdown;

    // 將 Markdown 轉換為 HTML 並分割成投影片
    function convertToSlides(markdown) {
        // 使用 --- 分割投影片
        const slideTexts = markdown.split('\n---\n');
        slides = slideTexts.map(text => {
            const div = document.createElement('div');
            div.className = 'slide';
            div.classList.add(`slide-layout-${currentLayout}`);
            div.classList.add(`theme-${currentTheme}`);

            // 創建內容容器
            const content = document.createElement('div');
            content.className = 'slide-content';
            content.innerHTML = marked.parse(text.trim());
            div.appendChild(content);
            
            return div;
        });

        updateSlideView();
    }

    // 主題切換處理
    themeSelect.addEventListener('change', (e) => {
        currentTheme = e.target.value;
        convertToSlides(markdownInput.value);
    });

    // 布局切換處理
    layoutSelect.addEventListener('change', (e) => {
        currentLayout = e.target.value;
        convertToSlides(markdownInput.value);
    });

    // 更新投影片視圖
    function updateSlideView() {
        if (slides.length === 0) return;

        // 確保 currentSlide 在有效範圍內
        currentSlide = Math.max(0, Math.min(currentSlide, slides.length - 1));

        // 清空預覽區域
        slidePreview.innerHTML = '';
        
        // 添加當前投影片
        const clonedSlide = slides[currentSlide].cloneNode(true);
        clonedSlide.classList.add('active');
        slidePreview.appendChild(clonedSlide);

        // 更新投影片編號
        slideNumber.textContent = `${currentSlide + 1} / ${slides.length}`;

        // 更新按鈕狀態
        prevButton.disabled = currentSlide === 0;
        nextButton.disabled = currentSlide === slides.length - 1;
    }

    // 即時更新預覽
    markdownInput.addEventListener('input', () => {
        convertToSlides(markdownInput.value);
    });

    // 上一頁按鈕
    prevButton.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlideView();
        }
    });

    // 下一頁按鈕
    nextButton.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            updateSlideView();
        }
    });

    // 鍵盤快捷鍵
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            prevButton.click();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            nextButton.click();
        }
    });

    // 初始化
    convertToSlides(markdownInput.value);
});