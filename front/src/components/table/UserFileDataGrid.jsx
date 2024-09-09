import Box from '@mui/material/Box'
import {DataGrid} from '@mui/x-data-grid'
import EditFileForm from '../forms/EditFileForm'
import DialogUserFileDelete from "../modals/DialogUserFileDelete.jsx";
import {Stack} from "@mui/material";

function UserFileDataGrid({...props}) {
    const {
        open,
        setOpen,
        columns,
        rowData,
        data,
        openDeleteDialog, handleDelete, handleCloseDialogDelete, isPending
    } =
        props

    return (
        <>
            <Box sx={{height: 400, width: '100%', mt: 2}}>
                <DataGrid
                    loading={isPending}
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
                        window.open(import.meta.env.VITE_BACKEND_URL + `/${row.filePath}`, '_blank')
                    }}
                    slots={{
                        noResultsOverlay: () =>
                            (<Stack height="100%" alignItems="center" justifyContent="center">
                                Aucun résultat.
                            </Stack>),
                        noRowsOverlay: () =>
                            (<Stack height="100%" alignItems="center" justifyContent="center">
                                Aucun utilisateur.
                            </Stack>)
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
