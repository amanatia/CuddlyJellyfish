document.addEventListener("DOMContentLoaded", () => {
  const nextButton = document.getElementById("next-riddle");
  const riddleText = document.getElementById("riddle-text");
  const answerText = document.getElementById("answer");

  nextButton.addEventListener("click", async () => {

    try {
      const response = await fetch("/api/riddle");
      const data = await response.json();

      riddleText.textContent = data.riddle;
      answerText.textContent = data.answer;
    } catch (err) {
      console.error("Error fetching new riddle:", err);
      riddleText.textContent = "Oops, failed to load a new riddle.";
      answerText.textContent = "";
    } finally {
      nextButton.disabled = false;
      nextButton.textContent = "Next Riddle";
    }
  });
});