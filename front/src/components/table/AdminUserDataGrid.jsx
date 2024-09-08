import {DataGrid} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchGetUsers} from "../../utils/fetch.js";


function AdminUserDataGrid() {
    const navigate = useNavigate();
    const token = localStorage.getItem("BBStorage_token");
    const {data, isError, error} = useQuery({
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
            width: 110,
            valueGetter: (params) => {
                const {totalWeightInGo, totalStorageCapacity} = params
                const storagePercentage = parseInt((totalWeightInGo * 100) / totalStorageCapacity)
                return `${parseInt(totalWeightInGo)} / ${totalStorageCapacity}Go (${storagePercentage}%) `
            },
            align: 'center',
        },
    ]
    return <DataGrid
        rows={data?.clients}
        columns={columns}
        initialState={{
            pagination: {
                paginationModel: {
                    pageSize: 10,
                },
            },
            columns: {
                columnVisibilityModel: {
                    id: false
                }
            }
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        onRowClick={({row}) => {
            navigate(`/admin/storage/${row.id}`)
        }}
    />
}

export default AdminUserDataGrid