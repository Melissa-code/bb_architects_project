import {Card, CardContent, Typography} from "@mui/material";

function CardAdminDashboard({...props}) {
    const {title, content} = props

    return <Card sx={{width: "250px", maxHeight: "100px"}}>
        <CardContent>
            <Typography gutterBottom sx={{color: 'text.primary', fontSize: 14}}>
                {title}
            </Typography>
            <Typography sx={{color: 'text.primary', fontSize: 25}}>
                {content}
            </Typography>
        </CardContent>
    </Card>
}

export default CardAdminDashboard