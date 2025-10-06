
// forms.js - Contact + Newsletter Forms AJAX
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  const successMsg = document.getElementById("success-msg");

  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      fetch("https://formsubmit.co/ajax/contactgymbmi@gmail.com", {
        method: "POST",
        body: formData
      })
      .then(res => res.json())
      .then(() => {
        if (successMsg) successMsg.style.display = "block";
        this.reset();
        setTimeout(() => { if (successMsg) successMsg.style.display = "none"; }, 5000);
      })
      .catch(() => alert("❌ Error sending message, please try again."));
    });
  }

  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterSuccess = document.getElementById("newsletter-success");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      fetch("https://formsubmit.co/ajax/contactgymbmi@gmail.com", {
        method: "POST",
        body: formData
      })
      .then(res => res.json())
      .then(() => {
        if (newsletterSuccess) newsletterSuccess.style.display = "block";
        this.reset();
        setTimeout(() => { if (newsletterSuccess) newsletterSuccess.style.display = "none"; }, 5000);
      })
      .catch(() => alert("❌ Error subscribing, please try again."));
    });

  }

  // ✅ NEW: Call Me Back Form
  const callBackForm = document.getElementById("callBackForm");
  const callBackSuccess = document.getElementById("callBackSuccess");
  if (callBackForm) {
    callBackForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      fetch("https://formsubmit.co/ajax/contactgymbmi@gmail.com", {
        method: "POST",
        body: formData
      })
      .then(res => res.json())
      .then(() => {
        if (callBackSuccess) callBackSuccess.style.display = "block";
        this.reset();
        setTimeout(() => { if (callBackSuccess) callBackSuccess.style.display = "none"; }, 5000);
      })
      .catch(() => alert("❌ Error sending message, please try again."));
    });
  }
});


