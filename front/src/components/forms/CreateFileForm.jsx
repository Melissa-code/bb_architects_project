import {TextField, Button, MenuItem, Modal, Box} from '@mui/material'
import {useMutation, useQuery} from '@tanstack/react-query'
import {fetchCreateFile, fetchGetCategories} from '../../utils/fetch'
import {useState} from "react";

function CreateFileForm({...props}) {
    const token = localStorage.getItem('BBStorage_token')
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (file) {
            console.log('Uploading file...');

            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', "TestFront");
            formData.append('categoryId', 2);


            try {
                const result = await fetch(`${import.meta.env.VITE_API_URL}/file/create_file`, {
                    method: 'POST',
                    body: formData, headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await result.json();

                console.log(data);
            } catch (error) {
                console.error(error);
            }
        }
    }

    const {open, setOpen} = props


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

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        mutate(formData)
    }

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
        <Modal
            open={open}
            onClose={() => {
                setOpen(false)
                setFile(null)
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>

                <div>
                    <input id="file" type="file" onChange={handleFileChange}/>
                </div>
                {file && (
                    <section>
                        File details:
                        <ul>
                            <li>Name: {file.name}</li>
                            <li>Type: {file.type}</li>
                            <li>Size: {file.size} bytes</li>
                        </ul>
                    </section>
                )}

                {file && (
                    <button
                        onClick={handleUpload}
                    >Upload a file</button>
                )}
            </Box>
        </Modal>
    )
}

export default CreateFileForm
