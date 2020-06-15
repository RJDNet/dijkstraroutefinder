import React from 'react';

interface ITestDataControls {
  addNode: (startNode: string,) => void;
  addEdge: (startNode: string, endNode: string, distance: number) => void;
  removeNodes: () => void;
}

const TestDataControls: React.FC<ITestDataControls> = (props): JSX.Element => {
  const { addNode, addEdge, removeNodes } = props;

  const addTestNodes = (): void => {
    removeNodes();
    addNode('A');
    addNode('B');
    addNode('C');
    addNode('D');
    addNode('E');
    addNode('F');
    addNode('G');
    addNode('H');
  }

  const addTestEdges = (): void => {
    removeNodes();
    addTestNodes();
    addEdge('A', 'C', 2);
    addEdge('C', 'D', 1);
    addEdge('C', 'F', 4);
    addEdge('B', 'D', 4);
    addEdge('B', 'E', 7);
    addEdge('D', 'F', 1);
    addEdge('D', 'G', 2);
    addEdge('F', 'G', 3);
    addEdge('G', 'H', 4);
    addEdge('E', 'H', 10);
  }

  const removesTestNodes = (): void => {
    removeNodes();
  }

  return (
    <div className='testContainer'>
      <h2>Testers</h2>
      <button onClick={addTestNodes}>Add Test Places</button>
      <button onClick={addTestEdges}>Add Test Routes</button>
      <button className='testButton' onClick={removesTestNodes}>Remove All Data</button>
    </div>
  );
}

export default TestDataControls;