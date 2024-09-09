import {Grid, Box} from "@mui/material";
import usePageUserStorage from "./usePageUserStorage.jsx";
import UserFileDataGrid from "../components/table/UserFileDataGrid.jsx";
import GaugeUserStorage from "../components/GaugeUserStorage.jsx";
import CardWelcomeUser from "../components/cards/CardWelcomeUser.jsx";
import AlertFail from "../components/notification/alerts/AlertFail.jsx";
import AlertSuccess from "../components/notification/alerts/AlertSuccess.jsx";

// Constantes pour les messages d'alerte
const ALERT_MESSAGES = {
    DELETE_FAIL: "Erreur suppression",
    DELETE_SUCCESS: "Suppression réalisée"
};

function PageUserStorage() {
    const {
        open,
        setOpen,
        columns,
        rowData,
        storagePercentage,
        data,
        openDeleteDialog,
        handleDelete,
        handleCloseDialogDelete,
        profile,
        openAlertDeleteKo,
        openAlertDeleteOk,
        setOpenAlertDeleteOk,
        setOpenAlertDeleteKo
    } = usePageUserStorage();

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <CardWelcomeUser profile={profile}/>
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <GaugeUserStorage/>
                </Grid>

                <Grid item xs={12}>
                    <UserFileDataGrid
                        open={open}
                        setOpen={setOpen}
                        columns={columns}
                        rowData={rowData}
                        storagePercentage={storagePercentage}
                        data={data}
                        openDeleteDialog={openDeleteDialog}
                        handleDelete={handleDelete}
                        handleCloseDialogDelete={handleCloseDialogDelete}
                    />
                </Grid>
            </Grid>

            <AlertFail
                open={openAlertDeleteKo}
                setOpen={setOpenAlertDeleteKo}
                message={ALERT_MESSAGES.DELETE_FAIL}
            />

            <AlertSuccess
                open={openAlertDeleteOk}
                setOpen={setOpenAlertDeleteOk}
                message={ALERT_MESSAGES.DELETE_SUCCESS}
            />
        </>
    );
}

export default PageUserStorage;
