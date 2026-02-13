import { useEffect, useState, Fragment } from 'react';
import { api, type Product, type RawMaterial } from '../services/api';
import {
    Typography, TextField, Button, Table,
    TableBody, TableCell, TableHead, TableRow, Paper,
    Box, MenuItem, Select, FormControl, InputLabel,
    Collapse, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, Chip, Grid, Divider
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ScienceIcon from '@mui/icons-material/Science';
import AddLinkIcon from '@mui/icons-material/AddLink';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface Props {
    isAdmin: boolean;
}

interface ProductWithComposition extends Product {
    composition?: {
        id: number;
        rawMaterial: RawMaterial;
        quantity: number;
    }[];
}

export default function ProductManager({ isAdmin }: Props) {
    const [products, setProducts] = useState<ProductWithComposition[]>([]);
    const [materials, setMaterials] = useState<RawMaterial[]>([]);
    
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    
    const [openRowId, setOpenRowId] = useState<number | null>(null);

    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [requiredQty, setRequiredQty] = useState('');

    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const loadData = async () => {
        try {
            const [prodResponse, matResponse] = await Promise.all([
                api.get<ProductWithComposition[]>('/products'),
                api.get<RawMaterial[]>('/raw-materials') 
            ]);
            setProducts(prodResponse.data);
            setMaterials(matResponse.data);
        } catch (error) {
            console.error("Error loading data", error);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSaveProduct = async () => {
        if (!name || !value) return;
        try {
            await api.post('/products', { name, value: parseFloat(value) });
            setName('');
            setValue('');
            loadData();
        } catch (error) {
            console.error("Error saving product", error);
        }
    };

    const handleAddIngredient = async (productId: number) => {
        if (!selectedMaterial || !requiredQty) return;
        try {
            await api.post(`/products/${productId}/composition`, {}, {
                params: { materialId: selectedMaterial, quantity: requiredQty }
            });
            setRequiredQty('');
            setSelectedMaterial('');
            loadData();
        } catch (error) {
            console.error("Error linking ingredient", error);
            alert("Failed to save recipe.");
        }
    };

    const handleUnlinkIngredient = async (productId: number, materialId: number) => {
        if(!confirm("Remove this material from recipe?")) return;
        try {
            await api.delete(`/products/${productId}/composition/${materialId}`);
            loadData();
        } catch (error) {
            console.error("Error unlinking", error);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm("Delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            loadData();
        } catch (error) {
            console.error("Error deleting", error);
            alert("Error deleting product.");
        }
    };

    const handleUpdateProduct = async () => {
        if (!editProduct) return;
        try {
            await api.put(`/products/${editProduct.id}`, { name: editProduct.name, value: editProduct.value });
            setEditProduct(null);
            loadData();
        } catch (e) { console.error(e); }
    };

    return (
        <Box sx={{ maxWidth: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" color="text.primary">Product Engineering</Typography>
                <Chip label={`${products.length} Products Active`} color="primary" variant="outlined" />
            </Box>

            {/* Cadastro Rápido */}
            <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase' }}>
                    New Product Registration
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField label="Product Name" value={name} onChange={e => setName(e.target.value)} fullWidth size="small" />
                    <TextField label="Sales Value ($)" type="number" value={value} onChange={e => setValue(e.target.value)} size="small" />
                    <Button variant="contained" onClick={handleSaveProduct} sx={{ px: 4 }}>Create</Button>
                </Box>
            </Paper>

            {/* Tabela Principal */}
            <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f9fafb' }}>
                        <TableRow>
                            <TableCell width={50} />
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Sales Value</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ingredients Count</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((row) => (
                            <Fragment key={row.id}>
                                <TableRow sx={{ '& > *': { borderBottom: 'unset' }, bgcolor: openRowId === row.id ? '#f0f7ff' : 'inherit' }}>
                                    <TableCell>
                                        <IconButton size="small" onClick={() => setOpenRowId(openRowId === row.id ? null : row.id)}>
                                            {openRowId === row.id ? <KeyboardArrowUpIcon color="primary" /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>#{row.id}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                                    <TableCell align="right">$ {row.value}</TableCell>
                                    <TableCell align="right">
                                        <Chip 
                                            label={row.composition ? row.composition.length : 0} 
                                            size="small" 
                                            color={row.composition && row.composition.length > 0 ? "default" : "warning"}
                                        />
                                    </TableCell>
                                    
                                    <TableCell align="center">
                                        <IconButton color="primary" size="small" onClick={() => setEditProduct(row)} sx={{ mr: 1 }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        {isAdmin && (
                                            <IconButton color="error" size="small" onClick={() => row.id && handleDeleteProduct(row.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                                
                                {/* Área Expandida (Receita) */}
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={openRowId === row.id} timeout="auto" unmountOnExit>
                                            <Box sx={{ m: 2, p: 3, bgcolor: '#fff', borderRadius: 2, border: '1px dashed #bdbdbd' }}>
                                                
                                                <Grid container spacing={4}>
                                                    {/* Lado Esquerdo: Receita Atual */}
                                                    <Grid item xs={12} md={7}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                            <ScienceIcon color="secondary" sx={{ mr: 1 }} />
                                                            <Typography variant="h6" fontWeight="bold">Current Bill of Materials</Typography>
                                                        </Box>
                                                        
                                                        {row.composition && row.composition.length > 0 ? (
                                                            <Table size="small" sx={{ border: '1px solid #eee' }}>
                                                                <TableHead sx={{ bgcolor: '#fafafa' }}>
                                                                    <TableRow>
                                                                        <TableCell>Raw Material</TableCell>
                                                                        <TableCell align="right">Required Qty</TableCell>
                                                                        <TableCell align="center">Action</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {row.composition.map((comp) => (
                                                                        <TableRow key={comp.id}>
                                                                            <TableCell>{comp.rawMaterial.name}</TableCell>
                                                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{comp.quantity}</TableCell>
                                                                            <TableCell align="center">
                                                                                <IconButton size="small" onClick={() => row.id && comp.rawMaterial.id && handleUnlinkIngredient(row.id, comp.rawMaterial.id)}>
                                                                                    <RemoveCircleOutlineIcon fontSize="small" color="error" />
                                                                                </IconButton>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 2 }}>
                                                                No ingredients linked. This product cannot be produced yet.
                                                            </Typography>
                                                        )}
                                                    </Grid>

                                                    {/* Lado Direito: Adicionar Novo */}
                                                    <Grid item xs={12} md={5}>
                                                        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, height: '100%' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                                <AddLinkIcon color="primary" sx={{ mr: 1 }} />
                                                                <Typography variant="subtitle1" fontWeight="bold">Add Ingredient</Typography>
                                                            </Box>
                                                            
                                                            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                                                <InputLabel>Select Material</InputLabel>
                                                                <Select
                                                                    value={selectedMaterial}
                                                                    label="Select Material"
                                                                    onChange={(e) => setSelectedMaterial(e.target.value)}
                                                                >
                                                                    {materials.map((m) => (
                                                                        <MenuItem key={m.id} value={m.id}>
                                                                            {m.name} <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>(Stock: {m.stockQuantity})</Typography>
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                            
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <TextField 
                                                                    label="Qty Needed" 
                                                                    type="number" 
                                                                    size="small" 
                                                                    fullWidth
                                                                    value={requiredQty}
                                                                    onChange={(e) => setRequiredQty(e.target.value)}
                                                                />
                                                                <Button 
                                                                    variant="contained" 
                                                                    disableElevation
                                                                    onClick={() => row.id && handleAddIngredient(row.id)}
                                                                >
                                                                    Add
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                </Grid>

                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </Fragment>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            {/* Modal de Edição (Nome/Valor) */}
            <Dialog open={!!editProduct} onClose={() => setEditProduct(null)} maxWidth="xs" fullWidth>
                <DialogTitle>Edit Product Details</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField 
                            label="Product Name" fullWidth 
                            value={editProduct?.name || ''} 
                            onChange={e => setEditProduct({...editProduct!, name: e.target.value})} 
                        />
                        <TextField 
                            label="Sales Value" type="number" fullWidth 
                            value={editProduct?.value || ''} 
                            onChange={e => setEditProduct({...editProduct!, value: parseFloat(e.target.value)})} 
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditProduct(null)}>Cancel</Button>
                    <Button onClick={handleUpdateProduct} variant="contained">Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}