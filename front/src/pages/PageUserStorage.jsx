import {Grid} from "@mui/material";
import usePageUserStorage from "./usePageUserStorage.jsx";
import UserFileDataGrid from "../components/table/UserFileDataGrid.jsx";
import GaugeUserStorage from "../components/GaugeUserStorage.jsx";
import CardWelcomeUser from "../components/cards/CardWelcomeUser.jsx";
import AlertFail from "../components/notification/alerts/AlertFail.jsx";
import AlertSuccess from "../components/notification/alerts/AlertSuccess.jsx";

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
        setOpenAlertDeleteKo, isPending
    } = usePageUserStorage();

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <CardWelcomeUser profile={profile}/>
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <GaugeUserStorage percentage={storagePercentage}/>
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
                        isPending={isPending}
                    />
                </Grid>
            </Grid>

            <AlertFail
                open={openAlertDeleteKo}
                setOpen={setOpenAlertDeleteKo}
                message={"Erreur suppression"}
            />

            <AlertSuccess
                open={openAlertDeleteOk}
                setOpen={setOpenAlertDeleteOk}
                message={"Suppression réalisée"}
            />
        </>
    );
}

export default PageUserStorage;
