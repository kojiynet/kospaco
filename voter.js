'use strict'

/*

voter.js

kutil.jsが読まれている必要がある。
svggraph.jsが読まれている必要がある。
spacegraphobjが定義されている必要がある。

*/

class VoterType {

    constructor( x0, y0)
    {
        this.xpos = x0;
        this.ypos = y0;
        this.color_r = 128;
        this.color_g = 128;
        this.color_b = 128;
    }

    // 政党の色を示すRGBのリストを与える。有権者はこれをもとに薄めた色になる。
    setPartyRGBVec( rgbvec0)
    {
        if ( rgbvec0.length != 3){
            return;
        }
        this.color_r = rgbvec0[ 0] * 0.25 + 128;
        this.color_g = rgbvec0[ 1] * 0.25 + 128;
        this.color_b = rgbvec0[ 2] * 0.25 + 128;
    }

    getRGBStr()
    {
        let ret = "rgb(" + String( this.color_r) + "," + String( this.color_g) + "," + String( this.color_b);
        return ret;
    }

};

class VoterGroupType {

    constructor()
    {
        this.voters = []
    }

    createVoters( nvoters0)
    {
        this.voters = []
        for ( let i = 0; i < nvoters0; ++i){

            // 距離計測の際の誤差を避けたいので、-3.00から3.00までの0.01刻みの一様乱数にする。
            let x = getDiscreteUniformRandom( -300, 300) / 100;
            let y = getContinuousUniformRandom( -1, 1);
            let vobj = new VoterType( x, y);
            this.voters.push( vobj);

        }
    }

    plot()
    {
        let n = this.voters.length;
        for ( let i = 0; i < n; ++i){
            let x = this.voters[ i].xpos;
            let y = this.voters[ i].ypos;
            let rgbstr = this.voters[ i].getRGBStr();
            spacegraphobj.drawSinglePoint( x, y, 1, rgbstr, rgbstr);
        }
    }

};

let votergroup = new VoterGroupType();
