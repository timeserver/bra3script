// ==UserScript==
// @name         SearchWord
// @namespace    http://pok.jp
// @description  Search word from bra3 raid
// @include      http://*.3gokushi.jp/card/event_battle_top.php?filter_damege=*&filter_level=-1&filter_hp=-1&scope=3&battle_id=
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// ==/UserScript==

(function() {
  var SAVE_PREFIX = "SearchWord";
  var SPAN_RELOAD = 35000; //[ms]

  var APPEAR_ID = "npcSearchBtn"

  var min = true;
  var timerID;

  // Common function
  var functionAddGlobalStyle = function (css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
      return
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }

  var functionCreateCheck = function (id, name, value, text, checked) {
    var d = document.createElement("div");
    d.style.padding = "2px";

    var r = document.createElement("input");
    r.type = "checkbox";
    r.id = id;
    r.name = name;
    r.value = value;
    r.checked = checked;

    var l = document.createElement("label");
    l.htmlFor = id;
    var t = document.createTextNode(text);
    l.appendChild(t);

    d.appendChild(r);
    d.appendChild(l);
    return d;
  }

  var functionCreateTextBox = function (id, name, text, size) {
    var d = document.createElement("div");
    d.style.padding = "2px";
    d.style.display = "inline";

    var l = document.createElement("label");
    l.htmlFor = id;
    var t = document.createTextNode(text);
    l.appendChild(t);
 
    var r = document.createElement("input");
    r.type = "text";
    r.id = id;
    r.name = name;
    r.size = size;

    d.appendChild(l);
    d.appendChild(r);
    return d;
  }

  var playSound = function() {
    var sound = "data:audio/wav;base64,UklGRt4lAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YbolAAAAAP8MAhv+KAI3/kQBUwBTAEUAN/8oAhv9DAP//vAA4wHV/8YBuf+qAa//vAHL/9gB5//0AgP+EAIf/iwCO/1IBFf8TgVB+zICJQAXAAkA+wDt/94C0f7CAbX/pgGzAcH9zgPd/eoD+f4GAhX9IgMx/j4BTf9YAUv/PAIv/iAAEwIF/PYF6fzaAs0Av/+wAan/tgDFAdP/4AHv//wBC/8YASf/NAFDAFH+VANH/TgCKwAd/g4CAf/yAOUA1wDJALsArQCtALsAyQHX/eQE8/wABA/9HAErADkAR/9UAlH9QgM1/SYDGf4KAP0B7//gAdP/xAG3/6gBsf++Ac3/2gHp//YABQIT/SADL/08A0v9WANN/T4CMf8iARX+BgL5/uoC3f7OAcEAs/+mArX+wgDRAd8A7QD7AAn/FgEl/zICQf5OAVcASf46Ay39HgMR/gIA9QDnAdn/ygK9/q4AqwG5AMcA1QDjAPH//gIN/hoCKf42AkX+UgFTAEX/NgIp/hoCDf7/AfIA5ADWAMgAugCsAK4AvADKANgA5gD0AAIAEAAeACwAOv9HAVYAUABCADT/JQEY/wkB/ADu/98C0v3DA7b9pwOy/r8Czv7bAur+9wEGABQAIgEw/j0CTP1ZA0z+PQEwACL/EwEGAPj/6QHcAM7/vwKy/qcBtgHE/tEC4P7tAvz+CQIY/yX/MwNC/E8EVv1HAToBLP8dABAAAgH0/uUC2P7JAbwArgCsALoAyADWAOQA8gAAAA4AHAAqADgARgBUAFIARAA2ACgAGgAMAP4A8ADiANQAxgC4AKoAsAC+/8sD2vznBPb8AwQS/B8ELvw7BEr9VwJO/j8BMgAkABb/BwL6/usB3gDQ/sEEtPylBLT8wQPQ/90A7AD6AAgAFgAkADIAQABOAFgBSv07BS77HwQS/QMB9gHo/9kBzP+9ALAAqgG4/8UB1ADi/+8C/v0LAxr9JwM2/kMAUgJU/UUDOP0pAhz/DQIA/fEC5ADW/scEuvurBK79uwPK/dcE5vvyBQH7DgUd/CoDOf5GAVUAUQBDADX/JgEZAAsA/QDv/+AB0wDF/7YBqf+wAr/+zAHb/+gB9/8EARMAIf8uAT0AS/9YAk3+PgExACMAFQAHAPkA6//cAc8AwQCz/6YCtf3CA9H+3gDtAvv9CAMX/iQBMwBB/k4DV/1IBDv9LAAfARH/AgL1/uYB2f/KAb0Ar/+qAbn/xgHVAOMA8f/+AQ3/GgIp/jYBRf9SAVP/RAE3/ygBG/8MAP8B8QDj/9QBx/+4AKsCr/y8Bcv72ATn/fQCAwAR/h4DLf06A0n+VgFP/0ABM/8kARcACf/6Ae3/3gHR/8IBtf+mAbMAwf/OAd3/6gL5/QYEFfwiAzH/Pv9MAln/SgA9AS/+IAIT/gQD9/3oAtv/zAC/ALEBqf62A8X90gLh/+4A/QEL/xgAJwE1/0IBUf9UAUf/OAEr/xwADwEB/vID5fzWBMn8ugSt/awCu//IANcA5QHz/gADD/0cAiv+OAJH/lQCUf5CAjX+JgEZ/wsC/v7vAuL90wPG/rcBqv+vAb7/ywLa/ecD9v0DAxL+HwEuATz+SQJY/k0BQAAyACQAFgAIAPr/6wLe/c8Ewv2zAaYBtP3BBND93QLs/vkCCP0VBCT8MQNA/U0EWPxJAzz9LQIgABIABAD2/ucD2v3LA77+rwCqAbj+xQPU/eED8P39Awz9GQIoADb+QwRS+1MFRvs3BSr7GwUO/P8D8v7jAdYAyAC6AKz/rQK8/skC2P3lA/T+AQEQAB7/KwE6/0cBVgBQAEIANP4lBBj7CQb8+u0F4PzRA8T9tQOo/bEDwP3NA9z96QL4/wUBFP8hATD/PQFM/1kBTP89ATAAIv8TAQYA+P7pA9z9zQPA/bEDqP21AsT/0QDgAe7/+wEK/xcAJgE0/0EBUP9VAEgCOv0rAx79DwMC/vMB5v/XAcoAvP+tAaz/uQHIANb/4wDyAQAADgAc/ykBOP9FAlT/UQBEADYAKAEa/wsB/v7vAuL/0wHG/7cAqgCwAL4BzP/ZAOcA9QADARH+HgIt/joCSf9W/04DQfwyBCX9FgEJAfv/7ADfANEAwwC1Aaf/sgDBAM8A3QDrAPkABwAVACMAMQA/AE0AWQFL/TwFL/ogBhP8BAL3/ugB2wDNAb//sAGp/rYCxf/SAOEC7/38Agv+GAMn/DQFQ/pQBVX+Rv84Ayv9HAIP/wAB8//kAdf/yAC7Aa3/rAC7Acn+1gLl//IAAQEP/hwCK/44Akf+VAJR/kIBNQAn/xgCC/78Ae//4AHTAMUAt/+oAbH/vgHNANv/6AH3/wQAEwEh/y4APQBLAFkATQA/ADEAIwAVAAcA+QDrAN0AzwHB/rIDp/20AcMB0f/eAO0B+/8I/xYDJf0yAkH/TgBXAEkBO/8sAR/+EAMD/PQF5/zYAssAvf+uAqv+uALH/tQB4wDxAP8ADQAb/ygCN/1EA1P+UgFFATf+KAIb/gwC///wAOMB1f3GBbn6qgWv/bwAywLZ/+b/9AID/RADH/8sADsASQBX/04CQf4yASUBGP4JAvz+7QHgANIAxAC2AKgAsgDAAM4A3ADqAfj+BQIU/iEDMP09A0z8WQRM/T0CMP8hABQBBv73Aur+2wHOAcD+sQKo/7X/wwPS/d8C7v/7AAoAGAIm/DMEQv1PAlb/RwA6ACwBHv4PAgL+8wLm/9f/yQK8/q0DrPy5BMj91QLk//H//wMO/RsCKv83/0UCVP9RAEQANgAoABoADAH+/e8F4vrTBsb6twWq/q//vQLM/tkB6AH2/QMEEvwfBC78OwNK/lcCTv0/BDL7IwUW/QcA+gLs/d0D0P7BAbT/pQG0/8EB0P/dAez/+QII/RUDJP4xAUABTv5XAkr+OwIu/h8CEv4DAvb+5wLa/ssCvv6vAqr+twLG/9MA4gDwAP4ADAAaASj9NQRE/FEEVPxFAzj+KQEcAQ79/wTy/OMD1v7HArr+qwGuALz/yQLY/+X/8wECABD/HQMs/DkDSP1VA1D+QQI0/iUBGP8JAvz+7QLg/tECxP+1AKgBsv2/BM792gLp/vYBBQATACEAL/88AUsAWQBNAD8AMf8iAxX8BgT5/eoC3f/OAMEBs/6mArX/wgDRAd/+7AH7AAkAFwEl/TIFQflOCFf5SAU7/SwCH/8QAAMA9QDnANkAywG9/q4BqwC5AMcA1QHj/fAE//0MARsBKf42AkX/UgBTAEUANwEp/xoADQD/APEA4wHV/cYEufyqA6/+vADLAdkA5//0AQP/EAAfAS3/OgFJ/1YBT/9AATP/JAEXAAn/+gLt/d4D0f7CAbUApwCz/8ABz//cAuv++AEHABX/IgIx/j4CTf5YAUsAPf8uAiH9EgMF/vYB6f/aAc0Av/+wAqn+tgHFANP/4ALv/vwCC/4YAScANf9CAlH+VAJH/jgCK/0cAw//AADzAeX+1gLJ/7oBrf+sALsCyf3WA+X98gIBAA/+HAIr/jgCR/9U/1ACQ/80/yYCGf0KBP387gTh+9IExf+2/qgDsf6+Ac3/2gHp//YCBf4SASH/LgI9/koCWf5MAT8BMf4jAhb+BwH6Aez+3QHQ/8ECtP6lArT9wQLQAN7/6wH6/wcBFv8jATL+PwNO/VcDSv07Ay79HwISAAT/9QLo/tkBzAC+/68Cqv63Asb+0wHiAPAA/gAM/xkCKP41AkT+UQJU/kUCOP4pAhz+DQIA/vEC5P7VAsj+uQKs/q0CvP7JAtj+5QL0/gEBEAEe/isCOv5HAVYAUABCADQAJgAYAAoA/ADuAOAB0v/DAbb+pwOy/b8Dzv3bAur/9wEG/xMAIgAwAT7/SwBaAEwAPgEw/yH/EwIG/vcC6v7bAc4AwACy/6cCtv7DAdIA4ADuAPwACv8XAib+MwNC/E8EVvxHBDr9KwIe/w8AAgH0/+UA2AHK/rsDrv2rArr/xwHW/+MB8v7/Aw79GwQq+zcERv1TAlIARP41Ayj9GQIM//0A8AHi/9MBxv+3AKoAsAG+/8sB2v/nAPYABAES/x8ALgA8AEoBWP5NAkD+MQIk/xUBCP75Auz/3QHQ/8EBtP+lALQCwv3OA93+6gD5Agf9FAMj/TADP/5MAVn/SgE9AC//IAET/wQB9wDp/toDzf2+A7H+qAC3AcX/0gHh/+4B/f8KARn/JgE1/0IBUf9UAEcBOf4qAx39DgEBAvP85AXX+8gDuwCt/6wCu/7IAdf/5AHzAAEBD/4cASsAOQBHAFX/UAFDADUAJwAZ/goD/f7uAeEA0/7EA7f+qACxAr/8zAXb/OgC9wAF/xIBIf8uAT0ASwBZ/0wBP/8wAiP+FAIH/fgD6/7cAc8AwQCzAKf/tAHDANH/3gLt/voBCQAXACUAMwBBAE8AVwBJATv+LAEfARH+AgL1/uYC2f7KAr3/rgCrAbn+xgPV/eIC8QD//gwDG/4oADcBRf9SAFMBRf82ACkBG/4MAv//8ADjAdX+xgK5/6oBr/+8AMsA2QHn/vQDA/wQBB/9LAI7/0gAVwFP/kACM/8kARf/CAH7/uwC3//QAcMAtf6mA7P9wALP/9wB6/74Awf8FAQj/DAFP/tMBFn9SgI+/y8BIv8TAQb/9wDqAdz/zQHA/7EAqAG2/8MB0v/fAO4B/P8JABgBJv4zA0L8TwRW/UcCOv8rAB4AEAEC/vMC5v/XAMoAvAGu/6sBuv/HANYB5P/xAQD/DQEc/ykAOAFG/1MBUv9DATb/JwEa/wsB/gDw/+EB1P/FAbgAqv+vAb7/ywLa/ucB9gAE/xECIP4tATwASgBYAE4AQAAyACQBFv4HAvr/6wDeAdD+wQK0/6UAtADCAdD+3QPs/fkCCP8VAST/MQFAAE7+VwRK/DsCLgAgABIABAD2/+cB2gHM/r0BsAGq/bcExvzTA+L/7wD+AAwAGv8nAjb+QwJS/1P/RQI4/SkEHP0NAgD/8f/jAtb+xwO6/KsFrvu7BMr91wLm//MBAv8PAR7/KwA6AUj/VQFQ/0EANAAmARj+CQP8/e0C4P/R/8MCtv+nALIBwP7NAtz+6QH4AQb+EwIi/y/+PQVM+1kETPw9AzD/IQAUAQb+9wHqAdz9zQTA/LEDqP61AsP+0ALf/uwB+wAJABcAJf8yAkH9TgRX/EgCOwAt/x4CEf4CAfX/5gHZ/8oBvf+uAasAuf/GAdUA4//wAv/+DAIb/igCN/1EA1P+UgFFADcAKf4aAw39/gPx/uIA1QHH/7gCq/6uAL0Cy/7YAuf+9AEDABEAHwAt/zoBSf9WAU//QAEz/yQBF/8IAPsB7f/eANECw/20A6f9sgPB/c4D3f3qA/n+BgEV/yIAMQE/AE3+WANL/TwCLwAh/hIDBf32Aun/2gDNAb//sACpAbf+xAPT/OAF7/v8BAv+GAAnATX/QgBRAVX/RgA5ACsBHf4OAgH/8gDlAdf+yAK7/6wArQG7/8gA1wHl/vIDAf0OAx38KgQ5/UYDVf5QAEMBNf8mARkAC//8Ae8A4f/SAcUAtwCp/7ABv//MAdsB6f32AwX+EgEhAC8APQBLAFkATQA/ADEAIwAV/wYD+fzqBN39zgHBALMApwC1AMMA0f/eAu39+gMJ/RYCJQAz/0ABT/9WAEoBPP8tASD/EQEE//UA6AHa/8sBvv+vAaoAuP/FAdT/4QHwAf79CwMa/icBNgFE/lECVP5FAjj+KQIc/g0CAP/xAOT/1QLI/rkCrP+t/7sDyvzXBOb98wECARD+HQIs/jkCSP1VBFD8QQM0/SUCGP8JAfz/7QDgAdL+wwO2/acDsv2/A8792wPq/vcCBv0TAyL+LwI+/ksCWv1LAz7/L/8hARQABv/3Aur+2wDOAsD+sQKo/rUCxP7RAeAA7gD8AAoAGP8lAjT+QQFQAFb/RwI6/isCHv4PAgL+8wLm/9cAygC8Aa7+qwK6/scC1v7jAvL+/wEOABwAKgA4AEb/UwJS/UMDNv4nABoBDP/9AfD/4QHU/sUDuP6pAbAAvv/LAdoA6P/1AgT+EQEgAC7/OwJK/lcCTv4/AjL9IwQW/AcE+vzrAt7/zwDCAbT/pQC0AcL+zwPe/esC+v8HARb/IwIy/T8DTv1XAkr/OwEu/x8BEv8DAPYB6P7ZA8z+vQCwAar+tgLFANP/4AHv//wBC/8YASf/NABDAVEAVf9GATn/KgEd/w4CAf7yAeUB1/3IBLv8rASt+7oGyfrWBeX88gMB/g4BHf8qATn/RgFV/1ABQ/80ASf/GAALAf3+7gPh/dICxf62Aqn+sAK//swC2/7oAvf+BAETACH/LgI9/koBWQBN/z4CMf0iAxX+BgL5/uoB3f/OAcEAs/+mArX9wgTR/N4C7f/6Agn+FgIl/TIDQf5OAVcASQA7AC0AH/8QAQP/9ALn/tgBy/+8Aa//qgK5/cYD1f3iA/H9/gMN/hoAKQE3AEX/UgFT/0QBNwEp/hoBDQD/APEB4/7UAsf/uAGr/64AvQDLAdn/5gD1AQP+EAIf/iwCO/9IAFcATwBBADMAJQAXAAkA+wDt/94C0f3CA7X+pgGz/8ABz/7cA+v9+AIH/xQAIwEx/j4DTf1YAksAPf4uAyH9EgMF/fYC6f/aAc3/vgGx/qgDt/3EA9P94ALv//wBC/8YASf/NABDAlH9VQNI/TkCLP8dAhD9AQL0AOb/1wHK/7sBrv+rArr9xwPW/uMB8v7/Aw79GwMq/jcARgFU/1EBRP81ASj/GQAMAv797wLiANT+xQO4/akDsP29A8z92QLoAPb/AwES/h8DLv07Akr/VwFO/z8BMv4jAhb/BwH6/+sB3v7PAsL/swGm/7MBwv/PAd4A7P/5AQj/FQEkADL/PwFO/lcDSv07Ay79HwIS/wMB9v/nAdr/ywC+AbD+qQO4/cUD1P3hAvD//QAMARr/JwE2/0MAUgBUAUb+NwMq/RsCDv7/AvL+4wPW/ccBugCsAK4BvP7JAtj+5QL0AAL+DwIe/ysAOgFI/lUCUP5BAjT+JQIY/wn/+wLu/t8C0v/DAbb+pwKy/78Bzv/bAer/9wEG/xMBIv8vAD4CTPxZBEz9PQIw/yEAFAEG/vcC6v7bAc4BwP2xBKj7tQXE/NED4P3tBPz8CQQY/CUENPxBBFD9VQJI/jkBLAAeABAAAgD0/+UB2ADKALz/rQKr/rgBxwDV/+IC8f7+Ag3+GgIp/jYCRf5SAlP+RAE3ACn/GgIN/f4D8f7iAdUAx/+4Aqv+rgK9/8r/2APn/PQDA/8Q/x4CLf06A0n9VgNP/UACMwAl/xYACQH7/uwD3/7QAMMBtf+mALMBwf7OAt0A6//4AQf/FAAjATH/PgBNAln9SgM9/S4CIf8SAAUB9//oAdv/zAC/ALEBqf+2AcX/0gHh/+4C/f0KAxn9JgM1/kIBUf9UAUf/OAEr/xwBDwAB//IB5f/WAcn/ugGt/qwDu/zIBdf65AXz/QABDwEd/ioBOQFH/VQEUf1CATUBJ/0YBAv8/ATv/OAE0/zEA7f+qAKx/r4DzfvaBun69gYF/BICIf8u/zwDS/1YA03+PgAxASP/FAEH//gA6wHd/84BwQCz/qYDtf3CA9H+3gHtAPv/CAEXACX/MgJB/k4BVwFJ/ToELfweAxH+AgL1/uYC2f7KAr3/rgGr/rgCx//UAeP/8AD//wwCG/8oADf/RAFSAFQARgA4/ykCHP4NAQAA8gDk/9UCyP65Aqz+rQK8/skB2ADmAPQAAgAQAB7/KwI6/UcDVv5PAUIANP8lABgBCv/7Ae4A4P7RA8T9tQOo/bEDwP7NAdz/6QD4AQYAFP8hATD/PQFMAFoATP89AjD+IQIU/gUB+AHq/tsDzvu/BbL9pwK2/sMC0v7fAu7++wIK/hcBJgA0AEIAUABWAEj/OQIs/h0CEP4BAfQA5gDYAMoAvP+tAqz+uQHIANYA5AHy/v8CDv4bAyr9NwNG/VMDUv5DATb/JwEa/wsC/v7vAOIB1P/FAbj/qQCwAb7/ywHa/ucD9v0DAxL8HwUu+zsESv1XAU4CQP0xAiT/FQAIAvr96wPe/c8Dwv2zAqb/swHC/s8D3v3rAvoACP4VAiQAMv4/A07+VwFK/zsBLv8fAhL+AwH2Aej+2QLM/r0CsP6pArj+xQLU/+H/7wL+/QsEGvwnBDb9QwFSAFT/RQI4/ykAHAEO/v8B8gHk/tUDyP25Aq3/rAG7/sgC1/7kA/P9AAIP/hwCK/84AEcBVf5QA0P9NAIn/hgDC/z8Be/74ATT/cQCt/+oALEBv/7MAtv/6AD3AAUAEwAhAS/+PAFLAVn+TAM//DAEI/0UAgf/+ADrAd3/zgHB/7IBp/+0AcMA0f/eAe3/+gIJ/hYCJf4yAUEAT/9WA0n8OgQt/B4DEf4CAvX+5gLZ/8oAvQGv/qoCuf/GANUB4//wAf/+DAIb/ygANwFF/lICU/5EAjf+KAIb/wwA/wHx/uID1f3GArn/qgGv/7wBy/7YAuf/9AADABEAH/8sAjv+SAFXAE//QAEzACX/FgEJAPsA7QDf/9ACw/20Baf7sgPB/s4C3f7qA/n8BgQV/CIEMf0+Ak3/WABLAD0BL/8gARP+BAL3/ugC2//MAL8AsQCp/7YCxf/SAOEA7wD9AAsBGf4mAjX+QgJR/lQCR/44ASsAHf8OAgH98gLlANf/yAG7/6wArQG7/8gB1wDl/vIDAf0OAx3+KgA5AUb/UwFS/0MANgAoAhr9CwP+/e8D4v7TAcYAuACqALD/vQHMANoA6AD2AAT/EQIg/i0BPAFK/VcFTvo/BTL9IwEWAQj/+QDsAN4A0ADCAbT+pQG0AcL9zwXe+usE+v4HARYAJAAy/z8BTv9XAUr/OwAuAiD8EQUE+vUG6PzZAsz+vQKw/6kBuP/F/9MC4v7vA/79CwEaACj/NQJE/1H/UwJG/TYEKfwaAw39/wPz/uQB1//IALsBrf+uAb3/ygHZ/+YA9QEB/w4BHQAr/jgDR/1UA0/9QAMz/SQCFwAJ//wB7/7gAtP+xAK3/6gAs//AAs/93ATr/PgEBfwSAyH+LgI9/koCWf1KAz3+LgEhABP/BAL5/eoD3f7OAcEAs/+oArf+xALT/eAD7/78Agn/Fv8kAjP9QANP/lQBRwA5/yoBHf8OAQH/9AHnANn/ygK9/K4Frfy6A8n+1gDlAfP//wEN/xoAKQE3/0QAUwFR/kIDNfwmBBn8CgX/+vAG4/rUBcj9uQKs/q8Cvv3LBNr85wT2/AEDEP0dAyz+OQJI/VUDTv0/AzL+IwEW/wcA/AHuAOAA0v/DAbb/pwK0/sEC0P7dAewA+gAGABT/IQEw/z0CTP5XAUr/OwIu/R8EEvsDBfj86QPc/s0BwP+xAqr9twPG/dMD4v/v/v0DCv0XAiYBNP1BAlAAVP5FAzj+KQEcAA7//wH0/+UC2P7JArz9rQOu/rsBygHY/eUD9P7/AQ4AHP8pATj/RQFU/08AQgE0/yUAGAAKAP4A8AHi/tMCxv63Aqr/sf+/As7+2wLq//cABAASACAALv87A0r8VwRM/D0DMP4hAhT9BQP6/usB3gDQ/8EBtACo/rUExPvRBeD87QL8AAj/FQEk/zEBQP9NAVb/RwE6ACz+HQMQ/QED9v7nANoBzP+9AbD/qwG6/8cB1gDk//ECAP0LAxr+JwI2/kMBUv9RAUQBNv0nAxr+CwAAA/L84wPW/scCuv6rArD+vQHMANr/5wH2/wECEP0dAiz/OABHAVX/TgBBADMBJf4WAgn+/ALv/uAB0wDF/7YCqf6yAcH/zgHdAOv/+AIF/RIEIfwuAz39SgJZAUv9PAMv/SACE/8EAfn/6gHdAM//wAGz/6gBtwDFANMA4QDv/vwDCf4WASUAM/9AAU//VAFH/zgBKwAd/w4BAQD1/+YC2f7KAb0ArwCtALsByf7WAuX+8gIA/wwAGwEp/jYCRf9SAFEBQ/80ACcBGf8KAf//8AHj/tQDx/24AqsAsf6+A8382gTp/fYCA/8QAB8BLf46Akn/Vv9MAz/8MAQj/BQEB/z6BO393gLR/sICtf6mA7X9wgLR/94A7QH7/gYDFf0iAzH9PgJN/1YBSf86AS3+HgIR/wIB9//oANsAzQG//7ABq/+4Acf/1AHj//AB//8KARn/JgE1/kIDUf1SA0X9NgEpARv/DAAAAfP+5ALX/sgCu/6sAq//vADLAdn+5gL1/wABDwAd/yoBOf9GAVUATwBBADP/JAEXAAkA/QDvAOH/0wLG/rcCqv6xAcAAzgDc/+kC+P0DAxL+HwAuAjz9SQNY/UsCPgAw/iEDFP0FAvr/6wDeANABwv6zAqj/tQDEANIA4ADuAPwBCP0VBST6MQZA+k0GVvpHBjr6KwUe/Q8BAgD2/+cB2gDMAL4AsACsALr/xwLW/eME8vz/Awz+GQEoADb/QwFS/1ECRP01BCj7GQUM/P8D8v7jAdYAyAC6/6sCsP69AcwA2v/nAfYBAv0PAx7+KwE6AEgAVv9NAkD+MQEkABYACAD8/+0C4P3RA8T/tf6nA7T+wQDQAt796wP6/QUDFP4hATAAPv9LAVgASv87AS7/HwES/wMB+P/pAdz/zQHA/7EBqv+3Acb/0wHi/+8B/v8JARj/JQE0AEIAUP9TAkb+NwIq/hsCDv3/BPT85QTY/MkCvACu/60CvP7JAdgA5gD0AAAADgEc/ikCOP5FAVQBUP5BAjT+JQAYAgr9/QTw/OED1P7FALgBqv+xAcAAzv7bA+r99wIE/xEAIAEt/joDSf1WA03+PgAxACMBFf8GAfv/7AHf/tACw/+0AKcBtf/CANEB3//sAfv/BgEV/yIBMf8+AU3/VgFJ/joDLfweBBH+AgD3Aen+2gLNAL//sACrALkBx//UAeP+8AL//goCGf4mAjX+QgJR/lIBRQA3/ygBGwAN//8C8/3kAtf/yAG7/6wBr/68A8v+2ADnAfX/AAAPAh39KgM5/kYAVQJP/UADM/0kAxf9CAP9/e4C4f/SAMUBt/+oAbP/wADPAN0B6//4AQX/Ev8gAy/9PANL/FgES/08Ay/+IAATAQX/+AHr/9wBz//AArP8qAW3+8QE0/7gAO8B/f8IARf+JAQz+0AET/5UAEcCOf4qAR3/DgIB/fQE5/vYBcv8vAOv/qwBu//IAtf+5ALz/v8BDQAbACkANwBFAFMAUQBDADUAJwAZAAsA/wHx/uIB1QDH/7gDq/ywA7/+zAHbAOkA9/8CAxH7HgYt+joESf5WAk3+PgIx/SIDFf0GBPv87ATg/NEDxP61AagAtADCANAA3gDs//kCBv4TAiL/L/89Akz+VwJK/jsCLv8f/xEDBPz3Ber72wTO/L8Esv2pArj/xQDUAeL+7wL+/wkAGAEm/zP/QQNQ/FMFRvo3Bir7GwQO/f8C9P7lA9j9yQK8AK7+rQS8+8kE2P7lAfQAAP8NARz/KQE4/0UBVP9PAkL9MwMm/hcBCgD+/+8C4v7TAcYAuP+pAbIAwADOANz/6QH4AAQAEgAg/y0BPABK/1cCTP49ATAAIv8TAgb++QLs/t0C0P7BArT9pwS2/MME0vzfA+79+wMI/hUBJAAy/z8BTgBW/kcEOvsrBh76DwUC/PUD6P7ZAcwAvv+vAawAuv/HAtb94wLyAAD/CwIa/icBNv9DAVL/UQJE/jUBKP8ZAQz//wHy/+MB1v7HA7r9qwKw/70AzAHa/+cB9v8BARD/HQEs/zkASAJW/U0DQP0xAyT9FQII//sB7gDg/tEDxPy1BKj+s//BBND63Qbs+/kEBv0TAiH/LgE9/0oAWQBLAT3+LgMh/RICBf/4AOsA3QHP/8AAswGp/rYDxfzSBOH97gH9AQn+FgElATP9QARP/VQBRwA5ACsAHQAPAAH/9APn/NgEy/y8A6/+rAK7/8j/1gLl/fIEAPwMBBv9KAI3/kQBUwFR/kIDNfwmAxn+CgH/APEA4wDV/8YBuf+qAbEBv/3MBNv86AP3/gIBEQAf/ywCO/1IA1f9TAM//jAAIwIV/AYF+/zsA9/+0AHD/7QBqP+0AsP90APf/uwB+wAH/xQBIwAx/z4CTf1VA0n+OgEt/x4BEf8CAfcA6f/aAc3/vgGxAKv/uAHH/9QB4wDxAP//CgEZACcANQFD/lABUwFF/jYDKfwaBA39/wPz/eQC1//IAbv+rAOv/bwCy//Y/+YC9f4AAg/9HAQr/DgDR/5TAU8BQf4yAiX+FgIJ/vwC7//gAdP/xAC3Aar+sgPB/c4D3f7qAPkBBf8SAiH+LgE9/0oCWP9KAT39LgQh/RICBQD5/usD3v3PAsL+swOp/bUDxP3RAuD/7QH8/gcDFv0jAjL/PwBOAFUBSP05BCz8HQQQ/AED9v7nAtr+ywK+/rACrf65AcgA1gDkAPIAAP4LBBr8JwQ2/EMDUf5QAkT/Nf8nAxr8CwQA/fEB5AHW/scCuv6sArH+vQLM/tkC6P71AQIAEAAeACwAOgBI/1QCTf4/AjL+IwIW/gcB/AHu/d8E0vzDA7b+qAG1AMIA0ADe/+sC+v4FAhT/If8vAj7+SgJX/kkCPP4tAiD+EQEEAfj+6QLc/s0BwACzAKsAuADGANT/4QLw/v0DCvsXBSb9MwFCAU/9UgNG/jcCKv4bAg7+/wH0Aeb+1wPK/bsBrwGv/7sAygHY/uUD9P3/Ag7/GwEq/zcBRv9SAU8AQv8zASYAGP8JAv797wPi/tMBxv+4Aav/sgHA/80A3ADqAfj/AwER/h0CKv40A0D9SQI+/zAAJQEa/g4CBP77AvP/6QHi/toB1QHQ/tgD4vzpBPH99wL+/gIBCAEM/g8CE/4VARcAEQANAAn/BAECAAD//gL+/v0B/v/+";
    var audio = new Audio(sound);
    audio.play();
  }

  // Create popup window
  var divPopup = document.createElement("div");
  divPopup.id = "popup";
  document.body.appendChild(divPopup);

  // Create popup window header
  var divHeader = document.createElement("div");
  divHeader.id = "popup_header";
  divPopup.appendChild(divHeader);

  // Create popup window body
  var divBody = document.createElement('div');
  divBody.id = "popup_body";
  divPopup.appendChild(divBody);

  // Create popup window footer
  var divFooter = document.createElement("div");
  divFooter.id = "popup_footer";
  divPopup.appendChild(divFooter);

  var divClose = document.createElement("div");
  divClose.id = "popup_close";
  divClose.innerHTML = "×";
  divHeader.appendChild(divClose);

  var divMin = document.createElement("div");
  divMin.id = "popup_min";
  divMin.innerHTML = "▼";
  divHeader.appendChild(divMin);

  var divTitle = document.createElement("div");
  divTitle.id = "popup_title";
  divTitle.innerHTML = "test";
  divHeader.appendChild(divTitle);

  var divSearchWord = document.createElement("div");
  var buttonStart = document.createElement("input");
  buttonStart.type = "button";
  buttonStart.id = "buttonStart";
  buttonStart.value = "Start";
  var buttonStop = document.createElement("input");
  buttonStop.type = "button";
  buttonStop.id = "buttonStop";
  buttonStop.value = "Stop";
  divSearchWord.appendChild(functionCreateTextBox("word", "word", "Word:", 10));
  divSearchWord.appendChild(buttonStart);
  divSearchWord.appendChild(buttonStop);

  var buttonSave = document.createElement("input");
  buttonSave.type = "button";
  buttonSave.id = "button_save";
  buttonSave.value = "Save";

  divBody.appendChild(divSearchWord);

  divFooter.appendChild(functionCreateCheck("default_min", "default_min", 1, "mini", false));
  divFooter.appendChild(functionCreateCheck("default_on", "default_on", 1, "on", false));
  divFooter.appendChild(buttonSave);

  // main
  functionAddGlobalStyle('#popup { background-color: #CCCCFF; width: 190px; border: 1px solid #000000; position: absolute; display: none; z-index: 1000; }');
  functionAddGlobalStyle('#popup_body { padding: 5px; font-size:10px; }');
  functionAddGlobalStyle('#popup_footer { padding: 5px; font-size:10px; }');
  functionAddGlobalStyle('#popup_title { padding: 2px; background-color: #9999FF; cursor: move; font-weight: bold; }');
  functionAddGlobalStyle('#popup_min { padding: 2px; cursor: pointer; float: right; }');
  functionAddGlobalStyle('#popup_close { padding: 2px; cursor: pointer; float: right; }');

  // function
  var searchWord = function() {
    for (i = 4; i < 9; ++i) {
      xpath = document.evaluate("/html/body/div/div[3]/div[2]/div[2]/div/div/div/div/div[" + i + "]/dl/dd", document, null, XPathResult.STRING_TYPE, null)
      var regexp = RegExp($('#word').val(), "i");
      if (xpath.stringValue.match(regexp)) {
        playSound();
        alert("Found!!!");
        $("#buttonStop").click();
        break;
      }
    }
  }

  $("#buttonStart").click(function() {
    $("#buttonStart").attr("disabled", true);
    $("#buttonStop").attr("disabled", false);

    timerID = setTimeout(function() {
      window.location.reload();
    }, SPAN_RELOAD);
    searchWord();
  });

  $("#buttonStop").click(function() {
    $("#buttonStart").attr("disabled", false);
    $("#buttonStop").attr("disabled", true);
    clearTimeout(timerID);
  });

  $('#button_save').click(function() {
    GM_setValue(SAVE_PREFIX + "_word", encodeURI($('#word').val()));
    if ($('#default_min').is(':checked')) {
      GM_setValue(SAVE_PREFIX + "_defaultMin", 1);
    } else {
      GM_setValue(SAVE_PREFIX + "_defaultMin", 0);
    }
    if ($('#default_on').is(':checked')) {
      GM_setValue(SAVE_PREFIX + "_defaultOn", 1);
    } else {
      GM_setValue(SAVE_PREFIX + "_defaultOn", 0);
    }
  });

  $.popup = function() {
    var wx, wy;
    var mx, my;

    wx = $('#' + APPEAR_ID).offset().left + 150;
    wy = $('#' + APPEAR_ID).offset().top - 30;

    $('#popup').css('top', wy).css('left', wx).fadeIn(100);
    // min button
    $('#popup_min').click(function() {
      if (min) {
        $('#popup_body').css("display", "none");
        $('#popup_footer').css("display", "none");
        min = false;
      } else {
        $('#popup_body').css("display", "table");
        $('#popup_footer').css("display", "table");
        min = true;
      }
    });
    // close button
    $('#popup_close').click(function() {$('#popup').fadeOut(100);});
    // タイトルバーをドラッグしたとき
    $('#popup_title').mousedown(function(e) {
      mx = e.pageX;
      my = e.pageY;
      $().mousemove(mouseMove).mouseup(mouseUp);
      return false;
    });
    function mouseMove(e) {
      wx += e.pageX - mx;
      wy += e.pageY - my;
      $('#popup').css('top', wy).css('left', wx);
      mx = e.pageX;
      my = e.pageY;
      return false;
    }
    function mouseUp() {
      $().unbind('mousemove', mouseMove).unbind('mouseup', mouseUp);
    }
  }

  // set default
  $("#buttonStop").attr("disabled", true);

  // Restore
  if (GM_getValue(SAVE_PREFIX + "_word") != undefined
      && GM_getValue(SAVE_PREFIX + "_word") != "") {
    $('#word').val(decodeURI(GM_getValue(SAVE_PREFIX + "_word")));
  }

  if (eval("("+GM_getValue(SAVE_PREFIX + "_defaultMin")+")") == 1) {
    $('#default_min').attr({checked: "checked"});
    $('#popup_body').css("display", "none");
    $('#popup_footer').css("display", "none");
    min = false;
  }

  if (eval("("+GM_getValue(SAVE_PREFIX + "_defaultOn")+")") == 1) {
    $("#buttonStart").click();
    $('#default_on').attr({checked: "checked"});
  }

  $.popup();
})();

