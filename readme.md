# Digital Cultural Heritage — Baltic Exhibition 1914

A prototype website built as part of a minor digitization project, presenting digitized photographic and textual material from the 1914 Baltic Exhibition in Malmö, Sweden.

**Live site:** https://roerstrand.github.io/Digitization-Project/

---

## About the project

The Baltic Exhibition (Baltiska utställningen) ran from 15 May to 4 October 1914 in Malmö. Four nations participated — Sweden, Denmark, Germany and Russia — each erecting purpose-built national pavilions that were torn down after the event. It was the largest exhibition ever hosted in the Nordic countries at the time, and the last major showcase of the Jugend architectural style in Sweden. The exhibition closed just two months after the outbreak of the First World War.

This site makes digitized catalog photographs and archival text accessible online, with contextual information about the buildings, their architects, and the historical moment.

---

## Digitization pipeline

```
Source Material  →  Digitization  →  Metadata  →  Public Website
  references/          img/          metadata/     index.html +
 paper_clippings    photographs     Dublin Core    building pages
 (scanned prints)  (catalog imgs)    TEI XML
```

Physical catalogs and newspaper clippings from Malmö City Library were scanned and photographed to produce archival-quality image files. Each item was then described with Dublin Core metadata (XML) and key texts were transcribed as TEI XML. The result is this website — a freely accessible, structured digital collection.

---

## Structure

```
.
├── index.html                        # Home page with slideshow and historical context
├── baltictower.html                  # The Swedish Baltic Tower
├── danishbuilding.html               # The Danish Exhibition Building
├── germanbuilding.html               # The German Exhibition Building
├── russianbuilding.html              # The Russian Exhibition Building
│
├── css/main.css                      # All custom styles
├── scripts/main.js                   # Slideshow, dark mode, scroll-reveal, nav toggle
│
├── img/                              # Digitized photographs, organised by building
│   ├── baltictower/
│   ├── danishbuilding/
│   ├── germanbuilding/
│   ├── russianbuilding/
│   └── commissariats/
│
├── tei/                              # TEI XML source transcriptions
│   ├── foreignCommisariat.xml
│   └── constructionTeam.xml
│
├── xsl/                              # XSLT stylesheets for TEI → HTML transformation
│
├── TEI-XSL-HTML conversion files/    # HTML output of the TEI → XSLT pipeline
│   ├── constructionCommissariat.html
│   ├── danishCommissariat.html
│   ├── germanCommissariat.html
│   └── russianCommissariat.html
│
├── metadata/                         # Dublin Core / descriptive metadata (XML)
├── metadataonwebsite/                # Metadata presented as web pages
├── images/logos/                     # Creative Commons license icons
└── references/                       # Scanned newspaper clippings (source material)
```

---

## Technologies

- **HTML5 / CSS3** — semantic markup, custom CSS with CSS variables and dark mode
- **Bootstrap 4.3** — responsive grid and utilities
- **Vanilla JavaScript** — slideshow with autoplay, dark mode toggle, scroll-reveal, hamburger nav
- **TEI XML** — archival text encoded according to the Text Encoding Initiative standard
- **XSLT** — transforms TEI XML sources into HTML pages

---

## Running locally

No build step required. Open any `.html` file directly in a browser, or serve the root with a local server to avoid path issues:

```bash
npx serve .
# or
python -m http.server
```

---

## License

Site code and editorial content: © 2025 Robin Erik Strandberg — [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

Source photographs and catalog texts: out of copyright under Swedish law (1960:297), 4 Kap 44 §. Originals held by Malmö City Library.