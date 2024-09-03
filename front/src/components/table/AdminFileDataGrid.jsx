import Box from "@mui/material/Box";
import {DataGrid} from "@mui/x-data-grid";
import data from "../../utils/fake-fetch/files.json";
import UseAdminFileDataGrid from "./UseAdminFileDataGrid.jsx";
import {useParams} from "react-router-dom"
import ModalAdminFileDataGrid from "../modals/ModalAdminFileDataGrid.jsx";
//TODO : Afficher les détails du fichier

function AdminFileDataGrid(){
    const {columns, open, handleClose, handleOpen, rowData, setRowData} = UseAdminFileDataGrid()
    const {id}= useParams()
    return (
        <>
            Administration - Stockage de {id}
            <Box sx={{height: 400, width: '100%'}}>
                <DataGrid
                    rows={data.files}
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
                        setRowData(row)
                        handleOpen()
                    }}
                />
            </Box>
            <ModalAdminFileDataGrid open={open} handleClose={handleClose} data={rowData} />
        </>
    )
}

export default AdminFileDataGrid