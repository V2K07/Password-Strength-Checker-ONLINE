const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strength-bar");
const feedback = document.getElementById("feedback");
const issuesList = document.getElementById("issues");
const breachStatus = document.getElementById("breachStatus");

// Default common passwords
const commonPasswords = [
  "password", "123456", "123456789", "qwerty", "abc123", "password1",
  "admin", "letmein", "welcome", "iloveyou", "123123", "root", "1234",
  "111111", "12345", "12345678", "qwertyuiop", "user", "default", "login"
];

// Strength checker
passwordInput.addEventListener("input", async () => {
  const val = passwordInput.value;
  if (!val) {
    strengthBar.style.width = "0%";
    feedback.textContent = "";
    issuesList.innerHTML = "";
    breachStatus.textContent = "";
    return;
  }

  let strength = 0;
  let issues = [];

  if (val.length >= 8) strength++;
  else issues.push("❌ Too short — use at least 8 characters.");

  if (/[A-Z]/.test(val)) strength++;
  else issues.push("⚠️ Add uppercase letters (A–Z).");

  if (/[a-z]/.test(val)) strength++;
  else issues.push("⚠️ Add lowercase letters (a–z).");

  if (/\d/.test(val)) strength++;
  else issues.push("⚠️ Include numbers (0–9).");

  if (/[@$!%*?&^#()_\-+=<>]/.test(val)) strength++;
  else issues.push("⚠️ Add special symbols like @, #, $, %, etc.");

  if (commonPasswords.includes(val.toLowerCase())) {
    strength = 0;
    issues = ["🚨 This password is too common! Pick something unique."];
  }

  const colors = ["#ff4b5c", "#ffb347", "#ffe600", "#9acd32", "#00c853"];
  const texts = ["Very Weak ❌", "Weak ⚠️", "Fair ⚙️", "Good ✅", "Strong 💪"];

  strengthBar.style.width = (strength * 20) + "%";
  strengthBar.style.backgroundColor = colors[strength - 1] || "#2f3136";
  feedback.textContent = texts[strength - 1] || "";

  issuesList.innerHTML = "";
  issues.forEach(issue => {
    const li = document.createElement("li");
    li.textContent = issue;
    issuesList.appendChild(li);
  });

  // Run Have I Been Pwned check
  breachStatus.textContent = "🔍 Checking for password breaches...";
  const breached = await checkHIBP(val);
  if (breached) {
    breachStatus.style.color = "#ff4b5c";
    breachStatus.textContent = "🚨 This password has been leaked in data breaches!";
  } else {
    breachStatus.style.color = "#00c853";
    breachStatus.textContent = "✅ Not found in known breaches.";
  }
});

// Add new weak password
document.getElementById("addButton").addEventListener("click", () => {
  const newPwd = document.getElementById("newCommonPassword").value.trim().toLowerCase();
  const status = document.getElementById("addStatus");

  if (newPwd && !commonPasswords.includes(newPwd)) {
    commonPasswords.push(newPwd);
    status.style.color = "#00c853";
    status.textContent = `✅ Added "${newPwd}" to common password list.`;
  } else if (commonPasswords.includes(newPwd)) {
    status.style.color = "#ffb347";
    status.textContent = `⚠️ "${newPwd}" already exists in the list.`;
  } else {
    status.style.color = "#ff4b5c";
    status.textContent = "❌ Enter a valid password.";
  }
  document.getElementById("newCommonPassword").value = "";
});

// Upload file with weak passwords
document.getElementById("fileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const lines = e.target.result.split(/\r?\n/).map(l => l.trim().toLowerCase());
    const added = lines.filter(l => l && !commonPasswords.includes(l));
    commonPasswords.push(...added);
    alert(`✅ Added ${added.length} new common passwords.`);
  };
  reader.readAsText(file);
});

// 🔐 HIBP API check
async function checkHIBP(password) {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-1", encoder.encode(password));
  const hash = Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();

  const prefix = hash.substring(0, 5);
  const suffix = hash.substring(5);

  try {
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();
    return data.includes(suffix);
  } catch (error) {
    console.error("HIBP API error:", error);
    return false;
  }
}
