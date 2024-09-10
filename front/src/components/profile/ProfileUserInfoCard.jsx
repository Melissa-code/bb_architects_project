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
            <Card sx={{minWidth: 275, maxWidth: 400, height: 380, p: 2}}>
                <CardHeader
                    title="Informations personnelles"
                    subheader={fullName}
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        textAlign: 'center'
                    }}
                />
                <CardContent>
                    <Typography variant="body1" color="textPrimary" gutterBottom
                                sx={{fontWeight: 'bold'}}>
                        Adresse email
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {data?.user?.email}
                    </Typography>

                    <Typography variant="body1" color="textPrimary" gutterBottom
                                sx={{fontWeight: 'bold'}}>
                        Adresse postale
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {address1}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {address2}
                    </Typography>

                    <Typography variant="body1" color="textPrimary" gutterBottom
                                sx={{fontWeight: 'bold'}}>
                        Téléphone
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {data?.user?.phone}
                    </Typography>
                </CardContent>

                <CardActions sx={{justifyContent: 'center'}}>
                    <Button size="medium" variant="contained" disabled>
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

            <ProfileConfirmDelete open={open} setOpen={setOpen} id={data?.user?.id}/>
        </>

    )
}

export default ProfileUserInfoCard
