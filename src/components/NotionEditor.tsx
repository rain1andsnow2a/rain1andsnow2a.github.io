import { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

const TEXT_COLORS = [
  { name: '默认', value: '' },
  { name: '红', value: '#E03131' },
  { name: '橙', value: '#E8590C' },
  { name: '黄', value: '#F08C00' },
  { name: '绿', value: '#2B8A3E' },
  { name: '蓝', value: '#1971C2' },
  { name: '紫', value: '#862E9C' },
  { name: '粉', value: '#C2255C' },
  { name: '灰', value: '#868E96' },
];

const BG_COLORS = [
  { name: '默认', value: '' },
  { name: '红底', value: '#FFE3E3' },
  { name: '橙底', value: '#FFF0DB' },
  { name: '黄底', value: '#FFF9DB' },
  { name: '绿底', value: '#D3F9D8' },
  { name: '蓝底', value: '#D0EBFF' },
  { name: '紫底', value: '#F3D9FA' },
  { name: '粉底', value: '#FDE8EF' },
  { name: '灰底', value: '#E9ECEF' },
];

interface Props {
  content: string;
  onUpdate: (html: string) => void;
}

export default function NotionEditor({ content, onUpdate }: Props) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "输入 '/' 使用命令，或直接开始写作...",
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: { class: 'notion-image' },
      }),
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'notion-link' },
      }),
      Underline,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'notion-prose',
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.startsWith('image/')) {
            event.preventDefault();
            const file = item.getAsFile();
            if (!file) continue;
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              if (editor) {
                editor.chain().focus().setImage({ src }).run();
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              if (editor) {
                editor.chain().focus().setImage({ src }).run();
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  const setTextColor = useCallback((color: string) => {
    if (!editor) return;
    if (color) {
      editor.chain().focus().setColor(color).run();
    } else {
      editor.chain().focus().unsetColor().run();
    }
    setShowColorPicker(false);
  }, [editor]);

  const setBgColor = useCallback((color: string) => {
    if (!editor) return;
    if (color) {
      editor.chain().focus().toggleHighlight({ color }).run();
    } else {
      editor.chain().focus().unsetHighlight().run();
    }
    setShowBgPicker(false);
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor || !linkUrl) return;
    editor.chain().focus().setLink({ href: linkUrl }).run();
    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  useEffect(() => {
    if (!editor) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Markdown shortcuts handled by TipTap StarterKit
      // Additional: Ctrl+Shift+K for link
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowLinkInput(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor]);

  if (!editor) return null;

  const ToolbarButton = ({ onClick, active, children, title }: any) => (
    <button
      onClick={onClick}
      title={title}
      class={`toolbar-btn ${active ? 'toolbar-btn-active' : ''}`}
      type="button"
    >
      {children}
    </button>
  );

  return (
    <div class="notion-editor-wrapper">
      {/* 顶部工具栏 */}
      <div class="notion-toolbar">
        <div class="toolbar-group">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="粗体 (Ctrl+B)"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="斜体 (Ctrl+I)"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="下划线 (Ctrl+U)"
          >
            <span style="text-decoration:underline">U</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            title="删除线"
          >
            <s>S</s>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            title="行内代码"
          >
            {'<>'}
          </ToolbarButton>
        </div>

        <div class="toolbar-divider" />

        <div class="toolbar-group">
          {/* 文字颜色 */}
          <div class="color-picker-wrapper">
            <ToolbarButton
              onClick={() => { setShowColorPicker(!showColorPicker); setShowBgPicker(false); }}
              title="文字颜色"
            >
              <span style="font-weight:bold">A</span>
              <span class="color-dot" style={`background:${editor.getAttributes('textStyle').color || '#37352F'}`} />
            </ToolbarButton>
            {showColorPicker && (
              <div class="color-dropdown">
                <div class="color-dropdown-title">文字颜色</div>
                {TEXT_COLORS.map(c => (
                  <button
                    key={c.value}
                    class="color-option"
                    onClick={() => setTextColor(c.value)}
                    type="button"
                  >
                    <span class="color-preview" style={c.value ? `background:${c.value}` : 'background:#37352F;border:1px dashed #ccc'} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 背景颜色 */}
          <div class="color-picker-wrapper">
            <ToolbarButton
              onClick={() => { setShowBgPicker(!showBgPicker); setShowColorPicker(false); }}
              title="背景颜色"
            >
              <span style="font-weight:bold;background:linear-gradient(135deg,#FFE3E3,#D0EBFF);-webkit-background-clip:text;-webkit-text-fill-color:transparent">A</span>
            </ToolbarButton>
            {showBgPicker && (
              <div class="color-dropdown">
                <div class="color-dropdown-title">背景颜色</div>
                {BG_COLORS.map(c => (
                  <button
                    key={c.value}
                    class="color-option"
                    onClick={() => setBgColor(c.value)}
                    type="button"
                  >
                    <span class="color-preview" style={c.value ? `background:${c.value}` : 'background:#fff;border:1px dashed #ccc'} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div class="toolbar-divider" />

        <div class="toolbar-group">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            title="标题1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="标题2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title="标题3"
          >
            H3
          </ToolbarButton>
        </div>

        <div class="toolbar-divider" />

        <div class="toolbar-group">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="无序列表"
          >
            • 列表
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="有序列表"
          >
            1. 列表
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="引用"
          >
            ❝
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive('codeBlock')}
            title="代码块"
          >
            {'{ }'}
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="分割线"
          >
            —
          </ToolbarButton>
        </div>

        <div class="toolbar-divider" />

        <div class="toolbar-group">
          {/* 链接 */}
          <div class="link-wrapper">
            <ToolbarButton
              onClick={() => setShowLinkInput(!showLinkInput)}
              active={editor.isActive('link')}
              title="链接 (Ctrl+K)"
            >
              🔗
            </ToolbarButton>
            {showLinkInput && (
              <div class="link-dropdown">
                <input
                  type="url"
                  value={linkUrl}
                  onInput={(e: any) => setLinkUrl(e.target.value)}
                  placeholder="输入链接地址..."
                  class="link-input"
                  onKeyDown={(e: any) => { if (e.key === 'Enter') addLink(); }}
                />
                <button onClick={addLink} class="link-confirm" type="button">确认</button>
              </div>
            )}
          </div>
          {/* 图片上传 */}
          <ToolbarButton
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e: any) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  const src = ev.target?.result as string;
                  editor.chain().focus().setImage({ src }).run();
                };
                reader.readAsDataURL(file);
              };
              input.click();
            }}
            title="插入图片 / Ctrl+V 粘贴图片"
          >
            🖼️
          </ToolbarButton>
        </div>
      </div>

      {/* 编辑区域 */}
      <div class="notion-editor-content" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>

      {/* 底部状态栏 */}
      <div class="notion-statusbar">
        <span>{'Markdown 快捷键: # 标题 · **粗体** · *斜体* · `代码` · > 引用 · - 列表'}</span>
        <span>Ctrl+V 粘贴图片 · Ctrl+K 插入链接</span>
      </div>
    </div>
  );
}
