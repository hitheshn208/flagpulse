import { useState } from 'react'
import { X } from 'lucide-react'
import { EnvIconPicker } from './CreateProjectModal'
import type { EnvIconName } from '../data'
import { createEnvironment } from '@/services/project.service'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { changeEnvironmentCountOfproject } from '@/features/projectSlice'
import { count } from 'console'
import { addEnvironment } from '@/features/environmentSlice'

interface CreateEnvironmentModalProps {
  onClose: () => void
  onToast: (msg: string, type: "success" | "error" | "info")=>void;
}

export default function CreateEnvironmentModal({ onClose, onToast }: CreateEnvironmentModalProps) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState<EnvIconName>('globe');
  const [loading, setLoading] = useState(false);
  
  const currentProject = useSelector((state : RootState)=> state.project.currentProject)
  const dispatch = useDispatch();

  const canSubmit = name.trim().length > 0

  const handleSubmit = async () => {
    if (!canSubmit || !currentProject) return
    setLoading(true);
    try{
      const response = await createEnvironment(currentProject?.id, {name, icon});
      dispatch(changeEnvironmentCountOfproject({count: 1}));
      dispatch(addEnvironment(response));
    }catch(error){
      onToast("Failed to create environment", "error");
    }finally{
      setLoading(false)
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-600 flex items-center justify-center bg-black/70 p-5" onClick={onClose}>
      <div className="flex w-full max-w-115 flex-col overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface) shadow-[0_24px_64px_rgba(0,0,0,0.6)]" onClick={(e) => e.stopPropagation()}>

        {/* Header */}

        <div className="flex items-center justify-between border-b border-(--color-border) px-5 py-4.5">
          <div>
            <h2 className="m-0 font-(--font-sans) text-[16px] tracking-[-0.01em] text-(--color-text)">
              Add Environment
            </h2>

            <p className="m-0 mt-0.5 text-[12px] text-(--color-text-subtle)">
              Configure a new environment for this project
            </p>
          </div>

          <button type="button" onClick={onClose} aria-label="Close" className="flex cursor-pointer rounded-sm border-0 bg-transparent p-1 text-(--color-text-subtle) transition-colors duration-(--transition-fast) hover:text-(--color-text)">
            <X size={16} />
          </button>
        </div>

        {/* Body */}

        <div className="flex flex-col gap-4.5 p-5">

          {/* Name */}

          <div>
            <label htmlFor="environment-name" className="mb-1.5 block text-[11px] font-semibold tracking-[0.04em] text-(--color-text-label)">
              Environment name <span className="text-red-400">*</span>
            </label>

            <input
              id="environment-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit()
              }}
              placeholder="e.g. Staging"
              className="w-full rounded-sm border border-(--color-border) bg-(--color-surface-raised) px-3 py-2 text-[13px] text-(--color-text) outline-none placeholder:text-(--color-text-faint) transition-colors duration-(--transition-fast) focus:border-(--color-border-active)"
            />
          </div>

          {/* Icon Picker */}

          <div>
            <label className="mb-2 block text-[11px] font-semibold tracking-[0.04em] text-(--color-text-label)">
              Icon
            </label>

            <EnvIconPicker selected={icon} onChange={setIcon} />

            <div className="mt-2 text-[11px] leading-relaxed text-(--color-text-faint)">
              This icon identifies the environment across the sidebar, switcher, and audit log.
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex gap-2 border-t border-(--color-border) px-5 py-3.5">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className={`flex-1 rounded-sm px-4 py-2.25 font-(--font-sans) text-[13px] transition-colors duration-(--transition-fast) disabled:opacity-70 disabled:cursor-not-allowed${
              canSubmit
                ? 'cursor-pointer bg-(--color-primary) text-(--color-primary-text) hover:bg-(--color-primary-hover)'
                : 'cursor-not-allowed bg-(--color-surface-highlight) text-(--color-text-faint)'
            }`}
          >
            Create Environment
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer rounded-sm border border-(--color-border) bg-transparent px-4.5 py-2.25 text-[13px] text-(--color-text-muted) transition-colors duration-(--transition-fast) hover:border-(--color-border-hover) hover:bg-(--color-surface-hover) hover:text-(--color-text) disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}