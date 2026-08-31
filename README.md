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

## v7.15 — Completeness success feedback
- When Check Completeness finds no errors, no popup is shown.
- `No completeness errors found` appears in bold dark green in the status bar for 2 seconds.
- The `CMP` indicator receives a matching subtle green highlight for 2 seconds.
- Both then return to their normal appearance.

## v7.16 — Pedagogical Completeness Check Log
Check Completeness now groups findings by what they mean rather than showing one flat list:
- Completeness
- Markup
- Attributes
- IDs & references
- Empty elements
- Table markup
- Metadata / BREX
- Project / BREX
- Language / STE
- Workflow
- Information

Each group includes a short explanation. Errors, warnings and informational findings are visually distinguished. Double-clicking a result that is tied to a document node selects/reveals that element before opening the validation panel.

The check also now adds lightweight document-type checks for invalid element placement, empty leaf elements, invalid/required attributes, duplicate explicit IDs and inconsistent table rows.

## v7.17 — Learning drill fix
- Removed the inaccessible drill instruction to open the Validation/Completeness tab on the right while Learning occupies the right pane.
- Drill 6 in Chapter 4 now asks the learner to run Check Completeness and open the bottom Issues tab.
- The following drill was adjusted to avoid duplicating the same task.

## v7.18 — Title deletion / BREX drill fix
- Fixed Chapter 4 drill 11: when two titles exist, the second title can now be deleted.
- The BREX guard only blocks deletion when the selected title is the last remaining title.
- Prevented a blocked deletion from creating a useless Undo entry.
- Document Map/context are refreshed after deletion.

## v7.19 — Single-title authoring constraint
- Normal authoring no longer offers a second top-level `title` once one already exists.
- The constraint applies to Insert valid element and Quick Tags/sibling insertion choices.
- Direct insertion is also guarded with a clear occurrence-constraint message.
- Invalid/imported documents may still contain duplicate titles so Check Completeness and repair drills can demonstrate how to fix them.
- Chapter 4 now explicitly frames the duplicate-title drill as an imported-document repair scenario.

## v7.20 — Right-pane Learning drill state
- Fixed BREX Rules drill: opening BREX Rules is now recorded as durable drill evidence.
- The learner can return to Learning and click Check without losing credit.
- The same fix was applied to References and generic right-pane-tab drills.
- Drill wording now explicitly says to inspect the tab, return to Learning, and click Check.

## v7.21 — BREX wording + cache busting
- Reworded the BREX drill to remove the misleading phrase “S1000D layer”.
- The drill now says: open the BREX Rules tab, inspect the active project rules, return to Learning, then click Check.
- Added version query strings to local CSS/JS assets in `index.html` (`?v=7.21`) so GitHub Pages/browser caches are much less likely to serve stale drill logic after an update.

## v7.22 — BREX drill wording
- Drill 18 now says: “Switch the active Project BREX profile to Balanced.”
- Drill 19 now says: “Switch the active Project BREX profile back to Strict.”
- Asset cache-busting version updated to v7.22.

## v7.23 — Small-screen Learning pane fix
- Fixed `Next drill`, `Check`, and other full-width Learning buttons overflowing the right pane on narrow browser windows.
- Added border-box sizing and width constraints throughout the Learning pane.
- Correct/Not yet feedback now wraps inside the pane instead of being clipped off on the right.
- Disabled horizontal overflow in the Learning tab while preserving vertical scrolling.
- Asset cache-busting updated to v7.23.

## v7.24 — BREX profile drill setup
- Profile-switch drills now start from the opposite BREX profile.
- “Switch ... to Balanced” starts on Strict.
- “Switch ... back to Strict” starts on Balanced.
- This prevents a drill from already being in the target state when it loads.

## v7.25 — Attribute drill clarity
- Chapter 5 drill 5 now explicitly says `Set applicRefId=APP-01 on the step.`
- The generic attribute drill hint now reminds the learner to use the exact attribute/value shown in the task.

## v7.26 — Workflow drill clarity
- “Submit the DM for review” now explicitly points to `Properties > Document State > Submit for review`.
- “Return to author” now explicitly points to the same Document State controls.
- “Check in” now explicitly points to the top-bar Check in button.
- Added workflow-specific hints so these drills no longer rely on the generic authoring-action text.

## v7.27 — Scenario Practice
Added a fifth Learning mode: **Scenario Practice**.

It contains 10 progressively harder authoring scenarios:
1. Complete an unfinished procedure
2. Repair imported content
3. Update software applicability
4. Find and update terminology
5. Make the DM comply with Project BREX
6. Clean up procedural language
7. Add the correct Fault Isolation reference
8. Implement an engineering change
9. Prepare the DM for review
10. Resolve a returned DM and check it in

Scenario Practice deliberately does not tell the learner which buttons to press. Each scenario has a short context and a task, with hidden outcome-based acceptance criteria. On a failed check the learner sees only how many criteria remain. Hints become available after two failed attempts. On success the criteria are revealed and the scenario is marked complete in local storage.

## v7.28 — Arbortext Basics exercise loader fix
- Fixed `Start selected exercise` opening `Select an exercise first`.
- Arbortext Basics exercises now load directly by their own exercise ID.
- They no longer depend on the hidden S1000D Practice exercise selector, whose DM-type filtering could remove the selected Arbortext exercise.

## v7.29 — Simplified S1000D Practice
- Removed the separate `Guided Task` block from S1000D Practice.
- S1000D Practice now has one clear flow: choose exercise → read visible goals → Load exercise → edit → Check progress.
- The former software rollback guided task is now a normal selectable exercise.
- Progress checking is now exercise-specific instead of applying rollback criteria to unrelated procedure exercises.

## v7.30 — Separate document checks
- Replaced the single toolbar `Check Completeness` button with a compact `Checks ▾` menu.
- Added separate `Validate`, `BREX Check`, and `Check Completeness` actions.
- Added `Run all checks` as the final menu item below a separator.
- Results share the Issues/Validation view and are tagged `SCHEMA`, `BREX`, `COMPLETENESS`, or `LANGUAGE`.
- The Properties-side validation button is now `Run all checks`.
- Existing Check Completeness drills remain compatible.

## v7.31 — Scenario navigation and applicability fix
- An active Scenario Practice task now remains active when the learner opens Applicability, References, BREX Rules, or Properties and then returns to Learning.
- Returning to Learning shows `Scenario in progress` and `Check scenario` instead of incorrectly returning to `Load scenario`.
- Added `Variant A` and `Variant B` to the Applicability Variant selector for the scenario exercises that require them.
- Fixed Scenario Practice success feedback so it is not erased while updating the completed marker.

## v7.32 — Applicability scenario logic fix
- Fixed Scenario 3 and Scenario 10 criteria to accept the actual UI value `Variant B` instead of only the internal shorthand `B`.
- In applicability-focused scenarios, Apply applicability now builds the expression from the selected product, variant and software range.
- The learner no longer has to enter the same applicability twice in both the form fields and expression box.

## v7.33 — Legacy-manual capstone
- Added Scenario 11: `Capstone — Legacy manual migration`.
- Bundled the synthetic 10-page `RPU-200 Maintenance Manual, Rev C` as source material.
- The capstone asks the learner to extract one review-ready maintenance-LAN software-update procedure DM from the larger legacy manual.
- Added visible project brief, deliverable, source-manual link and expected effort while keeping acceptance criteria hidden.
- The capstone reuses the normal authoring, applicability, xref, Validate, BREX, Completeness and workflow tools.

## v7.34 — Copy/paste in structured text
- Fixed paste into editable title, para, warning, note, step and cmd text.
- Clipboard content is inserted as plain text at the caret instead of relying on browser rich-text paste behavior.
- Line breaks from PDFs/web pages are normalized to spaces so pasted legacy-manual text stays inside the selected XML element.
- Paste participates in the trainer undo stack and updates the XML/source model immediately.
- Native text selection/copy remains available.

## v7.35 — Structural Copy/Paste
- Added copy/paste for selected XML-style elements such as `step`, including their child `cmd` elements.
- `Ctrl/Cmd+C` copies the selected element when no text selection is active.
- `Ctrl/Cmd+V` pastes the copied element after the current element when valid, or inside it when that is the valid structural context.
- New copies receive fresh internal IDs.
- Normal highlighted-text copy and text paste are preserved.
- Added `Copy Element` and `Paste Element` to the Edit menu.

## v7.36 — CAUTION + applicability reliability
- Added `caution` as a valid top-level and step child element.
- CAUTION has its own editor styling and Element Coach guidance.
- XML export uses `<caution><warningAndCautionPara>…</warningAndCautionPara></caution>`.
- Markdown export renders `> **CAUTION:** …`.
- Applicability expressions are now generated from Product / Variant / Software from / Software to on every Apply, preventing field/expression mismatch.
- Added a guard against inverted software ranges (`from` later than `to`).
- Applicability expression is read-only in the normal UI because the controlled fields are the authoring surface.
- Structural Copy/Paste now clears copied explicit XML IDs recursively, preventing the duplicate-ID errors seen after copying steps.

## v7.37 — Import Project
- Added File → Import Project for JSON backups made with Export project.
- Import as a new project or replace the current browser project.
- Validates project/document structure before restore.

## v7.38 — Restore old document JSON backups
- `File → Import JSON Backup` now detects both full project backups and the older single-document JSON export (`{model, history}`).
- Single-document backups can replace the current document or be added as a new document.
- Renamed the document export from `Project JSON` to `Document JSON` to match what it actually contains.

## v7.39 — Close import dialog after restore
- Fixed JSON document restore so the Import document backup dialog closes automatically after a successful Replace current document or Add as new document action.

## v7.40 — Repair duplicate XML IDs in old backups
- Import now detects duplicate explicit XML IDs left in backups created before the structural Copy/Paste fix.
- The first occurrence is preserved; later duplicates have the copied explicit ID cleared.
- Repair works for both single-document JSON backups and full project backups.
- The import dialog reports how many legacy duplicate IDs were repaired.

## v7.41 — Beginner drill initial-state audit
- Fixed the Chapter 1 SELECT drills so title/para/step/cmd are no longer silently preselected after the neutral setup.
- Audited all 100 drills for the same class of problem.
- View drills now always start on a different view, even when jumped to directly.
- Document Map / Resources drills now start on the opposite left-pane tab.
- `Select step and inspect...` drills now require the learner to select the step.
- The Chapter 4 `Select title...` leaf drill now starts with no selection.
- Issues drill starts away from Issues.
- Applicability drill always starts with an empty applicability expression.
- Submit / Return workflow drills now explicitly start in the opposite workflow state.
- Added regression checks for these initial-state conditions to `tests/drill-smoke.mjs`.
