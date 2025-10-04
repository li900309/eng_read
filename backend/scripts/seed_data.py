#!/usr/bin/env python3
"""
数据库种子数据脚本

该脚本用于初始化数据库的基础数据，包括：
- 词汇分类
- 基础词汇数据
- 示例用户（开发环境）
"""

import sys
import os
from datetime import datetime, timedelta
import random

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import createApp
from app.extensions import db
from app.models.user import User
from app.models.vocabulary import Vocabulary, VocabularyCategory, VocabularyExample
from app.models.learning import UserVocabulary
from app.config import getConfig


def createVocabularyCategories():
    """创建词汇分类"""
    print("Creating vocabulary categories...")

    categories = [
        {
            'name': 'daily_life',
            'description': '日常生活词汇',
            'color': '#FF6B6B',
            'icon': 'home'
        },
        {
            'name': 'business',
            'description': '商务英语词汇',
            'color': '#4ECDC4',
            'icon': 'briefcase'
        },
        {
            'name': 'academic',
            'description': '学术词汇',
            'color': '#45B7D1',
            'icon': 'graduation-cap'
        },
        {
            'name': 'travel',
            'description': '旅行词汇',
            'color': '#96CEB4',
            'icon': 'plane'
        },
        {
            'name': 'technology',
            'description': '科技词汇',
            'color': '#FFEAA7',
            'icon': 'laptop'
        },
        {
            'name': 'food',
            'description': '食物词汇',
            'color': '#DDA0DD',
            'icon': 'utensils'
        },
        {
            'name': 'sports',
            'description': '运动词汇',
            'color': '#98D8C8',
            'icon': 'running'
        },
        {
            'name': 'nature',
            'description': '自然词汇',
            'color': '#F7DC6F',
            'icon': 'leaf'
        }
    ]

    for categoryData in categories:
        # 检查分类是否已存在
        existingCategory = VocabularyCategory.query.filter_by(name=categoryData['name']).first()
        if not existingCategory:
            category = VocabularyCategory(**categoryData)
            db.session.add(category)
            print(f"  Created category: {categoryData['name']}")
        else:
            print(f"  Category already exists: {categoryData['name']}")

    db.session.commit()
    print("Vocabulary categories created successfully!")


def createBasicVocabulary():
    """创建基础词汇数据"""
    print("Creating basic vocabulary...")

    # 获取词汇分类
    categories = {cat.name: cat for cat in VocabularyCategory.query.all()}

    # 基础词汇数据
    vocabularyData = [
        # 日常生活词汇
        {
            'word': 'hello',
            'pronunciation': '/həˈloʊ/',
            'partOfSpeech': 'interjection',
            'definition': 'A greeting used when meeting someone or to attract attention.',
            'translation': '你好',
            'difficulty': 1,
            'frequency': 10,
            'level': 'beginner',
            'categories': [categories.get('daily_life').id] if 'daily_life' in categories else [],
            'examples': [
                {
                    'sentence': 'Hello, how are you today?',
                    'translation': '你好，你今天怎么样？',
                    'source': 'common'
                },
                {
                    'sentence': 'She said hello to her neighbors.',
                    'translation': '她向邻居们问好。',
                    'source': 'common'
                }
            ],
            'synonyms': ['hi', 'hey', 'greetings'],
            'antonyms': ['goodbye', 'farewell']
        },
        {
            'word': 'goodbye',
            'pronunciation': '/ɡʊdˈbaɪ/',
            'partOfSpeech': 'interjection',
            'definition': 'Used to express good wishes when parting or at the end of a conversation.',
            'translation': '再见',
            'difficulty': 1,
            'frequency': 9,
            'level': 'beginner',
            'categories': [categories.get('daily_life').id] if 'daily_life' in categories else [],
            'examples': [
                {
                    'sentence': 'Goodbye, see you tomorrow!',
                    'translation': '再见，明天见！',
                    'source': 'common'
                }
            ],
            'synonyms': ['farewell', 'bye', 'see you'],
            'antonyms': ['hello', 'welcome']
        },
        {
            'word': 'book',
            'pronunciation': '/bʊk/',
            'partOfSpeech': 'noun',
            'definition': 'A set of printed pages that are held together inside a cover.',
            'translation': '书',
            'difficulty': 1,
            'frequency': 8,
            'level': 'beginner',
            'categories': [categories.get('academic').id] if 'academic' in categories else [],
            'examples': [
                {
                    'sentence': 'I am reading a interesting book.',
                    'translation': '我正在读一本有趣的书。',
                    'source': 'common'
                }
            ],
            'synonyms': ['volume', 'tome', 'publication'],
            'antonyms': []
        },
        {
            'word': 'computer',
            'pronunciation': '/kəmˈpjuːtər/',
            'partOfSpeech': 'noun',
            'definition': 'An electronic device for storing and processing data.',
            'translation': '计算机',
            'difficulty': 2,
            'frequency': 7,
            'level': 'intermediate',
            'categories': [categories.get('technology').id] if 'technology' in categories else [],
            'examples': [
                {
                    'sentence': 'I use my computer for work every day.',
                    'translation': '我每天用电脑工作。',
                    'source': 'common'
                }
            ],
            'synonyms': ['PC', 'laptop', 'device'],
            'antonyms': []
        },
        {
            'word': 'environment',
            'pronunciation': '/ɪnˈvaɪrənmənt/',
            'partOfSpeech': 'noun',
            'definition': 'The surroundings or conditions in which a person, animal, or plant lives or operates.',
            'translation': '环境',
            'difficulty': 3,
            'frequency': 6,
            'level': 'intermediate',
            'categories': [categories.get('nature').id] if 'nature' in categories else [],
            'examples': [
                {
                    'sentence': 'We must protect the environment for future generations.',
                    'translation': '我们必须为子孙后代保护环境。',
                    'source': 'academic'
                }
            ],
            'synonyms': ['surroundings', 'habitat', 'ecosystem'],
            'antonyms': []
        },
        {
            'word': 'presentation',
            'pronunciation': '/ˌprezənˈteɪʃn/',
            'partOfSpeech': 'noun',
            'definition': 'The action of presenting something to someone.',
            'translation': '演示，报告',
            'difficulty': 3,
            'frequency': 6,
            'level': 'intermediate',
            'categories': [categories.get('business').id] if 'business' in categories else [],
            'examples': [
                {
                    'sentence': 'She gave an excellent presentation at the conference.',
                    'translation': '她在会议上做了一个精彩的报告。',
                    'source': 'business'
                }
            ],
            'synonyms': ['demo', 'talk', 'speech'],
            'antonyms': []
        },
        {
            'word': 'nutrition',
            'pronunciation': '/nuːˈtrɪʃn/',
            'partOfSpeech': 'noun',
            'definition': 'The process of providing or obtaining food necessary for health and growth.',
            'translation': '营养',
            'difficulty': 4,
            'frequency': 5,
            'level': 'advanced',
            'categories': [categories.get('food').id] if 'food' in categories else [],
            'examples': [
                {
                    'sentence': 'Good nutrition is essential for a healthy lifestyle.',
                    'translation': '良好的营养对于健康的生活方式至关重要。',
                    'source': 'health'
                }
            ],
            'synonyms': ['nourishment', 'diet', 'sustenance'],
            'antonyms': ['malnutrition']
        },
        {
            'word': 'sustainable',
            'pronunciation': '/səˈsteɪnəbl/',
            'partOfSpeech': 'adjective',
            'definition': 'Able to be maintained at a certain rate or level without depleting natural resources.',
            'translation': '可持续的',
            'difficulty': 4,
            'frequency': 5,
            'level': 'advanced',
            'categories': [categories.get('nature').id, categories.get('business').id] if 'nature' in categories and 'business' in categories else [],
            'examples': [
                {
                    'sentence': 'We need to adopt more sustainable farming practices.',
                    'translation': '我们需要采用更可持续的农业实践。',
                    'source': 'environmental'
                }
            ],
            'synonyms': ['renewable', 'eco-friendly', 'green'],
            'antonyms': ['unsustainable', 'depleting']
        }
    ]

    for vocabInfo in vocabularyData:
        # 检查词汇是否已存在
        existingVocab = Vocabulary.query.filter_by(word=vocabInfo['word']).first()
        if not existingVocab:
            # 创建词汇
            vocabulary = Vocabulary(
                word=vocabInfo['word'],
                pronunciation=vocabInfo.get('pronunciation', ''),
                partOfSpeech=vocabInfo.get('partOfSpeech', ''),
                definition=vocabInfo['definition'],
                translation=vocabInfo.get('translation', ''),
                difficulty=vocabInfo.get('difficulty', 1),
                frequency=vocabInfo.get('frequency', 1),
                level=vocabInfo.get('level', 'beginner'),
                tags=vocabInfo.get('tags', []),
                synonyms=vocabInfo.get('synonyms', []),
                antonyms=vocabInfo.get('antonyms', [])
            )

            db.session.add(vocabulary)
            db.session.flush()  # 获取ID

            # 添加分类关联
            if vocabInfo.get('categories'):
                for categoryId in vocabInfo['categories']:
                    category = VocabularyCategory.query.get(categoryId)
                    if category:
                        vocabulary.categories.append(category)

            # 添加例句
            if vocabInfo.get('examples'):
                for exampleData in vocabInfo['examples']:
                    example = VocabularyExample(
                        vocabularyId=vocabulary.id,
                        sentence=exampleData['sentence'],
                        translation=exampleData.get('translation', ''),
                        source=exampleData.get('source', '')
                    )
                    db.session.add(example)

            print(f"  Created vocabulary: {vocabInfo['word']}")
        else:
            print(f"  Vocabulary already exists: {vocabInfo['word']}")

    db.session.commit()
    print("Basic vocabulary created successfully!")


def createTestUsers():
    """创建测试用户（仅开发环境）"""
    if os.getenv('FLASK_ENV') == 'production':
        print("Skipping test user creation in production environment")
        return

    print("Creating test users...")

    testUsers = [
        {
            'email': 'admin@engread.com',
            'username': 'admin',
            'password': 'admin123',
            'role': 'admin',
            'nativeLanguage': 'zh',
            'targetLanguage': 'en',
            'dailyGoal': 50
        },
        {
            'email': 'user@engread.com',
            'username': 'testuser',
            'password': 'user123',
            'role': 'user',
            'nativeLanguage': 'zh',
            'targetLanguage': 'en',
            'dailyGoal': 20
        },
        {
            'email': 'learner@engread.com',
            'username': 'learner',
            'password': 'learn123',
            'role': 'user',
            'nativeLanguage': 'zh',
            'targetLanguage': 'en',
            'dailyGoal': 30
        }
    ]

    for userData in testUsers:
        # 检查用户是否已存在
        existingUser = User.query.filter_by(email=userData['email']).first()
        if not existingUser:
            user = User(
                email=userData['email'],
                username=userData['username'],
                passwordHash=userData['password'],  # 会自动哈希
                role=userData['role'],
                nativeLanguage=userData.get('nativeLanguage', 'zh'),
                targetLanguage=userData.get('targetLanguage', 'en'),
                dailyGoal=userData.get('dailyGoal', 20),
                isActive=True,
                isEmailVerified=True
            )

            db.session.add(user)
            db.session.flush()  # 获取用户ID

            print(f"  Created test user: {userData['email']}")

            # 为测试用户添加一些学习词汇
            if userData['role'] == 'user':
                createTestUserVocabulary(user.id)
        else:
            print(f"  Test user already exists: {userData['email']}")

    db.session.commit()
    print("Test users created successfully!")


def createTestUserVocabulary(userId):
    """为测试用户创建学习词汇记录"""
    # 获取一些词汇
    vocabularies = Vocabulary.query.limit(10).all()

    for vocabulary in vocabularies:
        # 检查用户词汇记录是否已存在
        existingUserVocab = UserVocabulary.query.filter_by(
            userId=userId,
            vocabularyId=vocabulary.id
        ).first()

        if not existingUserVocab:
            userVocabulary = UserVocabulary(
                userId=userId,
                vocabularyId=vocabulary.id,
                masteryLevel=random.randint(0, 5),
                reviewCount=random.randint(1, 10),
                correctCount=random.randint(0, 8),
                totalTimeSpent=random.randint(10, 300),
                lastReviewAt=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
                nextReviewAt=datetime.utcnow() + timedelta(hours=random.randint(1, 168)),
                learningStatus=random.choice(['learning', 'reviewing', 'mastered'])
            )

            db.session.add(userVocabulary)

    db.session.commit()


def createAdditionalVocabulary():
    """创建更多词汇数据（可选）"""
    print("Creating additional vocabulary...")

    # 更多词汇数据
    additionalVocabulary = [
        {
            'word': 'achieve',
            'pronunciation': '/əˈtʃiːv/',
            'partOfSpeech': 'verb',
            'definition': 'To successfully bring about or reach a desired objective or result.',
            'translation': '实现，达到',
            'difficulty': 3,
            'frequency': 7,
            'level': 'intermediate'
        },
        {
            'word': 'knowledge',
            'pronunciation': '/ˈnɑːlɪdʒ/',
            'partOfSpeech': 'noun',
            'definition': 'Facts, information, and skills acquired through experience or education.',
            'translation': '知识',
            'difficulty': 2,
            'frequency': 8,
            'level': 'intermediate'
        },
        {
            'word': 'experience',
            'pronunciation': '/ɪkˈspɪriəns/',
            'partOfSpeech': 'noun',
            'definition': 'Practical contact with and observation of facts or events.',
            'translation': '经验',
            'difficulty': 2,
            'frequency': 9,
            'level': 'beginner'
        },
        {
            'word': 'important',
            'pronunciation': '/ɪmˈpɔːrtnt/',
            'partOfSpeech': 'adjective',
            'definition': 'Of great significance or value; likely to have a profound effect on success.',
            'translation': '重要的',
            'difficulty': 1,
            'frequency': 10,
            'level': 'beginner'
        },
        {
            'word': 'development',
            'pronunciation': '/dɪˈveləpmənt/',
            'partOfSpeech': 'noun',
            'definition': 'The process of development or being developed.',
            'translation': '发展，开发',
            'difficulty': 3,
            'frequency': 7,
            'level': 'intermediate'
        }
    ]

    categories = {cat.name: cat for cat in VocabularyCategory.query.all()}

    for vocabInfo in additionalVocabulary:
        existingVocab = Vocabulary.query.filter_by(word=vocabInfo['word']).first()
        if not existingVocab:
            vocabulary = Vocabulary(
                word=vocabInfo['word'],
                pronunciation=vocabInfo.get('pronunciation', ''),
                partOfSpeech=vocabInfo.get('partOfSpeech', ''),
                definition=vocabInfo['definition'],
                translation=vocabInfo.get('translation', ''),
                difficulty=vocabInfo.get('difficulty', 1),
                frequency=vocabInfo.get('frequency', 1),
                level=vocabInfo.get('level', 'beginner'),
                tags=vocabInfo.get('tags', []),
                synonyms=vocabInfo.get('synonyms', []),
                antonyms=vocabInfo.get('antonyms', [])
            )

            db.session.add(vocabulary)
            print(f"  Created additional vocabulary: {vocabInfo['word']}")

    db.session.commit()
    print("Additional vocabulary created successfully!")


def main():
    """主函数"""
    print("Starting database seeding...")

    # 创建应用
    app = createApp('development')

    with app.app_context():
        print("Database connection established.")

        # 创建基础数据
        createVocabularyCategories()
        createBasicVocabulary()
        createAdditionalVocabulary()
        createTestUsers()

        print("\nDatabase seeding completed successfully!")
        print("\nSummary:")
        print(f"- Vocabulary Categories: {VocabularyCategory.query.count()}")
        print(f"- Vocabulary: {Vocabulary.query.count()}")
        print(f"- Users: {User.query.count()}")
        print(f"- User Vocabulary: {UserVocabulary.query.count()}")

        # 显示测试用户信息
        if os.getenv('FLASK_ENV') != 'production':
            print("\nTest Users:")
            testUsers = User.query.filter(User.username.in_(['admin', 'testuser', 'learner'])).all()
            for user in testUsers:
                print(f"- {user.email} (password: {'admin123' if user.username == 'admin' else 'user123' if user.username == 'testuser' else 'learn123'})")


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(f"Error during database seeding: {str(e)}")
        sys.exit(1)