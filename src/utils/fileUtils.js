// 文件工具
export function downloadFile(file) {
  console.log('下载文件:', file);
  
  // 创建一个临时的a标签用于下载
  const link = document.createElement('a');
  link.href = file.url || file.preview;
  
  // 如果是文件对象，设置download属性
  if (typeof file === 'object' && file.name) {
    link.download = file.name;
  }
  
  // 将a标签添加到dom中并触发点击
  document.body.appendChild(link);
  link.click();
  
  // 移除a标签
  document.body.removeChild(link);
}

export function previewFile(file) {
  console.log('预览文件:', file);
  
  // 创建一个临时的iframe用于预览
  const preview = document.createElement('iframe');
  preview.src = typeof file === 'string' ? file : (file.url || file.preview);
  preview.style.position = 'fixed';
  preview.style.top = '0';
  preview.style.left = '0';
  preview.style.width = '100%';
  preview.style.height = '100%';
  preview.style.border = 'none';
  preview.style.zIndex = '9999';
  
  // 添加关闭按钮
  const closeBtn = document.createElement('button');
  closeBtn.innerText = '关闭预览';
  closeBtn.style.position = 'fixed';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '10px';
  closeBtn.style.zIndex = '10000';
  closeBtn.style.padding = '8px 12px';
  closeBtn.style.backgroundColor = '#ff4081';
  closeBtn.style.color = 'white';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '4px';
  closeBtn.style.cursor = 'pointer';
  
  // 关闭预览的方法
  const closePreview = () => {
    document.body.removeChild(preview);
    document.body.removeChild(closeBtn);
  };
  
  // 绑定关闭事件
  closeBtn.addEventListener('click', closePreview);
  
  // 添加元素到dom
  document.body.appendChild(preview);
  document.body.appendChild(closeBtn);
}