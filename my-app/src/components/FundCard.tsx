"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Box,
  useTheme,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Link from "next/link";

export default function FundCard({ fund }: { fund: any }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setIsWatchlisted(watchlist.includes(fund.code));
  }, [fund.code]);

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (isWatchlisted) {
      const updated = watchlist.filter((code: string) => code !== fund.code);
      localStorage.setItem('watchlist', JSON.stringify(updated));
      setIsWatchlisted(false);
    } else {
      watchlist.push(fund.code);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      setIsWatchlisted(true);
    }
  };

  return (
    <Link href={`/scheme/${fund.code}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card
        elevation={0}
        sx={{
          height: "100%",
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          "&:hover": {
            transform: "translateY(-8px) scale(1.02)",
            boxShadow: isDark 
              ? `0 12px 40px rgba(0, 200, 150, 0.2), 0 0 0 1px ${theme.palette.primary.main}` 
              : `0 12px 40px rgba(0, 200, 150, 0.15), 0 0 0 1px ${theme.palette.primary.main}`,
            borderColor: 'primary.main',
            '& .fund-glow': {
              opacity: 1,
            },
          },
        }}
      >
        {/* Glow Effect */}
        <Box
          className="fund-glow"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            height: "100%",
            position: 'relative',
          }}
        >
          {/* Header with Icon and Watchlist */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 3,
                  padding: '1px',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                },
              }}
            >
              <AccountBalanceIcon sx={{ color: "primary.main", fontSize: 26 }} />
            </Box>

            <IconButton
              size="small"
              onClick={toggleWatchlist}
              sx={{
                color: isWatchlisted ? 'primary.main' : 'text.secondary',
                transition: 'all 0.3s ease',
                zIndex: 1,
                '&:hover': {
                  color: 'primary.main',
                  transform: 'scale(1.1)',
                },
              }}
            >
              {isWatchlisted ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Box>

          {/* Fund Name */}
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              color: 'text.primary',
              lineHeight: 1.3,
              mb: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: 52,
              fontSize: '1rem',
            }}
          >
            {fund.name}
          </Typography>

          {/* Stats Section */}
          <Stack spacing={1} sx={{ width: '100%', mt: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Code
              </Typography>
              <Chip
                label={fund.code}
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  bgcolor: `${theme.palette.primary.main}15`,
                  color: 'primary.main',
                  border: `1px solid ${theme.palette.primary.main}30`,
                }}
              />
            </Box>

            <Box
              sx={{
                pt: 1.5,
                borderTop: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 16, color: "primary.main" }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                View Details →
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Card>
    </Link>
  );
}