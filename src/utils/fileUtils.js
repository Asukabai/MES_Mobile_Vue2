import SensorRequest from './SensorRequest';
import router from "@/router";

// 文件工具
export async function downloadFile(file) {
  console.log('下载文件:', file);
  try {
    // 获取临时下载URL
    const url = await getTemporaryUrl(file.File_Name, file.File_Md5);
    // 跳转到预览页面，并传递URL和文件名作为参数
    await router.push({
      path: '/sensor_ddingWork/Release/download',
      query: {
        fileUrl: url,
        fileName: file.File_Name
      }
    });
  } catch (error) {
    console.error('下载文件失败:', error);
    alert('文件下载失败，请稍后重试');
  }
}

export async function previewFile(file) {
  console.log('预览文件:', file);

  // 检查是否为移动端
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (!isMobile) {
    alert('暂不支持PC端预览 !');
    return;
  }

  // 获取文件后缀名
  const fileName = file.File_Name;
  const fileExt = fileName.split('.').pop().toLowerCase();

  // 定义不支持预览的文件类型
  const unsupportedExtensions = [
    'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', // 视频格式
    'zip', 'rar', '7z', 'tar', 'gz', 'bz2', // 压缩包格式
    'exe', 'msi', 'apk', 'jar','dll',// 可执行文件
    'iso', 'img', 'dmg' // 镜像文件
  ];

  if (unsupportedExtensions.includes(fileExt)) {
    alert(`当前不支持预览 ${fileExt} 格式的文件 !`);
    return;
  }

  try {
    // 获取临时预览URL
    const url = await getTemporaryUrl(file.File_Name, file.File_Md5);
    // 跳转到下载页面，并传递URL和文件名作为参数
    await router.push({
      path: '/sensor_ddingWork/Release/dd-preview',
      query: {
        fileUrl: url,
        fileName: file.File_Name
      }
    });
  } catch (error) {
    console.error('预览文件失败:', error);
    alert('文件预览失败，请稍后重试'+error);
  }
}

// 获取临时URL的函数
function getTemporaryUrl(fileName, fileMd5) {
  return new Promise((resolve, reject) => {
    if (!fileName || !fileMd5) {
      reject(new Error('文件名或MD5值缺失'));
      return;
    }

    const param = {
      remoteLocation: fileMd5
    };
    SensorRequest.Minio_PresignedDownloadUrl5B(
        JSON.stringify(param),
        (respData) => {
          console.log("预览页面 respData :"+respData)
          try {
            if (respData) {
              const modifiedUrl = respData.replace(
                  // 将URL中的http://127.0.0.1:9000替换为https://api-v2.sensor-smart.cn:22027
                  'http://127.0.0.1:9000',
                  'https://api-v2.sensor-smart.cn:22027'
              );
              resolve(modifiedUrl);
            } else {
              reject(new Error('未能获取有效的文件URL'));
            }
          } catch (error) {
            reject(new Error('解析响应数据失败'));
          }
        },
        (error) => {
          reject(new Error('请求临时URL失败: ' + error));
        }
    );
  });
}
