// components/UnifiedCalculator.tsx
"use client";

import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  useTheme,
} from "@mui/material";
import CalculateIcon from '@mui/icons-material/Calculate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import SIPCalculator from './SIPCalculator';
import LumpSumCalculator from './LumpSumCalculator';
import SWPCalculator from './SWPCalculator';
import StepUpSIPCalculator from './StepUpSIPCalculator';
import StepUpSWPCalculator from './StepUpSWPCalculator';

interface UnifiedCalculatorProps {
  code: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`calculator-tabpanel-${index}`}
      aria-labelledby={`calculator-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UnifiedCalculator({ code }: UnifiedCalculatorProps) {
  const [selectedCalculator, setSelectedCalculator] = useState(0);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedCalculator(newValue);
  };

  const calculators = [
    { label: 'SIP', icon: <TrendingUpIcon sx={{ fontSize: 18 }} /> },
    { label: 'Lump Sum', icon: <AccountBalanceIcon sx={{ fontSize: 18 }} /> },
    { label: 'SWP', icon: <ShowChartIcon sx={{ fontSize: 18 }} /> },
    { label: 'Step Up SIP', icon: <TimelineIcon sx={{ fontSize: 18 }} /> },
    { label: 'Step Up SWP', icon: <CalculateIcon sx={{ fontSize: 18 }} /> },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        background: theme.palette.background.paper,
      }}
    >
      {/* Calculator Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: isDark ? '#000000' : '#f8f9fa',
          px: 2,
        }}
      >
        <Tabs
          value={selectedCalculator}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 56,
            '& .MuiTab-root': {
              color: isDark ? '#8b92b0' : 'text.secondary',
              minHeight: 56,
              textTransform: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              px: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: 'primary.main',
                bgcolor: isDark ? '#1a1a1a' : 'rgba(0, 200, 150, 0.05)',
              },
            },
            '& .Mui-selected': {
              color: 'primary.main !important',
            },
            '& .MuiTabs-indicator': {
              bgcolor: 'primary.main',
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          {calculators.map((calc, index) => (
            <Tab
              key={index}
              label={calc.label}
              icon={calc.icon}
              iconPosition="start"
              id={`calculator-tab-${index}`}
              aria-controls={`calculator-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Calculator Content */}
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <TabPanel value={selectedCalculator} index={0}>
          <SIPCalculator code={code} />
        </TabPanel>
        <TabPanel value={selectedCalculator} index={1}>
          <LumpSumCalculator code={code} />
        </TabPanel>
        <TabPanel value={selectedCalculator} index={2}>
          <SWPCalculator code={code} />
        </TabPanel>
        <TabPanel value={selectedCalculator} index={3}>
          <StepUpSIPCalculator code={code} />
        </TabPanel>
        <TabPanel value={selectedCalculator} index={4}>
          <StepUpSWPCalculator code={code} />
        </TabPanel>
      </Box>
    </Paper>
  );
}
