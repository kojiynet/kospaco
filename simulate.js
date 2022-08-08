'use strict'

/*

simulate.js

kutil.jsが読まれている必要がある。
svggraph.jsが読まれている必要がある。
partystepが定義されている必要がある。

*/


// x方向で近い政党に投票。距離が等しければランダム。
function election()
{

    let nv = votergroup.voters.length;
    let np = partygroup.parties.length;

    for ( let j = 0; j < np; ++j){
        partygroup.parties[ j].prevvote = partygroup.parties[ j].vote;
        partygroup.parties[ j].vote = 0;
    }

    for ( let i = 0; i < nv; ++i){

        let vx = votergroup.voters[ i].xpos;
        let vy = votergroup.voters[ i].ypos;
        let utilvec = [];

        for ( let j = 0; j < np; ++j){

            let px = partygroup.parties[ j].xpos;
            let py = partygroup.parties[ j].ypos;

            // 桁落ち誤差を避けたいので、位置を整数で表現してから距離をとる。
            let util = -1 * Math.abs( Math.floor( vx * 100) - Math.floor( px * 100));

            utilvec.push( util);

        }

        let idx = getIndexOfMaxRandomize( utilvec);
        partygroup.parties[ idx].vote++;
        let rgb = partygroup.parties[ idx].getRGBVec();
        votergroup.voters[ i].setPartyRGBVec( rgb);

    }

}


// 前回より得票が増えていれば、前回動いた方向と同じ方向に移動（または停止し続ける）。
// そうでなければランダム。
function partymoveTrialError()
{

    let np = partygroup.parties.length;
    let spaceLowerBound = -3;
    let spaceUpperBound = 3;

    let prevdirection_isnan = Number.isNaN( partygroup.parties[ 0].prevdirection);
    let prevvote_isnan = Number.isNaN( partygroup.parties[ 0].prevvote);

    if ( prevdirection_isnan == true || prevvote_isnan == true){
        
        for ( let j = 0; j < np; ++j){
            let currentxpos = partygroup.parties[ j].xpos;
            let dire = getDiscreteUniformRandom( -1, 1);
            let newxpos = currentxpos + dire * partystep;
            if ( newxpos < spaceLowerBound || spaceUpperBound < newxpos){
                newxpos = currentxpos;
                dire = 0;
            }
            partygroup.parties[ j].xpos = newxpos;
            partygroup.parties[ j].prevdirection = dire;
        }

    } else {

        for ( let j = 0; j < np; ++j){

            let prevvote = partygroup.parties[ j].prevvote;
            let vote = partygroup.parties[ j].vote;
            let prevdirection = partygroup.parties[ j].prevdirection;
            let currentxpos = partygroup.parties[ j].xpos;
            let dire;

            if ( vote > prevvote){
                dire = prevdirection;
            } else {
                dire = getDiscreteUniformRandom( -1, 1);
            }
            
            let newxpos = currentxpos + dire * partystep;
            if ( newxpos < -3 || 3 < newxpos){
                newxpos = currentxpos;
                dire = 0;
            }

            partygroup.parties[ j].xpos = newxpos;
            partygroup.parties[ j].prevdirection = dire;

        }

    }

}

// ただのランダムな動き
function partymoveRandom()
{

    let np = partygroup.parties.length;
    let spaceLowerBound = -3;
    let spaceUpperBound = 3;

    for ( let j = 0; j < np; ++j){

        let currentxpos = partygroup.parties[ j].xpos;
        let dire;

        dire = getDiscreteUniformRandom( -1, 1);
        
        let newxpos = currentxpos + dire * partystep;
        if ( newxpos < spaceLowerBound || spaceUpperBound < newxpos){
            newxpos = currentxpos;
            dire = 0;
        }

        partygroup.parties[ j].xpos = newxpos;
        partygroup.parties[ j].prevdirection = dire;

    }

}

