//import { logoutUser, onAuthReady } from '/src/authentication.js';   // Our function to log out the user



class SiteNavbar extends HTMLElement {
    constructor() {
        super();
        this.renderNavbar();
        this.renderAuthControls();
    }

    renderNavbar() {
        this.innerHTML = `
            <!-- Navbar: single source of truth -->
            <nav class="navbar navbar-expand-lg navbar-dark bg-success">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">
                        <img src="/images/Botanical Olive Swirl Emblem.png" height="40" alt="Never Late to Try logo">
                        Never Late to Try
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="/">Home</a>
                            </li>
                        </ul>
                        <div class="d-flex align-items-center gap-2 ms-lg-2" id="rightControls">
                            <form class="d-flex align-items-center gap-2 my-2 my-lg-0" id="navSearch" role="search">
                                <input class="form-control d-none d-sm-block w-auto" type="search" placeholder="Search" aria-label="Search">
                                <button class="btn btn-outline-light d-none d-sm-inline-block" type="submit">Search</button>
                            </form>
                            <div id="authControls" class="auth-controls d-flex align-items-center gap-2 my-2 my-lg-0">
                                <!-- populated by JS -->
                            </div>
                        </div>

                    </div>
                </div>
            </nav>
        `;
    }

    /**
 * Displays Log in or Log out button in the navbar based on Firebase authentication status.
 * Updates automatically when the user's login status changes.
 * Uses callbacks to detect auth changes and handle the Log out button click.
 */

    renderAuthControls() {
        const authControls = this.querySelector('#authControls');

        authControls.innerHTML = `
            <a class="btn btn-outline-light"
               href="/login.html">
                Log in
            </a>
        `;
    }
} // Closes the SiteNavbar class

customElements.define('site-navbar', SiteNavbar);
