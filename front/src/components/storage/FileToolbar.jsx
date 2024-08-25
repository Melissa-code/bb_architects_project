const FileToolbar = ({selectedFile, onCreate, onDelete, onRename, onMove}) => (
    <div>
        <button onClick={onCreate}>Create</button>
        {selectedFile && (
            <>
                <button onClick={() => onDelete(selectedFile)}>Delete</button>
                <button onClick={() => onRename(selectedFile)}>Rename</button>
                <button onClick={() => onMove(selectedFile)}>Move</button>
            </>
        )}
    </div>
)

export default FileToolbar
