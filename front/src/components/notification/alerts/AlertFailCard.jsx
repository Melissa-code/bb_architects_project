import {Button} from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

function AlertFailCard({...props}) {
    return (
        <Card sx={{maxWidth: 345}}>
            <CardHeader
                title="Une erreur a été rencontrée"
                subheader="Détails"
            />
            <CardContent>
                <Typography variant="body2" color="text.primary">
                    Un problème a été rencontré. Veuillez trouver ci-dessous un
                    détail :
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Un problème a été rencontré.
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Button>Fermer</Button>
            </CardActions>
        </Card>
    )
}

export default AlertFailCard
