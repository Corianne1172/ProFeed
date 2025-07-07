function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

function submitAssignment() {
  const text = document.getElementById("assignmentText").value;
  if (!text.trim()) {
    alert("Please enter some assignment text.");
    return;
  }

  showTab("inprogress");

  // Simulate sending to backend
  fetch("https://your-langchain-backend.com/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assignment: text })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("feedbackResult").innerHTML = formatFeedback(data);
      showTab("reviewed");
    })
    .catch(err => {
      alert("Error getting feedback.");
      console.error(err);
    });
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

function flagFeedback() {
  alert("Feedback has been flagged for professor review.");
}
