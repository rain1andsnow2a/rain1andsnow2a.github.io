import { useState } from 'react';

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

interface Props {
  posts: PostItem[];
  currentPost: string | null;
  onSelectPost: (post: PostItem) => void;
  onCreatePost: () => void;
  onSync: () => void;
  syncing: boolean;
  token: string;
  onTokenChange: (token: string) => void;
}

export default function Sidebar({
  posts, currentPost, onSelectPost, onCreatePost, onSync, syncing, token, onTokenChange,
}: Props) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div class="notion-sidebar">
      {/* 顶部 */}
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <span class="logo-icon">✦</span>
          <span class="logo-text">晨熠的博客</span>
        </div>
        <button
          class="sidebar-icon-btn"
          onClick={() => setShowSettings(!showSettings)}
          title="设置"
          type="button"
        >
          ⚙️
        </button>
      </div>

      {/* 设置面板 */}
      {showSettings && (
        <div class="sidebar-settings">
          <label class="settings-label">GitHub Token (用于同步)</label>
          <input
            type="password"
            value={token}
            onInput={(e: any) => onTokenChange(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxx"
            class="settings-input"
          />
          <p class="settings-hint">
            需要 repo 权限。<a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer">创建 Token →</a>
          </p>
        </div>
      )}

      {/* 新建按钮 */}
      <div class="sidebar-actions">
        <button class="sidebar-new-btn" onClick={onCreatePost} type="button">
          + 新建文章
        </button>
      </div>

      {/* 文章列表 */}
      <div class="sidebar-posts">
        <div class="sidebar-section-title">文章</div>
        {posts.length === 0 ? (
          <div class="sidebar-empty">暂无文章</div>
        ) : (
          posts.map((post) => (
            <button
              key={post.name}
              class={`sidebar-post-item ${currentPost === post.name ? 'sidebar-post-active' : ''}`}
              onClick={() => onSelectPost(post)}
              type="button"
            >
              <div class="post-item-title">{post.meta?.title || post.name}</div>
              <div class="post-item-date">{post.meta?.pubDate || ''}</div>
            </button>
          ))
        )}
      </div>

      {/* 底部同步按钮 */}
      <div class="sidebar-footer">
        <button
          class="sidebar-sync-btn"
          onClick={onSync}
          disabled={syncing || !token}
          type="button"
        >
          {syncing ? '⏳ 同步中...' : '☁️ 同步到 GitHub'}
        </button>
      </div>
    </div>
  );
}
