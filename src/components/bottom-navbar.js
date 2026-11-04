import { applyTheme } from "../theme.js";
import "../styles/dark-mode.css";
applyTheme();

class BottomNavbar extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
            <nav class="navbar fixed-bottom bg-white border-top">
                <div class="container-fluid d-flex justify-content-around py-1">

                    <a href="/main.html" class="text-center text-dark text-decoration-none">
                        <i class="bi bi-house-fill fs-4 d-block"></i>
                        <small>Home</small>
                    </a>

                    <a href="/discover.html" class="text-center text-dark text-decoration-none">
                        <i class="bi bi-search fs-4 d-block"></i>
                        <small>Search</small>
                    </a>

                    <a href="#" class="text-center text-dark text-decoration-none">
                        <i class="bi bi-heart fs-4 d-block"></i>
                        <small>My Activities</small>
                    </a>

                    <a href="/profile.html" class="text-center text-dark text-decoration-none">
                        <i class="bi bi-person-fill fs-4 d-block"></i>
                        <small>You</small>
                    </a>

                </div>
            </nav>
        `;
  }
}

customElements.define('bottom-navbar', BottomNavbar);
