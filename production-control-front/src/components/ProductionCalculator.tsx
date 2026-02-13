import { useEffect, useState } from 'react';
import { api, type ProductionSuggestionDTO } from '../services/api';
import { 
    Container, Typography, Table, TableBody, TableCell, 
    TableHead, TableRow, Paper, Button, Box, Alert, Card, CardContent, Grid,
    Divider, List, ListItem, ListItemText, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, LinearProgress
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

interface Props {
    isAdmin: boolean;
}

interface ProductionPlanResponse {
    suggestions: ProductionSuggestionDTO[];
    materialUsage: any[];
    totalRevenue: number;
}

export default function ProductionCalculator({ isAdmin }: Props) {
    const [suggestions, setSuggestions] = useState<ProductionSuggestionDTO[]>([]);
    const [totalValue, setTotalValue] = useState(0);

    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationResult, setSimulationResult] = useState<any>(null);

    const calculate = async () => {
        try {
            const response = await api.get<ProductionPlanResponse>('/products/suggestion');
            
            setSuggestions(response.data.suggestions);
            setTotalValue(response.data.totalRevenue);
            
        } catch (error) {
            console.error("Error calculating production", error);
        }
    };

    useEffect(() => { calculate(); }, []);

    const handleSimulateProduction = () => {
        if (suggestions.length === 0) return;
        setIsSimulating(true);
        setTimeout(() => {
            setIsSimulating(false);
            setSimulationResult({
                totalItems: suggestions.reduce((acc, item) => acc + item.quantity, 0),
                totalProfit: totalValue,
                products: suggestions
            });
        }, 1500);
    };

    return (
        <Box sx={{ maxWidth: '100%' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" color="primary" gutterBottom>
                    Production Planning
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    AI-driven optimization to maximize revenue based on current stock.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                
                {/* Tabela Detalhada */}
                <Grid item xs={12} md={8}>
                    {suggestions.length === 0 ? (
                        <Alert severity="warning" sx={{ fontSize: '1.1rem' }}>
                            No production possible. Please check your raw material stock and product recipes.
                        </Alert>
                    ) : (
                        <Paper elevation={2} sx={{ overflow: 'hidden', borderRadius: 2 }}>
                            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                                <Typography variant="h6">Detailed Production List</Typography>
                            </Box>
                            <Table>
                                <TableHead sx={{ bgcolor: '#fff' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Est. Revenue</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {suggestions.map((item, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell>{item.productName}</TableCell>
                                            <TableCell align="center">
                                                <Chip label={`${item.quantity} units`} color="primary" variant="outlined" size="small" />
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: '500', color: 'success.main' }}>
                                                $ {item.totalValue.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    )}
                </Grid>

                {/* Dashboard Direito */}
                <Grid item xs={12} md={4}>
                    <Card elevation={4} sx={{ position: 'sticky', top: 20, borderRadius: 2, borderTop: '6px solid #1565c0' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUpIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                                <Typography variant="h5" fontWeight="bold" color="primary">
                                    Business Intelligence
                                </Typography>
                            </Box>
                            
                            <Divider sx={{ mb: 3 }} />

                            <Box sx={{ textAlign: 'center', mb: 4, py: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" letterSpacing={1}>
                                    Total Potential Revenue
                                </Typography>
                                <Typography variant="h3" fontWeight="bold" color="#1565c0">
                                    $ {totalValue.toFixed(2)}
                                </Typography>
                            </Box>

                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Strategy Summary:
                            </Typography>
                            <List dense disablePadding sx={{ mb: 3 }}>
                                {suggestions.map((item, idx) => (
                                    <ListItem key={idx} divider>
                                        <ListItemText primary={item.productName} />
                                        <Typography variant="body2" fontWeight="bold">
                                            {((item.totalValue / totalValue) * 100).toFixed(0)}% of revenue
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>

                            <Button 
                                variant="outlined" 
                                fullWidth 
                                startIcon={<CalculateIcon />}
                                onClick={calculate}
                                sx={{ mb: 2 }}
                            >
                                Refresh Calculation
                            </Button>

                            {isAdmin && (
                                <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    fullWidth 
                                    size="large"
                                    startIcon={<PlayCircleOutlineIcon />}
                                    onClick={handleSimulateProduction}
                                    disabled={suggestions.length === 0 || isSimulating}
                                    sx={{ py: 1.5, boxShadow: 3 }}
                                >
                                    {isSimulating ? "Simulating..." : "Simulate Production"}
                                </Button>
                            )}
                            
                            {isSimulating && <LinearProgress sx={{ mt: 2 }} color="secondary" />}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* DIALOG: Resultado da Simulação */}
            <Dialog open={!!simulationResult} onClose={() => setSimulationResult(null)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: '#e8f5e9', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" />
                    Simulation Complete
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        This is a simulation. No changes were made to the database stock.
                    </Alert>
                    
                    <Typography variant="h6" gutterBottom>Production Report:</Typography>
                    
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Products to Manufacture:</Typography>
                            <Typography fontWeight="bold">{simulationResult?.products.length} types</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Total Units:</Typography>
                            <Typography fontWeight="bold">{simulationResult?.totalItems} units</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6" color="success.main">Net Profit Generated:</Typography>
                            <Typography variant="h6" fontWeight="bold" color="success.main">
                                $ {simulationResult?.totalProfit.toFixed(2)}
                            </Typography>
                        </Box>
                    </Paper>

                    <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                        * In a real execution, raw materials would be deducted from inventory automatically.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSimulationResult(null)} variant="contained">Close Report</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}