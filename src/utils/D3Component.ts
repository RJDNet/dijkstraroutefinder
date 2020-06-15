import * as d3 from 'd3';

interface ID3ComponentProps {
  showNodes: string[];
  showEdges: { [key: string]: any[] };
  width: number;
  height: number;
}

interface INodeDatum {
  place: string;
  x?: number;
  y?: number;
}

interface ILinkDatum {
  source: string;
  target: string;
  distance: number;
}

interface IDrag {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface ID3Selection extends d3.Selection<any, any, SVGElement | HTMLElement, {}> { }

interface ID3Simulation extends d3.Simulation<INodeDatum, ILinkDatum> { }

class D3Component {
  // Canvas
  svg?: ID3Selection;
  // D3 Simulation
  simulation: ID3Simulation;
  // Elements
  node?: ID3Selection;
  link?: ID3Selection;
  // Labels
  ntext?: ID3Selection;
  ltext?: ID3Selection;
  infoText?: ID3Selection
  // Data Structures
  noders: INodeDatum[];
  linkers: ILinkDatum[];
  // Checks for Rendering
  nodeCheck: string[];
  linkCheck: string[];

  constructor(containerEl: string | null, props: ID3ComponentProps) {
    const { showNodes, showEdges, width, height } = props;
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
        this.linkCheck.push(vals.node);

        this.linkers.push({ source: prop, target: vals.node, distance: vals.distance });
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
    if (containerEl && check()) {
      // SVG Container
      this.svg = d3.select(containerEl)
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
        .force('link_force', d3.forceLink(this.linkers).id((d: any) => { return d.place; }))
        .on('tick', this.tickActions);

      // Create Links
      this.link = this.svg.append('svg')
        .attr('class', 'links')
        .selectAll('line')
        .data(this.linkers)
        .enter()
        .append('line')
        .attr('stroke-width', 2);

      // Create Nodes
      this.node = this.svg.append('svg')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(this.noders)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', 'red')

      // Create Places Text
      this.ntext = this.svg.append('svg')
        .attr('class', 'ntexts')
        .selectAll('text')
        .data(this.noders)
        .enter()
        .append('text')
        .text((d: { place: string }) => { return d.place });
    }
  }



  // Drag Functions
  dragStarted = (d: IDrag): void => {
    if (!d3.event.active) this.simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged = (d: IDrag): void => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragEnded = (d: IDrag): void => {
    if (!d3.event.active) this.simulation.alphaTarget(.03).stop();
    d.fx = null;
    d.fy = null;
  }

  // Tick Actions
  tickActions = (): void => {
    if (this.node) {
      this.node
        .attr('cx', function (d: { x: number }): number { return d.x; })
        .attr('cy', function (d: { y: number }) { return d.y; })
        .call(d3.drag()
          .on('start', <T>(d: T) => this.dragStarted(d))
          .on('drag', <T>(d: T) => this.dragged(d))
          .on('end', <T>(d: T) => this.dragEnded(d)));
    }

    if (this.link) {
      this.link
        .attr('x1', function (d: { source: { x: number } }) { return d.source.x; })
        .attr('y1', function (d: { source: { y: number } }) { return d.source.y; })
        .attr('x2', function (d: { target: { x: number } }) { return d.target.x; })
        .attr('y2', function (d: { target: { y: number } }) { return d.target.y; });
    }

    if (this.ntext) {
      this.ntext
        .attr('x', function (d: { x: number }) { return d.x - 25; })
        .attr('y', function (d: { y: number }) { return d.y - 15; })
        .call(d3.drag()
          .on('start', <T>(d: T) => this.dragStarted(d))
          .on('drag', <T>(d: T) => this.dragged(d))
          .on('end', <T>(d: T) => this.dragEnded(d)));
    }
  }

}

export default D3Component;