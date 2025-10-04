# 编码风格规范文档

## 概述

本文档为英语学习网站项目制定统一的编码风格规范，涵盖Python、JavaScript和HTML三种主要开发语言。规范旨在提高代码可读性、维护性和团队协作效率。

## 通用规范

### 1. 命名规则
- **统一采用小驼峰命名法（camelCase）**
  - Python：虽然PEP8推荐使用下划线命名，但本项目统一采用小驼峰命名法保持一致性
  - JavaScript：变量名、函数名采用小驼峰命名法
  - HTML：id和class属性采用小驼峰命名法

```python
# Python示例
def calculateUserScore():
    userName = ""
    totalScore = 0
    isCompleted = False
```

```javascript
// JavaScript示例
function updateUserProgress() {
    let userLevel = 1;
    let currentScore = 0;
    let hasCompleted = false;
}
```

```html
<!-- HTML示例 -->
<div id="userProgressBar" class="progressContainer">
    <span class="scoreDisplay">得分</span>
</div>
```

### 2. 代码行宽度
- **严格控制在105个字符以内**
- 超过长度时应合理断行，保持逻辑清晰

```python
# 良好的断行示例
def calculateAdaptiveDifficulty(userScore, questionHistory, 
                              performanceTrend, timeSpent):
    baseDifficulty = userScore + calculatePerformanceBonus(
        questionHistory, performanceTrend)
    return applyTimeAdjustment(baseDifficulty, timeSpent)
```

### 3. 括号使用规范
- **大括号{}：开括号不换行，闭括号独占一行**
- **小括号()：函数调用和条件语句中，括号内侧不加空格**

```python
# Python大括号使用（字典、集合）
userProfile = {
    userId: 123,
    userName: "learner",
    currentLevel: 5,
    achievements: ["firstLogin", "weekStreak"]
}

# Python小括号使用
if (userScore > 80 and completionRate > 0.9):
    updateDifficultyLevel(userId, newLevel)
```

```javascript
// JavaScript大括号使用
function processUserAnswer() {
    let result = {
        isCorrect: true,
        score: calculateScore(),
        feedback: generateFeedback()
    };
    return result;
}

// JavaScript小括号使用
if (userInput.length > 0 && isValidAnswer(userInput)) {
    submitAnswer(userInput);
}
```

### 4. 缩进风格
- **统一使用4个空格进行缩进**
- 禁止使用Tab字符
- 嵌套层级要清晰分明

## Python特定规范

### 1. 导入规范
- 导入语句放在文件顶部
- 标准库导入、第三方库导入、本地模块导入分组排列
- 每组之间空一行

```python
import os
import sys
from datetime import datetime

import numpy as np
from flask import Flask, request

from models.user import User
from utils.calculator import calculateScore
```

### 2. 函数定义
- 函数名使用小驼峰命名法
- 参数列表的括号内侧不加空格
- 函数体第一行空一行后开始

```python
def analyzeUserPerformance(userId, sessionData):
    """
    分析用户学习表现
    
    Args:
        userId: 用户ID
        sessionData: 会话数据
        
    Returns:
        dict: 表现分析结果
    """
    totalQuestions = len(sessionData)
    correctAnswers = sum(1 for q in sessionData if q.isCorrect)
    
    return {
        accuracy: correctAnswers / totalQuestions,
        averageTime: calculateAverageTime(sessionData),
        improvement: trackImprovement(sessionData)
    }
```

### 3. 类定义
- 类名采用大驼峰命名法（PascalCase）- 例外情况
- 方法名使用小驼峰命名法
- 类内方法之间空一行

```python
class AdaptiveDifficultyEngine:
    def __init__(self):
        self.userLevel = 0
        self.questionHistory = []
        
    def calculateNextDifficulty(self):
        currentScore = self.getUserCurrentScore()
        return self.adjustBasedOnHistory(currentScore)
        
    def getUserCurrentScore(self):
        return self.userLevel * 10
```

## JavaScript特定规范

### 1. 变量声明
- 使用let和const，避免使用var
- 优先使用const，只有在需要重新赋值时使用let

```javascript
const MAX_SCORE = 100;
const API_BASE_URL = "https://api.example.com";

let currentUser = null;
let isLoading = false;
```

### 2. 函数声明
- 函数名使用小驼峰命名法
- 箭头函数用于简短的操作
- 复杂函数使用传统函数声明

```javascript
// 传统函数声明
function calculateReadingScore(readingData) {
    const wordCount = readingData.content.split(" ").length;
    const timeSpent = readingData.timeSpent;
    return (wordCount / timeSpent) * 100;
}

// 箭头函数用于简单操作
const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${seconds % 60}`;

// 回调函数使用箭头函数
userAnswers.forEach((answer) => {
    processAnswer(answer);
});
```

### 3. 对象和数组
- 对象属性名使用小驼峰命名法
- 数组方法链式调用时适当换行

```javascript
const userProgress = {
    userId: 12345,
    currentLevel: 5,
    totalScore: 850,
    completedLessons: ["lesson1", "lesson2", "lesson3"],
    achievements: [
        {name: "firstSteps", date: "2024-01-15"},
        {name: "weekStreak", date: "2024-01-22"}
    ]
};

// 数组方法链式调用
const topUsers = userList
    .filter(user => user.isActive)
    .map(user => ({id: user.id, score: user.score}))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
```

## HTML特定规范

### 1. 基本结构
- 使用语义化标签
- 属性名使用小驼峰命名法
- 属性值使用双引号

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>英语学习平台</title>
</head>
<body>
    <header class="mainHeader">
        <nav class="navigationMenu">
            <ul class="menuList">
                <li class="menuItem"><a href="#home">首页</a></li>
                <li class="menuItem"><a href="#reading">阅读</a></li>
            </ul>
        </nav>
    </header>
</body>
</html>
```

### 2. CSS类名规范
- 使用小驼峰命名法
- 采用BEM命名规范的简化版本

```html
<!-- 块__元素--修饰符 -->
<div class="userCard">
    <div class="userCard__header">
        <img class="userCard__avatar userCard__avatar--large" src="avatar.jpg">
        <h3 class="userCard__name">用户名</h3>
    </div>
    <div class="userCard__body">
        <p class="userCard__description">用户描述</p>
    </div>
</div>
```

### 3. 表单元素
- 使用语义化的label标签
- id和name属性使用小驼峰命名法

```html
<form class="userForm" id="userRegistrationForm">
    <div class="formGroup">
        <label for="userName" class="formLabel">用户名：</label>
        <input type="text" id="userName" name="userName" class="formInput" required>
    </div>
    <div class="formGroup">
        <label for="userEmail" class="formLabel">邮箱：</label>
        <input type="email" id="userEmail" name="userEmail" class="formInput" required>
    </div>
    <button type="submit" class="submitButton">注册</button>
</form>
```

## 注释规范

### 1. 文件头部注释
```python
"""
文件名：adaptiveDifficultySystem.py
描述：自适应难度调节系统的核心算法实现
作者：开发团队
创建时间：2024-01-15
最后修改：2024-01-20
"""
```

### 2. 函数注释
```python
def calculateAdaptiveScore(userPerformance, difficultyHistory):
    """
    计算用户的自适应得分
    
    该函数根据用户的历史表现和当前题目难度，
    使用指数移动平均算法计算新的能力评分
    
    Args:
        userPerformance (dict): 用户表现数据，包含正确率、用时等
        difficultyHistory (list): 历史难度记录
        
    Returns:
        float: 新的自适应得分，范围0-100
        
    Raises:
        ValueError: 当输入数据格式不正确时
    """
```

### 3. 行内注释
```python
# 计算用户的能力得分，使用加权平均算法
currentScore = (accuracy * 0.4 + speed * 0.3 + difficulty * 0.3)

# TODO: 需要优化算法性能，当前时间复杂度为O(n²)
for user in userList:
    processUserData(user)
```

## 错误处理

### 1. Python错误处理
```python
def getUserProgress(userId):
    try:
        userData = database.getUser(userId)
        if not userData:
            raise ValueError(f"用户 {userId} 不存在")
        return calculateProgress(userData)
    except DatabaseError as e:
        logger.error(f"数据库查询失败：{e}")
        return getDefaultProgress()
    except Exception as e:
        logger.exception("获取用户进度时发生未知错误")
        raise
```

### 2. JavaScript错误处理
```javascript
async function loadUserProgress(userId) {
    try {
        const response = await fetch(`/api/user/${userId}/progress`);
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        const data = await response.json();
        return processProgressData(data);
    } catch (error) {
        console.error('加载用户进度失败:', error);
        showErrorMessage('无法加载学习进度，请稍后重试');
        return getDefaultProgress();
    }
}
```

## 性能优化建议

### 1. Python性能优化
```python
# 使用列表推导式代替循环
userScores = [user.score for user in activeUsers]

# 使用生成器表达式处理大数据
largeData = (processItem(item) for item in hugeList)

# 合理使用缓存
from functools import lru_cache

@lru_cache(maxsize=128)
def calculateComplexScore(userId):
    return expensiveCalculation(userId)
```

### 2. JavaScript性能优化
```javascript
// 使用事件委托减少事件监听器
document.getElementById('container').addEventListener('click', (e) => {
    if (e.target.classList.contains('button')) {
        handleButtonClick(e.target);
    }
});

// 防抖和节流
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
```

## 代码审查检查清单

### 提交前自检
- [ ] 代码符合小驼峰命名法规范
- [ ] 每行代码不超过105个字符
- [ ] 使用4个空格缩进，无Tab字符
- [ ] 括号使用符合规范
- [ ] 添加了必要的注释
- [ ] 错误处理机制完整
- [ ] 代码通过测试

### 审查要点
1. **命名规范**：是否统一使用小驼峰命名法
2. **代码长度**：是否存在过长行，需要合理断行
3. **括号格式**：大括号、小括号使用是否规范
4. **注释质量**：注释是否清晰、准确、必要
5. **错误处理**：异常处理是否完善
6. **性能考虑**：是否存在明显的性能问题
7. **代码复用**：是否存在重复代码可以抽象

## 附录：参考规范

### Python相关
- 虽然本项目采用小驼峰命名法，但其他PEP8规范仍然适用
- 参考PEP8官方文档：https://pep8.org/
- Google Python风格指南（部分适用）

### JavaScript相关
- Airbnb JavaScript风格指南（部分适用）
- Google JavaScript风格指南
- MDN Web开发最佳实践

### HTML/CSS相关
- W3C HTML规范
- Google HTML/CSS风格指南
- BEM命名方法论

---

**最后更新**：2024年1月
**版本**：v1.0
**制定人**：开发团队
**适用范围**：英语学习网站项目所有代码文件