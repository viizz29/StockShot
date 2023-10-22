class ChartDrawingPad{
    constructor(canvasID, width, height) {
        let cnvs1 = document.getElementById(canvasID);
        cnvs1.width = width;
        cnvs1.height = height;
        let ctx1 = cnvs1.getContext('2d');
  
        let cnvs2 = document.createElement('canvas');
        cnvs2.width = cnvs1.width;
        cnvs2.height = cnvs1.height;
        let ctx2 = cnvs2.getContext('2d', { willReadFrequently: true});
        
        this.cnvs1 = cnvs1;
        this.cnvs2 = cnvs2;
        this.ctx1 = ctx1;
        this.ctx2 = ctx2;
  
        this.interval = 60 * 60 * 24;
        this.max_price = 0;
        this.min_price = 0;
        this.window = 0;
        this.min_time = 0;
        this.max_volume = 0;
        this.min_volume = 0;
        this.y_area = 500;
        this.posX = 10;
        this.posY = 500;
        this.window = this.max_price - this.min_price + 50;
        this.candle_gap = 1;
        this.candle_width = 4; // keep it odd
        this.cwh = Math.ceil(this.candle_width/2); // candle width half
        this.candles = [];
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
  
    time_to_x(t){
        return this.posX + ((t - this.min_time)/this.interval) * (this.candle_width + this.candle_gap);
    }
  
    time_to_index(t){
      return (t - this.min_time)/this.interval;
  }
  
    price_to_y(price){
      let y =  this.posY - ((price - this.min_price) * this.y_area / (this.window+1));
      return y
    }
  
    pixel_to_price(p){
        return p;
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
  
        this.drawLine(x, ly1, x, ly2, color);
        this.drawRect(rx1, ry1, rx2, ry2,color);
  
        if(this.max_volume != 0)
        {
          let v = 300 * candle[5]/this.max_volume;
          this.drawRect(rx1, 800-v, rx2, 800,color);
        }
        
        let info = {'x': x, 'ly1': ly1, 'ly2': ly2, 'rx1': rx1, 'rx2': rx2, 'ry1': ry1, 'ry2': ry2}
        candle.push(info);
    }
  
    drawChart(cndls){
      //console.log(cndls);
      console.log("Drawing chart ...");
      let mx = 0;
      let mn = Number.MAX_SAFE_INTEGER;
      let mxVol = 0;
      let mnVol = Number.MAX_SAFE_INTEGER;
      for(let i=0;i<cndls.length;i++)
      {
          let c = cndls[i];
          if(c[2]>mx)
              mx = c[2];
          else if(c[3]<mn)
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
      this.min_time = cndls[0][0];
  
      this.window = this.max_price - this.min_price + 50;
      for(let i=0; i<cndls.length;i++)
      {
          this.drawCandle(cndls[i]);
      }
      this.candles = cndls;
    }
    drawText(x, y, text, color){
        let ctx1 = this.ctx1;
        let ctx2 = this.ctx2;
        
        ctx1.fillStyle = color;
        ctx1.font = "10px Arial";
        ctx1.fillText(text, x, y);
    }
}
  
export default ChartDrawingPad;