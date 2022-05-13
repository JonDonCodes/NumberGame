
let target = document.querySelector("#targetVar");
let countdown = document.querySelector("#countdownVar");
let numInputs = 0;
let opInputs = 0;
let enabledButtonType = "Num" // "Op"
let numTiles = document.querySelectorAll(".NumTile");
let opTiles = document.querySelectorAll(".OpTile");
let formulaNumTiles = document.querySelectorAll(".formulaTile");
let formulaOpTiles = document.querySelectorAll(".formulaTileOP");
let backBtn = document.querySelector("#BackBtn");
let enterBtn = document.querySelector("#EnterBtn");
var interval = null;
let targetResult = getRandomInt(20,120);
let finalContainer = document.querySelector(".FinalScore");

countdown.innerHTML = 60;

controlOpTiles(0);

interval = setInterval(decrementTimer,1000);

let lst = print_factors(targetResult,[])
while (lst.length === 2) {
	targetResult = getRandomInt(20,120);
	lst = print_factors(targetResult,[])
}

target.innerHTML = targetResult;

const lst_ran_index = getRandomInt(1,lst.length+1);
// const choice1 = lst[lst_ran_index-1];
// const choice2 = targetResult/choice1;
const [choice1,choice2] = perform_rand_op(targetResult,getRandomInt(0,4),0);

if (choice1 > choice2) {
    var arr1 = perform_rand_op(choice1,getRandomInt(0,4));
    var arr2 = perform_rand_op(choice2,getRandomInt(0,3));
} else {
    var arr1 = perform_rand_op(choice1,getRandomInt(0,3));
    var arr2 = perform_rand_op(choice2,getRandomInt(0,4));
}

choices = arr1.concat(arr2);
choices = shuffle(choices);

numTiles[0].innerHTML = choices[0];
numTiles[1].innerHTML = choices[1];
numTiles[2].innerHTML = choices[2];
numTiles[3].innerHTML = choices[3];

for (let i = 0; i < 4; i++) {
	numTiles[i].addEventListener("click", function() {
		formulaNumTiles[numInputs].innerHTML = numTiles[i].innerHTML;
		numInputs++;
		controlOpTiles(1);
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
			formulaOpTiles[opInputs].style.border = "solid";
			formulaOpTiles[opInputs].style.border = "solid 2px";
			controlOpTiles(1);
		} else {
			numInputs--;
			formulaNumTiles[numInputs].innerHTML = "";
			controlOpTiles(0);
		}
	}
});

enterBtn.addEventListener("click", function() {
	if ( numInputs ==4 ) {
		let result1 = performOp(formulaNumTiles[0].innerHTML,formulaNumTiles[1].innerHTML,formulaOpTiles[0].innerHTML);
		let result2 = performOp(formulaNumTiles[2].innerHTML,formulaNumTiles[3].innerHTML,formulaOpTiles[2].innerHTML);
		let finalResult = performOp(result1,result2,formulaOpTiles[1].innerHTML);
		if (finalResult != targetResult) {
			finalContainer.innerHTML = "Nope, Keep Trying"
		} else {
			finalContainer.innerHTML = "You got it!"
			disableTimer();
		}
	}	
});


// Functions

function controlOpTiles(enable) {
	for (let i=0;i<4;i++) {
		if (enable === 1) {
			opTiles[i].disabled = false;
			numTiles[i].disabled = true;
			enabledButtonType = "Op"
			numTiles[i].style.opacity = "0.4"
			opTiles[i].style.opacity = "1"
		} else if (enable===0) {
			opTiles[i].disabled = true;
			numTiles[i].disabled = false;
			enabledButtonType = "Num"
			numTiles[i].style.opacity = "1"
			opTiles[i].style.opacity = "0.4"
		}
		
	}
};

function disableAllTiles() {
	for (let i=0;i<4;i++) {
		opTiles[i].disabled = true;
		numTiles[i].disabled = true;
		numTiles[i].style.opacity = "0.4"
		opTiles[i].style.opacity = "0.4"
	}
}

function disableTimer() {
	clearInterval(interval);
};

function decrementTimer() {
	const x = countdown.innerHTML;
	countdown.innerHTML = x-1;
	if (countdown.innerHTML == 0) {
		finalContainer.innerHTML = "Time's Up!"
		disableAllTiles()
		disableTimer()
	}
};

function getRandomInt(min,max) {
	min = Math.ceil(min);
 	max = Math.floor(max);
 	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

function print_factors(mainNum,lst=[]) {
	console.log("The factors of "+mainNum+" are:")
	for (let i=1;i<=mainNum;i++) {
		if (mainNum % i == 0) {
			// console.log(i);
			lst.push(i);
		}
	}
	return lst;
};

function perform_rand_op(num,op,difficulty=0) {
	// let modifier = getRandomInt(2,10);
	let modifier = getModifier(difficulty);
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
			// let modifier = getRandomInt(2,10);
			modifier = getModifier(difficulty);
			result = num / modifier;
		}
	}
	return [result,modifier];
}

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
	}
	return result;
}

function getModifier(difficulty) {
	if (difficulty === 0) {
		modifier = getRandomInt(2,10);
	} else if (difficulty === 1) {
		modifier = getRandomInt(2,20);
	} else if (difficulty === 2) {
		modifier = getRandomInt(9,20);
	} else {
		modifier = getRandomInt(2,30);
	}
	return modifier;
}

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
}

