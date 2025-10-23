import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  InputBase,
  useTheme,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  ContentCopy as CopyIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const DRAWER_WIDTH = 240;

interface TopNavbarProps {
  onMenuClick?: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // Extract username from wallet address (first 6 chars)
  const username = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'User';

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      handleClose();
    }
  };

  const handleDisconnect = () => {
    disconnect();
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: {
          xs: '100%',
          sm: `calc(100% - ${DRAWER_WIDTH}px)`,
        },
        ml: {
          xs: 0,
          sm: `${DRAWER_WIDTH}px`,
        },
        backgroundColor: 'white',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' }, color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isConnected ? (
            <Typography
              variant="h5"
              component="div"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 400,
              }}
            >
              Welcome Back,{' '}
              <Box component="span" sx={{ fontWeight: 700 }}>
                {username}
              </Box>
            </Typography>
          ) : (
            <Typography
              variant="h5"
              component="div"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 600,
              }}
            >
              Lunaro
            </Typography>
          )}
        </motion.div>

        {/* Right Side - Search, Notifications, Avatar or Connect */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isConnected && (
            <>
              {/* Search Bar */}
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                }}
              >
                <SearchIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                <InputBase placeholder="Search" sx={{ width: 200 }} />
              </Box>

              {/* Notifications */}
              <IconButton>
                <NotificationsIcon />
              </IconButton>

              {/* User Avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Avatar
                  onClick={handleAvatarClick}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: theme.palette.primary.main,
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                >
                  {username.charAt(0).toUpperCase()}
                </Avatar>
              </motion.div>

              {/* Avatar Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Wallet Address
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
                    {username}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleCopyAddress}>
                  <CopyIcon sx={{ mr: 1, fontSize: 20 }} />
                  Copy Address
                </MenuItem>
                <MenuItem onClick={handleDisconnect}>
                  <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                  Disconnect
                </MenuItem>
              </Menu>
            </>
          )}

          {!isConnected && <ConnectButton />}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
