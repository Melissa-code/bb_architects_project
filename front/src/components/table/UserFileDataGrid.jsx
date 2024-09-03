import Box from '@mui/material/Box'
import {DataGrid} from '@mui/x-data-grid'
import data from '../../utils/fake-fetch/files.json'
import {LinearProgress} from '@mui/material'
import EditFileForm from '../forms/EditFileForm'
import useUserFileDataGrid from './useUserFileDataGrid.jsx'

function UserFileDataGrid() {
    const {open, setOpen, columns, rowData, storagePercentage} =
        useUserFileDataGrid()

    return (
        <>
            <Box sx={{height: 400, width: '100%'}}>
                <p>{parseInt(storagePercentage)}% du stockage utilisé</p>
                <LinearProgress
                    color="primary"
                    value={storagePercentage}
                    variant="determinate"
                />
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
                        // * Ouverture du fichier au clic sur la ligne
                        console.log(row)
                        // window.open(
                        //     import.meta.env.VITE_BACKEND_URL + row.filePath,
                        //     '_blank'
                        // )
                    }}
                />
            </Box>
            <EditFileForm open={open} setOpen={setOpen} data={rowData} />
        </>
    )
}

export default UserFileDataGrid
