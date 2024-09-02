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

    const address1 = `${data.user.address.number_street} ${data.user.address.street}`
    const address2 = `${data.user.address.zipcode} ${
        data.user.address.city
    } ${data.user.address.country.toUpperCase()}`
    const fullName = `${data.user.firstname} ${data.user.lastname}`

    return (
        <>
            <Card sx={{minWidth: 275}}>
                <CardHeader
                    title={'Informations personnelles'}
                    subheader={fullName}
                />
                <CardContent>
                    <Typography sx={{fontSize: 16}} color="text.primary">
                        Adresse email
                    </Typography>
                    <Typography
                        sx={{fontSize: 16}}
                        color="text.secondary"
                        gutterBottom>
                        {data.user.email}
                    </Typography>
                    <Typography sx={{fontSize: 16}} color="text.primary">
                        Adresse postale
                    </Typography>
                    <Typography sx={{fontSize: 16}} color="text.secondary">
                        {address1}
                    </Typography>
                    <Typography
                        sx={{fontSize: 16}}
                        color="text.secondary"
                        gutterBottom>
                        {address2}
                    </Typography>
                    <Typography sx={{fontSize: 16}} color="text.primary">
                        Téléphone
                    </Typography>
                    <Typography
                        sx={{fontSize: 16}}
                        color="text.secondary"
                        gutterBottom>
                        {data.user.phone}
                    </Typography>
                </CardContent>
                <CardActions>
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

            <ProfileConfirmDelete open={open} setOpen={setOpen} />
        </>
    )
}

export default ProfileUserInfoCard
