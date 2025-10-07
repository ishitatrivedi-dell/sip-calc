'use client';

import { useMemo, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Divider, ListItemIcon } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeProvider, useThemeMode } from '@/contexts/ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookmarkIcon from '@mui/icons-material/Bookmark';

function ThemeContent({ children }: { children: React.ReactNode }) {
  const { mode, toggleTheme } = useThemeMode();
  const pathname = usePathname();
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#00C896',
            light: '#34d9b0',
            dark: '#00a078',
          },
          secondary: {
            main: '#00B8D4',
            light: '#33c9dc',
            dark: '#0097a7',
          },
          background: {
            default: mode === 'dark' ? '#000000' : '#f9fafb',
            paper: mode === 'dark' ? '#0a0a0a' : '#ffffff',
          },
          text: {
            primary: mode === 'dark' ? '#ffffff' : '#1f2937',
            secondary: mode === 'dark' ? '#a0a0a0' : '#6b7280',
          },
          divider: mode === 'dark' ? '#1a1a1a' : '#e5e7eb',
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        shape: {
          borderRadius: 16,
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#0a0a0a' : '#ffffff',
                borderBottom: mode === 'dark' ? '1px solid #1a1a1a' : '1px solid #e5e7eb',
                backdropFilter: 'blur(10px)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#0a0a0a' : '#ffffff',
                borderColor: mode === 'dark' ? '#1a1a1a' : '#e5e7eb',
                borderRadius: '1rem',
                transition: 'all 0.3s ease',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '0.75rem',
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Enhanced Navigation Panel */}
      <AppBar position="sticky" elevation={0} sx={{ backdropFilter: 'blur(20px)', backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.8)' }}>
        <Toolbar sx={{ py: 1.5 }}>
          <Typography 
            variant="h5" 
            component={Link}
            href="/"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #00C896 0%, #00B8D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: 0.5,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            MetaMint
          </Typography>

          <Box sx={{ display: "flex", gap: 0.5, alignItems: 'center' }}>
            <Button 
              component={Link} 
              href="/funds"
              sx={{
                color: pathname === '/funds' ? 'primary.main' : 'text.secondary',
                fontWeight: 600,
                px: 2.5,
                py: 1,
                position: 'relative',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: mode === 'dark' ? 'rgba(0, 200, 150, 0.1)' : 'rgba(0, 200, 150, 0.05)',
                },
                '&::after': pathname === '/funds' ? {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '3px',
                  background: 'linear-gradient(90deg, #00C896, #00B8D4)',
                  borderRadius: '2px 2px 0 0',
                  boxShadow: '0 0 10px rgba(0, 200, 150, 0.5)',
                } : {},
              }}
            >
              Funds
            </Button>

            <Button 
              component={Link} 
              href="/watchlist"
              startIcon={<BookmarkIcon />}
              sx={{
                color: pathname === '/watchlist' ? 'primary.main' : 'text.secondary',
                fontWeight: 600,
                px: 2.5,
                py: 1,
                position: 'relative',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: mode === 'dark' ? 'rgba(0, 200, 150, 0.1)' : 'rgba(0, 200, 150, 0.05)',
                },
                '&::after': pathname === '/watchlist' ? {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '3px',
                  background: 'linear-gradient(90deg, #00C896, #00B8D4)',
                  borderRadius: '2px 2px 0 0',
                  boxShadow: '0 0 10px rgba(0, 200, 150, 0.5)',
                } : {},
              }}
            >
              Watchlist
            </Button>

            {/* Theme Toggle Button */}
            <IconButton 
              onClick={toggleTheme}
              sx={{
                ml: 1,
                color: 'text.secondary',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: mode === 'dark' ? 'rgba(0, 200, 150, 0.1)' : 'rgba(0, 200, 150, 0.05)',
                  transform: 'rotate(180deg)',
                },
              }}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Profile Menu */}
            <IconButton
              onClick={handleProfileClick}
              sx={{
                ml: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: mode === 'dark' ? 'rgba(0, 200, 150, 0.1)' : 'rgba(0, 200, 150, 0.05)',
                },
              }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  bgcolor: 'primary.main',
                  fontSize: '1rem',
                  fontWeight: 700,
                }}
              >
                U
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={handleProfileClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
                  border: `1px solid ${mode === 'dark' ? '#1E293B' : '#e5e7eb'}`,
                  boxShadow: mode === 'dark' 
                    ? '0 10px 40px rgba(0, 0, 0, 0.5)' 
                    : '0 10px 40px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <MenuItem onClick={handleProfileClose} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <DashboardIcon fontSize="small" sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <Typography variant="body2" fontWeight={600}>Dashboard</Typography>
              </MenuItem>
              <MenuItem onClick={handleProfileClose} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </ListItemIcon>
                <Typography variant="body2">Settings</Typography>
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={handleProfileClose} sx={{ py: 1.5, color: 'error.main' }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
                </ListItemIcon>
                <Typography variant="body2" fontWeight={600}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Page content */}
      <main style={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
        {children}
      </main>
    </MuiThemeProvider>
  );
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeContent>{children}</ThemeContent>
    </ThemeProvider>
  );
}
