#!/bin/bash

# Eng Read 前端部署脚本
# 使用方法: ./scripts/deploy.sh [环境] [选项]
# 环境: dev|staging|prod
# 选项: --build-only, --deploy-only, --skip-tests, --force

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 解析命令行参数
ENVIRONMENT=""
BUILD_ONLY=false
DEPLOY_ONLY=false
SKIP_TESTS=false
FORCE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        dev|development)
            ENVIRONMENT="dev"
            shift
            ;;
        staging|stage)
            ENVIRONMENT="staging"
            shift
            ;;
        prod|production)
            ENVIRONMENT="prod"
            shift
            ;;
        --build-only)
            BUILD_ONLY=true
            shift
            ;;
        --deploy-only)
            DEPLOY_ONLY=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        -h|--help)
            echo "使用方法: $0 [环境] [选项]"
            echo ""
            echo "环境:"
            echo "  dev, development    开发环境"
            echo "  staging, stage      测试环境"
            echo "  prod, production    生产环境"
            echo ""
            echo "选项:"
            echo "  --build-only        仅构建，不部署"
            echo "  --deploy-only       仅部署，不构建"
            echo "  --skip-tests        跳过测试"
            echo "  --force             强制部署，忽略检查"
            echo "  -h, --help          显示帮助信息"
            exit 0
            ;;
        *)
            log_error "未知参数: $1"
            echo "使用 $0 --help 查看帮助信息"
            exit 1
            ;;
    esac
done

# 检查环境参数
if [[ -z "$ENVIRONMENT" ]]; then
    log_error "请指定部署环境"
    echo "使用 $0 --help 查看帮助信息"
    exit 1
fi

# 设置环境变量
case $ENVIRONMENT in
    dev)
        NODE_ENV="development"
        API_BASE_URL="http://localhost:3001/api"
        BUILD_COMMAND="npm run build:dev"
        ;;
    staging)
        NODE_ENV="staging"
        API_BASE_URL="https://api-staging.engread.com/api"
        BUILD_COMMAND="npm run build:staging"
        ;;
    prod)
        NODE_ENV="production"
        API_BASE_URL="https://api.engread.com/api"
        BUILD_COMMAND="npm run build:prod"
        ;;
esac

log_info "开始部署到 $ENVIRONMENT 环境"
log_info "Node.js 环境: $NODE_ENV"

# 项目信息
PROJECT_NAME="eng-read-frontend"
BUILD_DIR="dist"
DOCKER_IMAGE="$PROJECT_NAME:$ENVIRONMENT"
DOCKER_REGISTRY="ghcr.io/eng-read"

# 检查必要工具
check_dependencies() {
    log_info "检查依赖工具..."

    local tools=("node" "npm" "docker" "docker-compose")
    local missing_tools=()

    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            missing_tools+=("$tool")
        fi
    done

    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log_error "缺少必要工具: ${missing_tools[*]}"
        exit 1
    fi

    log_success "所有依赖工具已安装"
}

# 运行测试
run_tests() {
    if [[ "$SKIP_TESTS" == true ]]; then
        log_warning "跳过测试"
        return
    fi

    log_info "运行测试..."

    # 代码质量检查
    log_info "运行 ESLint..."
    npm run lint

    log_info "运行类型检查..."
    npm run test:types

    log_info "运行单元测试..."
    npm run test:coverage

    log_info "运行 E2E 测试..."
    npm run test:e2e

    log_success "所有测试通过"
}

# 构建应用
build_app() {
    log_info "构建应用..."

    # 设置环境变量
    export NODE_ENV="$NODE_ENV"
    export VITE_API_BASE_URL="$API_BASE_URL"
    export VITE_ENV="$ENVIRONMENT"

    # 清理旧的构建文件
    if [[ -d "$BUILD_DIR" ]]; then
        log_info "清理旧的构建文件..."
        rm -rf "$BUILD_DIR"
    fi

    # 安装依赖
    log_info "安装依赖..."
    npm ci

    # 构建应用
    log_info "执行构建命令: $BUILD_COMMAND"
    eval "$BUILD_COMMAND"

    # 检查构建结果
    if [[ ! -d "$BUILD_DIR" ]]; then
        log_error "构建失败: 未找到构建目录"
        exit 1
    fi

    log_success "应用构建完成"
}

# 构建 Docker 镜像
build_docker_image() {
    log_info "构建 Docker 镜像..."

    local image_tag="$DOCKER_REGISTRY/$PROJECT_NAME:$ENVIRONMENT"

    docker build \
        --build-arg NODE_ENV="$NODE_ENV" \
        --build-arg VITE_API_BASE_URL="$API_BASE_URL" \
        -t "$image_tag" \
        -f Dockerfile .

    # 添加 latest 标签（仅生产环境）
    if [[ "$ENVIRONMENT" == "prod" ]]; then
        docker tag "$image_tag" "$DOCKER_REGISTRY/$PROJECT_NAME:latest"
    fi

    log_success "Docker 镜像构建完成: $image_tag"
}

# 推送 Docker 镜像
push_docker_image() {
    log_info "推送 Docker 镜像..."

    local image_tag="$DOCKER_REGISTRY/$PROJECT_NAME:$ENVIRONMENT"

    docker push "$image_tag"

    if [[ "$ENVIRONMENT" == "prod" ]]; then
        docker push "$DOCKER_REGISTRY/$PROJECT_NAME:latest"
    fi

    log_success "Docker 镜像推送完成"
}

# 部署应用
deploy_app() {
    log_info "部署应用..."

    # 设置部署配置
    local compose_file="docker-compose.$ENVIRONMENT.yml"
    local compose_args="-f docker-compose.yml"

    if [[ -f "$compose_file" ]]; then
        compose_args="$compose_args -f $compose_file"
    fi

    # 设置环境变量
    export ENVIRONMENT="$ENVIRONMENT"
    export NODE_ENV="$NODE_ENV"
    export VITE_API_BASE_URL="$API_BASE_URL"

    # 拉取最新镜像
    log_info "拉取最新镜像..."
    eval "docker-compose $compose_args pull"

    # 停止旧容器
    log_info "停止旧容器..."
    eval "docker-compose $compose_args down"

    # 启动新容器
    log_info "启动新容器..."
    eval "docker-compose $compose_args up -d"

    # 等待应用启动
    log_info "等待应用启动..."
    sleep 10

    # 健康检查
    health_check

    log_success "应用部署完成"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."

    local max_attempts=30
    local attempt=1
    local health_url=""

    case $ENVIRONMENT in
        dev)
            health_url="http://localhost:3000/health"
            ;;
        staging)
            health_url="https://staging.engread.com/health"
            ;;
        prod)
            health_url="https://engread.com/health"
            ;;
    esac

    while [[ $attempt -le $max_attempts ]]; do
        if curl -f -s "$health_url" > /dev/null; then
            log_success "健康检查通过"
            return
        fi

        log_info "健康检查失败，等待 5 秒后重试... ($attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done

    log_error "健康检查失败，部署可能有问题"
    exit 1
}

# 清理旧镜像
cleanup() {
    log_info "清理旧镜像..."

    # 清理未使用的 Docker 镜像
    docker image prune -f

    # 清理旧版本镜像（保留最近3个版本）
    local images=$(docker images --format "table {{.Repository}}:{{.Tag}}" | grep "$DOCKER_REGISTRY/$PROJECT_NAME" | tail -n +4)
    local image_count=$(echo "$images" | wc -l)

    if [[ $image_count -gt 3 ]]; then
        echo "$images" | tail -n +4 | xargs -r docker rmi
    fi

    log_success "清理完成"
}

# 主函数
main() {
    local start_time=$(date +%s)

    log_info "开始部署流程..."

    # 检查是否为生产环境，如果是则需要确认
    if [[ "$ENVIRONMENT" == "prod" && "$FORCE" != true ]]; then
        read -p "确认要部署到生产环境吗? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "部署已取消"
            exit 0
        fi
    fi

    # 检查依赖
    check_dependencies

    # 运行测试
    if [[ "$DEPLOY_ONLY" != true ]]; then
        run_tests
    fi

    # 构建应用
    if [[ "$DEPLOY_ONLY" != true ]]; then
        build_app
        build_docker_image
        push_docker_image
    fi

    # 部署应用
    if [[ "$BUILD_ONLY" != true ]]; then
        deploy_app
    fi

    # 清理
    if [[ "$BUILD_ONLY" != true ]]; then
        cleanup
    fi

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    log_success "部署完成！耗时: ${duration}s"

    # 显示部署信息
    echo ""
    log_info "部署信息:"
    echo "  环境: $ENVIRONMENT"
    echo "  构建目录: $BUILD_DIR"
    echo "  Docker 镜像: $DOCKER_REGISTRY/$PROJECT_NAME:$ENVIRONMENT"

    if [[ "$BUILD_ONLY" != true ]]; then
        case $ENVIRONMENT in
            dev)
                echo "  访问地址: http://localhost:3000"
                ;;
            staging)
                echo "  访问地址: https://staging.engread.com"
                ;;
            prod)
                echo "  访问地址: https://engread.com"
                ;;
        esac
    fi
}

# 错误处理
trap 'log_error "部署过程中发生错误"; exit 1' ERR

# 执行主函数
main "$@"