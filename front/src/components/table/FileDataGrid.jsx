import Box from '@mui/material/Box'
import {DataGrid} from '@mui/x-data-grid'
import data from '../../utils/fake-fetch/files.json'
//import {columns} from './columns'
import {LinearProgress} from '@mui/material'
import EditFileForm from '../forms/EditFileForm'
import useFileDataGrid from './useFileDataGrid'

function FileDataGrid() {
    const {open, setOpen, columns, rowData, storagePercentage, testGetFiles} =
        useFileDataGrid()

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
                    rows={data?.files}
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
            Pour Mélissa :{' '}
            {testGetFiles.isSuccess
                ? 'Récupération des données réussie !'
                : 'Erreur avec la récupération des données'}
        </>
    )
}

export default FileDataGrid
