"use strict";

/**
 * TODO:
 * 1. Copy functionality when clicking on the value
 * 2. Make grid values (8pt, 4pt, 2pt) in the accordion
 */

// Elements
const btnGenerate = document.querySelector(".btn-generate");
const inputRange = document.querySelector(".range-input");

const gridValues8ptWrap = document.querySelector(".grid-multiplier--8pt");

const gridValues8pt = document.querySelector(
  ".grid-multiplier--8pt .grid-multiplier-values-wrap"
);
const gridValues4pt = document.querySelector(
  ".grid-multiplier--4pt .grid-multiplier-values-wrap"
);
const gridValues2pt = document.querySelector(
  ".grid-multiplier--2pt .grid-multiplier-values-wrap"
);

const gridMultiplierGroupElements = document.querySelectorAll(
  ".grid-multiplier-group"
);

// Initialize

let elHeight;

const gridValues = {
  "8pt": null,
  "4pt": null,
  "2pt": null,
};

const RANGE_START = 1;
const RANGE_END = 200;

let pt8, pt4, pt2;

const init = function () {
  gridValues8pt.innerHTML = "";
  gridValues4pt.innerHTML = "";
  gridValues2pt.innerHTML = "";

  gridValues["8pt"] = [];
  gridValues["4pt"] = [];
  gridValues["2pt"] = [];

  pt8 = 0;
  pt4 = 0;
  pt2 = 0;
};

init();

// Functions

const generateGridValues = function (range) {
  const TYPOGRAPHY_ROOT_SIZE = 16;
  const PT8_STEP = 8;
  const PT4_STEP = 4;
  const PT2_STEP = 2;

  for (let i = 0; i < range; i++) {
    pt8 += PT8_STEP;
    pt4 += PT4_STEP;
    pt2 += PT2_STEP;

    gridValues["8pt"].push([pt8, pt8 / TYPOGRAPHY_ROOT_SIZE]);
    gridValues["4pt"].push([pt4, pt4 / TYPOGRAPHY_ROOT_SIZE]);
    gridValues["2pt"].push([pt2, pt2 / TYPOGRAPHY_ROOT_SIZE]);
  }
};

const displayGridValues = function (gridValues) {
  const gridKeys = Object.keys(gridValues);

  for (let i = 0; i < gridKeys.length; i++) {
    const gridKey = gridKeys[i];

    gridValues[gridKey].forEach((gridValue) => {
      const pxVal = gridValue[0];
      const remVal = gridValue[1];

      const html = `
            <div class="grid-multiplier-value">
                <div class="rem-value">${remVal}rem</div>
                <div class="px-value">${pxVal}px</div>
             </div>
        `;

      document
        .querySelector(
          `.grid-multiplier--${gridKey} .grid-multiplier-values-wrap`
        )
        .insertAdjacentHTML("beforeend", html);
    });
  }
};

const btnGenerateHandler = function () {
  // Reset Fields
  init();

  const rangeValue = +inputRange.value;

  if (rangeValue < RANGE_START || rangeValue > RANGE_END) return;

  generateGridValues(rangeValue);
  displayGridValues(gridValues);

  // Scroll to 8pt Grid Value
  gridValues8ptWrap.scrollIntoView({ behavior: "smooth" });

  // Set Content to Open
  gridValues8ptWrap.classList.add("open");
};

// Event Listeners

btnGenerate.addEventListener("click", btnGenerateHandler);

// Grid Muliplier Accordion Functionality

const gridMultiplierGroupHandler = function () {
  this.classList.toggle("open");
};

gridMultiplierGroupElements.forEach((element) => {
  element.addEventListener("click", gridMultiplierGroupHandler);
});
