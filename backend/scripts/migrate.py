#!/usr/bin/env python3
"""
数据库迁移脚本

该脚本用于初始化和升级数据库结构。
"""

import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import createApp
from app.extensions import db
from flask_migrate import init, migrate, upgrade, downgrade, revision


def initDatabase():
    """初始化数据库迁移"""
    print("Initializing database migration...")
    try:
        init()
        print("Database migration initialized successfully!")
    except Exception as e:
        print(f"Error initializing database migration: {str(e)}")


def createMigration(message="Auto migration"):
    """创建新的迁移文件"""
    print(f"Creating migration: {message}")
    try:
        migrate(message=message)
        print(f"Migration created successfully: {message}")
    except Exception as e:
        print(f"Error creating migration: {str(e)}")


def upgradeDatabase():
    """升级数据库"""
    print("Upgrading database...")
    try:
        upgrade()
        print("Database upgraded successfully!")
    except Exception as e:
        print(f"Error upgrading database: {str(e)}")


def downgradeDatabase(revision="base"):
    """降级数据库"""
    print(f"Downgrading database to revision: {revision}")
    try:
        downgrade(revision=revision)
        print(f"Database downgraded successfully to revision: {revision}")
    except Exception as e:
        print(f"Error downgrading database: {str(e)}")


def resetDatabase():
    """重置数据库（降级到基础版本再升级）"""
    print("Resetting database...")
    try:
        # 降级到基础版本
        downgrade(revision="base")
        # 升级到最新版本
        upgrade()
        print("Database reset successfully!")
    except Exception as e:
        print(f"Error resetting database: {str(e)}")


def checkDatabaseStatus():
    """检查数据库状态"""
    print("Checking database status...")
    try:
        # 检查数据库连接
        db.session.execute('SELECT 1')
        print("✓ Database connection: OK")

        # 检查表是否存在
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"✓ Tables found: {len(tables)}")

        if tables:
            print("Existing tables:")
            for table in sorted(tables):
                print(f"  - {table}")
        else:
            print("No tables found. Database needs migration.")

    except Exception as e:
        print(f"✗ Database connection failed: {str(e)}")


def showMigrationHistory():
    """显示迁移历史"""
    print("Migration history:")
    try:
        # 获取迁移历史
        from alembic.migration import MigrationContext
        from alembic.runtime.migration import MigrationInfo

        migrationContext = MigrationContext.configure(db.engine)
        currentRev = migrationContext.get_current_revision()
        print(f"Current revision: {currentRev}")

        # 显示所有迁移版本
        from flask_migrate import current
        scriptDirectory = current()
        heads = script_directory.get_heads()
        print(f"Available heads: {heads}")

    except Exception as e:
        print(f"Error getting migration history: {str(e)}")


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python migrate.py init                    # Initialize migration")
        print("  python migrate.py migrate [message]       # Create migration")
        print("  python migrate.py upgrade                 # Upgrade database")
        print("  python migrate.py downgrade [revision]    # Downgrade database")
        print("  python migrate.py reset                   # Reset database")
        print("  python migrate.py status                  # Check database status")
        print("  python migrate.py history                 # Show migration history")
        sys.exit(1)

    command = sys.argv[1]
    message = sys.argv[2] if len(sys.argv) > 2 else "Auto migration"
    revision = sys.argv[2] if len(sys.argv) > 2 else "base"

    # 创建应用
    app = createApp()

    with app.app_context():
        if command == "init":
            initDatabase()
        elif command == "migrate":
            createMigration(message)
        elif command == "upgrade":
            upgradeDatabase()
        elif command == "downgrade":
            downgradeDatabase(revision)
        elif command == "reset":
            resetDatabase()
        elif command == "status":
            checkDatabaseStatus()
        elif command == "history":
            showMigrationHistory()
        else:
            print(f"Unknown command: {command}")
            sys.exit(1)


if __name__ == '__main__':
    main()