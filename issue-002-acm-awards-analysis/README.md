# ACM Fellows Citation Map

Static visualization for `castorini/ura-projects` issue #2.

Open `index.html` in a browser. No backend is required: Plotly, the UMAP data, and the t-SNE data are bundled locally, so the page can run from a static file host or directly from disk.

## Data

The app uses precomputed visualization outputs from:

- `MojTabaa4/acm-citations`
- `lintool/cs-big-cows`

Each point represents an ACM Fellow citation. The page supports projection switching, cluster filtering, text search, hover details, and clicked profile details.
