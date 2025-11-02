const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strength-bar");
const feedback = document.getElementById("feedback");
const issuesList = document.getElementById("issues");

// A list of common passwords (you can expand this)
const commonPasswords = [
  "password", "123456", "123456789", "qwerty", "abc123", "password1", 
  "admin", "letmein", "welcome", "iloveyou", "123123", "root", "1234", 
  "111111", "12345", "12345678", "qwertyuiop"
];

passwordInput.addEventListener("input", () => {
  const val = passwordInput.value;
  let strength = 0;
  let issues = [];

  // --- CHECK RULES ---
  if (val.length >= 8) strength++;
  else issues.push("❌ Password is too short. Use at least 8 characters.");

  if (/[A-Z]/.test(val)) strength++;
  else issues.push("⚠️ Add uppercase letters (A–Z) for better complexity.");

  if (/[a-z]/.test(val)) strength++;
  else issues.push("⚠️ Add lowercase letters (a–z) for balance.");

  if (/\d/.test(val)) strength++;
  else issues.push("⚠️ Include numbers (0–9) to strengthen it.");

  if (/[@$!%*?&^#()_\-+=<>]/.test(val)) strength++;
  else issues.push("⚠️ Add special symbols like @, #, $, %, & etc.");

  if (commonPasswords.includes(val.toLowerCase())) {
    strength = 0;
    issues = ["🚨 This password is too common! Choose something unique."];
  }

  // --- DISPLAY RESULTS ---
  const colors = ["#ff4b5c", "#ffb347", "#ffe600", "#9acd32", "#00c853"];
  const texts = ["Very Weak ❌", "Weak ⚠️", "Fair ⚙️", "Good ✅", "Strong 💪"];

  strengthBar.style.width = (strength * 20) + "%";
  strengthBar.style.backgroundColor = colors[strength - 1] || "#2f3136";
  feedback.textContent = texts[strength - 1] || "";

  // Clear issues and re-add
  issuesList.innerHTML = "";
  issues.forEach(issue => {
    const li = document.createElement("li");
    li.textContent = issue;
    issuesList.appendChild(li);
  });
});
