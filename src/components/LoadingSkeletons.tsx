import React from 'react';
import { Card, CardContent, Skeleton, Box } from '@mui/material';

interface LoadingSkeletonProps {
  rows?: number;
  height?: number;
}

export const CardSkeleton: React.FC<LoadingSkeletonProps> = ({ rows = 3, height = 40 }) => (
  <Card>
    <CardContent>
      {[...Array(rows)].map((_, index) => (
        <Box key={index} sx={{ mb: index === rows - 1 ? 0 : 2 }}>
          <Skeleton variant="rectangular" height={height} />
        </Box>
      ))}
    </CardContent>
  </Card>
);

export const TableSkeleton: React.FC = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
      {[...Array(5)].map((_, index) => (
        <Box key={index} sx={{ mb: 1, display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width="15%" height={30} />
          <Skeleton variant="rectangular" width="15%" height={30} />
          <Skeleton variant="rectangular" width="20%" height={30} />
          <Skeleton variant="rectangular" width="25%" height={30} />
          <Skeleton variant="rectangular" width="25%" height={30} />
        </Box>
      ))}
    </CardContent>
  </Card>
);

export const BalanceSkeleton: React.FC = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="text" width="40%" />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="text" width="40%" />
      </Box>
    </CardContent>
  </Card>
);
