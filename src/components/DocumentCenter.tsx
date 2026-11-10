import { MetisButton } from '@yuanfudao/metis-web-component'
import { useMemo, type ReactNode } from 'react'
import {
  BrainCircuit,
  BookOpen,
  FileInput,
  FilePenLine,
  FileText,
  FolderHeart,
  ListTree,
  Layers3,
  Search,
  School,
  Sparkles,
  Target,
  Clock3,
} from 'lucide-react'
import type { AddQuestionMode, AsyncStatus, HistoryDocumentSummary, OpenAddOptions } from '../prototype/types'
import { formatRecentEditedMeta, selectRecentEditedSummaries } from '../utils/recentEditedDocuments'

interface DocumentCenterProps {
  embedded?: boolean
  hideDraft?: boolean
  draftContent?: ReactNode
  histories: HistoryDocumentSummary[]
  currentDocumentId?: string
  historyStatus: AsyncStatus
  onOpenDocument: (documentId: string) => void
  onOpenMyResources: () => void
  onOpenSource: (mode: AddQuestionMode, options?: OpenAddOptions) => void
  onOpenAiSearch: () => void
  onOpenRecentBrowse: () => void
  onReload: () => void
}

const aiTaskEntries: Array<{ mode: AddQuestionMode; label: string; description: string; icon: typeof BrainCircuit }> = [
  { mode: 'upload', label: '上传文件 AI 录题', description: '上传 Word、PDF 或图片，识别并录入题目', icon: FileInput },
  { mode: 'create', label: 'AI 出题', description: '设置教材、知识点、题型和题量，生成几道新题', icon: Sparkles },
  { mode: 'compose', label: 'AI 组题', description: '直接说作业或试卷要求，从题库配题组卷', icon: BrainCircuit },
]

type DocumentCenterLauncherProps = Omit<DocumentCenterProps, 'embedded' | 'draftContent' | 'hideDraft'> & {
  overlay?: boolean
}

export function DocumentCenterLauncher({ overlay = false, histories, currentDocumentId, historyStatus, onOpenDocument, onOpenMyResources, onOpenSource, onOpenAiSearch, onOpenRecentBrowse, onReload }: DocumentCenterLauncherProps) {
  const recentDocuments = useMemo(() => selectRecentEditedSummaries(histories), [histories])
  return (
    <aside className={`home-launcher${overlay ? ' is-overlay' : ''}`} aria-label="添加题目首页">
      <button type="button" className="home-launcher-search" onClick={onOpenAiSearch} aria-label="打开AI智搜">
        <Sparkles size={17} /><strong>AI智搜</strong><span>搜索关键词</span><i><Search size={16} /></i>
      </button>
      <section className="home-launcher-section">
        <h2>添加题目</h2>
        <div className="home-launcher-grid">
          <button type="button" onClick={() => onOpenSource('resource', { libraryView: 'chapter' })}><ListTree size={17} /><span>章节/知识点</span></button>
          <button type="button" onClick={() => onOpenSource('resource', { libraryView: 'sync' })}><Layers3 size={17} /><span>同步练习</span></button>
          <button type="button" onClick={() => onOpenSource('resource', { libraryView: 'workbook' })}><BookOpen size={17} /><span>练习册</span></button>
          <button type="button" onClick={() => onOpenSource('resource', { libraryView: 'special' })}><Target size={17} /><span>专题练习</span></button>
          <button type="button" onClick={() => onOpenSource('resource', { libraryView: 'paper' })}><FileText size={17} /><span>试卷</span></button>
          <button type="button" onClick={() => onOpenSource('school')}><School size={17} /><span>校本题库</span></button>
          <button type="button" onClick={onOpenMyResources}><FolderHeart size={17} /><span>我的资源</span></button>
          <button type="button" onClick={onOpenRecentBrowse}><Clock3 size={17} /><span>最近浏览</span></button>
        </div>
      </section>
      <div className="home-launcher-grid is-ai">
        {aiTaskEntries.map(({ mode, label, description, icon: Icon }) => (
          <button type="button" key={mode} title={description} onClick={() => onOpenSource(mode)}><Icon size={17} /><span>{label.replace('上传文件 ', '').replace(' ', '')}</span></button>
        ))}
      </div>
      <section className="home-launcher-section is-recent">
        <h2>最近编辑</h2>
        {historyStatus === 'error' ? <MetisButton type="borderless" onClick={onReload}>重新加载</MetisButton> : null}
        <div className="home-launcher-recent-list">
          {recentDocuments.slice(0, 4).map((item) => {
            const editing = item.id === currentDocumentId
            return <button type="button" key={item.id} onClick={() => onOpenDocument(item.id)} aria-current={editing ? 'true' : undefined}>
              <span>{editing ? <FilePenLine size={18} /> : <FileText size={18} />}</span>
              <div><strong>{item.title}</strong><small>{formatRecentEditedMeta(item)}</small></div>
              <time>{item.updatedAt}</time>
            </button>
          })}
        </div>
      </section>
    </aside>
  )
}

export function DocumentCenter({ embedded = false, hideDraft = false, draftContent, histories, currentDocumentId, historyStatus, onOpenDocument, onOpenMyResources, onOpenSource, onOpenAiSearch, onOpenRecentBrowse, onReload }: DocumentCenterProps) {
  const launcherProps = { histories, currentDocumentId, historyStatus, onOpenDocument, onOpenMyResources, onOpenSource, onOpenAiSearch, onOpenRecentBrowse, onReload }
  return <div className={`document-center${embedded ? ' is-embedded' : ''} is-home-launcher-layout${hideDraft ? ' is-draft-hidden' : ''}`}>
    <DocumentCenterLauncher {...launcherProps} />
    {hideDraft ? null : <main className="document-center-main"><div className="document-center-draft">{draftContent}</div></main>}
  </div>
}
