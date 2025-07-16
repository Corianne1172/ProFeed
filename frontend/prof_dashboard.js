document.addEventListener('DOMContentLoaded', () => {
  // --- Parse className from URL once ---
  const params = new URLSearchParams(window.location.search);
  const className = params.get('className') || 'Unknown Class';

  // --- Update class title and display ---
  const classTitleEl = document.getElementById('classTitle');
  const classNameDisplay = document.getElementById('classNameDisplay');
  if (classTitleEl) classTitleEl.textContent = `${className} Dashboard`;
  if (classNameDisplay) classNameDisplay.textContent = `Class: ${className}`;

  // --- Dummy data for demonstration ---
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

  // --- Populate lists ---
  function populateSubmissions() {
    const ul = document.getElementById('submissionList');
    if (!ul) return;
    ul.innerHTML = '';
    submissions.forEach(s => {
      const li = document.createElement('li');
      li.innerHTML = `<span><strong>${s.title}</strong> by ${s.student} (${s.status}, ${s.submitted})</span>`;
      ul.appendChild(li);
    });
  }

  function populateReview() {
    const ul = document.getElementById('reviewList');
    if (!ul) return;
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
    if (!ul) return;
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

  populateSubmissions();
  populateReview();
  populateFlagged();

  // --- Tab switching ---
  window.showTab = function(id) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
    const el = document.getElementById(id);
    if (el) el.style.display = "block";
  }

  // --- Review Modal Logic ---
  let currentReviewId = null;
  window.openReviewModal = function(id) {
    const assignment = toReview.find(a => a.id === id);
    if (!assignment) return;
    const reviewContent = document.getElementById('reviewContent');
    const profFeedback = document.getElementById('profFeedback');
    if (!reviewContent || !profFeedback) return;

    reviewContent.innerHTML = `
      <h4>${assignment.title} by ${assignment.student}</h4>
      <p>${assignment.text}</p>
    `;
    profFeedback.value = '';
    currentReviewId = id;
    const modal = document.getElementById('reviewModal');
    if (modal) modal.style.display = 'flex';
  }

  window.closeReviewModal = function() {
    const modal = document.getElementById('reviewModal');
    if (modal) modal.style.display = 'none';
    currentReviewId = null;
  }

  window.submitProfFeedback = function() {
    const profFeedback = document.getElementById('profFeedback');
    if (!profFeedback) return;
    const feedback = profFeedback.value;
    alert(`Feedback submitted: ${feedback}`);
    closeReviewModal();
  }

  // --- Flagged Modal Logic ---
  let currentFlaggedId = null;
  window.openFlaggedModal = function(id) {
    const flagged = flaggedFeedbacks.find(f => f.id === id);
    if (!flagged) return;
    const flaggedContent = document.getElementById('flaggedContent');
    if (!flaggedContent) return;

    flaggedContent.innerHTML = `
      <h4>${flagged.assignment} - Flagged by ${flagged.student}</h4>
      <p><strong>Student Comment:</strong> ${flagged.comment}</p>
      <p><strong>Details:</strong> ${flagged.details}</p>
    `;
    currentFlaggedId = id;
    const modal = document.getElementById('flaggedModal');
    if (modal) modal.style.display = 'flex';
  }

  window.closeFlaggedModal = function() {
    const modal = document.getElementById('flaggedModal');
    if (modal) modal.style.display = 'none';
    currentFlaggedId = null;
  }

  window.resolveFlag = function() {
    alert('Flag marked as resolved!');
    closeFlaggedModal();
  }

  // --- Sidebar toggle ---
  const toggleBtn = document.getElementById("toggle-btn");
  const sidebar = document.getElementById("sidebar");
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  // --- Chart rendering ---
  const chartCanvas = document.getElementById('professorChart');
  if (chartCanvas) {
    const ctx = chartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Students', 'AI Feedback generated', 'AI Practice Sets generated'],
        datasets: [{
          label: 'Count',
          data: [150, 462, 311],
          backgroundColor: ['#3498db', '#2ecc71', '#f39c12'],
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 20 },
            title: { display: true, text: 'Quantity' }
          }
        },
        plugins: {
          title: { display: true, text: 'Student Activity', font: { size: 18 } },
          legend: { display: false }
        }
      }
    });
  }

  // --- Classes rendering ---
  const classesContainer = document.getElementById('classesContainer');
  let classes = [];

  function renderClasses() {
    if (!classesContainer) return;
    classesContainer.innerHTML = '';

    if (classes.length === 0) {
      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder';
      placeholder.textContent = 'No classes created yet. Click the + button to create a class.';
      classesContainer.appendChild(placeholder);
      addAddClassButton();
    } else {
      const existingAddBtn = document.querySelector('.add-class-btn');
      if (existingAddBtn) existingAddBtn.remove();

      classes.forEach((cls, index) => {
        const card = document.createElement('div');
        card.className = 'class-card';

        const titleLink = document.createElement('a');
        titleLink.href = `prof_classdash.html?className=${encodeURIComponent(cls.name)}`;
        titleLink.textContent = cls.name;
        titleLink.classList.add('class-link');
        card.appendChild(titleLink);

        if (cls.description) {
          const desc = document.createElement('p');
          desc.textContent = cls.description;
          card.appendChild(desc);
        }

        const menuDots = document.createElement('div');
        menuDots.className = 'menu-dots';
        menuDots.textContent = '⋮';
        card.appendChild(menuDots);

        const deleteMenu = document.createElement('div');
        deleteMenu.className = 'delete-menu';
        deleteMenu.textContent = 'Delete Class';
        card.appendChild(deleteMenu);

        menuDots.addEventListener('click', e => {
          e.stopPropagation();
          const isVisible = deleteMenu.style.display === 'block';
          closeAllDeleteMenus();
          deleteMenu.style.display = isVisible ? 'none' : 'block';
        });

        deleteMenu.addEventListener('click', () => {
          if (confirm(`Delete class "${cls.name}"? This action cannot be undone.`)) {
            classes.splice(index, 1);
            renderClasses();
          }
        });

        classesContainer.appendChild(card);
      });
      addAddClassButton();
    }
  }

  function closeAllDeleteMenus() {
    document.querySelectorAll('.delete-menu').forEach(menu => {
      menu.style.display = 'none';
    });
  }

  function addAddClassButton() {
    if (document.querySelector('.add-class-btn')) return; // Avoid duplicates
    const addBtn = document.createElement('div');
    addBtn.className = 'add-class-btn';
    addBtn.textContent = '+';
    document.body.appendChild(addBtn);

    addBtn.addEventListener('click', () => {
      const name = prompt('Enter new class name:');
      if (name && name.trim() !== '') {
        const description = prompt('Enter class description (optional):');
        classes.push({ name: name.trim(), description: description ? description.trim() : '' });
        renderClasses();
      }
    });
  }

  document.body.addEventListener('click', () => {
    closeAllDeleteMenus();
  });

  renderClasses();

  // --- Rubric upload handler ---
  function handleRubricUpload(fileInputId, statusId) {
    const fileInput = document.getElementById(fileInputId);
    const statusMsg = document.getElementById(statusId);

    if (!fileInput || !statusMsg) return;

    const file = fileInput.files[0];
    if (!file) {
      alert('Please select a rubric file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('rubricFile', file);
    if (className) {
      formData.append('class', className);
    }

    statusMsg.textContent = 'Uploading rubric...';

    fetch('/api/upload/reference', {
      method: 'POST',
      body: formData
    })
      .then(async res => {
        const result = await res.json();
        if (res.ok) {
          statusMsg.textContent = result.message || 'Rubric uploaded successfully!';
          fileInput.value = '';
        } else {
          statusMsg.textContent = result.error || 'Failed to upload rubric.';
        }
      })
      .catch(err => {
        console.error('Upload error:', err);
        statusMsg.textContent = 'Upload failed. Please try again.';
      });
  }

  const classRubricBtn = document.getElementById('uploadClassRubricBtn');
  if (classRubricBtn) {
    classRubricBtn.addEventListener('click', () => handleRubricUpload('classRubricFile', 'classRubricUploadStatus'));
  }

  const assignmentRubricBtn = document.getElementById('uploadAssignmentRubricBtn');
  if (assignmentRubricBtn) {
    assignmentRubricBtn.addEventListener('click', () => handleRubricUpload('assignmentRubricFile', 'assignmentRubricUploadStatus'));
  }

  // --- Class selection alert ---
  const classSelect = document.getElementById('classSelect');
  if (classSelect) {
    classSelect.addEventListener('change', function() {
      alert(`Switched to class: ${this.value}`);
      // Add filtering logic here if needed
    });
  }

  // --- Assignments list rendering ---
  const assignments = [
    { id: 1, title: "Essay 1" },
    { id: 2, title: "Project 1" },
    { id: 3, title: "Essay 2" },
  ];

  function renderAssignments() {
    const ul = document.getElementById('assignmentsList');
    if (!ul) return;
    ul.innerHTML = '';

    assignments.forEach(assignment => {
      const li = document.createElement('li');
      li.style.marginBottom = '0.5rem';

      const a = document.createElement('a');
      a.href = `assignment_overview.html?assignmentId=${assignment.id}`;
      a.textContent = assignment.title;
      a.style.color = 'black';
      a.style.textDecoration = 'none';
      a.addEventListener('mouseover', () => a.style.textDecoration = 'underline');
      a.addEventListener('mouseout', () => a.style.textDecoration = 'none');

      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  renderAssignments();
document.addEventListener('DOMContentLoaded', () => {
  // Parse assignmentId and assignmentName from URL query (for demo)
  const params = new URLSearchParams(window.location.search);
  const assignmentId = params.get('assignmentId') || '0';
  const assignmentName = 'Assignment #' + assignmentId;  // In real app, fetch assignment name from API

  document.getElementById('assignmentTitle').textContent = assignmentName;

  // Sample data arrays — these would be fetched from your backend normally
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

  // Populate Submissions list
  function populateSubmissions() {
    const ul = document.getElementById('submissionList');
    ul.innerHTML = '';
    submissions.forEach(s => {
      const li = document.createElement('li');
      li.textContent = `${s.title} by ${s.student} — ${s.status} on ${s.submitted}`;
      ul.appendChild(li);
    });
  }

  // Populate Need Review list
  function populateReview() {
    const ul = document.getElementById('reviewList');
    ul.innerHTML = '';
    toReview.forEach(a => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${a.title}</strong> by ${a.student} 
                      <button onclick="openReviewModal(${a.id})">Review</button>`;
      ul.appendChild(li);
    });
  }

  // Populate Flagged Feedback list
  function populateFlagged() {
    const ul = document.getElementById('flaggedList');
    ul.innerHTML = '';
    flaggedFeedbacks.forEach(f => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${f.assignment}</strong> (by ${f.student}) 
                      <button onclick="openFlaggedModal(${f.id})">View</button>`;
      ul.appendChild(li);
    });
  }

  populateSubmissions();
  populateReview();
  populateFlagged();

  // --- Review Modal ---
  let currentReviewId = null;
  window.openReviewModal = function(id) {
    const assignment = toReview.find(a => a.id === id);
    if (!assignment) return;
    const reviewContent = document.getElementById('reviewContent');
    const profFeedback = document.getElementById('profFeedback');

    reviewContent.innerHTML = `
      <h3>${assignment.title} by ${assignment.student}</h3>
      <p>${assignment.text}</p>
    `;
    profFeedback.value = '';
    currentReviewId = id;
    document.getElementById('reviewModal').style.display = 'flex';
  };

  window.closeReviewModal = function() {
    document.getElementById('reviewModal').style.display = 'none';
    currentReviewId = null;
  };

  window.submitProfFeedback = function() {
    const profFeedback = document.getElementById('profFeedback').value.trim();
    if (!profFeedback) {
      alert('Please enter feedback before submitting.');
      return;
    }
    alert(`Feedback submitted for review ID ${currentReviewId}: ${profFeedback}`);
    closeReviewModal();
  };

  // --- Flagged Modal ---
  let currentFlaggedId = null;
  window.openFlaggedModal = function(id) {
    const flagged = flaggedFeedbacks.find(f => f.id === id);
    if (!flagged) return;
    const flaggedContent = document.getElementById('flaggedContent');

    flaggedContent.innerHTML = `
      <h3>${flagged.assignment} - Flagged by ${flagged.student}</h3>
      <p><strong>Comment:</strong> ${flagged.comment}</p>
      <p><strong>Details:</strong> ${flagged.details}</p>
    `;
    currentFlaggedId = id;
    document.getElementById('flaggedModal').style.display = 'flex';
  };

  window.closeFlaggedModal = function() {
    document.getElementById('flaggedModal').style.display = 'none';
    currentFlaggedId = null;
  };

  window.resolveFlag = function() {
    alert(`Flag with ID ${currentFlaggedId} marked as resolved.`);
    closeFlaggedModal();
  };
});


});
