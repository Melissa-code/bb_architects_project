import * as React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import NavigationButtonAdd from './NavigationButtonAdd'
import GroupIcon from '@mui/icons-material/Group'
import DashboardIcon from '@mui/icons-material/Dashboard'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import {ListItem} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import {getUserRole} from "../../utils/jwt.js";

export default function NavigationBar() {
    const [selectedIndex, setSelectedIndex] = React.useState(1)
    const [open, setOpen] = React.useState(true)
    const navigate = useNavigate()
    const {roles} = getUserRole()

    const handleClick = () => {
        setOpen(!open)
    }
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index)
    }

    const handleDisconnect = () => {
        localStorage.removeItem('BBStorage_token')
        navigate('/login')
    }

    return (
        <Box sx={{width: '100%', bgcolor: 'background.paper', minWidth: 200}}>
            <Box
                component="img"
                sx={{
                    height: 150,
                    justifyContent: 'center',
                    alignSelf: "center"
                }}
                alt="BB Storage logo"
                src="/Logo_bbArchitects.svg"
            />
            <List component="nav" aria-label="user menu">
                {!roles?.includes("ROLE_ADMIN") ? (<>
                            <ListItem alignItems="center">
                                <NavigationButtonAdd/>
                            </ListItem>
                            <ListItemButton
                                selected={selectedIndex === 0}
                                onClick={(event) => handleListItemClick(event, 0)}>
                                <ListItemIcon>
                                    <HomeIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Stockage"/>
                            </ListItemButton>
                            <ListItemButton
                                selected={selectedIndex === 1}
                                onClick={(event) => handleListItemClick(event, 1)}>
                                <ListItemIcon>
                                    <PersonIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Profil"/>
                            </ListItemButton></>
                    ) :
                    (<><ListItemButton selected={selectedIndex === 2}
                                       onClick={(event) => handleListItemClick(event, 2)}>
                        <ListItemIcon>
                            <DashboardIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Dashboard"/>
                    </ListItemButton>
                        <ListItemButton selected={selectedIndex === 3}
                                        onClick={(event) => handleListItemClick(event, 3)}>
                            <ListItemIcon>
                                <GroupIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Comptes"/>
                        </ListItemButton></>)}

                <ListItemButton onClick={handleDisconnect}>
                    <ListItemIcon>
                        <MeetingRoomIcon color="error"/>
                    </ListItemIcon>
                    <ListItemText
                        primary="Déconnexion"
                        primaryTypographyProps={{
                            color: 'error',
                        }}
                    />
                </ListItemButton>
            </List>
        </Box>
    )
}
