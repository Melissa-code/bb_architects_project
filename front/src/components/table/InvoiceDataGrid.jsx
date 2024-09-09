import {useQuery} from "@tanstack/react-query";
import {fetchGetInvoice} from "../../utils/fetch.js";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {Download} from "@mui/icons-material";

function InvoiceDataGrid() {
    const token = localStorage.getItem('BBStorage_token')
    const {data, isError, error} = useQuery(
        {
            queryKey: ["GetInvoices"],
            queryFn: () => fetchGetInvoice(token),
            enabled: !!token
        }
    )

    function handleDownloadFile(row) {
        console.log(row)
    }

    const columns = [
        {field: 'invoice_id', headerName: 'ID', width: 90},
        {
            field: 'objet',
            headerName: 'Nom',
            headerAlign: 'center',
            width: 300,
        },
        {
            field: 'date',
            headerName: 'Date',
            headerAlign: 'center',
            type: 'text',
            width: 150,
            align: 'center',
        },
        {
            field: 'quantity',
            headerName: 'Quantité',
            headerAlign: 'center',
            type: 'number',
            width: 110,
            align: 'center',
        },
        {
            field: 'total_price_TTC',
            headerName: 'Prix total TTC',
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
    return <DataGrid
        rows={data?.invoices}
        columns={columns}
        initialState={{
            pagination: {
                paginationModel: {
                    pageSize: 10,
                },
            },
            columns: {
                columnVisibilityModel: {
                    id: false, // Masquer la colonne ID
                },
            },
        }}
        pageSizeOptions={[5, 10, 25]} // Options supplémentaires pour la pagination
        disableRowSelectionOnClick
        onRowClick={({row}) => {
            console.log("Téléchargement", row)
            //Mettre en place le téléchargement du fichier.
        }}
        sx={{
            '& .MuiDataGrid-root': {
                border: 'none', // Supprimer la bordure par défaut
            },
            '& .MuiDataGrid-cell': {
                color: 'text.secondary', // Couleur du texte
                fontSize: 14, // Taille du texte des cellules
            },
            '& .MuiDataGrid-columnHeaders': {
                bgcolor: 'primary.light', // Couleur de fond des en-têtes
                color: 'primary.contrastText', // Texte blanc dans les en-têtes
                fontSize: 16,
                fontWeight: 'bold',
            },
            '& .MuiDataGrid-footerContainer': {
                bgcolor: 'background.default', // Fond de la pagination
            },
        }}
    />
}

export default InvoiceDataGrid