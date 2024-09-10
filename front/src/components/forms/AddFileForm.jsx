import {useState} from "react";
import Box from "@mui/material/Box";
import {Button, FormControl, Input, InputLabel, MenuItem, Modal, Select, TextField} from "@mui/material";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchCreateFile, fetchGetCategories} from "../../utils/fetch.js";
import AlertSuccess from "../notification/alerts/AlertSuccess.jsx";
import AlertFail from "../notification/alerts/AlertFail.jsx";
import {style} from "../modals/modalStyle.js";

function AddFileForm({...props}) {
    const {open, setOpen} = props
    const [fileName, setFileName] = useState('')
    const [category, setCategory] = useState('')
    const [file, setFile] = useState(null);
    const [openSuccess, setOpenSuccess] = useState(false)
    const [openFailure, setOpenFailure] = useState(false)
    const [error, setError] = useState("")
    const token = localStorage.getItem("BBStorage_token")
    const queryClient = useQueryClient()

    const {data} = useQuery({
        queryKey: ['GetCategories'],
        queryFn: () => fetchGetCategories(token),
        enabled: !!token,
    })

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    }

    const {mutate} = useMutation({
        mutationKey: ['AddingFile'],
        mutationFn: () => fetchCreateFile(file, category, fileName, token),
        onSuccess: () => {
            setOpenSuccess(true)
            queryClient.invalidateQueries({queryKey: ["GetFiles"]})
        },
        onError: (error) => {
            setError(error)
            setOpenFailure(true)
        },
    })

    return (
        <>
            <Modal
                open={open}
                onClose={() => {
                    setOpen(false)
                    setFile(null)
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        mutate()
                    }}
                    sx={style}
                >
                    <TextField
                        label="Nom du fichier"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin={"normal"}
                        required
                    />

                    <FormControl fullWidth required>
                        <InputLabel id="category-label">Catégorie</InputLabel>
                        <Select
                            labelId="category-label"
                            value={category}
                            label="Catégorie"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {data && data?.categories?.map((category) =>
                                (<MenuItem key={category.categoryId}
                                           value={category.categoryId}>{category.name}</MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    <Input
                        type="file"
                        onChange={handleFileChange}
                        inputProps={{accept: ".pdf,.doc,.docx,.txt,.png"}}
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Ajouter
                    </Button>
                    
                </Box>
            </Modal>
            <AlertSuccess open={openSuccess} setOpen={setOpenSuccess} message={"Fichier ajouté !"}
                          setOpenModal={setOpen}/>
            <AlertFail open={openFailure} setOpen={setOpenFailure} error={error}
                       message={"Erreur d'ajout du fichier."}/>
        </>

    );
}

export default AddFileForm