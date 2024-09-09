import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Typography,
} from '@mui/material'
import {useState} from 'react'
import ProfileConfirmDelete from './ProfileConfirmDelete'

function ProfileUserInfoCard({...props}) {
    const {data} = props
    const [open, setOpen] = useState(false)

    const handleOpen = () => {
        setOpen(true)
    }

    const address1 = `${data?.user?.address?.number_street} ${data?.user?.address?.street}`
    const address2 = `${data?.user?.address?.zipcode} ${
        data?.user?.address?.city
    } ${data?.user?.address?.country.toUpperCase()}`
    const fullName = `${data?.user?.firstname} ${data?.user?.lastname}`

    return (
        <>
            <Card sx={{minWidth: 275, maxWidth: 400, p: 2}}> {/* Ajout de padding interne */}
                <CardHeader
                    title="Informations personnelles"
                    subheader={fullName}
                    sx={{
                        bgcolor: 'primary.main',  // Couleur de fond du header
                        color: 'white',           // Couleur du texte
                        textAlign: 'center'       // Alignement du texte centré
                    }}
                />
                <CardContent>
                    <Typography variant="body1" color="textPrimary" gutterBottom>
                        Adresse email
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {data?.user?.email}
                    </Typography>

                    <Typography variant="body1" color="textPrimary" gutterBottom>
                        Adresse postale
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {address1}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {address2}
                    </Typography>

                    <Typography variant="body1" color="textPrimary" gutterBottom>
                        Téléphone
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {data?.user?.phone}
                    </Typography>
                </CardContent>

                <CardActions sx={{justifyContent: 'center'}}> {/* Centrer les boutons */}
                    <Button size="medium" variant="contained">
                        Modifier
                    </Button>
                    <Button
                        size="medium"
                        color="error"
                        variant="contained"
                        onClick={handleOpen}>
                        Supprimer le compte
                    </Button>
                </CardActions>
            </Card>

            <ProfileConfirmDelete open={open} setOpen={setOpen}/>
        </>

    )
}

export default ProfileUserInfoCard
