import {Button, Card, CardActions, CardContent, CardHeader} from "@mui/material";
import {Gauge} from "@mui/x-charts/Gauge";

function GaugeUserStorage({...props}) {
    return <Card sx={{maxWidth: "100%", maxHeight: 150}}>
        <CardHeader title="Votre stockage" subheader="Taille totale"/>
        <CardContent>
            <Gauge width={100} height={100} value={60} startAngle={-90}
                   endAngle={90}/>
        </CardContent>
        <CardActions>
            <Button size="small">Acheter de l&apos;espace</Button>
        </CardActions>
    </Card>
}

export default GaugeUserStorage