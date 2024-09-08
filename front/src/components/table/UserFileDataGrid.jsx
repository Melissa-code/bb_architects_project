import Box from '@mui/material/Box'
import {DataGrid} from '@mui/x-data-grid'
import EditFileForm from '../forms/EditFileForm'
import DialogUserFileDelete from "../modals/DialogUserFileDelete.jsx";

function UserFileDataGrid({...props}) {
    const {
        open,
        setOpen,
        columns,
        rowData,
        storagePercentage,
        data,
        openDeleteDialog, handleDelete, handleCloseDialogDelete
    } =
        props

    return (
        <>
            <Box sx={{height: '100%', width: '100%'}}>
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
                        window.open(import.meta.env.VITE_BACKEND_URL + row.filePath, '_blank')
                    }}
                />
            </Box>
            <EditFileForm open={open} setOpen={setOpen} rowData={rowData}/>
            <DialogUserFileDelete open={openDeleteDialog} handleClose={handleCloseDialogDelete}
                                  handleDelete={handleDelete}/>
        </>
    )
}

export default UserFileDataGrid
