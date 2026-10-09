// Biblio Atelier - Museum-Grade Library Specimen Dataset (Specimen Design Guide Alignment)

const LIBRARY_DATA = [
  {
    id: 'classification-systems',
    title: "Dewey & LCC Classification",
    subtitle: "Relative Location & Subject Shelf Placement",
    category: "Cataloging & Organization",
    era: "Library Science Core",
    accent: "#b85c37",
    badgeId: "ddc-navigator",
    badgeName: "Dewey Navigator 🧭",
    thumbGlyph: "🏷",
    latinName: "Specimen Systema Classificatorium",
    description: "Observable Specimen: A single precision-crafted 19th-century Oak Bookcase Bay exhibiting relative location indexing, Cutter number alignment, and DDC decimal expansions.",
    specimen: {
      type: "classification-bay",
      name: "The Classification Bay Specimen",
      scientificName: "Specimen Locationis Relativae",
      description: "An isolated single oak bay specimen showing DDC decimal expansions and LCC alphanumeric relative location.",
      layers: ["shelf-framework", "call-numbers", "subject-colors", "cutter-labels"],
      compareWith: "marc-metadata",
      image: "assets/specimens/classification-bay.jpg"
    },
    keyFacts: [
      { label: "Specimen Type", value: "Single Oak Bookcase Bay", icon: "◇" },
      { label: "DDC Main Classes", value: "10 Numeric Series (000–900)", icon: "♙" },
      { label: "LCC Main Classes", value: "21 Letter Classes (A–Z)", icon: "⌁" },
      { label: "Cutter System", value: "Author surname code (e.g. .S57)", icon: "❋" },
      { label: "Core Feature", value: "Relative Location Indexing", icon: "⌖" },
      { label: "Global Footprint", value: "200,000+ Libraries Worldwide", icon: "◈" }
    ],
    scholarlyNote: "In this specimen, relative location replaces fixed shelf placement: books are grouped by intellectual subject matter rather than physical box numbers.",
    didYouKnow: "Melvil Dewey was a passionate spelling reformer who advocated simplified spelling, which is why early DDC manuals spelled words like 'Catalog' as 'Katalog'!",
    hotspots: [
      { 
        id: "ddc000", 
        name: "000 Computer Science & Info", 
        desc: "Knowledge systems, computer science, bibliographies, and rare manuscripts.", 
        position: [-0.48, 0.28, 0.24],
        lesson: "The 000 class holds Generalities, Computer Science, and Library Science. Division 020 specifically handles Library & Information Sciences.",
        quiz: {
          question: "Which 3-digit Dewey division specifically contains Library Science?",
          options: ["020", "004", "050", "090"],
          correct: 0,
          explanation: "Division 020 is Library & Information Science, while 004 is Computer Science and 090 is Manuscripts & Rare Books."
        }
      },
      { 
        id: "ddc300", 
        name: "300 Social Sciences & Law", 
        desc: "Includes economics, law, government, education, and folklore.", 
        position: [0.02, 0.28, 0.24],
        lesson: "The 300 Class covers Social Sciences. Law is classified in 340, Education in 370, and Commerce in 380.",
        quiz: {
          question: "Where is Law classified in the Dewey Decimal System?",
          options: ["340", "300", "370", "320"],
          correct: 0,
          explanation: "340 is the designated division for Law in DDC."
        }
      },
      { 
        id: "ddc800", 
        name: "800 Literature & Rhetoric", 
        desc: "Poetry, drama, essays, and prose arranged by national origin.", 
        position: [0.48, 0.28, 0.24],
        lesson: "The 800 Class classifies literature primarily by language and national origin (810 American, 820 English), then by literary form.",
        quiz: {
          question: "In DDC, how is the 800 Literature class subdivided first?",
          options: ["Language and national origin", "Alphabetical by title", "Publication year", "Page length"],
          correct: 0,
          explanation: "800 Literature is grouped first by original language and nationality, then by form (poetry, drama, prose)."
        }
      },
      { 
        id: "cutter", 
        name: "Author Cutter Number (.S57)", 
        desc: "Alphanumeric code arranging works alphabetically on shelf.", 
        position: [-0.68, 0.05, 0.05],
        lesson: "Cutter-Sanborn numbers convert author surnames into alphanumeric codes so books within the same DDC class line up alphabetically.",
        quiz: {
          question: "What does the Cutter number .S57 represent in a call number for William Shakespeare?",
          options: ["Author Surname Designation", "Subject Code", "Publication Year", "Page Count"],
          correct: 0,
          explanation: "The Cutter number is derived from the author's surname (Shakespeare -> .S57) to sort works alphabetically."
        }
      }
    ],
    practice: [
      {
        id: "ddc-main-class",
        type: "multiple-choice",
        question: "Which DDC main class covers Computer Science & Information?",
        options: ["000", "100", "300", "600"],
        correct: "000",
        explanation: "The 000 main class covers Computer Science, Knowledge, Information Systems, and Bibliographies."
      }
    ],
    scenarios: [
      {
        id: "ai-scattered",
        title: "Scattered AI Books Complaint",
        situation: "A faculty member demands all AI books be placed in a single shelf location, though DDC distributes them across 006.3, 303.48, and 621.3.",
        question: "What is the best professional response?",
        options: [
          { text: "Move all AI books forcibly into 006.3", correct: false, feedback: "Violates relative location rules because social impact and engineering belong in their respective subject classes." },
          { text: "Explain relative location principles and offer digital pathfinders", correct: true, feedback: "Correct! DDC classifies works by discipline. Pathfinders connect patrons across disciplines without breaking shelf rules." }
        ]
      }
    ],
    callNumberPractice: {
      title: "Call Number Construction Sandbox",
      targetBook: { title: "Introduction to Library Science", author: "Melvil Dewey", year: "1876" },
      steps: [
        { stepName: "1. Select Main DDC Class", options: [{ label: "000 — Generalities & Info", value: "020", correct: true }, { label: "800 — Literature", value: "800", correct: false }] },
        { stepName: "2. Select DDC Sub-division", options: [{ label: ".54 — Cataloging", value: ".54", correct: true }, { label: ".01 — Philosophy", value: ".01", correct: false }] },
        { stepName: "3. Select Author Cutter Number", options: [{ label: ".D519 (Dewey)", value: ".D519", correct: true }, { label: ".S57 (Shakespeare)", value: ".S57", correct: false }] }
      ],
      finalTargetCallNumber: "020.54 .D519"
    },
    readerText: `[DEWEY DECIMAL CLASSIFICATION 10 MAIN CLASSES]:
000 — Computer Science, Information & General Works
100 — Philosophy & Psychology
200 — Religion & Theology
300 — Social Sciences, Economics, Law & Education
400 — Language & Linguistics
500 — Science, Mathematics & Astronomy
600 — Technology, Medicine & Applied Sciences
700 — Arts, Architecture, Music & Recreation
800 — Literature & Rhetoric
900 — History, Geography & Biography`,
    shelfBooks: [
      {
        id: "dewey-1876-master",
        title: "Dewey Decimal Classification & Relative Index",
        author: "Melvil Dewey, A.M.",
        year: "1876",
        callNumber: "025.4 D519",
        cutter: ".D519",
        spineColor: "#4a151b",
        accentColor: "#d4af37",
        bindingType: "morocco-gold",
        coverType: "library-master",
        ribbonColor: "#1a2c42",
        giltEdges: "gold",
        hasFiligree: true,
        category: "Library Science Core",
        description: "Landmark First Edition: Bound in antique oxblood morocco leather with 24-karat gold fillet tooling, 5 raised spine ribs, gold leaf edges, and combed peacock marbled endpapers.",
        catalogRecord: `LEADER 01482cam a2200385 a 4500
001 rec-ddc-1876-master
008 760101s1876    mau      b    000 0 eng  
010 ## $a 02000001
020 ## $a (Hbk.) Deluxe Library Science Series
050 00 $a Z696 $b .D519 1876
082 00 $a 025.4 $2 23
100 1# $a Dewey, Melvil, $d 1851-1931, $e author.
245 14 $a A classification and subject index for cataloguing and arranging the books and pamphlets of a library / $c by Melvil Dewey.
264 #1 $a Amherst, Mass. : $b [Amherst College Library Press], $c 1876.
300 ## $a 44 pages ; $c 25 cm
500 ## $a Master Specimen: 19th-century gold-tooled oxblood morocco leather with 5 raised spine bands, gilded page block, and relative location system tables.
650 #0 $a Classification, Dewey decimal $v Handbooks, manuals, etc.
650 #0 $a Classification $x Books.
650 #0 $a Libraries $x Shelf arrangement.
710 2# $a Amherst College. $b Library.`,
        pages: [
          {
            chapter: "Historical Introduction",
            header: "The Principle of Relative Location (1876)",
            content: `The plan of the following classification was developed early in the winter of 1873 at Amherst College. For over a century, libraries had arranged their collections by fixed location — assigning each book to a specific shelf and press number. When shelves filled, entire libraries had to be renumbered.

Relative location revolutionized library architecture. Instead of fixing a volume to a physical shelf, each work receives a decimal notation reflecting its intellectual discipline. As new books are added, they slip into their precise subject relationship automatically, moving freely along the shelves without altering catalog cards or spine numbers.

"The library is not a repository of dead books, but a living, growing organism whose intellectual map must expand with human knowledge."`,
            note: "First edition of Dewey's monograph (Amherst, Mass., 1876), establishing modern open-shelf access."
          },
          {
            chapter: "The Ten Decimal Classes",
            header: "Structure of the 1,000 Categories",
            content: `The field of knowledge is divided into nine main classes, numbered 1 to 9, while general encyclopedias, bibliographies, and periodicals form a preliminary tenth class numbered 0:

000 — Computer Science, Information & General Works
100 — Philosophy & Psychology
200 — Religion & Theology
300 — Social Sciences, Economics, Law & Education
400 — Language & Linguistics
500 — Science & Mathematics
600 — Technology & Applied Sciences
700 — Arts, Architecture & Recreation
800 — Literature & Rhetoric
900 — History, Geography & Biography

Each main class is subdivided into nine divisions, and each division into nine sections, providing a decimal taxonomy capable of infinite expansion.`,
            note: "The tri-digit notation (000-900) standardizes shelf placement worldwide across more than 135 countries."
          },
          {
            chapter: "Cutter Numbers & Arrangement",
            header: "Alphanumeric Precision on the Stacks",
            content: `To prevent clutter within a single subject division, Charles Ammi Cutter formulated the author mark system. By combining the author's surname initial with a table of decimal digits (e.g. Dewey -> .D519), volumes within the same class (025.4) arrange themselves in exact alphabetical sequence.

On the physical shelf, the call number is read hierarchically:
Line 1: Classification Number (025.4 — Subject)
Line 2: Cutter Author Code (.D519 — Surname)
Line 3: Edition or Year (1876 — Chronology)

Thus every volume possesses an unambiguous, globally unique shelf address.`,
            note: "Cutter-Sanborn author marks remain the standard for alphanumeric shelf sequencing in modern academic and research collections."
          }
        ]
      },
      {
        id: "lcc-outline-1904",
        title: "Library of Congress Classification: Outline Scheme",
        author: "Charles Martel & J.C.M. Hanson",
        year: "1904",
        callNumber: "Z668 .M37 1904",
        cutter: ".M37",
        spineColor: "#102236",
        accentColor: "#cbd5e1",
        bindingType: "buckram-silver",
        coverType: "library-standard",
        ribbonColor: "#b85c37",
        giltEdges: "deckled",
        hasFiligree: false,
        category: "Cataloging & Classification",
        description: "Official Library of Congress manual establishing the 21 letter-based main classes for universal research libraries.",
        catalogRecord: `LEADER 01180nam a2200301 a 4500
001 rec-lcc-1904-001
008 040101s1904    dcu      b    000 0 eng  
050 00 $a Z696.U5 $b M3 1904
082 00 $a 025.433 $2 23
100 1# $a Martel, Charles, $d 1860-1945.
245 10 $a Library of Congress classification : $b Outline scheme of classes.
264 #1 $a Washington : $b Government Printing Office, $c 1904.
300 ## $a 22 pages ; $c 26 cm
500 ## $a Bound in Oxford navy buckram with silver stamping.
650 #0 $a Classification, Library of Congress.`,
        pages: [
          {
            chapter: "LCC Foundations",
            header: "The 21 Alphanumeric Classes",
            content: `Designed specifically for the vast national collections of the Library of Congress under Librarian Herbert Putnam, LCC utilizes letters A through Z to distribute academic disciplines across 21 broad categories, accommodating millions of research monographs without deep decimal chains.`
          }
        ]
      },
      {
        id: "cutter-expansive-1891",
        title: "Expansive Classification: Part I",
        author: "Charles Ammi Cutter",
        year: "1891",
        callNumber: "025.42 C991e",
        cutter: ".C991",
        spineColor: "#133824",
        accentColor: "#d4af37",
        bindingType: "calf-gold",
        coverType: "library-standard",
        ribbonColor: "#c28e46",
        giltEdges: "gold",
        hasFiligree: false,
        category: "Library Science",
        description: "Cutter's progressive seven-stage classification system designed to expand proportionally as small libraries grew into major university collections.",
        pages: [
          {
            chapter: "The Seven Expansions",
            header: "Evolutionary Shelf Taxonomy",
            content: `The Expansive Classification is composed of seven separate classification schemes, the first being extremely simple and suited to small village collections of a few hundred books, while each successive expansion introduces greater depth and specificity until the seventh expansion accommodates the largest research libraries in the world.`
          }
        ]
      },
      {
        id: "cutter-1876",
        title: "Rules for a Dictionary Catalog",
        author: "Charles Ammi Cutter",
        year: "1876",
        callNumber: "025.3 C991r",
        cutter: ".C991",
        spineColor: "#1e2e38",
        accentColor: "#4f8ca8",
        category: "Cataloging Rules",
        description: "The seminal treatise that defined author, title, and subject entry objectives for modern public catalogs.",
        pages: [
          {
            chapter: "Objects & Means",
            header: "The Three Objects of the Library Catalog",
            content: `1. To enable a person to find a book of which either the author, the title, or the subject is known.
2. To show what the library has by a given author, on a given subject, or in a given kind of literature.
3. To assist in the choice of a book as to its edition (bibliographically) or as to its character (literary or topical).

MEANS:
- Author-entry with the necessary entries and references for joint authors, editors, translators, and illustrators.
- Title-entry or title-reference for books published anonymously or for distinct literary titles.
- Subject-entry and cross-references from synonyms and broader terms.`,
            note: "Cutter's 'Objects' remain the benchmark standard codified in today's RDA and FRBR user tasks: Find, Identify, Select, Obtain."
          },
          {
            chapter: "Principles of Subject Entry",
            header: "Specific Heading Rule",
            content: `Enter a work under its specific subject heading, not under the heading of a class which includes that subject. 

Put a book on the Robin under ROBIN, not under ORNITHOLOGY or BIRDS; put a treatise on the steam-engine under STEAM-ENGINE, not under MACHINERY or APPLIED SCIENCE.

Cataloging is an art, not a science. No rules can take the place of intelligence and good judgment. The convenience of the public is always to be set before the ease of the cataloger.`,
            note: "This rule established the direct access pattern used by modern search engines and OPAC subject queries."
          }
        ]
      },
      {
        id: "fitzgerald-gatsby",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        year: "1925",
        callNumber: "813.52 F553g",
        cutter: ".F553",
        spineColor: "#1a3828",
        accentColor: "#e6c35c",
        category: "American Literature",
        description: "Classic American literary specimen classified under DDC 813 (American Fiction) and LCC PS3511.I9 G7.",
        pages: [
          {
            chapter: "Chapter I",
            header: "In My Younger and More Vulnerable Years",
            content: `In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.

"Whenever you feel like criticizing anyone," he told me, "just remember that all the people in this world haven't had the advantages that you've had."

He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I'm inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.

Reserving judgments is a matter of infinite hope. I am still a little afraid of missing something if I forget that, as my father snobbishly suggested, and I snobbishly repeat, a sense of the fundamental decencies is parcelled out unequally at birth.`,
            note: "Classified in American Fiction: DDC 813.52 (1900-1945 period) / LCC PS3511.I9 G7."
          },
          {
            chapter: "Chapter I (Continued)",
            header: "The Green Light on the Dock",
            content: `When I came back from the East last autumn I felt that I wanted the world to be in uniform and at a sort of moral attention forever; I wanted no more riotous excursions with privileged glimpses into the human heart. Only Gatsby, the man who gives his name to this book, was exempt from my reaction—Gatsby, who represented everything for which I have an unaffected scorn. 

If personality is an unbroken series of successful gestures, then there was something gorgeous about him, some heightened sensitivity to the promises of life, as if he were related to one of those intricate machines that register earthquakes ten thousand miles away. 

It was an extraordinary gift for hope, a romantic readiness such as I have never found in any other person and which it is not likely I shall ever find again. No—Gatsby turned out all right at the end; it is what preyed on Gatsby, what foul dust floated in the wake of his dreams that temporarily closed out my interest in the abortive sorrows and short-winded elations of men.`,
            note: "Original blue cloth binding published by Charles Scribner's Sons, New York, April 1925."
          }
        ]
      },
      {
        id: "darwin-origin",
        title: "On the Origin of Species",
        author: "Charles Darwin",
        year: "1859",
        callNumber: "576.82 D228o",
        cutter: ".D228",
        spineColor: "#3c2018",
        accentColor: "#b27342",
        category: "Natural Sciences",
        description: "Foundational work of evolutionary biology classified under DDC 576.82 (Evolution) and LCC QH365.O2.",
        pages: [
          {
            chapter: "Introduction",
            header: "The Voyage of the H.M.S. Beagle",
            content: `When on board H.M.S. 'Beagle,' as naturalist, I was much struck with certain facts in the distribution of the organic beings inhabiting South America, and in the geological relations of the present to the past inhabitants of that continent. These facts seemed to throw some light on the origin of species—that mystery of mysteries, as it has been called by one of our greatest philosophers.

On my return home, it occurred to me, in 1837, that something might perhaps be made out on this question by patiently accumulating and reflecting on all sorts of facts which could possibly have any bearing on it. After five years' work I allowed myself to speculate on the subject, and drew up some short notes; these I enlarged in 1844 into a sketch of the conclusions, which then seemed to me probable.

From that period to the present day I have steadily pursued the same object. I hope that I may be excused for entering on these personal details, as I give them to show that I have not been hasty in coming to a decision.`,
            note: "First edition published by John Murray, London, on November 24, 1859 (1,250 copies)."
          },
          {
            chapter: "Chapter XIV: Recapitulation & Conclusion",
            header: "There Is Grandeur in This View of Life",
            content: `It is interesting to contemplate a tangled bank, clothed with many plants of many kinds, with birds singing on the bushes, with various insects flitting about, and with worms crawling through the damp earth, and to reflect that these elaborately constructed forms, so different from each other, and dependent on each other in so complex a manner, have all been produced by laws acting around us.

These laws, taken in the largest sense, being Growth with Reproduction; Inheritance which is almost implied by reproduction; Variability from the indirect and direct action of the conditions of life, and from use and disuse; a Ratio of Increase so high as to lead to a Struggle for Life, and as a consequence to Natural Selection, entailing Divergence of Character and the Extinction of less-improved forms.

Thus, from the war of nature, from famine and death, the most exalted object which we are capable of conceiving, namely, the production of the higher animals, directly follows. There is grandeur in this view of life, with its several powers, having been originally breathed into a few forms or into one; and that, whilst this planet has gone cycling on according to the fixed law of gravity, from so simple a beginning endless forms most beautiful and most wonderful have been, and are being, evolved.`,
            note: "The famous concluding paragraph of 19th-century scientific literature."
          }
        ]
      }
    ],
    clinicalConditions: ["Reclassification projects (DDC to LCC)", "Cutter-Sanborn table alignment", "Auxiliary tables (Table 1 Areas)"],
    quiz: [
      { question: "Which Dewey Decimal class covers Computer Science and Information?", options: ["000 Series", "500 Series", "300 Series", "800 Series"], answer: 0, explanation: "000 covers Computer Science & Information." },
      { question: "What is the primary innovation of Dewey's relative location system?", options: ["Numbering the subject rather than the shelf", "Fixing books in metal cages", "Ordering books by binding color", "Printing cards in Latin"], answer: 0, explanation: "Relative location numbers intellectual subjects so new acquisitions slot in anywhere without renumbering existing shelves." }
    ]
  },
  {
    id: 'marc-metadata',
    title: "MARC 21 & Metadata Standards",
    subtitle: "Bibliographic Control & Field Structures",
    category: "Bibliographic Control",
    era: "Cataloging Standard",
    accent: "#c28e46",
    badgeId: "marc-tagger",
    badgeName: "MARC Tagger 💻",
    thumbGlyph: "💻",
    latinName: "Specimen Data Bibliographica",
    description: "Observable Specimen: A floating 3D MARC Catalog Card & Digital Tag Stand displaying 3-digit numerical tags, subfield delimiters ($a, $b, $c), and ISO 2709 leader strings.",
    specimen: {
      type: "marc-catalog-card",
      name: "The 3D MARC Catalog Record Specimen",
      scientificName: "Specimen Tagging Bibliographici",
      description: "A physical catalog card overlaid with glowing digital MARC 21 field tags and subfield indicators.",
      layers: ["card-base", "field-tags", "subfield-delimiters", "raw-leader"],
      compareWith: "classification-systems",
      image: "assets/specimens/marc-catalog.jpg"
    },
    keyFacts: [
      { label: "Specimen Type", value: "3D MARC Catalog Card & Digital Tag Stand", icon: "◇" },
      { label: "Pioneer", value: "Henriette Avram (Library of Congress, 1968)", icon: "♙" },
      { label: "MARC Tag 100", value: "Main Entry — Personal Author", icon: "⌁" },
      { label: "MARC Tag 245", value: "Title Statement ($a $b $c)", icon: "⌖" },
      { label: "MARC Tag 650", value: "Subject Heading (LCSH)", icon: "❋" },
      { label: "Dublin Core", value: "15 Core Web Metadata Elements", icon: "◈" }
    ],
    scholarlyNote: "This specimen illustrates how Henriette Avram's 3-digit numeric tags allowed mainframes to parse human book cataloging globally.",
    didYouKnow: "OCLC WorldCat contains over 540 million MARC bibliographic records contributed by 16,000 libraries in 123 countries!",
    hotspots: [
      { 
        id: "tag100", 
        name: "Field 100: Main Author", 
        desc: "100 1# $a Shakespeare, William, $d 1564-1616.", 
        position: [0, 0.38, 0.05],
        lesson: "Tag 100 is for the primary personal author entry. Subfield $a contains surname, $d contains birth/death years.",
        quiz: {
          question: "Which subfield in MARC Tag 100 contains the author's birth and death dates?",
          options: ["$d", "$a", "$b", "$q"],
          correct: 0,
          explanation: "Subfield $d stores dates associated with a personal name heading."
        }
      },
      { 
        id: "tag245", 
        name: "Field 245: Title Statement", 
        desc: "245 10 $a Hamlet $c William Shakespeare.", 
        position: [0, 0.22, 0.05],
        lesson: "Tag 245 contains Title ($a), Subtitle ($b), and Statement of Responsibility ($c).",
        quiz: {
          question: "In MARC Tag 245, which subfield holds the subtitle?",
          options: ["$b", "$a", "$c", "$n"],
          correct: 0,
          explanation: "Subfield $b holds remainder of title / subtitle."
        }
      },
      { 
        id: "tag260", 
        name: "Field 260/264: Imprint", 
        desc: "264 #1 $a London : $b Printed by Isaac Iaggard, $c 1623.", 
        position: [0, 0.06, 0.05],
        lesson: "Field 260 (or RDA 264) records publication place ($a), publisher name ($b), and copyright/publication date ($c).",
        quiz: {
          question: "In MARC publication fields (260/264), which subfield holds the publication date?",
          options: ["$c", "$a", "$b", "$e"],
          correct: 0,
          explanation: "Subfield $c stores the date of publication, distribution, or copyright."
        }
      },
      { 
        id: "tag650", 
        name: "Field 650: Subject Heading", 
        desc: "650 #0 $a English drama $y Early modern, 1500-1600.", 
        position: [0, -0.10, 0.05],
        lesson: "Field 650 provides topical access using controlled vocabularies like Library of Congress Subject Headings (LCSH).",
        quiz: {
          question: "What is the primary function of MARC Tag 650?",
          options: ["Topical Subject Heading", "Publisher Address", "Physical Dimensions", "ISBN Number"],
          correct: 0,
          explanation: "Tag 650 encodes topical terms from controlled vocabularies (e.g. LCSH) for subject retrieval."
        }
      }
    ],
    practice: [
      { id: "marc-field-245", type: "multiple-choice", question: "Which MARC 21 field tag is used for the Title Statement?", options: ["Tag 245", "Tag 100", "Tag 650", "Tag 300"], correct: "Tag 245", explanation: "Tag 245 holds Title & Statement of Responsibility." }
    ],
    scenarios: [
      { id: "marc-author-error", title: "Cataloging Import Error", situation: "A batch import failed because an author was tagged as 700 instead of 100.", question: "How should you correct this record?", options: [{ text: "Change Tag 700 to Tag 100 for primary author main entry", correct: true, feedback: "Correct! Tag 100 is for primary author main entry." }, { text: "Delete the author field", correct: false, feedback: "Incorrect!" }] }
    ],
    marcPractice: {
      title: "MARC 21 Field Tag Practice",
      targetRecord: { author: "Isaac Newton", title: "Principia Mathematica", publisher: "Royal Society", year: "1687" },
      fields: [
        { tag: "100", label: "Main Author ($a)", expected: "Newton, Isaac, Sir", placeholder: "Surname, firstname..." },
        { tag: "245", label: "Title ($a)", expected: "Principia Mathematica", placeholder: "Title string..." }
      ]
    },
    readerText: `[MARC 21 BIBLIOGRAPHIC SPECIMEN RECORD]:
LEADER 01425cam a2200361i 4500
100 1# $a Shakespeare, William, $d 1564-1616.
245 10 $a Mr. William Shakespeares comedies, histories, & tragedies.
260 ## $a London : $b Printed by Isaac Iaggard, $c 1623.
650 #0 $a English drama $y Early modern, 1500-1600.`,
    shelfBooks: [
      {
        id: "avram-marc",
        title: "The MARC Pilot Project",
        author: "Henriette D. Avram",
        year: "1968",
        callNumber: "025.30285 A963m",
        cutter: ".A963",
        spineColor: "#223547",
        accentColor: "#61a0d8",
        category: "Bibliographic Control",
        description: "The official Library of Congress final report establishing machine-readable cataloging records and numeric tag directories.",
        catalogRecord: `LEADER 01180cam a2200301 a 4500
001 marc-pilot-1968
008 680101s1968    dcu      b    000 0 eng  
050 00 $a Z699 $b .A88
082 00 $a 025.30285 $2 23
100 1# $a Avram, Henriette D., $d 1919-2006.
245 14 $a The MARC pilot project : $b final report on a project sponsored by the Council on Library Resources / $c prepared by Henriette D. Avram.
260 ## $a Washington, D.C. : $b Library of Congress, $c 1968.
300 ## $a 183 p. : $b ill. ; $c 27 cm.
650 #0 $a Machine-readable bibliographic data.
650 #0 $a MARC formats.`,
        pages: [
          {
            chapter: "Introduction & Scope",
            header: "The Automation of Bibliographic Control",
            content: `The MARC (Machine-Readable Cataloging) Pilot Project was designed to test the feasibility of producing and distributing machine-readable cataloging data from the Library of Congress to a representative sample of participating libraries. 

Before the advent of standard magnetic tape records, every library was forced to re-key or photographically reproduce paper catalog cards individually. By establishing a standard record structure based on fixed-length leaders, directories, and variable data fields tagged with 3-digit numbers, computerized library networks became possible for the first time in history.

The fundamental design requirement was flexibility: the format had to represent books, serials, maps, and music across all natural languages and scripts without losing the bibliographic distinctions recognized by cataloging codes.`,
            note: "Henriette Avram led the team that designed the ISO 2709 standard underlying modern cataloging."
          },
          {
            chapter: "Field Structure & Delimiters",
            header: "The Mechanics of 3-Digit Tagging",
            content: `In the MARC record structure, each bibliographic datum is addressed by a 3-digit tag:

1XX — Main Entry Headings (100 Personal, 110 Corporate, 111 Meeting)
2XX — Titles and Title Paragraphs (245 Title Statement, 246 Variant Title)
3XX — Physical Description and Dimensions (300 Extent, Dimensions)
4XX/8XX — Series Statements and Tracings
5XX — Notes Paragraphs (500 General, 504 Bibliography, 520 Summary)
6XX — Subject Access Headings (650 Topical, 651 Geographic)
7XX — Added Entries (700 Personal, 710 Corporate)

Within each variable field, subfield codes composed of a delimiter ($) and an alphanumeric character identify discrete sub-elements, such as $a (title proper), $b (subtitle), and $c (statement of responsibility).`,
            note: "This tagged syntax enables search engines and ILS systems to index authors separately from subject headings."
          }
        ]
      },
      {
        id: "ifla-frbr",
        title: "Functional Requirements for Bibliographic Records",
        author: "IFLA Study Group",
        year: "1998",
        callNumber: "025.32 I23f",
        cutter: ".I23",
        spineColor: "#1d3326",
        accentColor: "#57b884",
        category: "Metadata Conceptual Models",
        description: "The international conceptual model establishing the entity-relationship hierarchy: Work, Expression, Manifestation, Item (WEMI).",
        pages: [
          {
            chapter: "Chapter 3: Group 1 Entities",
            header: "The WEMI Entity Hierarchy",
            content: `The entities in the first group represent the different aspects of user interests in the products of intellectual or artistic endeavor:

1. WORK: A distinct intellectual or artistic creation (e.g., Ludwig van Beethoven's Ninth Symphony).
2. EXPRESSION: The intellectual or artistic realization of a work in the form of alphanumerical, musical, or choreographic notation, sound, image, object, movement, or any combination of such forms.
3. MANIFESTATION: The physical embodiment of an expression of a work (e.g., a specific 1951 vinyl LP pressing on the Deutsche Grammophon label).
4. ITEM: A single exemplar of a manifestation (e.g., the specific copy on shelf 4 with barcode 3123456789).

By modeling bibliographic reality through these four levels, catalogs can group all translations, performances, and editions of a classic work together rather than scattering them across thousands of disconnected records.`,
            note: "FRBR forms the conceptual foundation for RDA (Resource Description and Access) and Bibframe."
          }
        ]
      }
    ],
    clinicalConditions: ["NACO authority name control", "RDA punctuation syntax", "ILS UTF-8 character conversion"],
    quiz: [
      { question: "Which MARC 21 field tag is used for the Title Statement?", options: ["Tag 245", "Tag 100", "Tag 650", "Tag 300"], answer: 0, explanation: "Tag 245 holds Title Statement." }
    ]
  },
  {
    id: 'preservation-science',
    title: "Preservation & Conservation Vaults",
    subtitle: "Environmental Controls, Deacidification, & Disaster Salvage",
    category: "Preservation Science",
    era: "Conservation Standard",
    accent: "#5a8b66",
    badgeId: "preservation-guardian",
    badgeName: "Preservation Guardian 🔬",
    thumbGlyph: "🔬",
    latinName: "Specimen Conservatio Documentorum",
    description: "Observable Specimen: A 3D Climate-Controlled Vault Storage Drawer containing a damaged 19th-century volume under specialized UV light, exhibiting paper acid burn, thermo-hygrometer sensors, and acid-free Mylar sleeves.",
    specimen: {
      type: "preservation-vault-drawer",
      name: "The Archival Preservation Vault Specimen",
      scientificName: "Specimen Archivi Conservativi",
      description: "An isolated archival drawer specimen under UV light showcasing acid degradation, climate sensors, and deacidification sprays.",
      layers: ["vault-chassis", "climate-sensors", "acid-damage", "uv-inspection"],
      compareWith: "special-collections",
      image: "assets/specimens/preservation-vault.jpg"
    },
    keyFacts: [
      { label: "Specimen Type", value: "3D Climate Vault Drawer Specimen", icon: "◇" },
      { label: "Ideal Climate", value: "60°F ± 5°F & 50% ± 5% RH", icon: "♙" },
      { label: "Paper Acid Burn", value: "Lignin breakdown producing sulfuric acid", icon: "⌁" },
      { label: "Archival Enclosure", value: "Buffered acid-free boxes & Mylar", icon: "⌖" },
      { label: "Mold Threshold", value: "RH > 65% triggers fungal bloom", icon: "❋" },
      { label: "Disaster Salvage", value: "Vacuum freeze-drying for waterlogged books", icon: "◈" }
    ],
    scholarlyNote: "Under UV fluorescence inspection, foxing spots and iron gall ink burn-through light up brightly before visual paper decay appears.",
    didYouKnow: "The Vatican Apostolic Archives contain 85 kilometers (53 miles) of climate-controlled shelving spanning 12 centuries of papal records!",
    hotspots: [
      { 
        id: "hygrometer", 
        name: "Precision Thermo-Hygrometer", 
        desc: "Sensor monitoring climate stability inside rare manuscript vaults.", 
        position: [-0.45, 0.18, 0.35],
        lesson: "Thermo-hygrometers continuously track temperature & relative humidity. Spikes above 65% RH trigger mold bloom.",
        quiz: {
          question: "What relative humidity level triggers mold outbreak in archives?",
          options: ["Above 65% RH", "Above 30% RH", "At 45% RH", "At 20% RH"],
          correct: 0,
          explanation: "Relative humidity above 65% triggers rapid fungal mold growth within 48 hours."
        }
      },
      { 
        id: "acidburn", 
        name: "Alum-Rosin Acid Degradation", 
        desc: "Brittle browning produced by acidic wood-pulp sizing.", 
        position: [0.15, -0.05, 0.15],
        lesson: "Post-1850 wood pulp paper contains alum-rosin sizing that produces sulfuric acid over time, causing progressive yellowing and embrittlement.",
        quiz: {
          question: "What chemical phenomenon causes 19th-century wood-pulp paper to embrittle?",
          options: ["Acid hydrolysis from alum-rosin sizing", "Excess nitrogen in the atmosphere", "Graphite sublimation", "Loss of ink pigmentation"],
          correct: 0,
          explanation: "Acid hydrolysis breaks down cellulose polymers into brittle fragments when alum-rosin reacts with atmospheric moisture."
        }
      },
      { 
        id: "mylar", 
        name: "Inert Polyester (Mylar) Enclosure", 
        desc: "Chemically stable transparent encapsulation sleeve.", 
        position: [0.45, -0.08, 0.20],
        lesson: "Mylar (polyethylene terephthalate) is chemically inert, non-yellowing, and free of plasticizers, providing rigid physical support without off-gassing.",
        quiz: {
          question: "Why is polyester (Mylar/Melinex) preferred for archival sleeves?",
          options: ["It is chemically inert and contains no plasticizers", "It melts easily under steam", "It absorbs water from paper", "It is opaque to light"],
          correct: 0,
          explanation: "Mylar is stable, chemically inert, and does not off-gas harmful plasticizers that damage documents."
        }
      }
    ],
    practice: [
      { id: "preservation-climate", type: "multiple-choice", question: "What is the recommended ideal temperature for rare book storage vaults?", options: ["60°F (15.5°C)", "80°F (26.6°C)", "40°F (4.4°C)", "75°F (23.8°C)"], correct: "60°F (15.5°C)", explanation: "60°F ± 5°F combined with 50% RH provides optimal chemical stability." }
    ],
    scenarios: [
      { id: "water-spill", title: "Archival Water Pipe Leak", situation: "A water pipe bursts overnight soaking 200 rare 19th-century volumes.", question: "What is the urgent priority action?", options: [{ text: "Pack wet books in plastic crates and send to commercial vacuum freeze-drying within 48h", correct: true, feedback: "Correct! Vacuum freeze-drying sublimates ice out of paper before mold grows at 48h." }, { text: "Place near hot radiators", correct: false, feedback: "Incorrect!" }] }
    ],
    readerText: `[CONSERVATION ENVIRONMENTAL PARAMETERS]:
1. Temperature: Store permanent collection at 60°F ± 5°F (15.5°C).
2. Relative Humidity (RH): Maintain strictly between 45% and 53%. RH above 65% triggers mold bloom.
3. Light Exposure: Max 50 Lux for light-sensitive manuscripts.`,
    shelfBooks: [
      {
        id: "blades-enemies",
        title: "The Enemies of Books",
        author: "William Blades",
        year: "1880",
        callNumber: "025.84 B632e",
        cutter: ".B632",
        spineColor: "#332219",
        accentColor: "#b56c4c",
        category: "Book Preservation",
        description: "The classic 19th-century bibliographic study identifying fire, water, gas, heat, dust, neglect, and bookworms.",
        pages: [
          {
            chapter: "Chapter I: Fire & Water",
            header: "The Chief Devourers of Libraries",
            content: `There are many enemies of books, and the perils through which an ancient volume passes on its way to modern hands are almost miraculous. 

Fire has always claimed the first and most terrible place in bibliographic martyrdom. The great library of Alexandria, the monastic treasures of the Reformation, and the countless cathedral collections destroyed in civil wars bear witness to the destructive fury of flames.

Yet water, though less spectacular, is more insidious. Water causes sizing to dissolve, glue to rot, paper to cockle and stick into solid blocks of pulp, and above all, awakens the spores of destructive mildew and mold which lie dormant waiting for relative humidity to exceed sixty-five per cent.`,
            note: "William Blades was an eminent British printer, collector, and bibliographer."
          },
          {
            chapter: "Chapter V: The Bookworm",
            header: "Larval Predators of Leather and Paper",
            content: `There is a sort of mysterious dread associated with the name of 'The Bookworm.' Many people have heard of it; very few have ever seen one alive.

It is not a worm in the true sense, but the larval stage of several species of small beetles (principally Anobium hirtum and Stegobium paniceum). The female beetle deposits her eggs upon the edges of books or inside the binding glue. When the grub hatches, it eats its way straight through the leaves, drilling neat round holes from cover to cover with geometric precision.

Cleanliness, constant circulation of fresh air, and temperature control are the sovereign safeguards against these silent depredators.`,
            note: "First published by Trübner & Co., London, 1880."
          }
        ]
      },
      {
        id: "clark-care",
        title: "The Care of Books",
        author: "John Willis Clark",
        year: "1901",
        callNumber: "027.009 C593c",
        cutter: ".C593",
        spineColor: "#22382e",
        accentColor: "#61a880",
        category: "Library Architecture & History",
        description: "The definitive architectural essay on the development of library furniture, lecterns, and chained book presses.",
        pages: [
          {
            chapter: "Chapter I: The Monastic Library",
            header: "The Evolution of the Book Press",
            content: `In the earliest medieval monasteries, books were preserved not in large open halls, but in wooden chests and wall recesses called armaria. 

As collections grew from dozens of precious codices to hundreds, the lectern system arose, where books were chained to sloping desks so that monks might study by the natural light of high church windows.

With the invention of printing and the multiplication of paper texts, shelves were raised above the desks, giving birth to the stall-system, and finally to the wall-system where presses line the perimeter of the room from floor to ceiling. The physical container has always adapted to the changing density of the written word.`,
            note: "Clark was Registrary of the University of Cambridge and a Fellow of Trinity College."
          }
        ]
      }
    ],
    clinicalConditions: ["Active Aspergillus mold outbreak isolation", "Iron gall ink burn-through paper lining", "Vacuum freeze-drying salvage"],
    quiz: [
      { question: "What relative humidity (RH) threshold triggers destructive mold growth on paper?", options: ["Relative Humidity above 65%", "Relative Humidity above 30%", "Relative Humidity at 40%", "Relative Humidity at 20%"], answer: 0, explanation: "RH above 65% triggers mold growth." }
    ]
  },
  {
    id: 'reference-services',
    title: "Reference Services & Search Syntax",
    subtitle: "The Reference Interview & Boolean Logic",
    category: "Information Literacy",
    era: "Reference Services",
    accent: "#d49b4b",
    badgeId: "reference-pro",
    badgeName: "Reference Pro 🔍",
    thumbGlyph: "🔍",
    latinName: "Specimen Interrogatio Reference",
    description: "Observable Specimen: A 3D Reference Desk Stage specimen displaying an interactive Boolean Venn Diagram stage, open reference interviews, and database query syntax nodes.",
    specimen: {
      type: "reference-desk-stage",
      name: "The Reference Desk & Search Syntax Specimen",
      scientificName: "Specimen Syntaxeos Informaticae",
      description: "An isolated reference desk stage with glowing Boolean logic diagrams and CRAAP evaluation indicators.",
      layers: ["desk-framework", "boolean-venn", "syntax-nodes", "craap-filter"],
      compareWith: "academic-libraries",
      image: "assets/specimens/reference-desk.jpg"
    },
    keyFacts: [
      { label: "Specimen Type", value: "3D Reference Desk & Search Syntax Specimen", icon: "◇" },
      { label: "Reference Steps", value: "Open query, clarification, search execution, evaluation", icon: "♙" },
      { label: "Boolean Operators", value: "AND (narrows), OR (broadens), NOT (excludes)", icon: "⌁" },
      { label: "Wildcard Symbol", value: "Asterisk (e.g. librar* -> library, librarians)", icon: "⌖" },
      { label: "Evaluation Tool", value: "CRAAP Test (Currency, Relevance, Authority, Accuracy)", icon: "❋" },
      { label: "Controlled Vocab", value: "LCSH, MeSH (Medical Subject Headings)", icon: "◈" }
    ],
    scholarlyNote: "The reference interview transforms a vague patron query into a high-precision search strategy.",
    didYouKnow: "Using the wildcard truncation symbol 'librar*' in a database search simultaneously retrieves library, libraries, librarian, librarianship, and librarians!",
    hotspots: [
      { 
        id: "booleanand", 
        name: "Boolean AND Operator", 
        desc: "Narrows search by requiring both concepts in result set.", 
        position: [-0.22, 0.28, 0.05], 
        lesson: "Boolean AND restricts search results to documents containing ALL specified terms, narrowing recall and boosting precision.", 
        quiz: { question: "What does the Boolean AND operator do in database searches?", options: ["Narrows results by requiring both concepts", "Broadens search", "Excludes terms", "Spells words"], correct: 0, explanation: "AND requires all terms to be present." } 
      },
      { 
        id: "booleanor", 
        name: "Boolean OR Operator", 
        desc: "Broadens search by retrieving records containing either synonym.", 
        position: [0.22, 0.28, 0.05], 
        lesson: "Boolean OR combines synonyms or related concepts (e.g. 'teenagers OR adolescents') to widen recall across diverse terminology.", 
        quiz: { question: "Which Boolean operator is primarily used to connect synonyms?", options: ["OR", "AND", "NOT", "XOR"], correct: 0, explanation: "OR joins synonyms together so any matching term returns the record." } 
      },
      { 
        id: "bankerlamp", 
        name: "Emerald Reference Lamp", 
        desc: "Traditional green cased-glass reading lamp providing focused task lighting.", 
        position: [0.55, 0.05, -0.2], 
        lesson: "Reference desks use directed task lighting to reduce ambient glare while consulting fine-print indexes and catalogs.", 
        quiz: { question: "What is the primary benefit of the reference interview?", options: ["Uncovering the patron's true information need", "Charging reference fees", "Cataloging new books", "Weeding the collection"], correct: 0, explanation: "Patrons rarely state their exact research question first; open dialogue uncovers their actual goal." } 
      }
    ],
    practice: [
      { id: "boolean-operator-or", type: "multiple-choice", question: "Which Boolean operator broadens a search by retrieving records containing EITHER term?", options: ["OR", "AND", "NOT", "NEAR"], correct: "OR", explanation: "OR combines synonyms to broaden recall." }
    ],
    scenarios: [
      { id: "vague-reference", title: "Vague Student Reference Question", situation: "A student asks: 'I need articles on climate change.'", question: "What is your best initial reference interview question?", options: [{ text: "Ask open-ended clarifying questions: 'What specific aspect of climate change are you focusing on?'", correct: true, feedback: "Correct! Open-ended reference questions uncover the true topic." }, { text: "Point to computers without speaking", correct: false, feedback: "Incorrect!" }] }
    ],
    readerText: `[BOOLEAN SEARCH STRATEGY TEMPLATE]:
("Library Science" OR "Bibliotheca") AND (Automation OR Digitization) NOT "Physical Stacks"

[CRAAP TEST FOR SOURCE EVALUATION]:
• Currency: Publication date
• Relevance: Alignment with topic
• Authority: Author credentials
• Accuracy: Verifiable citations
• Purpose: Objective intent vs commercial bias`,
    clinicalConditions: ["Virtual chat reference query misunderstandings", "False drop search results from broad OR terms", "Systematic review search syntax compliance"],
    quiz: [
      { question: "Which Boolean operator is used to NARROW a database search by requiring both concepts to be present?", options: ["AND Operator", "OR Operator", "NOT Operator", "XOR Operator"], answer: 0, explanation: "AND narrows results by requiring all specified terms." }
    ]
  },
  {
    id: 'collection-management',
    title: "Collection Development & Weeding (MUSTIE)",
    subtitle: "Selector Policies, Acquisitions, & MUSTIE Formula",
    category: "Collection Management",
    era: "Management Standard",
    accent: "#785b88",
    badgeId: "collection-manager",
    badgeName: "Collection Manager 📊",
    thumbGlyph: "📊",
    latinName: "Specimen Gestio Collectionis",
    description: "Observable Specimen: A 3D Archival Weeding Cart & MUSTIE Decision Board specimen displaying book condition indicators, circulation turnover heatmaps, and deselection criteria.",
    specimen: {
      type: "weeding-cart",
      name: "The Weeding Cart & MUSTIE Specimen",
      scientificName: "Specimen Deselectionis Collectionis",
      description: "An isolated mobile weeding cart with physical volume condition tags and circulation history dials.",
      layers: ["cart-chassis", "mustie-rubric", "circulation-gauge", "condition-tags"],
      compareWith: "public-libraries",
      image: "assets/specimens/weeding-cart.jpg"
    },
    keyFacts: [
      { label: "Specimen Type", value: "3D Archival Weeding Cart Specimen", icon: "◇" },
      { label: "MUSTIE Formula", value: "Misleading, Ugly, Superseded, Trivial, Irrelevant, Elsewhere", icon: "♙" },
      { label: "Acquisitions", value: "Firm orders, Approval plans & Patron-Driven (PDA)", icon: "⌁" },
      { label: "Resource Sharing", value: "Interlibrary Loan (ILL) & Shared Repositories", icon: "⌖" },
      { label: "Weeding Goal", value: "Removes outdated books to free shelf space", icon: "❋" },
      { label: "Analytics", value: "Turnover rates & Cost-per-circulation", icon: "◈" }
    ],
    scholarlyNote: "Weeding is essential for healthy libraries: removing outdated medical/legal texts prevents dangerous misinformation.",
    didYouKnow: "The MUSTIE acronym guides librarians in identifying books for removal: M = Misleading, U = Ugly, S = Superseded, T = Trivial, I = Irrelevant, E = Elsewhere!",
    hotspots: [
      { 
        id: "mustie", 
        name: "MUSTIE Weeding Formula", 
        desc: "Industry standard rubric for evaluating physical book removal.", 
        position: [-0.3, 0.32, 0.15], 
        lesson: "MUSTIE provides objective criteria for removing outdated books.", 
        quiz: { question: "What does the letter 'U' in MUSTIE stand for?", options: ["Ugly (damaged/worn condition)", "Universal", "Unauthorized", "Underused"], correct: 0, explanation: "U stands for Ugly — books with worn or damaged bindings." } 
      },
      { 
        id: "turnover", 
        name: "Circulation Turnover Gauge", 
        desc: "Metric tracking checkout frequency relative to collection size.", 
        position: [0.35, 0.28, 0.15], 
        lesson: "Turnover rate (Total Circulation / Total Holdings) highlights dormant stack zones that need either curation, marketing, or deselection.", 
        quiz: { question: "How is a collection's turnover rate calculated?", options: ["Circulation count divided by total holdings", "Number of weeded books multiplied by age", "Library card registrations per month", "Overdue fines collected"], correct: 0, explanation: "Turnover rate is the annual circulation divided by the total number of items in that collection." } 
      }
    ],
    practice: [
      { id: "mustie-letter-m", type: "multiple-choice", question: "What does the letter 'M' stand for in the MUSTIE weeding formula?", options: ["Misleading (factually inaccurate or outdated)", "Mandatory", "Microfilm", "Metadata"], correct: "Misleading (factually inaccurate or outdated)", explanation: "M stands for Misleading due to outdated facts." }
    ],
    scenarios: [
      { id: "mustie-weeding-challenge", title: "Patron Weeding Complaint", situation: "A patron sees weeded books in a recycling bin and accuses the library of burning knowledge.", question: "How should the librarian address the patron?", options: [{ text: "Politely explain collection maintenance policies and the MUSTIE formula", correct: true, feedback: "Correct! Educating patrons builds trust." }, { text: "Argue with patron", correct: false, feedback: "Incorrect!" }] }
    ],
    mustiePractice: {
      title: "MUSTIE Weeding Decision Simulator",
      books: [
        { title: "Medical Guide to Smallpox (1912)", circs: "0 checkouts in 15 years", condition: "Yellowed, brittle pulp paper", recommended: "Withdraw", reason: "Factually Misleading (M) and Superseded (S) — outdated medical advice can cause real harm." },
        { title: "County Road Atlas (2004)", circs: "1 checkout in 8 years", condition: "Covers intact, pages clean", recommended: "Withdraw", reason: "Superseded (S) and Irrelevant (I) — navigation data is now current online." },
        { title: "Local History of the Township (1958)", circs: "2 checkouts in 5 years", condition: "Worn spine, otherwise sound", recommended: "Keep", reason: "Low circulation but irreplaceable local-history value — weed by value, not just stats." }
      ]
    },
    readerText: `[MUSTIE WEEDING RUBRIC FOR LIBRARIANS]:
M = Misleading (factually inaccurate or outdated)
U = Ugly (badly worn, stained, or damaged)
S = Superseded (replaced by a superior work)
T = Trivial (no lasting value)
I = Irrelevant (no longer fits community needs)
E = Elsewhere (easily borrowable via ILL)`,
    clinicalConditions: ["Public backlash over weeding misinterpretation", "Outdated medical/legal reference risk mitigation", "Consortial shared print retention agreements"],
    quiz: [
      { question: "What does the letter 'M' stand for in the MUSTIE weeding formula?", options: ["Misleading (factually inaccurate or outdated)", "Mandatory", "Microfilm", "Metadata"], answer: 0, explanation: "M stands for Misleading." }
    ]
  },
  {
    id: 'academic-libraries',
    title: "Academic & Research Libraries",
    subtitle: "Scholarly Communication & Information Literacy",
    category: "Academic Librarianship",
    era: "Higher Education",
    accent: "#3f6f8f",
    badgeId: "research-liaison",
    badgeName: "Research Liaison 🎓",
    thumbGlyph: "🎓",
    latinName: "Specimen Bibliotheca Academica",
    description: "Observable Specimen: A 3D research reading room specimen with a scholar's table, brass banker's lamp, stacked research volumes, and a floating discovery-layer catalog terminal.",
    specimen: {
      type: "academic-reading-room",
      name: "The Research Reading Room Specimen",
      scientificName: "Specimen Studii Academici",
      description: "An isolated reading-room specimen showing scholarly research workflows, discovery-layer search, and special collections access.",
      layers: ["scholar-table", "discovery-layer", "research-stack", "bankers-lamp"],
      compareWith: "public-libraries",
      image: "assets/specimens/academic-reading-room.jpg"
    },
    keyFacts: [
      { label: "Specimen Type", value: "3D Research Reading Room Specimen", icon: "◇" },
      { label: "Largest Academic Library", value: "Harvard Library (~20M volumes)", icon: "♙" },
      { label: "Remote Access", value: "EZproxy & Shibboleth authentication", icon: "⌁" },
      { label: "Resource Sharing", value: "ILLiad interlibrary loan network", icon: "⌖" },
      { label: "Discovery Layer", value: "Primo, Summon & WorldCat Discovery", icon: "❋" },
      { label: "Instruction", value: "ACRL Framework for Information Literacy", icon: "◈" }
    ],
    scholarlyNote: "Academic libraries pair discovery-layer search across licensed databases with a subject-liaison model, embedding librarians directly into departments and courses.",
    didYouKnow: "The Bodleian Library in Oxford (founded 1602) is a legal deposit library entitled to a copy of every book published in the UK!",
    hotspots: [
      {
        id: "discovery-terminal",
        name: "Discovery-Layer Terminal",
        desc: "Single search box federating the catalog, databases, and full-text articles.",
        position: [0.25, 0.42, 0.15],
        lesson: "A discovery layer (Primo, Summon) indexes catalog records and licensed article metadata into one relevance-ranked search — the modern successor to the OPAC.",
        quiz: {
          question: "What does an academic 'discovery layer' primarily provide?",
          options: ["A unified index of catalog and article content", "A climate-controlled vault", "A book-repair bench", "A Boolean-only command line"],
          correct: 0,
          explanation: "Discovery layers federate catalog and licensed content into one relevance-ranked search interface."
        }
      },
      {
        id: "reading-table",
        name: "Special Collections Reading Table",
        desc: "Supervised table for handling rare and archival research materials.",
        position: [-0.35, -0.05, 0.15],
        lesson: "Reading rooms enforce use policies — pencils only, supported cradles, and paging systems — so unique research materials survive repeated scholarly use.",
        quiz: {
          question: "Why do special collections reading rooms typically forbid pens?",
          options: ["Ink cannot be erased and permanently damages materials", "Pens are too expensive", "Pencils write faster", "It is only a tradition"],
          correct: 0,
          explanation: "Ink is permanent and irreversible; graphite can be removed, so pencils protect irreplaceable materials."
        }
      }
    ],
    practice: [
      { id: "academic-ezproxy", type: "multiple-choice", question: "Which tool lets off-campus students authenticate into licensed library databases?", options: ["EZproxy", "MARC", "MUSTIE", "IIIF"], correct: "EZproxy", explanation: "EZproxy rewrites URLs and authenticates remote users against the institution's licensed resources." }
    ],
    scenarios: [
      { id: "predatory-journal", title: "Predatory Journal Inquiry", situation: "A graduate student is invited to publish quickly in a journal that charges a large fee and promises acceptance within 48 hours.", question: "What is the best liaison-librarian guidance?", options: [{ text: "Help them evaluate the journal against DOAJ, Think-Check-Submit, and indexing before submitting", correct: true, feedback: "Correct! Teaching evaluation criteria protects the student's scholarship and funds." }, { text: "Tell them to submit immediately to meet the deadline", correct: false, feedback: "Incorrect — the red flags point to a predatory publisher." }] }
    ],
    readerText: `[ACADEMIC LIBRARY SERVICE MODEL]:
1. Discovery: Federated search across catalog + licensed databases (Primo / Summon).
2. Access: Remote authentication via EZproxy or Shibboleth single sign-on.
3. Resource Sharing: ILLiad-managed interlibrary loan and document delivery.
4. Instruction: ACRL Framework for Information Literacy embedded in courses.
5. Scholarly Communication: Institutional repository (DSpace / EPrints) and open-access support.`,
    shelfBooks: [
      {
        id: "boai-charter",
        title: "The Budapest Open Access Initiative",
        author: "BOAI Working Group",
        year: "2002",
        callNumber: "025.04 B857o",
        cutter: ".B857",
        spineColor: "#1d3247",
        accentColor: "#579ad8",
        category: "Scholarly Communication",
        description: "The founding international declaration that defined open-access literature and self-archiving for digital scholarship.",
        catalogRecord: `LEADER 01080nam a2200289 a 4500
001 boai-2002-001
008 020214s2002    hu       b    000 0 eng  
050 00 $a Z286.O63 $b B83 2002
082 00 $a 025.04 $2 23
110 2# $a Budapest Open Access Initiative.
245 14 $a The Budapest Open Access Initiative charter : $b ten years on.
260 ## $a Budapest : $b Open Society Institute, $c 2002.
650 #0 $a Open access publishing.
650 #0 $a Scholarly communication.`,
        pages: [
          {
            chapter: "The Declaration",
            header: "Ten Years on from Budapest",
            content: `An old tradition and a new technology have converged to make possible an unprecedented public good. The old tradition is the willingness of scientists and scholars to publish the fruits of their research in scholarly journals without payment, for the sake of inquiry and knowledge. The new technology is the internet. The public good they make possible is the world-wide electronic distribution of the peer-reviewed journal literature and completely free and unrestricted access to it by all scientists, scholars, teachers, students, and other curious minds.

Removing access barriers to this literature will accelerate research, enrich education, share the learning of the rich with the poor and the poor with the rich, make this literature as useful as it can be, and lay the foundation for uniting humanity in a common intellectual conversation and quest for knowledge.

By 'open access' to this literature, we mean its free availability on the public internet, permitting any users to read, download, copy, distribute, print, search, or link to the full texts of these articles, crawl them for indexing, pass them as data to software, or use them for any other lawful purpose, without financial, legal, or technical barriers other than those inseparable from gaining access to the internet itself.`,
            note: "Drafted in Budapest on December 1-2, 2001, and published February 14, 2002."
          }
        ]
      },
      {
        id: "newman-university",
        title: "The Idea of a University",
        author: "John Henry Newman",
        year: "1852",
        callNumber: "378.01 N553i",
        cutter: ".N553",
        spineColor: "#3a2a1c",
        accentColor: "#d19a5b",
        category: "Higher Education & Philosophy",
        description: "The classic discourses on liberal education, intellectual culture, and the central role of the academic library.",
        pages: [
          {
            chapter: "Discourse V",
            header: "Knowledge Its Own End",
            content: `Knowledge is capable of being its own end. Such is the constitution of the human mind, that any kind of knowledge, if it be really such, is its own reward. 

And this is true of all knowledge, but especially of that which is liberal, philosophical, and cultivated. A university is a place of concourse, whither students come from every quarter for every kind of knowledge. You cannot have the best of every kind everywhere; you must go to some great city or academy for the best of any thing.

When a multitude of young men, keen, open-hearted, sympathetic, and observant, as young men are, come together and freely mix with each other, they are sure to learn one from another, even if there be no one to teach them; the conversation of all is a series of lectures to each, and they gain for themselves new ideas and views, fresh matter of thought, and distinct principles for judging and acting, day by day.`,
            note: "Cardinal Newman's lectures defined the philosophical ideal of university education."
          }
        ]
      },
      {
        id: "gutenberg-bible",
        title: "Biblia Sacra Latina (42-Line Bible)",
        author: "Johannes Gutenberg",
        year: "1455",
        callNumber: "Incun. 1455 .B52",
        cutter: ".B52",
        spineColor: "#2a150e",
        accentColor: "#d4a745",
        category: "Incunabula & Rare Books",
        description: "The supreme monument of typography: the first major book printed in the West using movable metal type.",
        pages: [
          {
            chapter: "Gospel According to John",
            header: "In Principio Erat Verbum",
            content: `IN PRINCIPIO erat Verbum, et Verbum erat apud Deum, et Deus erat Verbum. Hoc erat in principio apud Deum. 

Omnia per ipsum facta sunt: et sine ipso factum est nihil, quod factum est. In ipso vita erat, et vita erat lux hominum: et lux in tenebris lucet, et tenebrae eam non comprehenderunt.

Fuit homo missus a Deo, cui nomen erat Joannes. Hic venit in testimonium, ut testimonium perhiberet de lumine, ut omnes crederent per illum. Non erat ille lux, sed ut testimonium perhiberet de lumine. Erat lux vera, quae illuminat omnem hominem venientem in hunc mundum.`,
            note: "Printed in Mainz, Germany, c. 1455 in Gothic Textura type, 42 lines per column in two columns."
          }
        ]
      }
    ],
    clinicalConditions: ["Discovery-layer relevance tuning", "License compliance & authorized users", "Course-embedded information literacy assessment"],
    quiz: [
      { question: "Which framework guides information-literacy instruction in academic libraries?", options: ["ACRL Framework for Information Literacy", "The MUSTIE formula", "ISO 2709", "The CRAAP test only"], answer: 0, explanation: "The ACRL Framework for Information Literacy is the profession's standard for higher-education instruction." }
    ]
  },
  {
    id: 'public-libraries',
    title: "Public Libraries & Patron Services",
    subtitle: "Civic Access, Programming, & Digital Equity",
    category: "Public Librarianship",
    era: "Community Service",
    accent: "#b0455f",
    badgeId: "community-steward",
    badgeName: "Community Steward 🏛",
    thumbGlyph: "🏛",
    latinName: "Specimen Bibliotheca Publica",
    description: "Observable Specimen: A 3D community-hub specimen with a circular welcome desk, self-checkout kiosk, storytime rug, and colorful community-collection bins.",
    specimen: {
      type: "public-hub",
      name: "The Community Hub Specimen",
      scientificName: "Specimen Communitatis Liberae",
      description: "An isolated community-service specimen showing circulation, self-service, programming, and digital-equity access points.",
      layers: ["welcome-desk", "self-checkout", "storytime-zone", "community-bins"],
      compareWith: "academic-libraries",
      image: "assets/specimens/public-hub.jpg"
    },
    keyFacts: [
      { label: "Specimen Type", value: "3D Community Hub Specimen", icon: "◇" },
      { label: "Carnegie Legacy", value: "2,509 libraries funded (1883–1929)", icon: "♙" },
      { label: "Digital Lending", value: "Libby/OverDrive, Hoopla, Kanopy", icon: "⌁" },
      { label: "Core Ethic", value: "ALA Library Bill of Rights", icon: "⌖" },
      { label: "Patron Privacy", value: "Circulation records kept confidential", icon: "❋" },
      { label: "Programming", value: "Storytimes, maker spaces, literacy", icon: "◈" }
    ],
    scholarlyNote: "Public libraries are among the last free, non-commercial civic spaces — measuring success by community access and equity rather than by collection size alone.",
    didYouKnow: "Andrew Carnegie funded 2,509 libraries between 1883 and 1929, insisting each community supply the land and ongoing tax support so the library would truly belong to its patrons!",
    hotspots: [
      {
        id: "self-checkout",
        name: "RFID Self-Checkout Kiosk",
        desc: "RFID-based self-service circulation that protects patron privacy.",
        position: [0.42, 0.26, 0.35],
        lesson: "Self-checkout uses RFID tags to let patrons borrow without staff seeing their choices, reinforcing the profession's commitment to reading privacy.",
        quiz: {
          question: "A core reason public libraries value self-checkout is that it supports which principle?",
          options: ["Patron reading privacy", "Higher late fees", "Faster weeding", "MARC tagging"],
          correct: 0,
          explanation: "Self-service circulation keeps a patron's borrowing choices private, a central library ethic."
        }
      },
      {
        id: "storytime-rug",
        name: "Storytime & Early Literacy Zone",
        desc: "Early-literacy programming space for community families.",
        position: [-0.55, -0.42, 0.22],
        lesson: "Early-literacy programs like storytime build the pre-reading skills (print awareness, vocabulary) that shape lifelong learning.",
        quiz: {
          question: "Storytime programs in public libraries primarily build which skills?",
          options: ["Early-literacy and pre-reading skills", "Cataloging skills", "Deacidification skills", "Boolean search skills"],
          correct: 0,
          explanation: "Storytimes develop early-literacy foundations such as vocabulary and print awareness."
        }
      }
    ],
    practice: [
      { id: "public-privacy", type: "multiple-choice", question: "A patron's borrowing history is generally treated by public libraries as:", options: ["Confidential and protected", "Public information", "Sold to advertisers", "Posted on the website"], correct: "Confidential and protected", explanation: "Patron privacy is a core professional ethic; circulation records are kept confidential." }
    ],
    scenarios: [
      { id: "book-challenge", title: "Book Challenge at the Desk", situation: "A patron demands a title be removed from the shelf because they personally find it offensive.", question: "What is the professional response?", options: [{ text: "Explain the reconsideration policy and offer the formal challenge form while keeping the book available", correct: true, feedback: "Correct! Due process and intellectual freedom protect access for the whole community." }, { text: "Immediately pull the book from the shelf", correct: false, feedback: "Incorrect — removing on demand violates intellectual-freedom principles." }] }
    ],
    readerText: `[PUBLIC LIBRARY CORE SERVICES]:
1. Free Access: No-cost borrowing, internet, and workstations for all residents.
2. Digital Equity: E-books and streaming via Libby/OverDrive, Hoopla, and Kanopy.
3. Programming: Storytimes, maker spaces, adult literacy, and job-search help.
4. Intellectual Freedom: ALA Library Bill of Rights and a written reconsideration policy.
5. Privacy: Patron borrowing records are confidential.`,
    shelfBooks: [
      {
        id: "ala-bill-of-rights",
        title: "The Library Bill of Rights",
        author: "American Library Association",
        year: "1939",
        callNumber: "021.8 A512l",
        cutter: ".A512",
        spineColor: "#3d1b28",
        accentColor: "#d96282",
        category: "Intellectual Freedom & Civic Access",
        description: "The historic charter affirming that libraries are forums for information and ideas, opposing all forms of censorship.",
        catalogRecord: `LEADER 01020nam a2200265 a 4500
001 ala-bor-1939
008 390618s1939    ilu      b    000 0 eng  
050 00 $a Z711.4 $b .A48 1939
082 00 $a 021.8 $2 23
110 2# $a American Library Association.
245 14 $a The Library bill of rights / $c adopted by the Council of the American Library Association.
260 ## $a Chicago : $b American Library Association, $c 1939.
650 #0 $a Libraries $x Censorship.
650 #0 $a Intellectual freedom.`,
        pages: [
          {
            chapter: "Preamble & Articles",
            header: "The Six Fundamental Principles",
            content: `The American Library Association affirms that all libraries are forums for information and ideas, and that the following basic policies should guide their services:

I. Books and other library resources should be provided for the interest, information, and enlightenment of all people of the community the library serves. Materials should not be excluded because of the origin, background, or views of those contributing to their creation.

II. Libraries should provide materials and information presenting all points of view on current and historical issues. Materials should not be proscribed or removed because of partisan or doctrinal disapproval.

III. Libraries should challenge censorship in the fulfillment of their responsibility to provide information and enlightenment.

IV. Libraries should cooperate with all persons and groups concerned with resisting abridgment of free expression and free access to ideas.

V. A person's right to use a library should not be denied or abridged because of origin, age, background, or views.

VI. Libraries which make exhibit spaces and meeting rooms available to the public they serve should make such facilities available on an equitable basis, regardless of the beliefs or affiliations of individuals or groups requesting their use.`,
            note: "First adopted on June 18, 1939; amended 1948, 1961, 1980, 1996, and 2019."
          }
        ]
      },
      {
        id: "dana-primer",
        title: "A Library Primer",
        author: "John Cotton Dana",
        year: "1899",
        callNumber: "020.2 D168p",
        cutter: ".D168",
        spineColor: "#1f2a3a",
        accentColor: "#6ba3e8",
        category: "Public Librarianship",
        description: "The founding operational handbook that pioneered open stack browsing and community outreach in public libraries.",
        pages: [
          {
            chapter: "Chapter I: The Public Library",
            header: "Open Stacks and Civic Hospitality",
            content: `The public library should be a center of intellectual life for the whole community. It should not be a monument of stone or a storehouse for rare books kept under lock and key, but an open workshop where every citizen—man, woman, and child—is welcomed with courtesy and assisted without condescension.

Let the shelves be open to the people. The slight loss from occasional theft or misplacement is insignificant compared with the immense educational gain of allowing readers to touch, browse, and compare books freely before making their selection.

A library's success is measured not by the number of volumes locked in its cases, but by the number of books in active hands throughout the homes of the city.`,
            note: "John Cotton Dana was the revolutionary director of the Denver, Springfield, and Newark Public Libraries."
          }
        ]
      }
    ],
    clinicalConditions: ["Book challenges & reconsideration process", "Digital-divide outreach & hotspot lending", "Patron privacy vs. law-enforcement requests"],
    quiz: [
      { question: "Which document articulates the public library's commitment to free access to ideas?", options: ["The ALA Library Bill of Rights", "ISO 2709", "The MUSTIE formula", "The Cutter-Sanborn table"], answer: 0, explanation: "The ALA Library Bill of Rights sets out the profession's intellectual-freedom principles." }
    ]
  },
  {
    id: 'digital-repositories',
    title: "Digital Repositories & Open Access",
    subtitle: "Persistent Identifiers, Interoperability, & OA",
    category: "Digital Stewardship",
    era: "Open Scholarship",
    accent: "#2f8f7f",
    badgeId: "open-access-curator",
    badgeName: "Open Access Curator 🌐",
    thumbGlyph: "🌐",
    latinName: "Specimen Repositorium Digitale",
    description: "Observable Specimen: A 3D repository server-rack specimen with glowing metadata feed blades and an orbiting open-access data ring representing IIIF and OAI-PMH harvesting.",
    specimen: {
      type: "digital-repository",
      name: "The Digital Repository Specimen",
      scientificName: "Specimen Interoperabilitatis Digitalis",
      description: "An isolated repository specimen showing persistent identifiers, metadata harvesting, and open-access dissemination.",
      layers: ["server-rack", "blade-feeds", "oa-ring", "metadata-nodes"],
      compareWith: "marc-metadata",
      image: "assets/specimens/digital-repository.jpg"
    },
    keyFacts: [
      { label: "Specimen Type", value: "3D Repository Server-Rack Specimen", icon: "◇" },
      { label: "Persistent IDs", value: "DOI (DataCite/Crossref) & Handle", icon: "♙" },
      { label: "Interoperability", value: "OAI-PMH metadata harvesting", icon: "⌁" },
      { label: "Image Framework", value: "IIIF deep-zoom manuscript viewing", icon: "⌖" },
      { label: "Platforms", value: "DSpace, Fedora, Samvera, Islandora", icon: "❋" },
      { label: "OA Routes", value: "Green (self-archive) & Gold (published OA)", icon: "◈" }
    ],
    scholarlyNote: "Repositories separate the bitstream from its persistent identifier: even if a file moves servers, the DOI or Handle continues to resolve to the current location.",
    didYouKnow: "The Budapest Open Access Initiative of 2002 was the first statement to formally define 'open access' to scholarly literature — free to read, reuse, and redistribute!",
    hotspots: [
      {
        id: "metadata-feed",
        name: "OAI-PMH Metadata Feed",
        desc: "Exposes Dublin Core records for harvesting by aggregators.",
        position: [0, 0.32, 0.35],
        lesson: "OAI-PMH lets aggregators (like BASE or CORE) harvest a repository's Dublin Core metadata on a schedule, making local research globally discoverable.",
        quiz: {
          question: "What is OAI-PMH used for in a digital repository?",
          options: ["Harvesting metadata for aggregation", "Cooling the servers", "Printing spine labels", "Weeding physical books"],
          correct: 0,
          explanation: "OAI-PMH is a protocol for harvesting repository metadata so it can be aggregated and discovered elsewhere."
        }
      },
      {
        id: "oa-ring",
        name: "Open Access Data Ring (IIIF)",
        desc: "Persistent-identifier network keeping content citable and resolvable.",
        position: [0.65, 0.12, 0.05],
        lesson: "A DOI is a persistent identifier managed through registries like DataCite; it resolves to the object's current URL even after the file is moved.",
        quiz: {
          question: "Why is a DOI more reliable than a plain URL for citing scholarship?",
          options: ["It persistently resolves even if the file moves", "It is shorter to type", "It compresses the file", "It hides the author"],
          correct: 0,
          explanation: "A DOI is a persistent identifier that continues to resolve to the current location of the object."
        }
      }
    ],
    practice: [
      { id: "repo-doi", type: "multiple-choice", question: "Which of these is a persistent identifier for scholarly objects?", options: ["DOI", "RFID", "MUSTIE", "Lux"], correct: "DOI", explanation: "A DOI (Digital Object Identifier) persistently identifies and resolves to a scholarly object." }
    ],
    scenarios: [
      { id: "green-oa-deposit", title: "Author Manuscript Deposit", situation: "A faculty author wants their published article freely available but the publisher holds the final-version copyright.", question: "What repository route should the librarian recommend?", options: [{ text: "Deposit the accepted author manuscript under the green open-access route, respecting any embargo", correct: true, feedback: "Correct! Green OA self-archiving makes the accepted manuscript available within policy." }, { text: "Upload the publisher's final PDF regardless of copyright", correct: false, feedback: "Incorrect — that would violate the publisher's copyright." }] }
    ],
    readerText: `[DIGITAL REPOSITORY STACK]:
1. Ingest: Deposit bitstreams with descriptive Dublin Core metadata.
2. Identify: Mint a persistent identifier (DOI via DataCite, or Handle).
3. Expose: Publish metadata for OAI-PMH harvesting; serve images via IIIF.
4. Preserve: Checksums, fixity checks, and format migration over time.
5. Disseminate: Green (self-archived) and Gold (published) open-access routes.`,
    clinicalConditions: ["Embargo and copyright-clearance workflows", "Fixity/checksum integrity monitoring", "IIIF manifest generation for digitized manuscripts"],
    quiz: [
      { question: "Which protocol allows aggregators to harvest repository metadata?", options: ["OAI-PMH", "HTTP 404", "MARC-8", "RS-232"], answer: 0, explanation: "OAI-PMH (Open Archives Initiative Protocol for Metadata Harvesting) exposes metadata for aggregation." }
    ]
  },
  {
    id: 'special-collections',
    title: "Special Collections & Rare Books",
    subtitle: "Rare materials, reading rooms, and controlled access",
    category: "Special Collections",
    era: "Archival Practice",
    accent: "#8b5a2b",
    badgeId: "rare-book-curator",
    badgeName: "Rare Book Curator 📜",
    thumbGlyph: "📜",
    latinName: "Specimen Collectionis Rarae",
    description: "Observable Specimen: A rare book on a foam cradle with white cotton gloves and a protective manuscript leaf — modelling how special collections balance access with permanent preservation.",
    specimen: {
      type: "rare-book-cradle",
      name: "The Rare Book Cradle Specimen",
      scientificName: "Specimen Libri Rari",
      description: "An isolated reading-room cradle with gloves, book supports, and a supervised access workflow.",
      layers: ["foam-cradle", "rare-binding", "cotton-gloves", "manuscript-leaf"],
      compareWith: "preservation-science",
      image: "assets/specimens/rare-book-cradle.jpg"
    },
    keyFacts: [
      { label: "Specimen Type", value: "Reading-room cradle & support system", icon: "◇" },
      { label: "Access model", value: "Supervised, non-circulating, appointment-based", icon: "♙" },
      { label: "Handling rule", value: "Clean hands or cotton/nitrile gloves as policy requires", icon: "⌁" },
      { label: "Supports", value: "Foam wedges, snakes, and book cradles", icon: "⌖" },
      { label: "Security", value: "Registration, lockers, no bags in the room", icon: "❋" },
      { label: "Core tension", value: "Access vs. permanent preservation", icon: "◈" }
    ],
    scholarlyNote: "Special collections exist so unique materials can be used without being destroyed by use — every policy is a compromise between those two duties.",
    didYouKnow: "Many reading rooms ban pens (ink is permanent) and allow only pencils — a simple rule that has saved countless manuscripts from accidental marks.",
    hotspots: [
      {
        id: "cradle",
        name: "Conservation Book Cradle",
        desc: "Foam supports that hold the book open at a safe 110° angle without stressing the spine.",
        position: [0, 0.08, 0.22],
        lesson: "Cradles and wedges open a volume only as far as the binding safely allows. Forcing an early leather spine flat is a primary cause of irreversible hinge splitting.",
        quiz: {
          question: "Why do reading rooms use book cradles?",
          options: [
            "To hold the book open without stressing the spine",
            "To hide the call number",
            "To speed up scanning",
            "To warm the paper"
          ],
          correct: 0,
          explanation: "Cradles support the boards and textblock so the spine is not forced open beyond its safe range."
        }
      },
      {
        id: "gloves",
        name: "Archival Handling Gloves",
        desc: "Cotton or nitrile gloves for sensitive bindings, photographic prints, or metal clasps.",
        position: [-0.62, -0.32, 0.18],
        lesson: "Glove policy varies: clean dry hands are often preferred for paper (better tactile sensitivity, less page snagging). Gloves are standard for photos, metal clasps, and soiled bindings.",
        quiz: {
          question: "When are gloves most often preferred over bare clean hands in modern archives?",
          options: [
            "Photographs, metal fittings, or soiled bindings",
            "Every paperback novel",
            "Only for digital files",
            "Never in modern practice"
          ],
          correct: 0,
          explanation: "Clean dry hands are standard for paper folios; gloves protect against skin oils on photographs and metal clasps."
        }
      },
      {
        id: "ms-leaf",
        name: "Rubricated Manuscript Leaf",
        desc: "An archival vellum leaf under a soft lead weight, used only in the reading room.",
        position: [0.60, -0.32, 0.05],
        lesson: "Loose leaves and unbound materials stay under padded weights and never leave the supervised table. Photography and handling rules are strictly non-invasive.",
        quiz: {
          question: "Where may unique manuscript leaves normally be used?",
          options: [
            "Only in the supervised reading room",
            "Checked out overnight",
            "In the café with a deposit",
            "On open stacks for browsing"
          ],
          correct: 0,
          explanation: "Unique and unbound materials remain non-circulating under staff supervision."
        }
      }
    ],
    practice: [
      {
        id: "sc-access-rule",
        type: "multiple-choice",
        question: "A researcher wants to take a rare atlas to the café. What is the correct policy response?",
        options: [
          "Explain that rare materials are non-circulating and must stay in the reading room",
          "Allow it if they leave a student ID",
          "Mail it to their office overnight",
          "Put it on open reserve for the semester"
        ],
        correct: "Explain that rare materials are non-circulating and must stay in the reading room",
        explanation: "Special collections items do not circulate; use is supervised in a controlled reading room."
      },
      {
        id: "sc-pencil-rule",
        type: "multiple-choice",
        question: "Why do most rare-book reading rooms allow only pencils for notes?",
        options: [
          "Ink marks are permanent and can ruin unique materials",
          "Pencils are cheaper for the library to supply",
          "Pens are banned by copyright law",
          "Pencils improve reading speed"
        ],
        correct: "Ink marks are permanent and can ruin unique materials",
        explanation: "A pen slip can permanently mark an irreplaceable object; pencil marks can often be erased if they transfer."
      }
    ],
    scenarios: [
      {
        id: "ink-pen-rule",
        title: "Pen at the Reading Table",
        situation: "A visiting scholar unpacks a fountain pen to take notes beside a medieval codex.",
        question: "What should staff do first?",
        options: [
          {
            text: "Politely stop them, explain the pencil-only rule, and offer a pencil",
            correct: true,
            feedback: "Correct — ink is irreversible; enforce calmly and offer an alternative."
          },
          {
            text: "Ignore it to avoid embarrassing a guest",
            correct: false,
            feedback: "One slip can permanently mark a unique object. Policy exists for this moment."
          }
        ]
      }
    ],
    readerText: `[SPECIAL COLLECTIONS READING-ROOM RULES]:
1. Register and show ID; store bags and coats in lockers.
2. Materials are non-circulating — use only in the supervised room.
3. Pencils only (no pens, markers, or sticky notes on pages).
4. Support bindings with cradles/wedges; never force a spine flat.
5. Photography rules vary — ask before flash or commercial use.
6. Report any existing damage before you begin; do not attempt repairs.`,
    shelfBooks: [
      {
        id: "gutenberg-1455-master",
        title: "Biblia Latina: 42-Line Gutenberg Bible",
        author: "Johannes Gutenberg",
        year: "c. 1455",
        callNumber: "093 .B582",
        cutter: ".B582",
        spineColor: "#2a1810",
        accentColor: "#d4a45a",
        bindingType: "classical-leather",
        ribbonColor: "#8b2635",
        giltEdges: "gold",
        hasBrassCorners: true,
        hasClasp: true,
        hasRaisedRibs: true,
        category: "Incunabula & Early Printing",
        description: "Special Collections Specimen: 15th-century Mainz masterpiece printed with movable metal type, blind-stamped pigskin over bevelled wooden boards with chased brass bosses, corner pieces, and clasps.",
        pages: [
          {
            chapter: "Incipit Liber Genesis",
            header: "Capitulum Primum",
            content: `In principio creavit Deus caelum et terram. Terra autem erat inanis et vacua, et tenebrae erant super faciem abyssi, et spiritus Dei ferebatur super aquas.

Dixitque Deus: Fiat lux. Et facta est lux. Et vidit Deus lucem quod esset bona, et divisit lucem ac tenebras. Appellavitque lucem Diem, et tenebras Noctem; factumque est vespere et mane, dies unus.

Dixit quoque Deus: Fiat firmamentum in medio aquarum, et dividat aquas ab aquis. Et fecit Deus firmamentum, divisitque aquas quae erant sub firmamento ab his quae erant super firmamentum. Et factum est ita.`,
            note: "Printed in Mainz, Germany, c. 1455 in Gothic Textura type, 42 lines per column in two columns on handmade linen rag paper with rubricated initials."
          },
          {
            chapter: "Genesis — English Translation",
            header: "The Creation of the World",
            content: `In the beginning God created the heaven and the earth. And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.

And God said, Let there be light: and there was light. And God saw the light, that it was good: and God divided the light from the darkness. And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.

And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters. And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.`
          }
        ]
      },
      {
        id: "codex-aureus",
        title: "Codex Aureus & Illuminated Hours",
        author: "Master Illuminator of Ghent",
        year: "c. 1485",
        callNumber: "091 .C669",
        cutter: ".C669",
        spineColor: "#451a14",
        accentColor: "#d4a45a",
        bindingType: "classical-leather",
        ribbonColor: "#d4a45a",
        giltEdges: "gold",
        category: "Illuminated Manuscripts",
        description: "Late 15th-century Flemish book of hours on uterine vellum with gold leaf initials and crushed lapis lazuli pigments.",
        pages: [
          {
            chapter: "Incipit",
            header: "Horae Beatae Mariae Virginis",
            content: `Domine, labia mea aperies. Et os meum annuntiabit laudem tuam. Deus, in adiutorium meum intende. Domine, ad adiuvandum me festina. Gloria Patri, et Filio, et Spiritui Sancto.`
          }
        ]
      }
    ],
    clinicalConditions: [
      "Brittle paper and red-rot leather",
      "Theft and mutilation risk in unsupervised spaces",
      "Conflicting access vs. exhibition light budgets"
    ],
    quiz: [
      {
        question: "Why are special collections usually non-circulating?",
        options: [
          "They are unique or rare and must be used under supervision",
          "They are always digitized already",
          "Patrons prefer e-books",
          "Cataloguing is incomplete"
        ],
        answer: 0,
        explanation: "Rarity and irreplaceability require supervised, non-circulating access."
      }
    ]
  }
];

// ============================================================
// FEATURE-PAGE CONTENT — editorial deep-reading layer.
// Merged onto LIBRARY_DATA by id so module definitions stay lean.
// ============================================================
const FEATURE_PAGE_CONTENT = {
  'classification-systems': {
    features: [
      { icon: '🗺️', title: 'Relative Location Map', description: 'See how books move by subject, not by fixed shelf — the idea that let libraries grow without renumbering every volume.',
        detail: 'Before Dewey, a book lived at a permanent shelf address (e.g. "Room 3, Shelf 5, Book 12"). Adding a book meant shifting everything after it. Relative location numbers the *subject*, so a new title simply slots between its neighbours.' },
      { icon: '🔢', title: 'Decimal Expansion Explorer', description: 'Watch 500 → 510 → 512 → 512.7 narrow from "Science" to "Algebra" one digit at a time.',
        detail: '500 Natural sciences · 510 Mathematics · 512 Algebra · 512.7 Number theory. Every decimal place is a finer subdivision, so the notation itself encodes the subject hierarchy.' },
      { icon: '⚖️', title: 'DDC vs. LCC Side-by-Side', description: 'Ten pure-decimal classes for public libraries, twenty-one lettered classes for research collections — and why each fits its home.',
        detail: 'DDC is compact and mnemonic, ideal for browsing public collections. LCC (A–Z) expands almost infinitely, which is why large academic and national libraries prefer it for millions of specialised titles.' },
      { icon: '🏷', title: 'Call Number Anatomy', description: 'Class number, Cutter, work mark, year — every glyph on the spine label decoded.', interactive: true, action: 'sandbox' },
      { icon: '🌲', title: 'Subject Hierarchy Tree', description: 'Follow a single title from its broad discipline down to its most specific facet.',
        detail: 'Classification is a tree: each work occupies exactly one leaf, but that leaf inherits meaning from every branch above it. This is what makes shelf-browsing serendipitous.' },
      { icon: '📚', title: 'Shelving Logic Simulator', description: 'Order spine labels the way a shelver reads them: line by line, left to right, decimal by decimal.',
        detail: 'Shelvers read top line as a whole number, then the decimal as a *decimal* (so .8 precedes .81), then the Cutter alphabetically. .59 shelves before .6 — a classic trip-up.' },
    ],
    deepSections: [
      { id: 'scholarly', title: 'The Idea Behind Classification', content: `A classification scheme is not a filing cabinet — it is an argument about how knowledge fits together. When Melvil Dewey published his scheme in 1876, his radical move was *relative* location: a book's number describes its subject, and its physical place is simply wherever that subject currently sits on the shelves.\n\nThis decoupling of subject from shelf is the quiet engine of the modern library. It lets a collection grow from a thousand to a million volumes without ever renumbering a single existing book.` },
      { id: 'principles', title: 'Principles That Never Change', content: `- Hierarchy: broad classes divide into narrower ones, and notation mirrors that descent.\n- Mutually exclusive classes: every work has exactly one primary home.\n- Hospitality: the scheme must leave room to insert subjects not yet invented.\n- Mnemonics: recurring patterns (e.g. -09 for history) reward the trained eye.` },
      { id: 'application', title: 'In the Working Library', content: `A cataloguer assigns the class number by asking "what is this book *about*?", not "what shape is it?". A cookbook of French pastry is 641.86 (desserts) — never 944 (history of France) merely because it is French.\n\nThe payoff is browsability: a reader who finds one good book on a shelf is standing in front of a curated neighbourhood of related works.` },
    ],
  },

  'marc-metadata': {
    features: [
      { icon: '🏷', title: 'Field Tag Visualizer', description: 'The three-digit tags — 100 author, 245 title, 260 publication, 650 subject — that every catalogue record speaks in.',
        detail: '1XX = main entry, 2XX = title & edition, 3XX = physical description, 5XX = notes, 6XX = subjects, 7XX = added entries, 8XX = series. The leading digit tells you the field family at a glance.' },
      { icon: '➕', title: 'Subfield Builder', description: 'Assemble a 245 field from its $a title, $b subtitle, and $c statement of responsibility.', interactive: true, action: 'marc' },
      { icon: '🔀', title: 'Indicator Guide', description: 'Those two little digits after each tag are not decoration — they change how a record is filed and displayed.',
        detail: 'In 245, the second indicator counts characters to skip when alphabetising: "The Great Gatsby" uses indicator 4 so it files under G, not T.' },
      { icon: '📄', title: 'Dublin Core Comparison', description: 'Fifteen plain elements for the open web vs. hundreds of MARC fields for the professional catalogue.',
        detail: 'Dublin Core (title, creator, subject, date…) is deliberately simple for interoperability. MARC is granular for precision. Modern systems often crosswalk between them.' },
      { icon: '🌐', title: 'WorldCat Record Anatomy', description: 'One master record, shared by thousands of libraries — how cooperative cataloguing scales.',
        detail: 'OCLC WorldCat lets one library create a record that all others can attach their holdings to, saving enormous duplicated effort — the network effect applied to metadata.' },
      { icon: '⚠️', title: 'Common Cataloguing Errors', description: 'Wrong indicator, missing $c, punctuation drift — the small mistakes that break discovery.',
        detail: 'A misplaced ISBD period or an absent subfield code can make a record un-findable in a keyword search, even though the data is "there". Standards exist for exactly this reason.' },
    ],
    deepSections: [
      { id: 'scholarly', title: 'Why Machines Need MARC', content: `MARC — MAchine-Readable Cataloging — was born at the Library of Congress in the 1960s to let computers exchange catalogue records. Its genius is that it turns a card-catalogue entry into structured data: every piece of information lives in a labelled field, so software can sort, search, and share it.\n\nSixty years on, MARC still underpins nearly every library catalogue on Earth. Newer models (BIBFRAME, linked data) aim to succeed it, but they must first speak its language fluently.` },
      { id: 'principles', title: 'Anatomy of a Record', content: `- Leader & directory: fixed-length housekeeping the system reads first.\n- Control fields (00X): record number, dates, coded data.\n- Data fields (01X–8XX): the human-meaningful content, each with tag, indicators, and subfields.\n- Subfield codes ($a, $b, $c …): the smallest labelled unit of meaning.` },
      { id: 'application', title: 'From Record to Discovery', content: `When a patron types a title into the catalogue, the search engine is reading MARC subfields. Good tagging means the book surfaces; sloppy tagging means it hides.\n\nThis is why cataloguing is quietly one of the most consequential jobs in the library: a book that cannot be found may as well not have been bought.` },
    ],
  },

  'preservation-science': {
    features: [
      { icon: '🌡️', title: 'Climate Parameter Controls', description: 'The narrow temperature and humidity band that keeps paper, leather, and film from self-destructing.',
        detail: 'The conservation ideal is roughly 18–20 °C and 30–50 % relative humidity, held *stable*. Swings are more damaging than a steady non-ideal value, because materials expand and contract.' },
      { icon: '🧪', title: 'Acid Migration Visualizer', description: 'Watch acidity creep from a cheap endpaper into the good paper beside it.',
        detail: 'Acids migrate by contact. A single acidic newspaper clipping tucked into a book will brown the pages it touches — which is why archivists interleave with acid-free tissue.' },
      { icon: '🚨', title: 'Disaster Response Decision Tree', description: 'Water, fire, mould — the first-hour choices that decide whether a collection survives.', interactive: true, action: 'quiz' },
      { icon: '⏳', title: 'Material Degradation Timeline', description: 'Rag paper lasts centuries; acidic wood-pulp paper embrittles in decades. Same shelf, different fates.',
        detail: 'Pre-1850 rag paper is often supple today. Late-19th-century wood-pulp paper — the "slow fire" of libraries — can crumble at a touch. Format, not age alone, predicts survival.' },
      { icon: '🏛️', title: 'Vault Design Principles', description: 'Light, air, and gravity all threaten a collection — good storage answers each.',
        detail: 'No windows (UV fades), filtered air (pollutants acidify), and shelving that keeps volumes upright and uncrowded (spines warp under lean). The vault is preventive medicine.' },
      { icon: '💧', title: 'Deacidification Methods', description: 'How conservators neutralise acid without unbinding the book.',
        detail: 'Mass deacidification sprays or bathes items in an alkaline buffer that neutralises existing acid and leaves a reserve against future acid — buying centuries of extra life.' },
    ],
    deepSections: [
      { id: 'scholarly', title: 'Preservation as Prevention', content: `Conservation repairs the individual object; preservation protects the whole collection from ever needing repair. The modern field leans hard toward prevention, because you cannot hand-mend a million books.\n\nThe controlling insight is that decay is chemistry, and chemistry obeys temperature and moisture. Control the environment and you slow every reaction at once — the cheapest, most powerful intervention a library can make.` },
      { id: 'principles', title: 'The Agents of Deterioration', content: `- Incorrect temperature and humidity — the master variables.\n- Light, especially UV — fades pigment, weakens fibre.\n- Pollutants and acids — internal and airborne.\n- Pests, mould, water, and physical force — the acute disasters.` },
      { id: 'application', title: 'Triage in a Flood', content: `When water strikes, the clock is the enemy: mould can bloom within 48 hours. Archivists freeze wet material to stop the clock, then thaw and dry in controlled batches.\n\nEvery collection should have a written disaster plan naming who to call, what to save first, and where the freezer space is — decided long before the pipe bursts.` },
    ],
  },

  'reference-services': {
    features: [
      { icon: '💬', title: 'The Reference Interview', description: 'The gentle questioning that turns "do you have books on dogs?" into the answer the patron actually needs.',
        detail: 'Patrons rarely state their real question first. Open questions ("Tell me more about your project") surface the true information need — a training-a-puppy book, not a canine anatomy text.' },
      { icon: '🎯', title: 'Search Strategy Builder', description: 'Boolean AND/OR/NOT, truncation, and controlled vocabulary — the levers of a precise search.',
        detail: 'AND narrows, OR widens, NOT excludes. Truncation (educat*) catches educate/education/educational. Subject headings find records that keywords miss.' },
      { icon: '📏', title: 'Source Evaluation (CRAAP)', description: 'Currency, Relevance, Authority, Accuracy, Purpose — the five questions that separate a source from a rumour.',
        detail: 'The CRAAP test gives patrons a repeatable checklist. Its real value is teaching the habit of interrogation, not memorising the acronym.' },
      { icon: '🤝', title: 'Ethics of Neutrality', description: 'A reference librarian answers the question without judging the asker — and guards their privacy while doing it.', interactive: true, action: 'quiz' },
      { icon: '🧭', title: 'Ready Reference vs. Research', description: 'A fact in thirty seconds, or a research consultation over an hour — knowing which the moment calls for.',
        detail: 'Ready reference: quick, factual ("What is the capital of Peru?"). Research consultation: sustained, strategic (a thesis literature review). Misjudging the mode frustrates everyone.' },
      { icon: '🔒', title: 'Patron Confidentiality', description: 'What a patron asks — and reads — is nobody else’s business. Full stop.',
        detail: 'Library ethics treat the record of a person’s reading and questions as confidential. This protection is why libraries resist casual disclosure of borrowing records.' },
    ],
    deepSections: [
      { id: 'scholarly', title: 'The Art of the Question', content: `Reference work looks like answering questions. It is really about *finding* them. Studies of the reference encounter consistently show that the question a patron first asks is seldom the one they need answered — they translate their real need into what they imagine the library holds.\n\nThe reference interview is the craft of translating back: patient, open-ended, and never condescending. Done well, it is nearly invisible.` },
      { id: 'principles', title: 'Principles of Good Service', content: `- Approachability: the patron must feel welcome to ask.\n- Active listening: hear the need beneath the words.\n- Neutrality: serve the question, not your opinion of it.\n- Instruction: where possible, teach the search so the patron can fish next time.\n- Follow-up: "Did that answer your question?" closes the loop.` },
      { id: 'application', title: 'When the Question Is Hard', content: `The stakes rise with medical, legal, and financial questions, where a librarian must supply *information* without giving *advice*. The professional move is to point to authoritative sources and let the patron and their doctor or lawyer decide.\n\nThroughout, confidentiality is sacred: a patron’s question is held in confidence, because trust is the reference desk’s only real inventory.` },
    ],
  },

  'collection-management': {
    features: [
      { icon: '🗂️', title: 'The MUSTIE Test', description: 'Misleading, Ugly, Superseded, Trivial, Irrelevant, Elsewhere — the six-letter conscience of weeding.', interactive: true, action: 'mustie' },
      { icon: '📈', title: 'Circulation Analysis', description: 'A book untouched for years is not a treasure — it may be a barrier to the book behind it.',
        detail: 'Circulation data tells you what the community actually uses. Low turnover flags candidates for weeding, storage, or promotion — data informing, not replacing, professional judgement.' },
      { icon: '⚖️', title: 'Selection & Deselection', description: 'Building a collection and pruning one are the same skill pointed in opposite directions.',
        detail: 'Both answer "does this serve our community?" Adding fills a need; weeding removes what no longer does. A collection that only grows eventually serves no one well.' },
      { icon: '📜', title: 'Collection Development Policy', description: 'The written charter that lets a librarian say "yes" and "no" for reasons, not whims.',
        detail: 'A CD policy states scope, audience, and criteria in advance. When a challenge or a hard purchase arrives, the policy — not the moment’s pressure — governs the decision.' },
      { icon: '🛡️', title: 'Intellectual Freedom', description: 'A challenged book gets due process, not a quiet disappearance from the shelf.',
        detail: 'Weeding removes worn or unused books; censorship removes ideas. The distinction matters: challenges follow a written reconsideration procedure, never a librarian’s private veto.' },
      { icon: '💰', title: 'Budget & Balance', description: 'Every acquisition is a choice not to buy something else — stewardship of a finite shelf and purse.',
        detail: 'Collection management is resource allocation under constraint: format, subject balance, replacement, and renewal all compete for one budget. The art is proportion.' },
    ],
    deepSections: [
      { id: 'scholarly', title: 'The Collection as a Living Thing', content: `A library collection is not an archive of everything ever bought — it is a curated, breathing response to a community’s needs. It grows by selection and stays healthy by deselection. Both are acts of care.\n\nThe hardest professional truth is that weeding is *good* librarianship. An overstuffed, dated collection hides its own best books. Removing the tired makes room — physical and attentional — for the vital.` },
      { id: 'principles', title: 'The MUSTIE Framework', content: `- Misleading — factually outdated or inaccurate.\n- Ugly — worn beyond repair or appeal.\n- Superseded — a newer edition or better title exists.\n- Trivial — of no discernible literary or informational value.\n- Irrelevant — no longer matches community needs.\n- Elsewhere — readily available from another source.` },
      { id: 'application', title: 'Weeding Without Censoring', content: `The line every collection manager walks: weeding is about *condition and use*; censorship is about *ideas*. A book pulled because it is mouldy and never borrowed is stewardship. A book pulled because someone objects to its viewpoint is not.\n\nThat is why challenges follow a formal reconsideration process, and why a collection development policy is written before anyone is angry.` },
    ],
  },

  'academic-libraries': {
    features: [
      { icon: '🔎', title: 'Discovery Layer', description: 'One search box over dozens of databases — the single front door to millions of scholarly items.',
        detail: 'A discovery service indexes the library’s catalogues, journal packages, and repositories together, so a student searches once instead of hunting database by database.' },
      { icon: '📰', title: 'Scholarly Communication', description: 'Peer review, impact metrics, and the economics of who pays to read research.',
        detail: 'Academic libraries increasingly negotiate — and question — the subscription model, funding open access so that publicly funded research is publicly readable.' },
      { icon: '🎓', title: 'Information Literacy Instruction', description: 'Teaching students to find, judge, and cite — the library’s classroom role.', interactive: true, action: 'quiz' },
      { icon: '🔗', title: 'Interlibrary Loan', description: 'No single library owns everything; a resource-sharing network means every library owns access to almost everything.',
        detail: 'Through ILL, a student at a small college can read an article held only in a national library thousands of miles away — usually within days.' },
      { icon: '🧾', title: 'Citation Management', description: 'From a chaos of PDFs to a formatted bibliography — the tools that tame scholarly writing.',
        detail: 'Reference managers store sources, insert in-text citations, and reformat an entire bibliography between styles at a click — a skill librarians routinely teach.' },
      { icon: '🏫', title: 'The Learning Commons', description: 'The reading room reborn as a collaborative, technology-rich study environment.',
        detail: 'Modern academic space blends quiet study, group rooms, media production, and research help — the library as active workshop, not silent warehouse.' },
    ],
    deepSections: [
      { id: 'scholarly', title: 'The Library as Scholarly Infrastructure', content: `An academic library is the circulatory system of a university’s research. It licenses the journals, preserves the theses, teaches the searching, and increasingly funds the open publication of the institution’s own scholarship.\n\nIts defining tension is economic: the price of scholarly journals has risen faster than any budget, pushing libraries to champion open access as both a principle and a survival strategy.` },
      { id: 'principles', title: 'What Sets It Apart', content: `- Depth over breadth: specialised, research-grade collections.\n- Instruction as mission: information literacy is coursework, not a favour.\n- Scholarly communication: the library shapes how research is published and read.\n- Consortial power: libraries negotiate and share as blocs.` },
      { id: 'application', title: 'Teaching the Researcher', content: `The signature academic-library encounter is instructional: a librarian shows a class how to build a literature search, evaluate peer-reviewed sources, and cite them cleanly.\n\nThe goal is transfer — a graduating student who can navigate information independently for the rest of their professional life.` },
    ],
  },

  'public-libraries': {
    features: [
      { icon: '🚪', title: 'The Third Place', description: 'Not home, not work — the free, unjudging civic room open to everyone.',
        detail: 'Sociologist Ray Oldenburg’s "third place" names spaces of community life outside home and work. The public library is one of the last that asks nothing of you to enter.' },
      { icon: '📖', title: 'Early Literacy & Storytime', description: 'The rhymes and picture books that quietly build the reading brain before school begins.',
        detail: 'Storytime is not babysitting — it is evidence-based early-literacy practice, seeding vocabulary and print awareness during the years that most shape lifelong reading.' },
      { icon: '🌍', title: 'The Digital Divide', description: 'For many, the library’s wifi and computers are their only reliable door to the online world.',
        detail: 'Public-access computing and connectivity make the library essential infrastructure for job applications, benefits, and homework in households without broadband.' },
      { icon: '🤲', title: 'Community Programming', description: 'Job help, citizenship classes, seed swaps, warming centres — service far beyond books.',
        detail: 'Public libraries meet the needs their communities bring: tax help in spring, cooling in a heatwave, language classes year-round. The collection is only one service among many.' },
      { icon: '🗽', title: 'Freedom to Read', description: 'Open access to ideas — and a fair process when someone wants a book removed.', interactive: true, action: 'quiz' },
      { icon: '💳', title: 'Access Without Barriers', description: 'A free card, no purchase required — the radical ordinariness of universal access.',
        detail: 'The public library is one of the few institutions offering substantial services with no fee and minimal gatekeeping — a deliberate design for equity.' },
    ],
    deepSections: [
      { id: 'scholarly', title: 'The Most Democratic Institution', content: `The public library is a promise a community makes to itself: that knowledge, connection, and a warm safe room will be available to everyone, regardless of means. It is funded in common and open to all — a rare thing in modern life.\n\nIts collection matters, but its deeper product is *access*: to information, to technology, to programmes, and to a public space that asks nothing of you but that you come in.` },
      { id: 'principles', title: 'Roles a Public Library Plays', content: `- Reader’s advisory: helping people find the next book they’ll love.\n- Early literacy: building readers before they can read.\n- Digital inclusion: bridging the connectivity gap.\n- Community hub: programmes, meeting space, and civic life.\n- Intellectual freedom: defending open access to ideas.` },
      { id: 'application', title: 'Serving the Whole Community', content: `The daily work is astonishing in range: a storytime at ten, résumé help at noon, a citizenship class at six. Public librarians are generalists of human need.\n\nBinding it together is a commitment to the freedom to read — met, when a book is challenged, with a fair reconsideration process rather than a quiet removal.` },
    ],
  },

  'digital-repositories': {
    features: [
      { icon: '🆔', title: 'Persistent Identifiers', description: 'A DOI or handle that still resolves when the original URL is long dead.',
        detail: 'Persistent identifiers (DOI, Handle, ARK) point to an object through a resolver, so citations survive server moves and reorganisations that break ordinary links.' },
      { icon: '📡', title: 'OAI-PMH Harvesting', description: 'The protocol that lets aggregators gather metadata from thousands of repositories at once.', interactive: true, action: 'quiz' },
      { icon: '🔓', title: 'Open Access Models', description: 'Green, gold, and diamond — the routes by which research becomes free to read.',
        detail: 'Green = self-archiving a copy in a repository. Gold = the journal publishes it open (often for a fee). Diamond = open to read *and* free to publish. Each shifts who pays.' },
      { icon: '🗃️', title: 'Digital Preservation', description: 'Bit-rot, format obsolescence, and link death — the slow disasters a repository must outlast.',
        detail: 'Bits degrade, formats stop opening, and links break. Preservation means checksums, format migration, and redundant copies — the digital equivalent of the climate-controlled vault.' },
      { icon: '📊', title: 'Metadata Standards', description: 'Dublin Core, METS, PREMIS — the schemas that make a digital object findable and trustworthy.',
        detail: 'Descriptive metadata makes an item findable; structural metadata (METS) holds its parts together; preservation metadata (PREMIS) records what was done to keep it alive.' },
      { icon: '📥', title: 'Self-Deposit Workflows', description: 'How a researcher’s upload becomes a permanent, citable scholarly record.',
        detail: 'Deposit interfaces guide authors to add metadata, agree to licences, and submit — after which curation, identifier assignment, and preservation turn a file into a durable object.' },
    ],
    deepSections: [
      { id: 'scholarly', title: 'The Library Without Walls', content: `A digital repository is a library whose stacks are servers and whose preservation vault is a preservation *system*. It captures the scholarly and cultural record born digital — datasets, theses, images, articles — and commits to keeping it findable and readable for the long term.\n\nIts hardest problem is not storage but *time*: formats obsolesce, links rot, and media decay. Preservation here is an active, ongoing practice, not a one-time act of shelving.` },
      { id: 'principles', title: 'What Makes a Repository Trustworthy', content: `- Persistent identifiers: citations that never break.\n- Rich metadata: findable, structured, preservation-aware.\n- Open protocols: OAI-PMH so others can harvest and aggregate.\n- Preservation policy: checksums, migration, redundant copies.\n- Clear rights: licences that state what users may do.` },
      { id: 'application', title: 'Open Access in Practice', content: `Repositories are the engine of the open-access movement. When a researcher deposits a copy of their article, it becomes readable by anyone — bypassing paywalls and widening the reach of publicly funded work.\n\nAggregators then harvest that metadata via OAI-PMH, so a thesis deposited in one institution surfaces in global search — the network turning many small archives into one vast open library.` },
    ],
  },

  'special-collections': {
    features: [
      {
        icon: '📖',
        title: 'The Access / Preservation Balance',
        description: 'Every rare item is both a research tool and a permanent cultural object.',
        detail: 'Policies (registration, gloves, cradles, light limits) are not bureaucracy for its own sake — they are how a library lets people use unique items without using them up.'
      },
      {
        icon: '🪑',
        title: 'Reading-Room Architecture',
        description: 'Sight lines, lockers, and supervised tables are security by design.',
        detail: 'Open sight lines let staff observe handling; lockers keep bags and coats out; closed stacks keep the collection behind a service point.'
      },
      {
        icon: '🧤',
        title: 'Handling Protocols',
        description: 'Cradles, clean hands or gloves, and pencil-only notes protect the object mid-use.',
        detail: 'The goal is minimum mechanical stress and zero irreversible marking. Technique matters as much as rules.'
      },
      {
        icon: '💡',
        title: 'Light & Exhibition Limits',
        description: 'Lux-hours budgets decide how long a manuscript can sit under gallery light.',
        detail: 'UV and visible light fade inks and dyes permanently. Exhibits rotate; originals often rest in dark storage between displays.'
      },
      {
        icon: '🔐',
        title: 'Security & Provenance',
        description: 'Registration, call slips, and ownership marks fight theft and forgery.',
        detail: 'Knowing who used what, and documenting ownership history, protects both the collection and legitimate scholarship.'
      },
      {
        icon: '✦',
        title: 'Certification Checkpoint',
        description: 'Test your judgment on access rules and handling ethics.',
        interactive: true,
        action: 'quiz'
      }
    ],
    deepSections: [
      {
        id: 'scholarly',
        title: 'What “Special” Means',
        content: `Special collections hold materials that are rare, unique, fragile, or of exceptional research value — manuscripts, early printed books, archives, maps, photographs, and local-history treasures.\n\nThey are not “better books” in a vague sense; they are materials for which loss would be permanent because replacement is impossible or meaningless.`
      },
      {
        id: 'principles',
        title: 'Principles of Rare-Book Service',
        content: `- Access with supervision, not secrecy for its own sake.\n- Prevention over repair: good handling beats clever mending.\n- Documentation: who used what, and in what condition.\n- Intellectual control: catalogs and finding aids make rarity usable.\n- Ethics: respect donor restrictions and cultural sensitivity.`
      },
      {
        id: 'application',
        title: 'A Typical Researcher Visit',
        content: `The researcher registers, stores belongings, and requests items by call slip. Staff retrieve materials from closed stacks and issue them to a numbered seat.\n\nAt the table, cradles and pencils are the norm. When the session ends, items are checked back in before the researcher leaves — closing the custody chain.`
      }
    ],
  },
};

// ============================================================
// STUDY STRIP — Anatomy Atelier-style bottom discovery cards
// ============================================================
const STUDY_STRIP_CONTENT = {
  'classification-systems': {
    micro: {
      eyebrow: 'Close-up study',
      title: 'Call number micro-structure',
      blurb: 'Zoom into the anatomy of a spine label — class, decimal, Cutter, and work mark.',
      points: [
        'Main class (e.g. 020) = broad discipline',
        'Decimal expansion narrows subject',
        'Cutter (.D519) sorts by author',
        'Work mark / year separates editions'
      ]
    },
    comparison: {
      vsId: 'marc-metadata',
      title: 'Classification vs. MARC',
      blurb: 'Where a book sits on the shelf vs. how machines describe it in the catalogue.'
    },
    functionAnim: {
      title: 'Relative location in motion',
      blurb: 'Watch how subject order lets new books slot in without renumbering the bay.'
    },
    system: {
      title: 'Cataloging & Organization',
      place: 'Stacks · OPAC · shelf-reading routes',
      blurb: 'Classification is the skeleton of every physical collection — public, school, and academic shelves alike.'
    },
    fieldLabel: 'Field challenges'
  },
  'marc-metadata': {
    micro: {
      eyebrow: 'Close-up study',
      title: 'Field & subfield anatomy',
      blurb: 'A single 245 title statement under the loupe: tags, indicators, and $a $b $c delimiters.',
      points: [
        '3-digit tag = field family (1XX, 2XX…)',
        'Two indicators change filing & display',
        'Subfields ($a, $b, $c) hold atomic data',
        'ISBD punctuation is part of the standard'
      ]
    },
    comparison: {
      vsId: 'classification-systems',
      title: 'MARC vs. Classification',
      blurb: 'Structured metadata for discovery vs. shelf notation for browsing.'
    },
    functionAnim: {
      title: 'Record flow in motion',
      blurb: 'From cataloguer keystrokes to WorldCat sharing to a patron keyword hit.'
    },
    system: {
      title: 'Bibliographic Control',
      place: 'Technical services · ILS · cooperative catalogs',
      blurb: 'MARC is the lingua franca of library systems — nearly every OPAC still speaks it.'
    },
    fieldLabel: 'Field challenges'
  },
  'preservation-science': {
    micro: {
      eyebrow: 'Close-up study',
      title: 'Paper fibre & acid migration',
      blurb: 'Under conservation light: cellulose chains, alum-rosin acid, and why RH matters.',
      points: [
        'Ideal vault: 60°F ± 5°F, 50% ± 5% RH',
        'Acid migrates by contact (newsprint clips)',
        'UV fades inks and weakens fibre',
        'Freeze-drying buys time after floods'
      ]
    },
    comparison: {
      vsId: 'special-collections',
      title: 'Preservation vs. Special Collections',
      blurb: 'Environment & chemistry that protect items vs. the reading-room access that uses them.'
    },
    functionAnim: {
      title: 'Disaster triage in motion',
      blurb: 'Follow the first-hour decisions when water hits a stack.'
    },
    system: {
      title: 'Preservation & Conservation',
      place: 'Vaults · labs · disaster staging areas',
      blurb: 'Every library that keeps collections long-term practices preservation — whether a vault or a climate-aware stack.'
    },
    fieldLabel: 'Field challenges'
  },
  'reference-services': {
    micro: {
      eyebrow: 'Close-up study',
      title: 'Search syntax under the loupe',
      blurb: 'Boolean, truncation, and controlled vocabulary — the grammar of a precise search.',
      points: [
        'AND narrows · OR broadens · NOT excludes',
        'Truncation (librar*) catches word variants',
        'Subject headings beat keyword noise',
        'CRAAP tests source quality'
      ]
    },
    comparison: {
      vsId: 'academic-libraries',
      title: 'Reference vs. Academic Systems',
      blurb: 'The interview that clarifies a need vs. the discovery stack that fulfils it.'
    },
    functionAnim: {
      title: 'Reference interview in motion',
      blurb: 'From a vague “books on dogs” to the real research need.'
    },
    system: {
      title: 'Public Service Desk',
      place: 'Service desks · chat · research consults',
      blurb: 'Reference is the human interface of the library — where questions become strategies.'
    },
    fieldLabel: 'Field challenges'
  },
  'collection-management': {
    micro: {
      eyebrow: 'Close-up study',
      title: 'MUSTIE decision micro-view',
      blurb: 'Each letter is a criterion — misleading, ugly, superseded, trivial, irrelevant, elsewhere.',
      points: [
        'M — factually wrong or outdated',
        'U — damaged beyond repair value',
        'S — replaced by a better edition',
        'I/E — no local demand / available via ILL'
      ]
    },
    comparison: {
      vsId: 'public-libraries',
      title: 'Weeding vs. Public Service',
      blurb: 'Deselection that keeps a collection healthy vs. the patrons who notice empty shelves.'
    },
    functionAnim: {
      title: 'Weeding cart in motion',
      blurb: 'Trace a volume from shelf pull to Keep / Withdraw decision.'
    },
    system: {
      title: 'Collection Development',
      place: 'Selectors · approval plans · shared print',
      blurb: 'Acquisition and deselection are one cycle — a living collection, not a warehouse.'
    },
    fieldLabel: 'Field challenges'
  },
  'academic-libraries': {
    micro: {
      eyebrow: 'Close-up study',
      title: 'Discovery layer anatomy',
      blurb: 'How one search box reaches catalogues, e-journals, and repositories at once.',
      points: [
        'Central index + local holdings',
        'Relevance ranking across formats',
        'EZproxy / SSO for off-campus access',
        'Link resolvers open the full text'
      ]
    },
    comparison: {
      vsId: 'public-libraries',
      title: 'Academic vs. Public Libraries',
      blurb: 'Research depth and licensed databases vs. civic access and popular reading.'
    },
    functionAnim: {
      title: 'Research visit in motion',
      blurb: 'From discovery search to reading room to ILL request.'
    },
    system: {
      title: 'Research & Teaching Support',
      place: 'Campus libraries · liaison offices · repositories',
      blurb: 'Academic libraries power teaching, theses, and faculty publishing — not only book checkout.'
    },
    fieldLabel: 'Field challenges'
  },
  'public-libraries': {
    micro: {
      eyebrow: 'Close-up study',
      title: 'Service desk micro-view',
      blurb: 'Circulation, holds, and digital lending as one continuous patron journey.',
      points: [
        'Self-check & staff-assisted circulation',
        'Libby/OverDrive for e-books',
        'Programmes (storytime, makerspaces)',
        'Privacy of borrowing records'
      ]
    },
    comparison: {
      vsId: 'academic-libraries',
      title: 'Public vs. Academic Libraries',
      blurb: 'Open civic access and popular collections vs. research depth and licensed content.'
    },
    functionAnim: {
      title: 'A day at the hub in motion',
      blurb: 'Storytime, résumé help, and holds pickup in one civic room.'
    },
    system: {
      title: 'Community & Civic Access',
      place: 'Branch floors · outreach vans · digital lending',
      blurb: 'The public library is often a town’s freest learning room — funded in common, open to all.'
    },
    fieldLabel: 'Field challenges'
  },
  'digital-repositories': {
    micro: {
      eyebrow: 'Close-up study',
      title: 'Bitstream & metadata stack',
      blurb: 'From deposit package to DOI, OAI-PMH feed, and fixity check.',
      points: [
        'Descriptive metadata (Dublin Core…)',
        'Persistent IDs (DOI, Handle, ARK)',
        'OAI-PMH for harvesting',
        'Checksums guard against bit-rot'
      ]
    },
    comparison: {
      vsId: 'marc-metadata',
      title: 'Repositories vs. MARC Catalogues',
      blurb: 'Open scholarly objects online vs. traditional bibliographic records for owned items.'
    },
    functionAnim: {
      title: 'Deposit-to-discover in motion',
      blurb: 'Author upload → curation → identifier → harvest → citation.'
    },
    system: {
      title: 'Open Access Infrastructure',
      place: 'Institutional repos · aggregators · data centres',
      blurb: 'Repositories are the library without walls — durable access to the scholarly record.'
    },
    fieldLabel: 'Field challenges'
  },
  'special-collections': {
    micro: {
      eyebrow: 'Close-up study',
      title: 'Reading-room micro-protocol',
      blurb: 'Cradle angle, pencil-only notes, and the custody chain for unique items.',
      points: [
        'Non-circulating, supervised use only',
        'Cradles protect bindings from over-opening',
        'Pencils only — ink is permanent',
        'Call slips close the custody chain'
      ]
    },
    comparison: {
      vsId: 'preservation-science',
      title: 'Special Collections vs. Preservation',
      blurb: 'Access under control vs. the environmental science that makes long access possible.'
    },
    functionAnim: {
      title: 'Researcher visit in motion',
      blurb: 'Register → request → cradle → return — one secure loop.'
    },
    system: {
      title: 'Rare Materials & Archives',
      place: 'Closed stacks · reading rooms · exhibits',
      blurb: 'Special collections hold what cannot be replaced — manuscripts, early print, and local memory.'
    },
    fieldLabel: 'Field challenges'
  }
};

LIBRARY_DATA.forEach(function (mod) {
  const extra = FEATURE_PAGE_CONTENT[mod.id];
  if (extra) {
    mod.features = extra.features;
    mod.deepSections = extra.deepSections;
  }
  const study = STUDY_STRIP_CONTENT[mod.id];
  if (study) {
    mod.study = study;
  }
});

if (typeof window !== 'undefined') {
  window.LIBRARY_DATA = LIBRARY_DATA;
}
