/* =========================================================
   app.js — Vanilla ES6
   Features:
   - Mobile nav toggle
   - Smooth section reveal via IntersectionObserver
   - Projects modal with detailed carousel slides
   - Accessible focus management
   ========================================================= */

// ---- Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  // Close menu on link click (mobile)
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

// ---- Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Reveal on scroll (IntersectionObserver)
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ---- Projects Modal + Carousel
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalStack = document.getElementById('modalStack');
const modalPoints = document.getElementById('modalPoints');
const carouselTrack = document.getElementById('carouselTrack');
const closeBtn = document.querySelector('.modal-close');

// ===============================
// PROJECT DATA
// ===============================
const PROJECTS = {
  park: {
    title: 'Online Park Ticketing System',
    stack: 'Java • Spring Boot • Angular • AWS',
    points: [
      'End-to-end web application for park ticket booking with secure JWT authentication and role-based access control.',
      'Integrated Google Calendar API to manage time-slot bookings and automatic confirmation emails.',
      'Deployed microservices via Docker & AWS Elastic Beanstalk with CI/CD pipelines for continuous delivery.',
      'Improved response time by 35% using optimized SQL queries and service caching.'
    ],
    slides: [
      {
        h: 'System Architecture',
        p: 'Angular frontend communicates with Spring Boot microservices exposing REST APIs. JPA with Hibernate manages MySQL data. Dockerized services run on AWS Elastic Beanstalk for scalability.'
      },
      {
        h: 'Security & Reliability',
        p: 'Implemented JWT-based authentication and Spring Security filters for multi-role user control. Configured fail-safe retries and API rate limiting for reliability.'
      },
      {
        h: 'Performance Impact',
        p: 'Reduced average page load time by 35%, increased booking throughput by 25%, and achieved 99.9% uptime with AWS monitoring.'
      }
    ]
  },

  movie: {
    title: 'Movie Rating & Recommendation App',
    stack: 'Python • Flask • React • PostgreSQL',
    points: [
      'Built a hybrid movie recommendation system combining collaborative and content-based filtering using Surprise library.',
      'Created asynchronous Flask APIs and React frontend for personalized suggestions with tokenized authentication.',
      'Implemented lazy loading and pagination to reduce load time by 30% and API latency by 150ms.',
      'Enabled user profile persistence and data analytics dashboards for engagement tracking.'
    ],
    slides: [
      {
        h: 'Architecture Overview',
        p: 'Flask serves as the backend with REST endpoints, React handles UI interactions. Data is stored in PostgreSQL and accessed through SQLAlchemy models. Axios handles async calls with JWT-secured tokens.'
      },
      {
        h: 'Recommender Engine',
        p: 'Collaborative filtering based on user–item similarity combined with content-based attributes (genre, cast). Model performance measured using RMSE and precision metrics.'
      },
      {
        h: 'User Impact',
        p: 'Delivered 92% recommendation accuracy (vs 80% baseline), reduced average response latency by 150ms, and improved UX satisfaction metrics by 1.3×.'
      }
    ]
  },

  expense: {
    title: 'Expense Tracker Platform',
    stack: 'AWS • Node.js • React • Prisma ORM',
    points: [
      'Developed a full-stack personal finance tracker with live transaction sync using OAuth2 bank APIs.',
      'Implemented AI-driven budgeting rules via AWS Lambda, with SNS notifications for spending alerts.',
      'Enabled real-time analytics dashboards powered by Prisma ORM, React hooks, and AWS CloudWatch logs.',
      'Reduced data ingestion latency by 40% and achieved 25% lower AWS resource cost through optimization.'
    ],
    slides: [
      {
        h: 'Cloud Architecture',
        p: 'Serverless Node.js functions on AWS Lambda process data from bank APIs, store normalized entries in DynamoDB, and push notifications via SNS. React frontend fetches summaries through secured REST APIs.'
      },
      {
        h: 'Observability & Monitoring',
        p: 'Integrated AWS CloudWatch and X-Ray tracing to visualize function performance and transaction metrics, improving debugging time by 60%.'
      },
      {
        h: 'Impact Metrics',
        p: 'Achieved 40% faster transaction ingestion and 25% monthly AWS cost reduction, while maintaining 99.8% uptime and seamless user experience.'
      }
    ]
  }
};

// ===============================
// Modal Management
// ===============================
function openProject(key) {
  const data = PROJECTS[key];
  if (!data) return;

  modalTitle.textContent = data.title;
  modalStack.textContent = data.stack;

  // Points
  modalPoints.innerHTML = '';
  data.points.forEach(pt => {
    const li = document.createElement('li');
    li.textContent = pt;
    modalPoints.appendChild(li);
  });

  // Slides
  carouselTrack.innerHTML = '';
  data.slides.forEach(s => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `<h4>${s.h}</h4><p class="muted">${s.p}</p>`;
    carouselTrack.appendChild(slide);
  });

  currentIndex = 0;
  updateCarousel();

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  closeBtn.focus();
}

document.querySelectorAll('.open-modal').forEach(btn => {
  btn.addEventListener('click', e => {
    const key = e.currentTarget.dataset.project;
    openProject(key);
  });
});

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

// ===============================
// Carousel Controls
// ===============================
let currentIndex = 0;
function updateCarousel() {
  const width = carouselTrack.getBoundingClientRect().width;
  carouselTrack.style.transform = `translateX(${-currentIndex * width}px)`;
}
window.addEventListener('resize', updateCarousel);

document.querySelector('.carousel-btn.prev').addEventListener('click', () => {
  const count = carouselTrack.children.length;
  currentIndex = (currentIndex - 1 + count) % count;
  updateCarousel();
});
document.querySelector('.carousel-btn.next').addEventListener('click', () => {
  const count = carouselTrack.children.length;
  currentIndex = (currentIndex + 1) % count;
  updateCarousel();
});
