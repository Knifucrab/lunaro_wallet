import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  GridView as OverviewIcon,
  TrendingUp as TradeIcon,
  AccountBalanceWallet as WalletIcon,
  BarChart as AnalyticsIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  Logout as LogOutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';

const DRAWER_WIDTH = 240;

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    { icon: <OverviewIcon />, path: '/dashboard', label: 'Overview' },
    { icon: <TradeIcon />, path: '/trade', label: 'Trade' },
    { icon: <WalletIcon />, path: '/wallet', label: 'Wallet' },
    { icon: <AnalyticsIcon />, path: '/analytics', label: 'Analytics' },
    { icon: <MessageIcon />, path: '/message', label: 'Message' },
  ];

  const bottomMenuItems = [
    { icon: <SettingsIcon />, path: '/settings', label: 'Settings' },
    { icon: <LogOutIcon />, path: '/logout', label: 'Log Out' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const { isConnected } = useAccount();

  const drawerContent = (
    <>
      {/* Logo and Brand */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          component="img"
          src="/black_wonderland_logo.svg"
          alt="Lunaro Logo"
          sx={{ width: 32, height: 32 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Lunaro Wallet
        </Typography>
      </Box>
      {isConnected ? (
        <>
          {/* Main Menu */}
          <Box sx={{ overflow: 'hidden', mt: 2, flex: 1 }}>
            <List>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        minHeight: 48,
                        px: 3,
                        mx: 2,
                        borderRadius: 2,
                        backgroundColor: location.pathname === item.path ? '#000' : 'transparent',
                        color:
                          location.pathname === item.path ? 'white' : theme.palette.text.primary,
                        '&:hover': {
                          backgroundColor:
                            location.pathname === item.path ? '#000' : theme.palette.action.hover,
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 40,
                          color: 'inherit',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.95rem',
                          fontWeight: location.pathname === item.path ? 600 : 400,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </motion.div>
              ))}
            </List>
          </Box>

          {/* Bottom Menu */}
          <Box sx={{ mb: 2 }}>
            <List>
              {bottomMenuItems.map((item) => (
                <ListItem key={item.path} disablePadding sx={{ display: 'block', mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      minHeight: 48,
                      px: 3,
                      mx: 2,
                      borderRadius: 2,
                      color: theme.palette.text.primary,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: 'inherit',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.95rem',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      ) : null}
    </>
  );

  return (
    <>
      {/* Desktop Drawer */}
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
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: 'white',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
