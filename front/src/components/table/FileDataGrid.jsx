import Box from '@mui/material/Box'
import {DataGrid} from '@mui/x-data-grid'
import {fetchGetFiles} from '../../utils/fetch'
import {fakeFetchFiles} from '../../utils/fake-fetch/fake-fetch'
import data from '../../utils/fake-fetch/files.json'
//import {columns} from './columns'
import {LinearProgress} from '@mui/material'
import {useQuery, useMutation} from '@tanstack/react-query'
import {useState} from 'react'
import useFileDataGrid from './useFileDataGrid'
import EditFileForm from '../forms/EditFileForm'

function FileDataGrid() {
    const {open, setOpen, columns, rowData} = useFileDataGrid()
    /*

    const token = localStorage.getItem('BBStorage_token')

    const testGetFiles = useQuery({
        queryKey: ['GetFiles'],
        queryFn: fetchGetFiles(token),
        enabled: !!token,
    })

    
    const {mutate} = useMutation({
        mutationKey: ['updateTitle'],
        mutationFn: (variables) => fetchUpdateFile(variables),
        onSuccess: () => {
            // Alert "Document mis à jour"
        },
        onError: (error) => {
            // Alter "Erreur lors de la mise à jour"
        },
    })

    if (testGetFiles.isSuccess) {
        console.log(testGetFiles.data)
    } else {
        if (testGetFiles.isError) {
            console.log('Erreur avec la récupération des données.')
        }
    }
*/
    // TODO : Mettre en place composant pour récupérer les informations de stockage
    const {total_weight_files, total_storage_capacity} = data
    const storagePercentage =
        (total_weight_files * 100) / total_storage_capacity
    //const storagePercentageTest = 50
    console.log('Stockage occupé ', parseInt(storagePercentage))

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
        </>
    )
}

export default FileDataGrid
