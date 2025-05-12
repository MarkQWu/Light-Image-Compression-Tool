// 获取DOM元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const controls = document.getElementById('controls');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalInfo = document.getElementById('originalInfo');
const compressedInfo = document.getElementById('compressedInfo');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = null;

// 点击上传区域触发文件选择
dropZone.addEventListener('click', () => {
    fileInput.click();
});

// 处理文件拖拽
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#0071e3';
    dropZone.style.backgroundColor = '#f5f5f7';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#ccc';
    dropZone.style.backgroundColor = 'white';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#ccc';
    dropZone.style.backgroundColor = 'white';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
    }
});

// 处理文件选择
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

// 处理图片上传
function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage = new Image();
        originalImage.src = e.target.result;
        originalImage.onload = () => {
            // 显示原图
            originalPreview.src = originalImage.src;
            originalInfo.textContent = `尺寸: ${originalImage.width}x${originalImage.height} | 大小: ${formatFileSize(file.size)}`;
            
            // 显示预览区域和控制区域
            previewContainer.style.display = 'flex';
            controls.style.display = 'block';
            
            // 压缩图片
            compressImage();
        };
    };
    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布尺寸
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    
    // 绘制图片
    ctx.drawImage(originalImage, 0, 0);
    
    // 压缩
    const quality = qualitySlider.value / 100;
    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    
    // 显示压缩后的图片
    compressedPreview.src = compressedDataUrl;
    
    // 计算压缩后的大小
    const compressionRatio = Math.round((1 - getBase64Size(compressedDataUrl) / getBase64Size(originalImage.src)) * 100);
    compressedInfo.textContent = `尺寸: ${originalImage.width}x${originalImage.height} | 压缩率: ${compressionRatio}%`;
}

// 监听质量滑块变化
qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = e.target.value + '%';
    if (originalImage) {
        compressImage();
    }
});

// 下载压缩后的图片
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = '压缩后的图片.jpg';
    link.href = compressedPreview.src;
    link.click();
});

// 工具函数：格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 工具函数：获取base64图片大小
function getBase64Size(base64String) {
    const padding = base64String.endsWith('==') ? 2 : 1;
    return (base64String.length * (3/4)) - padding;
} 