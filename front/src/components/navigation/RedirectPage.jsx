import {useEffect} from "react";
import {useParams} from "react-router-dom";

function RedirectPage() {
    const {id} = useParams()

    useEffect(() => {
        window.location.replace(`${import.meta.env.VITE_API_URL}/client/file/download/${id}`);
    }, [])

    return <div>
        <h3>Redirection en cours...</h3>
    </div>
}

export default RedirectPage
