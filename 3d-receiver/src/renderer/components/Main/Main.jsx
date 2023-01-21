import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Main.css';
import Plot from 'react-plotly.js';
import values from '../../mocks/data';

const { ipcRenderer } = window.electron;

const Main = () => {
  // const [data, setData] = useState('');
  const [data, setData] = useState(values[0]);

  const count = useRef(0);
  useLayoutEffect(() => {
    const id = setInterval(() => {
      if (values[count.current]) setData(values[count.current]);
      count.current += 1;
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // ipcRenderer.once('data', (dataFromBack) => setData(dataFromBack));
  // console.log(data.split(' ').length);
  return (
    <div className="main">
      <Plot
        data={[
          {
            type: 'volume',
            flatshading: true,
            lighting: {
              facenormalsepsilon: 0,
            },
            colorbar: {
              autotick: false,
              tick0: 0,
              dtick: 100,
              nticks: 10,
            },
            colorscale: [
              ['0.0', 'rgb(49,54,149)'],
              ['0.111111111111', 'rgb(69,117,180)'],
              ['0.222222222222', 'rgb(116,173,209)'],
              ['0.333333333333', 'rgb(171,217,233)'],
              ['0.444444444444', 'rgb(224,243,248)'],
              ['0.555555555556', 'rgb(254,224,144)'],
              ['0.666666666667', 'rgb(253,174,97)'],
              ['0.777777777778', 'rgb(244,109,67)'],
              ['0.888888888889', 'rgb(215,48,39)'],
              ['1.0', 'rgb(165,0,38)'],
            ],
            reversescale: false,
            opacityscale: [
              [0.0, 0.1],
              [0.2, 0.2],
              [0.35, 0.35],
              [0.5, 0.5],
              [0.65, 0.65],
              [0.8, 0.8],
              [1.0, 1.0],
            ],
            opacity: 1,
            surface: { show: true, fill: 1.0, count: 64 },
            spaceframe: { show: true, fill: 1.0 },
            slices: {
              x: { show: false },
              y: { show: false },
              z: { show: false },
            },
            caps: {
              x: { show: true, fill: 1.0 },
              y: { show: true, fill: 1.0 },
              z: { show: true, fill: 1.0 },
            },
            value: data,
            x: [
              1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2,
              3, 4, 5,

              1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2,
              3, 4, 5,

              1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2,
              3, 4, 5,

              1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2,
              3, 4, 5,
            ],
            y: [
              1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5,
              5, 5, 5,

              1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5,
              5, 5, 5,

              1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5,
              5, 5, 5,

              1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5,
              5, 5, 5,
            ],
            z: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0,

              40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40,
              40, 40, 40, 40, 40, 40, 40, 40, 40,

              80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80,
              80, 80, 80, 80, 80, 80, 80, 80, 80,

              120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120,
              120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120,
            ],
          },
        ]}
        layout={{
          title: {
            text: '',
          },
          // width: 100,
          // height: 1000,
          scene: {
            aspectratio: {
              x: 2.4,
              y: 1.2,
              z: 1.2,
            },
            xaxis: { nticks: 12 },
            yaxis: { nticks: 12 },
            zaxis: { nticks: 12 },
            camera: {
              projection: { type: 'orthographic' },
              eye: {
                x: 0.6,
                y: 2.2,
                z: 0.4,
              },
            },
          },
        }}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
        config={{
          displaylogo: false,
          displayModeBar: false,
          responsive: true,
        }}
      />
    </div>
  );
};

export default Main;
