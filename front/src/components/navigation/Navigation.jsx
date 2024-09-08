import {Grid} from '@mui/material'
import NavigationBar from './NavigationBar'
import {Outlet} from 'react-router-dom'
import BreadCrumb from "./BreadCrumb.jsx";

function Navigation() {
    return (
        <Grid container>

            <Grid xs={2}>
                <NavigationBar/>
            </Grid>
            <Grid xs={10}>
                <BreadCrumb/>
                <Outlet/>
            </Grid>
        </Grid>
    )
}

export default Navigation
