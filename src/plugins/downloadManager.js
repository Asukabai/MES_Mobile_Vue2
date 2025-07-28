const DEFAULT_TIMEOUT = 3000

const downloadManager = {
    install(Vue) {
        const DownloadManager = new Vue({
            data() {
                return {
                    tasks: [],
                    visible: false,
                    minimized: false
                }
            },
            methods: {
                addTask(id, fileName) {
                    this.tasks.push({ id, fileName, status: '准备中', progress: 0 })
                },
                updateTask(id, status, progress) {
                    const task = this.tasks.find(t => t.id === id)
                    if (task) {
                        task.status = status
                        task.progress = progress
                    }
                },
                finishTask(id, finalStatus = '下载完成') {
                    const task = this.tasks.find(t => t.id === id)
                    if (task) {
                        task.status = finalStatus
                        task.progress = 100

                        setTimeout(() => {
                            this.tasks = this.tasks.filter(t => t.id !== id)
                            if (this.tasks.length === 0) {
                                this.visible = false
                            }
                        }, DEFAULT_TIMEOUT)
                    }
                },
                show() {
                    this.visible = true
                    this.minimized = false
                    // 同步到全局组件中
                    if (this.$root && this.$root.panelVisible !== undefined) {
                        this.$root.panelVisible = true
                    }
                },
                hide() {
                    this.visible = false
                    if (this.$root && this.$root.panelVisible !== undefined) {
                        this.$root.panelVisible = false
                    }
                }
            }
        })

        // 👇 正确挂载为响应式对象
        Vue.prototype.$downloadManager = {
            get tasks() {
                return DownloadManager.tasks
            },
            addDownloadTask(id, fileName) {
                DownloadManager.addTask(id, fileName)
                DownloadManager.show()
            },
            updateDownloadTask(id, status, progress) {
                DownloadManager.updateTask(id, status, progress)
            },
            finishDownloadTask(id, finalStatus) {
                DownloadManager.finishTask(id, finalStatus)
            }
        }

        // 👇 全局注册组件（同步导入）
        const DownloadPanel = require('../components/DownloadPanel.vue').default
        Vue.component('DownloadPanel', DownloadPanel)
    }
}

export default downloadManager
