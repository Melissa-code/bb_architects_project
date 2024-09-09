import AdminFileDataGrid from "../components/table/AdminFileDataGrid.jsx";
import Box from "@mui/material/Box";

function PageAdminUserStorage() {
    return <Box sx={{p: 4, bgcolor: 'background.paper', boxShadow: 3}}>
        <Box sx={{height: 400, width: '100%', mt: 2}}>
            <AdminFileDataGrid/>
        </Box>
    </Box>
}

export default PageAdminUserStorage;