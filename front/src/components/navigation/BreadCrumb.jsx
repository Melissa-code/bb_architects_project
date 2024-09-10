import {useMatches} from "react-router-dom";
import Box from "@mui/material/Box";

function Breadcrumb() {
    let matches = useMatches();
    let crumbs = matches
        .filter((match) => Boolean(match.handle?.crumb))
        .map((match) => match.handle.crumb(match.data));

    return <Box sx={{flexGrow: 1}}>
        <ol>
            {crumbs.map((crumb, index) => (
                <li key={index}>{crumb}</li>
            ))}
        </ol>
    </Box>
}

export default Breadcrumb;