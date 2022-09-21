'use strict'

/*

svggraph.js

クラスだけを定義する。
インスタンスはつくらない。

*/

// Canvas Point Transformer
class CanvTrans {

    // グラフ内の理論座標をmath、HTMLでの座標をscreenとする。
  
    constructor( scx1, scy1, scx2, scy2, mx1, my1, mx2, my2)
    {
  
      this.screenx1 = scx1; // screenでの左上の点
      this.screeny1 = scy1; // screenでの左上の点
      this.screenx2 = scx2; // screenでの右下の点
      this.screeny2 = scy2; // screenでの右下の点
      this.screenw = this.screenx2 - this.screenx1;
      this.screenh = this.screeny2 - this.screeny1;
  
      this.mathx1 = mx1; // mathでの左下の点
      this.mathy1 = my1; // mathでの左下の点
      this.mathx2 = mx2; // mathでの右上の点
      this.mathy2 = my2; // mathでの右上の点
      this.mathw = this.mathx2 - this.mathx1;
      this.mathh = this.mathy2 - this.mathy1;
  
      this.xTransRate = this.screenw / this.mathw; // x座標のmathでの間隔1がscreenでのいくつか
      this.yTransRate = this.screenh / this.mathh; // y座標のmathでの間隔1がscreenでのいくつか
  
    }
  
    // Mathのx座標をScreenの値に変換する。
    xMathToScreen( mX)
    {
        let retx = this.screenx1 + ( mX - this.mathx1) * this.xTransRate;
        return retx;
    }
  
    // Mathのy座標をScreenの値に変換する。
    yMathToScreen( mY)
    {
        let rety = this.screeny1 + ( this.mathy2 - mY) * this.yTransRate;
        return rety;
    }
  
    // Mathの(x,y)座標をScreenの値に変換する。
    // リストで返す。
    mathToScreen( mX, mY)
    {
      return [ xMathToScreen( mX), yMathToScreen( mY)];
    }
  
};

// SVG Graph-drawing class
class SvgGraphType {

    // svgcanv0は描画対象のSVGタグの要素
    constructor( svgcanv0, mathx_l, mathx_u, xstep, mathy_l, mathy_u, ystep)
    {

        this.canvasobj = svgcanv0;

        this.canvasW = this.canvasobj.getAttribute( "width");
        this.canvasH = this.canvasobj.getAttribute( "height");

        this.screenx1 = 40; // canvasのうち、左側40は余白
        this.screeny1 = 20; // canvasのうち、上側20は余白
        this.screenx2 = this.canvasW - 20; // canvasのうち、右側20は余白
        this.screeny2 = this.canvasH - 40; // canvasのうち、下側40は余白

        // 理論座標系のx範囲
        this.mathx1 = mathx_l;
        this.mathx2 = mathx_u;

        // 理論座標系のy範囲
        this.mathy1 = mathy_l;
        this.mathy2 = mathy_u;

        // x方向とy方向の目盛の間隔
        this.xstep = xstep;
        this.ystep = ystep;

        this.ct = new CanvTrans(
            this.screenx1, this.screeny1, this.screenx2, this.screeny2,
            this.mathx1, this.mathy1, this.mathx2, this.mathy2
        );

        this.xlabel = "";
        this.ylabel = "";
  
    }

    setXlabel( l0)
    {
        this.xlabel = l0;
    }
  
    setYlabel( l0)
    {
        this.ylabel = l0;
    }
  
    clear()
    {
        while ( this.canvasobj.firstChild != null) {
            this.canvasobj.removeChild( this.canvasobj.firstChild);
        }
    }

    drawBackground()
    {

        let canvasW = this.canvasW;
        let canvasH = this.canvasH;
        let screenx1 = this.screenx1;
        let screeny1 = this.screeny1;
        let screenx2 = this.screenx2;
        let screeny2 = this.screeny2;
        let mathx1 = this.mathx1;
        let mathy1 = this.mathy1;
        let mathx2 = this.mathx2;
        let mathy2 = this.mathy2;
        let xstep = this.xstep;
        let ystep = this.ystep;
        let ct = this.ct;

        // グラフ領域を白に
        {
            let rectobj = document.createElementNS( "http://www.w3.org/2000/svg", "rect");
            rectobj.setAttribute( "x", String( screenx1));
            rectobj.setAttribute( "y", String( screeny1));
            rectobj.setAttribute( "width", String( screenx2 - screenx1));
            rectobj.setAttribute( "height", String( screeny2 - screeny1));
            rectobj.setAttribute( "fill", "white");
            rectobj.setAttribute( "stroke", "white");
            this.canvasobj.appendChild( rectobj);
        }

        // x軸タイトル追加
        {
            let textobj = document.createElementNS( "http://www.w3.org/2000/svg", "text");
            textobj.setAttribute( "x", String( canvasW / 2));
            textobj.setAttribute( "y", String( canvasH - 5));
            textobj.setAttribute( "fill", "black");
            textobj.setAttribute( "font-family", "Arial,san-serif");
            textobj.setAttribute( "font-size", "15");
            textobj.setAttribute( "text-anchor", "middle");
            textobj.setAttribute( "dominant-baseline", "alphabetic");
            textobj.textContent = this.xlabel;
            this.canvasobj.appendChild( textobj);
        }

        // x軸追加
        {
            let lineobj = document.createElementNS( "http://www.w3.org/2000/svg", "line");
            lineobj.setAttributeNS( null, "x1", String( screenx1));
            lineobj.setAttributeNS( null, "y1", String( screeny2));
            lineobj.setAttributeNS( null, "x2", String( screenx2));
            lineobj.setAttributeNS( null, "y2", String( screeny2));
            lineobj.setAttributeNS( null, "stroke", "black");
            this.canvasobj.appendChild( lineobj);
        }

        // x方向の目盛と目盛ラベルの描画
        for ( let x = mathx1; x <= mathx2; x += xstep){
    
            let scx = ct.xMathToScreen( x);

            {
                let lineobj = document.createElementNS( "http://www.w3.org/2000/svg", "line");
                lineobj.setAttributeNS( null, "x1", String( scx));
                lineobj.setAttributeNS( null, "y1", String( screeny1));
                lineobj.setAttributeNS( null, "x2", String( scx));
                lineobj.setAttributeNS( null, "y2", String( screeny2));
                lineobj.setAttributeNS( null, "stroke", "gray");
                this.canvasobj.appendChild( lineobj);
            }

            {
                let lineobj = document.createElementNS( "http://www.w3.org/2000/svg", "line");
                lineobj.setAttributeNS( null, "x1", String( scx));
                lineobj.setAttributeNS( null, "y1", String( screeny2));
                lineobj.setAttributeNS( null, "x2", String( scx));
                lineobj.setAttributeNS( null, "y2", String( screeny2 + 5));
                lineobj.setAttributeNS( null, "stroke", "black");
                this.canvasobj.appendChild( lineobj);
            }

            {
                let textobj = document.createElementNS( "http://www.w3.org/2000/svg", "text");
                textobj.setAttribute( "x", String( scx));
                textobj.setAttribute( "y", String( screeny2 + 5));
                textobj.setAttribute( "fill", "black");
                textobj.setAttribute( "font-family", "Arial,san-serif");
                textobj.setAttribute( "font-size", "15");
                textobj.setAttribute( "text-anchor", "middle");
                textobj.setAttribute( "dominant-baseline", "hanging");
                textobj.textContent = String( x);
                this.canvasobj.appendChild( textobj);
            }
        
        }

        // y軸タイトル追加
        {
            let textobj = document.createElementNS( "http://www.w3.org/2000/svg", "text");
            textobj.setAttribute( "x", String( 5));
            textobj.setAttribute( "y", String( canvasH / 2));
            textobj.setAttribute( "fill", "black");
            textobj.setAttribute( "font-family", "Arial,san-serif");
            textobj.setAttribute( "font-size", "15");
            textobj.setAttribute( "text-anchor", "middle");
            textobj.setAttribute( "dominant-baseline", "hanging");
            textobj.setAttribute( "transform", "rotate( 270 " + String( 5) + " " + String( canvasH / 2) + ")");
            textobj.textContent = this.ylabel;
            this.canvasobj.appendChild( textobj);

        }

        // y軸追加
        {
            let lineobj = document.createElementNS( "http://www.w3.org/2000/svg", "line");
            lineobj.setAttributeNS( null, "x1", String( screenx1));
            lineobj.setAttributeNS( null, "y1", String( screeny1));
            lineobj.setAttributeNS( null, "x2", String( screenx1));
            lineobj.setAttributeNS( null, "y2", String( screeny2));
            lineobj.setAttributeNS( null, "stroke", "black");
            this.canvasobj.appendChild( lineobj);
        }

        // y方向の目盛と目盛ラベルの描画
        for ( let y = mathy1; y <= mathy2; y += ystep){
    
            let scy = ct.yMathToScreen( y);

            {
                let lineobj = document.createElementNS( "http://www.w3.org/2000/svg", "line");
                lineobj.setAttributeNS( null, "x1", String( screenx1));
                lineobj.setAttributeNS( null, "y1", String( scy));
                lineobj.setAttributeNS( null, "x2", String( screenx2));
                lineobj.setAttributeNS( null, "y2", String( scy));
                lineobj.setAttributeNS( null, "stroke", "gray");
                this.canvasobj.appendChild( lineobj);
            }

            {
                let lineobj = document.createElementNS( "http://www.w3.org/2000/svg", "line");
                lineobj.setAttributeNS( null, "x1", String( screenx1));
                lineobj.setAttributeNS( null, "y1", String( scy));
                lineobj.setAttributeNS( null, "x2", String( screenx1 - 5));
                lineobj.setAttributeNS( null, "y2", String( scy));
                lineobj.setAttributeNS( null, "stroke", "black");
                this.canvasobj.appendChild( lineobj);
            }

            {
                let textobj = document.createElementNS( "http://www.w3.org/2000/svg", "text");
                textobj.setAttribute( "x", String( screenx1 - 5));
                textobj.setAttribute( "y", String( scy));
                textobj.setAttribute( "fill", "black");
                textobj.setAttribute( "font-family", "Arial,san-serif");
                textobj.setAttribute( "font-size", "15");
                textobj.setAttribute( "text-anchor", "middle");
                textobj.setAttribute( "dominant-baseline", "alphabetic");
                textobj.setAttribute( "transform", "rotate( 270 " + String( screenx1 - 5) + " " + String( scy) + ")");
                textobj.textContent = String( y);
                this.canvasobj.appendChild( textobj);
            }
        
        }
  
    }

    // 1つだけデータ点を描画
    // rは半径で、理論座標ではなくスクリーン座標の単位で指定する。
    drawSinglePoint( mx, my, r, colorstr)
    {

        let x = this.ct.xMathToScreen( mx); 
        let y = this.ct.yMathToScreen( my);

        {
            let circleobj = document.createElementNS( "http://www.w3.org/2000/svg", "circle");
            circleobj.setAttributeNS( null, "cx", String( x));
            circleobj.setAttributeNS( null, "cy", String( y));
            circleobj.setAttributeNS( null, "r", String( r));
            circleobj.setAttributeNS( null, "fill", colorstr);
            circleobj.setAttributeNS( null, "stroke", colorstr);
            this.canvasobj.appendChild( circleobj);
        }

    }

};



/*
// Graph-drawing Class
class GraphType {

  // データ点をすべて描画
  // 最後の点の色をcolorstrLastで指定する。
  // それ以外の点の色をcolorstrで指定する。
  drawSamplePoints( colorstr = "blue", colorstrLast = "red")
  {

    let npoints = resultVec.length;
    let npointsMinus1 = npoints - 1;

    for ( let i = 0; i < npointsMinus1; ++i){

      let ss = resultVec[ i].ssize;
      let sm = resultVec[ i].smean;
      this.drawSinglePoint( ss, sm, colorstr); 

    }

    let ss = resultVec[ npointsMinus1].ssize;
    let sm = resultVec[ npointsMinus1].smean;
    this.drawSinglePoint( ss, sm, colorstrLast); 

  }

  // グラフをクリアして再描画する。
  redrawGraph()
  {

    this.clear();
    this.drawBackground();
    this.drawSamplePoints();

  }

};

*/
