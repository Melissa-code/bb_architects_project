import {
    Box,
    Button,
    Card,
    CardActions,
    CardHeader,
    Container,
    Grid,
    Typography,
} from '@mui/material'
import ProfileUserInfoCard from '../components/profile/ProfileUserInfoCard'
import data from '../utils/fake-fetch/profile.json'

function Profile() {
    return (
        <>
            <Container>
                <Grid container>
                    <Grid size={6}>
                        <ProfileUserInfoCard data={data} />
                    </Grid>
                    <Grid size={6}>
                        <Card sx={{minWidth: 275}}>
                            <CardHeader title={'Stockage'} />
                            <Typography
                                sx={{fontSize: 16}}
                                color="text.secondary"
                                gutterBottom>
                                {data.user.filesNumber} fichiers
                            </Typography>
                            <Typography
                                sx={{fontSize: 16}}
                                color="text.primary">
                                Capacité totale
                            </Typography>
                            <Typography
                                sx={{fontSize: 16}}
                                color="text.secondary"
                                gutterBottom>
                                {data.user.total_storage_capacity} Go
                            </Typography>
                            <CardActions>
                                <Button
                                    size="medium"
                                    variant="contained"
                                    onClick={() =>
                                        alert(
                                            "Ajout de l'espace supplémentaire"
                                        )
                                    }>
                                    Ajouter de l'espace
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid size={12}>
                        <Box>Factures</Box>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default Profile
