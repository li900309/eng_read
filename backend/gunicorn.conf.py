"""
Gunicorn 配置文件
生产环境 WSGI 服务器配置
"""

import multiprocessing
import os

# 服务器绑定
bind = '0.0.0.0:5000'

# 工作进程数
# 通常建议 (2 * CPU核心数) + 1
workers = multiprocessing.cpu_count() * 2 + 1

# 工作进程类型
workerClass = 'sync'

# 每个工作进程的线程数
threads = 2

# 工作进程连接数
workerConnections = 1000

# 超时设置
timeout = 30
keepalive = 2

# 最大请求数
maxRequests = 1000
maxRequestsJitter = 50

# 预加载应用
preloadApp = True

# 用户和组
user = None
group = None

# 日志配置
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# 进程命名
procName = 'eng-read-backend'

# 临时目录
tmpUploadDir = None

# 进程文件
pidfile = '/tmp/gunicorn.pid'

# 守护进程模式
daemon = False

# 优雅关闭超时
gracefulTimeout = 30

# 重启超时
timeout = 30

# 限制请求大小
limitRequestLine = 0
limitRequestFields = 100
limitRequestFieldSize = 8190

# SSL 配置
keyfile = None
certfile = None

# 环境变量
rawEnv = [
    'FLASK_ENV=production',
    'PATH=/usr/local/bin:/usr/bin:/bin'
]

# 服务器钩子
def onStarting(server):
    """服务器启动时调用"""
    server.log.info("Eng Read backend is starting...")

def onReload(server):
    """重新加载时调用"""
    server.log.info("Eng Read backend is reloading...")

def whenReady(server):
    """服务器就绪时调用"""
    server.log.info("Eng Read backend is ready to serve requests.")

def workerInt(worker):
    """工作进程收到 SIGINT 信号时调用"""
    worker.log.info("Worker received INT or QUIT signal")

def preFork(server, worker):
    """Fork 工作进程之前调用"""
    server.log.info(f"Worker spawned (pid: {worker.pid})")

def postFork(server, worker):
    """Fork 工作进程之后调用"""
    server.log.info(f"Worker spawned (pid: {worker.pid})")

def postWorkerInit(worker):
    """工作进程初始化完成后调用"""
    worker.log.info(f"Worker initialized (pid: {worker.pid})")

def workerExit(server, worker):
    """工作进程退出时调用"""
    worker.log.info(f"Worker exiting (pid: {worker.pid})")

def childExit(server, worker):
    """子进程退出时调用"""
    server.log.info(f"Child worker exited (pid: {worker.pid})")

# 优雅关闭
def workerAbort(worker):
    """工作进程异常退出时调用"""
    worker.log.info(f"Worker aborted (pid: {worker.pid})")

# 统计
statsdHost = None
statsdPrefix = ''

# 服务器机制
serverMechanism = 'default'