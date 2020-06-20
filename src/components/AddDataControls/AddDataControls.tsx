import React, { useState, useEffect, ChangeEvent } from 'react';
import { IAdjacencyListObject } from '../DataContainer';

interface IAddDataControls {
  addNode: (node: string) => void;
  addEdge: (node1: string, node2: string, distance: number) => void;
  showNodes: string[];
  showEdges: IAdjacencyListObject;
}

const AddDataControls: React.FC<IAddDataControls> = (props): JSX.Element => {
  const { addNode, addEdge, showNodes, showEdges } = props;

  // Add Node Input State
  const [node, setNode] = useState('');

  // Add Edge Input State
  const [edge1, setEdge1] = useState('');
  const [edge2, setEdge2] = useState('');
  const [distance, setDistance] = useState(0);

  useEffect(() => {
  }, [showNodes, showEdges]);

  // Input Change
  function nodeInputChange(e: ChangeEvent<HTMLInputElement>): void {
    setNode(e.target.value.toUpperCase());
  }

  function edge1InputChange(e: ChangeEvent<HTMLInputElement>): void {
    setEdge1(e.target.value.toUpperCase());
  }

  function edge2InputChange(e: ChangeEvent<HTMLInputElement>): void {
    setEdge2(e.target.value.toUpperCase());
  }

  function distanceInputChange(e: ChangeEvent<HTMLInputElement>): void {
    setDistance(parseInt(e.target.value));
  }

  // Add/Remove Data Buttons
  function addNodeData(): void {
    if (node) {
      addNode(node);
      setNode('');
    }
  }

  function addEdgeData(): void {
    if (edge1 && edge2 && distance) {
      if (showNodes.includes(edge1 && edge2)) {
        addEdge(edge1, edge2, distance);
        setEdge1('');
        setEdge2('');
        setDistance(0);
      }
    }
  }

  // From/To & Distance Function
  function showAllEdges(): (string | number)[][][] {
    let edges: (string | number)[][][] = [[], [], []];

    for (let prop in showEdges) {
      showEdges[prop].forEach((vals) => {
        if (vals.distance !== undefined) {
          edges.push([[prop], [vals.place], [vals.distance]])
        }
      });
    }

    return edges;
  }

  return (
    <div className='dataContainer'>

      <div className='stepsContainer'>
        <h2>INSTRUCTIONS</h2>
        <p>1. Use the "testers" buttons to add test data.</p>
        <p>2. Type in Route start/end to find the shortest route + distance.</p>
        <p style={{ textAlign: 'center' }}>-OR-</p>
        <p>1. Add Place Nodes.</p>
        <p>2. Add links.</p>
        <p>3. Type in Route start/end to find the shortest route + distance.</p>
      </div>

      <div className='addPlaceContainer'>
        <h2>Add Place</h2>
        <input
          className='addNodeInput'
          placeholder='Add Place'
          onChange={nodeInputChange}
          value={node}
        />
        <button onClick={addNodeData}>Add Place</button>
        <div style={{ minHeight: '50px', width: '260px', marginTop: '30px', marginBottom: '60px' }}>
          <table>
            <thead>
              <tr>
                <th style={{ fontSize: '16px', fontWeight: 700 }}>Places</th>
              </tr>
            </thead>
            <tbody>
              {
                showNodes.map(nodes => {
                  return <tr key={nodes}><td style={{ fontSize: '13px', fontWeight: 400 }}>{nodes}</td></tr>
                })
              }
            </tbody>
          </table>
        </div>
      </div>

      <div className='addEdgeContainer'>
        <h2>Add Link and Distance</h2>
        <input
          className='addEdgeInput'
          placeholder='Start'
          onChange={edge1InputChange}
          value={edge1}
        />
        <input
          className='addEdgeInput'
          placeholder='End'
          onChange={edge2InputChange}
          value={edge2}
        />
        <input
          className='addEdgeInput'
          type='number'
          onChange={distanceInputChange}
          value={distance}
        />
        <button onClick={addEdgeData}>Add Routes</button>
        <div style={{ minHeight: '50px', width: '500px', marginTop: '30px', marginBottom: '60px' }}>
          <table>
            <thead>
              <tr>
                <th style={{ fontSize: '16px', fontWeight: 700 }}>From</th>
                <th style={{ fontSize: '16px', fontWeight: 700 }}>To</th>
                <th style={{ fontSize: '16px', fontWeight: 700 }}>Distance</th>
              </tr>
            </thead>
            <tbody>
              {
                showAllEdges().map((mapped: (string | number)[][], i: number) => {
                  return (
                    <tr key={i}>
                      {
                        mapped.map((edgeMap: (string | number)[], edgei) => {
                          return <td key={edgei} style={{ fontSize: '13px', fontWeight: 400 }}>{edgeMap}</td>;
                        })
                      }
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AddDataControls;