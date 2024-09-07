import {Formik, Form} from 'formik'
import {TextField, Button, MenuItem, Modal, Box} from '@mui/material'
import {useMutation, useQuery} from '@tanstack/react-query'
import {fetchCreateFile, fetchGetCategories} from '../../utils/fetch'

function CreateFileForm({...props}) {
    const {open, setOpen} = props

    const token = localStorage.getItem('BBStorage_token')

    const {data, isError, error} = useQuery({
        queryKey: ['GetCategories'],
        queryFn: () => fetchGetCategories(token),
        enabled: !!token,
    })

    const {mutate} = useMutation({
        mutationKey: ['AddingFile'],
        mutationFn: (variables) => fetchCreateFile(variables, token),
        onSuccess: () => {
            // TODO : Mettre une alerte Success
            alert('Fichier ajouté !')
        },
        onError: (error) => {
            // TODO : Mettre une alerte Erreur
            console.log(error)
            alert('Création échouée. Voir console pour détails.')
        },
    })


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
    return (
        <Formik
            initialValues={{name: '', categoryId: 1, file: null}}
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
            onSubmit={(values) => console.log(values)}>
            {({values, handleChange, handleBlur, touched, errors}) => (
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description">
                    <Box sx={style}>
                        <Form>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                type="text"
                                margin="normal"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                            />
                            <TextField
                                fullWidth
                                id="categoryId"
                                name="categoryId"
                                select
                                label="Catégorie"
                                margin="normal"
                                value={values.categoryId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                    touched.categoryId &&
                                    Boolean(errors.categoryId)
                                }
                                helperText={
                                    touched.categoryId && errors.categoryId
                                }>
                                {data?.categories?.map((category) => (
                                    <MenuItem
                                        key={category.categoryId}
                                        value={category.categoryId}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                fullWidth
                                id="file"
                                name="file"
                                type="file"
                                margin="normal"
                                value={values.pathFile}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                    touched.pathFile && Boolean(errors.pathFile)
                                }
                                helperText={touched.pathFile && errors.pathFile}
                            />
                            <Box
                                sx={{
                                    display: 'grid',
                                    columnGap: 3,
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                }}>
                                <Button
                                    color="error"
                                    variant="contained"
                                    onClick={() => setOpen(false)}>
                                    Annuler
                                </Button>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    type="submit">
                                    Ajouter
                                </Button>
                            </Box>
                        </Form>
                    </Box>
                </Modal>
            )}
        </Formik>
    )
}

export default CreateFileForm
