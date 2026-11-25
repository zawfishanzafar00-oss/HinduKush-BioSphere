
(() => {
  function startAuth() {
    if (!window.supabase || !window.HB_SUPABASE_URL || !window.HB_SUPABASE_KEY) {
      console.error("Supabase is not configured. Check supabase-config.js and the Supabase SDK.");
      return;
    }

    const client = window.supabase.createClient(
      window.HB_SUPABASE_URL,
      window.HB_SUPABASE_KEY
    );

    window.HB_SUPABASE = client;

    const styles = document.createElement("style");
    styles.textContent = `
      #hb-account-btn {
        border: 1px solid #245c49;
        background: #245c49;
        color: white;
        padding: 9px 15px;
        border-radius: 22px;
        cursor: pointer;
        font-weight: 600;
      }
      #hb-auth-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(10, 25, 20, .72);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 18px;
      }
      #hb-auth-panel {
        background: #fffdf7;
        color: #193d32;
        width: min(420px, 100%);
        padding: 26px;
        border-radius: 20px;
        box-shadow: 0 18px 60px rgba(0,0,0,.3);
        position: relative;
      }
      #hb-auth-panel h2 { margin: 0 0 8px; }
      #hb-auth-panel p { color: #52675e; }
      #hb-auth-panel input {
        box-sizing: border-box;
        width: 100%;
        padding: 12px;
        margin: 7px 0 12px;
        border: 1px solid #b9c9bd;
        border-radius: 9px;
        font-size: 15px;
      }
      #hb-auth-panel button {
        padding: 11px 15px;
        border: 0;
        border-radius: 9px;
        cursor: pointer;
        font-weight: 600;
      }
      #hb-auth-submit {
        background: #245c49;
        color: white;
        width: 100%;
      }
      #hb-auth-switch {
        background: transparent;
        color: #245c49;
        margin-top: 10px;
      }
      #hb-auth-close {
        position: absolute;
        right: 15px;
        top: 12px;
        background: transparent;
        color: #193d32;
        font-size: 22px;
      }
      #hb-auth-message {
        min-height: 22px;
        font-size: 14px;
        overflow-wrap: anywhere;
      }
    `;
    document.head.appendChild(styles);

    const topActions = document.querySelector(".top-actions");
    if (!topActions) {
      console.error("Could not find the website's top actions area.");
      return;
    }

    const accountButton = document.createElement("button");
    accountButton.id = "hb-account-btn";
    accountButton.textContent = "Log In";
    topActions.appendChild(accountButton);

    const overlay = document.createElement("div");
    overlay.id = "hb-auth-overlay";
    overlay.innerHTML = `
      <section id="hb-auth-panel" role="dialog" aria-modal="true" aria-labelledby="hb-auth-title">
        <button id="hb-auth-close" aria-label="Close">&times;</button>
        <h2 id="hb-auth-title">Welcome to HinduKush BioSphere</h2>
        <p id="hb-auth-description">Log in to your account or create a new one.</p>
        <form id="hb-auth-form">
          <label for="hb-auth-email">Email address</label>
          <input id="hb-auth-email" type="email" autocomplete="email" required>
          <label for="hb-auth-password">Password</label>
          <input id="hb-auth-password" type="password" autocomplete="current-password" minlength="6" required>
          <button id="hb-auth-submit" type="submit">Log In</button>
        </form>
        <button id="hb-auth-switch" type="button">New here? Create an account</button>
        <p id="hb-auth-message" role="status" aria-live="polite"></p>
      </section>
    `;
    document.body.appendChild(overlay);

    const form = overlay.querySelector("#hb-auth-form");
    const emailInput = overlay.querySelector("#hb-auth-email");
    const passwordInput = overlay.querySelector("#hb-auth-password");
    const submitButton = overlay.querySelector("#hb-auth-submit");
    const switchButton = overlay.querySelector("#hb-auth-switch");
    const message = overlay.querySelector("#hb-auth-message");

    let mode = "login";
    let currentUser = null;

    function showMessage(text, isError = false) {
      message.textContent = text;
      message.style.color = isError ? "#a12b2b" : "#245c49";
    }

    function openModal() {
      overlay.style.display = "flex";
      showMessage("");
    }

    function closeModal() {
      overlay.style.display = "none";
    }

    function setMode(nextMode) {
      mode = nextMode;
      const isLogin = mode === "login";
      overlay.querySelector("#hb-auth-title").textContent =
        isLogin ? "Welcome back" : "Create your account";
      overlay.querySelector("#hb-auth-description").textContent =
        isLogin
          ? "Log in to access your account."
          : "Create an account to save your research activities.";
      submitButton.textContent = isLogin ? "Log In" : "Sign Up";
      switchButton.textContent = isLogin
        ? "New here? Create an account"
        : "Already have an account? Log in";
      passwordInput.autocomplete = isLogin ? "current-password" : "new-password";
      showMessage("");
    }

    function updateAccount(user) {
      currentUser = user || null;
      accountButton.textContent = currentUser ? "My Account" : "Log In";
      accountButton.title = currentUser ? currentUser.email : "Log in or sign up";
    }

    accountButton.addEventListener("click", async () => {
      if (!currentUser) {
        setMode("login");
        openModal();
        return;
      }

      const shouldLogout = window.confirm(
        "You are logged in as " + currentUser.email + ". Log out?"
      );

      if (shouldLogout) {
        const { error } = await client.auth.signOut();
        if (error) window.alert(error.message);
      }
    });

    overlay.querySelector("#hb-auth-close").addEventListener("click", closeModal);
    overlay.addEventListener("click", event => {
      if (event.target === overlay) closeModal();
    });

    switchButton.addEventListener("click", () => {
      setMode(mode === "login" ? "signup" : "login");
    });

    form.addEventListener("submit", async event => {
      event.preventDefault();
      submitButton.disabled = true;
      showMessage(mode === "login" ? "Logging in..." : "Creating your account...");

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      try {
        if (mode === "login") {
          const { error } = await client.auth.signInWithPassword({ email, password });
          if (error) throw error;
          showMessage("You are logged in!");
          closeModal();
        } else {
          const { data, error } = await client.auth.signUp({ email, password });
          if (error) throw error;

          if (data.session) {
            showMessage("Account created and logged in!");
            closeModal();
          } else {
            showMessage("Account created. Check your email for a confirmation link.");
          }
        }
      } catch (error) {
        showMessage(error.message || "Something went wrong. Please try again.", true);
      } finally {
        submitButton.disabled = false;
      }
    });

    client.auth.onAuthStateChange((_event, session) => {
      updateAccount(session?.user || null);
    });

    client.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Could not check login status:", error.message);
        return;
      }
      updateAccount(data.session?.user || null);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startAuth);
  } else {
    startAuth();
  }
})();
