'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  Box,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Avatar,
  Badge,
  Chip,
  Paper,
  LinearProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
// Using simple div-based icons for now
const DashboardIcon = () => <div>📊</div>;
const TrendingUp = () => <div>📈</div>;
const AccountBalance = () => <div>🏦</div>;
const Chat = () => <div>💬</div>;
const Folder = () => <div>📁</div>;
const Settings = () => <div>⚙️</div>;
const History = () => <div>📜</div>;
const Newspaper = () => <div>📰</div>;
const Feedback = () => <div>💭</div>;
const Search = () => <div>🔍</div>;
const Notifications = () => <div>🔔</div>;
const ShowChart = () => <div>📊</div>;
const ArrowUpward = () => <div>⬆️</div>;
const ArrowDownward = () => <div>⬇️</div>;
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import NavChart from '@/components/NavChart';
import ReturnsTable from '@/components/ReturnsTable';
import UnifiedCalculator from '@/components/UnifiedCalculator';

const DRAWER_WIDTH = 240;

const sidebarItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, active: true }
];

export default function SchemeDetailPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { code } = useParams();
  const [scheme, setScheme] = useState<{ meta: any; navHistory: { date: string; nav: number }[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedInterval, setSelectedInterval] = useState('1Y');
  const [rollingReturns, setRollingReturns] = useState<{ date: string; return: number }[]>([]);

  // Define intervals with days for rolling return calculation
  const intervals = [
    { label: '1 Day', value: '1D', days: 1 },
    { label: '1 Month', value: '1M', days: 30 },
    { label: '1 Year', value: '1Y', days: 365 },
    { label: '3 Years', value: '3Y', days: 365 * 3 },
    { label: '5 Years', value: '5Y', days: 365 * 5 },
  ];

  useEffect(() => {
    if (code) {
      setLoading(true);
      fetch(`/api/scheme/${code}`)
        .then((res) => res.json())
        .then((data) => {
          setScheme(data);
          setLoading(false);
          // Compute initial rolling returns
          computeRollingReturns(data.navHistory, intervals.find(i => i.value === selectedInterval)?.days || 365);
        })
        .catch((error) => {
          console.error('Error fetching scheme:', error);
          setLoading(false);
        });
    }
  }, [code]);

  // Compute rolling returns based on selected interval
  const computeRollingReturns = (navHistory: { date: string; nav: number }[], lookbackDays: number) => {
    if (!navHistory || navHistory.length < 2) {
      setRollingReturns([]);
      return;
    }

    const sortedHistory = [...navHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const returns: { date: string; return: number }[] = [];
    const lookbackMs = lookbackDays * 24 * 60 * 60 * 1000;

    sortedHistory.forEach((current, index) => {
      const currentDate = new Date(current.date).getTime();
      const pastDate = currentDate - lookbackMs;

      let pastNav = current.nav; // Default to current NAV if no past data
      for (let i = index - 1; i >= 0; i--) {
        const pastEntry = sortedHistory[i];
        if (new Date(pastEntry.date).getTime() <= pastDate) {
          pastNav = pastEntry.nav;
          break;
        }
      }

      const returnPct = pastNav > 0 ? ((current.nav - pastNav) / pastNav) * 100 : 0;
      returns.push({ date: current.date, return: returnPct });
    });

    setRollingReturns(returns);
  };

  useEffect(() => {
    if (scheme?.navHistory) {
      const interval = intervals.find(i => i.value === selectedInterval);
      computeRollingReturns(scheme.navHistory, interval?.days || 365);
    }
  }, [selectedInterval, scheme]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 3 }} />
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
                <Box sx={{ height: 320, bgcolor: "grey.50", borderRadius: 1 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 1 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!scheme) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Fund not found
        </Typography>
      </Container>
    );
  }

  const { meta, navHistory} = scheme;
  const oneYearNav = navHistory.slice(0, 365).reverse();

  // Mock data for indices
  const indices = [
    { name: 'GOLD', value: '2,145.30', change: '+2.5%', positive: true },
    { name: 'DOWJ2', value: '34,567.89', change: '-0.8%', positive: false },
    { name: 'S&P', value: '4,234.56', change: '+1.2%', positive: true },
    { name: 'NASDAQ', value: '13,456.78', change: '+0.9%', positive: true },
  ];

  // Mock sector strength data
  const sectorStrength = [
    { sector: 'Textile', value: 85 },
    { sector: 'Miscellaneous', value: 72 },
    { sector: 'Engineering', value: 68 },
    { sector: 'Bank', value: 91 },
    { sector: 'Pharma', value: 78 },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: `1px solid ${theme.palette.divider}`,
            color: 'text.primary',
          },
        }}
      >
        <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: 'primary.main' }}>
            MetaMint
          </Typography>
        </Box>
        <List sx={{ px: 2, py: 2 }}>
          {sidebarItems.map((item, index) => (
            <ListItemButton
              key={index}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: item.active ? 'primary.main' : 'transparent',
                color: item.active ? '#fff' : 'text.secondary',
                '&:hover': {
                  bgcolor: item.active ? 'primary.dark' : (isDark ? '#1a2142' : '#f3f4f6'),
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        {/* Top AppBar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>
              Dashboard
            </Typography>
            <Paper
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: isDark ? '#1a2142' : '#f3f4f6',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                mr: 2,
              }}
            >
              <Search />
              <InputBase placeholder="Search..." sx={{ ml: 1, color: 'text.secondary' }} />
            </Paper>
            <IconButton sx={{ color: 'text.secondary', mr: 1 }}>
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>U</Avatar>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Fund Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={700} sx={{ color: 'text.primary', mb: 1 }}>
              {meta.scheme_name}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {meta.fund_house} • {meta.scheme_category}
            </Typography>
          </Box>

          {/* Index Summary Bar */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {indices.map((index, i) => (
              <Grid key={i} size={{ xs: 6, sm: 3 }}>
                <Card sx={{ bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {index.name}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, my: 0.5 }}>
                      {index.value}
                    </Typography>
                    <Chip
                      label={index.change}
                      size="small"
                      sx={{
                        bgcolor: index.positive ? (isDark ? '#10b98120' : '#10b98130') : (isDark ? '#ef444420' : '#ef444430'),
                        color: index.positive ? (isDark ? '#10b981' : '#059669') : (isDark ? '#ef4444' : '#dc2626'),
                        fontWeight: 600,
                        height: 20,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            {/* NAV Performance Chart */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card sx={{ bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}`, borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                      NAV Performance
                    </Typography>
                    <Tabs
                      value={selectedTab}
                      onChange={(e, v) => setSelectedTab(v)}
                      sx={{
                        minHeight: 32,
                        '& .MuiTab-root': {
                          color: 'text.secondary',
                          minHeight: 32,
                          py: 0.5,
                          px: 2,
                          fontSize: '0.875rem',
                        },
                        '& .Mui-selected': {
                          color: 'primary.main !important',
                        },
                        '& .MuiTabs-indicator': {
                          bgcolor: 'primary.main',
                        },
                      }}
                    >
                      <Tab label="1Y" />
                      <Tab label="3Y" />
                      <Tab label="5Y" />
                    </Tabs>
                  </Box>
                  <Box sx={{ height: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={oneYearNav}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                        <XAxis dataKey="date" stroke={theme.palette.text.secondary} tick={{ fill: theme.palette.text.secondary }} />
                        <YAxis dataKey="nav" stroke={theme.palette.text.secondary} tick={{ fill: theme.palette.text.secondary }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }}
                          labelStyle={{ color: theme.palette.text.primary }}
                        />
                        <Line type="monotone" dataKey="nav" stroke={theme.palette.primary.main} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Sector Strength Meter */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Card sx={{ bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}`, borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, mb: 3 }}>
                    Sector Strength
                  </Typography>
                  <Stack spacing={2}>
                    {sectorStrength.map((sector, i) => (
                      <Box key={i}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {sector.sector}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                            {sector.value}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={sector.value}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: isDark ? '#1a2142' : '#e5e7eb',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: 'primary.main',
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Returns Table */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, mb: 2 }}>
                    Performance Returns
                  </Typography>
                  <ReturnsTable code={meta.scheme_code} />
                </CardContent>
              </Card>
            </Grid>

            {/* Rolling Returns */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                      Rolling Returns
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={selectedInterval}
                        onChange={(e) => setSelectedInterval(e.target.value as string)}
                        sx={{
                          color: 'text.primary',
                          bgcolor: isDark ? '#1a2142' : '#f3f4f6',
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        }}
                      >
                        {intervals.map((interval) => (
                          <MenuItem key={interval.value} value={interval.value}>
                            {interval.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ height: 240 }}>
                    {rollingReturns.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rollingReturns}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                          <XAxis dataKey="date" stroke={theme.palette.text.secondary} tick={{ fill: theme.palette.text.secondary }} />
                          <YAxis stroke={theme.palette.text.secondary} tick={{ fill: theme.palette.text.secondary }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}
                            labelStyle={{ color: theme.palette.text.primary }}
                          />
                          <Line type="monotone" dataKey="return" stroke="#f59e0b" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <Typography sx={{ color: 'text.secondary', textAlign: 'center', pt: 10 }}>
                        No data available
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Unified Calculator Section */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700, my: 3 }}>
                Investment Calculators
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card sx={{ bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                <UnifiedCalculator code={meta.scheme_code} />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}