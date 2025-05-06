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

    let currentSlide = 0;
    let isEditorCollapsed = false;
    let isFullscreen = false;

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

使用 Markdown 製作簡報

---

## 第二頁

- 支援基本 Markdown 語法
- 使用 \`---\` 分隔每一頁
- 即時預覽

---

## 程式碼展示

\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

---

## 清單展示

1. 第一項
2. 第二項
3. 第三項

---

## 結束

感謝使用！`;

    markdownInput.value = defaultMarkdown;

    // 將 Markdown 轉換為 HTML 並分割成投影片
    function convertToSlides(markdown) {
        // 使用 --- 分割投影片
        const slideTexts = markdown.split('\n---\n');
        slides = slideTexts.map(text => {
            const div = document.createElement('div');
            div.className = 'slide';
            div.innerHTML = marked.parse(text.trim());
            return div;
        });

        updateSlideView();
    }

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