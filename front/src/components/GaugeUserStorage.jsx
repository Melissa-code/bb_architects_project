import {Button, Card, CardActions, CardContent, CardHeader} from "@mui/material";
import {Gauge} from "@mui/x-charts/Gauge";

function GaugeUserStorage({...props}) {
    return <Card sx={{
        maxWidth: "100%",
        height: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        padding: 1
    }}>
        <CardHeader
            titleTypographyProps={{variant: 'h6', fontSize: '0.9rem'}}
            subheaderTypographyProps={{variant: 'subtitle2', fontSize: '0.7rem'}}
            title="Votre stockage"
            subheader="Taille totale"
            sx={{padding: 0, textAlign: "center"}}
        />
        <CardContent sx={{display: "flex", justifyContent: "center", alignItems: "center", padding: 0}}>
            <Gauge width={120} height={120} value={60} startAngle={-90} endAngle={90}/>
        </CardContent>
        <CardActions sx={{justifyContent: "center", padding: 0}}>
            <Button size="small">Acheter de l'espace</Button>
        </CardActions>
    </Card>
}

export default GaugeUserStorage