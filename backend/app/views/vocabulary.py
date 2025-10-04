from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.vocabularyService import VocabularyService
from app.utils.validators import validatePagination as validatePaginationParams
from app.extensions import cache

# 创建词汇蓝图
vocabularyBlueprint = Blueprint('vocabulary', __name__, url_prefix='/api/vocabulary')


@vocabularyBlueprint.route('', methods=['GET'])
def getVocabularyList():
    """获取词汇列表"""
    try:
        # 获取查询参数
        page = request.args.get('page', 1, type=int)
        perPage = min(request.args.get('perPage', 20, type=int), 100)  # 限制最大100条

        # 验证分页参数
        if not validatePaginationParams(page, perPage):
            return jsonify({
                'success': False,
                'message': 'Invalid pagination parameters',
                'code': 'INVALID_PAGINATION'
            }), 400

        # 构建过滤条件
        filters = {}
        if request.args.get('difficulty'):
            try:
                filters['difficulty'] = int(request.args.get('difficulty'))
            except ValueError:
                pass

        if request.args.get('level'):
            filters['level'] = request.args.get('level')

        if request.args.get('partOfSpeech'):
            filters['partOfSpeech'] = request.args.get('partOfSpeech')

        if request.args.get('search'):
            filters['search'] = request.args.get('search').strip()

        if request.args.get('categories'):
            try:
                categoryIds = [int(cat_id) for cat_id in request.args.get('categories').split(',')]
                filters['categoryIds'] = categoryIds
            except ValueError:
                pass

        if request.args.get('sortBy'):
            filters['sortBy'] = request.args.get('sortBy')

        if request.args.get('sortOrder'):
            filters['sortOrder'] = request.args.get('sortOrder')

        # 获取词汇列表
        result = VocabularyService.getVocabularyList(page, perPage, filters)

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500

    except Exception as e:
        current_app.logger.error(f"Get vocabulary list error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get vocabulary list',
            'code': 'LIST_ERROR'
        }), 500


@vocabularyBlueprint.route('/<int:vocabularyId>', methods=['GET'])
def getVocabularyDetail(vocabularyId):
    """获取词汇详情"""
    try:
        # 尝试从缓存获取
        cacheKey = f'vocabulary_detail_{vocabularyId}'
        vocabulary = cache.get(cacheKey)

        if not vocabulary:
            vocabulary = VocabularyService.getVocabularyById(vocabularyId)
            if vocabulary:
                # 缓存10分钟
                cache.set(cacheKey, vocabulary, timeout=600)

        if not vocabulary:
            return jsonify({
                'success': False,
                'message': 'Vocabulary not found',
                'code': 'VOCABULARY_NOT_FOUND'
            }), 404

        return jsonify({
            'success': True,
            'data': vocabulary.toDict()
        }), 200

    except Exception as e:
        current_app.logger.error(f"Get vocabulary detail error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get vocabulary detail',
            'code': 'DETAIL_ERROR'
        }), 500


@vocabularyBlueprint.route('', methods=['POST'])
@jwt_required()
# @requireAdmin
def createVocabulary():
    """创建词汇"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided',
                'code': 'NO_DATA'
            }), 400

        # 验证必需字段
        requiredFields = ['word', 'definition']
        for field in requiredFields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}',
                    'code': 'MISSING_FIELD'
                }), 400

        # 创建词汇
        result = VocabularyService.createVocabulary(data)

        if result['success']:
            return jsonify(result), 201
        else:
            statusCode = 400
            if result['code'] == 'VOCABULARY_EXISTS':
                statusCode = 409
            return jsonify(result), statusCode

    except Exception as e:
        current_app.logger.error(f"Create vocabulary error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to create vocabulary',
            'code': 'CREATION_ERROR'
        }), 500


@vocabularyBlueprint.route('/<int:vocabularyId>', methods=['PUT'])
@jwt_required()
# @requireAdmin
def updateVocabulary(vocabularyId):
    """更新词汇"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided',
                'code': 'NO_DATA'
            }), 400

        # 更新词汇
        result = VocabularyService.updateVocabulary(vocabularyId, data)

        if result['success']:
            return jsonify(result), 200
        else:
            statusCode = 400
            if result['code'] in ['VOCABULARY_NOT_FOUND', 'WORD_EXISTS']:
                statusCode = 404 if result['code'] == 'VOCABULARY_NOT_FOUND' else 409
            return jsonify(result), statusCode

    except Exception as e:
        current_app.logger.error(f"Update vocabulary error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to update vocabulary',
            'code': 'UPDATE_ERROR'
        }), 500


@vocabularyBlueprint.route('/<int:vocabularyId>', methods=['DELETE'])
@jwt_required()
# @requireAdmin
def deleteVocabulary(vocabularyId):
    """删除词汇"""
    try:
        # 删除词汇
        result = VocabularyService.deleteVocabulary(vocabularyId)

        if result['success']:
            return jsonify(result), 200
        else:
            statusCode = 404 if result['code'] == 'VOCABULARY_NOT_FOUND' else 400
            return jsonify(result), statusCode

    except Exception as e:
        current_app.logger.error(f"Delete vocabulary error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to delete vocabulary',
            'code': 'DELETE_ERROR'
        }), 500


@vocabularyBlueprint.route('/search', methods=['GET'])
def searchVocabulary():
    """搜索词汇"""
    try:
        query = request.args.get('q', '').strip()

        if not query:
            return jsonify({
                'success': False,
                'message': 'Search query is required',
                'code': 'MISSING_QUERY'
            }), 400

        if len(query) < 2:
            return jsonify({
                'success': False,
                'message': 'Search query must be at least 2 characters',
                'code': 'QUERY_TOO_SHORT'
            }), 400

        # 构建过滤条件
        filters = {}
        if request.args.get('difficulty'):
            try:
                filters['difficulty'] = int(request.args.get('difficulty'))
            except ValueError:
                pass

        if request.args.get('level'):
            filters['level'] = request.args.get('level')

        if request.args.get('categories'):
            try:
                categoryIds = [int(cat_id) for cat_id in request.args.get('categories').split(',')]
                filters['categoryIds'] = categoryIds
            except ValueError:
                pass

        # 搜索词汇
        result = VocabularyService.searchVocabulary(query, filters)

        if result['success']:
            # 执行查询并限制结果数量
            vocabularyList = result['query'].limit(50).all()

            return jsonify({
                'success': True,
                'data': {
                    'vocabularies': [vocab.toDict() for vocab in vocabularyList],
                    'total': len(vocabularyList),
                    'query': query
                }
            }), 200
        else:
            return jsonify(result), 500

    except Exception as e:
        current_app.logger.error(f"Search vocabulary error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to search vocabulary',
            'code': 'SEARCH_ERROR'
        }), 500


@vocabularyBlueprint.route('/categories', methods=['GET'])
def getVocabularyCategories():
    """获取词汇分类列表"""
    try:
        categories = VocabularyService.getVocabularyCategories()

        return jsonify({
            'success': True,
            'data': categories
        }), 200

    except Exception as e:
        current_app.logger.error(f"Get vocabulary categories error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get vocabulary categories',
            'code': 'CATEGORIES_ERROR'
        }), 500


@vocabularyBlueprint.route('/categories', methods=['POST'])
@jwt_required()
# @requireAdmin
def createCategory():
    """创建词汇分类"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided',
                'code': 'NO_DATA'
            }), 400

        # 验证必需字段
        if not data.get('name'):
            return jsonify({
                'success': False,
                'message': 'Missing required field: name',
                'code': 'MISSING_FIELD'
            }), 400

        # 创建分类
        result = VocabularyService.createCategory(data)

        if result['success']:
            return jsonify(result), 201
        else:
            statusCode = 400
            if result['code'] == 'CATEGORY_EXISTS':
                statusCode = 409
            return jsonify(result), statusCode

    except Exception as e:
        current_app.logger.error(f"Create category error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to create category',
            'code': 'CREATION_ERROR'
        }), 500


@vocabularyBlueprint.route('/random', methods=['GET'])
def getRandomVocabulary():
    """获取随机词汇"""
    try:
        count = min(request.args.get('count', 10, type=int), 50)  # 限制最大50个
        difficulty = request.args.get('difficulty', type=int)
        level = request.args.get('level')

        # 获取随机词汇
        vocabularyList = VocabularyService.getRandomVocabulary(count, difficulty, level)

        return jsonify({
            'success': True,
            'data': {
                'vocabularies': [vocab.toDict() for vocab in vocabularyList],
                'count': len(vocabularyList)
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Get random vocabulary error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get random vocabulary',
            'code': 'RANDOM_ERROR'
        }), 500


@vocabularyBlueprint.route('/statistics', methods=['GET'])
def getVocabularyStatistics():
    """获取词汇统计"""
    try:
        stats = VocabularyService.getVocabularyStatistics()

        return jsonify({
            'success': True,
            'data': stats
        }), 200

    except Exception as e:
        current_app.logger.error(f"Get vocabulary statistics error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get vocabulary statistics',
            'code': 'STATISTICS_ERROR'
        }), 500


@vocabularyBlueprint.route('/batch-import', methods=['POST'])
@jwt_required()
# @requireAdmin
def batchImportVocabulary():
    """批量导入词汇"""
    try:
        data = request.get_json()

        if not data or 'vocabularies' not in data:
            return jsonify({
                'success': False,
                'message': 'Vocabulary list is required',
                'code': 'MISSING_VOCABULARIES'
            }), 400

        vocabularyList = data['vocabularies']
        if not isinstance(vocabularyList, list) or len(vocabularyList) == 0:
            return jsonify({
                'success': False,
                'message': 'Invalid vocabulary list',
                'code': 'INVALID_LIST'
            }), 400

        if len(vocabularyList) > 1000:  # 限制批量导入数量
            return jsonify({
                'success': False,
                'message': 'Too many vocabularies (max 1000 per batch)',
                'code': 'BATCH_TOO_LARGE'
            }), 400

        # 批量导入
        result = VocabularyService.batchImportVocabulary(vocabularyList)

        if result['success']:
            return jsonify(result), 201
        else:
            return jsonify(result), 500

    except Exception as e:
        current_app.logger.error(f"Batch import error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to batch import vocabulary',
            'code': 'BATCH_IMPORT_ERROR'
        }), 500


@vocabularyBlueprint.route('/export', methods=['GET'])
@jwt_required()
# @requireAdmin
def exportVocabulary():
    """导出词汇"""
    try:
        # 获取过滤参数
        filters = {}
        if request.args.get('difficulty'):
            try:
                filters['difficulty'] = int(request.args.get('difficulty'))
            except ValueError:
                pass

        if request.args.get('level'):
            filters['level'] = request.args.get('level')

        if request.args.get('categories'):
            try:
                categoryIds = [int(cat_id) for cat_id in request.args.get('categories').split(',')]
                filters['categoryIds'] = categoryIds
            except ValueError:
                pass

        # 获取所有符合条件的词汇（不分页）
        result = VocabularyService.getVocabularyList(1, 10000, filters)  # 获取大量词汇用于导出

        if result['success']:
            vocabularies = result['data']['vocabularies']

            # 简化词汇数据用于导出
            exportData = []
            for vocab in vocabularies:
                exportData.append({
                    'word': vocab['word'],
                    'pronunciation': vocab.get('pronunciation', ''),
                    'partOfSpeech': vocab.get('partOfSpeech', ''),
                    'definition': vocab['definition'],
                    'translation': vocab.get('translation', ''),
                    'difficulty': vocab.get('difficulty', 1),
                    'level': vocab.get('level', 'beginner'),
                    'categories': [cat['name'] for cat in vocab.get('categories', [])]
                })

            return jsonify({
                'success': True,
                'data': {
                    'vocabularies': exportData,
                    'total': len(exportData),
                    'exportedAt': datetime.utcnow().isoformat()
                }
            }), 200
        else:
            return jsonify(result), 500

    except Exception as e:
        current_app.logger.error(f"Export vocabulary error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to export vocabulary',
            'code': 'EXPORT_ERROR'
        }), 500