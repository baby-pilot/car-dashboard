const circularProgress = document.querySelectorAll(".circular-progress");

Array.from(circularProgress).forEach((progressBar) => {
    const progressValue = progressBar.querySelector(".percentage");
    const innerCircle = progressBar.querySelector(".inner-circle");
    endValue = Number(progressBar.getAttribute("data-percentage")),
    progressColor = progressBar.getAttribute("data-progress-color");
    includeUnit = progressBar.getAttribute("include-unit");

    if(includeUnit == "0") {
        progressValue.textContent = `${endValue}%`;
    } else {
        progressValue.textContent = `${endValue}\n${includeUnit}`;
    } 
    progressValue.style.color = `${progressColor}`;

    innerCircle.style.backgroundColor = `${progressBar.getAttribute(
        "data-inner-circle-color"
    )}`;

    progressBar.style.background = `conic-gradient(${progressColor} ${
        endValue * 3.6
    }deg,${progressBar.getAttribute("data-bg-color")} 0deg)`;
});
