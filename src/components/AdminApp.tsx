import { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import NotionEditor from './NotionEditor';

const OWNER = 'rain1andsnow2a';
const REPO = 'rain1andsnow2a.github.io';
const CONTENT_PATH = 'src/content/blog';

interface PostMeta {
  title: string;
  description?: string;
  pubDate: string;
  tags: string[];
}

interface PostItem {
  name: string;
  path: string;
  sha: string;
  meta: PostMeta | null;
  content: string;
}

function parseFrontmatter(raw: string): { meta: PostMeta | null; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: null, body: raw };
  const fm = match[1];
  const body = match[2];
  const meta: any = {};
  fm.split('\n').forEach((line) => {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) {
      let val: any = m[2].trim();
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      else if (val.startsWith('[') && val.endsWith(']')) {
        try { val = JSON.parse(val.replace(/'/g, '"')); } catch { val = [val]; }
      }
      meta[m[1]] = val;
    }
  });
  return { meta: meta as PostMeta, body };
}

function buildFrontmatter(meta: PostMeta): string {
  const tags = meta.tags.length > 0 ? `[${meta.tags.map(t => `'${t}'`).join(', ')}]` : '[]';
  return `---\ntitle: '${meta.title}'\ndescription: '${meta.description || ''}'\npubDate: ${meta.pubDate}\ntags: ${tags}\n---\n`;
}

function mdToHtml(md: string): string {
  // Simple Markdown → HTML for TipTap
  let html = md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^---$/gm, '<hr>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br>');
  return `<p>${html}</p>`;
}

function htmlToMd(html: string): string {
  // Simple HTML → Markdown
  let md = html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<blockquote[^>]*><p[^>]*>(.*?)<\/p><\/blockquote>/gi, '> $1\n')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<hr[^>]*\/?>/gi, '---\n')
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return md;
}

export default function AdminApp() {
  const [token, setToken] = useState(() => localStorage.getItem('gh_token') || '');
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [currentPost, setCurrentPost] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [currentMeta, setCurrentMeta] = useState<PostMeta | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    localStorage.setItem('gh_token', token);
  }, [token]);

  // 加载文章列表
  const loadPosts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/contents/${CONTENT_PATH}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' } }
      );
      if (!res.ok) throw new Error(`GitHub API 错误: ${res.status}`);
      const files = await res.json();
      const mdFiles = files.filter((f: any) => f.name.endsWith('.md') || f.name.endsWith('.mdx'));
      const items: PostItem[] = mdFiles.map((f: any) => {
        // fetch content
        return {
          name: f.name,
          path: f.path,
          sha: f.sha,
          meta: null,
          content: '',
        };
      });
      setPosts(items);
      // Load first post
      if (items.length > 0 && !currentPost) {
        await selectPost(items[0]);
      }
    } catch (e: any) {
      setMessage(`加载失败: ${e.message}`);
    }
    setLoading(false);
  }, [token]);

  const selectPost = async (post: PostItem) => {
    if (dirty && currentPost) {
      if (!confirm('当前文章未保存，是否放弃？')) return;
    }
    setCurrentPost(post.name);
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/contents/${post.path}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' } }
      );
      const data = await res.json();
      const decoded = atob(data.content);
      const { meta, body } = parseFrontmatter(decoded);
      const html = mdToHtml(body);
      setEditorContent(html);
      setCurrentMeta(meta);
      // Update sha for later sync
      setPosts(prev => prev.map(p => p.name === post.name ? { ...p, sha: data.sha, content: decoded, meta } : p));
      setDirty(false);
    } catch (e: any) {
      setMessage(`加载文章失败: ${e.message}`);
    }
    setLoading(false);
  };

  const createPost = () => {
    const name = `post-${Date.now()}.md`;
    const today = new Date().toISOString().split('T')[0];
    const meta: PostMeta = { title: '新文章', description: '', pubDate: today, tags: [] };
    const content = buildFrontmatter(meta) + '\n开始写作...\n';
    const newPost: PostItem = { name, path: `${CONTENT_PATH}/${name}`, sha: '', meta, content };
    setPosts(prev => [newPost, ...prev]);
    setCurrentPost(name);
    setEditorContent(mdToHtml('\n开始写作...\n'));
    setCurrentMeta(meta);
    setDirty(true);
  };

  const syncToGitHub = async () => {
    if (!token) { setMessage('请先设置 GitHub Token'); return; }
    if (!currentPost || !currentMeta) return;
    setSyncing(true);
    setMessage('同步中...');
    try {
      const body = htmlToMd(editorContent);
      const fullContent = buildFrontmatter(currentMeta) + body;
      const encoded = btoa(unescape(encodeURIComponent(fullContent)));

      // Get latest SHA
      let sha = '';
      try {
        const checkRes = await fetch(
          `https://api.github.com/repos/${OWNER}/${REPO}/contents/${CONTENT_PATH}/${currentPost}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          sha = checkData.sha;
        }
      } catch {}

      const res = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/contents/${CONTENT_PATH}/${currentPost}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `📝 更新文章: ${currentMeta.title}`,
            content: encoded,
            sha: sha || undefined,
            branch: 'main',
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setPosts(prev => prev.map(p => p.name === currentPost ? { ...p, sha: data.content.sha, content: fullContent } : p));
      setDirty(false);
      setMessage(`✅ 同步成功！文章已推送到 GitHub`);
    } catch (e: any) {
      setMessage(`❌ 同步失败: ${e.message}`);
    }
    setSyncing(false);
  };

  useEffect(() => {
    if (token) loadPosts();
  }, [token]);

  return (
    <div class="notion-app">
      <Sidebar
        posts={posts}
        currentPost={currentPost}
        onSelectPost={selectPost}
        onCreatePost={createPost}
        onSync={syncToGitHub}
        syncing={syncing}
        token={token}
        onTokenChange={setToken}
      />
      <div class="notion-main">
        {/* 顶栏 */}
        <div class="notion-topbar">
          {currentMeta && (
            <input
              type="text"
              value={currentMeta.title}
              onInput={(e: any) => {
                setCurrentMeta({ ...currentMeta, title: e.target.value });
                setDirty(true);
              }}
              class="notion-title-input"
              placeholder="文章标题"
            />
          )}
          <div class="topbar-meta">
            {currentMeta && (
              <>
                <input
                  type="date"
                  value={currentMeta.pubDate}
                  onInput={(e: any) => {
                    setCurrentMeta({ ...currentMeta, pubDate: e.target.value });
                    setDirty(true);
                  }}
                  class="notion-date-input"
                />
                <input
                  type="text"
                  value={currentMeta.tags.join(', ')}
                  onInput={(e: any) => {
                    setCurrentMeta({ ...currentMeta, tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) });
                    setDirty(true);
                  }}
                  placeholder="标签 (逗号分隔)"
                  class="notion-tags-input"
                />
              </>
            )}
            {dirty && <span class="dirty-dot" title="未保存">●</span>}
          </div>
        </div>

        {/* 消息提示 */}
        {message && (
          <div class={`notion-message ${message.startsWith('✅') ? 'notion-msg-ok' : 'notion-msg-err'}`}>
            {message}
            <button onClick={() => setMessage('')} type="button" class="msg-close">✕</button>
          </div>
        )}

        {/* 编辑器 */}
        <div class="notion-editor-area">
          {loading ? (
            <div class="notion-loading">加载中...</div>
          ) : currentPost ? (
            <NotionEditor
              content={editorContent}
              onUpdate={(html: string) => {
                setEditorContent(html);
                setDirty(true);
              }}
            />
          ) : (
            <div class="notion-empty">
              <div class="empty-icon">✦</div>
              <p>选择或创建一篇文章开始写作</p>
              {!token && <p class="empty-hint">请先在侧栏设置中输入 GitHub Token</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
