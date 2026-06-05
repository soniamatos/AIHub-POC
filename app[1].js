const assistants = [
  {
    id: "student-study-planner",
    name: "Study Sprint Planner",
    audience: "Students",
    summary: "Turns upcoming tests, assignments, and activities into a realistic weekly study plan.",
    tags: ["Planning", "Student Support"],
    helpful: 34,
    link: "https://chatgpt.com/g/g-example-study-sprint"
  },
  {
    id: "student-writing-coach",
    name: "Writing Coach",
    audience: "Students",
    summary: "Helps students brainstorm, outline, revise, and check clarity while keeping their own voice.",
    tags: ["Writing", "Student Support"],
    helpful: 52,
    link: "https://chatgpt.com/g/g-example-writing-coach"
  },
  {
    id: "student-math-lab",
    name: "Step-by-Step Math Lab",
    audience: "Students",
    summary: "Explains math problems with guided hints, practice questions, and common mistake checks.",
    tags: ["Student Support"],
    helpful: 28,
    link: "https://chatgpt.com/g/g-example-math-lab"
  },
  {
    id: "student-policy-guide",
    name: "Student Policy Navigator",
    audience: "Students",
    summary: "Answers student-friendly questions about attendance, devices, grading, and campus expectations.",
    tags: ["Policy", "Student Support"],
    helpful: 19,
    link: "https://chatgpt.com/g/g-example-student-policy"
  },
  {
    id: "teacher-lesson-builder",
    name: "Lesson Builder",
    audience: "Teachers",
    summary: "Creates lesson outlines, objectives, activities, checks for understanding, and exit tickets.",
    tags: ["Planning"],
    helpful: 41,
    link: "https://chatgpt.com/g/g-example-lesson-builder"
  },
  {
    id: "teacher-rubric-studio",
    name: "Rubric Studio",
    audience: "Teachers",
    summary: "Drafts clear rubrics by grade level, subject, learning goals, and performance bands.",
    tags: ["Planning", "Writing"],
    helpful: 37,
    link: "https://chatgpt.com/g/g-example-rubric-studio"
  },
  {
    id: "teacher-family-email",
    name: "Family Email Helper",
    audience: "Teachers",
    summary: "Drafts warm, professional parent and guardian messages for updates, concerns, and celebrations.",
    tags: ["Writing", "Student Support"],
    helpful: 46,
    link: "https://chatgpt.com/g/g-example-family-email"
  },
  {
    id: "teacher-differentiation",
    name: "Differentiation Coach",
    audience: "Teachers",
    summary: "Adapts activities for varied reading levels, language needs, IEP supports, and enrichment.",
    tags: ["Planning", "Student Support"],
    helpful: 31,
    link: "https://chatgpt.com/g/g-example-differentiation"
  },
  {
    id: "leader-briefing",
    name: "Principal Briefing Assistant",
    audience: "School Leaders",
    summary: "Summarizes school updates into talking points for morning meetings, board prep, and staff notes.",
    tags: ["Writing", "Planning"],
    helpful: 58,
    link: "https://chatgpt.com/g/g-example-principal-briefing",
    featured: true
  },
  {
    id: "leader-data-sensemaker",
    name: "Data Sensemaker",
    audience: "School Leaders",
    summary: "Helps interpret attendance, assessment, and survey trends into plain-language insights.",
    tags: ["Data", "Planning"],
    helpful: 24,
    link: "https://chatgpt.com/g/g-example-data-sensemaker"
  },
  {
    id: "leader-policy-drafter",
    name: "Policy Drafting Partner",
    audience: "School Leaders",
    summary: "Drafts and revises policy language for clarity, consistency, and audience-specific communication.",
    tags: ["Policy", "Writing"],
    helpful: 22,
    link: "https://chatgpt.com/g/g-example-policy-drafter"
  },
  {
    id: "leader-meeting-prep",
    name: "Meeting Prep Copilot",
    audience: "School Leaders",
    summary: "Builds agendas, pre-reads, decision logs, and follow-up notes for leadership meetings.",
    tags: ["Planning", "Writing"],
    helpful: 29,
    link: "https://chatgpt.com/g/g-example-meeting-prep"
  }
];

const state = {
  audience: "All",
  tag: "All",
  search: "",
  feedback: JSON.parse(localStorage.getItem("aiHubFeedback") || "{}")
};

const grid = document.querySelector("#assistantGrid");
const emptyState = document.querySelector("#emptyState");
const resultsCount = document.querySelector("#resultsCount");
const preferenceSummary = document.querySelector("#preferenceSummary");
const totalAssistants = document.querySelector("#totalAssistants");
const featuredCard = document.querySelector("#featuredCard");
const searchInput = document.querySelector("#searchInput");

function audienceClass(audience) {
  return audience.toLowerCase().replaceAll(" ", "-");
}

function savePreferences() {
  localStorage.setItem("aiHubFeedback", JSON.stringify(state.feedback));
}

function setFeedback(id, value) {
  state.feedback[id] = state.feedback[id] === value ? null : value;
  savePreferences();
  render();
}

function assistantMatches(item) {
  const query = state.search.trim().toLowerCase();
  const audienceMatch = state.audience === "All" || item.audience === state.audience;
  const tagMatch = state.tag === "All" || item.tags.includes(state.tag);
  const queryMatch =
    !query ||
    [item.name, item.audience, item.summary, item.tags.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(query);

  return audienceMatch && tagMatch && queryMatch;
}

function createAssistantCard(item, options = {}) {
  const article = document.createElement("article");
  article.className = options.featured ? "featured-card-content" : "assistant-card";

  const feedback = state.feedback[item.id];
  const helpfulCount = item.helpful + (feedback === "up" ? 1 : 0);
  const tagMarkup = item.tags.map((tag) => `<span>${tag}</span>`).join("");
  const openLabel = options.featured ? "Open featured GPT" : "Open GPT";

  article.innerHTML = `
    <div class="card-top">
      <p class="meta-line"><span>Audience</span>${item.audience}</p>
    </div>
    <h3>${item.name}</h3>
    <p>${item.summary}</p>
    <div class="tag-list" aria-label="Topics"><strong>Topics</strong>${tagMarkup}</div>
    <div class="card-footer">
      <a class="open-link" href="${item.link}" target="_blank" rel="noreferrer">${openLabel}</a>
      <div class="feedback" aria-label="Feedback for ${item.name}">
        <button class="icon-button helpful ${feedback === "up" ? "is-active" : ""}" type="button" title="Mark as helpful" aria-label="Mark ${item.name} as helpful" data-feedback="up" data-id="${item.id}"><span aria-hidden="true">&#128077;</span><span>${helpfulCount}</span></button>
      </div>
    </div>
  `;

  return article;
}

function renderFeatured() {
  const featured = assistants.find((item) => item.featured) || assistants[0];
  featuredCard.replaceChildren(createAssistantCard(featured, { featured: true }));
}

function render() {
  const filtered = assistants.filter(assistantMatches);
  grid.replaceChildren(...filtered.map((item) => createAssistantCard(item)));
  emptyState.hidden = filtered.length > 0;
  resultsCount.textContent = `Showing ${filtered.length} of ${assistants.length} approved GPTs`;
  const feedbackCount = Object.values(state.feedback).filter(Boolean).length;
  preferenceSummary.textContent = `${feedbackCount} helpful vote${feedbackCount === 1 ? "" : "s"} added in this browser`;
  renderFeatured();
}

function selectAudience(audience) {
  state.audience = audience;
  document.querySelectorAll("[data-audience]").forEach((tab) => {
    const active = tab.dataset.audience === audience;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  document.querySelector("#directory").scrollIntoView({ behavior: "smooth" });
  render();
}

document.querySelectorAll("[data-audience]").forEach((button) => {
  button.addEventListener("click", () => {
    selectAudience(button.dataset.audience);
  });
});

document.querySelectorAll("[data-nav-audience]").forEach((button) => {
  button.addEventListener("click", () => {
    selectAudience(button.dataset.navAudience);
  });
});

document.querySelectorAll("[data-tag]").forEach((button) => {
  button.addEventListener("click", () => {
    state.tag = button.dataset.tag;
    document.querySelectorAll("[data-tag]").forEach((chip) => chip.classList.toggle("is-active", chip === button));
    render();
  });
});

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  render();
});

document.addEventListener("click", (event) => {
  const feedbackButton = event.target.closest("[data-feedback]");

  if (feedbackButton) {
    setFeedback(feedbackButton.dataset.id, feedbackButton.dataset.feedback);
  }
});

document.querySelector("#resetPreferences").addEventListener("click", () => {
  state.feedback = {};
  savePreferences();
  render();
});

totalAssistants.textContent = assistants.length;
render();
