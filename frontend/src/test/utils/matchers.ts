import { expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';

// 自定义匹配器：检查元素是否可见
expect.extend({
  async toBeVisible(element: HTMLElement) {
    const pass = element !== null && element.offsetWidth > 0 && element.offsetHeight > 0;

    return {
      pass,
      message: () => `expected element ${pass ? 'not ' : ''}to be visible`,
    };
  },
});

// 自定义匹配器：检查元素是否具有特定的类名
expect.extend({
  toHaveClass(element: HTMLElement, className: string) {
    const pass = element !== null && element.classList.contains(className);

    return {
      pass,
      message: () => `expected element ${pass ? 'not ' : ''}to have class "${className}"`,
    };
  },
});

// 自定义匹配器：检查元素是否被禁用
expect.extend({
  toBeDisabled(element: HTMLElement) {
    const pass = element !== null && (element as HTMLButtonElement).disabled;

    return {
      pass,
      message: () => `expected element ${pass ? 'not ' : ''}to be disabled`,
    };
  },
});

// 自定义匹配器：检查输入框是否为空
expect.extend({
  toBeEmpty(element: HTMLElement) {
    const pass = element !== null && (element as HTMLInputElement).value === '';

    return {
      pass,
      message: () => `expected input ${pass ? 'not ' : ''}to be empty`,
    };
  },
});

// 自定义匹配器：检查元素是否包含特定的文本
expect.extend({
  toContainText(element: HTMLElement, text: string) {
    const pass = element !== null && element.textContent?.includes(text);

    return {
      pass,
      message: () => `expected element ${pass ? 'not ' : ''}to contain text "${text}"`,
    };
  },
});

// 自定义匹配器：检查元素是否有特定的属性
expect.extend({
  toHaveAttribute(element: HTMLElement, attribute: string, value?: string) {
    const hasAttribute = element !== null && element.hasAttribute(attribute);
    const attributeValue = element?.getAttribute(attribute);
    const pass = value !== undefined
      ? hasAttribute && attributeValue === value
      : hasAttribute;

    return {
      pass,
      message: () => {
        if (value !== undefined) {
          return `expected element ${pass ? 'not ' : ''}to have attribute "${attribute}" with value "${value}"`;
        }
        return `expected element ${pass ? 'not ' : ''}to have attribute "${attribute}"`;
      },
    };
  },
});

// 自定义匹配器：检查元素是否在视口中
expect.extend({
  toBeInViewport(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const pass = rect.top >= 0 && rect.left >= 0 &&
                rect.bottom <= window.innerHeight &&
                rect.right <= window.innerWidth;

    return {
      pass,
      message: () => `expected element ${pass ? 'not ' : ''}to be in viewport`,
    };
  },
});

// 自定义匹配器：检查按钮是否处于加载状态
expect.extend({
  toBeLoading(element: HTMLElement) {
    const pass = element !== null &&
                (element.getAttribute('aria-busy') === 'true' ||
                 element.classList.contains('loading') ||
                 element.querySelector('.spinner, .loader') !== null);

    return {
      pass,
      message: () => `expected button ${pass ? 'not ' : ''}to be in loading state`,
    };
  },
});

// 自定义匹配器：检查表单字段是否有错误
expect.extend({
  toHaveError(element: HTMLElement, errorText?: string) {
    const hasErrorClass = element !== null &&
                         (element.classList.contains('error') ||
                          element.classList.contains('border-destructive'));

    const errorMessage = element?.parentElement?.querySelector('.error-message, .text-destructive');
    const hasErrorText = !errorText ||
                        (errorMessage && errorMessage.textContent?.includes(errorText));

    const pass = hasErrorClass && hasErrorText;

    return {
      pass,
      message: () => {
        if (errorText) {
          return `expected element ${pass ? 'not ' : ''}to have error with text "${errorText}"`;
        }
        return `expected element ${pass ? 'not ' : ''}to have error styling`;
      },
    };
  },
});

// 工具函数：等待元素出现
export const waitForElement = async (text: string, options?: { timeout?: number }) => {
  return await waitFor(
    () => screen.getByText(text),
    { timeout: options?.timeout || 5000 }
  );
};

// 工具函数：等待元素消失
export const waitForElementToBeRemoved = async (text: string, options?: { timeout?: number }) => {
  return await waitFor(
    () => expect(screen.queryByText(text)).not.toBeInTheDocument(),
    { timeout: options?.timeout || 5000 }
  );
};

// 工具函数：检查元素是否可访问
export const checkAccessibility = (element: HTMLElement) => {
  const hasAccessibleName = element.getAttribute('aria-label') ||
                           element.getAttribute('aria-labelledby') ||
                           element.textContent?.trim();

  const hasRole = element.getAttribute('role');
  const isInteractive = element.tabIndex >= 0 ||
                       ['button', 'input', 'select', 'textarea', 'a'].includes(element.tagName.toLowerCase());

  return {
    hasAccessibleName: !!hasAccessibleName,
    hasRole: !!hasRole,
    isInteractive,
    isAccessible: isInteractive ? !!hasAccessibleName : true,
  };
};

// 声明模块以扩展expect的类型
declare global {
  namespace Vi {
    interface Assertion {
      toBeVisible(): void;
      toHaveClass(className: string): void;
      toBeDisabled(): void;
      toBeEmpty(): void;
      toContainText(text: string): void;
      toHaveAttribute(attribute: string, value?: string): void;
      toBeInViewport(): void;
      toBeLoading(): void;
      toHaveError(errorText?: string): void;
    }
  }
}