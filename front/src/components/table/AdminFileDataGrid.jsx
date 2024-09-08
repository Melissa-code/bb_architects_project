import Box from "@mui/material/Box";
import {DataGrid} from "@mui/x-data-grid";
import UseAdminFileDataGrid from "./UseAdminFileDataGrid.jsx";
import ModalAdminFileDataGrid from "../modals/ModalAdminFileDataGrid.jsx";
import Typography from "@mui/material/Typography";

function AdminFileDataGrid() {
    const {columns, open, handleClose, handleOpen, rowData, setRowData, data, navigate} = UseAdminFileDataGrid()

    return (
        <Box sx={{p: 4, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', height: '100vh'}}>
            <Box sx={{mb: 2}}>
                <Typography variant="h4" gutterBottom>
                    Données des fichiers
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Vue d'ensemble des fichiers disponibles et leur gestion
                </Typography>
            </Box>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <Box sx={{flex: 1, width: '100%'}}>
                    <DataGrid
                        rows={data?.files || []}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                            columns: {
                                columnVisibilityModel: {
                                    id: false, // Masquer la colonne ID
                                },
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]} // Options supplémentaires pour la pagination
                        disableRowSelectionOnClick
                        onRowClick={({row}) => {
                            navigate(`/download/${row.id}`);
                        }}
                        sx={{
                            '& .MuiDataGrid-root': {
                                border: 'none', // Supprimer la bordure par défaut
                            },
                            '& .MuiDataGrid-cell': {
                                color: 'text.secondary', // Couleur du texte
                                fontSize: 14, // Taille du texte des cellules
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                bgcolor: 'primary.light', // Couleur de fond des en-têtes
                                color: 'primary.contrastText', // Texte blanc dans les en-têtes
                                fontSize: 16,
                                fontWeight: 'bold',
                            },
                            '& .MuiDataGrid-footerContainer': {
                                bgcolor: 'background.default', // Fond de la pagination
                            },
                        }}
                    />
                </Box>
            </Box>
            <ModalAdminFileDataGrid open={open} handleClose={handleClose} data={rowData}/>

        </Box>
    );

}

export default AdminFileDataGrid