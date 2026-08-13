import { useState, useCallback, useEffect } from 'react'
import ProjectsPage from './pages/ProjectPage/ProjectsPage'
import FlagsPage from './pages/FlagsPage/FlagsPage'
import CreateFlagPage from './pages/CreateFlagPage'
import EnvironmentsPage from './pages/EnvironmentPage/EnvironmentsPage'
import SettingsPage from './pages/SettingsPage'
import AuditLogPage from './pages/AuditLogPage'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import ToastContainer, { type ToastData } from './components/Toast'
import { ENVIRONMENTS, type Project, type Environment, type EnvName, type ActualProject, ActualEnvironment } from './data'
import { getProjects } from './services/project.service'
import { getEnvironments } from './services/environment.service'

type Page = 'projects' | 'flags' | 'environments' | 'settings' | 'audit' | 'create-flag'

let toastIdCounter = 0

export default function App() {
  const [page, setPage] = useState<Page>('projects')

  const [projects, setProjects] = useState<ActualProject[]>([]);
  const [currentProject, setCurrentProject] = useState<ActualProject>()
  

  const [environments, setEnvironments] = useState<ActualEnvironment[]>([]);
  const [currentEnv, setCurrentEnv] = useState<Environment>(ENVIRONMENTS[2])
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = String(++toastIdCounter)
    setToasts(t => [...t, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

    const fetchProjects = async () => {
    const response= await getProjects();
    setProjects(response);
    setCurrentProject(response[0])
  }
  useEffect(()=>{
    fetchProjects();
  }, []);

    const fetchEnvironments =  async (projectId: string ) => {
      let response : ActualEnvironment[]
      if(projectId !== ""){
        response = await getEnvironments(projectId);
        setEnvironments(response)
      }
    }

    useEffect(()=>{
      fetchEnvironments(currentProject ? currentProject.id : "");
    },[currentProject])

  const navigate = (p: string) => setPage(p as Page)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#000000' }}>
      <Sidebar
        currentPage={page === 'create-flag' ? 'flags' : page}
        onNavigate={navigate}
        currentProject={currentProject}
        projects={projects}
        onProjectChange={p => { setCurrentProject(p); setPage('flags') }}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(s => !s)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar
          currentPage={page === 'create-flag' ? 'flags' : page}
          currentProject={currentProject}
          currentEnv={currentEnv}
          environments={ENVIRONMENTS}
          onEnvChange={env => setCurrentEnv(env)}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(s => !s)}
        />

        <main style={{ flex: 1, overflow: 'auto' }}>
          {page === 'projects' && (
            <ProjectsPage onSelectProject={p => { setCurrentProject(p); setPage('flags') }} projects={projects}/>
          )}
          {(page === 'flags') && (
            <FlagsPage
              currentEnv={currentEnv.key as EnvName}
              onNavigate={navigate}
              onToast={addToast}
            />
          )}
          {page === 'create-flag' && (
            <CreateFlagPage onNavigate={navigate} onToast={addToast} />
          )}
          {page === 'environments' && (
            <EnvironmentsPage onToast={addToast} environments={environments}/>
          )}
          {page === 'settings' && (
            <SettingsPage project={currentProject} onToast={addToast} />
          )}
          {page === 'audit' && (
            <AuditLogPage />
          )}
        </main>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
