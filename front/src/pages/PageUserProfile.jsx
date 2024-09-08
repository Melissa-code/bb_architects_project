import Grid from "@mui/material/Grid";
import ProfileUserInfoCard from "../components/profile/ProfileUserInfoCard.jsx";
import {Box, Button, Card, CardActions, CardHeader, CardContent, Typography} from "@mui/material";
import usePageUserProfile from "./usePageUserProfile.js";

function PageUserProfile() {
    const {data} = usePageUserProfile()

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xl={6}>
                    <ProfileUserInfoCard data={data}/>
                </Grid>
                <Grid item xl={6}>
                    <Card sx={{minWidth: 275, maxWidth: 300}}>
                        <CardHeader title={'Stockage'}/>
                        <CardContent>
                            <Typography
                                sx={{fontSize: 16}}
                                color="text.secondary"
                                gutterBottom>
                                {data?.user?.filesNumber} fichiers
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
                                {data?.user?.total_storage_capacity} Go
                            </Typography>

                        </CardContent>

                        <CardActions>
                            <Button
                                size="medium"
                                variant="contained"
                                onClick={() =>
                                    alert(
                                        "Ajout de l'espace supplémentaire"
                                    )
                                }>
                                Ajouter de l&apos;espace
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item size={12}>
                    <Box>Factures</Box>
                </Grid>
            </Grid>

        </>
    )

}

export default PageUserProfile