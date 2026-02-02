import devLog from '../lib/logger';

// Icon component props
interface IconProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

// SVG path data for each icon
const ICON_PATHS: Record<string, string> = {
  // Row 1
  'code-brackets': 'M8 4l-4 4 4 4M16 4l4 4-4 4',
  'terminal': 'M4 6h16M4 12h16M4 18h16',
  'flow': 'M8 12h8M12 8l4 4-4 4',
  'database': 'M12 3c4 0 7 2 7 6s-3 6-7 6-7-2-7-6 3-6 7-6zM5 9c0 2 3 4 7 4s7-2 7-4',
  'bug': 'M12 4l-2 2 2 2 2-2-2-2zM10 12l-2 2 2 2 2-2-2-2zM14 12l-2 2 2 2 2-2-2-2',
  'save': 'M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8z',
  
  // Row 2
  'cloud': 'M12 4c-3 0-5 2-5 5 0 1 1 2 1 3 0 2-2 4-2 4h12c0 0-2-2-2-4 0-1 1-2 1-3 0-3-2-5-5-5z',
  'link': 'M8 12l4-4 4 4M12 8v8',
  'settings': 'M12 4v2M12 18v2M4 12h2M18 12h2M6 6l2 2M16 16l2 2M6 18l2-2M16 6l2-2',
  'lightning': 'M12 4l-4 8h4l-2 8 8-12h-4l2-4z',
  'document': 'M4 4h12v16H4V4zm2 2v12h8V6H6z',
  'globe': 'M12 4c4 0 7 3 7 7s-3 7-7 7-7-3-7-7 3-7 7-7zM4 12h16M12 4v16',
  
  // Row 3
  'plug': 'M8 8h8v8H8V8zm2 2v4h4v-4H10z',
  'warning': 'M12 4l8 16H4l8-16zm0 4v4m0 4h.01',
  'play': 'M8 6l8 6-8 6V6z',
  'refresh': 'M12 4v4l4-4M12 20v-4l-4 4M4 12h4l-4 4M20 12h-4l4-4',
  'code-block': 'M8 8h8v2H8V8zm0 4h8v2H8v-2zm0 4h8v2H8v-2',
  'package': 'M4 8l4-4h8l4 4v8l-4 4H8l-4-4V8z',
  
  // Additional icons from second image
  'sync': 'M12 4v4l4-4M12 20v-4l-4 4',
  'processing': 'M12 4v4l4-4M12 20v-4l-4 4M4 12h4l-4 4M20 12h-4l4-4',
  'tool': 'M8 8h8v8H8V8zm2 2v4h4v-4H10z',
  'grid': 'M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z'
};

// Size mappings
const SIZE_CLASSES = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10'
};

export const Icon: React.FC<IconProps> = ({ 
  name, 
  className = '', 
  size = 'md',
  color = 'currentColor'
}) => {
  const pathData = ICON_PATHS[name];
  
  if (!pathData) {
    devLog.warn(`Icon "${name}" not found`);
    return (
      <svg 
        className={`${SIZE_CLASSES[size]} ${className}`} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  }

  return (
    <svg
      className={`${SIZE_CLASSES[size]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={pathData} />
    </svg>
  );
};

// Pre-made icon components for easy usage
export const CodeIcon = (props: Omit<IconProps, 'name'>) => <Icon name="code-brackets" {...props} />;
export const TerminalIcon = (props: Omit<IconProps, 'name'>) => <Icon name="terminal" {...props} />;
export const FlowIcon = (props: Omit<IconProps, 'name'>) => <Icon name="flow" {...props} />;
export const DatabaseIcon = (props: Omit<IconProps, 'name'>) => <Icon name="database" {...props} />;
export const BugIcon = (props: Omit<IconProps, 'name'>) => <Icon name="bug" {...props} />;
export const SaveIcon = (props: Omit<IconProps, 'name'>) => <Icon name="save" {...props} />;
export const CloudIcon = (props: Omit<IconProps, 'name'>) => <Icon name="cloud" {...props} />;
export const LinkIcon = (props: Omit<IconProps, 'name'>) => <Icon name="link" {...props} />;
export const SettingsIcon = (props: Omit<IconProps, 'name'>) => <Icon name="settings" {...props} />;
export const LightningIcon = (props: Omit<IconProps, 'name'>) => <Icon name="lightning" {...props} />;
export const DocumentIcon = (props: Omit<IconProps, 'name'>) => <Icon name="document" {...props} />;
export const GlobeIcon = (props: Omit<IconProps, 'name'>) => <Icon name="globe" {...props} />;
export const PlugIcon = (props: Omit<IconProps, 'name'>) => <Icon name="plug" {...props} />;
export const WarningIcon = (props: Omit<IconProps, 'name'>) => <Icon name="warning" {...props} />;
export const PlayIcon = (props: Omit<IconProps, 'name'>) => <Icon name="play" {...props} />;
export const RefreshIcon = (props: Omit<IconProps, 'name'>) => <Icon name="refresh" {...props} />;
export const CodeBlockIcon = (props: Omit<IconProps, 'name'>) => <Icon name="code-block" {...props} />;
export const PackageIcon = (props: Omit<IconProps, 'name'>) => <Icon name="package" {...props} />;
export const SyncIcon = (props: Omit<IconProps, 'name'>) => <Icon name="sync" {...props} />;
export const ProcessingIcon = (props: Omit<IconProps, 'name'>) => <Icon name="processing" {...props} />;
export const ToolIcon = (props: Omit<IconProps, 'name'>) => <Icon name="tool" {...props} />;
export const GridIcon = (props: Omit<IconProps, 'name'>) => <Icon name="grid" {...props} />;

// Icon gallery component to display all icons
export const IconGallery: React.FC<{ className?: string }> = ({ className = '' }) => {
  const iconNames = Object.keys(ICON_PATHS);
  
  return (
    <div className={`grid grid-cols-6 gap-4 p-6 bg-black rounded-xl ${className}`}>
      {iconNames.map(name => (
        <div key={name} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <Icon name={name} size="lg" color="white" />
          <span className="text-xs text-white/70 truncate">{name}</span>
        </div>
      ))}
    </div>
  );
};