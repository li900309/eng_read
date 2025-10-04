from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
from flask import current_app, request
from sqlalchemy import and_, or_, func
from app.models.vocabulary import Vocabulary, VocabularyCategory, VocabularyExample
from app.models.user import User
from app.models.learning import UserVocabulary
from app.extensions import db, cache
from app.utils.decorators import validatePagination


class VocabularyService:
    """词汇服务类 - 处理词汇相关的业务逻辑"""

    @staticmethod
    def createVocabulary(vocabularyData: Dict[str, Any]) -> Dict[str, Any]:
        """创建新词汇"""
        try:
            # 检查词汇是否已存在
            existingVocabulary = Vocabulary.query.filter_by(
                word=vocabularyData['word'].lower()
            ).first()

            if existingVocabulary:
                return {
                    'success': False,
                    'message': 'Vocabulary already exists',
                    'code': 'VOCABULARY_EXISTS'
                }

            # 创建词汇记录
            vocabulary = Vocabulary(
                word=vocabularyData['word'].lower(),
                pronunciation=vocabularyData.get('pronunciation', ''),
                partOfSpeech=vocabularyData.get('partOfSpeech', ''),
                definition=vocabularyData['definition'],
                translation=vocabularyData.get('translation', ''),
                difficulty=vocabularyData.get('difficulty', 1),
                frequency=vocabularyData.get('frequency', 1),
                level=vocabularyData.get('level', 'beginner'),
                language=vocabularyData.get('language', 'en'),
                tags=vocabularyData.get('tags', []),
                synonyms=vocabularyData.get('synonyms', []),
                antonyms=vocabularyData.get('antonyms', [])
            )

            db.session.add(vocabulary)
            db.session.flush()  # 获取ID

            # 处理分类
            if 'categories' in vocabularyData and vocabularyData['categories']:
                for categoryId in vocabularyData['categories']:
                    category = VocabularyCategory.query.get(categoryId)
                    if category:
                        vocabulary.categories.append(category)

            # 处理例句
            if 'examples' in vocabularyData and vocabularyData['examples']:
                for exampleData in vocabularyData['examples']:
                    example = VocabularyExample(
                        vocabularyId=vocabulary.id,
                        sentence=exampleData['sentence'],
                        translation=exampleData.get('translation', ''),
                        source=exampleData.get('source', '')
                    )
                    db.session.add(example)

            db.session.commit()

            return {
                'success': True,
                'message': 'Vocabulary created successfully',
                'data': vocabulary.toDict()
            }

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error creating vocabulary: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to create vocabulary',
                'code': 'CREATION_ERROR'
            }

    @staticmethod
    def getVocabularyById(vocabularyId: int) -> Optional[Vocabulary]:
        """根据ID获取词汇"""
        try:
            vocabulary = Vocabulary.query.get(vocabularyId)
            return vocabulary
        except Exception as e:
            current_app.logger.error(f"Error getting vocabulary by ID: {str(e)}")
            return None

    @staticmethod
    def searchVocabulary(query: str, filters: Dict[str, Any] = None) -> Dict[str, Any]:
        """搜索词汇"""
        try:
            # 构建基础查询
            baseQuery = Vocabulary.query

            # 添加搜索条件
            if query:
                searchFilter = or_(
                    Vocabulary.word.ilike(f'%{query}%'),
                    Vocabulary.definition.ilike(f'%{query}%'),
                    Vocabulary.translation.ilike(f'%{query}%')
                )
                baseQuery = baseQuery.filter(searchFilter)

            # 添加过滤条件
            if filters:
                if 'difficulty' in filters:
                    baseQuery = baseQuery.filter(Vocabulary.difficulty == filters['difficulty'])

                if 'level' in filters:
                    baseQuery = baseQuery.filter(Vocabulary.level == filters['level'])

                if 'partOfSpeech' in filters:
                    baseQuery = baseQuery.filter(Vocabulary.partOfSpeech == filters['partOfSpeech'])

                if 'categoryIds' in filters and filters['categoryIds']:
                    baseQuery = baseQuery.join(Vocabulary.categories).filter(
                        VocabularyCategory.id.in_(filters['categoryIds'])
                    )

                if 'minFrequency' in filters:
                    baseQuery = baseQuery.filter(Vocabulary.frequency >= filters['minFrequency'])

                if 'maxFrequency' in filters:
                    baseQuery = baseQuery.filter(Vocabulary.frequency <= filters['maxFrequency'])

            # 默认排序
            baseQuery = baseQuery.order_by(Vocabulary.frequency.desc())

            return {
                'success': True,
                'query': baseQuery
            }

        except Exception as e:
            current_app.logger.error(f"Error searching vocabulary: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to search vocabulary',
                'code': 'SEARCH_ERROR'
            }

    @staticmethod
    def getVocabularyList(page: int = 1, perPage: int = 20, filters: Dict[str, Any] = None) -> Dict[str, Any]:
        """获取词汇列表"""
        try:
            # 构建查询
            baseQuery = Vocabulary.query

            # 应用过滤条件
            if filters:
                if 'difficulty' in filters:
                    baseQuery = baseQuery.filter(Vocabulary.difficulty == filters['difficulty'])

                if 'level' in filters:
                    baseQuery = baseQuery.filter(Vocabulary.level == filters['level'])

                if 'partOfSpeech' in filters:
                    baseQuery = baseQuery.filter(Vocabulary.partOfSpeech == filters['partOfSpeech'])

                if 'categoryIds' in filters and filters['categoryIds']:
                    baseQuery = baseQuery.join(Vocabulary.categories).filter(
                        VocabularyCategory.id.in_(filters['categoryIds'])
                    )

                if 'search' in filters and filters['search']:
                    searchFilter = or_(
                        Vocabulary.word.ilike(f'%{filters["search"]}%'),
                        Vocabulary.definition.ilike(f'%{filters["search"]}%'),
                        Vocabulary.translation.ilike(f'%{filters["search"]}%')
                    )
                    baseQuery = baseQuery.filter(searchFilter)

            # 排序
            sortBy = filters.get('sortBy', 'frequency') if filters else 'frequency'
            sortOrder = filters.get('sortOrder', 'desc') if filters else 'desc'

            if hasattr(Vocabulary, sortBy):
                sortField = getattr(Vocabulary, sortBy)
                if sortOrder == 'asc':
                    baseQuery = baseQuery.order_by(sortField.asc())
                else:
                    baseQuery = baseQuery.order_by(sortField.desc())

            # 分页
            pagination = baseQuery.paginate(
                page=page,
                per_page=perPage,
                error_out=False
            )

            return {
                'success': True,
                'data': {
                    'vocabularies': [vocab.toDict() for vocab in pagination.items],
                    'pagination': {
                        'page': page,
                        'perPage': perPage,
                        'total': pagination.total,
                        'pages': pagination.pages,
                        'hasNext': pagination.has_next,
                        'hasPrev': pagination.has_prev
                    }
                }
            }

        except Exception as e:
            current_app.logger.error(f"Error getting vocabulary list: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to get vocabulary list',
                'code': 'LIST_ERROR'
            }

    @staticmethod
    def updateVocabulary(vocabularyId: int, updateData: Dict[str, Any]) -> Dict[str, Any]:
        """更新词汇"""
        try:
            vocabulary = Vocabulary.query.get(vocabularyId)
            if not vocabulary:
                return {
                    'success': False,
                    'message': 'Vocabulary not found',
                    'code': 'VOCABULARY_NOT_FOUND'
                }

            # 更新允许的字段
            updatableFields = [
                'pronunciation', 'partOfSpeech', 'definition', 'translation',
                'difficulty', 'frequency', 'level', 'tags', 'synonyms', 'antonyms'
            ]

            for field in updatableFields:
                if field in updateData:
                    setattr(vocabulary, field, updateData[field])

            # 特殊处理word字段
            if 'word' in updateData and updateData['word'] != vocabulary.word:
                # 检查新词汇是否已存在
                existingVocabulary = Vocabulary.query.filter_by(
                    word=updateData['word'].lower()
                ).first()

                if existingVocabulary and existingVocabulary.id != vocabularyId:
                    return {
                        'success': False,
                        'message': 'Vocabulary word already exists',
                        'code': 'WORD_EXISTS'
                    }

                vocabulary.word = updateData['word'].lower()

            vocabulary.updatedAt = datetime.utcnow()

            # 处理分类更新
            if 'categories' in updateData:
                vocabulary.categories.clear()
                for categoryId in updateData['categories']:
                    category = VocabularyCategory.query.get(categoryId)
                    if category:
                        vocabulary.categories.append(category)

            # 处理例句更新
            if 'examples' in updateData:
                # 删除现有例句
                VocabularyExample.query.filter_by(vocabularyId=vocabularyId).delete()

                # 添加新例句
                for exampleData in updateData['examples']:
                    example = VocabularyExample(
                        vocabularyId=vocabularyId,
                        sentence=exampleData['sentence'],
                        translation=exampleData.get('translation', ''),
                        source=exampleData.get('source', '')
                    )
                    db.session.add(example)

            db.session.commit()

            # 清除相关缓存
            cache.delete(f'vocabulary_{vocabularyId}')

            return {
                'success': True,
                'message': 'Vocabulary updated successfully',
                'data': vocabulary.toDict()
            }

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error updating vocabulary: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to update vocabulary',
                'code': 'UPDATE_ERROR'
            }

    @staticmethod
    def deleteVocabulary(vocabularyId: int) -> Dict[str, Any]:
        """删除词汇"""
        try:
            vocabulary = Vocabulary.query.get(vocabularyId)
            if not vocabulary:
                return {
                    'success': False,
                    'message': 'Vocabulary not found',
                    'code': 'VOCABULARY_NOT_FOUND'
                }

            # 检查是否有用户正在学习这个词汇
            userVocabularyCount = UserVocabulary.query.filter_by(
                vocabularyId=vocabularyId
            ).count()

            if userVocabularyCount > 0:
                # 软删除：将词汇标记为已删除而不是实际删除
                vocabulary.isDeleted = True
                vocabulary.updatedAt = datetime.utcnow()
                db.session.commit()

                return {
                    'success': True,
                    'message': 'Vocabulary soft deleted successfully',
                    'warning': f'{userVocabularyCount} users are learning this vocabulary'
                }
            else:
                # 硬删除
                db.session.delete(vocabulary)
                db.session.commit()

                # 清除缓存
                cache.delete(f'vocabulary_{vocabularyId}')

                return {
                    'success': True,
                    'message': 'Vocabulary deleted successfully'
                }

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error deleting vocabulary: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to delete vocabulary',
                'code': 'DELETE_ERROR'
            }

    @staticmethod
    def getVocabularyCategories() -> List[Dict[str, Any]]:
        """获取词汇分类列表"""
        try:
            cacheKey = 'vocabulary_categories'
            categories = cache.get(cacheKey)

            if categories:
                return categories

            categories = VocabularyCategory.query.order_by(VocabularyCategory.name).all()
            result = [category.toDict() for category in categories]

            # 缓存30分钟
            cache.set(cacheKey, result, timeout=1800)

            return result

        except Exception as e:
            current_app.logger.error(f"Error getting vocabulary categories: {str(e)}")
            return []

    @staticmethod
    def createCategory(categoryData: Dict[str, Any]) -> Dict[str, Any]:
        """创建词汇分类"""
        try:
            # 检查分类是否已存在
            existingCategory = VocabularyCategory.query.filter_by(
                name=categoryData['name']
            ).first()

            if existingCategory:
                return {
                    'success': False,
                    'message': 'Category already exists',
                    'code': 'CATEGORY_EXISTS'
                }

            category = VocabularyCategory(
                name=categoryData['name'],
                description=categoryData.get('description', ''),
                color=categoryData.get('color', '#007bff'),
                icon=categoryData.get('icon', '')
            )

            db.session.add(category)
            db.session.commit()

            # 清除分类缓存
            cache.delete('vocabulary_categories')

            return {
                'success': True,
                'message': 'Category created successfully',
                'data': category.toDict()
            }

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error creating category: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to create category',
                'code': 'CREATION_ERROR'
            }

    @staticmethod
    def getRandomVocabulary(count: int = 10, difficulty: int = None, level: str = None) -> List[Vocabulary]:
        """获取随机词汇"""
        try:
            query = Vocabulary.query.filter(Vocabulary.isDeleted == False)

            if difficulty is not None:
                query = query.filter(Vocabulary.difficulty == difficulty)

            if level:
                query = query.filter(Vocabulary.level == level)

            return query.order_by(func.random()).limit(count).all()

        except Exception as e:
            current_app.logger.error(f"Error getting random vocabulary: {str(e)}")
            return []

    @staticmethod
    def getVocabularyStatistics() -> Dict[str, Any]:
        """获取词汇统计数据"""
        try:
            cacheKey = 'vocabulary_statistics'
            stats = cache.get(cacheKey)

            if stats:
                return stats

            totalVocabulary = Vocabulary.query.filter_by(isDeleted=False).count()
            vocabularyByLevel = db.session.query(
                Vocabulary.level,
                func.count(Vocabulary.id)
            ).filter_by(isDeleted=False).group_by(Vocabulary.level).all()

            vocabularyByDifficulty = db.session.query(
                Vocabulary.difficulty,
                func.count(Vocabulary.id)
            ).filter_by(isDeleted=False).group_by(Vocabulary.difficulty).all()

            stats = {
                'totalVocabulary': totalVocabulary,
                'byLevel': {level: count for level, count in vocabularyByLevel},
                'byDifficulty': {difficulty: count for difficulty, count in vocabularyByDifficulty}
            }

            # 缓存1小时
            cache.set(cacheKey, stats, timeout=3600)

            return stats

        except Exception as e:
            current_app.logger.error(f"Error getting vocabulary statistics: {str(e)}")
            return {
                'totalVocabulary': 0,
                'byLevel': {},
                'byDifficulty': {}
            }

    @staticmethod
    def batchImportVocabulary(vocabularyList: List[Dict[str, Any]]) -> Dict[str, Any]:
        """批量导入词汇"""
        try:
            successCount = 0
            errorCount = 0
            errors = []

            for index, vocabData in enumerate(vocabularyList):
                try:
                    # 验证必需字段
                    if not vocabData.get('word') or not vocabData.get('definition'):
                        errors.append(f"Row {index + 1}: Missing required fields (word, definition)")
                        errorCount += 1
                        continue

                    # 检查是否已存在
                    existingVocabulary = Vocabulary.query.filter_by(
                        word=vocabData['word'].lower()
                    ).first()

                    if existingVocabulary:
                        errors.append(f"Row {index + 1}: Vocabulary '{vocabData['word']}' already exists")
                        errorCount += 1
                        continue

                    # 创建词汇
                    vocabulary = Vocabulary(
                        word=vocabData['word'].lower(),
                        pronunciation=vocabData.get('pronunciation', ''),
                        partOfSpeech=vocabData.get('partOfSpeech', ''),
                        definition=vocabData['definition'],
                        translation=vocabData.get('translation', ''),
                        difficulty=vocabData.get('difficulty', 1),
                        frequency=vocabData.get('frequency', 1),
                        level=vocabData.get('level', 'beginner'),
                        language=vocabData.get('language', 'en'),
                        tags=vocabData.get('tags', []),
                        synonyms=vocabData.get('synonyms', []),
                        antonyms=vocabData.get('antonyms', [])
                    )

                    db.session.add(vocabulary)
                    successCount += 1

                except Exception as e:
                    errors.append(f"Row {index + 1}: {str(e)}")
                    errorCount += 1

            # 提交所有成功的词汇
            db.session.commit()

            return {
                'success': True,
                'data': {
                    'successCount': successCount,
                    'errorCount': errorCount,
                    'totalProcessed': len(vocabularyList),
                    'errors': errors
                }
            }

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error in batch import: {str(e)}")
            return {
                'success': False,
                'message': 'Batch import failed',
                'code': 'BATCH_IMPORT_ERROR'
            }