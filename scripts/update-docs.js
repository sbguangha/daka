#!/usr/bin/env node

/**
 * 自动更新文档脚本
 * 根据项目变化自动更新 README.md, CHANGELOG.md 等文档
 */

const fs = require('fs');
const path = require('path');

class DocumentUpdater {
    constructor() {
        this.projectRoot = path.join(__dirname, '..');
        this.packageJson = this.loadPackageJson();
        this.currentVersion = this.packageJson.version;
    }

    loadPackageJson() {
        try {
            const packagePath = path.join(this.projectRoot, 'package.json');
            return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        } catch (error) {
            console.error('无法读取 package.json:', error);
            return {};
        }
    }

    // 分析项目文件变化
    analyzeProjectChanges() {
        const changes = {
            newFiles: [],
            modifiedFiles: [],
            deletedFiles: [],
            features: [],
            fixes: [],
            breaking: []
        };

        // 检查主要文件
        const mainFiles = ['index.html', 'app.js', 'cloud-storage.js', 'data-sync.js'];
        
        mainFiles.forEach(file => {
            const filePath = path.join(this.projectRoot, file);
            if (fs.existsSync(filePath)) {
                const stats = fs.statSync(filePath);
                const lastModified = stats.mtime;
                
                // 如果文件在最近24小时内修改过
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                if (lastModified > oneDayAgo) {
                    changes.modifiedFiles.push({
                        file: file,
                        lastModified: lastModified
                    });
                }
            }
        });

        return changes;
    }

    // 分析代码变化类型
    analyzeCodeChanges(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const changes = {
                features: [],
                fixes: [],
                improvements: []
            };

            // 简单的关键词分析
            const lines = content.split('\n');
            lines.forEach((line, index) => {
                const comment = line.trim();
                
                if (comment.includes('// 新增') || comment.includes('// 添加')) {
                    changes.features.push({
                        line: index + 1,
                        description: comment.replace(/\/\/\s*/, '')
                    });
                }
                
                if (comment.includes('// 修复') || comment.includes('// 修正')) {
                    changes.fixes.push({
                        line: index + 1,
                        description: comment.replace(/\/\/\s*/, '')
                    });
                }
                
                if (comment.includes('// 优化') || comment.includes('// 改进')) {
                    changes.improvements.push({
                        line: index + 1,
                        description: comment.replace(/\/\/\s*/, '')
                    });
                }
            });

            return changes;
        } catch (error) {
            console.error(`分析文件 ${filePath} 失败:`, error);
            return { features: [], fixes: [], improvements: [] };
        }
    }

    // 更新 README.md
    updateReadme() {
        const readmePath = path.join(this.projectRoot, 'README.md');
        
        try {
            let content = fs.readFileSync(readmePath, 'utf8');
            
            // 更新版本号
            content = content.replace(
                /!\[版本\]\(https:\/\/img\.shields\.io\/badge\/版本-v[\d\.]+/g,
                `![版本](https://img.shields.io/badge/版本-v${this.currentVersion}`
            );
            
            // 更新最后更新时间
            const now = new Date().toLocaleDateString('zh-CN');
            content = content.replace(
                /(最后更新：)[\d\-\/]+/g,
                `$1${now}`
            );
            
            // 如果没有最后更新时间，添加一个
            if (!content.includes('最后更新：')) {
                content = content.replace(
                    /(# 🎯 每日打卡网站)/,
                    `$1\n\n> 最后更新：${now}`
                );
            }
            
            fs.writeFileSync(readmePath, content, 'utf8');
            console.log('✅ README.md 已更新');
            
        } catch (error) {
            console.error('更新 README.md 失败:', error);
        }
    }

    // 更新 CHANGELOG.md
    updateChangelog(changes) {
        const changelogPath = path.join(this.projectRoot, 'docs/CHANGELOG.md');
        
        try {
            let content = fs.readFileSync(changelogPath, 'utf8');
            
            // 如果有新的变化，添加到未发布部分
            if (changes.modifiedFiles.length > 0) {
                const today = new Date().toISOString().split('T')[0];
                let newEntry = `\n## [未发布] - ${today}\n\n`;
                
                if (changes.features.length > 0) {
                    newEntry += '### 新增\n';
                    changes.features.forEach(feature => {
                        newEntry += `- ${feature}\n`;
                    });
                    newEntry += '\n';
                }
                
                if (changes.fixes.length > 0) {
                    newEntry += '### 修复\n';
                    changes.fixes.forEach(fix => {
                        newEntry += `- ${fix}\n`;
                    });
                    newEntry += '\n';
                }
                
                // 在第一个版本之前插入
                content = content.replace(
                    /(## \[1\.0\.0\])/,
                    `${newEntry}$1`
                );
                
                fs.writeFileSync(changelogPath, content, 'utf8');
                console.log('✅ CHANGELOG.md 已更新');
            }
            
        } catch (error) {
            console.error('更新 CHANGELOG.md 失败:', error);
        }
    }

    // 更新 package.json 中的文件列表
    updatePackageFiles() {
        try {
            const files = fs.readdirSync(this.projectRoot);
            const importantFiles = files.filter(file => {
                return file.endsWith('.html') || 
                       file.endsWith('.js') || 
                       file === 'README.md' || 
                       file === 'LICENSE';
            });
            
            this.packageJson.files = importantFiles;
            
            const packagePath = path.join(this.projectRoot, 'package.json');
            fs.writeFileSync(packagePath, JSON.stringify(this.packageJson, null, 2), 'utf8');
            
            console.log('✅ package.json 文件列表已更新');
            
        } catch (error) {
            console.error('更新 package.json 失败:', error);
        }
    }

    // 生成项目统计信息
    generateStats() {
        const stats = {
            totalFiles: 0,
            totalLines: 0,
            jsFiles: 0,
            htmlFiles: 0,
            lastUpdate: new Date().toISOString()
        };

        try {
            const files = fs.readdirSync(this.projectRoot);
            
            files.forEach(file => {
                const filePath = path.join(this.projectRoot, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isFile()) {
                    stats.totalFiles++;
                    
                    if (file.endsWith('.js')) {
                        stats.jsFiles++;
                    } else if (file.endsWith('.html')) {
                        stats.htmlFiles++;
                    }
                    
                    // 计算行数
                    try {
                        const content = fs.readFileSync(filePath, 'utf8');
                        stats.totalLines += content.split('\n').length;
                    } catch (e) {
                        // 忽略二进制文件
                    }
                }
            });
            
            // 保存统计信息
            const statsPath = path.join(this.projectRoot, 'docs/stats.json');
            fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), 'utf8');
            
            console.log('📊 项目统计信息已生成');
            console.log(`   总文件数: ${stats.totalFiles}`);
            console.log(`   总行数: ${stats.totalLines}`);
            console.log(`   JS文件: ${stats.jsFiles}`);
            console.log(`   HTML文件: ${stats.htmlFiles}`);
            
        } catch (error) {
            console.error('生成统计信息失败:', error);
        }
    }

    // 主执行函数
    run() {
        console.log('🚀 开始更新项目文档...\n');
        
        // 分析项目变化
        const changes = this.analyzeProjectChanges();
        
        // 更新各种文档
        this.updateReadme();
        this.updateChangelog(changes);
        this.updatePackageFiles();
        this.generateStats();
        
        console.log('\n✨ 文档更新完成！');
        
        if (changes.modifiedFiles.length > 0) {
            console.log('\n📝 检测到以下文件有变化:');
            changes.modifiedFiles.forEach(change => {
                console.log(`   - ${change.file} (${change.lastModified.toLocaleString()})`);
            });
        }
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const updater = new DocumentUpdater();
    updater.run();
}

module.exports = DocumentUpdater;
