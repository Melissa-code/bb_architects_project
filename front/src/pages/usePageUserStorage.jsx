import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Chip from '@mui/material/Chip'
import {GridActionsCellItem} from '@mui/x-data-grid'
import {QueryClient, useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useState} from 'react'
import {fetchDeleteFile, fetchGetFiles, fetchGetProfile} from "../utils/fetch.js";
import {chipColor} from "../utils/chipColors.js";


function usePageUserStorage() {
    const [rowData, setRowData] = useState({})
    const [open, setOpen] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openAlertDelete, setOpenAlertDelete] = useState(false)
    const [idDelete, setIdDelete] = useState(0)
    const [openAlertDeleteOk, setOpenAlertDeleteOk] = useState(false)
    const [openAlertDeleteKo, setOpenAlertDeleteKo] = useState(false)

    const token = localStorage.getItem('BBStorage_token')

    const queryClient = useQueryClient()

    const {data, isError, error} = useQuery({
        queryKey: ['GetFiles'],
        queryFn: () => fetchGetFiles(token),
        enabled: !!token,
    })
    const userProfile = useQuery({
        queryKey: ['GetProfile'],
        queryFn: () => fetchGetProfile(token),
        enabled: !!token,
    })

    const profile = userProfile?.data


    isError && (console.error(error?.message))


    const deleteFile = useMutation({
        mutationKey: ['DeleteFile'],
        mutationFn: (variables) => fetchDeleteFile(variables, token),
        onSuccess: async () => {
            setOpenAlertDeleteOk(true)
            setOpenDeleteDialog(false)
            await queryClient.invalidateQueries({queryKey: ["GetFiles"]})
        },
        onError: (error) => {
            // TODO : Alert "Erreur lors de la suppression"
            alert(error.message)
        },
    })

    // TODO : Mettre en place composant pour récupérer les informations de stockage
    let storagePercentage
    if (data) {
        const {total_weight_files, total_storage_capacity} = data
        storagePercentage =
            ((total_weight_files * 100) / total_storage_capacity)
    } else {
        storagePercentage = null
    }


    function handleOpenDialogDelete(id) {
        setIdDelete(id)
        setOpenDeleteDialog(true)
    }

    function handleCloseDialogDelete() {
        setOpenDeleteDialog(false)
    }

    function handleDelete() {
        deleteFile.mutate(idDelete)
    }

    function handleEditClick(row) {
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
                return <Chip label={params.value} sx={{backgroundColor: chipColor[params.value], color: "#FFFFFF"}}/>
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
                return <Chip label={params.value} variant="outlined"/>
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
                        icon={<EditIcon/>}
                        label="Edit"
                        className="textPrimary"
                        onClick={() => handleEditClick(row)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key={id}
                        icon={<DeleteIcon/>}
                        label="Delete"
                        onClick={() => handleOpenDialogDelete(id)}
                        color="inherit"
                    />,
                ]
            },
        },
    ]

    return {
        open,
        setOpen,
        columns,
        rowData,
        storagePercentage,
        data,
        openDeleteDialog,
        handleDelete,
        handleCloseDialogDelete,
        profile,
        openAlertDeleteKo,
        openAlertDeleteOk,
        setOpenAlertDeleteOk,
        setOpenAlertDeleteKo
    }
}

export default usePageUserStorage
