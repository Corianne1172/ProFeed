if (typeof feedbackAssignments === 'undefined') {
  var feedbackAssignments = [];
}
let currentAssignmentId = null;


document.addEventListener('DOMContentLoaded', () => {
  // Initialize the default tab
  showTab('upload');
});

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
function showTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.style.display = 'block';
  }
  
  if (tabName === 'reviewed') {
    populateFeedback();
  } else if (tabName === 'inprogress') {
    populateInProgress();
  }
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
  if (!ul) return;

  ul.innerHTML = '';
  
  const inProgress = feedbackAssignments.filter(a => a.status !== 'reviewed');
  
  inProgress.forEach(a => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="inprogress-item">
        <h4>${a.title}</h4>
        <p>Status: ${a.status}</p>
      </div>
    `;
    ul.appendChild(li);
  });
}

// Populate Feedback
function populateFeedback() {
  const ul = document.getElementById('feedbackList');
  if (!ul) return;

  ul.innerHTML = '';
  
  const reviewedAssignments = feedbackAssignments.filter(a => a.status === 'reviewed');
  
  reviewedAssignments.forEach(a => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="feedback-item">
        <h4>${a.title}</h4>
        <p>${a.feedback.substring(0, 100)}...</p>
        <div class="feedback-actions">
          <button onclick="viewFullFeedback(${a.id})">View Full Feedback</button>
          <button onclick="openFlagModal(${a.id})">Flag Feedback</button>
        </div>
      </div>
    `;
    ul.appendChild(li);
  });
}

// Modal logic
let flagAssignmentId = null;

function openFlagModal(id) {
  currentAssignmentId = id;
  document.getElementById('flagComment').value = '';
  document.getElementById('flagModal').style.display = 'flex';
}
function closeFlagModal() {
  const modal = document.getElementById('flagModal');
  if (modal) modal.style.display = 'none';
}
function sendFlag() {
  const comment = document.getElementById('flagComment').value;
  alert(`Feedback flagged for professor with comment:\n${comment}`);
  closeFlagModal();
}

// Full feedback modal
function viewFullFeedback(id) {
  const assignment = feedbackAssignments.find(a => a.id === id);
  if (!assignment) return;

  const modal = document.getElementById('fullFeedbackModal');
  const content = document.getElementById('fullFeedbackContent');
  
  if (modal && content) {
    content.innerHTML = `
      <h3>${assignment.title}</h3>
      <div class="assignment-text">${assignment.text}</div>
      <hr>
      <div class="feedback-text">${assignment.feedback}</div>
    `;
    modal.style.display = 'block';
    currentAssignmentId = id;
  }
}

function closeFullFeedbackModal() {
  const modal = document.getElementById('fullFeedbackModal');
  if (modal) modal.style.display = 'none';
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
  const assignmentText = document.getElementById('assignmentText').value;
  const fileInput = document.getElementById('assignmentFile');
  const formData = new FormData();
  
  if (assignmentText) {
    formData.append('text', assignmentText);
  }
  
  if (fileInput.files.length > 0) {
    formData.append('file', fileInput.files[0]);
  }

  if (!assignmentText && fileInput.files.length === 0) {
    alert('Please enter text or upload a file');
    return;
  }

  try {
    const response = await fetch('/api/upload/assignment', {
      method: 'POST',
      body: formData
    });

    const feedbackText = await response.text();

    if (response.ok) {
      // Add to in-progress list
      const newAssignment = {
        id: Date.now(),
        title: `Assignment ${feedbackAssignments.length + 1}`,
        text: assignmentText,
        status: 'in-progress'
      };
      
      feedbackAssignments.push(newAssignment);
      
      document.getElementById('assignmentText').value = '';
      fileInput.value = '';
      
      showTab('inprogress');
    } else {
      alert(feedbackText || 'Failed to submit assignment');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Network error submitting assignment');
  }
}

