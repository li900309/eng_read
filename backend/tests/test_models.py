"""
数据模型测试
测试所有数据模型的创建、验证和关系
"""

import pytest
from datetime import datetime, date
from app.models import (
    User, Vocabulary, VocabularyCategory, UserVocabulary,
    LearningSession, LearningRecord, DailyStatistics
)


@pytest.mark.unit
class TestUser:
    """测试用户模型"""
    def testCreateUser(self, app):
        """测试创建用户"""
        user = User(
            email='test@example.com',
            username='testuser',
            password='password123'
        )
        assert user.email == 'test@example.com'
        assert user.username == 'testuser'
        assert user.passwordHash is not None
        assert user.isActive is True
        assert user.createdAt is not None

    def testPasswordHashing(self, app):
        """测试密码哈希"""
        password = 'password123'
        user = User(
            email='test@example.com',
            username='testuser',
            password=password
        )
        assert user.passwordHash != password
        assert user.checkPassword(password) is True
        assert user.checkPassword('wrongpassword') is False

    def testUserPreferences(self, app):
        """测试用户偏好设置"""
        user = User(
            email='test@example.com',
            username='testuser',
            password='password123'
        )

        # 默认偏好为空
        assert user.getPreferences() == {}

        # 设置偏好
        preferences = {'theme': 'dark', 'language': 'en'}
        user.setPreferences(preferences)
        assert user.getPreferences() == preferences

    def testUpdateLastLogin(self, app):
        """测试更新最后登录时间"""
        user = User(
            email='test@example.com',
            username='testuser',
            password='password123'
        )
        originalUpdatedAt = user.updatedAt
        user.updateLastLogin()
        assert user.lastLoginAt is not None
        assert user.updatedAt > originalUpdatedAt

    def testUserToDict(self, app):
        """测试用户字典转换"""
        user = User(
            email='test@example.com',
            username='testuser',
            password='password123'
        )
        userDict = user.toDict()
        assert 'id' in userDict
        assert 'email' in userDict
        assert 'username' in userDict
        assert 'passwordHash' not in userDict
        assert 'isActive' in userDict


@pytest.mark.unit
class TestVocabularyCategory:
    """测试词汇分类模型"""
    def testCreateCategory(self, app):
        """测试创建分类"""
        category = VocabularyCategory(
            name='名词',
            description='名词类词汇',
            color='#FF0000'
        )
        assert category.name == '名词'
        assert category.description == '名词类词汇'
        assert category.color == '#FF0000'
        assert category.isActive is True

    def testCategoryToDict(self, app):
        """测试分类字典转换"""
        category = VocabularyCategory(
            name='名词',
            description='名词类词汇',
            color='#FF0000'
        )
        categoryDict = category.toDict()
        assert 'id' in categoryDict
        assert 'name' in categoryDict
        assert 'description' in categoryDict
        assert 'color' in categoryDict


@pytest.mark.unit
class TestVocabulary:
    """测试词汇模型"""
    def testCreateVocabulary(self, app, sampleCategory):
        """测试创建词汇"""
        vocabulary = Vocabulary(
            word='test',
            pronunciation='/test/',
            definition='测试',
            translation='test',
            example='This is a test.',
            exampleTranslation='这是一个测试。',
            difficulty=1,
            frequency=1,
            partOfSpeech='noun',
            categoryId=sampleCategory.id
        )
        assert vocabulary.word == 'test'
        assert vocabulary.difficulty == 1
        assert vocabulary.categoryId == sampleCategory.id

    def testVocabularyToDict(self, app, sampleVocabulary):
        """测试词汇字典转换"""
        vocabDict = sampleVocabulary.toDict()
        assert 'id' in vocabDict
        assert 'word' in vocabDict
        assert 'definition' in vocabDict
        assert 'category' in vocabDict
        assert vocabDict['category']['name'] == '测试分类'


@pytest.mark.unit
class TestUserVocabulary:
    """测试用户词汇模型"""
    def testCreateUserVocabulary(self, app, testUser, sampleVocabulary):
        """测试创建用户词汇"""
        userVocab = UserVocabulary(
            userId=testUser.id,
            vocabularyId=sampleVocabulary.id,
            masteryLevel=1,
            reviewCount=3,
            correctCount=2,
            consecutiveCorrect=2
        )
        assert userVocab.userId == testUser.id
        assert userVocab.vocabularyId == sampleVocabulary.id
        assert userVocab.masteryLevel == 1

    def testCalculateAccuracy(self, app, sampleUserVocabulary):
        """测试计算正确率"""
        accuracy = sampleUserVocabulary.calculateAccuracy()
        assert accuracy == 2/3  # correctCount / reviewCount

    def testUpdateReview(self, app, sampleUserVocabulary):
        """测试更新复习记录"""
        originalReviewCount = sampleUserVocabulary.reviewCount
        originalCorrectCount = sampleUserVocabulary.correctCount
        originalMasteryLevel = sampleUserVocabulary.masteryLevel

        # 答对
        sampleUserVocabulary.updateReview(True)
        assert sampleUserVocabulary.reviewCount == originalReviewCount + 1
        assert sampleUserVocabulary.correctCount == originalCorrectCount + 1
        assert sampleUserVocabulary.consecutiveCorrect == 3

        # 达到连续答对条件，提升掌握等级
        assert sampleUserVocabulary.masteryLevel == originalMasteryLevel + 1

    def testUserVocabularyToDict(self, app, sampleUserVocabulary):
        """测试用户词汇字典转换"""
        userVocabDict = sampleUserVocabulary.toDict()
        assert 'id' in userVocabDict
        assert 'userId' in userVocabDict
        assert 'vocabularyId' in userVocabDict
        assert 'accuracy' in userVocabDict
        assert 'difficultyScore' in userVocabDict


@pytest.mark.unit
class TestLearningSession:
    """测试学习会话模型"""
    def testCreateLearningSession(self, app, testUser):
        """测试创建学习会话"""
        session = LearningSession(
            userId=testUser.id,
            sessionType='review',
            totalWords=10,
            correctAnswers=8,
            wrongAnswers=2,
            pointsEarned=80
        )
        assert session.userId == testUser.id
        assert session.sessionType == 'review'
        assert session.status == 'active'

    def testCalculateAccuracy(self, app, sampleLearningSession):
        """测试计算正确率"""
        accuracy = sampleLearningSession.calculateAccuracy()
        expectedAccuracy = sampleLearningSession.correctAnswers / (
            sampleLearningSession.correctAnswers + sampleLearningSession.wrongAnswers
        )
        assert accuracy == expectedAccuracy

    def testEndSession(self, app, testUser):
        """测试结束会话"""
        session = LearningSession(
            userId=testUser.id,
            sessionType='review',
            totalWords=10,
            correctAnswers=8,
            wrongAnswers=2,
            pointsEarned=80
        )
        session.endSession()
        assert session.endedAt is not None
        assert session.status == 'completed'
        assert session.duration is not None

    def testAddAnswer(self, app, testUser):
        """测试添加答题记录"""
        session = LearningSession(
            userId=testUser.id,
            sessionType='review',
            totalWords=0,
            correctAnswers=0,
            wrongAnswers=0,
            pointsEarned=0
        )
        session.addAnswer(True, 10)
        assert session.totalWords == 1
        assert session.correctAnswers == 1
        assert session.pointsEarned == 10
        assert session.accuracy == 1.0


@pytest.mark.unit
class TestDailyStatistics:
    """测试每日统计模型"""
    def testCreateDailyStatistics(self, app, testUser):
        """测试创建每日统计"""
        stats = DailyStatistics(
            userId=testUser.id,
            statisticsDate=date.today(),
            wordsStudied=10,
            newWords=5,
            reviewWords=5,
            studyTime=30,
            sessionCount=2,
            correctAnswers=8,
            totalAnswers=10
        )
        assert stats.userId == testUser.id
        assert stats.statisticsDate == date.today()
        assert stats.wordsStudied == 10

    def testUpdateFromSession(self, app, testUser, sampleLearningSession):
        """测试从学习会话更新统计"""
        stats = DailyStatistics(
            userId=testUser.id,
            statisticsDate=date.today(),
            wordsStudied=0,
            newWords=0,
            reviewWords=0,
            studyTime=0,
            sessionCount=0,
            correctAnswers=0,
            totalAnswers=0
        )
        stats.updateFromSession(sampleLearningSession)
        assert stats.wordsStudied == sampleLearningSession.totalWords
        assert stats.sessionCount == 1
        assert stats.correctAnswers == sampleLearningSession.correctAnswers


@pytest.mark.integration
class TestModelRelationships:
    """测试模型关系"""
    def testUserVocabularyRelationship(self, app, testUser, sampleVocabulary):
        """测试用户-词汇关系"""
        userVocab = UserVocabulary(
            userId=testUser.id,
            vocabularyId=sampleVocabulary.id,
            masteryLevel=1
        )
        from app.extensions import db
        db.session.add(userVocab)
        db.session.commit()

        assert userVocab.user.id == testUser.id
        assert userVocab.vocabulary.id == sampleVocabulary.id

    def testVocabularyCategoryRelationship(self, app, sampleCategory, sampleVocabulary):
        """测试词汇-分类关系"""
        assert sampleVocabulary.category.id == sampleCategory.id
        assert sampleCategory.vocabularies.count() >= 1

    def testUserLearningSessionRelationship(self, app, testUser, sampleLearningSession):
        """测试用户-学习会话关系"""
        assert sampleLearningSession.user.id == testUser.id
        assert testUser.learningSessions.count() >= 1