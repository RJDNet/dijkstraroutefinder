import React, { useState, useEffect, ChangeEvent } from 'react';

interface IFindPathControlsProps {
  showNodes: string[];
  findPath: Function;
}

const FindPathControls: React.FC<IFindPathControlsProps> = (props): JSX.Element => {
  const { showNodes, findPath } = props;
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [route, setRoute] = useState();
  const [distance, setDistance] = useState(0);

  useEffect(() => {
  }, [showNodes]);

  function startInputChange(e: ChangeEvent<HTMLInputElement>): void {
    setStart(e.target.value.toUpperCase());
  }

  function endInputChange(e: ChangeEvent<HTMLInputElement>): void {
    setEnd(e.target.value.toUpperCase());
  }

  function handleSubmit(): void {
    const { path, times } = findPath(start, end)

    setRoute(path);
    setDistance(times);
  }

  return (
    <div className='pathContainer'>
      <h2>Find Shortest Route</h2>
      <input
        className='startRouteInput'
        placeholder='Route Start'
        onChange={startInputChange}
        value={start}
      />
      <input
        className='endRouteInput'
        placeholder='Route End'
        onChange={endInputChange}
        value={end}
      />
      <h4 className='from' data-testid='from'>From: {start}</h4>
      <h4 className='end' data-testid='end'>To: {end}</h4>
      <h4 className='shortestRoute' data-testid='shortestRoute'>Shortest Route: {route} with a distance of {distance}</h4>
      <button className='routeButton' onClick={handleSubmit}>Find Shortest Route</button>
    </div>
  );
}

export default FindPathControls;