const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strength-bar");
const feedback = document.getElementById("feedback");
const issuesList = document.getElementById("issues");

// List of common passwords
const commonPasswords = [
  "password", "123456", "123456789", "qwerty", "abc123", "password1",
  "admin", "letmein", "welcome", "iloveyou", "123123", "root", "1234",
  "111111", "12345", "12345678", "qwertyuiop", "user", "default", "login"
];

// Check password strength
passwordInput.addEventListener("input", () => {
  const val = passwordInput.value;
  let strength = 0;
  let issues = [];

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

  const colors = ["#ff4b5c", "#ffb347", "#ffe600", "#9acd32", "#00c853"];
  const texts = ["Very Weak ❌", "Weak ⚠️", "Fair ⚙️", "Good ✅", "Strong 💪"];

  strengthBar.style.width = (strength * 20) + "%";
  strengthBar.style.backgroundColor = colors[strength - 1] || "#2f3136";
  feedback.textContent = texts[strength - 1] || "";

  // Show feedback issues
  issuesList.innerHTML = "";
  issues.forEach(issue => {
    const li = document.createElement("li");
    li.textContent = issue;
    issuesList.appendChild(li);
  });
});

// Add new common password
const addInput = document.getElementById("newCommonPassword");
const addButton = document.getElementById("addButton");
const addStatus = document.getElementById("addStatus");

addButton.addEventListener("click", () => {
  const newPwd = addInput.value.trim().toLowerCase();
  if (newPwd && !commonPasswords.includes(newPwd)) {
    commonPasswords.push(newPwd);
    addStatus.style.color = "#00c853";
    addStatus.textContent = `✅ Added "${newPwd}" to common password list.`;
  } else if (commonPasswords.includes(newPwd)) {
    addStatus.style.color = "#ffb347";
    addStatus.textContent = `⚠️ "${newPwd}" already exists in the list.`;
  } else {
    addStatus.style.color = "#ff4b5c";
    addStatus.textContent = "❌ Please enter a valid password.";
  }
  addInput.value = "";
});

// Upload a .txt file of common passwords
const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const lines = e.target.result.split(/\r?\n/).map(line => line.trim().toLowerCase());
    const added = lines.filter(line => line && !commonPasswords.includes(line));
    commonPasswords.push(...added);
    alert(`✅ Added ${added.length} new common passwords from file.`);
  };
  reader.readAsText(file);
});
