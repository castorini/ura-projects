(function () {
  const datasets = {
    umap: window.ACM_UMAP_DATA || [],
    tsne: window.ACM_TSNE_DATA || [],
  };

  const clusterColors = [
    "#0e6f68",
    "#d34a24",
    "#4b6fb5",
    "#b58900",
    "#7c4d8d",
    "#2f855a",
    "#b83280",
    "#5f6c37",
    "#8f4d2f",
    "#276678",
  ];

  const state = {
    projection: "umap",
    search: "",
    selectedClusters: new Set(Array.from({ length: 10 }, (_, i) => i)),
  };

  const plotEl = document.getElementById("plot");
  const recordCountEl = document.getElementById("record-count");
  const clusterListEl = document.getElementById("cluster-list");
  const searchEl = document.getElementById("search");
  const profileEl = document.getElementById("profile");
  const emptyStateEl = document.getElementById("empty-state");
  const profileMediaEl = document.getElementById("profile-media");
  const profileImageEl = document.getElementById("profile-image");
  const profileClusterEl = document.getElementById("profile-cluster");
  const profileNameEl = document.getElementById("profile-name");
  const profileCitationEl = document.getElementById("profile-citation");
  const profileKeywordsEl = document.getElementById("profile-keywords");
  const profileLinksEl = document.getElementById("profile-links");

  function normalize(value) {
    return String(value || "").toLowerCase();
  }

  function fullName(row) {
    return row["Full Name"] || "Unknown fellow";
  }

  function clusterLabel(cluster) {
    return `Cluster ${cluster + 1}`;
  }

  function matchesSearch(row) {
    if (!state.search) {
      return true;
    }
    const haystack = [
      fullName(row),
      row.Citation,
      row.keywords,
      row["DBLP profile"],
      row["Google Scholar Profile"],
    ].map(normalize).join(" ");
    return haystack.includes(state.search);
  }

  function activeRows() {
    return datasets[state.projection].filter((row) => state.selectedClusters.has(row.cluster));
  }

  function createClusterControls() {
    clusterListEl.innerHTML = "";
    for (let cluster = 0; cluster < 10; cluster += 1) {
      const label = document.createElement("label");
      label.className = "cluster-option";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.dataset.cluster = String(cluster);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          state.selectedClusters.add(cluster);
        } else {
          state.selectedClusters.delete(cluster);
        }
        renderPlot();
      });

      const swatch = document.createElement("span");
      swatch.className = "cluster-swatch";
      swatch.style.backgroundColor = clusterColors[cluster];

      const text = document.createElement("span");
      text.textContent = clusterLabel(cluster);

      label.append(checkbox, swatch, text);
      clusterListEl.appendChild(label);
    }
  }

  function buildTraces() {
    const query = state.search;
    const rows = activeRows();
    const traces = [];

    for (let cluster = 0; cluster < 10; cluster += 1) {
      if (!state.selectedClusters.has(cluster)) {
        continue;
      }

      const clusterRows = rows.filter((row) => row.cluster === cluster);
      if (!clusterRows.length) {
        continue;
      }

      traces.push({
        x: clusterRows.map((row) => row.x),
        y: clusterRows.map((row) => row.y),
        mode: "markers",
        type: "scattergl",
        name: clusterLabel(cluster),
        customdata: clusterRows,
        text: clusterRows.map((row) => row.keywords || ""),
        hovertemplate: "<b>%{customdata.Full Name}</b><br>%{customdata.Citation}<br><b>Keywords</b>: %{text}<extra></extra>",
        marker: {
          color: clusterRows.map((row) => {
            if (!query) {
              return clusterColors[cluster];
            }
            return matchesSearch(row) ? "#d34a24" : "rgba(95, 103, 111, 0.22)";
          }),
          line: {
            color: clusterRows.map((row) => matchesSearch(row) ? "#1c1f23" : "rgba(255,255,255,0.7)"),
            width: clusterRows.map((row) => matchesSearch(row) && query ? 1.4 : 0.4),
          },
          size: clusterRows.map((row) => matchesSearch(row) && query ? 13 : 7),
          opacity: query ? 0.9 : 0.82,
        },
      });
    }

    return traces;
  }

  function renderPlot() {
    const data = datasets[state.projection];
    recordCountEl.textContent = `${data.length.toLocaleString()} fellows`;

    const layout = {
      margin: { t: 20, r: 24, b: 28, l: 32 },
      paper_bgcolor: "#fffaf2",
      plot_bgcolor: "#fffaf2",
      dragmode: "pan",
      hovermode: "closest",
      showlegend: true,
      legend: {
        orientation: "h",
        y: 1.04,
        x: 0,
        font: { size: 12 },
      },
      xaxis: {
        showgrid: true,
        gridcolor: "rgba(28,31,35,0.08)",
        zeroline: false,
        showticklabels: false,
      },
      yaxis: {
        showgrid: true,
        gridcolor: "rgba(28,31,35,0.08)",
        zeroline: false,
        showticklabels: false,
      },
      hoverlabel: {
        bgcolor: "#ffffff",
        bordercolor: "#d9d3ca",
        font: { color: "#1c1f23", size: 13 },
      },
    };

    Plotly.react(plotEl, buildTraces(), layout, {
      responsive: true,
      scrollZoom: true,
      displaylogo: false,
      modeBarButtonsToRemove: ["lasso2d", "select2d", "autoScale2d"],
    });
  }

  function profileLink(label, href, icon) {
    if (!href) {
      return null;
    }

    const link = document.createElement("a");
    link.className = "profile-link";
    link.href = href;
    link.target = "_blank";
    link.rel = "noreferrer";

    const image = document.createElement("img");
    image.src = icon;
    image.alt = "";

    const text = document.createElement("span");
    text.textContent = label;

    link.append(image, text);
    return link;
  }

  function showProfile(row) {
    emptyStateEl.hidden = true;
    profileEl.hidden = false;

    profileNameEl.textContent = fullName(row);
    profileClusterEl.textContent = clusterLabel(row.cluster);
    profileCitationEl.textContent = row.Citation || "No citation available.";
    profileKeywordsEl.textContent = row.keywords || "No keywords available.";

    if (row.image_url && row.image_url !== "nan") {
      profileImageEl.src = row.image_url;
      profileImageEl.alt = fullName(row);
      profileMediaEl.hidden = false;
    } else {
      profileImageEl.removeAttribute("src");
      profileImageEl.alt = "";
      profileMediaEl.hidden = true;
    }

    profileLinksEl.innerHTML = "";
    [
      profileLink("ACM profile", row["ACM Fellow Profile"], "assets/acm.png"),
      profileLink("DBLP", row["DBLP profile"], "assets/dblp.png"),
      profileLink("Google Scholar", row["Google Scholar Profile"], "assets/google-scholar.png"),
    ].filter(Boolean).forEach((link) => profileLinksEl.appendChild(link));
  }

  function wireEvents() {
    document.querySelectorAll("[data-projection]").forEach((button) => {
      button.addEventListener("click", () => {
        state.projection = button.dataset.projection;
        document.querySelectorAll("[data-projection]").forEach((item) => {
          item.classList.toggle("active", item === button);
        });
        renderPlot();
      });
    });

    searchEl.addEventListener("input", () => {
      state.search = normalize(searchEl.value.trim());
      renderPlot();
    });

    document.getElementById("clear-clusters").addEventListener("click", () => {
      state.selectedClusters = new Set(Array.from({ length: 10 }, (_, i) => i));
      clusterListEl.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        checkbox.checked = true;
      });
      renderPlot();
    });

    plotEl.on("plotly_click", (event) => {
      const point = event.points && event.points[0];
      if (point && point.customdata) {
        showProfile(point.customdata);
      }
    });
  }

  createClusterControls();
  renderPlot();
  wireEvents();
}());
