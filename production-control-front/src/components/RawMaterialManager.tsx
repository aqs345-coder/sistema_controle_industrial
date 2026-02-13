import { useEffect, useState } from 'react';
import { api, type RawMaterial } from '../services/api';
import {
    Typography, TextField, Button, Table,
    TableBody, TableCell, TableHead, TableRow, Paper, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
    isAdmin: boolean;
}

export default function RawMaterialManager({ isAdmin }: Props) {
    const [materials, setMaterials] = useState<RawMaterial[]>([]);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [editMaterial, setEditMaterial] = useState<RawMaterial | null>(null);

    const loadMaterials = async () => {
        try {
            const response = await api.get<RawMaterial[]>('/raw-materials');
            setMaterials(response.data);
        } catch (error) {
            console.error("Error loading materials", error);
        }
    };

    useEffect(() => { loadMaterials(); }, []);

    const handleSave = async () => {
        if (!name || !quantity) return;
        try {
            await api.post('/raw-materials', {
                name: name,
                stockQuantity: parseInt(quantity)
            });
            setName('');
            setQuantity('');
            loadMaterials();
        } catch (error) {
            console.error("Error saving material", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this material?")) return;
        try {
            await api.delete(`/raw-materials/${id}`);
            loadMaterials();
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                alert("Cannot delete: This material is being used in a product recipe.");
            } else {
                console.error("Error deleting", error);
                alert("Error deleting material.");
            }
        }
    };

    const handleUpdate = async () => {
        if (!editMaterial) return;
        try {
            await api.put(`/raw-materials/${editMaterial.id}`, {
                name: editMaterial.name,
                stockQuantity: editMaterial.stockQuantity
            });
            setEditMaterial(null);
            loadMaterials();
        } catch (error) {
            console.error("Error updating material", error);
        }
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>Raw Materials Inventory</Typography>

            <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 2 }}>
                <TextField 
                    label="Material Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    size="small"
                />
                <TextField 
                    label="Stock Qty" 
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    size="small"
                />
                <Button variant="contained" onClick={handleSave}>Add</Button>
            </Paper>

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Stock Quantity</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {materials.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell align="right">{item.stockQuantity}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" onClick={() => setEditMaterial(item)}>
                                        <EditIcon />
                                    </IconButton>
                                    {isAdmin && (
                                        <IconButton color="error" onClick={() => item.id && handleDelete(item.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={!!editMaterial} onClose={() => setEditMaterial(null)}>
                <DialogTitle>Edit Material</DialogTitle>
                <DialogContent>
                    <TextField 
                        label="Name" fullWidth margin="dense" 
                        value={editMaterial?.name || ''} 
                        onChange={e => setEditMaterial({...editMaterial!, name: e.target.value})} 
                    />
                    <TextField 
                        label="Stock Quantity" type="number" fullWidth margin="dense" 
                        value={editMaterial?.stockQuantity || ''} 
                        onChange={e => setEditMaterial({...editMaterial!, stockQuantity: parseInt(e.target.value)})} 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditMaterial(null)}>Cancel</Button>
                    <Button onClick={handleUpdate} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}