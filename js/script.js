'use strict';
showTutorial();
loadDoc();

let numberAnswers = 0;
let numberCorrectAnswers = 0;
let numberFalseAnswers = 0;
const summary = new Array(
  'Du bist der neue Mozart.',
  'Wow genial!',
  'Du bist richtig gut.',
  'Das war okay.',
  'Übe weiter.',
  'Das wird nix mehr.'
);

document.querySelector('#btn-tutorial').addEventListener('click', showTutorial);
document.querySelector('#btn-game').addEventListener('click', showGame);
document.querySelector('#btn-contact').addEventListener('click', showContact);

document.querySelector('#change-key').addEventListener('click', function() {
  if (this.value == 'treble') {
    this.value = 'bass';
    this.innerHTML = 'Violine';
    loadDoc();
  } else {
    this.value = 'treble';
    this.innerHTML = 'Bass';
    loadDoc();
  }
});

var btnAnswers = document.querySelectorAll('.btn-answer');
btnAnswers.forEach(element => {
  element.addEventListener('click', loadDoc);
});

document.querySelector('#play-again').addEventListener('click', function() {
  resetStats();
  showGame();
});

function resetStats() {
  numberAnswers = numberCorrectAnswers = numberFalseAnswers = 0;
  document.getElementById('progress-correct').value = 0;
  document.getElementById('progress-wrong').value = 0;
}

function showTutorial() {
  document.querySelector('#tutorial').style.display = 'block';
  document.querySelector('#game').style.display = 'none';
  document.querySelector('#contact').style.display = 'none';
  document.querySelector('#statistic').style.display = 'none';
}

function showGame() {
  resetStats();
  document.querySelector('#tutorial').style.display = 'none';
  document.querySelector('#game').style.display = 'block';
  document.querySelector('#contact').style.display = 'none';
  document.querySelector('#statistic').style.display = 'none';
}

function showContact() {
  document.querySelector('#tutorial').style.display = 'none';
  document.querySelector('#game').style.display = 'none';
  document.querySelector('#contact').style.display = 'flex';
  document.querySelector('#statistic').style.display = 'none';
}

function showStatistic() {
  document.querySelector('#tutorial').style.display = 'none';
  document.querySelector('#game').style.display = 'none';
  document.querySelector('#contact').style.display = 'none';
  document.querySelector('#statistic').style.display = 'block';
  document.querySelector('#stat-total').innerHTML = numberAnswers;
  document.querySelector('#stat-correct').innerHTML = numberCorrectAnswers;
  document.querySelector('#stat-wrong').innerHTML = numberFalseAnswers;
  document.querySelector('#summary').innerHTML = summary[numberFalseAnswers];
}

//clear the stave
function clearBox(elementID) {
  document.getElementById(elementID).innerHTML = '';
}

//if answer is right
function moveCorrect() {
  var elem = document.getElementById('progress-correct');
  var value = parseInt(elem.getAttribute('value'));
  value += 10;
  elem.setAttribute('value', value);
  numberAnswers++;
  numberCorrectAnswers++;
  if (numberAnswers == 5) showStatistic();
}

//is answer is wrong
function moveWrong() {
  var elem = document.getElementById('progress-wrong');
  var value = parseInt(elem.getAttribute('value'));
  value += 10;
  elem.setAttribute('value', value);
  numberAnswers++;
  numberFalseAnswers++;
  if (numberAnswers == 5) showStatistic();
}

function drawNotes(noteType, key) {
  clearBox('boo');
  //Vexflow
  var VF = Vex.Flow;

  // Create an SVG renderer and attach it to the DIV element named "boo".
  var div = document.getElementById('boo');
  var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

  // Size our svg:
  renderer.resize(500, 200);

  // And get a drawing context:
  var context = renderer.getContext();

  // Create a stave at position 10, 40 of width 400 on the canvas.
  var stave = new VF.Stave(10, 40, 400);

  // Add a clef and time signature.
  stave.addClef(key).addTimeSignature('4/4');

  // Connect it to the rendering context and draw!
  stave.setContext(context).draw();

  var notes = [
    // A quarter-note C.
    new VF.StaveNote({ clef: key, keys: [noteType], duration: 'q' })
  ];

  // Create a voice in 4/4 and add above notes
  var voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
  voice.addTickables(notes);

  // Format and justify the notes to 400 pixels.
  var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);

  // Render voice
  voice.draw(context, stave);
}

function loadDoc() {
  //Load JSON File via Ajax
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhttp.responseText);
      var resp = response.note;
      var rnd = Math.floor(Math.random() * 10);

      //choose which stave to be loaded
      var key = document.querySelector('#change-key').value;
      if (key === 'bass') {
        var type = resp[rnd].a;
        var integer = parseInt(type.substring(2, 3));
        integer -= 2;
        var newType = type.replace(type.substring(2, 3), integer.toString(10));
        drawNotes(newType, key);
      } else {
        drawNotes(resp[rnd].a, key);
      }

      //print the Answers on the buttons at random
      var numbers = new Array();

      for (var i = 0; i < 4; i++) {
        var rndbutton = Math.floor(Math.random() * 4);
        while (numbers.includes(rndbutton)) {
          var rndbutton = Math.floor(Math.random() * 4);
        }
        var element = document.getElementById('btn' + rndbutton);
        if (i === 0) {
          element.value = 'correct';
          element.removeEventListener('click', moveCorrect);
          element.removeEventListener('click', moveWrong);
          element.addEventListener('click', moveCorrect);
        } else {
          element.value = 'false';
          element.removeEventListener('click', moveCorrect);
          element.removeEventListener('click', moveWrong);
          element.addEventListener('click', moveWrong);
        }
        element.innerHTML = resp[rnd].l[i];

        numbers.push(rndbutton);
      }
    }
  };
  xhttp.open('GET', 'notes.json', true);
  xhttp.send();
}
