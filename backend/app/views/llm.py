"""
LLM相关API视图

提供LLM功能的HTTP接口。
"""

import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services import getLLMService, PromptTemplates, LLMMessage
from app.extensions import cache, limiter


llmBlueprint = Blueprint('llm', __name__, url_prefix='/api/llm')
logger = logging.getLogger(__name__)


@llmBlueprint.route('/chat', methods=['POST'])
@jwt_required()
@limiter.limit('10 per minute')
def chat():
    """通用聊天接口"""
    try:
        data = request.get_json()
        if not data or 'messages' not in data:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_REQUEST',
                    'message': '缺少messages参数'
                }
            }), 400

        # 解析消息
        messages_data = data['messages']
        messages = []
        for msg_data in messages_data:
            if 'role' not in msg_data or 'content' not in msg_data:
                return jsonify({
                    'success': False,
                    'error': {
                        'code': 'INVALID_MESSAGE',
                        'message': '消息格式错误，需要role和content字段'
                    }
                }), 400
            messages.append(LLMMessage(role=msg_data['role'], content=msg_data['content']))

        # 获取LLM服务
        llmService = getLLMService()

        # 获取供应商和模型
        provider = data.get('provider', 'local')
        model = data.get('model', 'local-model')

        # 调用LLM
        response = llmService.chat(messages, provider, model)

        if response.success:
            return jsonify({
                'success': True,
                'data': {
                    'content': response.content,
                    'usage': response.usage
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'LLM_ERROR',
                    'message': response.error or 'LLM服务调用失败'
                }
            }), 500

    except Exception as e:
        logger.error(f"聊天接口异常: {str(e)}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': '内部服务器错误'
            }
        }), 500


@llmBlueprint.route('/reading-assistant', methods=['POST'])
@jwt_required()
@limiter.limit('5 per minute')
def readingAssistant():
    """阅读助手接口"""
    try:
        data = request.get_json()
        if not data or 'content' not in data:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_REQUEST',
                    'message': '缺少content参数'
                }
            }), 400

        content = data['content']
        difficulty = data.get('difficulty', 5)

        # 获取LLM服务
        llmService = getLLMService()

        # 使用模板调用LLM
        response = llmService.chatWithTemplate(
            PromptTemplates.readingAssistant(content, difficulty),
            content=content,
            difficulty=difficulty
        )

        if response.success:
            return jsonify({
                'success': True,
                'data': {
                    'content': response.content,
                    'usage': response.usage
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'LLM_ERROR',
                    'message': response.error or 'LLM服务调用失败'
                }
            }), 500

    except Exception as e:
        logger.error(f"阅读助手接口异常: {str(e)}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': '内部服务器错误'
            }
        }), 500


@llmBlueprint.route('/vocabulary-practice', methods=['POST'])
@jwt_required()
@limiter.limit('10 per minute')
def vocabularyPractice():
    """词汇练习接口"""
    try:
        data = request.get_json()
        if not data or 'word' not in data or 'context' not in data:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_REQUEST',
                    'message': '缺少word或context参数'
                }
            }), 400

        word = data['word']
        context = data['context']

        # 获取LLM服务
        llmService = getLLMService()

        # 使用模板调用LLM
        response = llmService.chatWithTemplate(
            PromptTemplates.vocabularyPractice(word, context),
            word=word,
            context=context
        )

        if response.success:
            return jsonify({
                'success': True,
                'data': {
                    'content': response.content,
                    'usage': response.usage
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'LLM_ERROR',
                    'message': response.error or 'LLM服务调用失败'
                }
            }), 500

    except Exception as e:
        logger.error(f"词汇练习接口异常: {str(e)}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': '内部服务器错误'
            }
        }), 500


@llmBlueprint.route('/writing-feedback', methods=['POST'])
@jwt_required()
@limiter.limit('5 per minute')
def writingFeedback():
    """写作反馈接口"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_REQUEST',
                    'message': '缺少text参数'
                }
            }), 400

        text = data['text']
        level = data.get('level', 'intermediate')

        # 获取LLM服务
        llmService = getLLMService()

        # 使用模板调用LLM
        response = llmService.chatWithTemplate(
            PromptTemplates.writingFeedback(text, level),
            text=text,
            level=level
        )

        if response.success:
            return jsonify({
                'success': True,
                'data': {
                    'content': response.content,
                    'usage': response.usage
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'LLM_ERROR',
                    'message': response.error or 'LLM服务调用失败'
                }
            }), 500

    except Exception as e:
        logger.error(f"写作反馈接口异常: {str(e)}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': '内部服务器错误'
            }
        }), 500


@llmBlueprint.route('/providers', methods=['GET'])
@jwt_required()
# @cache.cache(timeout=3600)  # 缓存1小时
def getProviders():
    """获取可用的供应商列表"""
    try:
        llmService = getLLMService()
        providers = llmService.configManager.getAllProviders()

        provider_list = []
        for provider_id, provider_config in providers.items():
            models = []
            for model_id in provider_config.get('models', {}):
                models.append({
                    'id': model_id,
                    'name': model_id,
                    'config': provider_config['models'][model_id]
                })

            provider_list.append({
                'id': provider_id,
                'name': provider_config.get('name', provider_id),
                'base_url': provider_config.get('base_url', ''),
                'models': models
            })

        return jsonify({
            'success': True,
            'data': {
                'providers': provider_list
            }
        })

    except Exception as e:
        logger.error(f"获取供应商列表异常: {str(e)}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': '内部服务器错误'
            }
        }), 500


@llmBlueprint.route('/load-config', methods=['POST'])
@jwt_required()
def loadConfig():
    """加载自定义配置文件"""
    try:
        data = request.get_json()
        if not data or 'config_file' not in data:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_REQUEST',
                    'message': '缺少config_file参数'
                }
            }), 400

        config_file = data['config_file']

        # 检查文件是否存在
        if not os.path.exists(config_file):
            return jsonify({
                'success': False,
                'error': {
                    'code': 'FILE_NOT_FOUND',
                    'message': f'配置文件不存在: {config_file}'
                }
            }), 404

        # 加载配置
        from app.services import getLLMServiceWithConfig
        llmService = getLLMServiceWithConfig(config_file)

        # 获取加载的供应商信息
        providers = llmService.configManager.getAllProviders()

        provider_list = []
        for provider_id, provider_config in providers.items():
            models = []
            for model_id in provider_config.get('models', {}):
                models.append({
                    'id': model_id,
                    'name': model_id,
                    'config': provider_config['models'][model_id]
                })

            provider_list.append({
                'id': provider_id,
                'name': provider_config.get('name', provider_id),
                'base_url': provider_config.get('base_url', ''),
                'models': models
            })

        return jsonify({
            'success': True,
            'data': {
                'config_file': config_file,
                'providers': provider_list,
                'message': f'成功加载配置文件，包含 {len(provider_list)} 个供应商'
            }
        })

    except Exception as e:
        logger.error(f"加载配置文件异常: {str(e)}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': f'加载配置失败: {str(e)}'
            }
        }), 500