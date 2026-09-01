const trackData = {
  meadow: {
    background: "assets/backgrounds/meadow.png",
    label: "MEADOW / FIRST LOOP",
    path: "M 122 278 C 104 190 168 100 300 76 C 444 50 580 94 610 190 C 642 290 536 350 410 330 C 308 314 266 256 214 266 C 174 274 152 312 122 278 Z",
    ghost: "M 132 270 C 122 190 180 116 306 92 C 436 67 558 106 588 190 C 614 266 526 326 414 307 C 314 290 262 238 212 248 C 174 256 160 294 132 270 Z",
    color: "#477a4f",
    subtitle: "FIRST LOOP / ROOKIE CUP",
    condition: "DRY / OPEN"
  },
  canyon: {
    background: "assets/backgrounds/canyon.png",
    label: "CANYON / RED SWITCHBACK",
    path: "M 110 270 C 122 132 238 82 346 104 C 431 121 466 183 527 151 C 599 113 637 202 581 276 C 527 348 408 322 329 281 C 267 249 221 317 160 326 C 120 331 101 308 110 270 Z",
    ghost: "M 120 264 C 133 143 241 99 350 119 C 426 134 464 199 532 166 C 585 140 612 207 565 263 C 515 322 411 303 335 265 C 270 233 222 301 164 309 C 133 313 113 293 120 264 Z",
    color: "#695746",
    subtitle: "RED SWITCHBACK / GRAND PRIX",
    condition: "DUST / TIGHT"
  },
  city: {
    background: "assets/backgrounds/city.png",
    label: "CITY / NIGHT ARC",
    path: "M 118 300 L 118 136 L 302 88 L 529 120 L 600 207 L 522 287 L 369 268 L 276 322 L 151 339 Z",
    ghost: "M 130 291 L 130 148 L 307 102 L 519 132 L 579 207 L 513 270 L 367 251 L 273 305 L 162 322 Z",
    color: "#1d2b32",
    subtitle: "NIGHT ARC / CITY STREETS",
    condition: "NIGHT / TECHNICAL"
  }
};

const carData = {
  street: {
    image: "assets/cars/street.png",
    name: "Street",
    code: "ST-01",
    className: "EVERYDAY HERO",
    description: "Forgiving on entry, steady through the bends. The one that teaches you why a clean exit matters.",
    asphalt: 72,
    acceleration: 64,
    offroad: 48,
    alt: "Street car shown from above"
  },
  formula: {
    image: "assets/cars/formula.png",
    name: "Formula",
    code: "FM-02",
    className: "APEX HUNTER",
    description: "Sharp turn-in, huge commitment. It rewards the brave line and punishes the almost-right one.",
    asphalt: 94,
    acceleration: 88,
    offroad: 29,
    alt: "Formula car shown from above"
  },
  rally: {
    image: "assets/cars/rally.png",
    name: "Rally",
    code: "RL-03",
    className: "MUD SPECIALIST",
    description: "Wide stance, good manners in the rough stuff. When the asphalt ends, this is where the fun starts.",
    asphalt: 68,
    acceleration: 76,
    offroad: 92,
    alt: "Rally car shown from above"
  }
};

const demoMap = document.querySelector("#race-map");
const raceScreen = document.querySelector(".race-screen");
const trackOutline = document.querySelector("#track-outline");
const trackRoad = document.querySelector("#track-road");
const trackCenter = document.querySelector("#track-center");
const ghostLine = document.querySelector("#ghost-line");
const drawnLine = document.querySelector("#drawn-line");
const demoCar = document.querySelector("#demo-car");
const demoCarImage = document.querySelector("#demo-car-image");
const themeBackground = document.querySelector("#theme-background");
const demoStatus = document.querySelector("#demo-status");
const screenWorldLabel = document.querySelector("#screen-world-label");
const demoPhase = document.querySelector("#demo-phase");
const bestTime = document.querySelector("#best-time");
const runNumber = document.querySelector("#run-number");
const runButton = document.querySelector("#run-lap");
const resetButton = document.querySelector("#reset-demo");

let selectedTheme = "meadow";
let selectedCar = "street";
let drawing = false;
let drawingPoints = [];
let animationFrame = 0;
let demoRuns = 0;
let currentTrackLength = 0;

function setPressedState(buttons, selected, attribute) {
  buttons.forEach((button) => {
    const isSelected = button.dataset[attribute] === selected;
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
    if (button.getAttribute("role") === "tab") {
      button.setAttribute("aria-selected", String(isSelected));
    }
  });
}

function setTheme(theme) {
  const data = trackData[theme];
  if (!data) return;
  selectedTheme = theme;
  raceScreen.dataset.theme = theme;
  themeBackground.setAttribute("href", data.background);
  trackOutline.setAttribute("d", data.path);
  trackRoad.setAttribute("d", data.path);
  trackCenter.setAttribute("d", data.path);
  ghostLine.setAttribute("d", data.ghost);
  screenWorldLabel.textContent = data.label;
  setPressedState(document.querySelectorAll("[data-theme-choice]"), theme, "themeChoice");
  resetDemo(true);
}

function setCar(car) {
  const data = carData[car];
  if (!data) return;
  selectedCar = car;
  demoCarImage.setAttribute("href", data.image);
  setPressedState(document.querySelectorAll("[data-car-choice]"), car, "carChoice");
  setPressedState(document.querySelectorAll("[data-garage-choice]"), car, "garageChoice");
  updateGarage(data);
}

function updateGarage(data) {
  const garageCar = document.querySelector("#garage-car");
  const garageStage = document.querySelector(".garage-stage");
  const garageCode = document.querySelector("#garage-code");
  const garageClass = document.querySelector("#garage-class");
  const garageName = document.querySelector("#garage-name");
  const garageDescription = document.querySelector("#garage-description");
  const values = {
    asphalt: document.querySelector("#spec-asphalt"),
    acceleration: document.querySelector("#spec-acceleration"),
    offroad: document.querySelector("#spec-offroad")
  };
  const numbers = {
    asphalt: document.querySelector("#spec-asphalt-value"),
    acceleration: document.querySelector("#spec-acceleration-value"),
    offroad: document.querySelector("#spec-offroad-value")
  };

  garageStage.classList.add("is-switching");
  window.setTimeout(() => {
    garageCar.src = data.image;
    garageCar.alt = data.alt;
    garageCode.textContent = data.code;
    garageClass.textContent = data.className;
    garageName.textContent = data.name;
    garageDescription.textContent = data.description;
    values.asphalt.style.width = `${data.asphalt}%`;
    values.acceleration.style.width = `${data.acceleration}%`;
    values.offroad.style.width = `${data.offroad}%`;
    numbers.asphalt.textContent = data.asphalt;
    numbers.acceleration.textContent = data.acceleration;
    numbers.offroad.textContent = data.offroad;
    garageStage.classList.remove("is-switching");
  }, 120);
}

function pointFromEvent(event) {
  const svgPoint = demoMap.createSVGPoint();
  const source = event.touches ? event.touches[0] : event;
  svgPoint.x = source.clientX;
  svgPoint.y = source.clientY;
  const matrix = demoMap.getScreenCTM();
  if (!matrix) return null;
  return svgPoint.matrixTransform(matrix.inverse());
}

function renderDrawing() {
  if (drawingPoints.length === 0) {
    drawnLine.setAttribute("d", "");
    return;
  }
  const d = drawingPoints.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  drawnLine.setAttribute("d", d);
}

function beginDrawing(event) {
  if (event.button !== undefined && event.button !== 0) return;
  if (animationFrame) cancelAnimationFrame(animationFrame);
  const point = pointFromEvent(event);
  if (!point) return;
  event.preventDefault();
  drawing = true;
  drawingPoints = [point];
  ghostLine.style.opacity = "0.18";
  demoCar.style.opacity = "0.35";
  demoStatus.textContent = "Keep the loop closed, racer";
  demoPhase.textContent = "DRAWING LINE...";
  demoMap.setPointerCapture?.(event.pointerId);
  renderDrawing();
}

function continueDrawing(event) {
  if (!drawing) return;
  const point = pointFromEvent(event);
  if (!point) return;
  event.preventDefault();
  const previous = drawingPoints[drawingPoints.length - 1];
  if (!previous || Math.hypot(point.x - previous.x, point.y - previous.y) > 4) {
    drawingPoints.push(point);
    renderDrawing();
  }
}

function finishDrawing(event) {
  if (!drawing) return;
  drawing = false;
  const point = pointFromEvent(event);
  if (point) drawingPoints.push(point);
  renderDrawing();
  demoCar.style.opacity = "1";
  demoStatus.textContent = drawingPoints.length > 10 ? "Line set. Ready to run." : "Draw a longer loop to run";
  demoPhase.textContent = drawingPoints.length > 10 ? "LINE READY / PRESS RUN" : "DRAW A BIGGER LOOP";
  demoMap.releasePointerCapture?.(event.pointerId);
}

function positionCar(distance, path = trackRoad) {
  const total = path.getTotalLength();
  const current = path.getPointAtLength(distance % total);
  const next = path.getPointAtLength((distance + 1.5) % total);
  const angle = Math.atan2(next.y - current.y, next.x - current.x) * (180 / Math.PI);
  demoCar.setAttribute("transform", `translate(${current.x.toFixed(2)} ${current.y.toFixed(2)}) rotate(${angle.toFixed(2)})`);
}

function formatTime(seconds) {
  const centiseconds = Math.floor(seconds * 100) % 100;
  const wholeSeconds = Math.floor(seconds);
  return `00:${String(wholeSeconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function runLap() {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  const path = drawingPoints.length > 10 ? drawnLine : trackRoad;
  currentTrackLength = path.getTotalLength();
  const startTime = performance.now();
  const duration = selectedCar === "formula" ? 3200 : selectedCar === "rally" ? 3700 : 3450;
  runButton.disabled = true;
  demoStatus.textContent = "Watching your line...";
  demoPhase.textContent = "LAP IN PROGRESS...";
  demoRuns += 1;
  runNumber.textContent = String(demoRuns).padStart(2, "0");
  ghostLine.style.opacity = "0.2";

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 2.2);
    positionCar(eased * currentTrackLength, path);
    if (progress < 1) {
      animationFrame = requestAnimationFrame(tick);
      return;
    }
    const time = selectedCar === "formula" ? 8.76 : selectedCar === "rally" ? 10.14 : 9.42;
    bestTime.textContent = formatTime(time);
    demoStatus.textContent = `${formatTime(time)} — new line to beat`;
    demoPhase.textContent = "LAP COMPLETE / DRAW AGAIN";
    runButton.disabled = false;
    animationFrame = 0;
  }

  animationFrame = requestAnimationFrame(tick);
}

function resetDemo(showMessage = true) {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = 0;
  drawing = false;
  drawingPoints = [];
  renderDrawing();
  demoCar.style.opacity = "1";
  positionCar(0, trackRoad);
  bestTime.textContent = "—:—.—";
  runButton.disabled = false;
  if (showMessage) {
    demoStatus.textContent = "Drag on the track to draw";
    demoPhase.textContent = "DRAW / RUN / REPEAT";
  }
}

function setWorld(world) {
  const data = trackData[world];
  if (!data) return;
  const worldImage = document.querySelector("#world-image");
  const worldIndex = document.querySelector("#world-index");
  const worldCondition = document.querySelector("#world-condition");
  const worldLabel = document.querySelector("#world-label");
  const worldSubtitle = document.querySelector("#world-subtitle");
  const worldWindow = document.querySelector(".world-window");
  const index = { meadow: "01 / 03", canyon: "02 / 03", city: "03 / 03" }[world];

  worldWindow.dataset.world = world;
  worldImage.src = data.background;
  worldImage.alt = `${world} pixel-art surface`;
  worldIndex.textContent = index;
  worldCondition.textContent = data.condition;
  worldLabel.textContent = world.toUpperCase();
  worldSubtitle.textContent = data.subtitle;
  document.querySelector("#world-track-outline").setAttribute("d", scaleWorldPath(data.path, world));
  document.querySelector("#world-track-road").setAttribute("d", scaleWorldPath(data.path, world));
  document.querySelector("#world-track-center").setAttribute("d", scaleWorldPath(data.path, world));
  setPressedState(document.querySelectorAll("[data-world-choice]"), world, "worldChoice");
}

function scaleWorldPath(path, world) {
  const paths = {
    meadow: "M 78 230 C 59 155 110 84 210 65 C 322 43 439 78 462 155 C 488 233 404 291 309 275 C 230 261 197 214 157 224 C 117 233 103 257 78 230 Z",
    canyon: "M 74 232 C 87 121 178 78 274 95 C 351 108 376 158 429 134 C 485 109 520 181 478 239 C 441 291 355 274 286 240 C 230 212 184 274 124 286 C 89 292 68 270 74 232 Z",
    city: "M 75 268 L 75 122 L 228 82 L 414 108 L 473 184 L 409 252 L 278 236 L 198 286 L 100 300 Z"
  };
  return paths[world] || paths.meadow;
}

document.querySelectorAll("[data-theme-choice]").forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.themeChoice));
});

document.querySelectorAll("[data-car-choice]").forEach((button) => {
  button.addEventListener("click", () => setCar(button.dataset.carChoice));
});

document.querySelectorAll("[data-world-choice]").forEach((button) => {
  button.addEventListener("click", () => setWorld(button.dataset.worldChoice));
});

document.querySelectorAll("[data-garage-choice]").forEach((button) => {
  button.addEventListener("click", () => setCar(button.dataset.garageChoice));
});

demoMap?.addEventListener("pointerdown", beginDrawing);
demoMap?.addEventListener("pointermove", continueDrawing);
demoMap?.addEventListener("pointerup", finishDrawing);
demoMap?.addEventListener("pointercancel", finishDrawing);
runButton?.addEventListener("click", runLap);
resetButton?.addEventListener("click", () => resetDemo(true));

const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector("#site-menu");

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  siteMenu.classList.toggle("is-open", !open);
});

siteMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    siteMenu.classList.remove("is-open");
  });
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

setTheme("meadow");
setCar("street");
setWorld("meadow");
positionCar(0, trackRoad);
