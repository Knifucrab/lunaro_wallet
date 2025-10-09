import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { TrendingUp } from '@mui/icons-material';

interface APYCardProps {
  apy?: number;
}

const APYCard: React.FC<APYCardProps> = ({ apy = 8.6 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card
        sx={(theme) => {
          const positive = apy >= 0;
          const baseHex = positive ? '#10B981' : '#DC2626';
          const tintStrong = alpha(baseHex, 0.28);
          return {
            height: '100%',
            bgcolor: alpha(theme.palette.background.paper, 0.06),
            backgroundImage: `linear-gradient(135deg, ${tintStrong}, ${alpha(
              theme.palette.background.paper,
              0.02,
            )})`,
            color: 'inherit',
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.common.white, 0.06)}`,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: `0 10px 30px ${alpha(theme.palette.background.paper, 0.18)}`,
          };
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
          >
            <Typography variant="body2" color="text.secondary">
              APY
            </Typography>
            <Box
              sx={() => {
                const positive = apy >= 0;
                const baseHex = positive ? '#10B981' : '#DC2626';
                return {
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: alpha(baseHex, 0.22),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${alpha(baseHex, 0.36)}`,
                };
              }}
            >
              <TrendingUp sx={{ color: apy >= 0 ? '#047857' : '#991B1B' }} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            +{apy.toFixed(1)}%
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default APYCard;
