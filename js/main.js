function setHeroViewportHeight() {
	document.documentElement.style.setProperty("--hero-vh", `${window.innerHeight}px`);
}

setHeroViewportHeight();

let heroViewportWidth = window.innerWidth;
window.addEventListener("resize", () => {
	if (window.innerWidth !== heroViewportWidth) {
		heroViewportWidth = window.innerWidth;
		setHeroViewportHeight();
	}
});

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

document.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector("#contact-form");

	if (!form) {
		return;
	}

	const statusEl = form.querySelector(".contact-form__status");
	const submitButton = form.querySelector(".contact-form__submit");
	const validatedFields = form.querySelectorAll("input[required], textarea[required]");

	const phoneCode = form.querySelector("#contact-phone-code");
	const phoneNumber = form.querySelector("#contact-phone");
	const phoneFull = form.querySelector("#contact-phone-full");

	function updatePhoneFull() {
		const number = phoneNumber.value.trim();
		phoneFull.value = number ? `+${phoneCode.value} ${number}` : "";
	}

	if (phoneCode && phoneNumber && phoneFull) {
		phoneCode.addEventListener("change", updatePhoneFull);
		phoneNumber.addEventListener("input", updatePhoneFull);
	}

	function fieldErrorMessage(field) {
		if (field.validity.valueMissing) {
			return "This field is required.";
		}
		if (field.validity.typeMismatch && field.type === "email") {
			return "Enter a valid email address.";
		}
		if (field.validity.tooShort) {
			return `Enter at least ${field.minLength} characters.`;
		}
		return "Check this field and try again.";
	}

	function validateField(field) {
		const errorEl = document.getElementById(field.getAttribute("aria-describedby"));
		const wrapper = field.closest(".form-field");
		const isValid = field.checkValidity();

		if (wrapper) {
			wrapper.classList.toggle("form-field--invalid", !isValid);
		}
		if (errorEl) {
			errorEl.textContent = isValid ? "" : fieldErrorMessage(field);
		}

		return isValid;
	}

	validatedFields.forEach((field) => {
		field.addEventListener("input", () => validateField(field));
		field.addEventListener("blur", () => validateField(field));
	});

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		let formIsValid = true;
		validatedFields.forEach((field) => {
			if (!validateField(field)) {
				formIsValid = false;
			}
		});

		const hCaptchaResponse = form.querySelector("textarea[name=h-captcha-response]");
		if (!hCaptchaResponse || !hCaptchaResponse.value) {
			formIsValid = false;
			statusEl.textContent = "Please complete the captcha before sending.";
			statusEl.className = "contact-form__status contact-form__status--error";
		}

		if (!formIsValid) {
			const firstInvalid = form.querySelector(".form-field--invalid input, .form-field--invalid textarea");
			if (firstInvalid) {
				firstInvalid.focus();
			}
			return;
		}

		submitButton.disabled = true;
		statusEl.textContent = "Sending your message...";
		statusEl.className = "contact-form__status";

		try {
			const response = await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				headers: { Accept: "application/json" },
				body: new FormData(form),
			});
			const result = await response.json();

			if (result.success) {
				statusEl.textContent = "Message sent. We'll get back to you soon.";
				statusEl.classList.add("contact-form__status--success");
				form.reset();
				validatedFields.forEach((field) => {
					field.closest(".form-field").classList.remove("form-field--invalid");
				});
			} else {
				statusEl.textContent = "Something went wrong. Please try again or email us directly.";
				statusEl.classList.add("contact-form__status--error");
			}
		} catch {
			statusEl.textContent = "Something went wrong. Please try again or email us directly.";
			statusEl.classList.add("contact-form__status--error");
		} finally {
			submitButton.disabled = false;
		}
	});
});
