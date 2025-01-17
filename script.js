document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  let filters = [];

  let jobs;
  fetch("data.json")
    .then((res) => res.json())
    .then((fetchJobs) => {
      jobs = fetchJobs;
      filter(); // Initial call to display all jobs
      container.insertAdjacentHTML(
        "beforeend",
        `<div class="attribution" style="font-size: 1.2rem; margin-top: 10rem;">
            Challenge by
            <a href="https://www.frontendmentor.io?ref=challenge" target="_blank"
              >Frontend Mentor</a
            >. Coded by
            <a href="https://github.com/cornel05" target="_blank">cornel05</a>.
          </div>`
      );
    })
    .catch((err) => {
      console.error(err);
    });

  function filter() {
    container.innerHTML = ""; // Clear previous job listings

    const filteredJobs =
      filters.length === 0 ? jobs : jobs.filter((job) => match(filters, job));
    const jobCards = filteredJobs
      .map((job) => {
        const toolsString = job.tools
          .map((tool) => `<button class="tools"><span>${tool}</span></button>`)
          .join("");
        const languagesString = job.languages
          .map(
            (language) =>
              `<button class="languages"><span>${language}</span></button>`
          )
          .join("");
        const imgPath = job.logo;
        const newFeaturedString = `<h4>${job.company}</h4>${
          job.new ? "<span class='badge'>New!</span>" : ""
        }${job.featured ? "<span class='badge featured'>Featured</span>" : ""}`;
        return `
            <div class="job-card">
              <div class="logo"><img src=${imgPath} alt="" /></div>
              <div class="job-details">
                <div class="new-featured">
                  ${newFeaturedString}
                </div>
                <h3>${job.position}</h3>
                <p>${job.postedAt} <span style="margin: 0 10px">•</span> ${job.contract} <span style="margin: 0 10px">•</span> ${job.location}</p>
              </div>
              <div class="tags">
                <button class="role"><span>${job.role}</span></button>
                <button class="level"><span>${job.level}</span></button>
                ${languagesString}
                ${toolsString}
              </div>
            </div>`;
      })
      .join("");

    container.insertAdjacentHTML("beforeend", jobCards);

    // Add event listeners to the dynamically created buttons
    const buttons = document.querySelectorAll(".tags > button");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tagName = btn.classList[0];
        const tagVal = btn.innerText;
        if (
          !filters.some(
            (filter) => filter.tag === tagName && filter.val === tagVal
          )
        ) {
          filters.push({
            tag: tagName,
            val: tagVal,
          });
          filter();
          addHeader();
        }
      });
    });
  }

  function match(filters, job) {
    return filters.every(({ tag, val }) => {
      return (
        (tag === "languages" && job.languages.includes(val)) ||
        (tag === "tools" && job.tools.includes(val)) ||
        (tag === "level" && job.level === val) ||
        (tag === "role" && job.role === val)
      );
    });
  }

  function addHeader() {
    const filtersString = filters
      .map(
        (filter, index) =>
          `<div class="filter-item">${filter.val} <button class="remove-btn" data-index="${index}">✖</button></div>`
      )
      .join("");
    const HTMLString = `
        <div class="filter-bar">
          <div class="filters">${filtersString}</div>
          <button class="clear-btn">Clear</button>
        </div>`;
    container.insertAdjacentHTML("afterbegin", HTMLString);

    document.querySelectorAll(".remove-btn").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        filters.splice(index, 1);
        filter();
        addHeader();
      })
    );
    if (filters.length === 0) document.querySelector(".filter-bar").remove();

    document.querySelector(".clear-btn").addEventListener("click", clear);
  }

  function clear() {
    filters = [];
    filter();
  }
});
