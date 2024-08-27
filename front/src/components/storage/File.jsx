const File = ({name, isSelected}) => (
    <div className={`file ${isSelected ? 'selected' : ''}`}>{name}</div>
)

export default File
