# ACM Fellows Citation Map

Static visualization for [`castorini/ura-projects` issue #2](https://github.com/castorini/ura-projects/issues/2): exploring ACM Fellows citation statements with embeddings, dimensionality reduction, and clustering.

Open `index.html` in a browser. No backend is required: Plotly, the UMAP data, and the t-SNE data are bundled locally, so the page can run from a static file host or directly from disk.

The deployed GitHub Pages URL is:

```text
https://castorini.github.io/ura-projects/issue-002-acm-awards-analysis/
```

## App Features

- UMAP and t-SNE projection switching.
- Text search over names, citations, keywords, and profile links.
- Cluster filters with `[show all]` and `[hide all]` actions.
- Named research-area clusters instead of anonymous cluster numbers.
- Draggable left and right panels on desktop layouts.
- Clicked-point details panel with citation, cluster discipline, keywords, and profile links.
- Custom hover card with a larger name, discipline name, citation preview, and profile image when available.
- No Plotly legend in the main view; cluster names are available in the left filter panel and detail views.

## Cluster Labels

The current cluster labels are:

1. Computer Security and Cryptography
2. Artificial Intelligence and Machine Learning
3. Algorithms, Complexity, and Theoretical Computer Science
4. Programming Languages and Software Engineering
5. Computing Education, Professional Practice, and Interdisciplinary Computing
6. Databases, Data Management, and Information Retrieval
7. Computer Graphics, Computer Vision, and Multimedia
8. Human-Computer Interaction and Social Computing
9. Computer Networks, Wireless Systems, and Mobile Computing
10. Computer Architecture, Distributed Systems, and High-Performance Computing

## Data

The app uses precomputed visualization outputs from:

- `MojTabaa4/acm-citations`
- `lintool/cs-big-cows`

Each point represents an ACM Fellow citation. The bundled data files are:

- `data/umap-data.js`
- `data/tsne-data.js`

## Google Scholar Validation

The `scripts/validate_google_scholar_profiles.py` script checks the bundled Google Scholar URLs against the profile titles returned by Google Scholar. It is restartable and writes cache/report files under this directory's `.cache/` directory by default.

```bash
python3 scripts/validate_google_scholar_profiles.py
```

Defaults are intentionally slow: 2 seconds between uncached requests, 20 requests per batch, and a 2 minute pause between batches. Cached URLs are skipped on later runs.

Useful options:

```bash
python3 scripts/validate_google_scholar_profiles.py --limit-new 20
python3 scripts/validate_google_scholar_profiles.py --refresh
python3 scripts/validate_google_scholar_profiles.py --data data/tsne-data.js
```

The script only writes validation output. It does not modify the bundled app data files.

Default outputs:

- `.cache/google-scholar-validation-cache.json`
- `.cache/google-scholar-validation-report.json`

Do not run large uncached batches aggressively. Google Scholar may throttle or return degraded responses after sustained automated traffic.
