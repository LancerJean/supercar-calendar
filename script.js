const calendar = document.getElementById("calendar");
const dateRange = document.getElementById("date-range");
const confirmButton = document.getElementById("confirm");

let startDate = null;
let endDate = null;
let bookedDates = [];

// Fetch booked dates from your backend
async function fetchBookedDates() {
  const carId = new URLSearchParams(window.location.search).get("carId");

  if (!carId) return;

  const res = await fetch(`https://hook.eu1.make.com/https://https://hook.eu2.make.com/td7i4nojo2tuecj7s36780ibfrwov9rb?carId=${carId}`);
  const data = await res.json();

  data.forEach(booking => {
    const current = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    while (current <= end) {
      bookedDates.push(new Date(current).toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
  });

  renderCalendar();
}

// Render a simple calendar for this month
function renderCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const html = [];

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dateStr = new Date(year, month, day).toISOString().split("T")[0];

    const isBooked = bookedDates.includes(dateStr);
    const isSelected = startDate && endDate && dateStr >= startDate && dateStr <= endDate;

    html.push(`<button 
      class="${isBooked ? "booked" : isSelected ? "selected" : ""}" 
      data-date="${dateStr}"
      ${isBooked ? "disabled" : ""}
    >${day}</button>`);
  }

  calendar.innerHTML = html.join("");

  document.querySelectorAll("#calendar button").forEach(btn => {
    btn.addEventListener("click", () => handleDateClick(btn.dataset.date));
  });
}

function handleDateClick(date) {
  if (!startDate || (startDate && endDate)) {
    startDate = date;
    endDate = null;
  } else {
    if (date < startDate) {
      endDate = startDate;
      startDate = date;
    } else {
      endDate = date;
    }
  }

  dateRange.textContent = startDate && endDate ? `${startDate} to ${endDate}` : startDate;
  renderCalendar();
}

confirmButton.addEventListener("click", () => {
  if (!startDate) return alert("Select a date range");

  alert(`Confirmed booking:\n${startDate}${endDate ? " to " + endDate : ""}`);
});

fetchBookedDates();
