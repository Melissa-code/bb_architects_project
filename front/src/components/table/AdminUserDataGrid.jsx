import {DataGrid} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchGetUsers} from "../../utils/fetch.js";
import {Stack} from "@mui/material";


function AdminUserDataGrid() {
    const navigate = useNavigate();
    const token = localStorage.getItem("BBStorage_token");
    const {data, isPending} = useQuery({
        queryKey: ['GetUsers'],
        queryFn: () => fetchGetUsers(token)
    })
    const columns = [
        {field: 'id', headerName: 'ID', width: 90},
        {
            field: 'firstname',
            headerName: 'Prénom',
            headerAlign: 'center',
            width: 150,
            editable: true,
        },
        {
            field: 'lastname',
            headerName: 'Nom',
            headerAlign: 'center',
            width: 150,
            align: 'center',
        },
        {
            field: 'storageSpaceOfUser',
            headerName: 'Stockage utilisé',
            headerAlign: 'center',
            width: 200,
            valueGetter: (params) => {
                const {totalWeightInGo, totalStorageCapacity} = params
                const storagePercentage = parseInt((totalWeightInGo * 100) / totalStorageCapacity)
                return `${parseInt(totalWeightInGo)} / ${totalStorageCapacity}Go (${storagePercentage}%) `
            },
            align: 'center',
        },
    ]
    return <DataGrid
        rows={data?.clients || []}
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
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        onRowClick={({row}) => {
            navigate(`/admin/storage/${row.id}`);
        }}
        loading={isPending}
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
        slots={{
            noResultsOverlay: () =>
                (<Stack height="100%" alignItems="center" justifyContent="center">
                    Aucun résultat.
                </Stack>),
            noRowsOverlay: () =>
                (<Stack height="100%" alignItems="center" justifyContent="center">
                    Aucun client.
                </Stack>)
        }}
    />
}

export default AdminUserDataGrid