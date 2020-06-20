import React, { useState, useEffect, useRef } from 'react';
import D3Component from '../../utils/D3Component';
import { IAdjacencyListObject } from '../DataContainer';

interface ID3CanvasProps {
  showNodes: string[];
  showEdges: IAdjacencyListObject;
  findPathResult: string[] | undefined;
}

const D3Canvas: React.FC<ID3CanvasProps> = (props): JSX.Element => {
  const { showNodes, showEdges, findPathResult } = props;

  const [width] = useState(800);
  const [height] = useState(400);

  const refElement = useRef(null);

  useEffect(() => {
    // Check link array contains nodes
    function checker() {
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

    // Check, remove element if found and create new D3 component
    if (checker()) {
      var elem = document.getElementById('node');
      if (elem && elem.parentNode) {
        elem.parentNode.removeChild(elem);
      }

      const current: string | null = refElement.current;
      new D3Component({ current, showNodes, showEdges, findPathResult, width, height });
    }
  }, [showNodes, showEdges, findPathResult, width, height]);

  return (
    <svg height={height} width={width} ref={refElement} style={{ border: '1px solid lightgray', boxSizing: 'border-box' }} />
  );
}

export default D3Canvas;
