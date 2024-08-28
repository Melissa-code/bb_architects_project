import * as React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import NavigationButtonAdd from './NavigationButtonAdd'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import GroupIcon from '@mui/icons-material/Group'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import {ListItem} from '@mui/material'
import {useNavigate} from 'react-router-dom'

export default function NavigationBar() {
    const [selectedIndex, setSelectedIndex] = React.useState(1)
    const [open, setOpen] = React.useState(true)
    const navigate = useNavigate()

    const handleClick = () => {
        setOpen(!open)
    }
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index)
    }

    const handleDisconnect = () => {
        localStorage.removeItem('BBStorage_token')
        navigate('/connect/login')
    }

    return (
        <Box sx={{width: '100%', bgcolor: 'background.paper'}}>
            <List component="nav" aria-label="user menu">
                <ListItem alignItems="center">
                    <NavigationButtonAdd />
                </ListItem>
                <ListItemButton
                    selected={selectedIndex === 0}
                    onClick={(event) => handleListItemClick(event, 0)}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Accueil" />
                </ListItemButton>
                <ListItemButton
                    selected={selectedIndex === 1}
                    onClick={(event) => handleListItemClick(event, 1)}>
                    <ListItemIcon>
                        <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Compte" />
                </ListItemButton>

                <Divider />

                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <AdminPanelSettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Administration" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{pl: 4}}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                        <ListItemButton sx={{pl: 4}}>
                            <ListItemIcon>
                                <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary="Comptes" />
                        </ListItemButton>
                    </List>
                </Collapse>
                <Divider />

                <ListItemButton onClick={handleDisconnect}>
                    <ListItemIcon>
                        <MeetingRoomIcon color="error" />
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
