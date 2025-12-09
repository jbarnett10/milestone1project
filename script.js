/* 
 * Quiz Logic for HTTP Evolution Self-Assessment
 * 
 * This script handles quiz form submission, answer validation, scoring,
 * and feedback display. It supports multiple question types including
 * fill-in-the-blank, multiple choice, and multi-select questions.
 * 
 * Author: Jayden Rodriguez-Barnett
 * Course: IT 3203 — Introduction to Web Development
 */

// Wait for DOM to be fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', function() {
  const quizForm = document.getElementById('quizForm');
  const quizResults = document.getElementById('quizResults');
  const resetBtn = document.getElementById('resetBtn');

  // If elements don't exist (not on quiz page), exit early
  if (!quizForm || !quizResults || !resetBtn) {
    return;
  }

  // Correct answers for each question
  const ANSWERS = {
    q1: 'quic',          // fill-in (case-insensitive)
    q2: 'B',
    q3: 'C',
    q4: 'B',
    q5: ['A', 'B', 'D']  // multi-select
  };

  const TOTAL = 5;
  const PASS_MARK = 0.8; // 80%

  // Handle quiz form submission
  quizForm.addEventListener('submit', function (e) {
    e.preventDefault();

    let score = 0;
    const feedbackBlocks = [];

    // Q1: Fill-in-the-blank question
    const q1Value = document.getElementById('q1').value.trim().toLowerCase();
    const q1Correct = q1Value === ANSWERS.q1;
    if (q1Correct) score++;

    feedbackBlocks.push(buildFeedback({
      number: 1,
      correct: q1Correct,
      userAnswer: q1Value || '(no answer entered)',
      correctAnswer: 'QUIC',
      explanation: 'HTTP/3 maps HTTP onto QUIC, a UDP-based transport that reduces head-of-line blocking.'
    }));

    // Q2: Multiple choice question
    const q2Value = getRadioValue('q2');
    const q2Correct = q2Value === ANSWERS.q2;
    if (q2Correct) score++;

    feedbackBlocks.push(buildFeedback({
      number: 2,
      correct: q2Correct,
      userAnswer: q2Value ? getOptionLabel('q2', q2Value) : '(no option selected)',
      correctAnswer: 'B. A stateless, application-layer protocol for client–server communication',
      explanation: 'HTTP defines how clients and servers exchange requests and responses over the web.'
    }));

    // Q3: Multiple choice question
    const q3Value = getRadioValue('q3');
    const q3Correct = q3Value === ANSWERS.q3;
    if (q3Correct) score++;

    feedbackBlocks.push(buildFeedback({
      number: 3,
      correct: q3Correct,
      userAnswer: q3Value ? getOptionLabel('q3', q3Value) : '(no option selected)',
      correctAnswer: 'C. HTTP/1.1',
      explanation: 'HTTP/1.1 introduced persistent connections and chunked transfer encoding.' 
    }));

    // Q4: Multiple choice question
    const q4Value = getRadioValue('q4');
    const q4Correct = q4Value === ANSWERS.q4;
    if (q4Correct) score++;

    feedbackBlocks.push(buildFeedback({
      number: 4,
      correct: q4Correct,
      userAnswer: q4Value ? getOptionLabel('q4', q4Value) : '(no option selected)',
      correctAnswer: 'B. Binary framing + multiplexed streams on a single TCP connection',
      explanation: 'HTTP/2 keeps HTTP semantics but adds a binary framing layer for multiplexing and header compression.'
    }));

    // Q5: Multi-select question
    const q5Values = getCheckboxValues('q5');
    const q5Correct = arraysEqualIgnoreOrder(q5Values, ANSWERS.q5);
    if (q5Correct) score++;

    const userQ5Label = q5Values.length
      ? q5Values.map(v => getOptionLabel('q5', v)).join('; ')
      : '(no options selected)';

    const correctQ5Label = ANSWERS.q5
      .map(v => getOptionLabel('q5', v))
      .join('; ');

    feedbackBlocks.push(buildFeedback({
      number: 5,
      correct: q5Correct,
      userAnswer: userQ5Label,
      correctAnswer: correctQ5Label,
      explanation: 'HTTP/3 over QUIC uses UDP, avoids TCP head-of-line blocking, and supports faster 0-RTT/1-RTT setup.'
    }));

    // Calculate final score and pass/fail status
    const percentage = (score / TOTAL) * 100;
    const passed = (score / TOTAL) >= PASS_MARK;

    // Build overall results HTML
    const overallHtml = `
      <div class="quiz-overall ${passed ? 'pass' : 'fail'}">
        ${passed ? '✅ You passed the quiz!' : '❌ You did not reach the pass mark yet.'}
      </div>
      <div class="quiz-score">
        Score: <strong>${score} / ${TOTAL}</strong> (${percentage.toFixed(0)}%) &nbsp;|&nbsp;
        Pass mark: ${Math.round(PASS_MARK * 100)}%
      </div>
    `;

    // Display results
    quizResults.innerHTML = `
      <h3>Quiz Results</h3>
      ${overallHtml}
      ${feedbackBlocks.join("")}
    `;
    quizResults.style.display = 'block';
    quizResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Handle reset button click
  resetBtn.addEventListener('click', function () {
    quizForm.reset();
    quizResults.innerHTML = '';
    quizResults.style.display = 'none';
  });

  /**
   * Get the selected value from a radio button group
   * @param {string} name - The name attribute of the radio buttons
   * @returns {string|null} - The value of the checked radio, or null if none selected
   */
  function getRadioValue(name) {
    const inputs = document.querySelectorAll('input[name="' + name + '"]');
    for (const input of inputs) {
      if (input.checked) return input.value;
    }
    return null;
  }

  /**
   * Get all checked values from a checkbox group
   * @param {string} name - The name attribute of the checkboxes
   * @returns {string[]} - Array of checked checkbox values
   */
  function getCheckboxValues(name) {
    const inputs = document.querySelectorAll('input[name="' + name + '"]:checked');
    return Array.from(inputs).map(i => i.value);
  }

  /**
   * Compare two arrays for equality, ignoring order
   * @param {string[]} a - First array
   * @param {string[]} b - Second array
   * @returns {boolean} - True if arrays contain the same elements
   */
  function arraysEqualIgnoreOrder(a, b) {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((v, i) => v === sortedB[i]);
  }

  /**
   * Get the label text for a form option
   * @param {string} name - The name attribute of the input
   * @param {string} value - The value attribute of the input
   * @returns {string} - The label text or the value if label not found
   */
  function getOptionLabel(name, value) {
    const input = document.querySelector('input[name="' + name + '"][value="' + value + '"]');
    if (!input) return value;
    const label = input.closest('label');
    return label ? label.textContent.trim() : value;
  }

  /**
   * Build HTML for question feedback
   * @param {Object} params - Feedback parameters
   * @param {number} params.number - Question number
   * @param {boolean} params.correct - Whether the answer was correct
   * @param {string} params.userAnswer - The user's answer
   * @param {string} params.correctAnswer - The correct answer
   * @param {string} params.explanation - Explanation of the answer
   * @returns {string} - HTML string for the feedback block
   */
  function buildFeedback({ number, correct, userAnswer, correctAnswer, explanation }) {
    return `
      <div class="question-feedback">
        <h4>Question ${number}</h4>
        <div class="badge ${correct ? "correct" : "incorrect"}">
          ${correct ? "Correct" : "Incorrect"}
        </div>
        <div class="feedback-user ${correct ? "correct" : "incorrect"}">
          Your answer: ${userAnswer}
        </div>
        <div class="feedback-answer">
          <strong>Correct answer:</strong> ${correctAnswer}<br />
          ${explanation}
        </div>
      </div>
    `;
  }
});

