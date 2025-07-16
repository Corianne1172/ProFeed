document.addEventListener('DOMContentLoaded', () => {
  const classSelect = document.getElementById('classSelect');
  const selected = getSelectedClass();

  if (classSelect) {
    if (selected) classSelect.value = selected;
    classSelect.addEventListener('change', function () {
      if (this.value) {
        window.location.href = `class.html?class=${this.value}`;
      }
    });

    if (window.location.pathname.endsWith('class.html') && !selected) {
      window.location.href = 'index.html';
    }
  }

  if (document.getElementById('inProgressList')) {
    populateInProgress();
    populateFeedback();
  }
});

// Dummy data
const inProgressAssignments = [
  { title: "Essay 2", status: "Analyzing...", submitted: "2025-07-05" },
  { title: "Project 1", status: "Queued", submitted: "2025-07-06" }
];

function populateInProgress() {
  const ul = document.getElementById('inProgressList');
  ul.innerHTML = '';
  inProgressAssignments.forEach(a => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${a.title}</strong> - ${a.status} (submitted ${a.submitted})`;
    ul.appendChild(li);
  });
}
