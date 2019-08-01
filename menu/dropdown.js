var gameid = null;
var prevlevelbutton = null;
var nextlevelbutton = null;
var level_names = null;
var solvedLevels;
var unsolvedShow = 3;

function initLevelSelect (_gameid, levels, prevnext) {
	gameid = _gameid;

	var levelcount = 0;

//checks if levels is an array then either gets levelcount from array length or from int
	if (Array.isArray(levels))
	{
		levelcount = levels.length;
		level_names = levels;
	}
	else
	{
		levelcount = levels;
		level_names = null;
	}

	tryPlayStartLevelSound = function () {
		tryPlaySimpleSound("startlevel");
		updateLevelSelectFromGame(curlevel);
	}

	tryPlayEndLevelSound = function () {
		tryPlaySimpleSound("endlevel");
		rememberLevelCompleted(curlevel);
	}
	checkAmtSolved(0, levels);
	var buttons = $('<ul> </ul>');
	var select = $('<select visibility: hidden><option>Level select</option></select>');

	for (var i = 0; i < levels ; i++) {
		var leveltext = level_names ? level_names[i] : 'Level ' + i;

		// checks local storage if level has been solved
		if (!!window.localStorage && localStorage[gameid + '.lvl' + i]) {
			leveltext = leveltext + '&nbsp;&#x2713;&nbsp;'; // Checkmark ✓
		} else {
			leveltext = leveltext + '&nbsp;&#x2003;&nbsp;'; // void space
		}

		buttons.append('<li onMouseDown="callLevel(' + i + ')" id="lvl' + i + '" val="lvl' + i + '">' + leveltext + '</li>');

		select.append('<option id="lvl' + i + '" val="lvl' + i + '">' + leveltext + '</a></li>');

	}

	var chooser = $('<div></div>');
	chooser.append(buttons);
	chooser.append(select);

/*	if (prevnext) {
		prevlevelbutton = $('<a href="#">&#xab; Prev</a>');
		nextlevelbutton = $('<a href="#">Next &#xbb;</a>');

		chooser.prepend('&nbsp;&nbsp;');
		chooser.prepend(prevlevelbutton);
		chooser.append('&nbsp;&nbsp;');
		chooser.append(nextlevelbutton);

		prevlevelbutton.click(function (e) { select[0].selectedIndex--; onLevelSelectChange(e); });
		nextlevelbutton.click(function (e) { select[0].selectedIndex++; onLevelSelectChange(e); });

		prevlevelbutton.css('visibility', 'hidden');
		nextlevelbutton.css('visibility', 'hidden');
	}*/

	$('#levelselect').append(chooser);
	//document.getElementsById("button_"+i).onMouseDown = 'onLevelSelectChange'; => onLevelSelectChange()
	select.change(onLevelSelectChange);
}
/*
function updatePrevNextButtons () {
	var select = $('#levelselect select')[0];

	var index = select.selectedIndex;

	if (index <= 1) {
		prevlevelbutton.css('visibility', 'hidden');
	} else {
		prevlevelbutton.css('visibility', 'visible');
	}

	if (index >= select.length - 1) {
		nextlevelbutton.css('visibility', 'hidden');
	} else {
		nextlevelbutton.css('visibility', 'visible');
	}
}
*/

// happens when player solves a level
// needs to add clickable level
function updateLevelSelectFromGame (levelid) {
	levelid = parseInt(levelid);
	$('#levelselect select')[0].selectedIndex = levelid;
	/*if (prevlevelbutton) {
		updatePrevNextButtons();
	}*/

	// $('#levelselect').append('<li onMouseDown="callLevel(' + checkAmtSolved(1, 20)+unsolvedShow + ')" id="lvl' + i + '" val="lvl' + i + '">' + leveltext + '</li>');
}

function onLevelSelectChange(e) {
	if (e) {
		e.preventDefault();
	}

	//var levelname = $(this).text();
	$('#game').removeClass("unfocused");
	lastDownTarget = canvas;

	$(this).blur();

	if (prevlevelbutton) {
		updatePrevNextButtons();
	}

	var levelid = $('#levelselect select')[0].selectedIndex;

	if (titleScreen) {
		curlevel = levelid;

		timer = 0;
		quittingTitleScreen=true;

		tryPlayStartGameSound();

		return;
	}

	if (curlevel == levelid) {
		return;
	}

	keybuffer=[];
    againing=false;
	messagetext="";
	curlevel = levelid; // set current level
	textMode=false;
	titleScreen=false;
	quittingMessageScreen=false;
	messageselected=false;
	loadLevelFromState(state,levelid);

	canvasResize();
	clearInputHistory();

	try {
		if (!!window.localStorage) {
			localStorage[document.URL]=curlevel;
		}
	} catch (e) {}
}

function callLevel(lll) {
	levelid = lll;
	$('#levelselect select')[0].selectedIndex = levelid;
	onLevelSelectChange(0);
}

function checkAmtSolved(first, last) {
	solvedLevels = 0;
	for (var i = first; i < last; i++) {
		// checks local storage if level has been solved
		if (!!window.localStorage && localStorage[gameid + '.lvl' + i]) {
				solvedLevels += 1;
		} else {
		}
	}
}

function rememberLevelCompleted (levelid) {
	levelid = parseInt(levelid);
	try {
		localStorage[gameid + '.lvl' + levelid] = true;
	} catch (e) {}

	console.log(level_names);

	var leveltext = level_names ? level_names[levelid] : 'Level ' + levelid;
	$('#lvl' + levelid).html(leveltext + '&nbsp;&#x2713;&nbsp;');
}
