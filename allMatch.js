// this file is taking link from mains.js n creating another full link of scorecard n passing it into gifs
const request = require('request');
const cheerio = require('cheerio');
const {gifs} = require("./scorecard");
// const { Module } = require('module');
function getAllMatch(url) {
    request(url , cb);
}
function cb(err , req , body){
    if(err){
        console.log("error" + err);
    }else{
        extractAllMatchLink(body);
    }
}

function extractAllMatchLink(html) {
    let selecTool = cheerio.load(html);
    let scoreCardElemArr = selecTool('a[data-hover="Scorecard"]');
    for (let i = 0; i < scoreCardElemArr.length; i++) {
       let scoreCardLink = selecTool(scoreCardElemArr[i]).attr("href");
        let fulllink = "https://www.espncricinfo.com" + scoreCardLink;
        gifs(fulllink);
        // break;
    }
}
module.exports = {
    getAllMatch : getAllMatch , 
};



