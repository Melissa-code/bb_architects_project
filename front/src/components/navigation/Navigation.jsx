import {Grid} from '@mui/material'
import NavigationBar from './NavigationBar'
import DenseAppBar from './AppBar'

function Navigation() {
    return (
        <Grid container>
            <Grid xs={2}>
                <NavigationBar />
            </Grid>
            <Grid xs={10}>
                <DenseAppBar />
                <div className="bg-red-500">
                    <p className="font-bold text-3xl">Test</p>
                </div>
            </Grid>
        </Grid>
    )
}

export default Navigation
