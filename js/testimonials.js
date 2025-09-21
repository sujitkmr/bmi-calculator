const testimonialCards = document.getElementById('testimonialCards');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Testimonials data
const testimonials = [
  { name: "Rohan K.", text: "The BMI tips helped me stay on track! Highly recommended." },
  { name: "Priya S.", text: "Amazing guidance and easy-to-follow advice for daily fitness." },
  { name: "Anil M.", text: "I love how simple and practical the suggestions are." },
  { name: "Sneha R.", text: "Very user-friendly BMI calculator with useful tips." },
  { name: "Vikram T.", text: "Great platform for tracking my health and diet plan." }
];

// Clear fallback & inject testimonials dynamically
testimonialCards.innerHTML = "";
testimonials.forEach(t => {
  const card = document.createElement('div');
  card.classList.add('testimonial-card');
  card.innerHTML = `<p>"${t.text}"</p><h4>- ${t.name}</h4>`;
  testimonialCards.appendChild(card);
});

let cards = Array.from(testimonialCards.children);
let currentIndex = 0;
const gap = 20; // space between cards

function scrollToIndex(index) {
  if (cards.length === 0) return;
  const cardWidth = cards[0].offsetWidth + gap;
  testimonialCards.scrollTo({
    left: cardWidth * index,
    behavior: 'smooth'
  });
  currentIndex = index;
}

function scrollNext() {
  let nextIndex = (currentIndex + 1) % cards.length;
  scrollToIndex(nextIndex);
}

function scrollPrev() {
  let prevIndex = (currentIndex - 1 + cards.length) % cards.length;
  scrollToIndex(prevIndex);
}

nextBtn.addEventListener('click', scrollNext);
prevBtn.addEventListener('click', scrollPrev);

// Auto scroll every 5s
setInterval(scrollNext, 5000);

// Adjust scroll on resize
window.addEventListener('resize', () => scrollToIndex(currentIndex));
