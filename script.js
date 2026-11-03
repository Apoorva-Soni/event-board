
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

async function loadEvents() {
    eventContainer.textContent = "Loading...";

    try {
        const response = await fetch("event.json");

        if (!response.ok) {
            throw new Error("Failed to load events");
        }

        events = await response.json();

        console.log("Events loaded:", events);

        // A4: Test event status
        console.log(getEventStatus(events[0]));
        console.log(getEventStatus(events[1]));
        console.log(getEventStatus(events[2]));

        // A5: Display event status
        for (const ev of events) {
            console.log(ev.title + " - " + getEventStatus(ev));
        }

        // A6: Test formatEvent function
        console.log(formatEvent(events[0]));
        console.log(formatEvent(events[1]));

        // A7: Update available events
        availableEvents = events.filter(ev => ev.seats > 0);

        console.log("Available Events:");
        console.log(availableEvents);

        // Render fetched events
        renderEvents();

    } catch (error) {
        console.error(error);
        eventContainer.textContent = "Sorry, events could not be loaded.";
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
