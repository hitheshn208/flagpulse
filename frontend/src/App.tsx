import { useState, useCallback, useEffect } from 'react'
import ProjectsPage from './pages/ProjectPage/ProjectsPage'
import FlagsPage from './pages/FlagsPage/FlagsPage'
import CreateFlagPage from './pages/CreateFlagPage/CreateFlagPage'
import EnvironmentsPage from './pages/EnvironmentPage/EnvironmentsPage'
import SettingsPage from './pages/SettingsPage'
import AuditLogPage from './pages/AuditLogsPage/AuditLogPage'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import ToastContainer, { type ToastData } from './components/Toast'
import { ActualEnvironment, AuditLog } from './data'
import { getProjects } from './services/project.service'
import { getEnvironments } from './services/environment.service'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './app/store'
import { setCurrentProject, setProjects } from './features/projectSlice'
import { setPage } from './features/uiSlice'
import { setEnvironments, setCurrentEnv } from './features/environmentSlice'
type Page = 'projects' | 'flags' | 'environments' | 'settings' | 'audit' | 'create-flag'

let toastIdCounter = 0

export default function App() {


  const dispatch = useDispatch();

  const page = useSelector((state:RootState)=> state.uiState.page);

  const currentProject = useSelector((state: RootState) => state.project.currentProject)
  const projects = useSelector((state:RootState)=> state.project.projects)

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
    dispatch(setProjects(response));
    dispatch(setCurrentProject(response[0]));
  }
  useEffect(()=>{
    fetchProjects();
  }, []);

  const fetchEnvironments =  async (projectId: string ) => {
    let response : ActualEnvironment[]
    if(projectId !== ""){
      response = await getEnvironments(projectId);
      dispatch(setEnvironments(response))
    }
  }

    useEffect(()=>{
      fetchEnvironments(currentProject ? currentProject.id : "");
    },[currentProject])

  const navigate = (p: string) => dispatch(setPage(p as Page))

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#000000' }}>
      <Sidebar
        currentPage={page === 'create-flag' ? 'flags' : page}
        onNavigate={navigate}
        onProjectChange={(p) => {  dispatch(setCurrentProject(p)); dispatch(setPage('flags')) }}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(s => !s)}
        onToast={addToast}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar
          currentPage={page === 'create-flag' ? 'flags' : page}
          onEnvChange={env => dispatch(setCurrentEnv(env))}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(s => !s)}
        />

        <main style={{ flex: 1, overflow: 'auto' }}>
          {page === 'projects' && (
            <ProjectsPage onSelectProject={p => { dispatch(setCurrentProject(p)); dispatch(setPage('flags')) }} projects={projects} onToast={addToast}/>
          )}
          {(page === 'flags') && (
            <FlagsPage
              onNavigate={navigate}
              onToast={addToast}
            />
          )}
          {page === 'create-flag' && (
            <CreateFlagPage onNavigate={navigate} onToast={addToast} />
          )}
          {page === 'environments' && (
            <EnvironmentsPage onToast={addToast}/>
          )}
          {page === 'settings' && (
            <SettingsPage onToast={addToast} />
          )}
          {page === 'audit' && (
            <AuditLogPage onToast={addToast}/>
          )}
        </main>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
