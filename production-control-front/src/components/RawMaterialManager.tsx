import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { type RawMaterial } from '../services/api';
import { 
    Container, Typography, TextField, Button, Table, 
    TableBody, TableCell, TableHead, TableRow, Paper, Box 
} from '@mui/material';

export default function RawMaterialManager() {
    const [materials, setMaterials] = useState<RawMaterial[]>([]);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');

    const loadMaterials = async () => {
        try {
            const response = await api.get<RawMaterial[]>('/raw-materials');
            setMaterials(response.data);
        } catch (error) {
            console.error("Error on load", error);
            alert("Error while trying to connect the server!");
        }
    };

    useEffect(() => {
        loadMaterials();
    }, []);

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
            console.error("Error on save", error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Manage Raw Materials (Stock)
            </Typography>

            {/* Form */}
            <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 2 }}>
                <TextField 
                    label="Name of the Material" 
                    variant="outlined" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />
                <TextField 
                    label="Quantity in Stock" 
                    type="number"
                    variant="outlined" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSave}>
                    ADD
                </Button>
            </Paper>

            {/* Table */}
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {materials.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell align="right">{item.stockQuantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}