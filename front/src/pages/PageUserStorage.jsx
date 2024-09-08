import {Grid, Box} from "@mui/material";
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
        setOpenAlertDeleteKo
    } = usePageUserStorage()

    console.log(storagePercentage, typeof (storagePercentage))
    return <>
        <Grid item xs={12} sm={12} md={12}> <Box
            sx={{backgroundColor: "inherit", color: "#F9394F"}}> Breadcrumb</Box></Grid>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={8}> <CardWelcomeUser profile={profile}/></Grid>
            <Grid item xs={12} sm={12} md={4} lg={3} xl={3}> <GaugeUserStorage/></Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
            <UserFileDataGrid open={open} setOpen={setOpen} columns={columns} rowData={rowData}
                              storagePercentage={storagePercentage} data={data} openDeleteDialog={openDeleteDialog}
                              handleDelete={handleDelete} handleCloseDialogDelete={handleCloseDialogDelete}/>
        </Grid>
        <AlertFail open={openAlertDeleteKo} setOpen={setOpenAlertDeleteKo} message={"Erreur suppression"}/>
        <AlertSuccess open={openAlertDeleteOk} setOpen={setOpenAlertDeleteOk} message={"Suppression réalisée"}/>
    </>

}

export default PageUserStorage