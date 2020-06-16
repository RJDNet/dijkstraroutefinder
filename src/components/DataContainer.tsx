import React, { useState, useEffect } from 'react';

import PriorityQueue from '../utils/PriorityQueue';
import TestDataControls from '../components/TestDataControls/TestDataControls';
import AddDataControls from '../components/AddDataControls/AddDataControls';
import FindPathControls from '../components/FindPathControls/FindPathControls';
import D3Canvas from '../components/D3Canvas/D3Canvas';

const DataContainer: React.FC = (): JSX.Element => {
  const nodesArray: string[] = [];
  const adjacencyListObject: { [key: string]: any[] } = {};

  const [nodes, setNodes] = useState(nodesArray);
  const [adjacencyList, setAdjacencyList] = useState(adjacencyListObject);
  const [findPathResult, setFindPathResult] = useState<string[]>();

  useEffect(() => {
  }, [nodes, adjacencyList]);

  function addNode(node: string): void {
    setNodes(prev => [...prev, node]);
    setAdjacencyList(prev => ({ ...prev, [node]: [] }));
  }

  function addEdge(node1: string, node2: string, distance: number): void {
    const addNode2 = { node: node2, distance: distance };
    const addNode1 = { node: node1, distance: distance };

    setAdjacencyList(prev => ({ ...prev, [node1]: [...prev[node1], addNode2] }));
    setAdjacencyList(prev => ({ ...prev, [node2]: [...prev[node2], addNode1] }));
  }

  function removeNodes(): void {
    setNodes(nodesArray);
    setAdjacencyList(adjacencyListObject);
  }

  function findPath(startNode: string, endNode: string): { path: string[]; times: number; } {
    if (!nodes.includes(startNode) || !nodes.includes(endNode)) return { path: [''], times: 0 };

    let times: Record<string, number> = {};
    let backtrace: Record<string, any> = {};
    let pq = new PriorityQueue();

    times[startNode] = 0;

    nodes.forEach((node: string) => {
      if (node !== startNode) {
        times[node] = Infinity;
      }
    });

    pq.enqueue([startNode, 0]);

    while (!pq.isEmpty()) {
      let shortestStep: (string | number)[] | undefined = pq.dequeue();
      if (shortestStep) {
        let currentNode: string | number = shortestStep[0];

        adjacencyList[currentNode].forEach((neighbor: { node: string, distance: number }) => {
          let time: number = times[currentNode] + neighbor.distance;

          if (time < times[neighbor.node]) {
            times[neighbor.node] = time;
            backtrace[neighbor.node] = currentNode;

            pq.enqueue([neighbor.node, time]);
          }
        });
      }
    }

    let path = [endNode];
    let lastStep = endNode;

    while (lastStep !== startNode) {
      path.unshift(backtrace[lastStep])
      lastStep = backtrace[lastStep]
    }

    setFindPathResult(path);

    return {
      path,
      times: times[endNode]
    };
  }

  return (
    <div className='mainContainer'>
      <div className='mainCanvasTesterPathContainer'>
        <div className='canvasContainer'>
          <D3Canvas showNodes={nodes} showEdges={adjacencyList} findPathResult={findPathResult} />
        </div>
        <div className='testerPathContainer'>
          <TestDataControls addNode={addNode} addEdge={addEdge} removeNodes={removeNodes} />
          <FindPathControls showNodes={nodes} findPath={findPath} />
        </div>
      </div>
      <div className='infoContainer'>* all places require a link for visualisation.</div>

      <div className='mainAddDataContainer'>
        <AddDataControls addNode={addNode} addEdge={addEdge} showNodes={nodes} showEdges={adjacencyList} />
      </div>
    </div>
  );
}

export default DataContainer;