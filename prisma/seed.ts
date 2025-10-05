import pkg from '@prisma/client'

const { PrismaClient } = pkg
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始数据库种子数据初始化...')

  // 创建词汇分类
  const categories = await Promise.all([
    prisma.vocabularyCategory.upsert({
      where: { name: '基础词汇' },
      update: {},
      create: {
        name: '基础词汇',
        description: '日常生活和基础交流常用词汇'
      }
    }),
    prisma.vocabularyCategory.upsert({
      where: { name: '学术词汇' },
      update: {},
      create: {
        name: '学术词汇',
        description: '学术研究和教育相关词汇'
      }
    }),
    prisma.vocabularyCategory.upsert({
      where: { name: '商务词汇' },
      update: {},
      create: {
        name: '商务词汇',
        description: '商务和职场相关词汇'
      }
    })
  ])

  // 创建示例词汇
  const vocabularies = [
    {
      word: 'example',
      pronunciation: '/ɪɡˈzæmpəl/',
      definition: '例子，范例',
      example: 'For example, this is a sample sentence.',
      difficulty: 1,
      frequency: 5,
      categoryId: categories[0].id
    },
    {
      word: 'algorithm',
      pronunciation: '/ˈælɡərɪðəm/',
      definition: '算法，计算程序',
      example: 'The search algorithm finds relevant results quickly.',
      difficulty: 3,
      frequency: 3,
      categoryId: categories[1].id
    },
    {
      word: 'meeting',
      pronunciation: '/ˈmiːtɪŋ/',
      definition: '会议，会面',
      example: 'We have a team meeting every Monday.',
      difficulty: 2,
      frequency: 4,
      categoryId: categories[2].id
    }
  ]

  for (const vocab of vocabularies) {
    await prisma.vocabulary.upsert({
      where: {
        word_categoryId: {
          word: vocab.word,
          categoryId: vocab.categoryId
        }
      },
      update: {},
      create: vocab
    })
  }

  // 创建示例阅读文章
  await prisma.readingArticle.upsert({
    where: { id: 'article-1' },
    update: {},
    create: {
      id: 'article-1',
      title: 'The Benefits of Learning English',
      content: `Learning English opens up a world of opportunities. It is the global language of business, science, and technology.

When you learn English, you can access more information online, connect with people from different cultures, and improve your career prospects. Many international companies require English proficiency, and it's often the language of scientific research and academic publications.

Furthermore, learning English can enhance your travel experiences. You'll be able to communicate with people from different countries and understand different cultures better. It's a skill that pays dividends throughout your life.`,
      summary: '学习英语的好处和重要性',
      difficulty: 2,
      wordCount: 98,
      readingTime: 3
    }
  })

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('password123', 12)

  await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      username: 'demo_user',
      passwordHash: hashedPassword,
      preferences: JSON.stringify({
        language: 'zh-CN',
        theme: 'light',
        dailyGoal: 10,
        difficultyLevel: 'intermediate'
      })
    }
  })

  console.log('数据库种子数据初始化完成!')
}

main()
  .catch((e) => {
    console.error('种子数据初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })