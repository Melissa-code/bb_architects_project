import Box from "@mui/material/Box";
import {DataGrid} from "@mui/x-data-grid";
import UseAdminFileDataGrid from "./UseAdminFileDataGrid.jsx";
import ModalAdminFileDataGrid from "../modals/ModalAdminFileDataGrid.jsx";

//TODO : Afficher les détails du fichier

function AdminFileDataGrid() {
    const {columns, open, handleClose, handleOpen, rowData, setRowData, data, navigate} = UseAdminFileDataGrid()

    return (
        <>
            <Box sx={{height: 400, width: '100%'}}>
                <DataGrid
                    rows={data?.files}
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
                        navigate(`/download/${row.id}`)
                    }}
                />
            </Box>
            <ModalAdminFileDataGrid open={open} handleClose={handleClose} data={rowData}/>
        </>
    )
}

export default AdminFileDataGrid