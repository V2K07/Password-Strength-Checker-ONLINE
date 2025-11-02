const password = document.getElementById("password");
const strengthBar = document.getElementById("strength-bar");
const feedback = document.getElementById("feedback");

password.addEventListener("input", () => {
  const val = password.value;
  let strength = 0;

  // Scoring criteria
  if (val.length >= 8) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/[a-z]/.test(val)) strength++;
  if (/\d/.test(val)) strength++;
  if (/[@$!%*?&]/.test(val)) strength++;

  // Update visual bar
  const colors = ["#ff4b5c", "#ffb347", "#ffe600", "#9acd32", "#00c853"];
  const texts = ["Very Weak ❌", "Weak ⚠️", "Fair ⚙️", "Good ✅", "Strong 💪"];
  
  strengthBar.style.width = (strength * 20) + "%";
  strengthBar.style.backgroundColor = colors[strength - 1] || "#2f3136";
  feedback.textContent = texts[strength - 1] || "";
});
