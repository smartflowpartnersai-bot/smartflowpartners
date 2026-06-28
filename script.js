const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav-links");

toggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const form = document.getElementById("contactForm");
form.addEventListener("submit", event => {
  if (form.action.includes("TWOJ_KOD")) {
    event.preventDefault();
    document.getElementById("formNote").textContent =
      "Najpierw podmień TWOJ_KOD w pliku index.html na identyfikator formularza z Formspree.";
  }
});


// =========================
// Asystent Usprawnień
// =========================
const solutionLauncher = document.getElementById("solutionLauncher");
const solutionModal = document.getElementById("solutionModal");
const solutionWizard = document.getElementById("solutionWizard");
const wizardSteps = [...document.querySelectorAll(".wizard-step")];
const wizardNext = document.getElementById("wizardNext");
const wizardBack = document.getElementById("wizardBack");
const wizardControls = document.getElementById("wizardControls");
const wizardProgressBar = document.getElementById("wizardProgressBar");
const wizardStepLabel = document.getElementById("wizardStepLabel");
const wizardTime = document.getElementById("wizardTime");
let currentWizardStep = 1;

function openSolutionModal() {
  solutionModal.classList.add("open");
  solutionModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
  setTimeout(() => {
    const firstInput = solutionModal.querySelector(".wizard-step.active input, .wizard-step.active textarea");
    if (firstInput) firstInput.focus();
  }, 100);
}

function closeSolutionModal() {
  solutionModal.classList.remove("open");
  solutionModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
}

solutionLauncher.addEventListener("click", openSolutionModal);
document.querySelectorAll("[data-close-modal]").forEach(el => {
  el.addEventListener("click", closeSolutionModal);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && solutionModal.classList.contains("open")) {
    closeSolutionModal();
  }
});

function showWizardStep(step) {
  currentWizardStep = step;
  wizardSteps.forEach(item => {
    item.classList.toggle("active", Number(item.dataset.step) === step);
  });

  const isResult = step === 6;
  wizardControls.style.display = isResult ? "none" : "flex";
  wizardBack.disabled = step === 1;
  wizardNext.textContent = step === 5 ? "Pokaż rekomendację" : "Dalej";

  const progress = isResult ? 100 : step * 20;
  wizardProgressBar.style.width = `${progress}%`;
  wizardStepLabel.textContent = isResult ? "Rekomendacja gotowa" : `Pytanie ${step} z 5`;
  wizardTime.textContent = isResult ? "gotowe" : "około 5 minut";
}

function validateWizardStep(step) {
  const stepElement = wizardSteps.find(item => Number(item.dataset.step) === step);
  if (!stepElement) return false;

  const requiredInputs = [...stepElement.querySelectorAll("[required]")];
  for (const input of requiredInputs) {
    if (input.type === "radio") {
      const checked = stepElement.querySelector(`input[name="${input.name}"]:checked`);
      if (!checked) {
        const firstOption = stepElement.querySelector(".wizard-option > span");
        if (firstOption) {
          firstOption.animate(
            [{ transform: "translateX(0)" }, { transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "translateX(0)" }],
            { duration: 260 }
          );
        }
        return false;
      }
    } else if (!input.value.trim()) {
      input.focus();
      return false;
    }
  }
  return true;
}

function getWizardValue(name) {
  const field = solutionWizard.elements[name];
  if (!field) return "";
  if (field instanceof RadioNodeList) return field.value;
  return field.value;
}

function buildRecommendation() {
  const problem = getWizardValue("mainProblem");
  const goal = getWizardValue("goal");
  const frequency = getWizardValue("frequency");

  const recommendations = {
    manual: {
      title: "Automatyzacja procesu i prosty agent w Make",
      description: "Największy potencjał widzimy w połączeniu aplikacji, automatycznym przekazywaniu danych oraz ograniczeniu ręcznych, powtarzalnych czynności.",
      plan: [
        "Krótki audyt obecnego przepływu pracy",
        "Wybór czynności możliwych do automatyzacji",
        "Prototyp scenariusza w Make lub prostego agenta",
        "Pomiar oszczędności czasu i plan wdrożenia"
      ]
    },
    process: {
      title: "Audyt i przeprojektowanie procesu",
      description: "Najpierw warto uporządkować sposób działania, wskazać wąskie gardła i zaprojektować prostszy proces docelowy. Automatyzację dobierzemy dopiero do dobrze zdefiniowanego przepływu.",
      plan: [
        "Mapowanie procesu AS-IS",
        "Identyfikacja opóźnień, błędów i zbędnych kroków",
        "Projekt procesu TO-BE",
        "Roadmapa usprawnień i szybki prototyp"
      ]
    },
    data: {
      title: "Dashboard zarządczy w Power BI",
      description: "Rekomendujemy uporządkowanie źródeł danych, zdefiniowanie najważniejszych KPI i przygotowanie jednego, czytelnego widoku wspierającego decyzje.",
      plan: [
        "Analiza źródeł danych i potrzeb odbiorców",
        "Definicja KPI oraz modelu danych",
        "Prototyp dashboardu Power BI",
        "Automatyzacja odświeżania i dalszy rozwój"
      ]
    },
    ai: {
      title: "Warsztat transformacji AI i pilotaż",
      description: "Najlepszym pierwszym krokiem będzie wybór zastosowań AI o realnej wartości, ocena danych i ryzyk oraz uruchomienie niewielkiego, mierzalnego pilotażu.",
      plan: [
        "Ocena gotowości organizacji i danych",
        "Lista przypadków użycia AI",
        "Priorytetyzacja według wartości i trudności",
        "Prototyp najlepszego rozwiązania"
      ]
    }
  };

  let selected = recommendations[problem] || recommendations.process;

  if (goal === "decisions" && problem !== "data") {
    selected = {
      title: "Audyt procesu i dashboard Power BI",
      description: "Problem warto rozwiązać dwutorowo: uporządkować sposób zbierania danych, a następnie pokazać najważniejsze informacje w prostym dashboardzie.",
      plan: [
        "Analiza procesu i źródeł danych",
        "Definicja KPI oraz odpowiedzialności",
        "Prototyp dashboardu Power BI",
        "Plan automatyzacji raportowania"
      ]
    };
  }

  if (frequency === "daily") {
    selected.description += " Ponieważ problem występuje codziennie, nawet niewielkie usprawnienie może szybko przynieść zauważalny efekt.";
  }

  document.getElementById("resultTitle").textContent = selected.title;
  document.getElementById("resultDescription").textContent = selected.description;
  document.getElementById("resultPlan").innerHTML = selected.plan
    .map((item, index) => `<div><span>0${index + 1}</span>${item}</div>`)
    .join("");
}

wizardNext.addEventListener("click", () => {
  if (!validateWizardStep(currentWizardStep)) return;

  if (currentWizardStep === 5) {
    buildRecommendation();
    showWizardStep(6);
  } else {
    showWizardStep(currentWizardStep + 1);
  }
});

wizardBack.addEventListener("click", () => {
  if (currentWizardStep > 1) showWizardStep(currentWizardStep - 1);
});

document.querySelectorAll(".wizard-option input").forEach(input => {
  input.addEventListener("change", () => {
    if (window.innerWidth > 760 && currentWizardStep < 5) {
      setTimeout(() => {
        if (validateWizardStep(currentWizardStep)) showWizardStep(currentWizardStep + 1);
      }, 180);
    }
  });
});

document.getElementById("resultSubmit").addEventListener("click", () => {
  const name = getWizardValue("leadName").trim();
  const email = getWizardValue("leadEmail").trim();
  const consent = solutionWizard.elements["leadConsent"].checked;
  const message = document.getElementById("resultMessage");

  if (!name || !email || !consent) {
    message.textContent = "Uzupełnij imię, e-mail i zaznacz zgodę na kontakt.";
    message.style.color = "#b34b4b";
    return;
  }

  const subject = encodeURIComponent("Wynik Asystenta Usprawnień – smartFlowPartners");
  const body = encodeURIComponent(
    `Imię i nazwisko: ${name}
E-mail: ${email}
Firma: ${getWizardValue("leadCompany")}

Branża: ${getWizardValue("companyType")}
Główny problem: ${getWizardValue("mainProblem")}
Częstotliwość: ${getWizardValue("frequency")}
Cel: ${getWizardValue("goal")}

Opis problemu:
${getWizardValue("problemDetails")}

Rekomendacja:
${document.getElementById("resultTitle").textContent}`
  );

  message.textContent = "Otwieramy wiadomość e-mail z gotowym podsumowaniem.";
  message.style.color = "var(--primary)";
  window.location.href = `mailto:kontakt@smartflowpartners.pl?subject=${subject}&body=${body}`;
});

showWizardStep(1);
