    const searchButton = document.getElementById("search");
    const cityInput = document.getElementById("city");
    const resultsDiv = document.getElementById("results");

    async function fetchPrayerTime(city = "New York") {
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=USA&method=2`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data.data.timings;
      } catch (error) {
        console.error("Error fetching prayer times:", error);
        return null;
      }
    }

    async function searchPrayerTime() {
      const city = cityInput.value.trim();
      if (!city) {
        resultsDiv.innerHTML = `<p style="color: red;">Please enter a city name.</p>`;
        return;
      }

      localStorage.setItem("lastSearchedCity", city);

      const excludedKeys = ["Imsak", "Firstthird", "Lastthird", "Midnight"];
      const timings = await fetchPrayerTime(city);

      if (timings) {
        resultsDiv.innerHTML = `<h3>Prayer Times for ${city}:</h3>`;
        for (const [key, value] of Object.entries(timings)) {
          if (excludedKeys.includes(key)) continue;
          const entry = document.createElement("div");
          entry.className = "time-entry";
          entry.innerHTML = `<strong>${key}</strong><span>${value}</span>`;
          resultsDiv.appendChild(entry);
        }
      } else {
        resultsDiv.textContent = "Failed to fetch prayer times.";
      }
    }

    // Load last searched city
    window.addEventListener("DOMContentLoaded", () => {
      const savedCity = localStorage.getItem("lastSearchedCity");
      if (savedCity) {
        cityInput.value = savedCity;
        searchPrayerTime();
      }
    });

    // Trigger search on click or Enter key
    searchButton.addEventListener("click", searchPrayerTime);
    cityInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") searchPrayerTime();
    });