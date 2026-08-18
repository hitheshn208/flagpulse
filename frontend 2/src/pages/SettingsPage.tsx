import { useState } from 'react'
import { Copy, Check, Shield, Trash2, UserPlus } from 'lucide-react'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@/app/store';
import { deleteProject } from '@/services/project.service';
import { removeProject } from '@/features/projectSlice';
import { setPage } from '@/features/uiSlice';

interface SettingsPageProps {
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void
}

function DeleteModal({ projectName, onClose, loading, onConfirm }: { projectName: string | undefined ; loading: boolean ;onClose: () => void; onConfirm: () => void }) {
  const [typed, setTyped] = useState('')
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#101715', border: '1px solid #1E2926', borderTop: '3px solid #F43F5E', borderRadius: 10, padding: 28, maxWidth: 420, width: '100%', margin: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={14} style={{ color: '#F43F5E' }} />
          </div>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, color: '#F0FDF4', margin: 0 }}>Delete Project</h3>
        </div>
        <p style={{ fontSize: 13, color: '#94A3A8', lineHeight: 1.6, marginBottom: 16 }}>
          This action is <strong style={{ color: '#F43F5E' }}>permanent and irreversible</strong>. All flags, environments, and audit history will be permanently deleted.
        </p>
        <p style={{ fontSize: 13, color: '#94A3A8', marginBottom: 8 }}>
          Type <code style={{ fontFamily: "'JetBrains Mono', monospace", background: '#141F1C', padding: '1px 5px', borderRadius: 3, color: '#F0FDF4' }}>{projectName}</code> to confirm:
        </p>
        <input
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder={projectName}
          style={{ width: '100%', background: '#141F1C', border: '1px solid #1E2926', color: '#F0FDF4', borderRadius: 6, padding: '9px 12px', fontSize: 13, outline: 'none', marginBottom: 16, fontFamily: "'Inter', sans-serif" }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onConfirm}
            disabled={typed !== projectName || loading}
            style={{ flex: 1, background: typed === projectName ? '#F43F5E' : '#1E2926', color: typed === projectName ? '#fff' : '#6B8E87', border: 'none', borderRadius: 6, padding: '9px', fontSize: 13, fontWeight: 700, cursor: typed === projectName ? 'pointer' : 'not-allowed', fontFamily: "'Sora', sans-serif" }}
          >
            Delete Project
          </button>
          <button disabled={loading} onClick={onClose} style={{ flex: 1, background: 'transparent', border: '1px solid #1E2926', borderRadius: 6, padding: '9px', fontSize: 13, color: '#94A3A8', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}


export default function SettingsPage({ onToast }: SettingsPageProps) {

  const project = useSelector((state: RootState) => state.project.currentProject);

  const [projectName, setProjectName] = useState(project?.name)
  const [showDelete, setShowDelete] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setloading] = useState(false)

  const dispatch = useDispatch();

  const handleCopyId = () => {
    navigator.clipboard.writeText(typeof project?.id === "string" ? project?.id : "").catch(() => {})
    setCopied(true)
    onToast('Project ID copied', 'info')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async ()=>{
    setloading(true);
    if(!project) return;
    try{
      await deleteProject(project?.id);
      dispatch(removeProject({id: project?.id}));
      dispatch(setPage("projects"));
    }catch(error){
      onToast("Failed to delete project", "error")
    }finally{
      setloading(false);
      setShowDelete(false);
    }
  }

  return (
    <div style={{ padding: '24px 28px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: '#F0FDF4', margin: 0, letterSpacing: '-0.02em' }}>Project Settings</h1>
        <p style={{ fontSize: 13, color: '#6B8E87', margin: '4px 0 0' }}>Manage configuration, team access, and danger zone</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Total Flags', value: project?.flags_count },
          { label: 'Environments', value: project?.environments_count },
          { label: 'Created', value: project ? new Date(project?.created_at).toLocaleDateString('en-GB', { day: "2-digit", month:"long", year: "numeric"}) : "NA" },
        ].map(s => (
          <div key={s.label} style={{ background: '#101715', border: '1px solid #1E2926', borderRadius: 7, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, color: '#6B8E87', fontWeight: 600, letterSpacing: '0.07em', marginBottom: 5 }}>{s.label.toUpperCase()}</div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700, color: '#F0FDF4' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* General section */}
      <div style={{ background: '#101715', border: '1px solid #1E2926', borderRadius: 8, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#6B8E87', letterSpacing: '0.06em', marginBottom: 16 }}>GENERAL</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94A3A8', marginBottom: 5 }}>Project name</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                style={{ flex: 1, background: '#141F1C', border: '1px solid #1E2926', color: '#F0FDF4', borderRadius: 6, padding: '8px 12px', fontSize: 13, outline: 'none', fontFamily: "'Inter', sans-serif" }}
                onFocus={e => (e.target.style.borderColor = '#10B981')}
                onBlur={e => (e.target.style.borderColor = '#1E2926')}
              />
              <button
                onClick={() => onToast('Project name saved', 'success')}
                style={{ background: '#10B981', color: '#080C0B', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                Save
              </button>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94A3A8', marginBottom: 5 }}>Project ID</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#38BDF8', background: '#0B100F', padding: '7px 10px', borderRadius: 5, border: '1px solid #1E2926', flex: 1 }}>
                {project?.id}
              </code>
              <button onClick={handleCopyId} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: '1px solid #1E2926', borderRadius: 5, padding: '6px 10px', fontSize: 11, color: '#6B8E87', cursor: 'pointer' }}>
                {copied ? <Check size={10} style={{ color: '#10B981' }} /> : <Copy size={10} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div style={{ fontSize: 11, color: '#6B8E87', marginTop: 4 }}>Read-only. Used for API calls and SDK initialization.</div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div style={{ background: 'rgba(244,63,94,0.04)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 8, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Shield size={13} style={{ color: '#F43F5E' }} />
          <div style={{ fontSize: 11, fontWeight: 600, color: '#F43F5E', letterSpacing: '0.06em' }}>DANGER ZONE</div>
        </div>
        <p style={{ fontSize: 13, color: '#94A3A8', lineHeight: 1.6, marginBottom: 16 }}>
          Deleting this project will permanently remove all feature flags, environments, and audit history. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDelete(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgb(255, 39, 39)', color: '#FFFFFF', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 6, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          <Trash2 size={13} />
          Delete this project
        </button>
      </div>

      {showDelete && (
        <DeleteModal
          projectName={project?.name}
          loading={loading}
          onClose={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
