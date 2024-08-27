const FileList = ({files}) => (
    <ul>
        {files.map((file) => (
            <li key={file.name}>{file.name}</li>
        ))}
    </ul>
)

export default FileList
