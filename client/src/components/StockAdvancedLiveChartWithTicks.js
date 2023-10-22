import React from 'react';

class DrawingPad{
    constructor(width, height) {
        this.width = width;
        this.height = height;

        let cnvs1 = document.getElementById('cnvs1');        
        let ctx1 = cnvs1.getContext('2d'); 

        let cnvs2 = document.createElement('canvas');
        let ctx2 = cnvs2.getContext('2d', { willReadFrequently: true});        

        this.cnvs1 = cnvs1;
        this.cnvs2 = cnvs2;

        cnvs1.width = width;
        cnvs1.height = height;

        cnvs2.width = cnvs1.width;
        cnvs2.height = cnvs1.height;


        this.ctx1 = ctx1;
        this.ctx2 = ctx2;  
        
        cnvs1.addEventListener('mousemove',(event) => this.mouseMove(event));

        this.lcp = {x: 0, y: 0}; //last cursor position

        this.mouseMovedCallback = null;
    }

    setMouseMovedCallback(callback){
        this.mouseMovedCallback = callback;
    }
    
    mouseMove(event){

        let lcp = this.lcp;
        this.restoreArea(0, lcp.y-5,this.width, lcp.y+5);
        this.restoreArea(lcp.x-5, 0,lcp.x+5, this.height);
        this.restoreArea(lcp.x+20, lcp.y+30, lcp.x+70, lcp.y+45);
        
        let px = event.offsetX;
        let py = event.offsetY;

        this.drawDashedLine(0, py, this.width, py, "red", false);
        this.drawDashedLine(px, 0, px, this.height, "red", false);
        
        

        lcp.x = px;
        lcp.y = py;

        if(this.mouseMovedCallback != null)
        {
            let price = this.mouseMovedCallback(px, py);
            this.drawRect(px+20, py+30, px+70, py+45,"white", false);
            this.drawText(px+25,py+40,Math.round((price + Number.EPSILON) * 100) / 100,"black", false);
        }
    }

    drawLine(x1, y1, x2, y2, color, both=true) {
        let ctx1 = this.ctx1;
        let ctx2 = this.ctx2;
  
        ctx1.strokeStyle = color;
        ctx1.beginPath();
        ctx1.moveTo(x1,y1);
        ctx1.lineTo(x2, y2);
        ctx1.stroke();
  
        if (both)
        {
            ctx2.strokeStyle = color;
            ctx2.beginPath();
            ctx2.moveTo(x1,y1);
            ctx2.lineTo(x2, y2);
            ctx2.stroke();
        }
    }

    drawDashedLine(x1, y1, x2, y2, color, both=true) {
        let ctx1 = this.ctx1;
        let ctx2 = this.ctx2;
  
        ctx1.strokeStyle = color;
        ctx1.beginPath();
        //ctx1.setLineDash([5]); // causes the candle sticks also to use dashed line
        ctx1.moveTo(x1,y1);
        ctx1.lineTo(x2, y2);
        ctx1.stroke();
  
        if (both)
        {
            ctx2.strokeStyle = color;
            ctx2.beginPath();
            ctx2.moveTo(x1,y1);
            ctx2.lineTo(x2, y2);
            ctx2.stroke();
        }
    }
  
    drawRect(x1, y1, x2, y2, color, both=true)
    {
        let ctx1 = this.ctx1;
        let ctx2 = this.ctx2;
        let w = x2-x1;
        let h = y2-y1;
  
        ctx1.fillStyle = color;
        ctx1.fillRect(x1, y1, w, h);
  
        if(both)
        {
            ctx2.fillStyle = color;
            ctx2.fillRect(x1, y1, w, h);
        }
    }
  
    
    
  
    clearRect(x1, y1, x2, y2){
        let w = x2-x1;
        let h = y2-y1;
  
  
        this.ctx1.clearRect(x1, y1, w, h);
        this.ctx2.clearRect(x1, y1, w, h);
    }
  
    
    drawText(x, y, text, color, both=true){
        let ctx1 = this.ctx1;
        ctx1.fillStyle = color;
        ctx1.font = "10px Arial";
        ctx1.fillText(text, x, y);

        if(both)
        {
            let ctx2 = this.ctx2;
            ctx2.fillStyle = color;
            ctx2.font = "10px Arial";
            ctx2.fillText(text, x, y);
        }
    }
  
    
    restoreArea(x1, y1, x2, y2){
        let w = x2- x1;
        let h = y2 - y1;
        let area = this.ctx2.getImageData(x1, y1, w, h);
        this.ctx1.putImageData(area, x1, y1);
    }
    
  }

class CandleChart{
    constructor(drawingPad, xPos, yPos, width, height, beginDrawingWith){
        this.drawingPad = drawingPad;
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.beginDrawingWith = beginDrawingWith;

        this.market_duration = (45 + 60 + 60 + 60 + 60 + 60 + 30) * 60; // seconds
        this.interval = 0;
        this.max_price = 0;
        this.min_price = 0;
        this.price_range = 0; // price range
        this.min_time = 0;
        this.max_volume = 0;
        this.min_volume = 0;
        this.volume_area_height = 100;
        this.y_area = height-this.volume_area_height;
        this.posX = xPos;
        this.posY = yPos + this.y_area;
        this.price_range = this.max_price - this.min_price;
        this.candle_gap = 1;
        this.candle_width = 4; // keep it odd
        this.cwh = Math.ceil(this.candle_width/2); // candle width half
        this.candles = [];
        
        this.volumeBarPosY = yPos + height;

        this.mouseMovedCallback = this.mouseMovedCallback.bind(this);
        drawingPad.setMouseMovedCallback(this.mouseMovedCallback);        
    }

    time_to_x(t){
        return this.posX + ((t - this.min_time)/this.interval) * (this.candle_width + this.candle_gap);
    }
  
    time_to_index(t){
      return (t - this.min_time)/this.interval;
  }
  
    price_to_y(price){
      let y =  this.posY - ((price - this.min_price) * this.y_area / (this.price_range+1));
      return y
    }
  
    pixel_to_price(p){
        return p;
    }

    mouseMovedCallback(x, y){
        let price =  ((this.posY - y) * (this.price_range+1))/this.y_area + this.min_price;
        return price;
    }

    onTick(tick){
        let cs = this.candles;
        let l = cs.length; 
        if(l>0)
        {
            let lc = cs[l-1];

            let x = this.time_to_x(lc[0]);
            let ly1 = this.price_to_y(lc[2]);
            let ly2 = this.price_to_y(lc[3]);
    
            
            let rx1 = x - this.cwh;
            let rx2 = x + this.cwh;

            

            let ltp = tick[1];
            lc[4] = ltp; //close
            if(ltp>lc[2])
                lc[2] = ltp; //high
            else if(ltp<lc[3]) //low
                lc[3] = ltp;

            lc[5] = tick[2];
            
            if(ltp>this.max_price)
            {
                this.max_price = ltp;
                this.redrawChart();
            }
            else if(ltp<this.min_price)
            {
                this.min_price = ltp;
                this.redrawChart();
            }
            else
            {
                this.drawingPad.clearRect(rx1, ly1, rx2, ly2);
                this.drawCandle(lc);
            }
        }
    }
    onCandle(candle){
        this.candles.push(candle);
        if(candle[5]>this.max_volume)
        {
            this.max_volume = candle[5];
            this.redrawChart();
        }
        else
        {
            this.drawCandle(candle);
        }
        
    }

    drawCandle(candle){
        let x = this.time_to_x(candle[0]);
        let ly1 = this.price_to_y(candle[2]);
        let ly2 = this.price_to_y(candle[3]);
  
        
        let rx1 = x - this.cwh;
        let rx2 = x + this.cwh;
        let ry1 = this.price_to_y(candle[1]);
        let ry2 = this.price_to_y(candle[4]);
  
        //console.log({'x': x, 'ly1': ly1, 'ly2': ly2});
        let color = "red";
        if(ry2<ry1)
        {
            color = "green";
            let t = ry1;
            ry1 = ry2;
            ry2 = t;
        }
  
        this.drawingPad.drawLine(x, ly1, x, ly2, color);
        this.drawingPad.drawRect(rx1, ry1, rx2, ry2,color);
  
        if(this.max_volume !== 0)
        {
          let v = this.volume_area_height * candle[5]/this.max_volume;
          this.drawingPad.clearRect(rx1, this.volumeBarPosY-100, rx2, this.volumeBarPosY);
          this.drawingPad.drawRect(rx1, this.volumeBarPosY-v, rx2, this.volumeBarPosY,color);
        }
        
        //let info = {'x': x, 'ly1': ly1, 'ly2': ly2, 'rx1': rx1, 'rx2': rx2, 'ry1': ry1, 'ry2': ry2}
        //candle.push(info);
        
  
    }
  
    redrawChart(){
        this.drawingPad.clearRect(this.xPos, this.yPos, this.xPos + this.width, this.yPos + this.height);
        this.price_range = this.max_price - this.min_price;
        let cndls = this.candles;
        for(let i=this.beginDrawingWith; i<cndls.length;i++)
        {
            this.drawCandle(cndls[i]);
        }
    }

    setData(data){
        this.candles = data.candles;
        this.duration = data.duration;
        this.trades = data.trades;
        this.drawChart();
    }
    drawChart(){
      //console.log(cndls);
      //console.log("Drawing chart ...");
      let mx = 0;
      let mn = Number.MAX_SAFE_INTEGER;
      let mxVol = 0;
      let mnVol = Number.MAX_SAFE_INTEGER;
  
      let duration = this.duration;
      this.interval = duration;
      
      let cndls = this.candles;
      for(let i=this.beginDrawingWith;i<cndls.length;i++)
      {
          let c = cndls[i];
          if(c[2]>mx)
              mx = c[2];
          
          if(c[3]<mn)
              mn = c[3];
  
          if(c[5]>mxVol)
              mxVol = c[5];
          else if(c[5]<mnVol)
              mnVol = c[5];
      }
      this.max_price = mx;
      this.min_price = mn;
      this.max_volume = mxVol;
      this.min_volume = mnVol;
      this.min_time = cndls[this.beginDrawingWith][0];
  
      this.price_range = this.max_price - this.min_price;
  
      for(let i=this.beginDrawingWith; i<cndls.length;i++)
      {
          this.drawCandle(cndls[i]);
      }
  
      let trades = this.trades;
      for(let i=0;i<trades.length;i++)
      {
          let t = trades[i];
          if(t.length === 0)
              break;
          //console.log(trades[i]);
          let x1 = this.time_to_x(t[0]) ;
          let y1 = this.price_to_y(t[1]);
          
          let x2 = this.time_to_x(t[2]) ;
          let y2 = this.price_to_y(t[3]);
          this.drawingPad.drawLine(x1, y1, x2, y2,"yellow");   
          this.drawingPad.drawText(x1- this.candle_width, y1, 'B', 'white');
          this.drawingPad.drawText(x2- this.candle_width, y2, 'S', 'yellow');   
  
      }
  
    }
}



class DemandChart{
    constructor(drawingPad, xPos, yPos, width, height, beginDrawingWith){
        this.drawingPad = drawingPad;
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.beginDrawingWith = beginDrawingWith;

        this.market_duration = (45 + 60 + 60 + 60 + 60 + 60 + 30) * 60; // seconds
        this.interval = 0;
        this.max_price = 0;
        this.min_price = 0;
        this.price_range = 0; // price range
        this.min_time = 0;
        this.max_volume = 0;
        this.min_volume = 0;
        this.y_area = height;
        this.posX = xPos;
        this.posY = yPos + height;
        this.candle_gap = 1;
        this.candle_width = 4; // keep it odd
        this.cwh = Math.ceil(this.candle_width/2); // candle width half
        this.candles = [];
        
        this.volumeBarPosY = yPos + height;
    }

    time_to_x(t){
        return this.posX + ((t - this.min_time)/this.interval) * (this.candle_width + this.candle_gap);
    }
  
    time_to_index(t){
      return (t - this.min_time)/this.interval;
  }
  
    price_to_y(price){
      let y =  this.posY - ((price - this.min_price) * this.y_area / (this.price_range+1));
      return y
    }
  
    pixel_to_price(p){
        return p;
    }


    onTick(tick){
        let cs = this.candles;
        let l = cs.length; 
        if(l>0)
        {
            let lc = cs[l-1];

            let x = this.time_to_x(lc[0]);
            let ly1 = this.price_to_y(lc[7]);
            let ly2 = this.price_to_y(lc[8]);
    
            
            let rx1 = x - this.cwh;
            let rx2 = x + this.cwh;

            

            let ltp = tick[3];
            lc[9] = ltp; //close
            if(ltp>lc[7])
                lc[7] = ltp; //high
            else if(ltp<lc[8]) //low
                lc[8] = ltp;
            
            if(ltp>this.max_price)
            {
                this.max_price = ltp;
                this.redrawChart();
            }
            else if(ltp<this.min_price)
            {
                this.min_price = ltp;
                this.redrawChart();
            }
            else
            {
                this.drawingPad.clearRect(rx1, ly1, rx2, ly2);
                this.drawCandle(lc);
            }
        }
    }
    
    onCandle(candle){
        this.drawCandle(candle);
    }


    drawCandle(candle){
        let x = this.time_to_x(candle[0]);
        let ly1 = this.price_to_y(candle[7]);
        let ly2 = this.price_to_y(candle[8]);
  
        
        let rx1 = x - this.cwh;
        let rx2 = x + this.cwh;
        let ry1 = this.price_to_y(candle[6]);
        let ry2 = this.price_to_y(candle[9]);
  
        //console.log({'x': x, 'ly1': ly1, 'ly2': ly2});
        let color = "red";
        if(ry2<ry1)
        {
            color = "green";
            let t = ry1;
            ry1 = ry2;
            ry2 = t;
        }
  
        this.drawingPad.drawLine(x, ly1, x, ly2, color);
        this.drawingPad.drawRect(rx1, ry1, rx2, ry2,color);
  
        if(this.max_volume !== 0)
        {
          let v = 100 * candle[5]/this.max_volume;
          this.drawingPad.drawRect(rx1, this.volumeBarPosY-v, rx2, this.volumeBarPosY,color);
        }
        
        //let info = {'x': x, 'ly1': ly1, 'ly2': ly2, 'rx1': rx1, 'rx2': rx2, 'ry1': ry1, 'ry2': ry2}
        //candle.push(info);
        
  
    }
  
    redrawChart(){
        this.drawingPad.clearRect(this.xPos, this.yPos, this.xPos + this.width, this.yPos + this.height);
        this.price_range = this.max_price - this.min_price;
        let cndls = this.candles;
        for(let i=this.beginDrawingWith; i<cndls.length;i++)
        {
            this.drawCandle(cndls[i]);
        }
    }

    setData(data){
        this.candles = data.candles;
        this.duration = data.duration;
        this.trades = data.trades;
        this.drawChart();
    }
    drawChart(){
      let mx = 0;
      let mn = Number.MAX_SAFE_INTEGER;
      
      let duration = this.duration;
      this.interval = duration;
      
      let cndls = this.candles;
      for(let i=this.beginDrawingWith;i<cndls.length;i++)
      {
          let c = cndls[i];
          if(c[7]>mx)
              mx = c[7];
          if(c[8]<mn)
              mn = c[8];
        }
      this.max_price = mx;
      this.min_price = mn;
      this.min_time = cndls[this.beginDrawingWith][0];
  
      this.price_range = this.max_price - this.min_price;
  
      for(let i=this.beginDrawingWith; i<cndls.length;i++)
      {
          this.drawCandle(cndls[i]);
      }
      
    }
}


class SupplyChart{
    constructor(drawingPad, xPos, yPos, width, height, beginDrawingWith){
        this.drawingPad = drawingPad;
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.beginDrawingWith = beginDrawingWith;

        this.market_duration = (45 + 60 + 60 + 60 + 60 + 60 + 30) * 60; // seconds
        this.interval = 0;
        this.max_price = 0;
        this.min_price = 0;
        this.price_range = 0; // price range
        this.min_time = 0;
        this.max_volume = 0;
        this.min_volume = 0;
        this.y_area = height;
        this.posX = xPos;
        this.posY = yPos;
        this.candle_gap = 1;
        this.candle_width = 4; // keep it odd
        this.cwh = Math.ceil(this.candle_width/2); // candle width half
        this.candles = [];
    }

    time_to_x(t){
        return this.posX + ((t - this.min_time)/this.interval) * (this.candle_width + this.candle_gap);
    }
  
    time_to_index(t){
      return (t - this.min_time)/this.interval;
  }
  
    price_to_y(price){
        //console.log(price + " " + this.min_price);
      let y =  this.posY + ((price - this.min_price) * this.y_area / (this.price_range+1));
      return y
    }
  
    pixel_to_price(p){
        return p;
    }


    onTick(tick){
        let cs = this.candles;
        let l = cs.length; 
        if(l>0)
        {
            let lc = cs[l-1];

            let x = this.time_to_x(lc[0]);
            let ly1 = this.price_to_y(lc[11]);
            let ly2 = this.price_to_y(lc[12]);
    
            
            let rx1 = x - this.cwh;
            let rx2 = x + this.cwh;

            

            let ltp = tick[4];
            lc[13] = ltp; //close
            if(ltp>lc[11])
                lc[11] = ltp; //high
            else if(ltp<lc[12]) //low
                lc[12] = ltp;
            
            if(ltp>this.max_price)
            {
                this.max_price = ltp;
                this.redrawChart();
            }
            else if(ltp<this.min_price)
            {
                this.min_price = ltp;
                this.redrawChart();
            }
            else
            {
                this.drawingPad.clearRect(rx1, ly1, rx2, ly2);
                this.drawCandle(lc);
            }
        }
    }
    
    onCandle(candle){
        this.drawCandle(candle);
    }
    

    drawCandle(candle){
        let x = this.time_to_x(candle[0]);
        let ly1 = this.price_to_y(candle[11]);
        let ly2 = this.price_to_y(candle[12]);
  
        
        let rx1 = x - this.cwh;
        let rx2 = x + this.cwh;
        let ry1 = this.price_to_y(candle[10]);
        let ry2 = this.price_to_y(candle[13]);
  
        //console.log({'x': x, 'ly1': ly1, 'ly2': ly2});
        let color = "red";
        if(ry2<ry1)
        {
            color = "green";
            let t = ry1;
            ry1 = ry2;
            ry2 = t;
        }
  
        this.drawingPad.drawLine(x, ly1, x, ly2, color);
        this.drawingPad.drawRect(rx1, ry1, rx2, ry2,color);
  
        //let info = {'x': x, 'ly1': ly1, 'ly2': ly2, 'rx1': rx1, 'rx2': rx2, 'ry1': ry1, 'ry2': ry2}
        //candle.push(info);
        
  
    }

    redrawChart(){
        this.drawingPad.clearRect(this.xPos, this.yPos, this.xPos + this.width, this.yPos + this.height+1);
        this.price_range = this.max_price - this.min_price;
        let cndls = this.candles;
        for(let i=this.beginDrawingWith; i<cndls.length;i++)
        {
            this.drawCandle(cndls[i]);
        }
    }

    setData(data){
        this.candles = data.candles;
        this.duration = data.duration;
        this.trades = data.trades;
        this.drawChart();
    }
    drawChart(){
      let mx = 0;
      let mn = Number.MAX_SAFE_INTEGER;
      
      let duration = this.duration;
      this.interval = duration;
      
      let cndls = this.candles;
      for(let i=this.beginDrawingWith;i<cndls.length;i++)
      {
          let c = cndls[i];
          if(c[11]>mx)
              mx = c[11];
          
            if(c[12]<mn)
              mn = c[12];
        }
      this.max_price = mx;
      this.min_price = mn;

      this.min_time = cndls[this.beginDrawingWith][0];
  
      this.price_range = this.max_price - this.min_price;
    
      for(let i=this.beginDrawingWith; i<cndls.length;i++)
      {
        //console.log(cndls[i]);
          this.drawCandle(cndls[i]);
          
      } 
    }
}


class CurrentTrade extends React.Component {
      render() {
        const {trade, toBeSoldAt} = this.props;
        const pts = Math.round((toBeSoldAt - trade[1] + Number.EPSILON) * 100) / 100;;
        const amount = Math.round((pts * 15 - 60 + Number.EPSILON) * 100) / 100;
        return (
          <div style={{display: 'inline-block'}}>
            
            
            <span style={{backgroundColor: amount<0?"red":"green", padding: "5px", borderRadius: "5px", marginLeft: "10px"}}>Bought At: {trade[1]} Last Price: {toBeSoldAt} Points: {pts} Amount: {amount} Sold At: {trade[3]}</span>
            
          </div>
        );
      
      }
}

class StockAdvancedLiveChartWithTicks extends React.Component {
    constructor(props) {
      super(props);
      const params = new URLSearchParams(window.location.search);
      this.fytoken = params.get('fytoken');
      this.beginDrawingWith = params.get('beginwith');
      if(this.beginDrawingWith == null)
        this.beginDrawingWith = 0;
      this.ws = null;
      this.prev_tick = [0,0,0,0,0];
      this.state = {
        error: null,
        isLoaded: false,
        symbol: "",
        tick: [0,0,0,0,0],
        lastTrade: [-1,-1,-1,-1],
        toBeSoldAt: 0,
        trades:[],
      };

      this.handleBuy = this.handleBuy.bind(this);
      this.handleSell = this.handleSell.bind(this);
      this.openCEOptionPage = this.openCEOptionPage.bind(this);
      this.openPEOptionPage = this.openPEOptionPage.bind(this);
      this.candles = [];

      this.beep = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");

      this.alertSound = new Audio("/sounds/success-fanfare-trumpets-6185.mp3");
    }
  
    componentDidMount() {
      this.drawingPad = new DrawingPad(1900, 1000);
      this.supplyChart = new SupplyChart(this.drawingPad, 10, 0, 1800, 300, this.beginDrawingWith);
      this.priceChart = new CandleChart(this.drawingPad, 10, 310, 1800, 380, this.beginDrawingWith);
      this.demandChart = new DemandChart(this.drawingPad, 10, 700, 1800, 300, this.beginDrawingWith);
      
      fetch("/api/live/stock-trading/advanced/instrument?fytoken="+this.fytoken)
        .then(res => res.json())
        .then(
          (data) => {
            //console.log(data);
            if(data.hasOwnProperty("candles")){
                //console.log(data);
                this.candles = data.candles;
                document.title = data.symbol;
                this.priceChart.setData(data);
                this.demandChart.setData(data);
                this.supplyChart.setData(data);

                this.setState({
                isLoaded: true,
                symbol: data.symbol
                });

                this.ws = new WebSocket("ws://trader1.theworkpc.com:8776/");
                this.ws.addEventListener("message",(event) => this.onmessage(event));
                this.ws.addEventListener("open", () =>{
                    //console.log("We are connected");
                    setTimeout(() => this.subscribe(),1000);   
                    
                });
                
            }
                
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )

        
        
    }

    onmessage(event){
        //console.log(event.data);
        let data  = JSON.parse(event.data);
        if(data.hasOwnProperty("tick"))
        {
            let tick = data.tick;
            this.priceChart.onTick(tick);
            this.demandChart.onTick(tick);
            this.supplyChart.onTick(tick);
            
            this.setState({
                tick: tick,
            });

            if(this.state.lastTrade[3] === 0)
            {
                this.setState({
                    toBeSoldAt: tick[1],
                });
            }


            this.prev_tick = this.state.tick;
              

            
        }
        else if(data.hasOwnProperty("candle"))
        {
            //if price candle, demand candle ans supply candle all are pointing in one direction then alert me
            if(this.candles.length>5)
            {
                let candles = this.candles;
                let len = candles.length;
                let lc = candles[len-1];
                if(lc[1]<lc[4] && lc[6]<lc[9] && lc[10]>lc[13]) // the candles are green
                {
                    // check if the current or the previous price candle made a distuinguishable low
                    let low = Math.min(lc[3], candles[len-2][3]);
                    let found = false;
                    for(let i=len-3;i>len-6;i--)
                    {
                        if(candles[i][3]<low)
                        {
                            found=true;
                            break;
                        }
                    }
                    if(!found)
                        this.makeAlertSound();
                }
                else if(lc[1]>lc[4] && lc[6]>lc[9] && lc[10]<lc[13]) // the candles are red
                {
                    // check if the current or the previous price candle made a distinguishable high 
                    let high = Math.max(lc[2], candles[len-2][2]);
                    let found = false;
                    for(let i=len-2;i>len-5;i--)
                    {
                        if(candles[i][2]>high)
                        {
                            found=true;
                            break;
                        }
                    }
                    if(!found)
                        this.makeAlertSound();
                }
            }
            
            
            this.priceChart.onCandle(data.candle);
            this.demandChart.onCandle(data.candle);
            this.supplyChart.onCandle(data.candle);
        }
        else if(data.hasOwnProperty("trade"))
        {
            let trade = data.trade;
            if(trade[3] === 0) // selling price is zero, so it is a live trade
            {
                console.log("A trade is live!");
                this.setState({
                    lastTrade: trade,
                    toBeSoldAt: 0,
                });
            }
            else
            {
                // last trade is finished!
                console.log("Last trade: " + trade);
                this.setState({
                    lastTrade: trade
                });
            }
        }
    }

    subscribe(){
        this.ws.send('C' + this.fytoken);
    }

    log(data)
    {
        console.log("ws: " + data);
    }

    handleBuy(){
        console.log("Buy Requested!");
        this.ws.send('B' + this.fytoken);
    }

    handleSell(){
        console.log("Sell requested!");
        this.ws.send('S' + this.fytoken);
    }


    makeBeep() {
        this.beep.play();
    }
    makeAlertSound(){
        this.alertSound.play();
    }

    openCEOptionPage(){
        fetch("/api/advanced/live/banknifty-trading/at-the-money-options")
        .then(res => res.json())
        .then(
          (data) => {
            let url = "/live/advanced-chart-with-ticks?fytoken=" + data.CE;
            window.open(url, '_blank');
          }
        )
    }

    openPEOptionPage(){
        fetch("/api/advanced/live/banknifty-trading/at-the-money-options")
        .then(res => res.json())
        .then(
          (data) => {
            let url = "/live/advanced-chart-with-ticks?fytoken=" + data.PE;
            window.open(url, '_blank');
          }
        )
    }

    render() {
        const { symbol, tick, lastTrade, toBeSoldAt} = this.state;
        let prev_tick = this.prev_tick;
        const is_nifty_bank = (symbol === "NSE:NIFTYBANK-INDEX");
        return (
            <div>
                <div style={{backgroundColor: 'cyan', padding: '10px'}}>
                    <div style={{display: 'inline-block', backgroundColor: 'yellow', padding: '5px', borderRadius: "5px", marginLeft: "10px"}}>{symbol}</div>

                    
                    
                    <div style={{display: is_nifty_bank? 'none':'inline-block', backgroundColor: 'orange', padding: '5px', borderRadius: "5px", marginLeft: "10px"}}>
                        <CurrentTrade trade={lastTrade} toBeSoldAt={toBeSoldAt}/>
                        <button style={{marginLeft: "10px", fontSize: "20px"}} onClick={this.handleBuy}>Buy</button>
                        <button style={{marginLeft: "10px", fontSize: "20px"}} onClick={this.handleSell}>Sell</button>
                    </div>
                    
                    <div style={{display: is_nifty_bank ? 'inline-block' : 'none', backgroundColor: 'orange', padding: '5px', borderRadius: "5px", marginLeft: "10px"}}>
                        <button style={{marginLeft: "10px", fontSize: "20px"}} onClick={this.openCEOptionPage}>OPEN CE OPTION</button>
                        <button style={{marginLeft: "10px", fontSize: "20px"}} onClick={this.openPEOptionPage}>OPEN PE OPTION</button>
                    </div>
                </div>
                <div>
                    <span style={{margin: '10px', backgroundColor: tick[1] < prev_tick[1] ? "red": "green"}}>P: {tick[1]} </span>
                    <span style={{margin: '10px', backgroundColor: tick[2] < prev_tick[2] ? "red": "green"}}>V: {tick[2]}</span>
                    <span style={{margin: '10px', backgroundColor: tick[3] < prev_tick[3] ? "red": "green"}}>D: {tick[3]}</span>
                    <span style={{margin: '10px', backgroundColor: tick[4] < prev_tick[4] ? "red": "green"}}>S: {tick[4]}</span>
                </div>
                <canvas id="cnvs1" style={{border: '1px solid red', backgroundColor: 'black'}}></canvas>
            </div>
        );
    }
  }
  

export default StockAdvancedLiveChartWithTicks;