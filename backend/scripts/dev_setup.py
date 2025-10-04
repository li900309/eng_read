#!/usr/bin/env python3
"""
开发环境设置脚本

该脚本用于快速设置开发环境，包括：
- 创建虚拟环境
- 安装依赖
- 初始化数据库
- 填充种子数据
"""

import sys
import os
import subprocess
import shutil


def runCommand(command, description="", check=True):
    """运行命令"""
    if description:
        print(f"\n{'='*60}")
        print(f"Running: {description}")
        print(f"Command: {command}")
        print('='*60)

    try:
        result = subprocess.run(command, shell=True, check=check, capture_output=True, text=True)
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        if e.stderr:
            print(f"Error output: {e.stderr}")
        return False


def checkPythonVersion():
    """检查Python版本"""
    print("Checking Python version...")
    version = sys.version_info
    if version.major == 3 and version.minor >= 8:
        print(f"✓ Python {version.major}.{version.minor}.{version.micro} is compatible")
        return True
    else:
        print(f"✗ Python {version.major}.{version.minor}.{version.micro} is not compatible. Python 3.8+ required.")
        return False


def checkUV():
    """检查UV是否安装"""
    print("Checking UV installation...")
    try:
        result = subprocess.run(['uv', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✓ UV is installed: {result.stdout.strip()}")
            return True
        else:
            print("✗ UV is not installed")
            return False
    except FileNotFoundError:
        print("✗ UV is not installed")
        return False


def installUV():
    """安装UV"""
    print("Installing UV...")
    return runCommand(
        'curl -LsSf https://astral.sh/uv/install.sh | sh',
        "Installing UV package manager"
    )


def setupVirtualEnvironment():
    """设置虚拟环境"""
    print("Setting up virtual environment...")

    # 检查是否已有虚拟环境
    if os.path.exists('.venv'):
        print("✓ Virtual environment already exists")
        return True

    # 创建虚拟环境
    if not runCommand('uv venv', "Creating virtual environment"):
        return False

    print("✓ Virtual environment created successfully")
    return True


def installDependencies():
    """安装依赖"""
    print("Installing dependencies...")

    # 同步依赖
    if not runCommand('uv sync --all-extras', "Installing dependencies with UV"):
        return False

    print("✓ Dependencies installed successfully")
    return True


def createEnvFile():
    """创建环境变量文件"""
    print("Creating environment file...")

    if os.path.exists('.env'):
        print("✓ .env file already exists")
        return True

    # 复制示例文件
    if os.path.exists('.env.example'):
        shutil.copy('.env.example', '.env')
        print("✓ .env file created from .env.example")
        print("Please review and update the .env file with your settings")
        return True
    else:
        print("✗ .env.example file not found")
        return False


def initializeDatabase():
    """初始化数据库"""
    print("Initializing database...")

    # 检查数据库状态
    runCommand('python scripts/migrate.py status', "Checking database status", check=False)

    # 初始化迁移
    if not os.path.exists('migrations'):
        if not runCommand('python scripts/migrate.py init', "Initializing database migration"):
            return False

    # 创建迁移
    if not runCommand('python scripts/migrate.py migrate "Initial migration"', "Creating initial migration"):
        return False

    # 升级数据库
    if not runCommand('python scripts/migrate.py upgrade', "Upgrading database"):
        return False

    print("✓ Database initialized successfully")
    return True


def seedDatabase():
    """填充种子数据"""
    print("Seeding database...")

    if not runCommand('python scripts/seed_data.py', "Seeding database with initial data"):
        return False

    print("✓ Database seeded successfully")
    return True


def createDirectories():
    """创建必要的目录"""
    print("Creating necessary directories...")

    directories = [
        'logs',
        'uploads',
        'temp',
        'backups'
    ]

    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"✓ Created directory: {directory}")
        else:
            print(f"✓ Directory already exists: {directory}")


def runTests():
    """运行测试"""
    print("Running tests...")

    if runCommand('uv run python -m pytest tests/ -v', "Running tests", check=False):
        print("✓ Tests passed")
        return True
    else:
        print("✗ Some tests failed, but setup continues")
        return False


def printSetupSummary():
    """打印设置摘要"""
    print("\n" + "="*60)
    print("DEVELOPMENT ENVIRONMENT SETUP COMPLETED!")
    print("="*60)

    print("\nNext steps:")
    print("1. Review and update .env file with your settings")
    print("2. Start the development server:")
    print("   uv run python run.py")
    print("   or: make run")
    print("\n3. Access the API at: http://localhost:5000")
    print("4. Check health at: http://localhost:5000/health")
    print("5. View API docs at: http://localhost:5000/api")

    print("\nTest Accounts:")
    print("- Admin: admin@engread.com / admin123")
    print("- User: user@engread.com / user123")
    print("- Learner: learner@engread.com / learn123")

    print("\nUseful Commands:")
    print("- make run          # Start server")
    print("- make test         # Run tests")
    print("- make format       # Format code")
    print("- make lint         # Check code quality")
    print("- make db-upgrade   # Upgrade database")
    print("- make db-seed      # Seed database")


def main():
    """主函数"""
    print("Eng Read Backend - Development Environment Setup")
    print("="*60)

    # 切换到项目根目录
    scriptDir = os.path.dirname(os.path.abspath(__file__))
    projectDir = os.path.dirname(scriptDir)
    os.chdir(projectDir)

    print(f"Working directory: {projectDir}")

    # 检查Python版本
    if not checkPythonVersion():
        sys.exit(1)

    # 检查UV
    if not checkUV():
        print("Installing UV...")
        if not installUV():
            print("Failed to install UV. Please install it manually.")
            sys.exit(1)

        # 重新加载环境变量
        print("Please restart your terminal or run 'source ~/.bashrc' to use UV")
        sys.exit(1)

    # 设置步骤
    steps = [
        ("Creating virtual environment", setupVirtualEnvironment),
        ("Installing dependencies", installDependencies),
        ("Creating environment file", createEnvFile),
        ("Creating directories", createDirectories),
        ("Initializing database", initializeDatabase),
        ("Seeding database", seedDatabase),
    ]

    # 执行设置步骤
    failedSteps = []
    for stepName, stepFunction in steps:
        print(f"\n{'='*60}")
        print(f"Step: {stepName}")
        print('='*60)

        if not stepFunction():
            failedSteps.append(stepName)
            print(f"✗ Failed: {stepName}")

            # 询问是否继续
            response = input("Continue with next step? (y/n): ").lower()
            if response != 'y':
                print("Setup cancelled by user")
                sys.exit(1)
        else:
            print(f"✓ Completed: {stepName}")

    # 运行测试（可选）
    print(f"\n{'='*60}")
    response = input("Run tests to verify setup? (y/n): ").lower()
    if response == 'y':
        runTests()

    # 打印摘要
    printSetupSummary()

    if failedSteps:
        print(f"\nWarning: {len(failedSteps)} steps failed:")
        for step in failedSteps:
            print(f"  - {step}")
        print("\nPlease review and fix these issues manually.")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\nSetup cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\nSetup failed with error: {str(e)}")
        sys.exit(1)