import {fetchGetStatistics, fetchGetUsers} from "../utils/fetchAdmin.js";
import {useQuery} from "@tanstack/react-query";
import Grid from "@mui/material/Grid";
import {Divider, Stack, Typography} from "@mui/material";
import CardAdminDashboard from "../components/cards/CardAdminDashboard.jsx";
import {PieChart} from "@mui/x-charts";
import Box from "@mui/material/Box";

function PageAdminDashboard() {
    const token = localStorage.getItem("BBStorage_token");

    const statistics = useQuery({
        queryKey: ["GetStatistics"],
        queryFn: () => fetchGetStatistics(token),
        enabled: !!token
    })
    const users = useQuery({
        queryKey: ["GetUsersAdmin"],
        queryFn: () => fetchGetUsers(token),
        enabled: !!token
    })

    const totalStorageUsed = users?.data?.clients?.reduce((total, user) => {
        return total + user.storageSpaceOfUser.totalWeightInGo;
    }, 0)

    const usersOverQuota = users?.data?.clients?.filter(user => user.storageSpaceOfUser.availableStorageSpace <= 0);

    const pieChartData = users?.data?.clients?.map((user, index) => {
        return {
            id: index,
            value: user.storageSpaceOfUser.totalWeightInGo,  // Utilisation de l'espace
            label: `${user.firstname} ${user.lastname}`      // Nom complet de l'utilisateur
        };
    });

    return <Box sx={{p: 4, bgcolor: 'background.paper'}}>
        <Typography variant="h4" gutterBottom>
            Dashboard Administrateur
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
            Vue d'ensemble des statistiques et du stockage
        </Typography>

        <Grid item xl={12} sx={{mb: 4}}>
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem/>}
                spacing={3}
                sx={{height: 100}}
            >
                <CardAdminDashboard title={"Total de fichiers"} content={users?.data?.clients?.length}/>
                <CardAdminDashboard title={"Fichiers ajoutés aujourd'hui"} content={users?.data?.clients?.length}/>
                <CardAdminDashboard title={"Total de clients"} content={users?.data?.clients?.length}/>
            </Stack>
        </Grid>

        <Grid item xl={12} sx={{mb: 4}}> {/* Marge inférieure */}
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem/>}
                spacing={3}
                sx={{height: 100}}
            >
                <CardAdminDashboard title={"Total de stockage utilisé"} content={totalStorageUsed + " Go"}/>
                <CardAdminDashboard title={"Utilisateurs au dessus du quota"} content={usersOverQuota?.length}/>
            </Stack>
        </Grid>

        <Grid item xl={6} sx={{mt: 4}}>
            <Typography variant="h6" gutterBottom>
                Répartition du stockage
            </Typography>
            {pieChartData && (
                <PieChart
                    series={[
                        {
                            data: pieChartData,
                        },
                    ]}
                    width={600}
                    height={300}
                />
            )}
        </Grid></Box>

}

export default PageAdminDashboard