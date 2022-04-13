// In this we made full link of the website we need to visit n pass it to obj of allMatch.js

const fs = require('fs');
const path = require('path');

let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const request = require('request');
const cheerio = require('cheerio');
const allMatchObj = require("./allMatch");
const allMatch = require('./allMatch')

request(url , cb);
function cb(err , res , body) {
    if(err){
        console.log("error" + err);
    }else{
        handleHTML(body);
        
    }
}

let iplPath = path.join(__dirname , "IPL");
if(!fs.existsSync(iplPath)){
    fs.mkdirSync(iplPath);
}


function handleHTML(html) {
    let selecTool = cheerio.load(html);
    let anchorEle = selecTool('a[data-hover = "View All Results"]');
    // console.log(anchorEle);
    let relativeLink = anchorEle.attr("href");
    let fullLink = "https://www.espncricinfo.com" + relativeLink;
    // console.log(fullLink);

    allMatchObj.getAllMatch(fullLink);
}


