from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.statisticsService import StatisticsService
from app.utils.validators import validatePagination as validatePaginationParams
from app.extensions import db
from datetime import datetime, timedelta

# 创建统计蓝图
statisticsBlueprint = Blueprint('statistics', __name__, url_prefix='/api/statistics')


@statisticsBlueprint.route('/dashboard', methods=['GET'])
@jwt_required()
def getDashboardStatistics():
    """获取仪表板统计数据"""
    try:
        currentUserId = get_jwt_identity()

        # 获取仪表板统计
        result = StatisticsService.getDashboardStatistics(currentUserId)

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500

    except Exception as e:
        current_app.logger.error(f"Get dashboard statistics error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get dashboard statistics',
            'code': 'DASHBOARD_ERROR'
        }), 500


@statisticsBlueprint.route('/progress', methods=['GET'])
@jwt_required()
def getDetailedProgress():
    """获取详细学习进度"""
    try:
        currentUserId = get_jwt_identity()
        period = request.args.get('period', '30d')

        # 验证时间周期
        validPeriods = ['7d', '30d', '90d', '1y']
        if period not in validPeriods:
            return jsonify({
                'success': False,
                'message': 'Invalid period. Valid options: 7d, 30d, 90d, 1y',
                'code': 'INVALID_PERIOD'
            }), 400

        # 获取详细进度
        result = StatisticsService.getDetailedProgress(currentUserId, period)

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500

    except Exception as e:
        current_app.logger.error(f"Get detailed progress error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get detailed progress',
            'code': 'PROGRESS_ERROR'
        }), 500


@statisticsBlueprint.route('/achievements', methods=['GET'])
@jwt_required()
def getAchievements():
    """获取用户成就"""
    try:
        currentUserId = get_jwt_identity()

        # 获取成就数据
        result = StatisticsService.getAchievements(currentUserId)

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500

    except Exception as e:
        current_app.logger.error(f"Get achievements error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get achievements',
            'code': 'ACHIEVEMENTS_ERROR'
        }), 500


@statisticsBlueprint.route('/learning-trend', methods=['GET'])
@jwt_required()
def getLearningTrend():
    """获取学习趋势"""
    try:
        currentUserId = get_jwt_identity()
        days = min(request.args.get('days', 30, type=int), 365)  # 限制最大365天

        # 验证参数
        if days < 7:
            return jsonify({
                'success': False,
                'message': 'Days must be at least 7',
                'code': 'INVALID_DAYS'
            }), 400

        # 计算趋势数据
        today = datetime.utcnow().date()
        trendData = []

        for i in range(days - 1, -1, -1):
            date = today - timedelta(days=i)

            # 获取当日统计
            from app.models.learning import LearningSession
            from sqlalchemy import func, and_

            dailyStats = LearningSession.query.filter(
                and_(
                    LearningSession.userId == currentUserId,
                    func.date(LearningSession.createdAt) == date,
                    LearningSession.status == 'completed'
                )
            ).with_entities(
                func.count(LearningSession.id).label('sessions'),
                func.sum(LearningSession.wordsStudied).label('wordsStudied'),
                func.sum(LearningSession.totalTimeSpent).label('timeSpent'),
                func.avg(LearningSession.accuracy).label('accuracy')
            ).first()

            trendData.append({
                'date': date.isoformat(),
                'sessions': dailyStats.sessions or 0,
                'wordsStudied': dailyStats.wordsStudied or 0,
                'timeSpent': dailyStats.timeSpent or 0,
                'accuracy': round(float(dailyStats.accuracy), 2) if dailyStats.accuracy else 0
            })

        return jsonify({
            'success': True,
            'data': {
                'trend': trendData,
                'period': f'{days}d',
                'summary': {
                    'totalDays': len(trendData),
                    'activeDays': len([d for d in trendData if d['sessions'] > 0]),
                    'totalSessions': sum(d['sessions'] for d in trendData),
                    'totalWordsStudied': sum(d['wordsStudied'] for d in trendData),
                    'totalTimeSpent': sum(d['timeSpent'] for d in trendData),
                    'averageAccuracy': round(sum(d['accuracy'] for d in trendData) / len(trendData), 2) if trendData else 0
                }
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Get learning trend error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get learning trend',
            'code': 'TREND_ERROR'
        }), 500


@statisticsBlueprint.route('/category-progress', methods=['GET'])
@jwt_required()
def getCategoryProgress():
    """获取分类学习进度"""
    try:
        currentUserId = get_jwt_identity()

        # 获取分类进度统计
        from app.models.vocabulary import VocabularyCategory
        from app.models.learning import UserVocabulary
        from sqlalchemy import func, and_, outerjoin

        categoryStats = db.session.query(
            VocabularyCategory.id,
            VocabularyCategory.name,
            VocabularyCategory.color,
            func.count(VocabularyCategory.vocabularies).label('totalWords'),
            func.sum(func.case(
                (UserVocabulary.masteryLevel >= 3, 1), else_=0
            )).label('learnedWords'),
            func.sum(func.case(
                (UserVocabulary.masteryLevel == 5, 1), else_=0
            )).label('masteredWords')
        ).outerjoin(
            VocabularyCategory.vocabularies
        ).outerjoin(
            UserVocabulary, and_(
                UserVocabulary.vocabularyId == Vocabulary.id,
                UserVocabulary.userId == currentUserId
            )
        ).filter(
            Vocabulary.isDeleted == False
        ).group_by(VocabularyCategory.id).all()

        categoryProgress = []
        for stat in categoryStats:
            totalWords = stat.totalWords or 0
            learnedWords = stat.learnedWords or 0
            masteredWords = stat.masteredWords or 0

            categoryProgress.append({
                'categoryId': stat.id,
                'categoryName': stat.name,
                'color': stat.color,
                'totalWords': totalWords,
                'learnedWords': learnedWords,
                'masteredWords': masteredWords,
                'learningProgress': round((learnedWords / totalWords * 100) if totalWords > 0 else 0, 2),
                'masteryProgress': round((masteredWords / totalWords * 100) if totalWords > 0 else 0, 2),
                'status': 'completed' if masteredWords == totalWords else 'in_progress' if learnedWords > 0 else 'not_started'
            })

        # 按学习进度排序
        categoryProgress.sort(key=lambda x: x['learningProgress'], reverse=True)

        return jsonify({
            'success': True,
            'data': {
                'categories': categoryProgress,
                'summary': {
                    'totalCategories': len(categoryProgress),
                    'completedCategories': len([c for c in categoryProgress if c['status'] == 'completed']),
                    'inProgressCategories': len([c for c in categoryProgress if c['status'] == 'in_progress']),
                    'notStartedCategories': len([c for c in categoryProgress if c['status'] == 'not_started'])
                }
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Get category progress error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get category progress',
            'code': 'CATEGORY_PROGRESS_ERROR'
        }), 500


@statisticsBlueprint.route('/vocabulary-distribution', methods=['GET'])
@jwt_required()
def getVocabularyDistribution():
    """获取词汇掌握度分布"""
    try:
        currentUserId = get_jwt_identity()

        # 获取掌握度分布
        from app.models.learning import UserVocabulary
        from sqlalchemy import func

        masteryDistribution = db.session.query(
            UserVocabulary.masteryLevel,
            func.count(UserVocabulary.id).label('count')
        ).filter_by(userId=currentUserId).group_by(UserVocabulary.masteryLevel).all()

        # 初始化所有级别的计数
        distribution = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for level, count in masteryDistribution:
            distribution[level] = count

        # 计算百分比
        totalWords = sum(distribution.values())
        percentageDistribution = {
            str(level): round((count / totalWords * 100), 2) if totalWords > 0 else 0
            for level, count in distribution.items()
        }

        return jsonify({
            'success': True,
            'data': {
                'distribution': distribution,
                'percentageDistribution': percentageDistribution,
                'totalWords': totalWords,
                'averageMastery': round(sum(level * count for level, count in distribution.items()) / totalWords, 2) if totalWords > 0 else 0,
                'masteredWords': distribution[5],
                'learningWords': sum(distribution[i] for i in range(1, 5)),
                'strugglingWords': distribution[0]
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Get vocabulary distribution error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get vocabulary distribution',
            'code': 'DISTRIBUTION_ERROR'
        }), 500


@statisticsBlueprint.route('/learning-efficiency', methods=['GET'])
@jwt_required()
def getLearningEfficiency():
    """获取学习效率分析"""
    try:
        currentUserId = get_jwt_identity()
        days = min(request.args.get('days', 30, type=int), 365)

        # 验证参数
        if days < 7:
            return jsonify({
                'success': False,
                'message': 'Days must be at least 7',
                'code': 'INVALID_DAYS'
            }), 400

        # 获取学习会话数据
        from app.models.learning import LearningSession
        from sqlalchemy import and_

        startDate = datetime.utcnow() - timedelta(days=days)
        sessions = LearningSession.query.filter(
            and_(
                LearningSession.userId == currentUserId,
                LearningSession.createdAt >= startDate,
                LearningSession.status == 'completed'
            )
        ).all()

        if not sessions:
            return jsonify({
                'success': True,
                'data': {
                    'averageWordsPerMinute': 0,
                    'bestSession': None,
                    'worstSession': None,
                    'peakHours': [],
                    'weeklyComparison': []
                }
            }), 200

        # 计算效率指标
        efficiencyData = []
        for session in sessions:
            if session.totalTimeSpent > 0:
                efficiency = session.wordsStudied / (session.totalTimeSpent / 60)  # 词汇/分钟
                efficiencyData.append({
                    'sessionId': session.id,
                    'date': session.createdAt.isoformat(),
                    'efficiency': efficiency,
                    'wordsStudied': session.wordsStudied,
                    'timeSpent': session.totalTimeSpent,
                    'accuracy': session.accuracy
                })

        # 找出最佳和最差会话
        bestSession = max(efficiencyData, key=lambda x: x['efficiency']) if efficiencyData else None
        worstSession = min(efficiencyData, key=lambda x: x['efficiency']) if efficiencyData else None

        # 计算每小时效率
        hourlyStats = {}
        for data in efficiencyData:
            hour = datetime.fromisoformat(data['date']).hour
            if hour not in hourlyStats:
                hourlyStats[hour] = []
            hourlyStats[hour].append(data['efficiency'])

        peakHours = []
        for hour, efficiencies in hourlyStats.items():
            if len(efficiencies) >= 3:  # 至少3次数据
                avgEfficiency = sum(efficiencies) / len(efficiencies)
                peakHours.append({
                    'hour': hour,
                    'averageEfficiency': round(avgEfficiency, 2),
                    'sessionCount': len(efficiencies)
                })

        peakHours.sort(key=lambda x: x['averageEfficiency'], reverse=True)

        # 计算周对比
        weeklyComparison = []
        for i in range(4):  # 最近4周
            weekStart = (datetime.utcnow() - timedelta(weeks=i+1)).date()
            weekEnd = (datetime.utcnow() - timedelta(weeks=i)).date()

            weekSessions = [s for s in sessions if weekStart <= s.createdAt.date() < weekEnd]
            if weekSessions:
                weekEfficiency = sum(s.wordsStudied / (s.totalTimeSpent / 60) for s in weekSessions if s.totalTimeSpent > 0)
                weekEfficiency = weekEfficiency / len(weekSessions) if weekSessions else 0
                weeklyComparison.append({
                    'week': f'{weekStart.isoformat()} - {weekEnd.isoformat()}',
                    'averageEfficiency': round(weekEfficiency, 2),
                    'sessionCount': len(weekSessions)
                })

        weeklyComparison.reverse()  # 按时间顺序

        return jsonify({
            'success': True,
            'data': {
                'averageWordsPerMinute': round(sum(d['efficiency'] for d in efficiencyData) / len(efficiencyData), 2) if efficiencyData else 0,
                'bestSession': bestSession,
                'worstSession': worstSession,
                'peakHours': peakHours[:5],  # 前5个最高效时段
                'weeklyComparison': weeklyComparison,
                'summary': {
                    'totalSessions': len(sessions),
                    'totalTimeSpent': sum(s.totalTimeSpent for s in sessions),
                    'totalWordsStudied': sum(s.wordsStudied for s in sessions)
                }
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Get learning efficiency error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get learning efficiency',
            'code': 'EFFICIENCY_ERROR'
        }), 500


@statisticsBlueprint.route('/system', methods=['GET'])
# @requireAdmin
def getSystemStatistics():
    """获取系统统计数据（管理员专用）"""
    try:
        # 获取系统统计
        result = StatisticsService.getSystemStatistics()

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500

    except Exception as e:
        current_app.logger.error(f"Get system statistics error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get system statistics',
            'code': 'SYSTEM_STATS_ERROR'
        }), 500


@statisticsBlueprint.route('/export', methods=['GET'])
@jwt_required()
def exportStatistics():
    """导出统计数据"""
    try:
        currentUserId = get_jwt_identity()
        formatType = request.args.get('format', 'json')  # json, csv
        period = request.args.get('period', '30d')

        # 验证格式
        validFormats = ['json', 'csv']
        if formatType not in validFormats:
            return jsonify({
                'success': False,
                'message': 'Invalid format. Valid options: json, csv',
                'code': 'INVALID_FORMAT'
            }), 400

        # 验证时间周期
        validPeriods = ['7d', '30d', '90d', '1y']
        if period not in validPeriods:
            return jsonify({
                'success': False,
                'message': 'Invalid period',
                'code': 'INVALID_PERIOD'
            }), 400

        # 获取详细进度数据
        progressResult = StatisticsService.getDetailedProgress(currentUserId, period)
        dashboardResult = StatisticsService.getDashboardStatistics(currentUserId)

        if not progressResult['success'] or not dashboardResult['success']:
            return jsonify({
                'success': False,
                'message': 'Failed to get statistics data',
                'code': 'DATA_ERROR'
            }), 500

        exportData = {
            'exportedAt': datetime.utcnow().isoformat(),
            'userId': currentUserId,
            'period': period,
            'format': formatType,
            'dashboard': dashboardResult['data'],
            'progress': progressResult['data']
        }

        if formatType == 'json':
            return jsonify({
                'success': True,
                'data': exportData
            }), 200
        elif formatType == 'csv':
            # 简化的CSV导出（实际应用中可能需要更复杂的CSV处理）
            import csv
            import io

            output = io.StringIO()
            writer = csv.writer(output)

            # 写入标题
            writer.writerow(['Metric', 'Value'])

            # 写入仪表板数据
            dashboard = dashboardResult['data']
            writer.writerow(['Total Words', dashboard['overview']['totalWords']])
            writer.writerow(['Mastered Words', dashboard['overview']['masteredWords']])
            writer.writerow(['Learning Progress', f"{dashboard['overview']['learningProgress']}%"])
            writer.writerow(['Consecutive Days', dashboard['overview']['consecutiveDays']])
            writer.writerow(['Current Level', dashboard['overview']['currentLevel']])

            csv_content = output.getvalue()
            output.close()

            return jsonify({
                'success': True,
                'data': {
                    'csvContent': csv_content,
                    'filename': f"learning_statistics_{period}_{datetime.utcnow().strftime('%Y%m%d')}.csv"
                }
            }), 200

    except Exception as e:
        current_app.logger.error(f"Export statistics error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to export statistics',
            'code': 'EXPORT_ERROR'
        }), 500