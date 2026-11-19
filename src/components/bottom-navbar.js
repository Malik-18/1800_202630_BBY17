
import { applyTheme } from "../theme.js";
import "../styles/dark-mode.css";
applyTheme();

class BottomNavbar extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
            <style>
                /* Default: black like before */
                .nav-item-bottom {
                    color: #888888;
                    transition: color 0.2s ease, transform 0.2s ease;
                }

                /* Hover: grey */
                .nav-item-bottom:hover {
                    color: #888888;
                    transform: translateY(-3px);
                }

                /* Active page: grey */
                .nav-item-bottom.active {
                    color: #888888;
                    font-weight: 600;
                }
            </style>

            <nav class="navbar fixed-bottom bg-white border-top">
                <div class="container-fluid d-flex justify-content-around py-1">

                    <a href="/main.html" class="nav-item-bottom text-center text-decoration-none">
                        <i class="bi bi-house-fill fs-4 d-block"></i>
                        <small>Home</small>
                    </a>

                    <a href="/discover.html" class="nav-item-bottom text-center text-decoration-none">
                        <i class="bi bi-search fs-4 d-block"></i>
                        <small>Search</small>
                    </a>

                    <a href="/savedActivities.html" class="nav-item-bottom text-center text-decoration-none">
                        <i class="bi bi-heart fs-4 d-block"></i>
                        <small>My Activities</small>
                    </a>

                    <a href="/profile.html" class="nav-item-bottom text-center text-decoration-none">
                        <i class="bi bi-person-fill fs-4 d-block"></i>
                        <small>You</small>
                    </a>

                </div>
            </nav>
        `;

        // Find the current page
        const currentPage = window.location.pathname;

        // Highlight the active navigation item
        this.querySelectorAll(".nav-item-bottom").forEach((link) => {
            if (link.getAttribute("href") === currentPage) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        });
    }
}

customElements.define("bottom-navbar", BottomNavbar);
