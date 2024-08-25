import {List, ListItem} from '@material-ui/core'
import {useEffect} from 'react'

function FileBrowser({files}) {
    const [files, setFiles] = useState([])
    useEffect(() => {
        setFiles()
    }, [])

    // <List>
    //     {files.map((file) => (
    //         <ListItem key={file.name}>{file.name}</ListItem>
    //     ))}
    // </List>
    return <></>
}

export default FileBrowser
