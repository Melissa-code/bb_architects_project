import Grid from "@mui/material/Grid";
import ProfileUserInfoCard from "../components/profile/ProfileUserInfoCard.jsx";
import {Box, Button, Card, CardActions, CardHeader, CardContent, Typography} from "@mui/material";
import usePageUserProfile from "./usePageUserProfile.js";

function PageUserProfile() {
    const {data} = usePageUserProfile()

    return (
        <Box sx={{p: 4}}> {/* Ajout de padding global pour éviter que le contenu ne soit collé aux bords */}
            <Grid container spacing={4}> {/* Espacement augmenté pour plus d'aération */}
                {/* Carte d'info utilisateur */}
                <Grid item xl={6}>
                    <ProfileUserInfoCard data={data}/>
                </Grid>

                {/* Carte de stockage */}
                <Grid item xl={6}>
                    <Card
                        sx={{minWidth: 275, maxWidth: 350, p: 2}}> {/* Ajout de padding interne pour plus d'aération */}
                        <CardHeader
                            title="Stockage"
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                textAlign: 'center'
                            }}
                        />
                        <CardContent>
                            <Typography
                                variant="body1"
                                color="textSecondary"
                                gutterBottom>
                                {data?.user?.filesNumber} fichiers
                            </Typography>
                            <Typography
                                variant="body2"
                                color="textPrimary"
                                sx={{fontWeight: 'bold', mb: 1}}>
                                Capacité totale
                            </Typography>
                            <Typography
                                variant="body1"
                                color="textSecondary"
                                gutterBottom>
                                {data?.user?.total_storage_capacity} Go
                            </Typography>
                        </CardContent>

                        <CardActions sx={{justifyContent: 'center'}}> {/* Centrer le bouton */}
                            <Button
                                size="medium"
                                variant="contained"
                                onClick={() => alert("Ajout de l'espace supplémentaire")}>
                                Ajouter de l&apos;espace
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Section des factures */}
                <Grid item xs={12}> {/* Full width section */}
                    <Box sx={{mt: 4}}> {/* Ajout d'une marge supérieure pour espacer cette section */}
                        <Typography variant="h6" gutterBottom>
                            Factures
                        </Typography>
                        {/* Contenu des factures (à ajouter) */}
                    </Box>
                </Grid>
            </Grid>
        </Box>


    )

}

export default PageUserProfile