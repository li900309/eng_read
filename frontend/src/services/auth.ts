import { BaseApiService, ApiResponse, PaginatedResponse } from './api';
import { LoginFormData, RegisterFormData, User } from '@/types';

// 认证相关类型定义
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ConfirmResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string;
  preferences?: User['preferences'];
}

export class AuthService extends BaseApiService {
  // 用户登录
  async login(credentials: LoginFormData): Promise<LoginResponse> {
    return this.post<LoginResponse>('/auth/login', credentials);
  }

  // 用户注册
  async register(userData: RegisterFormData): Promise<RegisterResponse> {
    return this.post<RegisterResponse>('/auth/register', userData);
  }

  // 刷新令牌
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    return this.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
  }

  // 用户登出
  async logout(): Promise<void> {
    return this.post<void>('/auth/logout');
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<User> {
    return this.get<User>('/auth/me');
  }

  // 忘记密码
  async forgotPassword(email: string): Promise<void> {
    return this.post<void>('/auth/forgot-password', { email });
  }

  // 重置密码
  async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.post<void>('/auth/reset-password', { token, newPassword });
  }

  // 确认邮箱
  async confirmEmail(token: string): Promise<void> {
    return this.post<void>('/auth/confirm-email', { token });
  }

  // 重新发送确认邮件
  async resendConfirmationEmail(): Promise<void> {
    return this.post<void>('/auth/resend-confirmation');
  }

  // 修改密码
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return this.post<void>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  // 更新用户资料
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    return this.patch<User>('/auth/profile', data);
  }

  // 上传头像
  async uploadAvatar(file: File, onProgress?: (progress: number) => void): Promise<{ avatarUrl: string }> {
    return this.upload<{ avatarUrl: string }>('/auth/avatar', file, onProgress);
  }

  // 删除账户
  async deleteAccount(password: string): Promise<void> {
    return this.delete<void>('/auth/account', {
      data: { password }
    });
  }

  // 获取登录历史
  async getLoginHistory(page: number = 1, limit: number = 20): Promise<PaginatedResponse<{
    id: string;
    ip: string;
    userAgent: string;
    location?: string;
    createdAt: string;
  }>> {
    return this.get<PaginatedResponse<any>>('/auth/login-history', {
      params: { page, limit }
    });
  }

  // 撤销所有会话
  async revokeAllSessions(): Promise<void> {
    return this.post<void>('/auth/revoke-sessions');
  }

  // 启用两步验证
  async enable2FA(): Promise<{ qrCode: string; secret: string }> {
    return this.post<{ qrCode: string; secret: string }>('/auth/2fa/enable');
  }

  // 确认两步验证设置
  async confirm2FA(secret: string, code: string): Promise<{ backupCodes: string[] }> {
    return this.post<{ backupCodes: string[] }>('/auth/2fa/confirm', {
      secret,
      code,
    });
  }

  // 禁用两步验证
  async disable2FA(code: string): Promise<void> {
    return this.post<void>('/auth/2fa/disable', { code });
  }

  // 验证两步验证代码
  async verify2FACode(code: string): Promise<{ valid: boolean }> {
    return this.post<{ valid: boolean }>('/auth/2fa/verify', { code });
  }

  // 生成新的备份代码
  async regenerateBackupCodes(): Promise<{ backupCodes: string[] }> {
    return this.post<{ backupCodes: string[] }>('/auth/2fa/regenerate-codes');
  }
}

// 创建认证服务实例
export const authService = new AuthService();

// 导出默认实例
export default authService;