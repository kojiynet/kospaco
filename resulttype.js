'use strict'

/*

resulttype.js

*/

class PartyResult {

    constructor()
    {

        this.colorstr = "";
        this.xpos = [];
        this.ypos = [];

    }

};

class ResultType {

    constructor()
    {

        this.partyresults = [];

    }

    addResult( partygroup0)
    {

        let nparty = partygroup0.parties.length;

        if ( this.partyresults.length < 1){

            for ( let i = 0; i < nparty; ++i){
                this.partyresults.push( new PartyResult());
                this.partyresults[ i].colorstr = partygroup0.parties[ i].getRGBStr(); 
            }

        }

        for ( let i = 0; i < nparty; ++i){
            this.partyresults[ i].xpos.push( partygroup0.parties[ i].xpos);
            this.partyresults[ i].ypos.push( partygroup0.parties[ i].ypos);
        }

    }

    getNumberOfSteps()
    {
        let nt = 0;
        if ( this.partyresults.length > 0){
            nt = this.partyresults[ 0].xpos.length;
        }
        console.log( nt);
        return nt;
    }

    plot( graphobj0)
    {

        let np = this.partyresults.length;

        for ( let i = 0; i < np; ++i){
            let nt = this.partyresults[ i].xpos.length;
            let colorstr = this.partyresults[ i].colorstr;
            for ( let j = 0; j < nt; ++j){

                let x = this.partyresults[ i].xpos[ j];
                let y = this.partyresults[ i].ypos[ j];

                graphobj0.drawSinglePoint( j + 1, x, 3, colorstr, "");

            }
        }

    }

};


function prepareResultGraph( resultcanvas0, mathx_l0, mathx_u0, xstep0, mathy_l0, mathy_u0, ystep0)
{
  let resultgraphobj0 = new SvgGraphType( resultcanvas0, mathx_l0, mathx_u0, xstep0, mathy_l0, mathy_u0, ystep0);
  resultgraphobj0.setXlabel( "ステップ");
  resultgraphobj0.setYlabel( "位置");
  resultgraphobj0.clear();
  resultgraphobj0.drawBackground();
  return resultgraphobj0; 
}

function prepareResultGraphDefault( resultcanvas0)
{
  let resultgraphobj0 = prepareResultGraph( resultcanvas0, 0, 100, 20, -3, 3, 1);
  return resultgraphobj0; 
}

function prepareResultGraphOfSteps( resultcanvas0, resultobj0)
{
  let nt = resultobj0.getNumberOfSteps(); 
  let resultgraphobj0;
  if ( nt <= 100){
    resultgraphobj0 = prepareResultGraphDefault( resultcanvas0);
  } else {
    resultgraphobj0 = prepareResultGraph( resultcanvas0, 0, nt, nt, -3, 3, 1);
  }
  return resultgraphobj0; 
}

