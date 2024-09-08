import AdminUserDataGrid from "../components/table/AdminUserDataGrid.jsx";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

function PageAdminClients() {
    return <Box sx={{p: 4, display: 'flex', flexDirection: 'column', height: '100vh'}}>
        <Box sx={{mb: 2}}>
            <Typography variant="h4" gutterBottom>
                Liste des Clients
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Vue d'ensemble des clients et de leur stockage
            </Typography>
        </Box>
        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            <Box sx={{flex: 1, width: '100%', bgcolor: 'background.paper'}}>
                <AdminUserDataGrid/>
            </Box>
        </Box>
    </Box>
}

export default PageAdminClients