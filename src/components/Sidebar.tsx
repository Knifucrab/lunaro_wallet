import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, Box, useTheme } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const DRAWER_WIDTH = 80;

interface SidebarProps {
  open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <HomeIcon />, path: '/', label: 'Home' },
    { icon: <DashboardIcon />, path: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={open}
      sx={{
        width: { xs: 0, sm: DRAWER_WIDTH },
        flexShrink: 0,
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: 'white',
          borderRight: `1px solid ${theme.palette.divider}`,
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box sx={{ overflow: 'hidden', mt: 2 }}>
        <List>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem disablePadding sx={{ display: 'block', mb: 1 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: 'center',
                    px: 2.5,
                    mx: 1,
                    borderRadius: 2,
                    backgroundColor:
                      location.pathname === item.path ? theme.palette.primary.main : 'transparent',
                    color: location.pathname === item.path ? 'white' : theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor:
                        location.pathname === item.path
                          ? theme.palette.primary.dark
                          : theme.palette.action.hover,
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: 'center',
                      color: 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
