# TechAuthor Learner v2

A standalone browser-based structured authoring simulator inspired by classic enterprise XML editors.

## What changed in v2

- Element-aware authoring:
  - Select an element in Content view.
  - Insert menu only offers children that are valid in the demo schema.
  - Move and delete selected elements.
  - Element properties for ID/class.
- Shared structured document model:
  - Content view and XML view are generated from the same internal model.
  - XML can be edited and parsed back into Content view.
- Demo BREX-style validation:
  - required title
  - required procedural steps
  - step/command structure checks
  - safety-condition hint
  - applicability requirement
  - STE-style word/phrase checks
  - basic cross-reference detection
- Applicability editor:
  - product
  - variant
  - software range
  - serial/effectivity
  - expression
- Workflow:
  - In Work → In Review → Approved
  - In Review → In Work
  - Approved → In Work
  - validation errors block review/approval
  - Approved documents are locked
- Import:
  - XML / DITA-like XML
  - Markdown
  - JSON project
  - plain text
- Export:
  - S1000D-style demo XML
  - Markdown
  - JSON project
  - standalone HTML
- Local browser storage via localStorage

## Run

Open `index.html` directly in a modern browser. No build step is required.

## Scope

This is a learning and portfolio simulator. It is not PTC Arbortext and does not implement the complete S1000D specification, official BREX rules, official Saab authoring rules, or production CSDB integration.

## v2.1 fix

- The built-in demo is now always restored if no valid saved project exists.
- Added a visible **Reset demo** button in the top bar.
- Added **File → Reset demo**.
- A malformed or empty localStorage project can no longer replace the built-in demo with an empty editor.
- Replaced `structuredClone()` with a more broadly compatible demo clone for local/offline browser use.

## v2.2 critical fix

The previous v2/v2.1 package contained a JavaScript syntax error in the Preview renderer.
Because the browser could not parse `app.js`, the initialization code never ran, which made
the built-in demo appear to have disappeared.

v2.2 fixes that parser error. The built-in software-update demo now renders on startup.

## v2.3 layout fix

- Fixed nested `<cmd>` content collapsing into a one-character-wide column.
- Step children now span the full authoring grid width.
- Added safer minimum-width rules for the editor and property panes.

## v2.4 project management

Added a more complete Arbortext-like File/Project workflow:

- New Project
- Project switcher
- Project Properties
- New Document
- Open Document
- Duplicate Document
- Multiple documents per project
- Save Project
- Export whole project as JSON
- Delete/close project
- Existing import/export remains available
- Current document is persisted when switching projects/documents

This is modeled as a practical enterprise-authoring workflow rather than an exact reproduction of one specific Arbortext configuration.

## v2.5 project browser + document map

The left pane now has two synchronized navigation modes:

### Project
- Active project at the root
- Publication Module group
- Front matter/system/safety entries
- Data Modules generated from the actual documents in the project
- Workflow status dots per DM
- Click a DM to switch documents
- Supporting folders for Fault Isolation, Safety, Illustrations, Software Packages and References

### Document Map
- Displays the actual structured document hierarchy
- `mainProcedure` root
- title / para / warning / note / step / cmd / table / codeblock nodes
- Step numbering and text previews
- Clicking a node selects the same element in Content view
- Selecting an element in Content view updates the Document Map
- Reveal command scrolls the selected element into view
- Search works in either navigation mode

This makes the left pane function both as a project/CSDB-style browser and an Arbortext-like document structure map.

## v2.6 New Document fix

- Reworked New Document creation to use a defensive event handler.
- Added a delegated click fallback so the toolbar action still works if DOM handlers are replaced.
- Changed the toolbar icon into an explicit `+ New Document` button.
- Added templates for Procedure, Description, Fault isolation and Software reference.
- New documents are immediately added to the active project, opened, persisted, and shown in the Project tree.
- Added a small confirmation toast after creation.

## v2.7 New Document model fix

Fixed the actual cause of new documents becoming copies of the current demo document.

The project save routine persisted the currently open editor **after** the active document ID
had already been changed to the newly created document. That overwrote the new template with
the old document content.

v2.7 now:
- persists the old document before switching
- creates the new document from a clean type-specific template
- saves the project without overwriting the new document
- clears inherited applicability data on a new document
- applies the same safe-save logic to Duplicate Document and New Project

## v2.8 clean demo on reload

Changed startup behavior:

- Every browser reload starts from the built-in demo project.
- Old test documents and duplicate DMs stored in localStorage are cleared automatically.
- New projects/documents still work during the current browser session.
- Reloading the page resets the sandbox back to the clean demo.

This is a better default for a portfolio/demo sandbox. Persistent projects can be reintroduced later as an explicit opt-in feature such as "Save workspace".

## v2.9 logical desktop-app workflow

Project/document behavior has been revised to behave more like a normal authoring application:

- App startup opens the built-in demo project.
- **New Project** replaces the demo in the current workspace instead of adding the new project beside it.
- **Blank Project** contains no documents.
- A blank project opens an explicit **No document open** workspace.
- The empty workspace offers **New Document** and **Import Document** actions.
- **Software Maintenance template** creates a fresh starter document, not a copy of the startup demo.
- Project tree shows **No data modules** for a blank project.
- Document Map shows **No document open** until a document exists.
- Save, validation, export, duplicate, and metadata helpers now tolerate an empty project.
- **Reset demo** restores the whole built-in demo project.
- Browser reload still restores the clean demo automatically, which is useful for portfolio/demo use.

This separates three concepts cleanly:
1. Startup demo
2. New project template
3. New document template

## v3.0 middle-pane editing fix

Fixed the bug that made the structured Content pane appear read-only.

Cause:
- clicking an editable element selected it
- selection immediately rebuilt the entire editor DOM
- the browser caret/focus was destroyed before typing could begin

Fix:
- selection now updates highlighting, context and properties without rebuilding the editor
- editable content keeps its caret and focus
- Document Map synchronization remains active
- full re-rendering is reserved for structural operations such as insert/delete/move

## v3.1 broader starter templates

Added more realistic starter templates across the project tree.

### New Project → Software template now creates starter documents for:
- Publication Module
  - Front matter
  - System description
  - Operator information
- Data Modules
  - Software maintenance procedure
- Fault Isolation
  - Fault isolation starter DM
- Safety
  - Safety instructions starter DM
- Software Packages
  - Software package reference starter DM
- References
  - Reference data starter DM
- Illustrations
  - Starter illustration asset rows

### New Document now offers matching templates:
- Procedure
- Front matter
- System description
- Operator information
- Safety
- Fault isolation
- Software package reference
- Reference data

This makes the non-procedure parts of the project feel more intentionally scaffolded from the start.

## v3.2 workflow + navigation + references

Added the next functional layer:

- Demo project is now populated across:
  - Publication Module
  - Data Modules
  - Fault Isolation
  - Safety
  - Software Packages
  - References
  - Illustrations
- Illustration assets are clickable and open a simple asset preview.
- References / Where Used panel shows outgoing and incoming DMC relationships.
- Reference entries are clickable and open the target DM.
- Double-clicking a selected DMC string in editable text opens the referenced DM.
- Find / Replace added to the toolbar.
- Review comments can be added and resolved per document.
- Workflow buttons now follow state more realistically:
  - Submit for review only in In Work
  - Approve only in In Review
  - Return to author in In Review / Approved
- Approved documents remain locked.
- Demo documents include realistic cross-references so References / Where Used is visible immediately.

## v3.4 schema + BREX separation

Authoring rules are now modeled in two layers:

### Schema layer
The S1000D-like schema defines the structural possibilities:
- which elements exist
- which child elements are structurally valid in the current context

### BREX layer
The active BREX profile further restricts the schema and validates project rules:
- required title
- required procedural steps
- required cmd child in each step
- MAINTENANCE mode wording rule
- required security classification
- required issue number
- required applicability expression
- allowed security-classification values
- context-specific element restrictions

### BREX Rules panel
A new right-side tab shows:
- active BREX-DM identifier
- active profile
- current schema/context
- elements permitted after BREX filtering
- elements allowed by schema but filtered by BREX
- live pass/warning/violation state for each rule

### Insert valid element
The insert menu now uses:

Schema allowed elements → BREX filtering → user choices

If an element is structurally invalid, the app reports a Schema violation.
If the schema permits it but BREX blocks it, the app reports a BREX violation.

## v3.6 hands-on authoring training

### Document Map drag/drop
Elements can be dragged in the structure tree. The app checks both schema and active BREX before accepting the move. Dropping onto a valid container nests the element; otherwise a valid drop becomes a sibling move.

### Managed cross-reference dialog
`Xref` opens a CSDB-style chooser. Select a managed data module rather than typing a DMC manually. The selected element stores a managed reference and displays a clickable xref chip. References are included in outgoing-reference detection and the XML demo output.

### Structured table editor
`Table` opens a dedicated editor for rows and columns. Add/remove rows or columns, edit cell values, and choose whether the first row is a header. Existing tables also expose an `Edit table…` button.

## v3.7 Context-sensitive Learning Mode
Learning Mode now detects the open DM and adapts to Procedure, Fault isolation, Safety, System description, Operator information, Software reference, and Reference data. The selected DM type changes coaching focus, contextual exercises, guided goals, and scoring. Generic Schema/BREX/STE/Xref exercises remain available.

## v3.8 exercise loading fix

`Load exercise` now replaces the open authoring model with a clean training DM instead of leaving stale demo content in the center editor.

All views are synchronized after loading:
- Content editor
- Document Map
- Properties
- Applicability
- References
- BREX
- Element Coach
- XML/source
- Preview
- workflow/status display

A yellow training banner also appears above the editor to make it clear that the loaded exercise is local training data and is not being checked in to the CSDB.

## v3.9 Document Map hotfix

v3.8 accidentally lost the `renderTree()` dispatcher during the exercise-loading refactor. That caused a runtime `ReferenceError` at startup: the center editor could still render, but the Document Map remained blank and later event wiring could stop.

v3.9 restores the dispatcher:
- Document Map renders the current structured DM
- Resources renders when that tab is selected
- tree search works again
- exercise loading can rebuild both center content and Document Map
- startup tree rendering now reports a visible error if a future runtime problem occurs instead of failing silently

## v4.0 position-aware structured insertion

The insert model is now closer to a real structured XML editor.

### Selectable document root
`mainProcedure` in Document Map is now a real selectable authoring context.

### Insert positions
The toolbar now has:
- Inside
- After
- Before

Examples:
- Select `mainProcedure` + Inside + `step` → creates a top-level procedure step.
- Select `sectionTitle` + After + `step` → creates a sibling step immediately after the section heading.
- Select `step` + Inside + `cmd` → creates the command inside that step.
- Select `title` + After + `para` → creates a paragraph sibling after the title, if schema/BREX allow it.

Schema and BREX are evaluated against the actual insertion destination, not merely the selected element.

## v4.1 right-panel hotfix

v4.0 added JavaScript wiring for the new insertion-position selector, but the selector was not actually inserted into the generated HTML. The resulting null-element error occurred before the right-panel tab handlers were registered, so Applicability, BREX Rules, Learning and Validation appeared unclickable.

v4.1 adds the missing Inside / After / Before selector, makes its event binding defensive, registers right-panel tabs before optional toolbar controls, and clears root selection when a normal editor element is selected.

## v4.2 delete-element fix
- Delete is now a clearly labeled toolbar button.
- Deleting a selected element refreshes Content, Document Map, Properties, References, BREX, Learning, XML and Preview.
- The selection moves to a sensible remaining parent/sibling after deletion.
- Title and document root remain protected.
- Keyboard shortcut: Delete when focus is not inside an editor/input; Cmd/Ctrl+Backspace also works outside text editing.

## v4.3 Undo / Redo

Undo and Redo are now implemented with a 50-step snapshot history.

Tracked actions include:
- text edits
- insert element
- delete element
- move up/down
- Document Map drag/drop
- managed xref insertion
- structured table edits
- reusable content insertion
- properties/applicability changes where supported
- loading exercises and guided tasks

Keyboard:
- Cmd/Ctrl + Z = Undo
- Shift + Cmd/Ctrl + Z = Redo
- Ctrl + Y = Redo

The undo/redo buttons disable automatically when their stacks are empty and show the next action in their tooltip.

## v4.4 Arbortext-like authoring feel
- Full Tags / Partial Tags / No Tags in Edit view
- Context-sensitive Modify Attributes dialog
- Inline attribute display in Partial and Full Tags
- Read-only DMC breakdown in Properties

## v4.5 Quick Tags — based on PTC Arbortext behavior

Quick Tags now follows the documented Arbortext interaction model more closely:

- Place the cursor/select an element.
- Press Enter.
- A popup appears at the current location.
- Only elements valid for that location are offered.
- Child insertions appear below a divider.
- Sibling/split-style choices can appear above the divider.
- Arrow keys navigate the popup.
- Enter selects.
- Esc closes.
- In No Tags mode, a gray Tag Prompt appears for a newly inserted empty element.

Learning Mode includes `Arbortext Basics — Quick Tags`, modeled on PTC's own step-by-step tutorial pattern.

## v4.6 Learning redesign

Learning is now organized by purpose instead of difficulty labels.

### Beginner Drills
A 20-drill session repeats the most important editor movements:
- select an element
- select mainProcedure
- Inside vs Before vs After
- step → cmd
- note inside step
- warning before step
- Quick Tags
- Full Tags / No Tags
- Modify Attributes

The same ten patterns appear twice per session, with the second pass shuffled. The trainer tracks correctness, streak, and weak skill areas.

### Arbortext Basics
PTC-inspired interaction modules are separated from S1000D topics:
1. Tag Display
2. Quick Tags
3. Modify Attributes
4. Document Map

Each module has a short repeatable exercise.

### S1000D Practice
The existing context-aware exercises and guided task now live together here:
- structure/schema
- BREX
- STE
- cross-references
- applicability
- procedure/fault/safety/system/operator/software/reference scenarios

### Element Coach
The context-sensitive element/schema/BREX explanation remains available as its own reference area.

## v4.7 Beginner Drill clarity

Beginner Drills now show the task prominently instead of relying on a small hidden/low-contrast line.

Each drill card includes:
- Drill number and round
- Skill category
- Large explicit instruction
- A `Do this` hint that tells the learner which UI control to use
- A reminder to press Check

If the answer is wrong, the feedback repeats the actual task so the learner never has to guess what the exercise expects.

## v4.8 Beginner Drill task rendering fix

Root cause fixed: `applyDrillSetup()` called a non-existent `renderApplicability()` function.
That runtime error happened after the drill document loaded but before the instruction card
was rendered, which is why the editor showed “Basic structure” while the Learning panel
showed an empty card.

Changes:
- Uses the existing `renderApplicabilityPreview()` renderer.
- Renders the drill instruction before mutating/refeshing the editor.
- Catches future drill-setup errors and shows them inside the Learning panel.
- Shows a clear pre-session card: “Press Start 20-drill session to begin.”

## v4.9 Beginner Drill insertion hotfix
- Removed the invalid `renderProperties()` call that caused trainer setup errors.
- Drill setup now synchronizes the actual metadata controls and DMC breakdown directly.
- `cmd` insertion inside a selected `step` now completes normally.
- Successful insertions keep the drill state live.

## v5.1 critical Insert wiring fix

The + button was previously wired in the large startup block near the end of `app.js`.
Any runtime error earlier in initialization could therefore leave the button visible but
with no click handler — exactly the symptom seen in Beginner Drill 3.

v5.1:
- binds the + button immediately and independently of later startup code
- removes the late conflicting onclick handler
- validates schema/BREX before creating the Undo snapshot
- uses only render functions known to exist after insertion
- surfaces any runtime error in the status bar and Learning feedback instead of failing silently

## v5.2 View-switching hotfix
- Content / XML / Preview / History / Issues are now bound independently of the large late startup wiring block.
- XML and Preview switches are fail-visible instead of silently doing nothing.
- History and Issues keep Content visible while opening their auxiliary view.
- Added explicit display rules for the three center-pane views.

## v5.3 bottom-view hard fix
The center view tabs no longer depend on late JavaScript event wiring.
Content, XML, Preview, History and Issues now call `setMode()` directly from their HTML buttons.

This avoids the recurring failure mode where a later startup error left the tabs visible but inert.
The generic Safari `Script error.` banner was also removed because it could report unrelated opaque browser/extension errors.

## v5.4 critical UI hotfix
- Full / Partial / No Tags now use an early capture-phase change handler.
- File / Edit / View / Insert / Review / Tools / Help menus use an early capture-phase menu handler.
- View explicitly offers tag modes plus XML and Preview.
- These controls no longer depend on the late startup wiring.

## v5.5 full control audit
All primary static controls are now handled by one early capture-phase dispatcher:
- top actions
- main menus
- toolbar buttons
- Document Map / Resources tabs
- Content / XML / Preview / History / Issues
- right-side tabs
- Properties workflow/actions
- Applicability
- Learning tabs and exercise controls
- tag mode / insert position / BREX selectors

This removes the recurring dependency on the long late startup wiring block.

Modify Attributes also no longer overwrites the app's internal node ID when editing the XML `id` attribute.

## v5.6 drills + Full Tags
- Beginner session now contains 20 distinct drills rather than repeating the first 10.
- Added unique drills for cmd selection, paragraph sibling insertion, a second Quick Tags task, Partial Tags, a second attribute task, codeblock insertion, Delete, Move Up, sibling steps, and completing an empty step.
- Full Tags no longer inherits the normal step two-column grid. Opening/closing tags, step text and child elements now keep sensible widths instead of squeezing text into a vertical column.

## v6.0 — 5 chapters / 100 drills
Beginner Drills now has five chapters with 20 unique drills each. The curriculum emphasizes everyday Arbortext-like structured authoring: Document Map/Edit view navigation, tag display, Quick Tags, context-aware insertion, Modify Attributes, move/delete/undo/redo, completeness-style validation, BREX/project rules, and routine save/review/check-in flow.

Progress is stored separately in localStorage. You can jump to any drill, skip forward, go back, or jump directly to the next unfinished drill.

## v6.1 — Arbortext fidelity pass

Researched against PTC Arbortext Editor 8.3 documentation and adjusted the trainer toward the standard editor:
- Menu bar now includes File, Edit, Find, View, Insert, Table, Tools, Workflow, Help. Workflow is explicitly a trainer/CSDB extension.
- Tools now uses Arbortext terminology: Context Rules, Check Completeness, Show Context, Document Type Viewer.
- Check Completeness uses CMP/INC status cues and a Completeness Check Log-style window.
- Added Find Tag/Attribute.
- Added Change Markup simulation.
- Added PTC default shortcuts: Ctrl+S, Ctrl+F, Ctrl+D, Ctrl+M, Ctrl+Shift+M, Enter Quick Tags, Ctrl+Shift+L, Alt+Ctrl+O/N, Ctrl+L, F6, Alt+Shift+T.
- Alt-click collapses/expands element content.
- 100 drills were rewritten to emphasize these professional Arbortext interactions before project-specific BREX/S1000D workflow.

## v6.2 Quick Tags toggle
- Quick Tags button now toggles the popup: click once to open, click again to close.
- Escape still closes Quick Tags.
- Selecting an item still closes it.
- Clicking elsewhere in the UI closes the popup as well.

## v6.3 menu toggles
- File / Edit / View / Insert / Review / Tools / Help now toggle.
- Click the same menu again to close it.
- Click another menu to switch directly.
- Click outside the open menu/modal to close it.

## v6.4 Modify Attributes dialog fix
- Rebuilt Modify Attributes as a self-contained modal.
- Apply/Cancel are queried inside the modal itself instead of through fragile global selectors.
- XML `id` remains separate from the trainer's internal node ID.
- Esc closes open dialogs as well as Quick Tags.

## v6.5 simplified drill navigation
- Removed the numbered 1–20 drill button row.
- Kept the Chapter dropdown and Jump to drill dropdown.
- Kept a single Skip button for fast progression.
- Progress is still remembered in the browser and completed drills are still marked in the Jump to drill menu.

## v6.6 Learning Mode startup fix
- Restored the missing `arbortextBasicModules` definition used by the Arbortext Basics tab.
- Learning Mode startup now guards optional sub-view renderers so one missing training module cannot block Beginner Drills.

## v6.7 Learning runtime restoration
- Restored missing Beginner Drill runtime functions: stats, start state, start/load/check/next/skip/jump.
- Learning Mode startup is guarded so missing optional drill helpers cannot crash the whole UI.
- Chapter and Jump to drill navigation are wired again.


## v6.8 smaller-screen learning panel
- Added a **Compact** toggle in the Learning panel.
- Learning panel now compresses better on smaller screens:
  - narrower right pane
  - stacked Chapter / Jump to drill controls
  - denser stats cards
  - more compact drill card layout
  - smaller tab/button text where needed
- Compact mode is remembered in localStorage.

## v6.9 automatic responsive learning layout
- Removed the manual Compact button.
- Learning layout now adapts automatically to browser width.
- At ≤1280 px the right Learning pane becomes compact automatically.
- At ≤1120 px the layout becomes tighter again: narrower side panes, 2-column learning tabs, denser cards.
- Resizing the browser updates the layout immediately.

## v7.0 drill selection fix
- Selection drills no longer start with the requested element already selected.
- The first selection exercises now begin from a neutral state.
- The `Select mainProcedure` drill starts with a normal content element selected, so the learner must actively select the root.
- Drills that genuinely require a preselected context for insertion/editing still preselect that context.

## v7.1 Learning Mode runtime integrity fix
- Restored missing `renderDrillSelectors()` and `updateDrillStats()`.
- Added a build-time audit for all core drill runtime functions so this class of regression is caught before packaging.
- Learning Mode initialization is now wrapped defensively so one failed sub-view cannot take down the entire Learning panel.

## v7.2 smaller-screen beginner drill layout
- The active drill card is now moved higher in the Learning panel.
- Chapter / Jump selectors stay near the top, then the drill itself appears immediately.
- The stats/result panel is smaller and moved below the active drill.
- This makes the actual task easier to see in full on smaller screens.

## v7.3 Document Map quick hide
- Added an × button in the Document Map / Resources pane header.
- Clicking it hides the left pane immediately (Normal view).
- Reopen it with View → Document Map or Alt+Ctrl+O.

## v7.4 Document Map auto-sync
- Removed the Reveal button entirely.
- Clicking an element in Document Map automatically scrolls the Edit view to that element and briefly highlights it.
- Clicking `mainProcedure` scrolls the Edit view to the top.
- Chapter 1's old Reveal drill is replaced with a practical navigation drill: navigate from a selected step to the title using Document Map.

## v7.5 Ctrl+M Insert Markup
- Ctrl+M now visibly opens a context-sensitive Insert Markup toolbar list.
- The old behavior only focused the native select, so it looked like nothing happened.
- Press Ctrl+M again, Esc, or click outside to close it.
- Ctrl+Shift+M remains the separate Insert Markup dialog.

## v7.6 Ctrl+M reliability
- Chapter 2 drill 1 now starts with `<step>` selected, so the Insert Markup list has valid choices (`cmd`, `note`, `warning`, `codeblock`).
- Ctrl+M and Ctrl+Shift+M are captured early at the **window** level, independent of later startup wiring.
- On macOS the drill explicitly says **Control+M**, not Command+M. Command+M is reserved by macOS/Safari for minimizing the window.
- The Insert Markup popup now visibly labels itself `Ctrl+M`.

## v7.7 Ctrl+M insertion behavior
- Choosing an element from the Ctrl+M Insert Markup list now inserts it immediately.
- The drill only passes after an element has actually been inserted.
- Arrow Up / Arrow Down navigate the popup; Enter activates the focused item; Esc closes it.

## v7.8 drill state + Ctrl+Shift+M fix
- Every new drill clears the previous drill's action/dialog state.
- Shortcut drills reassert their requested selected context after all renderers run.
- Ctrl+Shift+M Insert Markup dialog was rebuilt with local handlers and robust KeyM detection.

## v7.9 Ctrl+Shift+M drill validation fix
- The dialog drill now records dedicated evidence that the Insert Markup dialog was opened.
- It separately records which element was inserted from that dialog.
- `insertElement()` can no longer overwrite the evidence the drill checker needs.
- Drill 2 now passes only after opening the dialog and inserting a valid element.

## v7.10 drill validation made outcome-based
- Ctrl+Shift+M drill no longer trusts only transient event flags.
- The trainer records the step's initial child count when the drill starts.
- The drill passes when the document structure actually contains a newly inserted child.
- Dialog evidence is still recorded, but the observable document result is now the primary check.

## v7.11 Quick Tags drill validation fix
- Opening Quick Tags now records durable drill evidence.
- Drill 3 no longer checks whether the transient popup is still physically open when Check is clicked.
- This fixes the false failure caused by the Check click closing Quick Tags before the drill test ran.
- Quick Tags insertions also record durable usage evidence.

## v7.12 outcome-based drills + polish

- Tag overlap fixed for long Partial Tags labels (`sectionTitle`).
- Drill validation is outcome-first for insert, rootinsert, undo, redo, save, find, comment, table, xref, check-in, and markup-list.
- Ctrl+Z / Ctrl+Y now record durable drill evidence (keyboard path previously did not).
- Ctrl+S and Ctrl+F evidence aligned with drill checks (shortcut vs action kind mismatch fixed).
- Undo drills seed the undo stack so the accidental note can be undone immediately.
- Progress key bumped to `techauthorLearnerDrillsV712`.
- Help modal rewritten (scope, learning modes, limitations) instead of a version dump.
- `getNodesByType` no longer uses a mutable default-array parameter.
- Undo/redo history is cleared when a new drill loads.
- Control+M wording made consistent for macOS (Command+M minimizes the window).

## v7.13 modular split + lang + smoke tests

- `lang="en"` (UI is English).
- Split pure data out of the monolithic `app.js`:
  - `js/schema.js` — schema, BREX profiles, lessons, exercises
  - `js/drills.js` — 5×20 curriculum, makeDrill, drill session helpers
  - `app.js` — editor runtime, projects, UI wiring, startup
- Still no build step: classic sequential `<script>` tags (works from `index.html` / local server).
- Added `tests/drill-smoke.mjs` — Node smoke test for the drill catalog (100 drills, setup/test functions).

## v7.13.1 logical drill validation
- Durable shortcut evidence so later clicks (e.g. Apply after Ctrl+D) do not erase a correct open action
- Modify Attributes: Ctrl+D required for that shortcut drill; Apply after Ctrl+D passes
- markup-list: inspect-only vs insert distinguished by task text
- findtag requires an actual Find Next hit
- fixcomplete requires cmd present and completeness run (any order)
- changemarkup requires a real type change

## v7.14 — Arbortext-like Find/Replace

The trainer now models Arbortext's Find/Replace workflow as one tabbed dialog:
- Find/Replace
- Find Tag/Attribute
- Find Entity
- Find Processing Instruction

Find/Replace includes Find What, Replace With, Match Markup, Match Case, Match Patterns and Up/Down direction.
Find Tag/Attribute includes Tag Name, Attribute Name, Attribute Value, search options and direction.

The Find menu now opens the appropriate tab instead of using unrelated dialogs, and the Beginner Drills were updated to teach this workflow. Structural-find drills verify that the requested tag was actually found.
