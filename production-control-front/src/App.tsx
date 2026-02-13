import { useState } from 'react';
import { 
  ThemeProvider, createTheme, CssBaseline, Box, AppBar, Toolbar, 
  Typography, Drawer, List, ListItemButton, ListItemIcon, 
  ListItemText, Divider, Switch, FormControlLabel, Avatar 
} from '@mui/material';

import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import InsightsIcon from '@mui/icons-material/Insights';
import FactoryIcon from '@mui/icons-material/Factory';
import SecurityIcon from '@mui/icons-material/Security';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import RawMaterialManager from './components/RawMaterialManager';
import ProductManager from './components/ProductManager';
import ProductionCalculator from './components/ProductionCalculator';
import BusinessDashboard from './components/BusinessDashboard';

const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
    secondary: { main: '#ef6c00' },
    background: { default: '#f0f2f5' },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  }
});

const drawerWidth = 260;
const rightDashboardWidth = 320;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('materials');
  const [isAdmin, setIsAdmin] = useState(false);

  const showRightPanel = currentScreen !== 'calculator';

  const getButtonStyle = (screenName: string) => {
    const isSelected = currentScreen === screenName;
    return {
      borderRadius: 2,
      mb: 1,
      border: isSelected ? '1px solid #1565c0' : '1px solid transparent',
      bgcolor: isSelected ? 'rgba(21, 101, 192, 0.08)' : 'transparent',
      color: isSelected ? 'primary.main' : 'inherit',
      '& .MuiListItemIcon-root': {
        color: isSelected ? 'primary.main' : 'inherit'
      },
      '&:hover': {
        bgcolor: isSelected ? 'rgba(21, 101, 192, 0.15)' : 'rgba(0, 0, 0, 0.04)',
      }
    };
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        
        {/* Header */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, boxShadow: 2 }}>
          <Toolbar>
            <FactoryIcon sx={{ mr: 2 }} />
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, letterSpacing: 1, fontWeight: 600 }}>
              INDUSTRIAL PRODUCTION CONTROL
            </Typography>
            {isAdmin && (
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.15)', px: 2, py: 0.5, borderRadius: 1, border: '1px solid rgba(255,255,255,0.3)' }}>
                <AdminPanelSettingsIcon sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight="bold">ADMIN ACCESS</Typography>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        {/* Sidebar Esquerda */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', borderRight: '1px solid #e0e0e0' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
              <Avatar sx={{ bgcolor: isAdmin ? 'secondary.main' : 'grey.400', width: 64, height: 64, mb: 1.5, boxShadow: 1 }}>
                {isAdmin ? <AdminPanelSettingsIcon fontSize="large" /> : <SecurityIcon fontSize="large" />}
              </Avatar>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                {isAdmin ? "Manager Profile" : "Viewer Profile"}
              </Typography>
              <FormControlLabel
                control={<Switch checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} color="secondary" size="small" />}
                label={<Typography variant="caption" color="text.secondary">ALLOW EDIT/DELETE</Typography>}
                sx={{ mt: 1 }}
              />
            </Box>

            <List sx={{ px: 2, pt: 2 }}>
              <ListItemButton 
                onClick={() => setCurrentScreen('materials')}
                sx={getButtonStyle('materials')}
              >
                <ListItemIcon><InventoryIcon /></ListItemIcon>
                <ListItemText primary="Stock Inventory" secondary="Raw Materials" />
              </ListItemButton>

              <ListItemButton 
                onClick={() => setCurrentScreen('products')}
                sx={getButtonStyle('products')}
              >
                <ListItemIcon><CategoryIcon /></ListItemIcon>
                <ListItemText primary="Product Engineering" secondary="Recipes & Costs" />
              </ListItemButton>

              <Divider sx={{ my: 2 }} />

              <ListItemButton 
                onClick={() => setCurrentScreen('calculator')}
                sx={getButtonStyle('calculator')}
              >
                <ListItemIcon><InsightsIcon /></ListItemIcon>
                <ListItemText primary="Production Plan" secondary="AI Optimization" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>

        {/* Área Principal de Layout */}
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          <Toolbar /> 
          
          <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
            
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, width: '100%' }}>
               <Box sx={{ width: '100%', maxWidth: '100%' }}>
                 {currentScreen === 'materials' && <RawMaterialManager isAdmin={isAdmin} />}
                 {currentScreen === 'products' && <ProductManager isAdmin={isAdmin} />}
                 {currentScreen === 'calculator' && <ProductionCalculator isAdmin={isAdmin} />}
               </Box>
            </Box>

            {/* DASHBOARD DIREITO: Renderização Condicional Estrita */}
            {showRightPanel && (
              <Box 
                sx={{ 
                  width: rightDashboardWidth, 
                  flexShrink: 0, 
                  borderLeft: '1px solid #e0e0e0', 
                  bgcolor: '#fff',
                  overflow: 'auto',
                  height: '100%',
                  display: { xs: 'none', md: 'block' }
                }}
              >
                <BusinessDashboard isAdmin={isAdmin} />
              </Box>
            )}

          </Box>
        </Box>

      </Box>
    </ThemeProvider>
  );
}