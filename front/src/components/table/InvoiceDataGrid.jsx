import {useMutation, useQuery} from "@tanstack/react-query";
import {fetchDownloadInvoice, fetchGetInvoice} from "../../utils/fetch.js";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {Download} from "@mui/icons-material";
import {Stack} from "@mui/material";

function InvoiceDataGrid() {
    const token = localStorage.getItem('BBStorage_token')
    const {data, isPending} = useQuery(
        {
            queryKey: ["GetInvoices"],
            queryFn: () => fetchGetInvoice(token),
            enabled: !!token
        }
    )

    const {mutate} = useMutation({
        mutationKey: ["DownloadInvoice"],
        mutationFn: ({invoice_id}) => fetchDownloadInvoice(invoice_id, token),
        onSuccess: (data) => handleDownloadInvoice(data),
        onError: (error) => alert(error)
    })

    function handleDownloadInvoice(data) {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(data)
        link.setAttribute('download', `invoice.txt`)
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                        onClick={() => mutate(row)}
                        color="inherit"
                    />
                ]
            },
        },
    ]
    return <DataGrid
        getRowId={(row) => row?.invoice_id}
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
                    invoice_id: false,
                },
            },
        }}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        loading={isPending}
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
        slots={{
            noResultsOverlay: () =>
                (<Stack height="100%" alignItems="center" justifyContent="center">
                    Aucun résultat.
                </Stack>),
            noRowsOverlay: () =>
                (<Stack height="100%" alignItems="center" justifyContent="center">
                    Aucune facture.
                </Stack>)
        }}
    />
}

export default InvoiceDataGrid