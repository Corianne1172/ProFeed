// Helper: Get class from URL
function getSelectedClass() {
  const params = new URLSearchParams(window.location.search);
  return params.get('class') || '';
}

// Set class dropdown to current selection
window.addEventListener('DOMContentLoaded', () => {
  const classSelect = document.getElementById('classSelect');
  const selected = getSelectedClass();
  if (selected && classSelect) classSelect.value = selected;

  if (window.location.pathname.endsWith('class.html') && !selected) {
    // No class selected, redirect to overview
    window.location.href = 'index.html';
  }

  if (classSelect) {
    classSelect.addEventListener('change', function () {
      if (this.value) {
        window.location.href = `class.html?class=${this.value}`;
      }
    });
  }

  // Populate fake assignments if on class.html
  if (document.getElementById('inProgressList')) {
    populateInProgress();
    populateFeedback();
  }
});

// Tab logic
function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

// Dummy data
const inProgressAssignments = [
  { title: "Essay 2", status: "Analyzing...", submitted: "2025-07-05" },
  { title: "Project 1", status: "Queued", submitted: "2025-07-06" }
];

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

// Populate In Progress
function populateInProgress() {
  const ul = document.getElementById('inProgressList');
  ul.innerHTML = '';
  inProgressAssignments.forEach(a => {
    const li = document.createElement('li');
    li.innerHTML = `<span><strong>${a.title}</strong> - ${a.status} (submitted ${a.submitted})</span>`;
    ul.appendChild(li);
  });
}

// Populate Feedback
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

// Modal logic
let flagAssignmentId = null;

function openFlagModal(assignmentId) {
  flagAssignmentId = assignmentId;
  document.getElementById('flagComment').value = '';
  document.getElementById('flagModal').style.display = 'flex';
}
function closeFlagModal() {
  document.getElementById('flagModal').style.display = 'none';
  flagAssignmentId = null;
}
function sendFlag() {
  const comment = document.getElementById('flagComment').value;
  alert(`Feedback flagged for professor with comment:\n${comment}`);
  closeFlagModal();
}

// Full feedback modal
function viewFullFeedback(assignmentId) {
  const assignment = feedbackAssignments.find(a => a.id === assignmentId);
  if (!assignment) return;
  
  const feedbackHtml = typeof assignment.feedback === 'string'
  ? formatRawFeedback(assignment.feedback)
  : formatFeedback(assignment.feedback);
  
  document.getElementById('fullFeedbackContent').innerHTML = `
    <h4>${assignment.title} - Full Feedback</h4>
    ${feedbackHtml}
  `;
  // Set the flagAssignmentId for modal flagging
  flagAssignmentId = assignmentId;
  document.getElementById('fullFeedbackModal').style.display = 'flex';
}
function closeFullFeedbackModal() {
  document.getElementById('fullFeedbackModal').style.display = 'none';
  flagAssignmentId = null;
}

// Reuse flag modal from full feedback modal
function openFlagModal() {
  document.getElementById('fullFeedbackModal').style.display = 'none';
  document.getElementById('flagComment').value = '';
  document.getElementById('flagModal').style.display = 'flex';
}

// Format feedback for display
function formatFeedback(data) {
  return `
    <p><strong>Thesis:</strong> ${data.thesis}</p>
    <p><strong>Structure:</strong> ${data.structure}</p>
    <p><strong>Grammar:</strong> ${data.grammar}</p>
    <p><strong>Citations:</strong> ${data.citations}</p>
    <p><strong>Analysis:</strong> ${data.analysis}</p>
  `;
}

// Submit assignment (sends to backend for generated feedback)
async function submitAssignment() {
  const fileInput = document.getElementById("assignmentFile");
  const file = fileInput ? fileInput.files[0] : null;

  if (!file) {
    alert("Please upload a file.");
    return;
  }

  inProgressAssignments.push({
    title: `Assignment ${feedbackAssignments.length + 1}`,
    status: "Analyzing...",
    submitted: new Date().toISOString().split("T")[0]
  });
  populateInProgress();
  showTab("inprogress");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch('/api/upload/assignment', {
      method: 'POST',
      body: formData
    });

    const feedbackText = await response.text();

    if (response.ok) {
      // Add new feedback to list
      feedbackAssignments.push({
        id: feedbackAssignments.length + 1,
        title: `Assignment ${feedbackAssignments.length + 1}`,
        feedback: feedbackText
      });

      if (fileInput) fileInput.value = "";

      populateFeedback();
      showTab("reviewed");
    } else {
      alert(feedbackText || "Failed to submit assignment.");
    }
  } catch (error) {
    console.error("Upload error:", error);
    alert(`Network error: ${error.message}`);
  }
}

function formatRawFeedback(feedbackText) {
  const paragraphs = feedbackText.split('\n\n');
  return paragraphs.map(p => {
    if (/^\d+\.\s/.test(p.trim())) {
      const items = p.trim().split('\n').map(line => {
        return `<li>${line.replace(/^\d+\.\s/, '')}</li>`;
      }).join('');
      return `<ol>${items}</ol>`;
    }
    return `<p>${p}</p>`;
  }).join('');
}
