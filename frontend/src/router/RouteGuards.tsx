import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store';

// Role-based access control
export interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: Array<'student' | 'teacher' | 'admin'>;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles = ['student'],
  fallback,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">访问被拒绝</h1>
          <p className="text-muted-foreground">您没有权限访问此页面。</p>
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Subscription/feature access guard
export interface FeatureGuardProps {
  children: React.ReactNode;
  requiredFeatures?: string[];
  fallback?: React.ReactNode;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  children,
  requiredFeatures = [],
  fallback,
}) => {
  const { user, isAuthenticated } = useAuth();

  // This would typically check user's subscription plan or unlocked features
  const hasRequiredFeatures = React.useMemo(() => {
    if (!user || !requiredFeatures.length) return true;

    // Placeholder logic - would check against user's subscription/features
    return requiredFeatures.every(feature => {
      switch (feature) {
        case 'advanced_analytics':
          return user.role === 'admin' || user.role === 'teacher';
        case 'unlimited_sessions':
          return true; // All users have unlimited sessions for now
        case 'premium_content':
          return user.role !== 'student'; // Non-students have premium content
        default:
          return true;
      }
    });
  }, [user, requiredFeatures]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRequiredFeatures) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold text-foreground">需要高级版</h1>
          <p className="text-muted-foreground">
            此功能需要高级版订阅才能使用。升级您的账户以解锁所有功能。
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="btn btn-outline"
            >
              返回
            </button>
            <button className="btn btn-primary">
              升级到高级版
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Onboarding guard
export interface OnboardingGuardProps {
  children: React.ReactNode;
  requireCompletedOnboarding?: boolean;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({
  children,
  requireCompletedOnboarding = true,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has completed onboarding
  const hasCompletedOnboarding = user.preferences?.onboardingCompleted || false;

  if (requireCompletedOnboarding && !hasCompletedOnboarding) {
    // Don't redirect if already on onboarding page
    if (location.pathname.startsWith('/onboarding')) {
      return <>{children}</>;
    }

    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Email verification guard
export interface EmailVerificationGuardProps {
  children: React.ReactNode;
  requireVerifiedEmail?: boolean;
}

export const EmailVerificationGuard: React.FC<EmailVerificationGuardProps> = ({
  children,
  requireVerifiedEmail = false,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { addNotification } = useUIStore();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireVerifiedEmail && !user.emailVerified) {
    // Don't redirect if already on verification page
    if (location.pathname.startsWith('/verify-email')) {
      return <>{children}</>;
    }

    // Show notification
    React.useEffect(() => {
      addNotification({
        type: 'warning',
        title: '需要验证邮箱',
        message: '请验证您的邮箱地址以继续使用所有功能。',
        duration: 10000,
      });
    }, [addNotification]);

    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Combined guard for multiple conditions
export interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: Array<'student' | 'teacher' | 'admin'>;
  requiredFeatures?: string[];
  requireCompletedOnboarding?: boolean;
  requireVerifiedEmail?: boolean;
  fallback?: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requireAuth = true,
  allowedRoles,
  requiredFeatures,
  requireCompletedOnboarding = false,
  requireVerifiedEmail = false,
  fallback,
}) => {
  const content = (
    <RoleGuard allowedRoles={allowedRoles} fallback={fallback}>
      <FeatureGuard requiredFeatures={requiredFeatures} fallback={fallback}>
        <OnboardingGuard requireCompletedOnboarding={requireCompletedOnboarding}>
          <EmailVerificationGuard requireVerifiedEmail={requireVerifiedEmail}>
            {children}
          </EmailVerificationGuard>
        </OnboardingGuard>
      </FeatureGuard>
    </RoleGuard>
  );

  if (!requireAuth) {
    return content;
  }

  return (
    <RequireAuth fallback={fallback}>
      {content}
    </RequireAuth>
  );
};

// Simple authentication guard
export interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Public route guard (redirect if authenticated)
export interface PublicOnlyProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicOnly: React.FC<PublicOnlyProps> = ({
  children,
  redirectTo = '/dashboard',
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};