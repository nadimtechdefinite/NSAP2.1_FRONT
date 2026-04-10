// EditableRemarksCell.js

import React, { useRef, useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import "./style.css"

const EditableRemarksCell = ({ value, updateCell }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    updateCell(inputRef.current.value);
  };

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <div className="editable-cell" onDoubleClick={handleDoubleClick}>
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          defaultValue={value}
          onBlur={handleBlur}
        />
      ) : (
        <div>
          {value} <EditIcon fontSize="small" className="edit-icon" />
        </div>
      )}
    </div>
  );
};

export default EditableRemarksCell;
