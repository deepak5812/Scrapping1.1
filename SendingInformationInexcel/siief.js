//node siief.js --fileName="wcup19.json" --destName="srData.json" --mypdfFolder="maches" --exdel="matchesData.csv"
//https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results

let minimist=require("minimist");
let fs=require("fs");
let excel=require("excel4node");
let args=minimist(process.argv);
let path=require("path");
let pdf=require("pdf-lib");
let teams=[];
let mypath=path.join("Users","deepakmathur","myJavascriptNotes","wCup 2019 scrappinData","extractingInfoFromInternet",args.fileName);

 let data=fs.readFileSync("/"+mypath,"utf-8");
   
    let myFile=JSON.parse(data);
  for(let i=0;i<myFile.length;i++){
      uniqueTeams(teams,myFile[i]);
  }

  for(let i=0;i<myFile.length;i++){
      addingMatches(teams,myFile[i]);
  }
 
let teamInJSON=JSON.stringify(teams);
fs.writeFileSync(args.destName,teamInJSON,"utf-8");
creatingAnExcelFile(teams);
creatingFolder(teams);

 function creatingFolder(teams){
     fs.mkdirSync(args.mypdfFolder);
     for(let i=0;i<teams.length;i++){
         let teamFldName=path.join(args.mypdfFolder,teams[i].name);
         fs.mkdirSync(teamFldName);
         for(let j=0;j<teams[i].matches.length;j++){
             //here path to matchFileName 
            let matchFileName = path.join(teamFldName, teams[i].matches[j].opponent + ".pdf");
            creatingScoreCard(teams[i].name, teams[i].matches[j], matchFileName);
         }
     }

 }

function creatingScoreCard(teamsName,teamMatches,matchFileName){
    let mn1=teamsName;
    let mn2=teamMatches.opponent;
    let sc1= teamMatches.score1;
    let sc2= teamMatches.score2;
    let res= teamMatches.results;
//console.log(mn1+" "+mn2);

    let tempReadInBytes=fs.readFileSync("temp1.pdf");
    let pdfKaPromise=pdf.PDFDocument.load(tempReadInBytes);
    pdfKaPromise.then(function(pdfdoc){
        let page=pdfdoc.getPage(0);
        page.drawText(mn1, {
            x: 100,
            y: 380,
            size: 12
        });
        page.drawText(sc1, {
            x: 220,
            y: 380,
            size: 12
        });
        page.drawText(mn2, {
            x: 320,
            y: 380,
            size: 12
        });
        page.drawText(sc2, {
            x: 420,
            y: 380,
            size: 12
        });
        page.drawText(res, {
            x: 200,
            y: 275,
            size: 12
        });
        let saveKaPromise=pdfdoc.save();
        saveKaPromise.then(function(myFileImp){
            fs.writeFileSync(matchFileName, myFileImp);
        }).catch(function(err){
            console.log(err);
        })

    })
}
 
function  creatingAnExcelFile(teams){
    
    let wb = new excel.Workbook();
    for(let i=0;i<teams.length;i++){
        let sheet = wb.addWorksheet(teams[i].name);
        sheet.cell(1,1).string("TEAM 1");
        sheet.cell(1,2).string("SCORE 1");
        sheet.cell(1,3).string("TEAM 2");
        sheet.cell(1,4).string("SCORE 2");
        sheet.cell(1,5).string("RESULT");
       

        for(let j=0;j<teams[i].matches.length;j++){
            sheet.cell(j+2,1).string(teams[i].matches[j].name);
            sheet.cell(j+2,2).string(teams[i].matches[j].score1);
            sheet.cell(j+2,3).string(teams[i].matches[j].opponent);
            sheet.cell(j+2,4).string(teams[i].matches[j].score2);
            sheet.cell(j+2,5).string(teams[i].matches[j].results);
}
    }
    wb.write(args.exdel);
}
function uniqueTeams(teams,match){
    
  let t1idx=-1;
    for(let i=0;i<teams.length;i++){
        if(teams[i].name==match.teamOnename){
            t1idx=i;
            break;            
        }
    }
    if(t1idx==-1){
        teams.push({
            name:match.teamOnename,
            matches: []
        });
    }
   let t2idx=-1;
    for(let i=0;i<teams.length;i++){
        if(teams[i].name==match.teamOnename){
            t2idx=i;
            break;

        }
        }
        if(t2idx==-1){
            teams.push({
                name:match.teamOnename,
                matches: []
            })
        }
    

}
function addingMatches(teams,match){
    let t1idx=-1;
    for(let i=0;i<teams.length;i++){
        if(teams[i].name==match.teamOnename){
            t1idx=i;
            break;
        }
    }
    teams[t1idx].matches.push({
        name:match.teamOnename,
        score1:match.teamOneScore,
        opponent:match.teamTwoname,
        score2:match.teamTwoScore,
        results:match.result,
    });

    let t2idx=-1;
    for(let i=0;i<teams.length;i++){
        if(teams[i].name==match.teamTwoname){
            t2idx=i;
            break;
        }
    }
    teams[t2idx].matches.push({
        name:match.teamTwoname,
        score1:match.teamTwoScore,
        opponent:match.teamOnename,
        score2:match.teamOneScore,
        results:match.result,
    });
}
