var socket = io();
var questionNum = 1;

function updateDatabase(){
    console.log('update');
    var questions = [];
    var name = document.getElementById('name').value;
    for(var i=1;i<=questionNum;i++){
        var question = document.getElementById('q'+i).value;
        var answer1 = document.getElementById(i+'a1').value;
        var answer2 = document.getElementById(i+'a2').value;
        var answer3 = document.getElementById(i+'a3').value;
        var answer4 = document.getElementById(i+'a4').value;
        var correct = document.getElementById('correct'+i).value;
        var answers = [answer1, answer2, answer3, answer4];
        questions.push({"question": question, "answers": answers, "correct": correct});
    }
    var quiz = {id: 0, "name": name, "questions": questions};
    socket.emit('newQuiz', quiz);
}