import {GridActionsCellItem} from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Chip from '@mui/material/Chip'

function handleDeleteClick(id) {
    //TODO : Récupérer le
    console.log(`Suppression de l'élément ${id}`)
}

function handleEditClick(row) {
    //TODO : Mettre en place un formulaire d'édition
    console.log(row)
}

export const columns = [
    {field: 'id', headerName: 'ID', width: 90},
    {
        field: 'fileName',
        headerName: 'Nom',
        headerAlign: 'center',
        width: 150,
        editable: true,
    },
    {
        field: 'fileFormat',
        headerName: 'Type',
        headerAlign: 'center',
        width: 150,
        renderCell: (params) => {
            return <Chip label={params.value} color="primary" />
        },
        align: 'center',
    },
    {
        field: 'fileWeight',
        headerName: 'Poids',
        headerAlign: 'center',
        type: 'number',
        width: 110,
        valueFormatter: (value) => {
            return `${value.toLocaleString()} Ko`
        },
        align: 'center',
    },
    {
        field: 'category',
        headerName: 'Catégorie',
        headerAlign: 'center',
        width: 160,
        valueGetter: (value) => {
            return value.name
        },
        renderCell: (params) => {
            return <Chip label={params.value} variant="outlined" />
        },
        align: 'center',
    },
    {
        field: 'fileCreatedAt',
        headerName: 'Date de création',
        headerAlign: 'center',
        width: 160,
    },
    {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        headerAlign: 'center',
        width: 100,
        cellClassName: 'actions',
        getActions: ({id, row}) => {
            return [
                <GridActionsCellItem
                    key={id}
                    icon={<EditIcon />}
                    label="Edit"
                    className="textPrimary"
                    onClick={() => handleEditClick(row)}
                    color="inherit"
                />,
                <GridActionsCellItem
                    key={id}
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => handleDeleteClick(id)}
                    color="inherit"
                />,
            ]
        },
    },
]
