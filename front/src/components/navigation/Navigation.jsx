import {Grid} from '@mui/material'
import NavigationBar from './NavigationBar'
import {Outlet} from 'react-router-dom'

function Navigation() {
    return (
        <Grid container spacing={2} sx={{height: '100vh'}}>
            <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
                <NavigationBar/>
            </Grid>
            <Grid item xs={12} sm={8} md={9} lg={10} xl={10}>
                <Outlet/>
            </Grid>
        </Grid>
    )
}

export default Navigation
