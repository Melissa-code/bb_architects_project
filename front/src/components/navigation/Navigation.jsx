import {Grid} from '@mui/material'
import NavigationBar from './NavigationBar'
import DenseAppBar from './AppBar'
import {Outlet} from 'react-router-dom'

function Navigation() {
    return (
        <Grid container>

            <Grid xs={2}>
                 <NavigationBar />
            </Grid>
            <Grid xs={10}>
                <DenseAppBar />
                <Outlet />
            </Grid>
        </Grid>
    )
}

export default Navigation
