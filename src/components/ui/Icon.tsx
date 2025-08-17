
import React from 'react';
import * as MuiIcons from '@mui/icons-material';

type IconName = keyof typeof MuiIcons;

interface IconProps {
  name: string;
  className?: string;
  sx?: object;
}

const iconMapping: { [key: string]: IconName } = {
  dashboard: 'DashboardOutlined',
  plus: 'AddCircleOutline',
  minus: 'RemoveCircleOutline',
  history: 'History',
  users: 'GroupOutlined',
  settings: 'SettingsOutlined',
  logout: 'Logout',
  search: 'Search',
  bell: 'NotificationsOutlined',
  chevronDown: 'ExpandMore',
  star: 'Star',
  'star-outline': 'StarBorder',
  briefcase: 'BusinessCenterOutlined',
  analytics: 'BarChart',
  'map-pin': 'LocationOnOutlined',
  'shield-check': 'VerifiedUserOutlined',
  'clock': 'AccessTime',
  'calendar': 'CalendarTodayOutlined',
  'bolt': 'BoltOutlined',
  'mail': 'MailOutline',
  'phone': 'PhoneOutlined',
  'user-circle': 'AccountCircleOutlined',
  'x-circle': 'CancelOutlined',
  'information-circle': 'InfoOutlined',
  'chat-bubble-left-right': 'ChatOutlined',
  'paper-clip': 'AttachFileOutlined',
  'paper-airplane': 'Send',
  photo: 'PhotoCameraBackOutlined',
  'video-camera': 'VideocamOutlined',
  'x-mark': 'Close',
};


const Icon: React.FC<IconProps> = ({ name, className, sx }) => {
  const MappedIcon = MuiIcons[iconMapping[name] as IconName];
  if (!MappedIcon) {
    // Return a default icon or null if no mapping is found
    return <MuiIcons.HelpOutline sx={sx} className={className} />;
  }
  return <MappedIcon sx={sx} className={className} />;
};

export default Icon;