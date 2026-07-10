import { useState } from 'react'
import {
  AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemIcon,
  ListItemText, Toolbar, Typography, useMediaQuery, useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import StorefrontIcon from '@mui/icons-material/Storefront'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import PeopleIcon from '@mui/icons-material/People'
import ReceiptIcon from '@mui/icons-material/Receipt'
import PaymentIcon from '@mui/icons-material/Payment'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Restaurants', path: '/restaurants', icon: <StorefrontIcon /> },
  { label: 'Menu Items', path: '/menu-items', icon: <RestaurantMenuIcon /> },
  { label: 'Customers', path: '/customers', icon: <PeopleIcon /> },
  { label: 'Orders', path: '/orders', icon: <ReceiptIcon /> },
  { label: 'Payments', path: '/payments', icon: <PaymentIcon /> },
]

const drawerWidth = 220

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavClick = (path) => {
    navigate(path)
    if (isMobile) setMobileOpen(false)
  }

  const drawerContent = (
    <Box sx={{ bgcolor: '#1e2a3a', height: '100%', color: '#fff' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
          FoodAdmin
        </Typography>
      </Toolbar>
      <List sx={{ px: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <ListItemButton
              key={item.path}
              selected={active}
              onClick={() => handleNavClick(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                '&.Mui-selected': {
                  bgcolor: '#3b5bdb',
                  '&:hover': { bgcolor: '#3b5bdb' },
                },
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} slotProps={{ primary: { fontSize: 14 } }} />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, bgcolor: '#2178ce' }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>FoodAdmin</Typography>
          </Toolbar>
        </AppBar>
      )}

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none' } }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none' },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 1.25 : 3,
          bgcolor: '#f4f6f9',
          minHeight: '100vh',
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Toolbar sx={{ display: isMobile ? 'block' : 'none', minHeight: '56px !important' }} />
        <Outlet />
      </Box>
    </Box>
  )
}