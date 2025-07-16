const feedbackAssignments = [
  {
    id: 1,
    title: "Assignment 1",
    feedback: {
      thesis: "Clear and concise.",
      structure: "Well-organized.",
      grammar: "Minor errors.",
      citations: "Properly cited.",
      analysis: "Strong analysis."
    }
  },
  {
    id: 2,
    title: "Essay 1",
    feedback: {
      thesis: "Needs improvement.",
      structure: "Lacks coherence.",
      grammar: "Several mistakes.",
      citations: "Missing sources.",
      analysis: "Superficial."
    }
  }
];

function populateFeedback() {
  const ul = document.getElementById('feedbackList');
  ul.innerHTML = '';
  feedbackAssignments.forEach(a => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${a.title}</strong></span>
      <span>
        <button onclick="viewFullFeedback(${a.id})">View Full Feedback</button>
        <button onclick="openFlagModal(${a.id})">Flag Feedback</button>
      </span>
    `;
    ul.appendChild(li);
  });
}

// Feedback modal
function viewFullFeedback(assignmentId) {
  const assignment = feedbackAssignments.find(a => a.id === assignmentId);
  if (!assignment) return;

  const feedbackHtml = formatFeedback(assignment.feedback);
  document.getElementById('fullFeedbackContent').innerHTML = `
    <h4>${assignment.title} - Full Feedback</h4>
    ${feedbackHtml}
  `;

  flagAssignmentId = assignmentId;
  document.getElementById('fullFeedbackModal').style.display = 'flex';
}

function formatFeedback(data) {
  return `
    <p><strong>Thesis:</strong> ${data.thesis}</p>
    <p><strong>Structure:</strong> ${data.structure}</p>
    <p><strong>Grammar:</strong> ${data.grammar}</p>
    <p><strong>Citations:</strong> ${data.citations}</p>
    <p><strong>Analysis:</strong> ${data.analysis}</p>
  `;
}

function closeFullFeedbackModal() {
  document.getElementById('fullFeedbackModal').style.display = 'none';
}

let flagAssignmentId = null;

function openFlagModal(assignmentId = null) {
  if (assignmentId) flagAssignmentId = assignmentId;
  document.getElementById('fullFeedbackModal')?.style?.display = 'none';
  document.getElementById('flagComment').value = '';
  document.getElementById('flagModal').style.display = 'flex';
}

function closeFlagModal() {
  document.getElementById('flagModal').style.display = 'none';
  flagAssignmentId = null;
}

function sendFlag() {
  const comment = document.getElementById('flagComment').value;
  alert(`Feedback flagged with comment:\n${comment}`);
  closeFlagModal();
}
