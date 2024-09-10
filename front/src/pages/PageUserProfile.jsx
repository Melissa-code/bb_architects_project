import Grid from "@mui/material/Grid";
import ProfileUserInfoCard from "../components/profile/ProfileUserInfoCard.jsx";
import {Box, Button, Card, CardActions, CardHeader, CardContent, Typography} from "@mui/material";
import usePageUserProfile from "./usePageUserProfile.js";
import InvoiceDataGrid from "../components/table/InvoiceDataGrid.jsx";

function PageUserProfile() {
    const {data} = usePageUserProfile()

    return (
        <Box sx={{p: 4}}> {/* Padding global pour éviter que le contenu ne soit collé aux bords */}
            <Grid container spacing={4}> {/* Espacement global pour aérer le contenu */}

                {/* Carte d'info utilisateur */}
                <Grid item xs={12} xl={4}>
                    <ProfileUserInfoCard data={data}/>
                </Grid>

                {/* Carte de stockage */}
                <Grid item xs={12} xl={4}>
                    <Card
                        sx={{
                            minWidth: 275,
                            maxWidth: 350,
                            height: 380,
                            p: 3,
                            mx: 'auto'
                        }}> {/* Padding interne et centrage horizontal */}
                        <CardHeader
                            title="Stockage"
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                textAlign: 'center',
                                borderRadius: '4px',
                            }}
                        />
                        <CardContent>
                            <Typography
                                variant="body2"
                                color="textPrimary"
                                sx={{fontWeight: 'bold', mb: 1}}>
                                Nombre de fichiers
                            </Typography>

                            <Typography variant="body1" color="textSecondary" gutterBottom>
                                {data?.user?.filesNumber} fichiers
                            </Typography>
                            <Typography
                                variant="body2"
                                color="textPrimary"
                                sx={{fontWeight: 'bold', mb: 1}}>
                                Capacité totale
                            </Typography>
                            <Typography variant="body1" color="textSecondary" gutterBottom>
                                {data?.user?.total_storage_capacity} Go
                            </Typography>
                        </CardContent>

                        <CardActions sx={{justifyContent: 'center'}}>
                            <Button
                                size="medium"
                                variant="contained"
                                onClick={() => alert("Ajout de l'espace supplémentaire")}>
                                Ajouter de l&apos;espace
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{mt: 4}}>
                        <Typography variant="h6" gutterBottom>
                            Factures
                        </Typography>
                        <InvoiceDataGrid/>
                    </Box>
                </Grid>

            </Grid>
        </Box>


    )

}

export default PageUserProfile