export const columns = [
    {field: 'id', headerName: 'ID', width: 90},
    {
        field: 'fileName',
        headerName: 'Nom',
        width: 150,
        editable: true,
    },
    {
        field: 'fileFormat',
        headerName: 'Type',
        width: 150,
    },
    {
        field: 'fileWeight',
        headerName: 'Poids',
        type: 'number',
        width: 110,
    },
    {
        field: 'category.name',
        headerName: 'Catégorie',
        width: 160,
    },
    {
        field: 'fileCreatedAt',
        headerName: 'Date de création',
        width: 160,
    },
]
