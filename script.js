
const eventTitle = "Coding Competition";
const seatsLeft = 10;
const isOnline = true;

console.log(eventTitle);
console.log(seatsLeft);
console.log(isOnline);

// A3: Model events as data

let events = [];

console.log(events);

// A4: Decide event status using if / else

function getEventStatus(ev) {
    if (ev.seats === 0) {
        return "Full";
    } else if (ev.seats < 5) {
        return "Few left";
    } else {
        return "Open";
    }
}

// A5: Repeat using for...of loop

for (const ev of events) {
    console.log(ev.title + " - " + getEventStatus(ev));
}

// A6: Function with parameter and return

function formatEvent(ev) {
    return ev.title + " | " + ev.date + " | " + getEventStatus(ev);
}

// A7: Arrow function with array method

let availableEvents = events.filter(ev => ev.seats > 0);

console.log("Available Events:");
console.log(availableEvents);

// A8: Understanding scope

function showEvent() {
    const message = "This variable is inside the function";
    console.log(message);
}

showEvent();

// B1: Select elements from the DOM

const eventSection = document.querySelector("#events");

const navigation = document.querySelector(".menu");

const navigationLinks = document.querySelectorAll(".menu a");

const registrationForm = document.querySelector("#registration form");

const studentName = document.getElementById("name");

console.log(eventSection);
console.log(navigation);
console.log(navigationLinks);
console.log(registrationForm);
console.log(studentName);

// B2 + B3: Render events and update content

const eventContainer = document.createElement("div");

eventContainer.classList.add("js-events");

eventSection.appendChild(eventContainer);

function renderEvents() {
    eventContainer.textContent = "";

    events.forEach(ev => {
        const card = document.createElement("div");
        const title = document.createElement("h3");
        const date = document.createElement("p");
        const seats = document.createElement("p");
        const status = document.createElement("p");

        title.textContent = ev.title;
        date.textContent = "Date: " + ev.date;
        seats.textContent = "Seats: " + ev.seats;

        // B3: textContent
        status.textContent = getEventStatus(ev);

        // B3: classList.add()
        if (ev.seats === 0) {
            card.classList.add("full");
        }

        // B3: style
        status.style.color = "green";
        status.style.fontWeight = "bold";

        // B3: setAttribute()
        card.setAttribute("data-online", ev.online);

        card.appendChild(title);
        card.appendChild(date);
        card.appendChild(seats);

        // B3: Add status to card
        card.appendChild(status);

        // B5: Create RSVP button
        const rsvpButton = document.createElement("button");

        rsvpButton.textContent = "RSVP";

        rsvpButton.addEventListener("click", function (event) {
            console.log("Clicked button:", event.target);
            console.log("Event:", ev.title);

            alert("You clicked RSVP for " + ev.title);
        });

        card.appendChild(rsvpButton);

        eventContainer.appendChild(card);
    });
}

// B4: Hamburger menu click

const menuButton = document.getElementById("menu-toggle");

menuButton.addEventListener("click", function (event) {
    event.target.classList.toggle("active");
    navigation.classList.toggle("hidden");
});

// B6: Search events while typing

const searchBox = document.getElementById("event-search");

searchBox.addEventListener("input", function () {
    const searchText = searchBox.value.toLowerCase();

    events.forEach((ev, index) => {
        const card = eventContainer.children[index];

        if (ev.title.toLowerCase().includes(searchText)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});

// Clear search using Escape
searchBox.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        searchBox.value = "";
        searchBox.dispatchEvent(new Event("input"));
    }
});

// B7: Fetch events from events.json

// Lab Assignment 7: Load JSON and XML data
async function loadEvents() {
    eventContainer.textContent = "Loading...";

    try {
        // B1: Fetch and read JSON
        const jsonResponse = await fetch("events.json");

        if (!jsonResponse.ok) {
            throw new Error("Failed to load events.json");
        }

        const jsonText = await jsonResponse.text();
        events = JSON.parse(jsonText);

        console.log("Events loaded:", events);

        // B2: Read values using dot and index access
        console.log("First event title:", events[0].title);
        console.log(
            "Last event seats:",
            events[events.length - 1].seats
        );

        // B3: JSON round-trip
        const jsonString = JSON.stringify(events, null, 4);

        console.log("JSON.stringify output:", jsonString);
        console.log(
            "Matches events.json:",
            jsonString.trim() === jsonText.trim()
        );

        // B4: Fetch and parse XML
        const xmlResponse = await fetch("events.xml");

        if (!xmlResponse.ok) {
            throw new Error("Failed to load events.xml");
        }

        const xmlText = await xmlResponse.text();

        const xmlDocument = new DOMParser().parseFromString(
            xmlText,
            "application/xml"
        );

        if (xmlDocument.querySelector("parsererror")) {
            throw new Error("Invalid XML");
        }

        const xmlTitles =
            xmlDocument.getElementsByTagName("title");

        document.getElementById("xml-first-title").textContent =
            xmlTitles[0].textContent;

        // B5: Compare file sizes in UTF-8 bytes
        const jsonBytes =
            new TextEncoder().encode(jsonText).length;

        const xmlBytes =
            new TextEncoder().encode(xmlText).length;

        document.getElementById("data-size-result").textContent =
            `events.json: ${jsonBytes} bytes | ` +
            `events.xml: ${xmlBytes} bytes. ` +
            (jsonBytes > xmlBytes
                ? "JSON is larger."
                : xmlBytes > jsonBytes
                    ? "XML is larger."
                    : "Both files have the same size.");

        // Existing event status functionality
        for (const ev of events) {
            console.log(
                ev.title + " - " + getEventStatus(ev)
            );
        }

        // Existing formatEvent functionality
        console.log(formatEvent(events[0]));
        console.log(formatEvent(events[1]));

        // Existing available events functionality
        availableEvents = events.filter(
            ev => ev.seats > 0
        );

        console.log("Available Events:", availableEvents);

        // Render event cards
        renderEvents();

    } catch (error) {
        console.error(error);
        eventContainer.textContent =
            "Sorry, events could not be loaded.";
    }
}

loadEvents();


 // B8: Registration Form Validation

registrationForm.addEventListener("submit", function(event) {

    // Custom validation for name
    if (studentName.value.trim() === "") {
        studentName.setCustomValidity("Please enter your name");
    } else {
        studentName.setCustomValidity("");
    }

    // Check form validity
    if (!registrationForm.checkValidity()) {
        event.preventDefault();
        registrationForm.reportValidity();
    } else {
        event.preventDefault();
        alert("Registration form submitted successfully!");
    }

});
