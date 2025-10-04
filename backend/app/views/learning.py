from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.learningService import LearningService
from app.utils.decorators import validatePagination
from app.utils.validators import validatePagination as validatePaginationParams
from datetime import datetime

# 创建学习蓝图
learningBlueprint = Blueprint('learning', __name__, url_prefix='/api/learning')


@learningBlueprint.route('/session', methods=['POST'])
@jwt_required()
def createLearningSession():
    """创建学习会话"""
    try:
        currentUserId = get_jwt_identity()
        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'message': 'No configuration provided',
                'code': 'NO_CONFIG'
            }), 400

        # 验证配置参数
        config = {
            'wordCount': min(max(data.get('wordCount', 20), 1), 50),  # 限制1-50个词汇
            'difficulty': data.get('difficulty', 'adaptive'),
            'categories': data.get('categories', []),
            'sessionType': data.get('sessionType', 'mixed')
        }

        # 验证难度级别
        validDifficulties = ['adaptive', 1, 2, 3, 4, 5]
        if config['difficulty'] not in validDifficulties:
            return jsonify({
                'success': False,
                'message': 'Invalid difficulty level',
                'code': 'INVALID_DIFFICULTY'
            }), 400

        # 验证会话类型
        validSessionTypes = ['mixed', 'new', 'review']
        if config['sessionType'] not in validSessionTypes:
            return jsonify({
                'success': False,
                'message': 'Invalid session type',
                'code': 'INVALID_SESSION_TYPE'
            }), 400

        # 创建学习会话
        result = LearningService.createLearningSession(currentUserId, config)

        if result['success']:
            return jsonify(result), 201
        else:
            return jsonify(result), 400

    except Exception as e:
        current_app.logger.error(f"Create learning session error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to create learning session',
            'code': 'SESSION_CREATION_ERROR'
        }), 500


@learningBlueprint.route('/session/<int:sessionId>', methods=['GET'])
@jwt_required()
def getLearningSession(sessionId):
    """获取学习会话信息"""
    try:
        currentUserId = get_jwt_identity()

        # 从数据库获取会话信息
        from app.models.learning import LearningSession
        session = LearningSession.query.filter_by(
            id=sessionId,
            userId=currentUserId
        ).first()

        if not session:
            return jsonify({
                'success': False,
                'message': 'Session not found',
                'code': 'SESSION_NOT_FOUND'
            }), 404

        # 获取会话词汇
        from app.models.learning import SessionWord
        sessionWords = SessionWord.query.filter_by(sessionId=sessionId).order_by(SessionWord.position).all()

        sessionData = session.toDict()
        sessionData['words'] = [
            {
                'position': word.position,
                'vocabulary': word.vocabulary.toDict() if word.vocabulary else None,
                'answered': word.answeredAt is not None,
                'isCorrect': word.isCorrect,
                'timeSpent': word.timeSpent
            }
            for word in sessionWords
        ]

        return jsonify({
            'success': True,
            'data': sessionData
        }), 200

    except Exception as e:
        current_app.logger.error(f"Get learning session error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get learning session',
            'code': 'SESSION_ERROR'
        }), 500


@learningBlueprint.route('/session/<int:sessionId>/answer', methods=['POST'])
@jwt_required()
def submitAnswer(sessionId):
    """提交答案"""
    try:
        currentUserId = get_jwt_identity()
        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'message': 'No answer data provided',
                'code': 'NO_ANSWER_DATA'
            }), 400

        # 验证必需字段
        requiredFields = ['vocabularyId', 'answer', 'timeSpent', 'isCorrect']
        for field in requiredFields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}',
                    'code': 'MISSING_FIELD'
                }), 400

        # 验证数据类型
        if not isinstance(data['timeSpent'], int) or data['timeSpent'] < 0:
            return jsonify({
                'success': False,
                'message': 'Invalid timeSpent value',
                'code': 'INVALID_TIME_SPENT'
            }), 400

        if not isinstance(data['isCorrect'], bool):
            return jsonify({
                'success': False,
                'message': 'Invalid isCorrect value',
                'code': 'INVALID_IS_CORRECT'
            }), 400

        # 验证会话所有权
        from app.models.learning import LearningSession
        session = LearningSession.query.filter_by(
            id=sessionId,
            userId=currentUserId,
            status='active'
        ).first()

        if not session:
            return jsonify({
                'success': False,
                'message': 'Session not found or not active',
                'code': 'INVALID_SESSION'
            }), 404

        # 提交答案
        result = LearningService.submitAnswer(
            sessionId,
            data['vocabularyId'],
            data['answer'],
            data['timeSpent'],
            data['isCorrect']
        )

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400

    except Exception as e:
        current_app.logger.error(f"Submit answer error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to submit answer',
            'code': 'SUBMIT_ERROR'
        }), 500


@learningBlueprint.route('/session/<int:sessionId>/complete', methods=['POST'])
@jwt_required()
def completeSession(sessionId):
    """完成学习会话"""
    try:
        currentUserId = get_jwt_identity()
        data = request.get_json() or {}

        # 验证会话所有权
        from app.models.learning import LearningSession
        session = LearningSession.query.filter_by(
            id=sessionId,
            userId=currentUserId,
            status='active'
        ).first()

        if not session:
            return jsonify({
                'success': False,
                'message': 'Session not found or not active',
                'code': 'INVALID_SESSION'
            }), 404

        # 完成会话
        result = LearningService.completeSession(sessionId, data.get('feedback'))

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400

    except Exception as e:
        current_app.logger.error(f"Complete session error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to complete session',
            'code': 'COMPLETION_ERROR'
        }), 500


@learningBlueprint.route('/queue', methods=['GET'])
@jwt_required()
def getLearningQueue():
    """获取学习队列"""
    try:
        currentUserId = get_jwt_identity()

        # 获取查询参数
        count = min(request.args.get('count', 20, type=int), 50)  # 限制最大50个
        difficulty = request.args.get('difficulty', 'adaptive')
        sessionType = request.args.get('sessionType', 'mixed')

        # 验证参数
        validDifficulties = ['adaptive', 1, 2, 3, 4, 5]
        if difficulty not in validDifficulties:
            return jsonify({
                'success': False,
                'message': 'Invalid difficulty level',
                'code': 'INVALID_DIFFICULTY'
            }), 400

        validSessionTypes = ['mixed', 'new', 'review']
        if sessionType not in validSessionTypes:
            return jsonify({
                'success': False,
                'message': 'Invalid session type',
                'code': 'INVALID_SESSION_TYPE'
            }), 400

        # 获取分类过滤
        categories = request.args.get('categories', '')
        categoryIds = []
        if categories:
            try:
                categoryIds = [int(cat_id) for cat_id in categories.split(',')]
            except ValueError:
                pass

        # 生成学习队列
        config = {
            'wordCount': count,
            'difficulty': difficulty,
            'categories': categoryIds,
            'sessionType': sessionType
        }

        vocabularyList = LearningService._generateLearningQueue(
            currentUserId, count, difficulty, categoryIds, sessionType
        )

        return jsonify({
            'success': True,
            'data': {
                'vocabularies': [vocab.toDict() for vocab in vocabularyList],
                'count': len(vocabularyList),
                'config': config
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Get learning queue error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get learning queue',
            'code': 'QUEUE_ERROR'
        }), 500


@learningBlueprint.route('/recommendations', methods=['GET'])
@jwt_required()
def getRecommendedVocabulary():
    """获取推荐词汇"""
    try:
        currentUserId = get_jwt_identity()
        count = min(request.args.get('count', 10, type=int), 50)  # 限制最大50个

        # 获取推荐词汇
        recommendations = LearningService.getRecommendedVocabulary(currentUserId, count)

        return jsonify({
            'success': True,
            'data': {
                'vocabularies': recommendations,
                'count': len(recommendations)
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Get recommended vocabulary error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get recommended vocabulary',
            'code': 'RECOMMENDATIONS_ERROR'
        }), 500


@learningBlueprint.route('/stats', methods=['GET'])
@jwt_required()
def getLearningStats():
    """获取学习统计"""
    try:
        currentUserId = get_jwt_identity()
        days = min(request.args.get('days', 30, type=int), 365)  # 限制最大365天

        # 验证参数
        if days < 1:
            return jsonify({
                'success': False,
                'message': 'Days must be at least 1',
                'code': 'INVALID_DAYS'
            }), 400

        # 获取学习统计
        result = LearningService.getUserLearningStats(currentUserId, days)

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500

    except Exception as e:
        current_app.logger.error(f"Get learning stats error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get learning statistics',
            'code': 'STATS_ERROR'
        }), 500


@learningBlueprint.route('/sessions', methods=['GET'])
@jwt_required()
@validatePagination
def getLearningSessions():
    """获取学习会话列表"""
    try:
        currentUserId = get_jwt_identity()

        # 获取分页参数
        page = request.args.get('page', 1, type=int)
        perPage = min(request.args.get('perPage', 20, type=int), 100)

        # 验证分页参数
        if not validatePaginationParams(page, perPage):
            return jsonify({
                'success': False,
                'message': 'Invalid pagination parameters',
                'code': 'INVALID_PAGINATION'
            }), 400

        # 构建查询
        from app.models.learning import LearningSession
        from sqlalchemy import desc

        query = LearningSession.query.filter_by(userId=currentUserId)

        # 添加过滤条件
        if request.args.get('status'):
            query = query.filter_by(status=request.args.get('status'))

        if request.args.get('sessionType'):
            query = query.filter_by(sessionType=request.args.get('sessionType'))

        # 添加时间范围过滤
        if request.args.get('startDate'):
            try:
                startDate = datetime.fromisoformat(request.args.get('startDate'))
                query = query.filter(LearningSession.createdAt >= startDate)
            except ValueError:
                pass

        if request.args.get('endDate'):
            try:
                endDate = datetime.fromisoformat(request.args.get('endDate'))
                query = query.filter(LearningSession.createdAt <= endDate)
            except ValueError:
                pass

        # 排序
        query = query.order_by(desc(LearningSession.createdAt))

        # 分页
        pagination = query.paginate(
            page=page,
            per_page=perPage,
            error_out=False
        )

        return jsonify({
            'success': True,
            'data': {
                'sessions': [session.toDict() for session in pagination.items],
                'pagination': {
                    'page': page,
                    'perPage': perPage,
                    'total': pagination.total,
                    'pages': pagination.pages,
                    'hasNext': pagination.has_next,
                    'hasPrev': pagination.has_prev
                }
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Get learning sessions error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get learning sessions',
            'code': 'SESSIONS_ERROR'
        }), 500


@learningBlueprint.route('/review-due', methods=['GET'])
@jwt_required()
def getDueForReview():
    """获取需要复习的词汇"""
    try:
        currentUserId = get_jwt_identity()
        count = min(request.args.get('count', 20, type=int), 100)  # 限制最大100个

        # 获取需要复习的词汇
        from app.models.learning import UserVocabulary
        from sqlalchemy import and_
        from datetime import datetime

        dueVocabulary = UserVocabulary.query.filter(
            and_(
                UserVocabulary.userId == currentUserId,
                UserVocabulary.nextReviewAt <= datetime.utcnow(),
                UserVocabulary.masteryLevel < 5
            )
        ).order_by(UserVocabulary.nextReviewAt).limit(count).all()

        return jsonify({
            'success': True,
            'data': {
                'vocabularies': [
                    {
                        'userVocabulary': uv.toDict(),
                        'vocabulary': uv.vocabulary.toDict() if uv.vocabulary else None
                    }
                    for uv in dueVocabulary
                ],
                'count': len(dueVocabulary),
                'totalDue': UserVocabulary.query.filter(
                    and_(
                        UserVocabulary.userId == currentUserId,
                        UserVocabulary.nextReviewAt <= datetime.utcnow(),
                        UserVocabulary.masteryLevel < 5
                    )
                ).count()
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Get due for review error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get vocabulary due for review',
            'code': 'REVIEW_DUE_ERROR'
        }), 500


@learningBlueprint.route('/progress', methods=['GET'])
@jwt_required()
def getLearningProgress():
    """获取学习进度"""
    try:
        currentUserId = get_jwt_identity()
        period = request.args.get('period', '30d')

        # 验证时间周期
        validPeriods = ['7d', '30d', '90d', '1y']
        if period not in validPeriods:
            return jsonify({
                'success': False,
                'message': 'Invalid period',
                'code': 'INVALID_PERIOD'
            }), 400

        # 获取详细进度
        result = LearningService.getDetailedProgress(currentUserId, period)

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500

    except Exception as e:
        current_app.logger.error(f"Get learning progress error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get learning progress',
            'code': 'PROGRESS_ERROR'
        }), 500