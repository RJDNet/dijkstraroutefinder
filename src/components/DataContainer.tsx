import React, { useState, useEffect } from 'react';

import PriorityQueue from '../utils/PriorityQueue';
import TestDataControls from '../components/TestDataControls/TestDataControls';
import AddDataControls from '../components/AddDataControls/AddDataControls';
import FindPathControls from '../components/FindPathControls/FindPathControls';
import D3Canvas from '../components/D3Canvas/D3Canvas';
import { INodeDatum } from '../utils/D3Component';

export interface IAdjacencyListObject {
  [key: string]: INodeDatum[];
}

export interface IFindPath {
  path: string[];
  times: number;
}

const DataContainer: React.FC = (): JSX.Element => {
  const nodesArray: string[] = [];
  const adjacencyListObject: IAdjacencyListObject = {};

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
    const addNode1: INodeDatum = { place: node1, distance: distance };
    const addNode2: INodeDatum = { place: node2, distance: distance };

    setAdjacencyList(prev => ({
      ...prev,
      [node1]: [...prev[node1], addNode2],
      [node2]: [...prev[node2], addNode1]
    }));
  }

  function removeNodes(): void {
    setNodes(nodesArray);
    setAdjacencyList(adjacencyListObject);
  }

  function findPath(startNode: string, endNode: string): IFindPath {
    if (!nodes.includes(startNode) || !nodes.includes(endNode)) {
      setFindPathResult([]);
      return { path: [''], times: 0 };
    }

    let times: Record<string, number> = {};
    let backtrace: Record<string | number, string> = {};
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
        let currentNode: string = shortestStep[0].toString();

        adjacencyList[currentNode].forEach((neighbor: INodeDatum) => {
          if (neighbor.distance !== undefined) {
            const time: number = times[currentNode] + neighbor.distance;

            if (time < times[neighbor.place]) {
              times[neighbor.place] = time;
              backtrace[neighbor.place] = currentNode;

              pq.enqueue([neighbor.place, time]);
            }
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

  function resetPath(): void {
    setFindPathResult([]);
  }

  return (
    <div className='mainContainer'>
      <div className='mainCanvasTesterPathContainer'>
        <div className='canvasContainer'>
          <D3Canvas showNodes={nodes} showEdges={adjacencyList} findPathResult={findPathResult} />
        </div>
        <div className='testerPathContainer'>
          <TestDataControls addNode={addNode} addEdge={addEdge} removeNodes={removeNodes} resetPath={resetPath} />
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