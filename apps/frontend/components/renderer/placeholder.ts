/**
 * 占位符解析器 - Placeholder Parser
 * 
 * 支持的占位符格式：
 * - {{data.path.to.value}} - 简单路径引用
 * - {{data.name||默认值}} - 带默认值
 * - {{#each data.gallery}} - 循环渲染
 * - {{data.show?true:false}} - 条件表达式
 * 
 * @example
 * const template = {
 *   text: "{{data.couple.groom.name}} & {{data.couple.bride.name}}"
 * }
 * parsePlaceholders(template, data) // "新郎 & 新娘"
 */

import { PropValue, PropObject, PropArray, PlaceholderExpression } from '@/types/template-schema';

/**
 * 获取嵌套对象的值
 */
function getNestedValue(obj: any, path: string): any {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key];
  }
  
  return current;
}

/**
 * 解析占位符表达式
 */
function resolvePlaceholder(
  expr: PlaceholderExpression,
  data: any,
  defaultValue: string = ''
): string {
  const value = getNestedValue(data, expr.path);
  
  if (value === null || value === undefined) {
    return expr.defaultValue || defaultValue;
  }
  
  // 如果有转换函数，应用转换
  if (expr.transform && typeof value === 'string') {
    switch (expr.transform) {
      case 'uppercase':
        return value.toUpperCase();
      case 'lowercase':
        return value.toLowerCase();
      case 'capitalize':
        return value.charAt(0).toUpperCase() + value.slice(1);
      case 'date':
        return new Date(value).toLocaleDateString('zh-CN');
      case 'time':
        return new Date(value).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      default:
        return value;
    }
  }
  
  return String(value);
}

/**
 * 检查是否为占位符表达式
 */
function isPlaceholder(value: any): value is PlaceholderExpression {
  return (
    typeof value === 'object' &&
    value !== null &&
    value.type === 'placeholder'
  );
}

/**
 * 解析字符串中的占位符
 */
function parseStringPlaceholders(text: string, data: any): string {
  // 匹配 {{path}} 或 {{path||default}} 格式
  const placeholderRegex = /\{\{([^}]+)\}\}/g;
  
  return text.replace(placeholderRegex, (match, content) => {
    // 处理条件表达式 {{data.show?true:false}}
    if (content.includes('?')) {
      const [condition, result] = content.split('?');
      const [path, value] = condition.split(':');
      
      const actualValue = getNestedValue(data, path.trim());
      return actualValue === value.trim() ? result.trim() : '';
    }
    
    // 处理带默认值的占位符 {{path||default}}
    const parts = content.split('||');
    const path = parts[0].trim();
    const defaultValue = parts[1]?.trim() || '';
    
    const value = getNestedValue(data, path);
    
    if (value === null || value === undefined) {
      return defaultValue;
    }
    
    return String(value);
  });
}

/**
 * 递归解析对象中的所有占位符
 */
export function parsePlaceholders(
  value: PropValue,
  data: any
): PropValue {
  // 处理占位符表达式对象
  if (isPlaceholder(value)) {
    return resolvePlaceholder(value, data);
  }
  
  // 处理字符串（可能包含占位符）
  if (typeof value === 'string') {
    return parseStringPlaceholders(value, data);
  }
  
  // 处理数组（支持 #each 循环）
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      // 检查是否为 each 表达式
      if (typeof item === 'object' && item !== null && 'eachPath' in item) {
        const eachItem = item as any;
        const arrayData = getNestedValue(data, eachItem.eachPath);
        if (Array.isArray(arrayData)) {
          return arrayData.map((arrayItem, arrayIndex) => {
            // 为每个数组项创建索引上下文
            const itemContext = {
              ...data,
              index: arrayIndex,
              first: arrayIndex === 0,
              last: arrayIndex === arrayData.length - 1,
            };
            return parsePlaceholders(eachItem.props, { ...itemContext, item: arrayItem });
          });
        }
      }
      return parsePlaceholders(item, data);
    }).flat().filter(Boolean);
  }
  
  // 处理对象
  if (typeof value === 'object' && value !== null) {
    const result: PropObject = {};
    
    for (const [key, val] of Object.entries(value)) {
      // 跳过特殊键
      if (key === 'eachPath') continue;
      
      result[key] = parsePlaceholders(val, data);
    }
    
    return result;
  }
  
  // 返回原始值
  return value;
}

/**
 * 检查条件是否满足
 */
export function checkCondition(
  path: string,
  expectedValue: any,
  data: any
): boolean {
  const actualValue = getNestedValue(data, path);
  return actualValue === expectedValue;
}

/**
 * 创建模板解析器实例
 */
export function createTemplateParser() {
  return {
    parse: parsePlaceholders,
    checkCondition,
    getNestedValue,
  };
}

export type TemplateParser = ReturnType<typeof createTemplateParser>;
