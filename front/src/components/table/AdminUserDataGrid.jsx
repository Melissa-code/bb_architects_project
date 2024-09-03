import data from "../../utils/fake-fetch/clients.json";
import {DataGrid} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";


function AdminUserDataGrid() {
const navigate = useNavigate();
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
            width: 110,
            valueGetter: (params) => {
                const {totalWeightInGo,totalStorageCapacity}= params
                const storagePercentage = parseInt((totalWeightInGo*100)/totalStorageCapacity)
                return `${parseInt(totalWeightInGo)} / ${totalStorageCapacity}Go (${storagePercentage}%) `
            },
            align: 'center',
        },
    ]
    return <DataGrid
        rows={data.clients}
        columns={columns}
        initialState={{
            pagination: {
                paginationModel: {
                    pageSize: 10,
                },
            },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        onRowClick={({row}) => {
            // * Routing vers le stockage du client
            console.log(row)
            navigate(`/admin/storage/${row.id}`)
            // window.open(
            //     import.meta.env.VITE_BACKEND_URL + row.filePath,
            //     '_blank'
            // )
        }}
    />
}

export default AdminUserDataGrid