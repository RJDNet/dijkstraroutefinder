import * as d3 from 'd3';
import { IAdjacencyListObject } from '../components/DataContainer';

export interface ID3ComponentProps {
  current: string | null;
  showNodes: string[];
  showEdges: IAdjacencyListObject;
  findPathResult: string[] | undefined;
  width: number;
  height: number;
}

export interface INodeDatum {
  place: string;
  distance?: number;
  x?: number;
  y?: number;
}

export interface ILinkDatum {
  source: INodeDatum | string;
  target: INodeDatum | string;
  distance: number | undefined;
}

export interface IDrag {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface ID3Selection extends d3.Selection<any, any, SVGElement | HTMLElement, {}> { }

export interface ID3Simulation extends d3.Simulation<INodeDatum, ILinkDatum> { }

type NodeDatum = INodeDatum;

class D3Component {
  // Canvas
  private svg?: ID3Selection;
  // D3 Simulation
  private simulation: ID3Simulation;
  // Elements
  private node?: ID3Selection;
  private link?: ID3Selection;
  // Labels
  private ntext?: ID3Selection;
  // Data Structures
  private noders: INodeDatum[];
  private linkers: ILinkDatum[];
  // Checks for Rendering
  private nodeCheck: string[];
  private linkCheck: string[];

  constructor(props: ID3ComponentProps) {
    const { current, showNodes, showEdges, findPathResult, width, height } = props;

    this.simulation = d3.forceSimulation();
    this.noders = [];
    this.linkers = [];
    this.nodeCheck = [];
    this.linkCheck = [];

    // Nodes
    showNodes.forEach((place) => {
      this.nodeCheck.push(place);
      this.nodeCheck.reverse();

      this.noders.push({ place });
    });

    // Links
    for (let prop in showEdges) {
      showEdges[prop].forEach((vals) => {
        this.linkCheck.push(vals.place);

        const link: { source: string, target: string, distance: number | undefined } = {
          source: prop,
          target: vals.place,
          distance: vals.distance !== undefined ? vals.distance : undefined
        };

        this.linkers.push(link);
      });
    }

    const check = () => {
      let bool = true;

      this.nodeCheck.forEach(vals => {
        const check = this.linkCheck.includes(vals);

        if (!check) {
          bool = false;
        }
      });

      return bool;
    }

    // D3
    if (current && check()) {
      // SVG Container
      this.svg = d3.select(current)
        .append('svg')
        .attr('id', 'node')
        .attr('width', width)
        .attr('height', height);

      // Simulation
      this.simulation
        .nodes(this.noders)
        .force('charge_force', d3.forceManyBody().strength(-600))
        .force('collide_force', d3.forceCollide())
        .force('center_force', d3.forceCenter(width / 2, height / 2))
        .force('link_force', d3.forceLink(this.linkers).id((d: any) => d.place))
        .on('tick', this.tickActions);

      // Create Links
      this.link = this.svg.append('svg')
        .attr('class', 'links')
        .selectAll('line')
        .data(this.linkers)
        .enter()
        .append('line')
        .attr('stroke-width', 6)
        .style('stroke', (node: any) => {
          let sourceIndex: number;
          let source: string = '';
          let target: string = '';

          // To prevent colouring of nodes that are linked
          // but are not part of the shortest path
          if (findPathResult !== undefined) {
            findPathResult.forEach((e: string, i: number) => {
              if (e === node.source.place) {
                sourceIndex = i;
                source = e;
              }

              if (i === sourceIndex + 1) {
                if (e === node.target.place) {
                  target = e;
                }
              }
            });
          }

          if (node.source.place === source && node.target.place === target) {
            return 'red';
          }

          return 'lightgray';
        });

      // Create Nodes
      this.node = this.svg.append('svg')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(this.noders)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', (node: INodeDatum) => {
          if (findPathResult !== undefined) {
            if (findPathResult.includes(node.place)) {
              return 'red'
            };

            return 'black';
          }

          return 'black';
        });

      // Create Places Text
      this.ntext = this.svg.append('svg')
        .attr('class', 'ntexts')
        .selectAll('text')
        .data(this.noders)
        .enter()
        .append('text')
        .text((d: { place: string }) => d.place);
    }
  }

  // Drag Functions
  private dragStarted = (d: IDrag): void => {
    if (!d3.event.active) this.simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged = (d: IDrag): void => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  private dragEnded = (d: IDrag): void => {
    if (!d3.event.active) this.simulation.alphaTarget(.03).stop();
    d.fx = null;
    d.fy = null;
  }

  // Tick Actions
  private tickActions = (): void => {
    if (this.node) {
      this.node
        .attr('cx', (d: { x: number }) => d.x)
        .attr('cy', (d: { y: number }) => d.y)
        .call(d3.drag()
          .on('start', <IDrag>(d: IDrag) => this.dragStarted(d))
          .on('drag', <IDrag>(d: IDrag) => this.dragged(d))
          .on('end', <IDrag>(d: IDrag) => this.dragEnded(d)));
    }

    if (this.link) {
      this.link
        .attr('x1', (d: { source: { x: number } }) => d.source.x)
        .attr('y1', (d: { source: { y: number } }) => d.source.y)
        .attr('x2', (d: { target: { x: number } }) => d.target.x)
        .attr('y2', (d: { target: { y: number } }) => d.target.y);
    }

    if (this.ntext) {
      this.ntext
        .attr('x', (d: { x: number }) => d.x - 25)
        .attr('y', (d: { y: number }) => d.y - 15)
        .call(d3.drag()
          .on('start', <IDrag>(d: IDrag) => this.dragStarted(d))
          .on('drag', <IDrag>(d: IDrag) => this.dragged(d))
          .on('end', <IDrag>(d: IDrag) => this.dragEnded(d)));
    }
  }
}

export default D3Component;