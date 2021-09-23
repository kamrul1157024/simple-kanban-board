import React from 'react';
import ReactDOM from 'react-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import * as Quote from 'inspirational-quotes';
import SimpleKanban from './Kanban';
import reportWebVitals from './reportWebVitals';

function getContent(n) {
  const contents = [];
  for (let i = 0; i < n; i += 1) {
    contents.push({
      text: Quote.getRandomQuote(),
      rowId: uuidv4(),
    });
  }
  return contents;
}

const initialKanbanColumns = [
  {
    colName: 'QuoteList1', color: 'purple', colId: uuidv4(), data: getContent(7),
  },
  {
    colName: 'QuoteList2', color: 'orange', colId: uuidv4(), data: getContent(3),
  },
  {
    colName: 'QuoteList3', color: 'green', colId: uuidv4(), data: getContent(2),
  },
  {
    colName: 'QuoteList4', color: 'blue', colId: uuidv4(), data: getContent(5),
  },
];

ReactDOM.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <SimpleKanban initialKanbanColumns={initialKanbanColumns}/>
    </DndProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
