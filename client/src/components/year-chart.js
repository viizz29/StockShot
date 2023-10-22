import React from 'react';

import ChartDrawingPad from '../tools/chart-drawing-pad';

class Stock extends React.Component {
    constructor(props) {
      super(props);
      const params = new URLSearchParams(window.location.search);
      this.stock = params.get('name');
      this.state = {
        error: null,
        isLoaded: false,
        candles: [],
      };
      this.tkn = localStorage.getItem('token');
    }
  
    componentDidMount() {
      if(this.stock == null)
        return;

      this.drawingPad = new ChartDrawingPad('cnvs1', 1900, 805);

      fetch("/api/year-data?instrument="+this.stock, {
        method: 'GET',
        headers: {
          'x-access-token': this.tkn,
        },
      })
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result);  
            this.drawingPad.drawChart(result.candles);
            this.setState({
              isLoaded: true,
              candles: result.candles
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    }
  
    render() {
      return (
        <canvas id="cnvs1" style={{border: '1px solid red', 'background-color': 'black'}}></canvas>
      );
    }
  }
  

export default Stock;