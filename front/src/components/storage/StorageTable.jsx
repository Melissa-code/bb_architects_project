import {DataGrid} from '@mui/x-data-grid'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

const columns = [
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'type', headerName: 'Type de fichier', width: 130},
    {field: 'name', headerName: 'Nom du fichier', width: 130},
    {field: 'updateDate', headerName: 'Dernière modification', width: 130},
    {field: 'size', headerName: 'Taille', width: 130},
]

const rows = [
    {
        id: 1,
        type: 'folder',
        name: 'DossierTest',
        updateDate: '20/10/1993',
        size: 35,
    },
    {
        id: 2,
        type: 'pdf',
        name: 'FilePDFTest',
        updateDate: '20/10/1993',
        size: 35,
    },
    {
        id: 3,
        type: 'jpg',
        name: 'FileJPGTest',
        updateDate: '20/10/1993',
        size: 35,
    },
    {
        id: 4,
        type: 'json',
        name: 'FileJSONTest',
        updateDate: '20/10/1993',
        size: 35,
    },
]

export default function StorageTable() {
    return (
        <div style={{height: 400, width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 5},
                    },
                }}
                pageSizeOptions={[5, 10]}
            />
        </div>
    )
}
