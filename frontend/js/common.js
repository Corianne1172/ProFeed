// Sidebar toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-btn");
  const sidebar = document.getElementById("sidebar");
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }
});

// Helper: Get class from URL
function getSelectedClass() {
  const params = new URLSearchParams(window.location.search);
  return params.get('class') || '';
}

// Utility: Tab show/hide
function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}
