import { test, expect } from '@playwright/test';

test.describe('认证流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('用户可以注册新账户', async ({ page }) => {
    // 导航到注册页面
    await page.click('text=立即开始学习');
    await expect(page).toHaveURL('/register');

    // 填写注册表单
    await page.fill('[placeholder="请输入您的名字"]', 'Test');
    await page.fill('[placeholder="请输入您的姓氏"]', 'User');
    await page.fill('[placeholder="请输入用户名"]', 'testuser');
    await page.fill('[placeholder="请输入您的邮箱"]', 'test@example.com');
    await page.fill('[placeholder="请输入密码"]', 'Test123456');
    await page.fill('[placeholder="请再次输入密码"]', 'Test123456');

    // 同意服务条款
    await page.check('#accept-terms');

    // 提交表单
    await page.click('text=创建账户');

    // 验证重定向到仪表板
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=欢迎回来')).toBeVisible();
  });

  test('用户可以登录现有账户', async ({ page }) => {
    // 导航到登录页面
    await page.click('text=登录');
    await expect(page).toHaveURL('/login');

    // 使用演示账户登录
    await page.fill('[placeholder="请输入您的邮箱"]', 'user@engread.com');
    await page.fill('[placeholder="请输入您的密码"]', 'user123');

    // 提交登录表单
    await page.click('text=登录');

    // 验证重定向到仪表板
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=欢迎回来')).toBeVisible();
  });

  test('显示适当的验证错误', async ({ page }) => {
    // 导航到登录页面
    await page.click('text=登录');
    await expect(page).toHaveURL('/login');

    // 尝试使用无效凭据登录
    await page.fill('[placeholder="请输入您的邮箱"]', 'invalid@example.com');
    await page.fill('[placeholder="请输入您的密码"]', 'wrongpassword');
    await page.click('text=登录');

    // 验证错误消息显示
    await expect(page.locator('text=登录失败')).toBeVisible();
  });

  test('可以导航到忘记密码页面', async ({ page }) => {
    // 导航到登录页面
    await page.click('text=登录');
    await expect(page).toHaveURL('/login');

    // 点击忘记密码链接
    await page.click('text=忘记密码？');

    // 验证导航到忘记密码页面
    await expect(page).toHaveURL('/forgot-password');
  });

  test('保持登录状态在页面刷新后', async ({ page }) => {
    // 先登录
    await page.goto('/login');
    await page.fill('[placeholder="请输入您的邮箱"]', 'user@engread.com');
    await page.fill('[placeholder="请输入您的密码"]', 'user123');
    await page.click('text=登录');

    // 等待导航完成
    await expect(page).toHaveURL('/dashboard');

    // 刷新页面
    await page.reload();

    // 验证仍然在仪表板页面
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=欢迎回来')).toBeVisible();
  });
});

test.describe('响应式设计', () => {
  test('在移动设备上正确显示', async ({ page }) => {
    // 设置移动设备视口
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 验证移动端导航
    await expect(page.locator('h1')).toContainText('英语学习，从未如此');

    // 验证按钮在小屏幕上的显示
    const startButton = page.locator('text=立即开始学习');
    await expect(startButton).toBeVisible();
  });

  test('在平板设备上正确显示', async ({ page }) => {
    // 设置平板设备视口
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // 验证平板端布局
    await expect(page.locator('h1')).toContainText('英语学习，从未如此');
  });

  test('在桌面设备上正确显示', async ({ page }) => {
    // 设置桌面设备视口
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // 验证桌面端布局
    await expect(page.locator('h1')).toContainText('英语学习，从未如此');
  });
});

test.describe('可访问性', () => {
  test('主页符合基本可访问性标准', async ({ page }) => {
    await page.goto('/');

    // 检查页面标题
    const title = await page.title();
    expect(title).toBeTruthy();

    // 检查主要元素的可访问性
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toHaveAttribute('role', 'heading');

    // 检查按钮的可访问性
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      await expect(button).toBeVisible();

      // 检查按钮是否有可访问的名称
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      expect(ariaLabel || text?.trim()).toBeTruthy();
    }

    // 检查键盘导航
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('登录表单符合可访问性标准', async ({ page }) => {
    await page.goto('/login');

    // 检查表单标签与输入框的关联
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('aria-label');

    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toHaveAttribute('aria-label');

    // 检查表单提交按钮
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });
});