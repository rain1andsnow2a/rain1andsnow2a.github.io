export type CategoryMeta = {
  icon: string;
  accent: string;
  soft: string;
  ring: string;
};

const categoryMeta: Record<string, CategoryMeta> = {
  博客搭建: {
    icon: 'layout-template',
    accent: 'text-violet-600',
    soft: 'bg-violet-50',
    ring: 'border-violet-100',
  },
  AI: {
    icon: 'sparkles',
    accent: 'text-emerald-600',
    soft: 'bg-emerald-50',
    ring: 'border-emerald-100',
  },
  国学: {
    icon: 'landmark',
    accent: 'text-sky-600',
    soft: 'bg-sky-50',
    ring: 'border-sky-100',
  },
  随笔: {
    icon: 'pencil-line',
    accent: 'text-amber-600',
    soft: 'bg-amber-50',
    ring: 'border-amber-100',
  },
  网络安全: {
    icon: 'shield-check',
    accent: 'text-rose-600',
    soft: 'bg-rose-50',
    ring: 'border-rose-100',
  },
  数据库: {
    icon: 'database',
    accent: 'text-cyan-600',
    soft: 'bg-cyan-50',
    ring: 'border-cyan-100',
  },
  未分类: {
    icon: 'notebook-tabs',
    accent: 'text-slate-600',
    soft: 'bg-slate-50',
    ring: 'border-slate-100',
  },
};

const fallbackPalette: CategoryMeta[] = [
  { icon: 'book-open', accent: 'text-indigo-600', soft: 'bg-indigo-50', ring: 'border-indigo-100' },
  { icon: 'compass', accent: 'text-teal-600', soft: 'bg-teal-50', ring: 'border-teal-100' },
  { icon: 'leaf', accent: 'text-lime-600', soft: 'bg-lime-50', ring: 'border-lime-100' },
];

export function getCategoryMeta(category: string, index = 0): CategoryMeta {
  return categoryMeta[category] ?? fallbackPalette[index % fallbackPalette.length];
}
