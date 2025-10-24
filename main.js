// --- GOOGLE LOGIN LOGIC ---
function handleCredentialResponse(response) {
  const data = decodeJwtResponse(response.credential);
  console.log("Google user data:", data);

  // Save user in localStorage
  localStorage.setItem("user", JSON.stringify(data));
  showApp(data);
}

function decodeJwtResponse(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

function showApp(user) {
  document.getElementById("login-page").classList.add("hidden");
  document.getElementById("app-container").classList.remove("hidden");

  // Personalize sidebar and header
  document.getElementById("user-name").textContent = user.name;
  document.getElementById("welcome-text").textContent = `Good morning, ${user.given_name} 👋`;
  document.getElementById("user-photo").src = user.picture;
}

function logout() {
  localStorage.removeItem("user");
  document.getElementById("app-container").classList.add("hidden");
  document.getElementById("login-page").classList.remove("hidden");
}

document.getElementById("logout-btn").addEventListener("click", logout);

// Auto-login if stored
window.onload = () => {
  const stored = localStorage.getItem("user");
  if (stored) {
    showApp(JSON.parse(stored));
  }
};

// --- NAVIGATION LOGIC ---
const menuItems = document.querySelectorAll(".menu-item");
const dashboard = document.getElementById("dashboard");
const templateView = document.getElementById("template-view");

menuItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    menuItems.forEach((el) => el.classList.remove("active"));
    item.classList.add("active");

    const page = item.dataset.page;

    if (page === "dashboard") {
      dashboard.classList.add("active");
      templateView.classList.remove("active");
    } else {
      dashboard.classList.remove("active");
      templateView.classList.add("active");
      loadTemplate(page);
    }
  });
});

function loadTemplate(page) {
  templateView.innerHTML = `
    <h2>${page.replace(/-/g, " ").toUpperCase()}</h2>
    <p>Editor area for the <strong>${page}</strong> template will appear here.</p>
    <div class="editor-placeholder">
      <textarea placeholder="Start editing your ${page} content..."></textarea>
    </div>
  `;
}
