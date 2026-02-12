import { useEffect, useState } from 'react';
import { api, type Product, type RawMaterial } from '../services/api';
import {
    Container, Typography, TextField, Button, Table,
    TableBody, TableCell, TableHead, TableRow, Paper,
    Box, MenuItem, Select, FormControl, InputLabel,
    Collapse, IconButton
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function ProductManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [materials, setMaterials] = useState<RawMaterial[]>([]);
    
    const [name, setName] = useState('');
    const [value, setValue] = useState('');

    const [openRowId, setOpenRowId] = useState<number | null>(null);

    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [requiredQty, setRequiredQty] = useState('');

    const loadData = async () => {
        try {
            const [prodResponse, matResponse] = await Promise.all([
                api.get<Product[]>('/products'),
                api.get<RawMaterial[]>('/raw-materials')
            ]);
            setProducts(prodResponse.data);
            setMaterials(matResponse.data);
        } catch (error) {
            console.error("Error on loading data", error);
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
            console.error("Error on save", error);
        }
    };

    const handleAddIngredient = async (productId: number) => {
        if (!selectedMaterial || !requiredQty) return;
        try {
            await api.post(`/products/${productId}/composition`, null, {
                params: {
                    materialId: selectedMaterial,
                    quantity: requiredQty
                }
            });
            alert("Ingredient added!");
            setRequiredQty('');
            setSelectedMaterial('');
        } catch (error) {
            console.error("Error on adding ingredient", error);
            alert("Error while saving.");
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Manage Products & Recipes</Typography>

            {/* Product Form */}
            <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 2 }}>
                <TextField label="Product Name" value={name} onChange={e => setName(e.target.value)} fullWidth />
                <TextField label="Product Value ($)" type="number" value={value} onChange={e => setValue(e.target.value)} />
                <Button variant="contained" onClick={handleSaveProduct}>Criar</Button>
            </Paper>

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((row) => (
                            <>
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <IconButton size="small" onClick={() => setOpenRowId(openRowId === row.id ? null : row.id)}>
                                            {openRowId === row.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell align="right">R$ {row.value}</TableCell>
                                </TableRow>
                                
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={openRowId === row.id} timeout="auto" unmountOnExit>
                                            <Box sx={{ margin: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                                <Typography variant="h6" gutterBottom component="div">
                                                    Add Ingredients (Recipe)
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel>Raw-Material</InputLabel>
                                                        <Select
                                                            value={selectedMaterial}
                                                            label="Matéria-Prima"
                                                            onChange={(e) => setSelectedMaterial(e.target.value)}
                                                        >
                                                            {materials.map((m) => (
                                                                <MenuItem key={m.id} value={m.id}>{m.name} (Stock: {m.stockQuantity})</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                    <TextField 
                                                        label="Qtd Needed" 
                                                        type="number" 
                                                        size="small" 
                                                        value={requiredQty}
                                                        onChange={(e) => setRequiredQty(e.target.value)}
                                                    />
                                                    <Button variant="outlined" onClick={() => row.id && handleAddIngredient(row.id)}>
                                                        Save
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}