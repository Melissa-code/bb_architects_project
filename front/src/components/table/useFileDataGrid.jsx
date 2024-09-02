import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Chip from '@mui/material/Chip'
import {GridActionsCellItem} from '@mui/x-data-grid'
import {useQuery} from '@tanstack/react-query'
import {useState} from 'react'
import {fetchGetFiles} from '../../utils/fetch'

function useFileDataGrid() {
    const [rowData, setRowData] = useState({})
    const [open, setOpen] = useState(false)

    const token = localStorage.getItem('BBStorage_token')

    const testGetFiles = useQuery({
        queryKey: ['GetFiles'],
        queryFn: fetchGetFiles(token),
        enabled: !!token,
    })

    // const {mutate} = useMutation({
    //     mutationKey: ['updateTitle'],
    //     mutationFn: (variables) => fetchUpdateFile(variables),
    //     onSuccess: () => {
    //         // TODO : Alert "Document mis à jour"
    //     },
    //     onError: (error) => {
    //         // TODO : Alert "Erreur lors de la mise à jour"
    //     },
    // })

    // TODO : Mettre en place composant pour récupérer les informations de stockage
    // const {total_weight_files, total_storage_capacity} = data
    // const storagePercentage =
    //     (total_weight_files * 100) / total_storage_capacity
    const storagePercentage = 50

    function handleDeleteClick(id) {
        //TODO : Mettre une modal de confirmation
        console.log(`Suppression de l'élément ${id}`)
    }

    function handleEditClick(row) {
        //TODO : Mettre en place un formulaire d'édition
        setRowData(row)
        setOpen(true)
    }

    const columns = [
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

    return {open, setOpen, columns, rowData, storagePercentage, testGetFiles}
}

export default useFileDataGrid
