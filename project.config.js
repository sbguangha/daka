/**
 * 项目配置文件
 * 用于自动化脚本和工具的配置
 */

module.exports = {
    // 项目基本信息
    project: {
        name: "每日打卡",
        description: "一个简洁优雅的每日打卡应用，帮助你养成良好的习惯，追踪个人成长进度。",
        version: "1.0.0",
        author: "葛勇攀",
        email: "2577388908@qq.com",
        repository: "https://github.com/sbguangha/daka.git",
        homepage: "https://sbguangha.github.io/daka/"
    },

    // 文档配置
    docs: {
        // 需要自动更新的文档文件
        autoUpdate: [
            "README.md",
            "docs/CHANGELOG.md",
            "package.json"
        ],
        
        // 文档模板
        templates: {
            readme: {
                sections: [
                    "功能特点",
                    "快速开始", 
                    "项目结构",
                    "技术栈",
                    "使用指南",
                    "贡献",
                    "开源协议"
                ]
            },
            changelog: {
                format: "keepachangelog",
                categories: ["新增", "变更", "修复", "移除"]
            }
        }
    },

    // 构建配置
    build: {
        // 需要包含在发布中的文件
        includeFiles: [
            "index.html",
            "app.js", 
            "cloud-storage.js",
            "data-sync.js",
            "README.md",
            "LICENSE"
        ],
        
        // 需要排除的文件
        excludeFiles: [
            "test.html",
            "demo.html",
            "scripts/",
            ".github/",
            "docs/CONTRIBUTING.md",
            "docs/API.md"
        ]
    },

    // 部署配置
    deploy: {
        // GitHub Pages 配置
        githubPages: {
            branch: "gh-pages",
            folder: "./",
            exclude: [
                ".github",
                "scripts", 
                "docs/CONTRIBUTING.md",
                "docs/API.md"
            ]
        },
        
        // 其他部署选项
        platforms: {
            vercel: true,
            netlify: true,
            surge: true
        }
    },

    // 开发配置
    development: {
        // 本地服务器配置
        server: {
            port: 8000,
            host: "localhost",
            openBrowser: true
        },
        
        // 监听文件变化
        watch: [
            "*.html",
            "*.js",
            "*.css"
        ]
    },

    // 质量检查配置
    quality: {
        // 代码检查
        linting: {
            javascript: {
                enabled: true,
                rules: "recommended"
            },
            html: {
                enabled: true,
                validateAccessibility: true
            },
            css: {
                enabled: true,
                checkCompatibility: true
            }
        },
        
        // 性能检查
        performance: {
            lighthouse: {
                enabled: true,
                thresholds: {
                    performance: 90,
                    accessibility: 95,
                    bestPractices: 90,
                    seo: 90
                }
            }
        }
    },

    // 自动化配置
    automation: {
        // 文档更新触发条件
        docUpdateTriggers: [
            "package.json 版本变更",
            "主要文件修改",
            "新功能添加",
            "Bug 修复"
        ],
        
        // 发布触发条件
        releaseTriggers: [
            "feat: 新功能",
            "BREAKING CHANGE: 破坏性变更",
            "版本号变更"
        ],
        
        // 通知配置
        notifications: {
            email: false,
            slack: false,
            discord: false
        }
    },

    // 功能特性配置
    features: {
        // 当前启用的功能
        enabled: [
            "多项目打卡",
            "进度可视化", 
            "连续打卡统计",
            "历史记录查看",
            "数据统计分析",
            "云端同步",
            "数据导入导出",
            "响应式设计",
            "深色模式",
            "Hover Card"
        ],
        
        // 计划中的功能
        planned: [
            "PWA 支持",
            "推送通知",
            "数据可视化图表",
            "社交分享",
            "多语言支持",
            "自定义主题"
        ]
    },

    // 技术栈信息
    techStack: {
        frontend: {
            core: ["HTML5", "CSS3", "JavaScript ES6+"],
            frameworks: ["Tailwind CSS"],
            libraries: ["Lucide Icons"],
            tools: ["VS Code", "Git"]
        },
        
        backend: {
            storage: ["localStorage", "云存储"],
            apis: ["自定义 API"]
        },
        
        deployment: {
            platforms: ["GitHub Pages", "Vercel", "Netlify"],
            ci: ["GitHub Actions"]
        }
    },

    // 浏览器支持
    browserSupport: {
        minimum: {
            chrome: "80",
            firefox: "75", 
            safari: "13",
            edge: "80"
        },
        
        features: {
            localStorage: "required",
            fetch: "required",
            es6: "required",
            css3: "required"
        }
    }
};
