import Chip from "@mui/material/Chip";
import {GridActionsCellItem} from "@mui/x-data-grid";
import {Download, Visibility} from "@mui/icons-material";
import {useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {fetchDownloadFile, fetchGetUserFiles} from "../../utils/fetch.js";
import {chipColor} from "../../utils/chipColors.js";

function UseAdminFileDataGrid() {
    const [open, setOpen] = useState(false);
    const [rowData, setRowData] = useState({});
    const {id} = useParams()
    const navigate = useNavigate()
    const token = localStorage.getItem("BBStorage_token")

    const {data, isError, error} = useQuery({
        queryKey: ["GetUser", id],
        queryFn: () => fetchGetUserFiles(id, token)
    })

    const {mutate} = useMutation({
        mutationKey: ["DowloadFile", id],
        mutationFn: () => fetchDownloadFile(id, token),
        onSuccess: () => alert("Successfully downloaded"),
        onError: () => alert("Error encountered")
    })

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function handleDownloadFile(row) {
        mutate()
    }

    function handleShowFile(row) {
        console.log("Vue du document", row)
        // window.open(
        //     import.meta.env.VITE_BACKEND_URL + row.filePath,
        //     '_blank'
        // )
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
                        icon={<Visibility/>}
                        label="Show"
                        className="textPrimary"
                        onClick={() => handleShowFile(row)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key={id}
                        icon={<Download/>}
                        label="Download"
                        className="textPrimary"
                        onClick={() => handleDownloadFile(row)}
                        color="inherit"
                    />
                ]
            },
        },
    ]

    return {columns, open, handleClose, handleOpen, rowData, setRowData, data, navigate}
}

export default UseAdminFileDataGrid