import { useState, useEffect } from 'react';
import { 
    Box, Typography, Divider, List, ListItem, ListItemText, 
    Button, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Paper
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { api, type ProductionSuggestionDTO } from '../services/api';

interface Props {
    isAdmin: boolean;
}

interface ProductionPlanResponse {
    suggestions: ProductionSuggestionDTO[];
    materialUsage: any[];
    totalRevenue: number;
}

export default function BusinessDashboard({ isAdmin }: Props) {
    const [suggestions, setSuggestions] = useState<ProductionSuggestionDTO[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    
    const [simulating, setSimulating] = useState(false);
    const [simulationResult, setSimulationResult] = useState<any>(null);

    const loadData = async () => {
        try {
            const response = await api.get<ProductionPlanResponse>('/products/suggestion');
            
            setSuggestions(response.data.suggestions);
            setTotalRevenue(response.data.totalRevenue);
            
        } catch (error) {
            console.error("Error loading dashboard data", error);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSimulate = async () => {
        setSimulating(true);
        setTimeout(() => {
            const totalQuantity = suggestions.reduce((acc, s) => acc + s.quantity, 0);
            setSimulationResult({
                totalProfit: totalRevenue,
                totalQuantity: totalQuantity,
                productCount: suggestions.length,
                materialsUpdate: "Materials stocks would be updated in database."
            });
            setSimulating(false);
        }, 1500);
    };

    return (
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                    Live Insights
                </Typography>
            </Box>
            
            {/* KPI Card */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2, mb: 3, textAlign: 'center', border: '1px solid #bbdefb' }}>
                <Typography variant="caption" fontWeight="bold" color="primary.main" letterSpacing={1}>
                    POTENTIAL REVENUE
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary.dark" sx={{ mt: 0.5 }}>
                    $ {totalRevenue.toFixed(2)}
                </Typography>
            </Paper>

            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                Optimization Strategy
            </Typography>
            
            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
                <List dense>
                    {suggestions.map((item, idx) => (
                        <ListItem key={idx} disableGutters divider>
                            <ListItemText 
                                primary={<Typography variant="body2" fontWeight="600">{item.productName}</Typography>}
                                secondary={`Produce: ${item.quantity} units`}
                            />
                            <Chip label={`$ ${item.totalValue}`} color="success" size="small" variant="outlined" />
                        </ListItem>
                    ))}
                    {suggestions.length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
                            No optimal production path found. Check inventory.
                        </Typography>
                    )}
                </List>
            </Box>

            {isAdmin && (
                <Button 
                    variant="contained" 
                    color="secondary" 
                    fullWidth 
                    size="large"
                    disableElevation
                    startIcon={<PlayCircleOutlineIcon />}
                    onClick={handleSimulate}
                    disabled={suggestions.length === 0 || simulating}
                    sx={{ mt: 'auto' }}
                >
                    {simulating ? "Calculating..." : "Run Simulation"}
                </Button>
            )}

            <Dialog open={!!simulationResult} onClose={() => setSimulationResult(null)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: '#e3f2fd' }}>Simulation Report</DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>Result of simulated run:</Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5', mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                             <Typography>Products Types:</Typography>
                             <Typography fontWeight="bold">{simulationResult?.productCount}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                             <Typography>Total Units:</Typography>
                             <Typography fontWeight="bold">{simulationResult?.totalQuantity}</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="h5" color="success.main" align="center" fontWeight="bold" sx={{ mt: 2 }}>
                            Total Profit: $ {simulationResult?.totalProfit.toFixed(2)}
                        </Typography>
                    </Paper>
                    <Typography variant="caption" display="block" align="center" color="text.secondary">
                         * This action does not affect the real database.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSimulationResult(null)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}