import {Card, CardContent, CardHeader} from "@mui/material";

function CardWelcomeUser({...props}) {
    const {profile} = props

    if (profile) {
        return <Card>
            <CardHeader title={"Bienvenue !"} subheader={profile.message}/>
            <CardContent>
                Connecté avec l&apos;adresse {profile?.user?.email}
            </CardContent>
        </Card>
    } else {
        return <Card>
            <CardHeader title={"Erreur"} subheader={"Récupération du profil impossible"}/>
            <CardContent>
                Erreur lors de la récupération du profil.
            </CardContent>
        </Card>
    }
}

export default CardWelcomeUser