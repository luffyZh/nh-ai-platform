import React from 'react';

const STYLES = `
.markdown-body { color: #334155; line-height: 1.75; font-size: 14px; }
.markdown-body h1 { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 12px; padding-bottom: 12px; border-bottom: 2px solid #e2e8f0; }
.markdown-body h2 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 28px 0 12px; padding-left: 10px; border-left: 4px solid #3b82f6; }
.markdown-body h3 { font-size: 15px; font-weight: 700; color: #1e293b; margin: 18px 0 8px; }
.markdown-body p { margin: 10px 0; }
.markdown-body ul { margin: 10px 0; padding-left: 22px; list-style: disc; }
.markdown-body ol { margin: 10px 0; padding-left: 22px; list-style: decimal; }
.markdown-body li { margin: 6px 0; }
.markdown-body blockquote { border-left: 3px solid #cbd5e1; background: #f8fafc; padding: 8px 14px; color: #475569; border-radius: 0 8px 8px 0; margin: 12px 0; }
.markdown-body table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 13px; }
.markdown-body th, .markdown-body td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
.markdown-body th { background: #f1f5f9; font-weight: 700; color: #0f172a; }
.markdown-body tr:nth-child(even) td { background: #f8fafc; }
.markdown-body code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 12px; color: #db2777; }
.markdown-body hr { border: none; border-top: 1px dashed #e2e8f0; margin: 20px 0; }
.markdown-body strong { color: #0f172a; }
.markdown-body > blockquote:first-of-type { background: #eff6ff; border-left-color: #3b82f6; color: #1d4ed8; }
`;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInline(text: string): string {
  let t = escapeHtml(text);
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return t;
}

function renderMarkdown(src: string): { html: string; headings: { id: string; text: string; level: number }[] } {
  if (!src.trim()) {
    return {
      html: `<div class="text-slate-400 text-center py-16"><p>暂无 PRD 内容</p><p class="text-xs mt-2">请完成 4 步向导后点击「生成 PRD 初稿」</p></div>`,
      headings: [],
    };
  }

  const lines = src.split('\n');
  const html: string[] = [`<style>${STYLES}</style><div class="markdown-body">`];
  const headings: { id: string; text: string; level: number }[] = [];

  let inList: 'ul' | 'ol' | null = null;
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];
  let inBlockquote = false;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };
  const closeList = () => {
    if (inList) {
      html.push(`</${inList}>`);
      inList = null;
    }
  };
  const closeBlockquote = () => {
    if (inBlockquote) {
      html.push('</blockquote>');
      inBlockquote = false;
    }
  };
  const flushTable = () => {
    if (inTable) {
      html.push('<table><thead><tr>');
      tableHeader.forEach((h) => html.push(`<th>${renderInline(h)}</th>`));
      html.push('</tr></thead><tbody>');
      tableRows.forEach((row) => {
        html.push('<tr>');
        row.forEach((c) => html.push(`<td>${renderInline(c)}</td>`));
        html.push('</tr>');
      });
      html.push('</tbody></table>');
      inTable = false;
      tableHeader = [];
      tableRows = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (/^\s*\|.*\|\s*$/.test(line)) {
      flushParagraph();
      closeList();
      closeBlockquote();
      const cells = line
        .slice(line.indexOf('|') + 1, line.lastIndexOf('|'))
        .split('|')
        .map((c) => c.trim());
      if (!inTable) {
        inTable = true;
        tableHeader = cells;
        continue;
      }
      if (cells.every((c) => /^:?-{3,}:?$/.test(c))) continue;
      tableRows.push(cells);
      continue;
    } else {
      flushTable();
    }

    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      flushParagraph();
      closeList();
      closeBlockquote();
      const level = h[1].length;
      const text = h[2].trim();
      const id = `h-${headings.length}-${text.replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`;
      headings.push({ id, text, level });
      html.push(`<h${level} id="${id}">${renderInline(text)}</h${level}>`);
      continue;
    }

    if (/^\s*---+\s*$/.test(line)) {
      flushParagraph();
      closeList();
      closeBlockquote();
      html.push('<hr />');
      continue;
    }

    const ul = /^\s*[-*+]\s+(.*)$/.exec(line);
    if (ul) {
      flushParagraph();
      closeBlockquote();
      if (inList !== 'ul') {
        closeList();
        html.push('<ul>');
        inList = 'ul';
      }
      html.push(`<li>${renderInline(ul[1])}</li>`);
      continue;
    }

    const ol = /^\s*\d+\.\s+(.*)$/.exec(line);
    if (ol) {
      flushParagraph();
      closeBlockquote();
      if (inList !== 'ol') {
        closeList();
        html.push('<ol>');
        inList = 'ol';
      }
      html.push(`<li>${renderInline(ol[1])}</li>`);
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      flushParagraph();
      closeList();
      const content = line.replace(/^\s*>\s?/, '');
      if (!inBlockquote) {
        html.push('<blockquote>');
        inBlockquote = true;
      }
      paragraph.push(content);
      continue;
    } else {
      closeBlockquote();
    }

    if (line.trim() === '') {
      flushParagraph();
      closeList();
      continue;
    }

    closeList();
    paragraph.push(line.trim());
  }

  flushParagraph();
  closeList();
  closeBlockquote();
  flushTable();

  html.push('</div>');
  return { html: html.join('\n'), headings };
}

interface MarkdownPreviewProps {
  content: string;
  onRepaint?: (keyword: string) => void;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, onRepaint }) => {
  const { html, headings } = renderMarkdown(content);

  return (
    <div className="relative">
      {onRepaint && headings.length > 0 && (
        <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur border-b border-slate-200 px-5 py-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 mr-2">快速局部重绘 →</span>
            {headings
              .filter((h) => h.level <= 2)
              .slice(0, 8)
              .map((h) => (
                <button
                  key={h.id}
                  onClick={() => onRepaint(`帮我重写「${h.text}」章节，更真实、更有说服力`)}
                  className="text-xs px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors font-medium"
                >
                  {h.text.replace(/[（(].*?[)）]/g, '').slice(0, 14)}
                </button>
              ))}
          </div>
        </div>
      )}
      <div
        className="px-5 pb-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default MarkdownPreview;
