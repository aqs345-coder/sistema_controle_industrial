import { useState } from 'react';
import RawMaterialManager from './components/RawMaterialManager';
import ProductManager from './components/ProductManager';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';

function App() {
  const [currentScreen, setCurrentScreen] = useState('materials');

  return (
    <>
      <CssBaseline />
      
      {/* Superior Menu */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Production Control
          </Typography>
          <Button color="inherit" onClick={() => setCurrentScreen('materials')}>
            Raw-Materials
          </Button>
          <Button color="inherit" onClick={() => setCurrentScreen('products')}>
            Products & Recipes
          </Button>
          <Button color="inherit" onClick={() => alert("Em breve: Cálculo de Produção")}>
            Calculate Production
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container>
        <Box sx={{ mt: 4 }}>
          {currentScreen === 'materials' && <RawMaterialManager />}
          {currentScreen === 'products' && <ProductManager />}
        </Box>
      </Container>
    </>
  );
}

export default App;