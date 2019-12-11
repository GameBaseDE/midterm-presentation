/**
 * Created by Leonhard Gahr on 04.04.2017.
 */
init();

function init() {
    const separator = " - ";

    const headings = document.getElementsByClassName("heading-overview");
    const body = document.getElementsByClassName("reveal")[0];

    const bodyChild = body.children[0];

    const topicsElement = document.createElement("div");
    topicsElement.className = "topics";

    const headElement = document.createElement("div");
    headElement.className = "head";


    const textElements = getTextElements(headings, separator, false);

    textElements.pop();

    for (const index in textElements) {
        if (textElements.hasOwnProperty(index)) {
            headElement.insertBefore(textElements[index], headElement.nextSibling)
        }
    }

    topicsElement.insertBefore(headElement, topicsElement.nextSibling);

    bodyChild.parentNode.insertBefore(topicsElement, bodyChild.nextSibling);

    addRevealListener();

    if (Reveal.getCurrentSlide().classList.contains("no-heading-overview")) {
        document.getElementsByClassName("topics")[0].style.opacity = 0;
    }
}

function appendClass(element, newClass) {
    element.className = element.className + " " + newClass
}

function addRevealListener() {
    const elements = document.getElementsByClassName("heading-overview");
    const indices = [];
    for (let i = 0; i < elements.length; i++) {
        const slideIndices = Reveal.getIndices(elements[i].parentNode).h;
        appendClass(document.getElementsByClassName("heading-preview")[i], slideIndices);
        indices.push(slideIndices);
    }

    let recentElement;

    Reveal.addEventListener('slidechanged', () => {
        if (Reveal.getCurrentSlide().classList.contains("no-heading-overview")) {
            document.getElementsByClassName("topics")[0].style.opacity = 0
        } else {
            document.getElementsByClassName("topics")[0].style.opacity = 1
        }
        if (indices.indexOf(Reveal.getIndices().h) !== -1) {
            if (recentElement) {
                recentElement.classList.remove("active");
                recentElement.classList.add("inactive")
            }
            const element = document.getElementsByClassName("" + Reveal.getIndices().h)[0];
            recentElement = element;
            if (!element.classList.contains("active")) {
                element.classList.remove("inactive");
                element.classList.add("active");
            }
        } else {
            if (recentElement) {
                recentElement.classList.remove("active");
                recentElement.classList.add("inactive")
            }
        }
    });


    Reveal.addEventListener('overviewshown', function () {
        document.getElementsByClassName("topics")[0].style.opacity = 0
    });
    Reveal.addEventListener('overviewhidden', function () {
        document.getElementsByClassName("topics")[0].style.opacity = 1
    });

    generateTableOfContents()
}

function getTextElements(headings, seperator, noTag) {
    const textElements = [];

    for (const key in headings) {
        if (headings.hasOwnProperty(key) && headings[key].nodeType === 1) {
            if (noTag) {
                textElements.push(headings[key].getAttribute("data-heading-overview") || headings[key].innerHTML.replace("\n", " "))
            } else {
                const element = document.createElement("h4");
                if (headings[key].getAttribute("data-heading-overview") !== null) {
                    element.innerText = headings[key].getAttribute("data-heading-overview");
                } else {
                    element.innerText = headings[key].innerHTML.replace("\n", " ");
                }
                element.className = headings[key].innerText.replace(" ", "").toLowerCase() + " heading-preview";

                const separatorElement = document.createElement("h4");
                separatorElement.innerText = seperator;

                textElements.push(element, separatorElement)
            }
        }
    }

    return textElements
}

function generateTableOfContents() {
    const table_slide = document.getElementsByClassName("table-of-contents")[0];

    if (table_slide === undefined) {
        return
    }

    const textElements = getTextElements(document.getElementsByClassName("heading-overview"), "", true);

    const list = document.createElement("ul");

    for (const i in textElements) {
        if (textElements.hasOwnProperty(i)) {
            list.innerHTML += "<li>" + textElements[i] + "</li>"
        }
    }

    table_slide.innerHTML = "<" + table_slide.getAttribute("data-heading-tag") + ">" + table_slide.getAttribute("data-heading") + "</" + table_slide.getAttribute("data-heading-tag") + ">";

    table_slide.innerHTML += list.outerHTML;
}
