/**
 * 上传凭证工具类
 */
export default {
    /**
     * 处理单个文件，转换为 Base64 并生成 MD5
     * @param {Object} file - van-uploader 的 file 对象
     * @returns {Promise<Object>} 返回包含 File_Name, File_Base64, File_Md5, Upload_Time 的对象
     */
    async processSingleFile(file) {
        if (!file || !file.file || !(file.file instanceof File)) {
            console.warn('⚠️ 文件无效或不是 File 对象');
            return null;
        }

        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onload = (e) => {
                const base64 = e.target.result;

                // 生成简单的 MD5 值（可替换为更安全的库）
                const md5 = this.generateSimpleMd5(base64);

                resolve({
                    File_Name: file.file.name,
                    File_Base64: base64,
                    File_Md5: md5,
                    Upload_Time: new Date().toISOString()
                });
            };

            reader.onerror = () => {
                console.error('❌ 文件读取失败:', file.file.name);
                reject(new Error(`"${file.file.name}" 读取失败`));
            };

            reader.readAsDataURL(file.file);
        });
    },

    /**
     * 批量处理多个文件
     * @param {Array|Object} files - van-uploader 的 after-read 回调参数
     * @param {number} maxTotalSize - 总大小限制（字节）
     * @returns {Promise<Array>} 返回处理后的证据列表
     */
    async processFiles(files, maxTotalSize = 20 * 1024 * 1024) {
        if (!files) return [];

        const fileList = Array.isArray(files) ? files : [files];
        const processedList = [];
        let currentTotalSize = 0;

        for (const file of fileList) {
            // 校验单个文件大小
            if (file.file.size > maxTotalSize) {
                throw new Error(`"${file.file.name}" 文件过大，总大小不能超过 ${maxTotalSize / (1024 * 1024)}MB`);
            }

            // 检查总大小是否超限
            if (currentTotalSize + file.file.size > maxTotalSize) {
                throw new Error('总文件大小不能超过 ' + (maxTotalSize / (1024 * 1024)) + 'MB');
            }

            try {
                const result = await this.processSingleFile(file);
                if (result) {
                    processedList.push(result);
                    currentTotalSize += file.file.size;
                }
            } catch (error) {
                console.error('处理文件时出错:', error);
                throw error;
            }
        }

        return processedList;
    },

    /**
     * 等待所有文件加载完成
     * @param {number} timeout - 超时时间（毫秒）
     * @returns {Promise}
     */
    waitForAllImagesLoaded(evidenceList, fileList, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                if (evidenceList.length >= fileList.length) {
                    clearInterval(interval);
                    resolve();
                }

                if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error('等待文件加载超时'));
                }
            }, 200);
        });
    },

    /**
     * 生成简单 MD5（仅用于演示，生产建议使用 crypto-js 或类似库）
     * @param {string} str - 输入字符串
     * @returns {string} MD5 字符串
     */
    generateSimpleMd5(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash).toString(16);
    },

    /**
     * 重置上传状态
     * @param {Array} fileList - van-uploader 的文件列表
     * @param {Array} evidenceList - 处理后的证据数据
     */
    resetForm(fileList, evidenceList) {
        if (fileList && evidenceList) {
            fileList.splice(0, fileList.length);
            evidenceList.splice(0, evidenceList.length);
        }
    }
};
