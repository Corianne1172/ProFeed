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
  
  // Toggle sidebar collapse
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-btn");
  const sidebar = document.getElementById("sidebar");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const ctx = document.getElementById('professorChart').getContext('2d');

  const professorChart = new Chart(ctx, {
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
          ticks: {
            stepSize: 20
          },
          title: {
            display: true,
            text: 'Quantity'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Student Activity',
          font: {
            size: 18
          }
        },
        legend: {
          display: false
        }
      }
    }
  });
});

const classesContainer = document.getElementById('classesContainer');

// Example data store (you can replace this with backend data later)
let classes = [];

// Render classes or placeholder
function renderClasses() {
  classesContainer.innerHTML = '';

  if (classes.length === 0) {
    // Show placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder';
    placeholder.textContent = 'No classes created yet. Click the + button to create a class.';
    classesContainer.appendChild(placeholder);

    // Add plus button fixed on screen to create class
    addAddClassButton();
  } else {
    // Remove any existing add button (to avoid duplicates)
    const existingAddBtn = document.querySelector('.add-class-btn');
    if (existingAddBtn) existingAddBtn.remove();

    // Render each class card
    classes.forEach((cls, index) => {
      const card = document.createElement('div');
      card.className = 'class-card';

      // Title
      const titleLink = document.createElement('a');
      titleLink.href = `prof_classdash.html?className=${encodeURIComponent(cls.name)}`;
      titleLink.textContent = cls.name;
      titleLink.classList.add('class-link');  // For styling if you want
      card.appendChild(titleLink);

      // Description if any
      if (cls.description) {
        const desc = document.createElement('p');
        desc.textContent = cls.description;
        card.appendChild(desc);
      }

      // Three dots menu
      const menuDots = document.createElement('div');
      menuDots.className = 'menu-dots';
      menuDots.textContent = '⋮';
      card.appendChild(menuDots);

      // Delete menu hidden by default
      const deleteMenu = document.createElement('div');
      deleteMenu.className = 'delete-menu';
      deleteMenu.textContent = 'Delete Class';
      card.appendChild(deleteMenu);

      // Toggle delete menu on dots click
      menuDots.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = deleteMenu.style.display === 'block';
        closeAllDeleteMenus();
        deleteMenu.style.display = isVisible ? 'none' : 'block';
      });

      // Delete class on menu click
      deleteMenu.addEventListener('click', () => {
        if (confirm(`Delete class "${cls.name}"? This action cannot be undone.`)) {
          classes.splice(index, 1);
          renderClasses();
        }
      });

      classesContainer.appendChild(card);
    });

    // Add plus button on top right corner to add more classes
    addAddClassButton();
  }
}

// Close all delete menus (for UX)
function closeAllDeleteMenus() {
  document.querySelectorAll('.delete-menu').forEach(menu => {
    menu.style.display = 'none';
  });
}

// Add the plus button to add classes
function addAddClassButton() {
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

// Hide delete menus if clicking outside
document.body.addEventListener('click', () => {
  closeAllDeleteMenus();
});

// Initial render
renderClasses();

function createClassElement(classId, className) {
  const div = document.createElement('div');
  div.classList.add('class-item');
  div.dataset.classId = classId;

  const link = document.createElement('a');
  link.href = `prof_classdash.html?classId=${classId}`;
  link.textContent = className;

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-class');
  deleteBtn.textContent = '⋮';
  // Add delete event listener here

  div.appendChild(link);
  div.appendChild(deleteBtn);

  return div;
}

function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }

    document.addEventListener('DOMContentLoaded', () => {
      const className = getQueryParam('className');
      if (className) {
        document.getElementById('classTitle').textContent = `Class Dashboard: ${className}`;
        document.getElementById('classNameDisplay').textContent = `Class: ${className}`;
      } else {
        document.getElementById('classTitle').textContent = 'No class selected.';
        document.getElementById('classNameDisplay').textContent = 'Class: None';
      }
    });

    // Set class title from URL param 'className'
    document.addEventListener('DOMContentLoaded', () => {
  // Set class name from URL
  const params = new URLSearchParams(window.location.search);
  const className = params.get('className') || 'Unknown Class';

  const classTitleEl = document.getElementById('classTitle');
  const classNameDisplay = document.getElementById('classNameDisplay');

  if (classTitleEl) classTitleEl.textContent = `${className} Dashboard`;
  if (classNameDisplay) classNameDisplay.textContent = `Class: ${className}`;

  // Handle rubric upload
  const uploadBtn = document.getElementById('uploadClassRubricBtn');
  const fileInput = document.getElementById('classRubricFile');
  const statusMsg = document.getElementById('classRubricUploadStatus');

  if (uploadBtn && fileInput && statusMsg) {
    uploadBtn.addEventListener('click', async () => {
      if (!fileInput.files.length) {
        alert('Please select a rubric file to upload.');
        return;
      }

      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append('rubricFile', file);

      // Append class name if selected
      if (className) {
      formData.append('class', className);
      }


      statusMsg.textContent = 'Uploading rubric...';

      try {
        const response = await fetch('/api/upload/reference', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (response.ok) {
          statusMsg.textContent = result.message || 'Rubric uploaded successfully!';
          fileInput.value = ''; // Reset the input
        } else {
          statusMsg.textContent = result.error || 'Failed to upload rubric.';
        }
      } catch (err) {
        console.error('Upload error:', err);
        statusMsg.textContent = 'Upload failed. Please try again.';
      }
    });
  }
});
