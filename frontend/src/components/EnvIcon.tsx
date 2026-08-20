import { Code2, FlaskConical, Rocket, Globe, Bug, Settings, ToggleLeft, SquarePlus, SquarePen } from 'lucide-react'
import type { EnvIconName } from '../data'

const MAP: Record<EnvIconName, React.FC<{ size?: number; style?: React.CSSProperties }>> = {
  code:     Code2,
  flask:    FlaskConical,
  rocket:   Rocket,
  globe:    Globe,
  bug:      Bug,
  settings: Settings,
  flag_toggle: ToggleLeft,
  flag_creation : SquarePlus,
  flag_updation: SquarePen,
}

export const ENV_ICON_OPTIONS: { key: EnvIconName; label: string }[] = [
  { key: 'globe',    label: 'Global'  },
  { key: 'rocket',   label: 'Rocket'  },
  { key: 'code',     label: 'Code'    },
  { key: 'flask',    label: 'Science' },
  { key: 'bug',      label: 'Bug'     },
  { key: 'settings', label: 'Settings'},
  { key: 'flag_toggle', label: 'Flag Toggle'},
]

interface EnvIconProps {
  name: EnvIconName | string
  size?: number
  color?: string
  style?: React.CSSProperties
}

export default function EnvIcon({ name, size = 12, color = "#ffffff", style }: EnvIconProps) {
  const Icon = MAP[name as EnvIconName] ?? Globe
  return <Icon size={size} style={{ color, ...style }} />
}
