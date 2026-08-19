import { useState } from 'react'
import { X, Globe } from 'lucide-react'
import EnvIcon, { ENV_ICON_OPTIONS } from './EnvIcon'
import type { EnvIconName} from '../data'
import { createProject } from '@/services/project.service'
import { useDispatch } from 'react-redux'
import { setCurrentProject, setNewProject } from '@/features/projectSlice'

interface CreateProjectModalProps {
  onClose: () => void;
  onToast: (
    msg: string,
    type: "success" | "error" | "info"
  ) => void;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default function CreateProjectModal({ onClose, onToast }: CreateProjectModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [loading, setLoading] = useState(false);

  const [envName, setEnvName] = useState('Production')
  const [envIcon, setEnvIcon] = useState<EnvIconName>('globe')

  const dispatch = useDispatch();

  const validateUrl = (value: string) => {
    if (!value.trim()) {
      setUrlError('')
      return;
    }
    setUrlError(isValidUrl(value.trim()) ? '' : 'Enter a valid URL (include https://)')
  }

  const canSubmit = name.trim().length > 0 && envName.trim().length > 0 && !urlError && url.trim().length > 0

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true);
    try{
      const response = await createProject({name, description, url, environment_name: envName, environment_icon: envIcon})
      dispatch(setNewProject(response));
      dispatch(setCurrentProject(response));
    }catch(error){
      onToast("Failed to create project", "error")
    }finally{
      setLoading(false);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-600 flex items-center justify-center bg-black/70 p-5" onClick={onClose}>
      <div className="flex max-h-[90vh] w-full max-w-130 flex-col overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface) shadow-[0_24px_64px_rgba(0,0,0,0.6)]" onClick={(event) => event.stopPropagation()}>

        {/* Header */}

        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-(--color-border) px-5 py-4.5">
          <div>
            <h2 className="m-0 font-(--font-sans) text-[16px] tracking-[-0.01em] text-(--color-text)">New Project</h2>
            <p className="m-0 mt-0.5 text-[12px] text-(--color-text-subtle)">Create a project and its first environment</p>
          </div>

          <button type="button" onClick={onClose} aria-label="Close" className="flex rounded-sm border-0 bg-transparent p-1 text-(--color-text-subtle) transition-colors duration-(--transition-fast) hover:text-(--color-text)">
            <X size={16} />
          </button>
        </div>

        {/* Body */}

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">

          {/* Project */}

          <section className="flex flex-col gap-4">
            <div className="text-[12px] font-bold tracking-[0.08em] text-(--color-text)">PROJECT</div>

            {/* Name */}

            <div>
              <label htmlFor="project-name" className="mb-1.5 block text-[12px] font-semibold tracking-[0.04em] text-(--color-text-label)">
                Project name <span className="text-red-400">*</span>
              </label>

              <input id="project-name" autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Payments Service" className="w-full rounded-sm border border-(--color-border) bg-(--color-surface-raised) px-3 py-2 text-[12px] text-(--color-text) outline-none placeholder:text-(--color-text-faint) transition-colors duration-(--transition-fast) focus:border-(--color-border-active)" />
            </div>

            {/* URL */}

            <div>
              <label htmlFor="project-url" className="mb-1.5 block text-[12px] font-semibold tracking-[0.04em] text-(--color-text-label)">
                Project URL <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <Globe size={12} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-(--color-text-faint)" />

                <input id="project-url" value={url} onChange={(event) => { setUrl(event.target.value); validateUrl(event.target.value) }} placeholder="https://myapp.com" className={`w-full rounded-sm border bg-(--color-surface-raised) py-2 pl-7 pr-3 text-[12px] text-(--color-text) outline-none placeholder:text-(--color-text-faint) focus:border-(--color-border-active) ${urlError ? 'border-red-400/50' : 'border-(--color-border)'}`} />
              </div>

              {urlError ? (
                <p className="mt-1 text-[12px] text-red-400">{urlError}</p>
              ) : (
                <p className="mt-1 text-[12px] leading-relaxed text-(--color-text-faint)">Where this project is deployed — shown as a quick link from the project card.</p>
              )}
            </div>

            {/* Description */}

            <div>
              <label htmlFor="project-description" className="mb-1.5 block text-[12px] font-semibold tracking-[0.04em] text-(--color-text-label)">
                Description <span className="text-(--color-text-faint)">(optional)</span>
              </label>

              <textarea id="project-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What does this project do?" rows={2} className="w-full resize-y rounded-sm border border-(--color-border) bg-(--color-surface-raised) px-3 py-2 text-[12px] leading-relaxed text-(--color-text) outline-none placeholder:text-(--color-text-faint) focus:border-(--color-border-active)" />
            </div>

          </section>

          {/* Divider */}

          <div className="border-t border-(--color-border)" />

          {/* Default Environment */}

          <section className="flex flex-col gap-4">
            <div>
              <div className="mb-1 text-[12px] font-bold tracking-[0.08em] text-(--color-text)">DEFAULT ENVIRONMENT</div>
              <p className="m-0 text-[12px] text-(--color-text-faint)">We'll create a default environment for this project</p>
            </div>

            {/* Environment Name */}

            <div>
              <label htmlFor="environment-name" className="mb-1.5 block text-[12px] font-semibold tracking-[0.04em] text-(--color-text-label)">
                Environment name <span className="text-red-400">*</span>
              </label>

              <input id="environment-name" value={envName} onChange={(event) => setEnvName(event.target.value)} placeholder="e.g. Production" className="w-full rounded-sm border border-(--color-border) bg-(--color-surface-raised) px-3 py-2 text-[12px] text-(--color-text) outline-none placeholder:text-(--color-text-faint) focus:border-(--color-border-active)" />
            </div>

            {/* Icon */}

            <div>
              <label className="mb-2 block text-[12px] font-semibold tracking-[0.04em] text-(--color-text-label)">Icon</label>

              <EnvIconPicker selected={envIcon} onChange={setEnvIcon} />

              <p className="mt-2 text-[12px] leading-relaxed text-(--color-text-faint)">This icon identifies the environment across the sidebar and switcher.</p>
            </div>

            <div className="rounded-sm border border-(--color-border) bg-(--color-bg) px-2.5 py-2 text-[12px] leading-relaxed text-(--color-text-faint)">You can add more environments anytime from the Environments page.</div>
          </section>
        </div>

        {/* Footer */}

        <div className="flex shrink-0 gap-2 border-t border-(--color-border) px-5 py-3.5">
          <button type="button" onClick={handleSubmit} disabled={!canSubmit || loading} className={`flex-1 rounded-sm px-4 py-2 text-[12px] font-semibold transition-colors duration-(--transition-fast) ${canSubmit ? 'bg-(--color-primary) text-(--color-primary-text) hover:bg-(--color-primary-hover)' : 'cursor-not-allowed bg-(--color-surface-highlight) text-(--color-text-faint)'} disabled:opacity-70 disabled:cursor-not-allowed`}>
            Create Project
          </button>

          <button type="button" onClick={onClose} disabled={loading} className="rounded-sm border border-(--color-border) bg-transparent px-4.5 py-2 text-[12px] text-(--color-text-label) transition-colors duration-(--transition-fast) hover:border-(--color-border-hover) hover:bg-(--color-surface-hover) hover:text-(--color-text) disabled:opacity-70 disabled:cursor-not-allowed">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function EnvIconPicker({ selected, onChange }: { selected: EnvIconName; onChange: (value: EnvIconName) => void }) {
  return (
    <div className="flex gap-1.5">
      {ENV_ICON_OPTIONS.map(({ key, label }) => {
        const isSelected = selected === key

        return (
          <button key={key} type="button" onClick={() => onChange(key)} title={label} aria-label={label} className={`flex h-10 w-10 items-center justify-center rounded-sm border bg-(--color-surface-raised) transition-colors duration-(--transition-fast) ${isSelected ? 'border-(--color-primary) text-(--color-primary)' : 'border-(--color-border) text-(--color-text-faint) hover:border-(--color-border-hover) hover:bg-(--color-surface-hover) hover:text-(--color-text-label)'}`}>
            <EnvIcon name={key} size={16} color={isSelected ? 'var(--color-primary)' : 'var(--color-text-faint)'} />
          </button>
        )
      })}
    </div>
  )
}

export { EnvIconPicker }