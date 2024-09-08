import AdminFileDataGrid from "../components/table/AdminFileDataGrid.jsx";
import ModalAdminFileDataGrid from "../components/modals/ModalAdminFileDataGrid.jsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function PageAdminUserStorage() {
    return <Box sx={{p: 4, bgcolor: 'background.paper', boxShadow: 3}}>
        <Typography variant="h4" gutterBottom>
            Données des fichiers
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
            Vue d'ensemble des fichiers disponibles et leur gestion
        </Typography>
        <Box sx={{height: 400, width: '100%', mt: 2}}>
            <AdminFileDataGrid/>
        </Box>
    </Box>
}

export default PageAdminUserStorage;