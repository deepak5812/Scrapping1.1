let minimist=require("minimist");
let axios=require("axios");
let jsdom=require("jsdom");
let fs = require("fs");
let args=minimist(process.argv);
// node dsdif.js --fileName="wcup19.json" --urlName="https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results"
let promiseOfaxios=axios.get(args.urlName);
let matches=[];
promiseOfaxios.then(function(response){
    let htmlpage=response.data;
    let dom=new jsdom.JSDOM(htmlpage);
    let document=dom.window.document;
    let matchesInfo=document.querySelectorAll("div.match-score-block");
    console.log(matchesInfo.length);
    console.log(__dirname);
    
    for(let i=0;i<matchesInfo.length;i++){
        let match={

        };
        let matchesName=matchesInfo[i].querySelectorAll("div.team > div.name-detail > p.name");
        match.teamOnename=matchesName[0].textContent;
        match.teamTwoname=matchesName[1].textContent;
        let matchesScore=matchesInfo[i].querySelectorAll("div.team > div.score-detail > span.score");
        
        if(matchesScore.length==2){
            match.teamOneScore=matchesScore[0].textContent;
            match.teamTwoScore=matchesScore[1].textContent;
        }else if(matchesScore.length==1){
            match.teamOneScore=matchesScore[0].textContent;
            match.teamTwoScore=" - ";
        }else{
            match.teamOneScore=" - ";
            match.teamTwoScore=" - ";
        }
        
        let results=matchesInfo[i].querySelector("div.status-text");
        match.result=results.textContent;
        matches.push(match);
        
    }
    let myJSON=JSON.stringify(matches);
     fs.writeFile(args.fileName,myJSON,function(err,data){
         if(err){
             console.log(err);
         }else {
             console.log("file is Created::::::::::::::::::::");
         }
     })
}
).catch(function(err){
    console.log(err); 
})


