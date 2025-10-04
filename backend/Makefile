# Eng Read 后端 Makefile
# 使用 UV 包管理器

.PHONY: help install dev test lint format clean run db-upgrade db-migrate deploy optimize frozen-sync

# 默认目标
help:
	@echo "Eng Read 后端开发命令"
	@echo ""
	@echo "设置:"
	@echo "  install     安装所有依赖"
	@echo "  dev         安装开发依赖"
	@echo "  clean       清理缓存和临时文件"
	@echo ""
	@echo "开发:"
	@echo "  run         启动开发服务器"
	@echo "  test        运行测试"
	@echo "  test-cov    运行测试并生成覆盖率报告"
	@echo "  lint        代码检查"
	@echo "  format      代码格式化"
	@echo ""
	@echo "数据库:"
	@echo "  db-init     初始化数据库"
	@echo "  db-migrate  创建数据库迁移"
	@echo "  db-upgrade  应用数据库迁移"
	@echo "  db-seed     填充初始数据"
	@echo ""
	@echo "部署:"
	@echo "  build       构建生产环境"
	@echo "  deploy      部署到生产环境"
	@echo ""
	@echo "UV 工具:"
	@echo "  optimize    优化UV环境和缓存"
	@echo "  frozen-sync 同步冻结的依赖"

# 设置命令
install:
	@if [ ! -d ".venv" ]; then uv venv; fi
	uv sync

dev:
	@if [ ! -d ".venv" ]; then uv venv; fi
	uv sync --all-extras

clean:
	@echo "清理缓存和临时文件..."
	uv cache clean
	rm -rf .coverage
	rm -rf htmlcov/
	rm -rf .pytest_cache/
	rm -rf .mypy_cache/
	rm -rf build/
	rm -rf dist/
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

# 开发命令
run:
	uv run python run.py

test:
	uv run pytest

test-cov:
	uv run pytest --cov=app --cov-report=html --cov-report=term

lint:
	@echo "运行代码检查..."
	uv run flake8 app/ tests/
	uv run mypy app/
	uv run bandit -r app/

format:
	@echo "格式化代码..."
	uv run black app/ tests/
	uv run isort app/ tests/
	uv run autopep8 --in-place --recursive app/ tests/

check:
	@echo "运行所有检查..."
	$(MAKE) lint
	$(MAKE) test
	@echo "✅ 所有检查通过！"

# 数据库命令
db-init:
	uv run flask db init

db-migrate:
	uv run flask db migrate -m "$(MSG)"

db-upgrade:
	uv run flask db upgrade

db-seed:
	uv run python scripts/seed_data.py

db-reset:
	uv run flask db downgrade base
	$(MAKE) db-upgrade
	$(MAKE) db-seed

# 开发工作流
dev-setup: install db-init db-upgrade
	@echo "🚀 开发环境设置完成！"

dev-test: format lint test
	@echo "✅ 开发测试完成！"

# 生产命令
build:
	@echo "构建生产环境..."
	uv sync --only main
	uv run pip freeze > requirements.txt

deploy: build
	@echo "部署到生产环境..."
	# 这里可以添加具体的部署脚本
	gunicorn -c gunicorn.conf.py run:app

# UV 优化命令
optimize:
	@echo "优化UV环境..."
	uv cache clean
	uv sync --clean

frozen-sync:
	@echo "同步冻结的依赖..."
	uv sync --frozen

# 数据库迁移工作流
migrate:
	@read -p "输入迁移描述: " msg; \
	uv run flask db migrate -m "$$msg"

migrate-up:
	$(MAKE) db-migrate MSG="Auto migration"
	$(MAKE) db-upgrade

# 安全检查
security:
	@echo "运行安全检查..."
	uv run safety check
	uv run bandit -r app/

# 性能分析
profile:
	uv run python -m cProfile -o profile.stats run.py

benchmark:
	uv run pytest --benchmark-only

# 文档生成
docs:
	uv run sphinx-build -b html docs/ docs/_build/

# 日志查看
logs:
	tail -f logs/app.log

# 环境信息
info:
	@echo "=== 环境信息 ==="
	@echo "Python: $(shell uv python --version)"
	@echo "UV: $(shell uv --version)"
	@echo "虚拟环境: $(shell uv venv --show-path)"
	@echo "已安装包: $(shell uv pip list | wc -l) 个"

# 重置开发环境
reset-dev: clean install db-init db-upgrade db-seed
	@echo "🔄 开发环境已重置！"

# 快速命令别名
s: run       # server
t: test      # test
f: format    # format
l: lint      # lint