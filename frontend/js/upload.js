let feedbackAssignments = [
  {
    id: 1,
    title: "Assignment 1",
    feedback: "Clear and concise. Well-organized. Minor grammar errors. Properly cited. Strong analysis."
  },  
    {
    id: 2,
    title: "Essay 1",
    feedback: "Needs improvement. Lacks coherence. Several grammar mistakes. Missing sources. Analysis was superficial."
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

function formatFeedback(text) {
  return `<p>${text}</p>`;
}


function closeFullFeedbackModal() {
  document.getElementById('fullFeedbackModal').style.display = 'none';
}

let flagAssignmentId = null;

function openFlagModal(assignmentId = null) {
  if (assignmentId) flagAssignmentId = assignmentId;
  const modal = document.getElementById('fullFeedbackModal');
if (modal && modal.style) {
  modal.style.display = 'none';
}

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

async function submitAssignment() {
  const fileInput = document.getElementById("assignmentFile");
  const file = fileInput?.files[0];

  if (!file) {
    alert("Please upload a file.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch('/api/upload/assignment', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      feedbackAssignments.push({
        id: feedbackAssignments.length + 1,
        title: `Assignment ${feedbackAssignments.length + 1}`,
        feedback: result.feedback
      });

      fileInput.value = "";
      populateFeedback();
    } else {
      alert(result.error || "Failed to submit assignment.");
    }
  } catch (err) {
    console.error(err);
    alert(`Upload error: ${err.message}`);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('submitAssignmentBtn');
  btn.addEventListener('click', submitAssignment);
  populateFeedback();
});
