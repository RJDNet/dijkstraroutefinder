import React, {
  useEffect,
  useRef,
  CSSProperties
} from 'react';
import D3Component from '../../utils/D3Component';
import { IAdjacencyListObject } from '../DataContainer';

interface ID3CanvasProps {
  showNodes: string[];
  showEdges: IAdjacencyListObject;
  findPathResult: string[] | undefined;
}

const canvasStyles: CSSProperties = {
  border: '1px solid lightgray',
  boxSizing: 'border-box'
};

const width: number = 800;
const height: number = 400;

const D3Canvas: React.FC<ID3CanvasProps> = (props): JSX.Element => {
  const {
    showNodes,
    showEdges,
    findPathResult
  } = props;

  const d3Element = new D3Component();
  const refElement = useRef(null);

  useEffect(() => {
    // Check, remove element if found and create new D3 component
    if (checker(showNodes, showEdges)) {
      var elem = document.getElementById('node');
      if (elem && elem.parentNode) {
        elem.parentNode.removeChild(elem);
      }

      d3Element.init(refElement.current, showNodes, showEdges, findPathResult, width, height);
    }
  }, [d3Element, showNodes, showEdges, findPathResult]);

  return (
    <svg
      ref={refElement}
      height={height}
      width={width}
      style={canvasStyles}
    />
  );
}

// Check link array contains nodes
function checker(showNodes: string[], showEdges: IAdjacencyListObject) {
  if (showNodes.length === 0) return true;

  let nodeChecker: string[] = [];
  let linkChecker: string[] = [];
  let bool = false;

  showNodes.forEach((place: string) => {
    nodeChecker.push(place);
    nodeChecker.reverse();
  });

  for (let prop in showEdges) {
    showEdges[prop].forEach((vals: { place: string }) => {
      linkChecker.push(vals.place);
    });
  }

  nodeChecker.forEach((vals: string) => {
    const check = linkChecker.includes(vals);
    if (check) {
      bool = true;
    }
  });

  return bool;
}

export default D3Canvas;
