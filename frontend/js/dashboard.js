document.addEventListener('DOMContentLoaded', () => {
  const classContainer = document.getElementById('studentClassesContainer');
  if (!classContainer) return;

  if (studentClasses.length === 0) {
    classContainer.innerHTML = '<div class="placeholder">You are not enrolled in any classes yet.</div>';
    return;
  }

  studentClasses.forEach(cls => {
    const card = document.createElement('div');
    card.className = 'class-card';
    card.onclick = () => {
      window.location.href = `studentClassDash.html?className=${encodeURIComponent(cls.name)}`;
    };

    card.innerHTML = `<h3>${cls.name}</h3><p>${cls.description}</p>`;
    classContainer.appendChild(card);
  });
});

const studentClasses = [
  { name: 'CS 115', description: 'Intro to CS' },
  { name: 'Psch 220', description: 'Programming in R' },
  { name: 'Biology 450', description: 'Cell Biology' }
];
