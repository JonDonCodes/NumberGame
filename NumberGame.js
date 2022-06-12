// startGame()
let num_of_games_played = 0;
let num_of_games_completed = 0;
let average_time = 0;
let last_time_to_finish = 0;
let lastGameDate = 0;
let lastGameCompleted = 0;

const date             = new Date();
const day              = date.getDate();
const month            = date.getMonth()+1;
const year             = date.getFullYear();
const sDate            = `${month}.${day}${year}`;
// const sDate = "5.132022"

let seed               = parseFloat(sDate)*100000000;
let target             = document.querySelector("#targetVar");
let timer              = document.querySelector("#timerVar");
let numInputs          = 0;
let opInputs           = 0;
let enabledButtonType  = "Num"; // "Op"
let numTiles           = document.querySelectorAll(".NumTile");
let opTiles            = document.querySelectorAll(".OpTile");
let formulaNumTiles    = document.querySelectorAll(".formulaTile");
let formulaOpTiles     = document.querySelectorAll(".formulaTileOP");
let backBtn            = document.querySelector("#BackBtn");
let enterBtn           = document.querySelector("#EnterBtn");
let yourResult         = document.querySelector(".YourResult");
let targetResult       = getPseudoRandomInt(seed,20,2000);
// let finalContainer     = document.querySelector(".FinalScore");
let playContainer      = document.querySelector(".Play");
let dailyButton        = document.querySelector(".DailyButton");
let practiceButton     = document.querySelector(".PracticeButton");
let returnToMenuButton = document.querySelector("#Popup-button");
let game               = document.querySelector(".GameContainer");
let popup              = document.querySelector(".Popup");
let popup_header       = document.querySelector("#Popup-header");
let popup_exit         = document.querySelector("#Popup-exit");
let popup_body         = document.querySelector("#Popup-body");
let clear_stats_pop    = document.querySelector("#Popup-clear");
let celebrationTag     = document.querySelector(".CelebrationTag");
let titleStats         = document.querySelector("#titleStats");
let titleHowTo         = document.querySelector("#titleHowTo");
let howTo              = document.querySelector(".HowTo");
let howTo_exit         = document.querySelector("#HowTo-exit");
let notTheFirstGame    = 0;
let startTime;
let interval;

// Colors
let main_dark_color = "#6688CC";
let main_light_color = "#FAF0F2";

// Debug set to 1; Release set to 0
let verbose           = 0;

// Practice mode
let practice          = 0;

// Doesn't save data and allows you to restart game over and over
// localStorage.clear();

popup.style.display = "none";
howTo.style.display = "none";
celebrationTag.style.display = "none";

// Make sure modifiers are different
targetResult = targetResult % 365;

// Local Storage
if (localStorage.getItem('num_of_games_played') == null || localStorage.getItem('num_of_games_played') === 0) {
  populateStorage();
} else {
  num_of_games_played    = localStorage.getItem('num_of_games_played');
  num_of_games_completed = localStorage.getItem('num_of_games_completed');
  average_time           = localStorage.getItem('average_time');
  average_time           = timeStringToSeconds(average_time);
  last_time_to_finish    = localStorage.getItem('last_time_to_finish');
  lastGameDate           = localStorage.getItem('lastGameDate');
  lastGameCompleted      = localStorage.getItem('lastGameCompleted');
}

game.style.visibility = 'hidden';

dailyButton.addEventListener("click", function() {
  if (lastGameDate != sDate) {
    lastGameDate = sDate;
    localStorage.setItem('lastGameDate',sDate);
    num_of_games_played++;
    localStorage.setItem('num_of_games_played',num_of_games_played);
    localStorage.setItem('lastGameCompleted',0);
    game.style.visibility = 'visible';
    practice = 0;
    startGame();
  } else {
    if (localStorage.getItem('lastGameCompleted') != 1) {
      removeMenu();
      startGame();
    } else {
      displayPopup();
      // removeMenu();
      game.style.visibility = 'hidden';

      if (isNaN(average_time)==false) {
        average_time = secondsToString(Math.floor(average_time));
      }
      populateStats();
    }
  }
});

practiceButton.addEventListener("click", function() {
  game.style.visibility = 'visible';
  practice = 1;
  startGame();
});

returnToMenuButton.addEventListener("click", function() {
  popup.style.display = "none";
  game.style.visibility = 'hidden';
  addMenu();
  celebrationTag.style.display = "none";
  reset_tiles();
});

popup_exit.addEventListener("click", function() {
  popup.style.display = "none";
});

titleStats.addEventListener("click", function() {
  displayPopup();
  populateStats();
});

titleHowTo.addEventListener("click", function() {
  displayHowTo();
});

howTo_exit.addEventListener("click", function() {
  howTo.style.display = "none";
});

var canvas = document.getElementById("can");
var ctx = canvas.getContext("2d");
var lastend = 0;
var data = [60,210,90];
var myTotal = 0;

for(var e = 0; e < data.length; e++)
{
  myTotal += data[e];
}

// make the chart 10 px smaller to fit on canvas
var off = 10
var w = (canvas.width - off) / 2
var h = (canvas.height - off) / 2
for (var i = 0; i < data.length; i++) {
  ctx.fillStyle = main_dark_color;
  ctx.strokeStyle =main_light_color;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(w,h);
  var len =  (data[i]/myTotal) * 2 * Math.PI
  var r = h - off / 2
  ctx.arc(w , h, r, lastend,lastend + len,false);
  ctx.lineTo(w,h);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = main_light_color;
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  var mid = lastend + len / 2
  // ctx.fillText(labels[i],w + Math.cos(mid) * (r/2) , h + Math.sin(mid) * (r/2));
  lastend += Math.PI*2*(data[i]/myTotal);
}



// testTargetDistribution()

function startGame() {
  removeMenu();
  timer.innerHTML = "00:00";

  startTime = Date.now();
  interval = setInterval(function printTime() {
    let elapsedTime = Date.now() - startTime;
    timer.innerHTML = timeToString(elapsedTime);
  }, 1000);

  controlOpTiles(0);

  if (practice === 1) {
    targetResult = getRandomInt(20,120);
  }

  let lst = print_factors(targetResult,[])
  while (lst.length === 2) {
    targetResult = targetResult + 1;
    lst = print_factors(targetResult,[])
  };

  target.innerHTML = targetResult;

  let choice1;
  let choice2;

  if (practice===1) {
    [choice1,choice2] = perform_rand_op(targetResult,getRandomInt(0,4),7,practice);
  } else {
    [choice1,choice2] = perform_rand_op(targetResult,getPseudoRandomOp(seed),7);
  };

  let random_op1;
  let random_op2;

  if (practice===1) {
    random_op1 = getRandomInt(0,4);
    random_op2 = getRandomInt(0,4);
  } else {
    random_op1 = getPseudoRandomInt(seed,17,346) % 4;
    random_op2 = (random_op1+1) % 4;
  };

  if (verbose === 1) {
    console.log("choice1: "+choice1);
    console.log("choice2: "+choice2);
    console.log("RANDOM_OP1: " + random_op1);
    console.log("RANDOM_OP2: " + random_op2);
  }

  var arr1 = perform_rand_op(choice1,random_op1,53,practice);
  var arr2 = perform_rand_op(choice2,random_op2,17,practice);

  choices = arr1.concat(arr2);
  choices = shuffle(choices);

  numTiles[0].innerHTML = choices[0];
  numTiles[1].innerHTML = choices[1];
  numTiles[2].innerHTML = choices[2];
  numTiles[3].innerHTML = choices[3];

  if (notTheFirstGame === 0) {

    for (let i = 0; i < 4; i++) {
      numTiles[i].addEventListener("click", function() {
        formulaNumTiles[numInputs].innerHTML = numTiles[i].innerHTML;
        formulaNumTiles[numInputs].style.border = "none";
        formulaNumTiles[numInputs].style.width = numTiles[i].innerHTML.length + "em";
        numInputs++;
        controlOpTiles(1);

        if (numInputs===2) {
          let result1 = performOp(formulaNumTiles[0].innerHTML,formulaNumTiles[1].innerHTML,formulaOpTiles[0].innerHTML);
          yourResult.innerHTML = result1;
        } else if (numInputs===4) {
          let result1 = performOp(formulaNumTiles[0].innerHTML,formulaNumTiles[1].innerHTML,formulaOpTiles[0].innerHTML);
          let result2 = performOp(formulaNumTiles[2].innerHTML,formulaNumTiles[3].innerHTML,formulaOpTiles[2].innerHTML);
          let finalResult = performOp(result1,result2,formulaOpTiles[1].innerHTML);
          yourResult.innerHTML = finalResult;
        };

      });

      opTiles[i].addEventListener("click", function() {
        formulaOpTiles[opInputs].innerHTML = opTiles[i].innerHTML;
        formulaOpTiles[opInputs].style.border = "none";
        opInputs++;
        controlOpTiles(0);
      });
    };

    backBtn.addEventListener("click", function() {
      if ( numInputs != 0 || opInputs != 0) {
        if (enabledButtonType==="Num") {
          opInputs--;
          formulaOpTiles[opInputs].innerHTML = "";
          formulaOpTiles[opInputs].style.borderBottom = "3px solid "+ main_dark_color;
          controlOpTiles(1);
        } else {
          numInputs--;
          formulaNumTiles[numInputs].innerHTML = "";
          formulaNumTiles[numInputs].style.borderBottom = "3px solid "+ main_dark_color;
          formulaNumTiles[numInputs].style.width = "30%";
          controlOpTiles(0);

          if (numInputs < 4 && numInputs > 1) {
            let result1 = performOp(formulaNumTiles[0].innerHTML,formulaNumTiles[1].innerHTML,formulaOpTiles[0].innerHTML);
            yourResult.innerHTML = result1;
          } else if (numInputs < 2) {
            yourResult.innerHTML = null;
          };
        };
      };
    });

    enterBtn.addEventListener("click", function() {
      if ( numInputs ==4 ) {
        let result1 = performOp(formulaNumTiles[0].innerHTML,formulaNumTiles[1].innerHTML,formulaOpTiles[0].innerHTML);
        let result2 = performOp(formulaNumTiles[2].innerHTML,formulaNumTiles[3].innerHTML,formulaOpTiles[2].innerHTML);
        let finalResult = performOp(result1,result2,formulaOpTiles[1].innerHTML);
        if (finalResult != targetResult) {
        } else {
          disableTimer();
          celebrationTag.style.display = "block";

          if (practice != 1) {
            localStorage.setItem('lastGameCompleted',1);
              
            let completed_in_seconds = timeStringToSeconds(last_time_to_finish);
            num_of_games_completed = parseInt(num_of_games_completed);
            let avg_t = ((average_time*num_of_games_completed)+completed_in_seconds)/(num_of_games_completed+1);
            average_time = secondsToString(Math.floor(avg_t));
            num_of_games_completed++;
            localStorage.setItem('num_of_games_completed',num_of_games_completed);
            localStorage.setItem('average_time',average_time);
            localStorage.setItem('last_time_to_finish',last_time_to_finish);
            setTimeout(function() {
              displayPopup();
              populateStats();
            },1500);
          } else {
            setTimeout(function() {
              displayReturnToMenu();
             },1500);
          };
        };
      } 
    });

    clear_stats_pop.addEventListener("click", function() {
      localStorage.clear();
      num_of_games_completed = 1;
      num_of_games_played = 1;
      average_time = last_time_to_finish;
      localStorage.setItem('num_of_games_played',1);
      localStorage.setItem('num_of_games_completed',1);
      localStorage.setItem('average_time',last_time_to_finish);
      localStorage.setItem('last_time_to_finish',last_time_to_finish);
      localStorage.setItem('lastGameDate',sDate);
      localStorage.setItem('lastGameCompleted',1);

      document.querySelector("#num_of_games_played").innerHTML    = 1;
      document.querySelector("#num_of_games_completed").innerHTML = 1;
      document.querySelector("#average_time").innerHTML           = last_time_to_finish;
      document.querySelector("#last_time_to_finish").innerHTML    = last_time_to_finish;
    });

    notTheFirstGame = 1;

  };
};

// Game Functions

function controlOpTiles(enable) {
  for (let i=0;i<4;i++) {
    if (enable === 1) {
      opTiles[i].disabled = false;
      numTiles[i].disabled = true;
      enabledButtonType = "Op";
      numTiles[i].style.opacity = "0.3";
      opTiles[i].style.opacity = "1";
    } else if (enable===0) {
      opTiles[i].disabled = true;
      numTiles[i].disabled = false;
      enabledButtonType = "Num";
      numTiles[i].style.opacity = "1";
      opTiles[i].style.opacity = "0.3";
    };
    
  };
};

function disableAllTiles() {
  for (let i=0;i<4;i++) {
    opTiles[i].disabled = true;
    numTiles[i].disabled = true;
    numTiles[i].style.opacity = "0.3";
    opTiles[i].style.opacity = "0.3";
  };
};

function removeMenu() {
  dailyButton.style.display = "none";
  practiceButton.style.display = "none";
  playContainer.style.display = "none";
};

function addMenu() {
  playContainer.style.display = "flex";
  dailyButton.style.display = "block";
  practiceButton.style.display = "block";
};

function populateStorage() {
  localStorage.setItem('num_of_games_played',0);
  localStorage.setItem('num_of_games_completed',0);
  localStorage.setItem('average_time',0);
  localStorage.setItem('last_time_to_finish',0);
  localStorage.setItem('lastGameDate',0);
  localStorage.setItem('lastGameCompleted',0);

  num_of_games_played    = localStorage.getItem('num_of_games_played');
  num_of_games_completed = localStorage.getItem('num_of_games_completed');
  average_time           = localStorage.getItem('average_time');
  last_time_to_finish    = localStorage.getItem('last_time_to_finish');
  lastGameDate           = localStorage.getItem('lastGameDate');
  lastGameCompleted      = localStorage.getItem('lastGameCompleted');
};

function populateStats() {
  document.querySelector("#num_of_games_played").innerHTML    = num_of_games_played;
  document.querySelector("#num_of_games_completed").innerHTML = num_of_games_completed;
  document.querySelector("#average_time").innerHTML           = average_time;
  document.querySelector("#last_time_to_finish").innerHTML    = last_time_to_finish;
};

function displayPopup() {
  popup.style.display = "flex";
  popup.style.height = "55%";
  clear_stats_pop.style.display = "block";
  popup_header.style.display = "flex";
  popup_body.style.display = "flex";
  popup.style.top = "15%";
  returnToMenuButton.style.marginTop = "0%"
};

function displayReturnToMenu() {
  popup.style.display = "flex";
  popup.style.height = "8%";
  clear_stats_pop.style.display = "none";
  popup_header.style.display = "none";
  popup_body.style.display = "none";
  popup.style.top = "42%";
  popup.style.paddingTop = "5%";
};

function displayHowTo() {
  howTo.style.display = "flex";
};

function disableTimer() {
  clearInterval(interval);
  last_time_to_finish = timer.innerHTML;
};

function reset_tiles() {
  for (let i = 0; i < 4; i++) {
    formulaNumTiles[i].innerHTML = "";
    formulaNumTiles[i].style.borderBottom = "3px solid "+ main_dark_color;
    formulaNumTiles[i].style.width = "30%";
    if (i != 3) {
      formulaOpTiles[i].innerHTML = "";
      formulaOpTiles[i].style.borderBottom = "3px solid "+ main_dark_color;
    };
    opTiles[i].disabled = true;
    numTiles[i].disabled = false;
    numTiles[i].style.opacity = "1";
    opTiles[i].style.opacity = "0.3";
  };
  numInputs = 0;
  opInputs = 0;
  enabledButtonType = "Num";
  yourResult.innerHTML = null;
};

function performOp(num1,num2,op) {
  let result = 0;
  num1 = parseInt(num1,10);
  num2 = parseInt(num2,10);
  if (op == "+") {
    result = num1 + num2;
  } else if (op == "-") {
    result = num1 - num2;
  } else if (op == "*") {
    result = num1 * num2;
  } else if (op == "/") {
    result = num1 / num2;
  };
  return result;
};

function getRandomInt(min,max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

function print_factors(mainNum,lst=[]) {
  // console.log("The factors of "+mainNum+" are:")
  for (let i=1;i<=mainNum;i++) {
    if (mainNum % i == 0) {
      // console.log(i);
      lst.push(i);
    };
  };
  return lst;
};

function perform_rand_op(num,op,mod,practice=0) {
  let modifier = getModifier(mod,practice);
  let result = 0;
  if (op == 0) {
    result = num + modifier;
  } else if (op == 1) {
    result = num - modifier;
  } else if (op == 2) {
    result = num * modifier;
  } else if (op == 3) {
    result = num / modifier;
    while (Number.isInteger(result)===false) {
      modifier = modifier - 1;
      result = num / modifier;
    };
  };
  if (verbose === 1) {
    console.log("Perform Random Op");
    console.log("Num: "+num);
    console.log("Op: "+op);
    console.log("Modifier: " + modifier);
  };

  return [result,modifier];
};

function getModifier(divisor,practice=0) {
  if (practice===1) {
    return getRandomInt(2,10);
  } else {
    return (getPseudoRandomInt(seed,1,200) % divisor + 2);
  };

};

function getPseudoRandomInt(seed,min=1,max=100) {
  const prn = seed * 16807 * day % 2147483647
  let result = prn;

  // max is exclusive
  while (result > max) {
    result = result / 2;
  };

  result = Math.floor(result);

  while (result < min) {
    result = result + (max-min-1)
  }

  return result;
};

// Pseudo random op based on day of month
function getPseudoRandomOp(seed,max=4) {
  return day % max;
};

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

function timeToString(time) {
  let diffInHrs = time / 3600000;
  let hh = Math.floor(diffInHrs);
  let diffInMin = (diffInHrs - hh) * 60;
  let mm = Math.floor(diffInMin);
  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);
  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");
  return `${formattedMM}:${formattedSS}`;
};

function timeStringToSeconds(timeString) {
  const minutes = parseInt(timeString.slice(0,2));
  const seconds = parseInt(timeString.slice(3,5));

  return minutes * 60 + seconds;
};

function secondsToString(seconds) {
  let mm = seconds/60;
  mm = Math.floor(mm);
  let ss = seconds % 60;
  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");
  return `${formattedMM}:${formattedSS}`;
};

// Test distribution of targetResult
// Ideally you get as close to 360 #s as possible for each day
function testTargetDistribution() {
  let tlst = [];
  for (let i = 1;i<13;i++) {
    for (let j = 1;j<31;j++) {
      tdate = `${i}.${j}2022`
      tseed = parseFloat(tdate)*100000000;
      tres = getPseudoRandomInt(tseed,20,2000);
      if (tres > 1500) {
        tres = tres - 600;
      } else if (tres > 1000) {
        tres = tres - 500;
      } 
      tlst.push(tres)
    };
  };

  let ulst = tlst.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);

  console.log("TestListLength " + tlst.length)
  console.log("UniqListLength " + ulst.length)
  console.log("UniqList " + ulst)
};
