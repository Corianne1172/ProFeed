// Dummy data for demonstration
const submissions = [
    { id: 1, student: "Alice", title: "Essay 2", status: "Submitted", submitted: "2025-07-05" },
    { id: 2, student: "Bob", title: "Project 1", status: "Submitted", submitted: "2025-07-06" }
  ];
  
  const toReview = [
    { id: 1, student: "Alice", title: "Essay 2", text: "Lorem ipsum dolor sit amet..." }
  ];
  
  const flaggedFeedbacks = [
    { id: 1, student: "Bob", assignment: "Essay 1", comment: "Feedback unclear", details: "Needs more explanation on thesis." }
  ];
  
  // Populate lists
  window.addEventListener('DOMContentLoaded', () => {
    populateSubmissions();
    populateReview();
    populateFlagged();
  
    // Class selection logic
    const classSelect = document.getElementById('classSelect');
    classSelect.addEventListener('change', function() {
      // Filter logic can be added here
      alert(`Switched to class: ${this.value}`);
    });
  });
  
  function showTab(id) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
    document.getElementById(id).style.display = "block";
  }
  
  function populateSubmissions() {
    const ul = document.getElementById('submissionList');
    ul.innerHTML = '';
    submissions.forEach(s => {
      const li = document.createElement('li');
      li.innerHTML = `<span><strong>${s.title}</strong> by ${s.student} (${s.status}, ${s.submitted})</span>`;
      ul.appendChild(li);
    });
  }
  
  function populateReview() {
    const ul = document.getElementById('reviewList');
    ul.innerHTML = '';
    toReview.forEach(a => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span><strong>${a.title}</strong> by ${a.student}</span>
        <button onclick="openReviewModal(${a.id})">Review</button>
      `;
      ul.appendChild(li);
    });
  }
  
  function populateFlagged() {
    const ul = document.getElementById('flaggedList');
    ul.innerHTML = '';
    flaggedFeedbacks.forEach(f => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span><strong>${f.assignment}</strong> (by ${f.student})</span>
        <button onclick="openFlaggedModal(${f.id})">View</button>
      `;
      ul.appendChild(li);
    });
  }
  
  // Modal logic
  let currentReviewId = null;
  function openReviewModal(id) {
    const assignment = toReview.find(a => a.id === id);
    if (!assignment) return;
    document.getElementById('reviewContent').innerHTML = `
      <h4>${assignment.title} by ${assignment.student}</h4>
      <p>${assignment.text}</p>
    `;
    document.getElementById('profFeedback').value = '';
    currentReviewId = id;
    document.getElementById('reviewModal').style.display = 'flex';
  }
  function closeReviewModal() {
    document.getElementById('reviewModal').style.display = 'none';
    currentReviewId = null;
  }
  function submitProfFeedback() {
    const feedback = document.getElementById('profFeedback').value;
    alert(`Feedback submitted: ${feedback}`);
    closeReviewModal();
  }
  
  let currentFlaggedId = null;
  function openFlaggedModal(id) {
    const flagged = flaggedFeedbacks.find(f => f.id === id);
    if (!flagged) return;
    document.getElementById('flaggedContent').innerHTML = `
      <h4>${flagged.assignment} - Flagged by ${flagged.student}</h4>
      <p><strong>Student Comment:</strong> ${flagged.comment}</p>
      <p><strong>Details:</strong> ${flagged.details}</p>
    `;
    currentFlaggedId = id;
    document.getElementById('flaggedModal').style.display = 'flex';
  }
  function closeFlaggedModal() {
    document.getElementById('flaggedModal').style.display = 'none';
    currentFlaggedId = null;
  }
  function resolveFlag() {
    alert('Flag marked as resolved!');
    closeFlaggedModal();
  }
  