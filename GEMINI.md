# GEMINI.md - Carolina Tire Website Project Information

This document provides essential information for the Gemini model regarding the `carolina-tire-website` project.

## Project Overview

This is a multi-location static website for Carolina Tire, built using HTML and CSS, served by a simple Python HTTP server. The goal is to provide a modern, responsive, and informative online presence for the business's various locations.

## Project Structure

```
carolina-tire-website/
├── src/
│   ├── index.html
│   ├── styles.css
│   ├── images/ (contains placeholder images)
│   ├── locations/
│   │   ├── charleston.html
│   │   ├── knoxville.html
│   │   ├── lenoir-city.html
│   │   ├── powell.html
│   │   └── rocky-mount.html
│   ├── services.html
│   └── contact.html
├── server.py
└── README.md
└── GEMINI.md
```

- `src/`: Contains all the static web assets (HTML, CSS, images).
- `server.py`: A Python script that runs a simple HTTP server to serve the `src/` directory.

## How to Run the Project

To run the development server:

1.  Navigate to the `carolina-tire-website` directory:
    ```bash
    cd /Users/aaronstransky/Development/Carolina_Tire/carolina-tire-website
    ```
2.  Execute the `server.py` script in the background:
    ```bash
    python3 server.py &
    ```
    The website will be accessible at `http://localhost:7100`.

## Conventions and Best Practices Followed

-   **File Paths:** All internal file paths in HTML (`href`, `src`) are relative to the `src` directory. Absolute paths are used for tool operations (e.g., `write_file`, `read_file`).
-   **Styling:** All styling is managed within `src/styles.css`. Google Fonts are imported for typography.
-   **Responsiveness:** The design aims to be responsive, adapting to various screen sizes using CSS.
-   **Content:** Content is structured semantically using HTML5 elements. Placeholder images are used where specific client assets are unavailable.
-   **Accessibility:** Basic accessibility considerations like `alt` attributes for images are included.

## Development Notes

-   The `replace` tool has been challenging for large content blocks or when the `old_string` is not an exact match. Overwriting the entire file with `write_file` has been a more reliable approach for significant updates.
-   Direct image fetching from web search results or external websites is not consistently supported by the `web_fetch` tool; direct image URLs are preferred.
