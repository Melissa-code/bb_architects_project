import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import PopupState, {bindTrigger, bindMenu} from 'material-ui-popup-state'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import React, {useState} from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}

export default function NavigationButtonAdd() {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const handleFileInput = (event) => {
        const files = event.target.files
        // Process the uploaded files
    }

    return (
        <>
            <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                    <React.Fragment>
                        <Button
                            variant="contained"
                            {...bindTrigger(popupState)}
                            endIcon={<AddCircleOutlineIcon />}>
                            Ajouter
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                            <MenuItem onClick={handleOpen}>
                                <CreateNewFolderIcon />
                                Dossier
                            </MenuItem>
                            <MenuItem onClick={handleOpen}>
                                <NoteAddIcon />
                                Fichiers
                            </MenuItem>
                        </Menu>
                    </React.Fragment>
                )}
            </PopupState>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2">
                        Text in a modal
                    </Typography>
                    <Typography id="modal-modal-description" sx={{mt: 2}}>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileInput}
                        />
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}
