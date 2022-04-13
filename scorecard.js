const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');


function getInfoFromScorecard(url) {
    request(url , cb);
}
function cb(err , res , body) {
    if(err){
        console.log(err);
    }else{
        getMatchDeatils(body);
    }
}

function getMatchDeatils(html) {
    // to get date and venue of the match 
    let selecTool = cheerio.load(html);
    let decs = selecTool(".match-header-info.match-info-MATCH");
    let decsArr = decs.text().split(",");
    let dateOfMatch = decsArr[2];
    let venueOfMatch = decsArr[1];
    console.log(dateOfMatch);
    console.log(venueOfMatch + "\n");
    // team names
    let teamName = selecTool('.name-detail>.name-link');
    let team1 = selecTool(teamName[0]).text();
    let team2 = selecTool(teamName[1]).text();
    console.log(team1);
    console.log("vs");
    console.log(team2 + "\n");
     // team result
    let matchResEle = selecTool(".match-info.match-info-MATCH.match-info-MATCH-half-width>.status-text");
    let matchResult = matchResEle.text()
    console.log(matchResult);


let allBatsmenTable = selecTool(".table.batsman tbody");
//     
// let htmlString = "";
for (let i = 0; i < allBatsmenTable.length; i++) {
    // htmlString = htmlString + selecTool(allBatsmenTable[i]).html();
    //Get the descendants(table rows ) of each element (table )
    let allRows = selecTool(allBatsmenTable[i]).find("tr"); // -> data of batsmen + empty rows 
    
    for (let i = 0; i < allRows.length; i++) {
        
        let row = selecTool(allRows[i])
        // console.log(row);
        let firstColmnofRow = row.find("td")[0];
        if(selecTool(firstColmnofRow).hasClass("batsman-cell")){
            let playerName = selecTool(row.find("td")[0]).text().trim();
            let runs = selecTool(row.find("td")[2]).text();
            let balls = selecTool(row.find("td")[3]).text();
            let numberOf4 = selecTool(row.find("td")[5]).text();
            let numberOf6 = selecTool(row.find("td")[6]).text();
            let sr = selecTool(row.find("td")[7]).text();

            console.log(
                `playerName -> ${playerName} |  runsScored ->  ${runs} |  ballsPlayed ->  ${balls} |  numbOfFours -> ${numberOf4} |  numbOfSixes -> ${numberOf6} |   strikeRate-> ${sr} | `
              );
              processInformation(dateOfMatch,venueOfMatch,team1,team2,
                matchResult,playerName,runs,balls,numberOf4,numberOf6,sr);
        }
    }
    
}
function processInformation(dateOfMatch,venueOfMatch,team1,team2,
    matchResult,playerName,runs,balls,numberOf4,numberOf6,sr){
        let teamNamePath = path.join(__dirname , "IPL" , team1);
        if(!fs.existsSync(teamNamePath)){
            fs.mkdirSync(teamNamePath);
        }
        let playerPath = path.join(teamNamePath , playerName + ".xlsx");
        let content = excelReader(playerPath , playerName);
        
        let playerObj = {
            dateOfMatch,
            venueOfMatch,
            team1,
            team2,
            matchResult,
            playerName,
            runs,
            balls,
            numberOf4,
            numberOf6,
            sr
        };
        content.push(playerObj);


        excelWriter(playerPath , content , playerName);
                
    }
}

  function excelReader(playerPath , sheetName) {
      if(!fs.existsSync(playerPath)){
          return [];
      }
     let workbook = xlsx.readFile(playerPath);
     let excelData = workbook.Sheets[sheetName];
     let playerObj = xlsx.utils.sheet_to_json(excelData);
     return playerObj;
  }
  function excelWriter(playerPath , jsObject , sheetName) {
      let newWorkbook = xlsx.utils.book_new();
      let newWorksheet = xlsx.utils.json_to_sheet(jsObject);
      xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
      xlsx.writeFile(newWorkbook, playerPath);
  }

    module.exports = {
    gifs:getInfoFromScorecard
}