import Button from '@mui/material/Button'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import {useState} from 'react'
import CreateFileForm from '../forms/CreateFileForm'

export default function NavigationButtonAdd() {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)

    return (
        <>
            <Button
                variant="contained"
                onClick={handleOpen}
                endIcon={<AddCircleOutlineIcon />}>
                Ajouter un fichier
            </Button>
            <CreateFileForm open={open} setOpen={setOpen} />
        </>
    )
}
