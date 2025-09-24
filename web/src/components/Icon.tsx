import React from 'react';
import { 
  Heart, 
  Calendar, 
  MessageSquare, 
  Sparkles, 
  User, 
  Book, 
  Gamepad2, 
  Bot, 
  Settings, 
  LogOut,
  Lock,
  Home,
  Brain,
  MessageCircle,
  Edit,
  Flower,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Flame,
  Check,
  AlertTriangle,
  Clock,
  X,
  type LucideIcon
} from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  home: Home,
  calendar: Calendar,
  'message-square': MessageSquare,
  chat: MessageCircle,
  sparkles: Sparkles,
  user: User,
  book: Book,
  gamepad2: Gamepad2,
  bot: Bot,
  settings: Settings,
  'log-out': LogOut,
  lock: Lock,
  brain: Brain,
  edit: Edit,
  flower: Flower,
  sun: Sun,
  moon: Moon,
  eye: Eye,
  'eye-off': EyeOff,
  fire: Flame,
  check: Check,
  exclamation: AlertTriangle,
  hourglass: Clock,
  clock: Clock,
  close: X,
};

export default function Icon({ name, size = 24, color, className = '', style }: IconProps) {
  const IconComponent = iconMap[name] || Heart;
  
  return (
    <IconComponent 
      size={size} 
      color={color}
      className={className}
      style={style}
    />
  );
}