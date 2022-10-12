"use strict";

/**
 * TODO:
 * Notification message about a successful or unsuccessful copied value.
 */

// ELEMENTS

const body = document.querySelector("body");

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

const gridMultiplierTitleWrapElements = document.querySelectorAll(
  ".grid-multiplier-title-wrap"
);

// INITIALIZE

const gridValues = {
  "8pt": null,
  "4pt": null,
  "2pt": null,
};

const RANGE_START = 1;
const RANGE_END = 200;

let pt8, pt4, pt2, pxAndRemElements;

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

// FUNCTIONS

// Generate 8, 4, 2 grid

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

// Toast

const renderToast = function (status, value = "") {
  let statusClass, message;

  const statusLowercased = status.toLocaleLowerCase();

  if (statusLowercased === "success") {
    statusClass = "toast--success";
    message = "Copied: ";
  }

  if (statusLowercased === "error") {
    statusClass = "toast--error";
    message = "Error copying! Please Try again!";
  }

  const toastWrapper = document.createElement("div");
  toastWrapper.classList.add("toast-wrapper");

  const toastHtml = `
    <div class="toast ${statusClass}">
      <div class="toast-message">${message}</div>
      <p class="copied-value">${value}</p>
    </div>
  `;

  toastWrapper.insertAdjacentHTML("beforeend", toastHtml);

  body.append(toastWrapper);

  setTimeout(() => {
    toastWrapper.classList.add("hide");

    setTimeout(() => {
      toastWrapper.remove();
    }, 1000);
  }, 1500);
};

// Copy to clipboard

const getPxAndRemElements = () =>
  (pxAndRemElements = document.querySelectorAll(".grid-multiplier-value"));

const copyToClipboard = async (valueToClipboard) => {
  if (!valueToClipboard) {
    throw new Error();
  }

  return await navigator.clipboard.writeText(valueToClipboard);
};

const copyPxOrRemToClipboard = function () {
  pxAndRemElements.forEach((pxAndRemElement) => {
    pxAndRemElement.addEventListener("click", async function (event) {
      const isRemOrPxElement =
        event.target.classList.contains("rem-value") ||
        event.target.classList.contains("px-value");

      if (isRemOrPxElement) {
        const value = event.target.textContent;

        // TODO: Should be refactored?
        try {
          await copyToClipboard(value);

          renderToast("success", value);
        } catch (error) {
          renderToast("error");
        }
      }
    });
  });
};

const btnGenerateHandler = function () {
  // Reset Fields
  init();

  const rangeValue = +inputRange.value;

  if (rangeValue < RANGE_START || rangeValue > RANGE_END) return;

  generateGridValues(rangeValue);
  displayGridValues(gridValues);

  // Copy to clipboard functionality
  getPxAndRemElements();

  copyPxOrRemToClipboard();

  // Set 8pt Grid Content to Open
  gridValues8ptWrap.classList.add("open");

  // Scroll to 8pt Grid Value
  gridValues8ptWrap.scrollIntoView({ behavior: "smooth" });
};

btnGenerate.addEventListener("click", btnGenerateHandler);

// Accordion Functionality

const gridMultiplierGroupHandler = function () {
  const gridMultiplierGroupElement = this.closest(".grid-multiplier-group");

  gridMultiplierGroupElement.classList.toggle("open");
};

gridMultiplierTitleWrapElements.forEach((element) => {
  element.addEventListener("click", gridMultiplierGroupHandler);
});
