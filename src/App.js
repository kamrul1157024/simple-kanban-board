import * as Quote from 'inspirational-quotes';
import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';

import './App.css';


function getContent(n) {
  const contents = []
  for (let i = 0; i < n; i++) {
    contents.push({
      text: Quote.getRandomQuote(),
      rowId: uuidv4()
    });
  }
  return contents
}

const CardType = { TEXT: 'text', 'TEST': 'test' }

function KanbanRow({ text, position, rowId, handleDrop }) {
  const [{ opacity }, drag] = useDrag(() => ({
    type: CardType.TEXT,
    item: { rowId },
    collect: monitor => ({
      opacity: monitor.isDragging() ? .5 : .9
    }),
    end(item, monitor) {
      const dropResult = monitor.getDropResult();
      if (dropResult !== null) {
        handleDrop(item.rowId, dropResult.colId)
      }
    }
  }), [rowId]);

  return (
    <div ref={drag} className='content-row' style={{ opacity, gridRow: `${position + 2}\\${position + 3}` }}>
      <p>{text}</p>
    </div>
  )
}

function KanbanColumn(props) {
  const { colName, position, color, colId } = props;
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
    <div ref={drop} className={`col bg-color-${color} ${droppingBox}`} style={{ gridColumn: `${position + 1}\\${position + 2}` }}>
      <div className='col-header'>{colName}</div>
      {props.children}
    </div>
  )
}

function NewKanbanRowPlaceHolder(position) {
  return (
    <div className='content-row'
      style={{
        display:'flex',
        justifyContent: 'center',
        opacity:.9,
        gridRow: `${position + 2}\\${position + 3}`
      }}>
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAABmJLR0QA/wD/AP+gvaeTAAAEo0lEQVR4nO2dz29VRRTHP9BqnylBDC6gNQFEyw4JWzGSAm7FBZgI7ERN0Kgx4NbEjYkb0oS/wD/ARBcYCbpwgTEYqGyABRjDD5UfrQqxD/taF+dhzPNePPP73ul8kpOXNHPfnPlm3tyZc2amUCgUCoVCoVAoFAoNZVlqByoYArYCm4FNwATwJDAKPNb/BLgLzPQ/LwEXgIvANHAG6EX1uiU8AbwDfA78Biw62izwGfA2MB6xHY3kEeAAcALpfa7i1tk88CWwH+hEaVlDWIH0tKuEE7fOfgU+AB4N3sqEPAQcBm4RX+BBuwW81/cpK54DzpFe4EE7D+wM2O5odIBjwALpRa2zBWAKGAmkQXDWA9+SXkitfQ88FUSJgOzEzzQtts0CkwH0CMJLwJ+kF83WusDL3lXxzGuEnRPHsh5w0LM23tiNLA5Si+RT7L1eFfLAJDBHenF8Wxd4waNOTjxNO198WpsFNnpTy5IRZFqUWozQdprE8+xjFU6Fsi6yhF/btyP9v8Wqf8qTZsY8T9wV35EKH96PWP8CsM1aLUuGkQB7rEYuIr14kDWRfThH5EDU4QCN+D+rI7Yf7xqrZckK4GaEBjVV6Jt9DYxYbvoAcAhYbfFcLqwGXg9dSQe4Rvxe1KQevQhcR1Jxakx79F6qX0pLjTVI8EyNqdAHDMvnTDAtxkkbNKojlT89DLYymPToPcjmloKwHIPhw0ToHea+ZI86G6PdEjaEzB9XWbnjhzpfHzSshGYWeBzF9jNtj95KWpGbyipgi6agVuhn7H3Jns2aQlqhJxwcyR2VNlqhNzk4kjsqbbRCr3dwJHc2aApphV7p4Mg9JGg/hswcbK0Ol+8cQ5IH9xza53VnqktYtCoz0jRcMjU3fDrikptrQxDKJVMzp6nAJh5tShPPyQwSPLSgFfoPhzraEPFz8dFFm/9wGfufVhcZA8d8OuSJ+y9Dl6Hxkk+HYme8q6yO1H6d0QioHTp+VJZbilzWFNIKfcHBkdxRaVOEdser0D84OJI7Km1K4N8N74H/HvCNi0eZ8jXKw/0mK8OTdr5kjVoTk+XxGPAT6TLhTRs6esitDD9rCpv06GvAVzYeZcoJlCKDeVDpE8PyORNUiw5prn9o2hI8+CbHOeCo4TM58jFyOjgoo0hWYan26Ggb0e8CH1k8lwsfAndiVTYMnCVuT6qKZ49H9sH6sJBtKmseeIsH/6R9U5UFiZm9WQTeAP6KWOc/TBGvN/07U+MjM2JqSScBI8jx3Zg/3xT2HfCwJ82s2YhEsVKLEcpmUO5GisF22n3rTJ11gV0edfLCi+R3Mcoerwp55CB5XPUzD7zqWRvv7Kbdw8gcDbzip45J2vmCnEHeN61iHXCK9OJp7TQNuNLHlhFkUdP0KzOP0oB5sg+20YxtZYM2DTwbsN1JGEYuFUkRYh20G8gd1sNBW5yYUaSRV4gv8C/IRd0uR0VaRwfYB3xB2IXOPHAceIUldvV8FWuBN4FPgdu4i3u7/12HkGMTyWnisYch5KTuFuSw5AQS1FmJbEm7n0a6g8zVf0e2zl5ENhxO9638e5BCoVAoFAqFQqFQ0PA32oAL4Nvgw4gAAAAASUVORK5CYII=" />    </div>
  )
}

const initialKanbanColumns = [
  { colName: 'QuoteList1', color: 'purple', colId: uuidv4(), data: getContent(7) },
  { colName: 'QuoteList2', color: 'orange', colId: uuidv4(), data: getContent(3) },
  { colName: 'QuoteList3', color: 'green', colId: uuidv4(), data: getContent(2) },
  { colName: 'QuoteList4', color: 'blue', colId: uuidv4(), data: getContent(5) },
]

function moveQuotes(kanbanColumns, destColId, rowId) {
  const srcColumn = kanbanColumns.find(column => column.data.map(data => data.rowId).includes(rowId));
  const destColumn = kanbanColumns.find(column => column.colId === destColId);
  const rowIndexPosInSrcColumn = srcColumn.data.findIndex(row => row.rowId === rowId);
  destColumn.data.push(srcColumn.data[rowIndexPosInSrcColumn]);
  srcColumn.data.splice(rowIndexPosInSrcColumn, 1);
  return [...kanbanColumns];
}

function App() {
  const [kanbanColumns, setKanbanColumns] = useState(initialKanbanColumns);

  const handleDrop = (rowId, colId) => {
    setKanbanColumns(prevKanbanColumns => moveQuotes(prevKanbanColumns, colId, rowId));
  }

  return (
    <div className="container">
      {
        kanbanColumns && kanbanColumns.map((column, idx) => (
          <KanbanColumn key={column.colId} colName={column.colName} position={idx} color={column.color} colId={column.colId}>
            {column.data.map(
              ({ text, rowId }, idx) => <KanbanRow key={rowId} text={text} position={idx} rowId={rowId} handleDrop={handleDrop} />)
            }
          </KanbanColumn>)
        )
      }
    </div>
  );
}

export default App;
