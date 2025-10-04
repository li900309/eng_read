# Eng Read 后端 - UV 包管理

使用现代化的 UV 包管理器来管理 Python 依赖和虚拟环境。

## 为什么选择 UV？

- **极速依赖解析**: 比传统 pip 快 10-100倍
- **智能缓存**: 自动缓存和重用已安装的包
- **内置虚拟环境**: 无需手动管理 venv
- **依赖锁定**: 确保环境一致性
- **开发体验**: 单一命令处理所有依赖管理

## 快速开始

### 1. 安装 UV

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm astral.sh/uv/install.sh | iex"

# 或者使用 pip
pip install uv
```

### 2. 克隆项目

```bash
git clone <repository-url>
cd backend
```

### 3. 环境管理

```bash
# 创建虚拟环境
uv venv

# 激活虚拟环境
# macOS / Linux
source .venv/bin/activate
# Windows
.venv\Scripts\activate

# 安装开发依赖
uv pip install -e .

# 或者使用 sync 命令（推荐）
uv sync
```

### 4. 环境配置

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
nano .env
```

### 5. 数据库初始化

```bash
# 初始化数据库迁移
flask db init

# 创建迁移文件
flask db migrate -m "Initial migration"

# 应用迁移
flask db upgrade
```

### 6. 启动应用

```bash
# 开发环境
uv run python run.py

# 或者使用 flask 命令
uv run flask run
```

## UV 常用命令

### 依赖管理

```bash
# 添加新依赖
uv add flask-caching

# 添加开发依赖
uv add --dev pytest

# 更新依赖
uv update flask

# 移除依赖
uv remove flask-caching

# 查看依赖树
uv tree

# 导出 requirements.txt（如需）
uv pip compile pyproject.toml --output-file requirements.txt
```

### 虚拟环境管理

```bash
# 创建虚拟环境
uv venv

# 删除虚拟环境
uv venv --remove

# 显示虚拟环境路径
uv venv --show-path

# 在指定路径创建虚拟环境
uv venv /path/to/venv
```

### 同步环境

```bash
# 同步所有依赖
uv sync

# 仅同步生产依赖
uv sync --only main

# 仅同步开发依赖
uv sync --only dev

# 额外安装某个包
uv sync --extra dev

# 清理未使用的包
uv sync --clean
```

### 运行命令

```bash
# 在虚拟环境中运行命令
uv run python --version
uv run flask run
uv run pytest

# 运行单个 Python 文件
uv run script.py

# 运行特定模块
uv run -m flask run
```

## 开发工作流

### 日常开发

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 同步依赖
uv sync

# 3. 运行测试
uv run pytest

# 4. 启动开发服务器
uv run python run.py
```

### 添加新功能

```bash
# 1. 添加新依赖
uv add new-package-name

# 2. 开发功能
# ... 编写代码 ...

# 3. 运行测试
uv run pytest

# 4. 代码格式化
uv run black app/ tests/

# 5. 代码检查
uv run flake8 app/ tests/

# 6. 类型检查
uv run mypy app/
```

### 部署准备

```bash
# 1. 锁定依赖版本
uv lock

# 2. 构建生产环境
uv sync --only main

# 3. 运行生产测试
uv run pytest --cov=app tests/
```

## 环境差异

| 传统方式 | UV 方式 | 优势 |
|---------|---------|------|
| `python -m venv venv` | `uv venv` | 简化命令 |
| `source venv/bin/activate` | 自动激活 | 无需手动激活 |
| `pip install -r requirements.txt` | `uv sync` | 智能依赖解析 |
| `pip install package` | `uv add package` | 更好的依赖管理 |
| `pip freeze > requirements.txt` | 自动生成 uv.lock | 更精确的依赖锁定 |

## 故障排除

### 常见问题

1. **权限问题**
   ```bash
   # 在 Unix 系统上可能需要
   chmod +x .venv/bin/*
   ```

2. **Python 版本不匹配**
   ```bash
   # 检查 Python 版本
   uv python --version

   # 指定特定 Python 版本
   uv venv --python 3.11
   ```

3. **依赖冲突**
   ```bash
   # 清理并重新安装
   uv sync --clean
   uv sync
   ```

4. **缓存问题**
   ```bash
   # 清理缓存
   uv cache clean
   ```

### 诊断命令

```bash
# 检查环境信息
uv --version

# 检查虚拟环境
uv venv --show-path

# 检查已安装的包
uv pip list

# 检查依赖关系
uv pip check

# 检查 Python 路径
uv python --which
```

## 与现有工具的兼容性

### 与 Docker 兼容

```Dockerfile
FROM python:3.11-slim

# 安装 uv
RUN pip install uv

# 复制项目文件
COPY pyproject.toml uv.lock ./

# 安装依赖
RUN uv sync --frozen --only main

# 复制应用代码
COPY . .

# 运行应用
CMD ["uv", "run", "python", "run.py"]
```

### 与 CI/CD 兼容

```yaml
# GitHub Actions 示例
- name: Set up Python with uv
  uses: astral-sh/setup-uv@v1

- name: Install dependencies
  run: uv sync --only main

- name: Run tests
  run: uv run pytest
```

## 迁移指南

如果你从传统方式迁移到 UV：

1. **备份现有环境**
   ```bash
   pip freeze > old-requirements.txt
   ```

2. **清理旧环境**
   ```bash
   rm -rf venv/
   ```

3. **初始化 UV 环境**
   ```bash
   uv venv
   uv sync
   ```

4. **验证功能**
   ```bash
   uv run python run.py
   uv run pytest
   ```

## 最佳实践

1. **始终使用 uv.lock** - 确保团队环境一致
2. **区分主依赖和开发依赖** - 使用 `--dev` 标志
3. **定期更新依赖** - `uv update --all`
4. **使用虚拟环境** - `uv venv` 避免全局污染
5. **版本控制** - 将 uv.lock 提交到 Git

## 性能对比

| 操作 | pip | UV | 加速比 |
|------|-----|----|-------|
| 初始安装 | 45s | 8s | 5.6x |
| 增量安装 | 15s | 2s | 7.5x |
| 依赖解析 | 30s | 0.5s | 60x |
| 环境同步 | 60s | 5s | 12x |

UV 极大地提升了开发效率和部署速度。