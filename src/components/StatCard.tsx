import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  bgColor?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor = '#fff', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        sx={(theme) => {
          const provided = Boolean(bgColor);
          const vividBg = provided
            ? alpha(bgColor as string, 0.22)
            : alpha(theme.palette.background.paper, 0.06);
          const gradient = provided
            ? `linear-gradient(135deg, ${alpha(bgColor as string, 0.32)}, ${alpha(
                theme.palette.background.paper,
                0.02,
              )})`
            : undefined;
          return {
            height: '100%',
            bgcolor: vividBg,
            backgroundImage: gradient,
            color: 'inherit',
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.common.white, 0.06)}`,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: provided
              ? `0 10px 30px ${alpha(bgColor as string, 0.18)}`
              : '0 6px 18px rgba(2,6,23,0.45)',
          };
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
          >
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {icon && (
              <Box
                sx={(theme) => {
                  const provided = Boolean(bgColor);
                  return {
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: provided
                      ? alpha(bgColor as string, 0.28)
                      : alpha(
                          theme.palette.common.white,
                          theme.palette.mode === 'dark' ? 0.04 : 0.18,
                        ),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: provided
                      ? `1px solid ${alpha(bgColor as string, 0.36)}`
                      : `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
                  };
                }}
              >
                {icon}
              </Box>
            )}
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
