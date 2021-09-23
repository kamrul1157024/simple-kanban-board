import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './App.css';

const CardType = { TEXT: 'text', TEST: 'test' };

function KanbanCard({ text }) {
  return (<p>{text}</p>);
}

function KanbanRow({
  text, rowId, handleDrop,
}) {
  const [{ opacity }, drag] = useDrag(() => ({
    type: CardType.TEXT,
    item: { rowId },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 0.9,
    }),
    end(item, monitor) {
      const dropResult = monitor.getDropResult();
      if (dropResult !== null) {
        handleDrop(item.rowId, dropResult.colId);
      }
    },
  }), [rowId]);

  return (
    <div ref={drag} className='content-row' style={{ opacity }}>
      <KanbanCard text={text}/>
    </div>
  );
}

function KanbanColumn(props) {
  const {
    colName, color, colId,
  } = props;
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: CardType.TEXT,
    drop: () => ({ colName, colId }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [colName, colId]);

  const isActive = canDrop && isOver;
  const droppingBox = isActive ? 'dropping-box' : '';
  return (
    <div ref={drop} className={`col bg-color-${color} ${droppingBox}`}>
      <div className='col-header'>{colName}</div>
      {props.children}
    </div>
  );
}

function moveCards(kanbanColumns, destColId, rowId) {
  const srcColumn = kanbanColumns
    .find((column) => column.data.map((data) => data.rowId).includes(rowId));
  const destColumn = kanbanColumns.find((column) => column.colId === destColId);
  const rowIndexPosInSrcColumn = srcColumn.data.findIndex((row) => row.rowId === rowId);
  destColumn.data.push(srcColumn.data[rowIndexPosInSrcColumn]);
  srcColumn.data.splice(rowIndexPosInSrcColumn, 1);
  return [...kanbanColumns];
}

function SimpleKanban({ initialKanbanColumns }) {
  const [kanbanColumns, setKanbanColumns] = useState(initialKanbanColumns);

  const handleDrop = (rowId, colId) => {
    setKanbanColumns((prevKanbanColumns) => moveCards(prevKanbanColumns, colId, rowId));
  };

  return (
    <div className="container">
      {
        kanbanColumns && kanbanColumns.map((column) => (
          <KanbanColumn
            key={column.colId}
            colName={column.colName}
            color={column.color}
            colId={column.colId}
          >
            {column.data.map(
              ({ text, rowId }) => <KanbanRow
                key={rowId}
                text={text}
                rowId={rowId}
                handleDrop={handleDrop}
              />,
            )
            }
          </KanbanColumn>))
      }
    </div>
  );
}

export default SimpleKanban;
