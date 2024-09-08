import {Grid} from '@mui/material'
import NavigationBar from './NavigationBar'
import {Outlet} from 'react-router-dom'

function Navigation() {
    return (
        <Grid container>
            <Grid container lg={2} xl={2}>
                <NavigationBar/>
            </Grid>
            <Grid container lg={10} xl={10} spacing={2}>
                <Outlet/>
            </Grid>
        </Grid>
    )
}

export default Navigation
