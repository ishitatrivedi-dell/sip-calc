// Wildcard declaration for all MUI icons - handles any icon import
declare module '@mui/icons-material/*' {
  import { SvgIconComponent } from '@mui/material';
  const Icon: SvgIconComponent;
  export default Icon;
}

