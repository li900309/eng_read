import React from 'react';
import { screen, fireEvent, waitFor } from '@/test/utils/test-utils';
import HomePage from '../HomePage';
import { vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the hero section', () => {
    render(<HomePage />);

    expect(screen.getByText(/英语学习，从未如此/)).toBeInTheDocument();
    expect(screen.getByText(/简单有趣/)).toBeInTheDocument();
    expect(screen.getByText(/Eng Read 是一个现代化的英语阅读学习平台/)).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(<HomePage />);

    const startButton = screen.getByRole('link', { name: /立即开始学习/ });
    const loginButton = screen.getByRole('link', { name: /登录/ });

    expect(startButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it('navigates to register when start button is clicked', () => {
    render(<HomePage />);

    const startButton = screen.getByRole('link', { name: /立即开始学习/ });
    fireEvent.click(startButton);

    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  it('navigates to login when login button is clicked', () => {
    render(<HomePage />);

    const loginButton = screen.getByRole('link', { name: /登录/ });
    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders features section', () => {
    render(<HomePage />);

    expect(screen.getByText(/为什么选择 Eng Read？/)).toBeInTheDocument();
    expect(screen.getByText(/智能词汇学习/)).toBeInTheDocument();
    expect(screen.getByText(/学习数据分析/)).toBeInTheDocument();
    expect(screen.getByText(/成就激励系统/)).toBeInTheDocument();
  });

  it('renders all feature cards', () => {
    render(<HomePage />);

    const features = [
      '智能词汇学习',
      '学习数据分析',
      '成就激励系统',
      '个性化学习',
      '社区互动',
      '多端同步'
    ];

    features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  it('renders statistics section', () => {
    render(<HomePage />);

    expect(screen.getByText('50,000+')).toBeInTheDocument();
    expect(screen.getByText('活跃用户')).toBeInTheDocument();
    expect(screen.getByText('10,000+')).toBeInTheDocument();
    expect(screen.getByText('词汇量')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('用户满意度')).toBeInTheDocument();
    expect(screen.getByText('4.8★')).toBeInTheDocument();
    expect(screen.getByText('用户评分')).toBeInTheDocument();
  });

  it('renders call to action section', () => {
    render(<HomePage />);

    expect(screen.getByText(/准备好开始您的英语学习之旅了吗？/)).toBeInTheDocument();
    expect(screen.getByText(/加入数万学习者，体验更高效的英语学习方法/)).toBeInTheDocument();

    const ctaButton = screen.getByRole('link', { name: /免费开始学习/ });
    expect(ctaButton).toBeInTheDocument();
  });

  it('navigates to register when CTA button is clicked', () => {
    render(<HomePage />);

    const ctaButton = screen.getByRole('link', { name: /免费开始学习/ });
    fireEvent.click(ctaButton);

    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  it('has proper semantic structure', () => {
    render(<HomePage />);

    // Check for proper headings hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2s = screen.getAllByRole('heading', { level: 2 });

    expect(h1).toBeInTheDocument();
    expect(h2s.length).toBeGreaterThan(0);
  });

  it('renders feature descriptions', () => {
    render(<HomePage />);

    expect(screen.getByText(/基于遗忘曲线的科学记忆算法/)).toBeInTheDocument();
    expect(screen.getByText(/详细的学习统计和进度分析/)).toBeInTheDocument();
    expect(screen.getByText(/丰富的成就系统和排行榜/)).toBeInTheDocument();
  });
});