// light/dark switch
// document.getElementById('btnSwitch').addEventListener('click', () => {
//   if (document.body.classList.contains('dark')) {
//     document.body.classList.remove('dark')
//   } else {
//     document.body.classList.add('dark')
//   }
//   document.getElementById('darkTheme').innerText = document.body.classList
// })

// check answers
function checkAnswer(question_number) {
  const question_element = document.getElementById('q' + question_number);
  const answer_element = document.getElementById('a' + question_number);
  const question_status_element = document.getElementById('q' + question_number + '-status');
  const user_answer = question_element.value;
  // if the answer is correct, then show the answer_element and update the status to a green checkmark
  if (user_answer === question_element.dataset.answer) {
    answer_element.style.display = 'block';
    question_status_element.innerText = 'Correct!';
  } else {
    // if the answer is incorrect, then show the answer_element and update the status to a red x
    answer_element.style.display = 'none';
    question_status_element.innerText = 'Incorrect!';
  }
}

function showAnswer(question_number) {
  const answer_element = document.getElementById('a' + question_number);
  answer_element.style.display = 'block';
}