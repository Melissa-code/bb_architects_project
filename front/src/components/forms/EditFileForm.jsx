import {Formik, Form} from 'formik'
import {TextField, Button, MenuItem, Modal, Box} from '@mui/material'
import categories from '../../utils/fake-fetch/categories.json'
import {useState} from 'react'
import {useMutation, useQuery} from '@tanstack/react-query'
import {fetchCreateFile, fetchGetCategories} from '../../utils/fetch'

function EditFileForm({...props}) {
    const {open, setOpen, data} = props
    const categoryID = data.category?.categoryId.toString()

    // TODO : Récupérer la liste des catégories
    // TODO : Récupérer les données de la ligne en props
    // TODO : Changer le label du bouton sumbit selon ajout ou modification
    /*
   const token = localStorage.getItem('BBStorage_token')

    const {data, isSuccess} = useQuery({
        queryKey: ['GetCategories'],
        queryFn: fetchGetCategories(token),
        enabled: !!token,
    })

    isSuccess && console.log(data)
    
    const {mutate} = useMutation({
        mutationKey: ['AddingFile'],
        mutationFn: (variables) => fetchCreateFile(variables, token),
        onSuccess: (data) => {
            // TODO : Mettre une alerte Success
            alert('Création réussie')
        },
        onError: (error) => {
            // TODO : Mettre une alerte Erreur
            console.log(error)
            alert('Création échouée. Voir console pour détails.')
        },
    })
*/

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
            initialValues={{
                name: data ? data.fileName : 'test',
                categoryId: categoryID ? categoryID : '1',
            }}
            enableReinitialize={true}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values) => alert(JSON.stringify(values))}>
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
                                {categories.categories.map((category) => (
                                    <MenuItem
                                        key={category.categoryId}
                                        value={category.categoryId}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </TextField>
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
                                    Modifier
                                </Button>
                            </Box>
                        </Form>
                    </Box>
                </Modal>
            )}
        </Formik>
    )
}

export default EditFileForm
