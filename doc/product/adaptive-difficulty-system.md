# 自适应难度调节系统 - 产品设计文档

## 1. 系统概述

### 1.1 核心目标
设计一个智能化的自适应难度调节系统，通过0-100的评分体系，实时追踪用户能力水平，动态调整题目难度，确保学习者始终处于最佳学习区间。

### 1.2 设计理念
**"学习区理论"（Zone of Proximal Development）**：系统应让用户在"舒适区"与"恐慌区"之间找到最佳平衡点，在略有挑战但不至于挫败的环境中学习。

### 1.3 难度标定
- **0分**：初学者水平（基本字母识别）
- **30分**：初中英语水平
- **60分**：高考英语水平
- **80分**：大学英语六级（CET-6）水平
- **90分**：雅思7.0/托福100分水平
- **100分**：GRE/GMAT等高难度学术英语水平

## 2. 评分系统架构

### 2.1 评分模型设计

#### 2.1.1 基础评分公式
```
用户能力分 = 基础分 + 表现加权分 - 时间衰减分
```

#### 2.1.2 评分维度与权重

| 评分维度 | 权重 | 说明 | 数据来源 |
|---------|------|------|----------|
| 答题准确率 | 40% | 正确率是核心指标 | 最近10题正确率 |
| 答题速度 | 20% | 反应理解流畅度 | 相对于标准时间的比率 |
| 题目难度 | 25% | 高难度题目的成功加分 | 题目预设难度分 |
| 连续性表现 | 15% | 学习稳定性和进步趋势 | 最近20题的表现曲线 |

### 2.2 实时评分更新机制

#### 2.2.1 单次答题后的评分更新
```python
def update_score(current_score, question_result):
    # question_result包含：正确性、用时、题目难度、答题类型
    accuracy_delta = calculate_accuracy_delta(question_result)
    speed_delta = calculate_speed_delta(question_result)
    difficulty_delta = calculate_difficulty_delta(question_result)
    trend_delta = calculate_trend_delta(question_result)

    # 加权计算
    total_delta = (accuracy_delta * 0.4 +
                   speed_delta * 0.2 +
                   difficulty_delta * 0.25 +
                   trend_delta * 0.15)

    return apply_smoothing(current_score, total_delta)
```

#### 2.2.2 评分变化规则
- **完全正确且快速**：+2~5分（根据题目难度）
- **正确但较慢**：+1~3分
- **错误但有合理思考**：-1~2分
- **快速错误**：-2~4分
- **超时**：-3~5分

## 3. 窗口平滑机制

### 3.1 数学模型

#### 3.1.1 指数移动平均（EMA）
```
新评分 = α × 即时评分 + (1-α) × 历史评分
```
其中：
- α（平滑因子）= 0.2（新数据权重）
- 历史评分 = 最近N次评分的EMA值

#### 3.1.2 自适应窗口机制
```python
class AdaptiveWindow:
    def __init__(self):
        self.recent_scores = []  # 最近10次记录
        self.stable_scores = []  # 稳定期记录
        self.window_size = 10

    def update_window(self, new_score):
        self.recent_scores.append(new_score)

        # 检测稳定性
        if self.is_stable():
            # 稳定期扩大窗口
            self.window_size = min(20, self.window_size + 1)
        else:
            # 波动期缩小窗口
            self.window_size = max(5, self.window_size - 1)

        # 保持窗口大小
        if len(self.recent_scores) > self.window_size:
            self.recent_scores.pop(0)
```

### 3.2 平滑策略

#### 3.2.1 三级平滑机制
1. **即时平滑**：单次答题后的微调（±5分以内）
2. **短期平滑**：基于最近5题的加权平均
3. **长期平滑**：基于最近30题的趋势分析

#### 3.2.2 异常值处理
- 识别异常表现（如突然的大幅分数波动）
- 对异常值进行降噪处理
- 保留异常记录但不直接影响主评分

## 4. 难度映射与题目生成

### 4.1 难度分级体系

| 难度分数 | 对应题目特征 | 词汇要求 | 句子复杂度 | 话题类型 |
|---------|-------------|----------|------------|----------|
| 0-20 | 简单句、常用词 | 1000-2000 | 10词以内 | 日常生活 |
| 21-40 | 复合句、基础语法 | 2000-3000 | 15词左右 | 校园、工作 |
| 41-60 | 复杂从句、抽象概念 | 3000-5000 | 20词左右 | 社会话题 |
| 61-80 | 学术词汇、长难句 | 5000-8000 | 25词左右 | 科普、新闻 |
| 81-100 | 专业词汇、高难度结构 | 8000+ | 30词+ | 学术论文 |

### 4.2 题目生成策略

#### 4.2.1 难度匹配算法
```python
def generate_question(user_score):
    # 基础难度 = 用户评分 ± 随机波动
    base_difficulty = user_score + random.uniform(-5, 5)

    # 考虑最近表现趋势
    if get_recent_trend() == "improving":
        base_difficulty += 3
    elif get_recent_trend() == "declining":
        base_difficulty -= 3

    # 确保在合理范围内
    target_difficulty = max(0, min(100, base_difficulty))

    # 生成题目参数
    return {
        "vocabulary_level": map_to_vocab_level(target_difficulty),
        "sentence_complexity": map_to_complexity(target_difficulty),
        "topic_category": select_topic(target_difficulty),
        "question_type": select_type_based_on_weakness()
    }
```

#### 4.2.2 题目类型自适应
- **词汇薄弱**：增加词汇题比例
- **语法薄弱**：增加语法填空题
- **阅读速度慢**：增加短篇阅读
- **理解深度不足**：增加推理判断题

## 5. 用户体验设计

### 5.1 难度可视化

#### 5.1.1 能力进度条
```
[████████████░░░░] 75分
高级英语水平
距离专家级别还需25分
```

#### 5.1.2 实时反馈
- **上升提示**："太棒了！你的能力提升了2分"
- **稳定提示**："保持住，你正在稳步前进"
- **下降提示**："没关系，降低一点难度，巩固基础"

### 5.2 难度控制选项

#### 5.2.1 用户自主调节
- **难度锁定**：固定在某个难度范围练习
- **挑战模式**：故意提高10-20%难度
- **巩固模式**：降低10-20%难度加强基础

#### 5.2.2 智能建议系统
```python
def suggest_difficulty_mode(user_data):
    if user_data.recent_accuracy < 0.6:
        return "建议开启巩固模式，暂时降低难度"
    elif user_data.recent_accuracy > 0.9:
        return "可以尝试挑战模式，突破自我"
    else:
        return "当前难度正好，继续保持"
```

## 6. 数据追踪与分析

### 6.1 学习轨迹记录

#### 6.1.1 关键数据点
- 每日最高/最低/平均分
- 各题型表现分数
- 词汇掌握度变化
- 学习效率指标（分数/时间）

#### 6.1.2 数据可视化
- 能力曲线图（展示进步轨迹）
- 雷达图（各维度能力分布）
- 热力图（一周学习活跃度）

### 6.2 预测与建议

#### 6.2.1 能力预测模型
```python
def predict_future_score(current_data):
    # 基于历史数据预测未来30天的能力水平
    # 考虑学习频率、进步速度、遗忘曲线等因素
    predicted_score = calculate_trend(current_data)

    return {
        "7天预测": predicted_score.week_1,
        "30天预测": predicted_score.month_1,
        "达成目标时间": estimate_time_to_target()
    }
```

#### 6.2.2 个性化学习建议
- 识别薄弱环节并推荐专项练习
- 根据遗忘曲线安排复习计划
- 提供学习策略建议

## 7. 技术实现要点

### 7.1 性能优化
- 评分计算延迟 < 100ms
- 使用缓存机制存储用户历史数据
- 批量处理非关键更新

### 7.2 数据安全
- 加密存储用户学习数据
- 定期备份学习记录
- 支持数据导出功能

### 7.3 A/B测试框架
- 支持不同算法的对比测试
- 实时调整算法参数
- 收集用户反馈优化模型

## 8. 异常处理机制

### 8.1 异常场景识别
- 连续多次答题失败（>5次）
- 分数异常波动（>20分/10题）
- 长时间未学习（>7天）
- 答题时间异常（过快或过慢）

### 8.2 应对策略
- **连续失败**：自动降低难度，提供基础练习
- **分数波动**：启动诊断模式，分析原因
- **长期未学**：提供复习计划，逐步恢复
- **时间异常**：调整评分权重，提醒检查状态

## 9. 成功指标

### 9.1 系统性能指标
- 难度预测准确率 > 85%
- 用户在适难度区间比例 > 80%
- 评分稳定性（变异系数 < 0.15）

### 9.2 用户体验指标
- 难度感知满意度 > 4.0/5.0
- 学习效率提升 > 30%
- 挫败感评分 < 2.0/5.0

## 10. 未来扩展方向

### 10.1 AI增强
- 引入机器学习优化评分算法
- 多模态难度评估（语音、写作等）
- 个性化学习路径生成

### 10.2 社交功能
- 难度排行榜（按水平分组）
- 学习伙伴匹配系统
- 难度挑战赛

---

*本文档为自适应难度调节系统的核心设计，技术团队可基于此文档进行详细的技术方案设计。*