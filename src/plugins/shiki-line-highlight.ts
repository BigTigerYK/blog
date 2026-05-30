import type { ShikiTransformer } from 'shiki';

/**
 * Shiki transformer: 支持 {3-5} 语法高亮指定行 + 语言标签
 * 使用方式: ```js {1,3-5,8}
 */
export function lineHighlightTransformer(): ShikiTransformer {
  return {
    name: 'line-highlight',
    // 在 pre 元素上添加语言 data 属性（由客户端 Code.ts 读取并更新语言标签）
    pre(node) {
      const lang = this.options.lang || '';
      node.properties = node.properties || {};
      node.properties['data-language'] = lang;
    },
    line(node, line) {
      // 从 meta 中解析行号
      const meta = this.options.meta?.__raw || '';
      const highlightLines = parseLineNumbers(meta);

      if (highlightLines.has(line)) {
        this.addClassToHast(node, 'highlighted');
      }
    }
  };
}

function parseLineNumbers(meta: string): Set<number> {
  const lines = new Set<number>();
  // 匹配 {1,3-5,8} 格式
  const match = meta.match(/\{([^}]+)\}/);
  if (!match) return lines;

  const parts = match[1].split(',');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          lines.add(i);
        }
      }
    } else {
      const num = Number(trimmed);
      if (!isNaN(num)) {
        lines.add(num);
      }
    }
  }
  return lines;
}
