document.addEventListener("DOMContentLoaded", () => {
	const siteHeader = document.querySelector(".site-header");

	if (siteHeader) {
		function updateHeaderScrolled() {
			siteHeader.classList.toggle("is-scrolled", window.scrollY > 4);
		}

		updateHeaderScrolled();
		window.addEventListener("scroll", updateHeaderScrolled, { passive: true });
	}

	const copyrightYear = document.querySelector("#copyright-year");

	if (copyrightYear) {
		copyrightYear.textContent = new Date().getFullYear();
	}

	const navToggle = document.querySelector(".nav-toggle");
	const siteNav = document.querySelector(".site-nav");

	if (!navToggle || !siteNav) {
		return;
	}

	const navLinks = siteNav.querySelectorAll("a");

	function openNav() {
		navToggle.setAttribute("aria-expanded", "true");
		document.body.classList.add("nav-open");
		const firstLink = navLinks[0];
		if (firstLink) {
			firstLink.focus();
		}
	}

	function closeNav(options) {
		const restoreFocus = options && options.restoreFocus;
		navToggle.setAttribute("aria-expanded", "false");
		document.body.classList.remove("nav-open");
		if (restoreFocus) {
			navToggle.focus();
		}
	}

	navToggle.addEventListener("click", () => {
		const isOpen = navToggle.getAttribute("aria-expanded") === "true";
		if (isOpen) {
			closeNav();
		} else {
			openNav();
		}
	});

	navLinks.forEach((link) => {
		link.addEventListener("click", () => closeNav());
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
			closeNav({ restoreFocus: true });
		}
	});
});
