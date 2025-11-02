const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strength-bar");
const feedback = document.getElementById("feedback");
const issuesList = document.getElementById("issues");
const breachStatus = document.getElementById("breachStatus");

// ✅ Predefined common password list (static)
const commonPasswords = [
  "password", "123456", "123456789", "qwerty", "abc123", "password1",
  "admin", "letmein", "welcome", "iloveyou", "123123", "root", "1234",
  "111111", "12345", "12345678", "qwertyuiop", "user", "default", "login",
  "monkey", "dragon", "sunshine", "princess", "football", "baseball", 
  "shadow", "master", "superman", "hello", "freedom", "whatever"
];

// 🧠 Password strength checking
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

  // Length check
  if (val.length >= 8) strength++;
  else issues.push("❌ Too short — use at least 8 characters.");

  // Uppercase
  if (/[A-Z]/.test(val)) strength++;
  else issues.push("⚠️ Add uppercase letters (A–Z).");

  // Lowercase
  if (/[a-z]/.test(val)) strength++;
  else issues.push("⚠️ Add lowercase letters (a–z).");

  // Numbers
  if (/\d/.test(val)) strength++;
  else issues.push("⚠️ Include numbers (0–9).");

  // Special chars
  if (/[@$!%*?&^#()_\-+=<>]/.test(val)) strength++;
  else issues.push("⚠️ Add special symbols like @, #, $, %, etc.");

  // Common password check
  if (commonPasswords.includes(val.toLowerCase())) {
    strength = 0;
    issues = ["🚨 This password is too common! Choose something unique."];
  }

  // Display strength
  const colors = ["#ff4b5c", "#ffb347", "#ffe600", "#9acd32", "#00c853"];
  const texts = ["Very Weak ❌", "Weak ⚠️", "Fair ⚙️", "Good ✅", "Strong 💪"];

  strengthBar.style.width = (strength * 20) + "%";
  strengthBar.style.backgroundColor = colors[strength - 1] || "#2f3136";
  feedback.textContent = texts[strength - 1] || "";

  // Update feedback list
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
    breachStatus.textContent = "🚨 This password has been leaked in known data breaches!";
  } else {
    breachStatus.style.color = "#00c853";
    breachStatus.textContent = "✅ Not found in known breaches.";
  }
});

// 🔐 HIBP API check (secure k-anonymity method)
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
