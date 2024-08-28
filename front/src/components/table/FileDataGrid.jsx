import Box from '@mui/material/Box'
import {DataGrid} from '@mui/x-data-grid'
import {columns} from './columns'
import {useQuery} from '@tanstack/react-query'
import {fetchGetFiles} from '../../utils/fetch'

function FileDataGrid() {
    const token = localStorage.getItem('BBStorage_token')

    const {data, error, isError} = useQuery({
        queryKey: ['GetFiles'],
        queryFn: fetchGetFiles(token),
        enabled: !!token,
        //select,
    })

    return (
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
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    )
}

export default FileDataGrid
