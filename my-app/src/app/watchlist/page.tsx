"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  useTheme,
  Button,
} from "@mui/material";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import FundCard from "@/components/FundCard";
import { Scheme } from "@/types/scheme";

export default function WatchlistPage() {
  const theme = useTheme();
  const [watchlistedFunds, setWatchlistedFunds] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWatchlist() {
      setLoading(true);
      try {
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        
        if (watchlist.length === 0) {
          setWatchlistedFunds([]);
          setLoading(false);
          return;
        }

        // Fetch all funds
        const res = await fetch(`/api/mf?page=1&limit=10000`);
        const data = await res.json();
        
        // Filter only watchlisted funds
        const filtered = data.funds.filter((fund: Scheme) => 
          watchlist.includes(fund.code)
        );
        
        setWatchlistedFunds(filtered);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        setWatchlistedFunds([]);
      } finally {
        setLoading(false);
      }
    }

    fetchWatchlist();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Button
          component={Link}
          href="/funds"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          Back to Funds
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookmarkIcon sx={{ color: '#fff', fontSize: 32 }} />
          </Box>
          <Box>
            <Typography 
              variant="h3" 
              fontWeight={800} 
              sx={{ 
                color: 'text.primary',
                mb: 0.5,
              }}
            >
              My Watchlist
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {watchlistedFunds.length} fund{watchlistedFunds.length !== 1 ? 's' : ''} saved
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 6 }}>
          <Typography color="text.secondary">Loading watchlist...</Typography>
        </Box>
      ) : watchlistedFunds.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: "center",
            backgroundColor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <BookmarkIcon sx={{ fontSize: 80, color: 'text.disabled', opacity: 0.2 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} gutterBottom color="text.primary">
            Your watchlist is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Start adding funds to your watchlist to track them easily
          </Typography>
          <Button
            component={Link}
            href="/funds"
            variant="contained"
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
            }}
          >
            Explore Funds
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {watchlistedFunds.map((fund) => (
            <Grid key={fund.code} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <FundCard fund={fund} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
