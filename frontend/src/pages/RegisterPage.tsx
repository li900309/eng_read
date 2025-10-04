import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/components/base';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/common';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';
import { RegisterFormData } from '@/types';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const { success, error } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    const result = await registerUser(data);

    if (result.success) {
      success('注册成功！', '欢迎加入 Eng Read');
      navigate('/dashboard');
    } else {
      error('注册失败', result.error || '请检查您的注册信息');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card variant="elevated">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">创建新账户</CardTitle>
            <p className="text-muted-foreground">
              开始您的英语学习之旅
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="名字"
                  placeholder="请输入您的名字"
                  error={errors.firstName?.message}
                  {...register('firstName', {
                    required: '请输入名字',
                    minLength: {
                      value: 1,
                      message: '名字不能为空',
                    },
                  })}
                />

                <Input
                  label="姓氏"
                  placeholder="请输入您的姓氏"
                  error={errors.lastName?.message}
                  {...register('lastName', {
                    required: '请输入姓氏',
                    minLength: {
                      value: 1,
                      message: '姓氏不能为空',
                    },
                  })}
                />
              </div>

              <Input
                type="text"
                label="用户名"
                placeholder="请输入用户名"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.username?.message}
                {...register('username', {
                  required: '请输入用户名',
                  minLength: {
                    value: 3,
                    message: '用户名至少需要3个字符',
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: '用户名只能包含字母、数字和下划线',
                  },
                })}
              />

              <Input
                type="email"
                label="邮箱地址"
                placeholder="请输入您的邮箱"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email', {
                  required: '请输入邮箱地址',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '请输入有效的邮箱地址',
                  },
                })}
              />

              <div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  label="密码"
                  placeholder="请输入密码"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                  error={errors.password?.message}
                  {...register('password', {
                    required: '请输入密码',
                    minLength: {
                      value: 6,
                      message: '密码至少需要6个字符',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: '密码必须包含大小写字母和数字',
                    },
                  })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  密码必须包含大小写字母和数字，至少6个字符
                </p>
              </div>

              <div>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="确认密码"
                  placeholder="请再次输入密码"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', {
                    required: '请确认密码',
                    validate: (value) =>
                      value === password || '两次输入的密码不一致',
                  })}
                />
              </div>

              <div className="flex items-start">
                <input
                  id="accept-terms"
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  {...register('acceptTerms', {
                    required: '请同意服务条款和隐私政策',
                  })}
                />
                <label htmlFor="accept-terms" className="ml-2 block text-sm text-muted-foreground">
                  我同意{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    服务条款
                  </Link>{' '}
                  和{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    隐私政策
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-destructive">
                  {errors.acceptTerms.message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? '注册中...' : '创建账户'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">
                    已有账户？
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login">
                    立即登录
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;