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

    const feedbackText = await response.text();

    if (response.ok) {
      feedbackAssignments.push({
        id: feedbackAssignments.length + 1,
        title: `Assignment ${feedbackAssignments.length + 1}`,
        feedback: JSON.parse(feedbackText)
      });

      fileInput.value = "";
      populateFeedback();
      showTab("reviewed");
    } else {
      alert(feedbackText || "Failed to submit assignment.");
    }
  } catch (err) {
    console.error(err);
    alert(`Upload error: ${err.message}`);
  }
}
