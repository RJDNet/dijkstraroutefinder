import React, { useState, useEffect, useRef } from 'react';
import D3Component from '../../utils/D3Component';

interface ID3CanvasProps {
  showNodes: string[];
  showEdges: { [key: string]: any[] };
}

let vis;

const D3Canvas: React.FC<ID3CanvasProps> = props => {
  const [width] = useState(800);
  const [height] = useState(400);

  const refElement = useRef(null);

  const { showNodes, showEdges } = props;

  useEffect(() => {
    // Check link array contains nodes
    const checker = () => {
      if (showNodes.length === 0) return true;
      let nodeChecker: string[] = [];
      let linkChecker: string[] = [];
      let bool = false;

      showNodes.forEach(place => {
        nodeChecker.push(place);
        nodeChecker.reverse();
      });

      for (let prop in showEdges) {
        showEdges[prop].forEach((vals) => {
          linkChecker.push(vals.node);
        });
      }

      nodeChecker.forEach(vals => {
        const check = linkChecker.includes(vals);
        if (check) {
          bool = true;
        }
      });

      return bool;
    }

    // Check, remove element if found and create new D3 component
    if (checker()) {
      var elem = document.getElementById('node');
      if (elem && elem.parentNode) {
        elem.parentNode.removeChild(elem);
      }

      vis = new D3Component(refElement.current, { showNodes, showEdges, width, height });
    }
  }, [showNodes, showEdges, width, height]);

  return (
    <svg height={height} width={width} ref={refElement} style={{ border: '1px solid lightgray', boxSizing: 'border-box' }} />
  );
}

export default D3Canvas;
