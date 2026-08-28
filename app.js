
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function noteShortcut(name, extra){
  state.lastLearningAction={kind:"shortcut",name,...(extra||{})};
  state.drillEvidence=state.drillEvidence||{};
  state.drillEvidence.shortcuts=state.drillEvidence.shortcuts||{};
  state.drillEvidence.shortcuts[name]=true;
  if(extra&&extra.inserted) state.drillEvidence.shortcuts[name+"_inserted"]=true;
}


// Critical Arbortext keyboard shortcuts are captured at window level before the rest
// of the application wiring. This is especially important when the trainer runs as
// a local file in Safari/Chrome.
window.addEventListener("keydown",e=>{
  const key=String(e.key||"").toLowerCase();

  // PTC default: Ctrl+M = Insert Markup toolbar list.
  // Use CTRL specifically. Command+M is a macOS system shortcut (minimize window).
  if(e.ctrlKey && !e.metaKey && !e.shiftKey && key==="m"){
    e.preventDefault();
    e.stopImmediatePropagation();
    focusInsertMarkup();
    return;
  }

  // PTC default: Ctrl+Shift+M = Insert Markup dialog.
  if(e.ctrlKey && !e.metaKey && e.shiftKey && (key==="m"||e.code==="KeyM")){
    e.preventDefault();
    e.stopImmediatePropagation();
    showInsertMarkupDialog();
    return;
  }
},true);


// v5.5: single early dispatcher for all primary static controls.
// It is registered before the rest of app startup. Capture phase + stopImmediatePropagation
// makes these controls independent of the legacy late wiring block.
function criticalClickAction(id,el){
  switch(id){
    case "backToCsdbBtn": return backToCsdb();
    case "checkInBtn": state.lastLearningAction={kind:"checkin"};return checkInCurrent();
    case "learningModeBtn": showRightTab("learning");showLearningView("beginner");return updateLearningModeUi();
    case "saveBtn": state.lastLearningAction={kind:"save"};return saveLocal();
    case "resetDemoBtn": return resetDemo();
    case "themeBtn": return document.body.classList.toggle("compact");
    case "insertFromCsdbBtn":
      state.leftMode="resources";$$(".left-pane .pane-tab").forEach(b=>b.classList.toggle("active",b.dataset.lefttab==="resources"));return renderTree();
    case "openBtn": return $("#fileInput")?.click();
    case "exportBtn": return showExport();
    case "undoBtn": state.lastLearningAction={kind:"undo"};return undoAction();
    case "redoBtn": state.lastLearningAction={kind:"redo"};return redoAction();
    case "insertElementBtn": {
      const type=$("#elementSelect")?.value;
      if(!type){if($("#cursorStatus"))$("#cursorStatus").textContent="Choose an element to insert.";return;}
      return insertElement(type);
    }
    case "insertXrefBtn": state.lastLearningAction={kind:"xref"};return showXrefDialog();
    case "tableEditorBtn": state.lastLearningAction={kind:"table"};return showTableEditor();
    case "modifyAttributesBtn": return showModifyAttributes();
    case "moveUpBtn": return moveSelected(-1);
    case "moveDownBtn": return moveSelected(1);
    case "deleteElementBtn": return deleteSelected();
    case "checksBtn": return toggleChecksMenu();
    case "validateBtn":
    case "validateSideBtn": return checkCompleteness();
    case "quickTagsBtn": return toggleQuickTags($("#quickTagsBtn"));
    case "previewBtn": return setMode("preview");
    case "findReplaceBtn": state.lastLearningAction={kind:"findreplace"};return showFindReplace("text");
    case "clearTreeSearch": if($("#treeSearch"))$("#treeSearch").value="";return renderTree();
    case "expandTreeBtn": return expandAllTree();
    case "collapseTreeBtn": return collapseAllTree();
    case "hideDocumentMapBtn": return showNormalView();
    case "emptyNewDocBtn": return newDocumentInProject();
    case "emptyImportBtn": return $("#fileInput")?.click();
    case "submitReviewBtn": return setWorkflow("In Review");
    case "approveBtn": return setWorkflow("Approved");
    case "returnBtn": return setWorkflow("In Work");
    case "applyElementPropsBtn": {
      const r=getNodeById(state.selectedId);if(!r)return;
      pushUndo("Edit element properties");
      r.node.xmlId=$("#selectedElementId")?.value.trim()||"";
      r.node.className=$("#selectedElementClass")?.value.trim()||"";
      state.history.unshift(hist(`Updated properties on <${r.node.type}>`));
      markDirty();syncSourcePassive();return renderElementCoach();
    }
    case "addCommentBtn": state.lastLearningAction={kind:"comment"};return addComment();
    case "applyApplicabilityBtn": {
      pushUndo("Edit applicability");
      const product=$("#appProduct")?.value||"";
      const variant=$("#appVariant")?.value||"";
      const swFrom=$("#appSwFrom")?.value||"";
      const swTo=$("#appSwTo")?.value||"";
      const serial=$("#appSerial")?.value||"";
      if(swFrom&&swTo&&compareVersionStrings(swFrom,swTo)>0){
        state.undoStack.pop();updateUndoRedoButtons();
        return alert("Software from cannot be later than Software to.");
      }
      const expression=buildApplicabilityExpression({product,variant,swFrom,swTo});
      if($("#appExpression"))$("#appExpression").value=expression;
      state.model.applicability={product,variant,swFrom,swTo,serial,expression};
      if(typeof renderApplicabilityPreview==="function")renderApplicabilityPreview();
      markDirty();return validate();
    }
    case "beginnerDrillsBtn": return showLearningView("beginner");
    case "arbortextBasicsBtn": return showLearningView("arbortext");
    case "structuredPracticeBtn": return showLearningView("structured");
    case "elementCoachBtn": return showLearningView("element");
    case "startDrillsBtn": return startBeginnerDrills();
    case "checkDrillBtn": return checkCurrentDrill();
    case "nextDrillBtn": return nextBeginnerDrill();
    case "skipDrillBtn": return skipBeginnerDrill();
    case "startBasicExerciseBtn": return startSelectedBasicExercise();
    case "loadExerciseBtn": return loadExercise();
    case "scoreExerciseBtn": return scoreSelectedExercise();
    case "scenarioStartBtn": return startScenario();
    case "scenarioCheckBtn": return checkScenario();
    case "scenarioHintBtn": return showScenarioHint();
    case "scenarioNextBtn": return nextScenario();
  }
}

function criticalChangeAction(id,el){
  switch(id){
    case "tagModeSelect": return applyTagMode(el.value);
    case "insertPositionSelect": refreshInsertOptions();return updateContext();
    case "exerciseSelect": return renderExerciseInfo();
    case "scenarioSelect":
      state.scenarioIndex=Number(el.value)||0;
      state.scenarioAttempts=0;state.scenarioHintIndex=0;
      state.scenarioActive=false;
      return renderScenarioIntro();
    case "drillChapterSelect": state.drillChapterIndex=Number(el.value)||0;state.drillIndex=0;state.drillSession=null;return renderBeginnerStartState();
    case "drillJumpSelect": state.drillIndex=Number(el.value)||0;state.drillSession={correct:0,attempted:0,streak:0};loadCurrentDrill();return renderDrillSelectors();
    case "workflowInput":
      el.value=state.model?.meta?.workflow||"In Work";
      return alert("Use the workflow action buttons to change state.");
    case "brexProfileSelect":
      if($("#ruleProfileInput"))$("#ruleProfileInput").value=el.value;
      refreshInsertOptions();renderBrexPanel();return validate();
    case "ruleProfileInput":
      if($("#brexProfileSelect"))$("#brexProfileSelect").value=el.value;
      refreshInsertOptions();renderBrexPanel();return validate();
  }
  if(["dmcInput","issueInput","langInput","titleInput","securityInput","authorInput","responsibleInput","reviewerInput"].includes(id)){
    syncModelFromControls();markDirty();return syncSourcePassive();
  }
}


document.addEventListener("mousedown",e=>{
 const backdrop=$("#modalBackdrop");
 if(!backdrop || backdrop.classList.contains("hidden") || !backdrop.dataset.menu)return;
 if(e.target.closest?.(".menubar button[data-menu]"))return;
 if(e.target.closest?.("#modal"))return;
 backdrop.classList.add("hidden");
 backdrop.dataset.menu="";
},true);

document.addEventListener("click",e=>{
  try{
    const menuBtn=e.target.closest?.(".menubar button[data-menu]");
    if(menuBtn){
      e.preventDefault();e.stopImmediatePropagation();
      return toggleMainMenu(menuBtn.dataset.menu);
    }
    const bottom=e.target.closest?.(".bottom-tab[data-mode]");
    if(bottom){
      e.preventDefault();e.stopImmediatePropagation();
      return setMode(bottom.dataset.mode);
    }
    const right=e.target.closest?.(".right-pane .pane-tab[data-righttab]");
    if(right){
      e.preventDefault();e.stopImmediatePropagation();
      return showRightTab(right.dataset.righttab);
    }
    const left=e.target.closest?.(".left-pane .pane-tab[data-lefttab]");
    if(left){
      e.preventDefault();e.stopImmediatePropagation();
      state.leftMode=left.dataset.lefttab;
      $$(".left-pane .pane-tab").forEach(x=>x.classList.toggle("active",x===left));
      return renderTree();
    }
    const basic=e.target.closest?.("[data-basic]");
    if(basic){
      e.preventDefault();e.stopImmediatePropagation();
      state.selectedBasic=basic.dataset.basic;return renderArbortextBasicDetail();
    }
    const prop=e.target.closest?.(".prop-header");
    if(prop){
      e.preventDefault();e.stopImmediatePropagation();
      return prop.closest(".prop-section")?.classList.toggle("open");
    }
    const id=e.target.closest?.("[id]")?.id;
    if(id && typeof criticalClickAction==="function"){
      const handled=[
        "backToCsdbBtn","checkInBtn","learningModeBtn","saveBtn","resetDemoBtn","themeBtn",
        "insertFromCsdbBtn","openBtn","exportBtn","undoBtn","redoBtn","insertElementBtn",
        "insertXrefBtn","tableEditorBtn","modifyAttributesBtn","moveUpBtn","moveDownBtn",
        "deleteElementBtn","checksBtn","validateSideBtn","quickTagsBtn","previewBtn",
        "findReplaceBtn","clearTreeSearch","expandTreeBtn","collapseTreeBtn","hideDocumentMapBtn",
        "emptyNewDocBtn","emptyImportBtn","submitReviewBtn","approveBtn","returnBtn",
        "applyElementPropsBtn","addCommentBtn","applyApplicabilityBtn","beginnerDrillsBtn",
        "arbortextBasicsBtn","structuredPracticeBtn","elementCoachBtn","startDrillsBtn",
        "checkDrillBtn","nextDrillBtn","skipDrillBtn","startBasicExerciseBtn","loadExerciseBtn",
        "scoreExerciseBtn","scenarioStartBtn","scenarioCheckBtn","scenarioHintBtn","scenarioNextBtn"
      ].includes(id);
      if(handled){
        e.preventDefault();e.stopImmediatePropagation();
        return criticalClickAction(id,e.target);
      }
    }
  }catch(err){
    console.error("Control action failed",err);
    if($("#cursorStatus"))$("#cursorStatus").textContent=`Control error: ${err.message}`;
    const feedback=$("#drillFeedback");
    if(feedback)feedback.innerHTML=`<div class="drill-feedback wrong"><strong>Control error</strong><div>${esc(String(err.message))}</div></div>`;
    alert(`Control error: ${err.message}`);
  }
},true);

document.addEventListener("change",e=>{
  const id=e.target?.id;
  const handled=[
    "tagModeSelect","insertPositionSelect","exerciseSelect","scenarioSelect","drillChapterSelect","drillJumpSelect","workflowInput",
    "brexProfileSelect","ruleProfileInput","dmcInput","issueInput","langInput",
    "titleInput","securityInput","authorInput","responsibleInput","reviewerInput"
  ].includes(id);
  if(!handled)return;
  try{
    e.stopImmediatePropagation();
    criticalChangeAction(id,e.target);
  }catch(err){
    console.error("Control change failed",err);
    if($("#cursorStatus"))$("#cursorStatus").textContent=`Control error: ${err.message}`;
    alert(`Control error: ${err.message}`);
  }
},true);

document.addEventListener("input",e=>{
  if(e.target?.id==="treeSearch")renderTree();
},true);


function applyTagMode(mode){
  if(!["full","partial","none"].includes(mode))return;
  state.tagMode=mode;
  const select=document.getElementById("tagModeSelect");
  if(select && select.value!==mode)select.value=mode;
  try{
    renderAuthor();
    renderTree();
    state.lastLearningAction={kind:"tagMode",mode};
    const status=document.getElementById("cursorStatus");
    if(status)status.textContent=`Tag display: ${mode==="full"?"Full Tags":mode==="partial"?"Partial Tags":"No Tags"}`;
  }catch(err){
    console.error("Tag display failed",err);
    const status=document.getElementById("cursorStatus");
    if(status)status.textContent=`Tag display failed: ${err.message}`;
    alert(`Tag display failed: ${err.message}`);
  }
}


function toggleMainMenu(menu){
 const backdrop=$("#modalBackdrop");
 const sameOpen=backdrop && !backdrop.classList.contains("hidden") && backdrop.dataset.menu===menu;
 if(sameOpen){
   backdrop.classList.add("hidden");
   backdrop.dataset.menu="";
   if($("#cursorStatus"))$("#cursorStatus").textContent=`${menu} menu closed`;
   return;
 }
 openMainMenu(menu);
}
function openMainMenu(menu){
  try{
    if($("#modalBackdrop"))$("#modalBackdrop").dataset.menu=menu;
    const k=(s,txt)=>`<span class="shortcut-key">${s}</span> ${txt}`;
    if(menu==="file")showModal("File",`<div class="export-grid">
      <button class="export-option" id="fileOpenFromCsdb"><strong>${k("Ctrl+O","Open")}</strong><span>Open managed content / file</span></button>
      <button class="export-option" id="fileSave"><strong>${k("Ctrl+S","Save")}</strong><span>Save current document</span></button>
      <button class="export-option" id="fileExport"><strong>Save As / Export</strong><span>XML, Markdown, JSON or HTML</span></button>
      <button class="export-option" id="fileImportProject"><strong>Import JSON Backup</strong><span>Restore a document or project JSON backup</span></button>
      <button class="export-option" id="fileCheckIn"><strong>Check in</strong><span>CSDB workflow extension in this trainer</span></button>
      <button class="export-option" id="fileReset"><strong>Revert / Reload demo</strong><span>Restore startup example</span></button>
    </div><div class="menu-note">Arbortext File also includes New, Close, Save All, Print Preview, Print and Publish. The trainer keeps the subset useful for authoring practice.</div>`);
    else if(menu==="edit")showModal("Edit",`<div class="export-grid">
      <button class="export-option" onclick="undoAction()"><strong>${k("Ctrl+Z","Undo")}</strong><span>Undo last edit</span></button>
      <button class="export-option" onclick="redoAction()"><strong>${k("Ctrl+Y","Redo")}</strong><span>Redo last edit</span></button>
      <button class="export-option" onclick="copySelectedElement()"><strong>${k("Ctrl+C","Copy Element")}</strong><span>Copy the selected structured element and its children</span></button>
      <button class="export-option" onclick="pasteCopiedElement()"><strong>${k("Ctrl+V","Paste Element")}</strong><span>Paste the copied element at a valid structural location</span></button>
      <button class="export-option" onclick="showModifyAttributes()"><strong>${k("Ctrl+D","Modify Attributes")}</strong><span>Attributes valid for the current element/document type</span></button>
      <button class="export-option" onclick="showChangeMarkup()"><strong>Change Markup</strong><span>Change the selected element while preserving content</span></button>
      <button class="export-option" onclick="deleteSelected()"><strong>Delete Element</strong><span>Trainer structural delete</span></button>
      <button class="export-option" id="applyXmlModal"><strong>Apply XML to Content</strong><span>Trainer source synchronization</span></button>
    </div>`);
    else if(menu==="find")showModal("Find",`<div class="export-grid">
      <button class="export-option" onclick="showFindReplace('text')"><strong>${k("Ctrl+F","Find/Replace")}</strong><span>Open the Find/Replace tab</span></button>
      <button class="export-option" onclick="findAgain()"><strong>Find Next</strong><span>Repeat the last Find operation</span></button>
      <button class="export-option" onclick="showFindReplace('tag')"><strong>Find Tag/Attribute</strong><span>Open Find/Replace on the structural search tab</span></button>
      <button class="export-option" onclick="showFindReplace('entity')"><strong>Find Entity</strong><span>Open the Find Entity tab</span></button>
      <button class="export-option" onclick="showFindReplace('pi')"><strong>Find Processing Instruction</strong><span>Open the PI search tab</span></button>
      <button class="export-option" onclick="findElementBoundary('start')"><strong>Find Element Start</strong><span>Move to the start of the selected element</span></button>
      <button class="export-option" onclick="findElementBoundary('end')"><strong>Find Element End</strong><span>Move to the end of the selected element</span></button>
    </div><div class="menu-note">Arbortext's Find/Replace dialog uses tabs for text, tag/attribute, entity and processing-instruction searches.</div>`);
    else if(menu==="view")showModal("View",`<div class="export-grid">
      <button class="export-option" onclick="applyTagMode('full')"><strong>Full Tags</strong><span>Show complete tag boundaries</span></button>
      <button class="export-option" onclick="applyTagMode('partial')"><strong>Partial Tags</strong><span>Compact markup display</span></button>
      <button class="export-option" onclick="applyTagMode('none')"><strong>No Tags</strong><span>Hide markup display</span></button>
      <button class="export-option" onclick="cycleTagMode()"><strong>${k("Ctrl+Shift+L","Cycle Tag Display")}</strong><span>Full → Partial → None</span></button>
      <button class="export-option" onclick="showDocumentMapView()"><strong>${k("Alt+Ctrl+O","Document Map")}</strong><span>Show the structural map</span></button>
      <button class="export-option" onclick="showNormalView()"><strong>${k("Alt+Ctrl+N","Normal")}</strong><span>Hide Document Map</span></button>
      <button class="export-option" onclick="setMode('preview')"><strong>Preview</strong><span>Reader-facing preview</span></button>
    </div>`);
    else if(menu==="insert")showModal("Insert",`<div class="export-grid">
      <button class="export-option" onclick="focusInsertMarkup()"><strong>${k("Ctrl+M","Markup list")}</strong><span>Focus the valid markup list</span></button>
      <button class="export-option" onclick="showInsertMarkupDialog()"><strong>${k("Ctrl+Shift+M","Markup dialog")}</strong><span>Insert valid markup at the current context</span></button>
      <button class="export-option" onclick="toggleQuickTags()"><strong>${k("Enter","Quick Tags")}</strong><span>Popup at the cursor with valid elements</span></button>
      <button class="export-option" onclick="showTableEditor()"><strong>${k("Alt+Shift+T","Table")}</strong><span>Insert/edit a structured table</span></button>
      <button class="export-option" onclick="showXrefDialog()"><strong>Link / Xref</strong><span>Managed cross-reference</span></button>
    </div>`);
    else if(menu==="table")showModal("Table",`<div class="export-grid">
      <button class="export-option" onclick="insertTableShortcut()"><strong>${k("Alt+Shift+T","Insert Table")}</strong><span>Insert a table at a valid context</span></button>
      <button class="export-option" onclick="showTableEditor()"><strong>Table Editor</strong><span>Edit rows, columns and cells</span></button>
    </div><div class="menu-note">Arbortext also provides F9/Shift+F9 and Ctrl+F9/Ctrl+Shift+F9 row/column shortcuts while editing a table.</div>`);
    else if(menu==="tools")showModal("Tools",`<div class="export-grid">
      <button class="export-option" onclick="checkCompleteness()"><strong>Check Completeness</strong><span>Check required structure, attributes, references and empty elements</span></button>
      <button class="export-option" onclick="toggleContextRules()"><strong>${state.contextRulesOn?"✓ ":""}Context Rules</strong><span>Interactive validity checking while editing</span></button>
      <button class="export-option" onclick="showContextInfo()"><strong>Show Context</strong><span>Show elements valid at the current position</span></button>
      <button class="export-option" onclick="showDocumentTypeViewer()"><strong>Document Type Viewer</strong><span>Inspect the training schema and valid children</span></button>
    </div><div class="menu-note">Project BREX and STE checks in this trainer are additional S1000D/project layers, not core Arbortext menu items.</div>`);
    else if(menu==="review")showModal("Workflow (trainer extension)",`<p>Current state: <strong>${esc(state.model?.meta?.workflow||"—")}</strong></p><p>This menu represents the CSDB/S1000D workflow integration around Arbortext, not a stock Arbortext menu.</p>`);
    else if(menu==="help")showModal("Help",`<div class="export-grid"><button class="export-option" onclick="showShortcutReference()"><strong>Keyboard Shortcuts</strong><span>PTC-documented shortcuts implemented by the trainer</span></button><button class="export-option" onclick="showHelp()"><strong>About TechAuthor Learner</strong><span>Trainer scope and limitations</span></button></div>`);

    setTimeout(()=>{
      $("#fileOpenFromCsdb")?.addEventListener("click",()=>{$("#modalBackdrop").classList.add("hidden");showOpenFromCsdb()});
      $("#fileSave")?.addEventListener("click",()=>{saveLocal();$("#modalBackdrop").classList.add("hidden")});
      $("#fileCheckIn")?.addEventListener("click",()=>{checkInCurrent();$("#modalBackdrop").classList.add("hidden")});
      $("#fileExport")?.addEventListener("click",()=>{$("#modalBackdrop").classList.add("hidden");showExport()});
      $("#fileImportProject")?.addEventListener("click",()=>{$("#modalBackdrop").classList.add("hidden");importProjectFromFile()});
      $("#fileReset")?.addEventListener("click",()=>{resetDemo();$("#modalBackdrop").classList.add("hidden")});
      $("#applyXmlModal")?.addEventListener("click",()=>{$("#modalBackdrop").classList.add("hidden");applySourceToContent()});
    },0);
  }catch(err){console.error("Menu failed",menu,err);if($("#cursorStatus"))$("#cursorStatus").textContent=`${menu} menu failed: ${err.message}`;alert(`${menu} menu failed: ${err.message}`)}
}

document.addEventListener("click",e=>{
  const menuBtn=e.target.closest?.(".menubar button[data-menu]");
  if(menuBtn){
    e.preventDefault();
    e.stopImmediatePropagation();
    openMainMenu(menuBtn.dataset.menu);
  }
},true);

document.addEventListener("change",e=>{
  if(e.target?.id==="tagModeSelect"){
    e.preventDefault();
    e.stopImmediatePropagation();
    applyTagMode(e.target.value);
  }
},true);


// Critical toolbar controls are bound immediately. This binding is intentionally
// independent of the long startup wiring block at the end of the file, so a
// later initialization error cannot silently disable Insert.
setTimeout(()=>{
  const btn=document.getElementById("insertElementBtn");
  if(btn && !btn.dataset.earlyBound){
    btn.dataset.earlyBound="1";
    btn.type="button";
    btn.addEventListener("click",e=>{
      e.preventDefault();
      e.stopImmediatePropagation();
      const sel=document.getElementById("elementSelect");
      const type=sel?.value||"";
      const status=document.getElementById("cursorStatus");
      if(status)status.textContent=type?`Insert requested: <${type}>`:"Choose an element to insert.";
      if(!type)return;
      try{
        insertElement(type);
      }catch(err){
        console.error("Toolbar insert failed",err);
        if(status)status.textContent=`Insert failed: ${err.message}`;
        const feedback=document.getElementById("drillFeedback");
        if(feedback)feedback.innerHTML=`<div class="drill-feedback wrong"><strong>Insert error</strong><div>${String(err.message)}</div></div>`;
        alert(`Insert failed: ${err.message}`);
      }
    },true);
  }
},0);




// schema + BREX: js/schema.js
// drills curriculum: js/drills.js

const attributeSchemas={
 title:[{name:"id",type:"text"}],sectionTitle:[{name:"id",type:"text"}],
 para:[{name:"id",type:"text"},{name:"changeMark",type:"select",values:["","1"]}],
 warning:[{name:"id",type:"text"},{name:"applicRefId",type:"text"}],
 note:[{name:"id",type:"text"},{name:"applicRefId",type:"text"}],
 step:[{name:"id",type:"text",required:true},{name:"applicRefId",type:"text"}],
 cmd:[{name:"id",type:"text"},{name:"changeMark",type:"select",values:["","1"]}],
 codeblock:[{name:"id",type:"text"}],table:[{name:"id",type:"text"},{name:"applicRefId",type:"text"}]
};
function elementAttributes(node){node.attrs=node.attrs||{};if(node.id&&!node.attrs.id)node.attrs.id=node.id;return node.attrs}
function parseDmcSegments(dmc){const parts=String(dmc||"").trim().split("-");const labels=["Model / system","System diff","System","Sub-system","Info code","Item loc."];return parts.map((value,i)=>({value,label:labels[i]||`Segment ${i+1}`}))}
function renderDmcBreakdown(){const host=$("#dmcBreakdown");if(!host||!state.model)return;const segs=parseDmcSegments(state.model.meta?.dmc||"");host.innerHTML=segs.map(s=>`<span class="dmc-segment" title="${esc(s.label)}"><strong>${esc(s.label)}</strong>${esc(s.value)}</span>`).join("")}
function currentTagMode(){return state.tagMode||"partial"}

const arbortextTutorials={
 quicktags:{
   title:"Arbortext Basics — Quick Tags",
   source:"PTC Arbortext Editor tutorial",
   steps:[
     "Place the cursor at a valid insertion location.",
     "Press Enter to open Quick Tags.",
     "Choose one of the valid elements shown for that location.",
     "Type content inside the newly inserted element.",
     "Repeat Enter to insert another valid element."
   ],
   note:"Quick Tags are context-sensitive: the list changes with cursor position and document type."
 },
 attributes:{
   title:"Arbortext Basics — Modify Attributes",
   source:"PTC Arbortext Editor tutorial",
   steps:[
     "Select an element.",
     "Open Modify Attributes.",
     "Change an allowed attribute value.",
     "Apply the change.",
     "Observe the attribute in the tag/Document Map."
   ]
 },
 tags:{
   title:"Arbortext Basics — Tag display",
   source:"PTC Arbortext Editor tutorial",
   steps:[
     "Switch Edit view to Full Tags.",
     "Identify opening and closing tags around the selected content.",
     "Switch to Partial Tags.",
     "Switch to No Tags and compare the same structure."
   ]
 }
};

const arbortextBasicModules={
  tags:{
    title:"Tag Display",
    intro:"Practice the documented Full Tags, Partial Tags and No Tags views on the same structured content.",
    steps:[
      "Load the exercise.",
      "Switch to Full Tags and identify opening and closing tags.",
      "Switch to Partial Tags.",
      "Switch to No Tags.",
      "Return to Partial Tags and confirm the document structure did not change."
    ],
    exercise:"basic-tags"
  },
  quicktags:{
    title:"Quick Tags",
    intro:"Practice the context-sensitive cursor → Enter → valid markup workflow.",
    steps:[
      "Load the exercise.",
      "Select a valid insertion context.",
      "Press Enter to open Quick Tags.",
      "Choose a valid element.",
      "Type content in the inserted element."
    ],
    exercise:"arb-quicktags"
  },
  attributes:{
    title:"Modify Attributes",
    intro:"Practice editing only the attributes available for the selected element.",
    steps:[
      "Load the exercise.",
      "Select the step.",
      "Open Modify Attributes.",
      "Set applicRefId to APP-01.",
      "Apply and inspect the result."
    ],
    exercise:"basic-attributes"
  },
  documentmap:{
    title:"Document Map",
    intro:"Practice using the Document Map as an active structural navigation and editing view.",
    steps:[
      "Load the exercise.",
      "Select sectionTitle in Document Map.",
      "Insert a step after it.",
      "Select the new step.",
      "Insert cmd inside it."
    ],
    exercise:"basic-documentmap"
  }
};
const learningDmProfiles={
 procedure:{label:"Procedure",focus:"Procedural authoring",goals:["Build a clear action sequence","Use cmd inside procedural steps","Place warnings and notes in the correct context","Validate applicability, references and project BREX"],challenge:"Create a valid maintenance procedure with clear imperative commands."},
 fault:{label:"Fault isolation",focus:"Troubleshooting logic",goals:["Separate symptom, cause and corrective action","Use references to recovery procedures","Keep troubleshooting steps concise","Preserve a clear diagnostic flow"],challenge:"Build fault-isolation information that identifies a symptom and points to corrective action."},
 safety:{label:"Safety",focus:"Safety information",goals:["Use warning and note deliberately","Put safety information before the relevant action","Do not bury mandatory actions in notes","Keep conditions and consequences explicit"],challenge:"Create safety content with correctly placed warnings and supporting notes."},
 system:{label:"System description",focus:"Descriptive technical information",goals:["Explain what the system is and does","Use descriptive paragraphs rather than procedural steps","Organize content into logical sections","Reference related DMs instead of duplicating procedures"],challenge:"Create a concise system overview with sections and supporting references."},
 operator:{label:"Operator information",focus:"Operational guidance",goals:["Write user-facing operational tasks","Keep commands direct and unambiguous","Separate normal operation from warnings","Reference maintenance-only actions"],challenge:"Create operator guidance without unnecessary maintenance detail."},
 software:{label:"Software reference",focus:"Software/configuration data",goals:["Use tables for versions and package data","State applicability clearly","Reference installation or recovery procedures","Separate reference data from instructions"],challenge:"Create software reference data with version, applicability and a managed reference."},
 reference:{label:"Reference data",focus:"Reusable reference information",goals:["Use compact tables and lists","Keep values normalized","Use managed cross-references","Avoid procedural prose in reference tables"],challenge:"Create structured reference data with at least one managed xref."}
};
function inferLearningDmType(){
 const m=state.model;if(!m)return "procedure";
 const t=((m.meta?.title||"")+" "+(m.meta?.dmc||"")).toLowerCase();
 if(/fault|isolation|troubleshoot/.test(t))return "fault";
 if(/safety|precaution/.test(t))return "safety";
 if(/operator|operation|operate/.test(t))return "operator";
 if(/system description|system overview/.test(t))return "system";
 if(/software package reference|software reference|baseline reference/.test(t))return "software";
 if(/reference data|applicable reference/.test(t))return "reference";
 if((m.nodes||[]).some(n=>n.type==="step"))return "procedure";
 if(/software|package|baseline|version/.test(t))return "software";
 if(/system|overview|description/.test(t))return "system";
 return "reference";
}
function activeLearningProfile(){return learningDmProfiles[inferLearningDmType()]||learningDmProfiles.procedure}
function contextExerciseCatalog(){
 const type=inferLearningDmType();
 const labels={procedure:"Procedure structure challenge",fault:"Fault-isolation challenge",safety:"Safety placement challenge",system:"System-description challenge",operator:"Operator guidance challenge",software:"Software reference challenge",reference:"Reference-data challenge"};
 return [
   {id:"ctx-"+type,label:labels[type]},
   ...(type==="procedure"?[{id:"rollback",label:"Build a software rollback procedure"}]:[]),
   {id:"mixed",label:"Mixed validation challenge"},
   {id:"schema",label:"Schema challenge"},
   {id:"brex",label:"BREX challenge"},
   {id:"ste",label:"STE challenge"},
   {id:"xref",label:"Cross-reference challenge"}
 ];
}
Object.assign(exercises,{
 "basic-tags":{title:"Arbortext Basics — Tag Display",description:"Compare Full, Partial and No Tags without changing the document structure.",nodes:()=>[{id:uid(),type:"title",text:"Tag display practice"},{id:uid(),type:"sectionTitle",text:"Description"},{id:uid(),type:"para",text:"The same content remains structured in every tag display mode."}]},
 "basic-attributes":{title:"Arbortext Basics — Modify Attributes",description:"Select the step and set applicRefId to APP-01.",nodes:()=>[{id:uid(),type:"title",text:"Attribute practice"},{id:uid(),type:"step",text:"Verify system status.",children:[{id:uid(),type:"cmd",text:"Verify the displayed status."}]}]},
 "basic-documentmap":{title:"Arbortext Basics — Document Map",description:"Use Document Map to select a section heading, add a step after it, then add cmd inside the step.",nodes:()=>[{id:uid(),type:"title",text:"Document Map practice"},{id:uid(),type:"sectionTitle",text:"Procedure"}]},

 "arb-quicktags":{title:"Arbortext Basics — Quick Tags",description:"Practice the documented Arbortext pattern: place the cursor, press Enter, and choose only from elements valid at that location.",nodes:()=>[
   {id:uid(),type:"title",text:"Quick Tags practice"},
   {id:uid(),type:"sectionTitle",text:"Procedure"},
   {id:uid(),type:"para",text:"Place the cursor here and press Enter to insert a valid element."}
 ]},
 "ctx-procedure":{title:"Procedure structure challenge",description:"Build a clear procedure with valid steps, commands and safety context.",nodes:()=>[{id:uid(),type:"title",text:"Restore service operation"},{id:uid(),type:"sectionTitle",text:"Procedure"},{id:uid(),type:"step",text:"Restore operation.",children:[]}]},
 "ctx-fault":{title:"Fault-isolation challenge",description:"Turn an unclear troubleshooting note into a structured diagnostic flow.",nodes:()=>[{id:uid(),type:"title",text:"Fault isolation – target display unavailable"},{id:uid(),type:"para",text:"The target display can fail for different reasons."},{id:uid(),type:"step",text:"Check the fault.",children:[{id:uid(),type:"cmd",text:"Record the displayed fault code."}]},{id:uid(),type:"note",text:"Add a managed reference to the corrective procedure."}]},
 "ctx-safety":{title:"Safety placement challenge",description:"Place safety information so it appears before the action it controls.",nodes:()=>[{id:uid(),type:"title",text:"Safety precautions"},{id:uid(),type:"para",text:"Disconnect power when necessary."},{id:uid(),type:"warning",text:"Electrical power can cause injury."}]},
 "ctx-system":{title:"System-description challenge",description:"Create descriptive information without turning it into a procedure.",nodes:()=>[{id:uid(),type:"title",text:"Radar Processing Unit overview"},{id:uid(),type:"sectionTitle",text:"Function"},{id:uid(),type:"para",text:"The Radar Processing Unit processes sensor data and distributes target information."}]},
 "ctx-operator":{title:"Operator guidance challenge",description:"Write concise operational guidance and separate it from maintenance information.",nodes:()=>[{id:uid(),type:"title",text:"Operate the target display"},{id:uid(),type:"sectionTitle",text:"Normal operation"},{id:uid(),type:"step",text:"Open the target display.",children:[{id:uid(),type:"cmd",text:"Select Radar > Target Display."}]}]},
 "ctx-software":{title:"Software reference challenge",description:"Use structured data for software versions, applicability and managed references.",nodes:()=>[{id:uid(),type:"title",text:"Software package reference"},{id:uid(),type:"para",text:"Approved software baseline data."},{id:uid(),type:"table",text:"",headerRow:true,rows:[["Package","Version"],["RPU","4.3.1"]]}]},
 "ctx-reference":{title:"Reference-data challenge",description:"Build compact reusable reference information instead of procedural prose.",nodes:()=>[{id:uid(),type:"title",text:"Applicable reference data"},{id:uid(),type:"table",text:"",headerRow:true,rows:[["Reference","Description"],["—","Add managed reference"]]}]}
});
function activeBrexProfile(){
  return brexProfiles[$("#ruleProfileInput")?.value || $("#brexProfileSelect")?.value || "saab_strict"] || brexProfiles.saab_strict;
}
const demoModel = {
  meta:{
    dmc:"23-31-01-110-801A-A", issue:"001", lang:"en", title:"Install a software update package",
    security:"UNCLASSIFIED", workflow:"In Work", author:"Technical Writer", responsible:"System Engineer", reviewer:"QA Reviewer"
  },
  applicability:{
    product:"Surface Sensor Software", variant:"Baseline 4.x", swFrom:"4.0.0", swTo:"4.9.x",
    serial:"All serials", expression:'product == "Surface Sensor Software" AND software >= "4.0.0"'
  },
  nodes:[
    {id:"n1",type:"title",text:"Install a software update package"},
    {id:"n2",type:"para",text:"This procedure gives instructions to install an approved software package on the radar processing unit."},
    {id:"n3",type:"warning",text:"Make sure that the radar system is in MAINTENANCE mode before you install the software package. Do not start the installation during an operational mission."},
    {id:"n4",type:"note",text:"Use only a software package that is approved for the applicable system baseline. Refer to 23-31-01-010-801A-A."},
    {id:"n5",type:"sectionTitle",text:"Preliminary requirements"},
    {id:"n6",type:"para",text:"Personnel: 1 maintenance technician"},
    {id:"n7",type:"para",text:"System condition: Radar system in MAINTENANCE mode"},
    {id:"n8",type:"para",text:"Tools: Maintenance laptop, approved Ethernet service cable"},
    {id:"n9",type:"sectionTitle",text:"Procedure"},
    {id:"n10",type:"step",text:"Connect the maintenance laptop to the service port.",children:[
      {id:"n10a",type:"cmd",text:"Connect the approved Ethernet service cable to connector J105."},
      {id:"n10b",type:"cmd",text:"Connect the other end of the cable to the maintenance laptop."}
    ]},
    {id:"n11",type:"step",text:"Open the radar maintenance application.",children:[
      {id:"n11a",type:"cmd",text:"Select Software > Package Management."}
    ]},
    {id:"n12",type:"step",text:"Verify the installed software baseline.",children:[
      {id:"n12a",type:"cmd",text:"Compare the installed version with the approved configuration record."}
    ]},
    {id:"n13",type:"table",rows:[
      ["Component","Current","Required","Status"],
      ["Radar Processing Service","4.2.7","4.3.1","Update required"],
      ["Display Interface","3.8.4","3.8.4","OK"],
      ["Network Profile","12","12","OK"]
    ]},
    {id:"n14",type:"step",text:"Import the approved software package.",children:[
      {id:"n14a",type:"cmd",text:"Select Import package."},
      {id:"n14b",type:"cmd",text:"Select the file RPU-4.3.1.pkg."},
      {id:"n14c",type:"cmd",text:"Make sure that the package signature status is Valid."}
    ]},
    {id:"n15",type:"codeblock",text:"$ rpu-maint package verify RPU-4.3.1.pkg\nPackage: RPU-4.3.1\nSignature: VALID\nBaseline: RPU-4.x\nApplicability: MATCH"},
    {id:"n16",type:"step",text:"Install the software package.",children:[
      {id:"n16a",type:"cmd",text:"Select Install."},
      {id:"n16b",type:"cmd",text:"Do not disconnect the service cable until the installation is complete."}
    ]},
    {id:"n17",type:"step",text:"Verify the installation.",children:[
      {id:"n17a",type:"cmd",text:"Make sure that the application shows Installation successful."},
      {id:"n17b",type:"cmd",text:"Record the installed software version in the configuration record."}
    ]},
    {id:"n18",type:"note",text:"If the installation fails, do not repeat the installation more than two times. Refer to 23-31-01-310-801A-A Fault isolation."}
  ]
};

const treeData=[
 {title:"Surface Sensor Software",type:"project",open:true,children:[
  {title:"Publication Module",type:"folder",open:true,status:"green",children:[
   {title:"00-00-00 — Front Matter",type:"doc",status:"green"},{title:"00-10-00 — System Description",type:"doc",status:"green"},
   {title:"00-20-00 — Operator Information",type:"doc",status:"yellow"},{title:"00-30-00 — Safety",type:"doc",status:"green"}]},
  {title:"Data Modules",type:"folder",open:true,children:[
   {title:"23-31-01 — Radar Processing Unit",type:"folder",open:true,children:[
    {title:"23-31-01-010-801A-A — Software description",type:"doc",status:"green"},
    {title:"23-31-01-110-801A-A — Install software update",type:"doc",status:"yellow",selected:true},
    {title:"23-31-01-210-801A-A — Verify software baseline",type:"doc",status:"orange"},
    {title:"23-31-01-310-801A-A — Fault isolation",type:"doc",status:"gray"}]},
   {title:"23-31-02 — Operator Display",type:"folder",status:"yellow"},{title:"23-31-03 — Network Interface",type:"folder",status:"green"},
   {title:"23-31-04 — Power Supply Unit",type:"folder",status:"green"}]},
  {title:"Fault Isolation",type:"folder",status:"orange"},{title:"Safety",type:"folder",status:"green"},
  {title:"Illustrations",type:"folder",status:"green"},{title:"Software Packages",type:"folder",status:"green"},
  {title:"References",type:"folder",status:"green"}]}];

const cloneDemo=()=>JSON.parse(JSON.stringify(demoModel));

const state={
  model:cloneDemo(), selectedId:"n1", dirty:false, issues:[], leftMode:"document",trainingExercise:null,rootSelected:false,undoStack:[],redoStack:[],historyLimit:50,tagMode:"partial",quickTagsEnabled:true,quickTagsIndex:0,quickTagsPopup:null,drillSession:null,selectedBasic:"tags",lastLearningAction:null,contextRulesOn:true,focusCycleIndex:0,zoomLevel:0,drillChapterIndex:0,drillIndex:0,drillProgress:null,scenarioIndex:0,scenarioProgress:null,scenarioAttempts:0,scenarioHintIndex:0,scenarioBaseline:null,scenarioActive:false,structClipboard:null,
  history:[
   {time:"16:03",user:"Technical Writer",text:"Demo document opened"},
   {time:"16:06",user:"Technical Writer",text:"Issue metadata reviewed"}
  ],
  projects:[],
  activeProjectId:null
};

function uid(){return "n"+Math.random().toString(36).slice(2,9)}
function toast(msg){
  const old=document.querySelector(".toast");if(old)old.remove();
  const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);
  setTimeout(()=>t.remove(),2200);
}



function starterNodesFor(kind, title){
  const t = title || "Untitled";
  if(kind==="frontmatter"){
    return [
      {id:"n1",type:"title",text:t},
      {id:"n2",type:"para",text:"This publication gives general information about the software documentation set."},
      {id:"n3",type:"sectionTitle",text:"Document scope"},
      {id:"n4",type:"para",text:"Describe what this publication covers and who it is for."},
      {id:"n5",type:"sectionTitle",text:"Revision summary"},
      {id:"n6",type:"table",rows:[["Section","Change"],["All","Initial issue"]]}
    ];
  }
  if(kind==="system"){
    return [
      {id:"n1",type:"title",text:t},
      {id:"n2",type:"para",text:"This module describes the software system and its main functions."},
      {id:"n3",type:"sectionTitle",text:"System overview"},
      {id:"n4",type:"para",text:"Summarize the software purpose, operating context, and major subsystems."},
      {id:"n5",type:"sectionTitle",text:"Main software components"},
      {id:"n6",type:"table",rows:[["Component","Function"],["Radar Processing Service","Processes radar data"],["Display Interface","Presents data to the operator"]]}
    ];
  }
  if(kind==="operator"){
    return [
      {id:"n1",type:"title",text:t},
      {id:"n2",type:"para",text:"This module gives operator-oriented guidance for the software."},
      {id:"n3",type:"sectionTitle",text:"Operator tasks"},
      {id:"n4",type:"para",text:"Describe the main operator tasks and relevant conditions."},
      {id:"n5",type:"note",text:"Keep operator guidance short, action-oriented, and easy to scan."}
    ];
  }
  if(kind==="safety"){
    return [
      {id:"n1",type:"title",text:t},
      {id:"n2",type:"warning",text:"Do not install or configure software during an operational mission unless approved by the applicable procedure."},
      {id:"n3",type:"note",text:"Use only approved software packages and approved maintenance equipment."},
      {id:"n4",type:"sectionTitle",text:"Safety precautions"},
      {id:"n5",type:"step",text:"Prepare the system for safe software maintenance.",children:[
        {id:"n5a",type:"cmd",text:"Set the system to MAINTENANCE mode."},
        {id:"n5b",type:"cmd",text:"Make sure that the applicable warning conditions are met."}
      ]}
    ];
  }
  if(kind==="fault"){
    return [
      {id:"n1",type:"title",text:t},
      {id:"n2",type:"para",text:"Use this module to isolate reported software or interface faults."},
      {id:"n3",type:"sectionTitle",text:"Fault isolation"},
      {id:"n4",type:"step",text:"Confirm the fault indication.",children:[
        {id:"n4a",type:"cmd",text:"Record the fault message or observed symptom."}
      ]},
      {id:"n5",type:"table",rows:[["Symptom","Possible cause","Action"],["Package validation fails","Wrong package or damaged file","Obtain the correct approved package"]]}
    ];
  }
  if(kind==="software"){
    return [
      {id:"n1",type:"title",text:t},
      {id:"n2",type:"para",text:"This module records software package reference data."},
      {id:"n3",type:"sectionTitle",text:"Package data"},
      {id:"n4",type:"table",rows:[["Item","Value"],["Package","RPU-4.3.1.pkg"],["Version","4.3.1"],["Checksum","Add checksum"],["Applicability","Baseline 4.x"]]},
      {id:"n5",type:"note",text:"Update package data when a new approved baseline is released."}
    ];
  }
  if(kind==="reference"){
    return [
      {id:"n1",type:"title",text:t},
      {id:"n2",type:"para",text:"This module lists documents and data used by the software publication set."},
      {id:"n3",type:"sectionTitle",text:"Applicable references"},
      {id:"n4",type:"table",rows:[["Reference","Title"],["23-31-01-010-801A-A","Software description"],["00-30-00-000-001A-A","Safety instructions"]]}
    ];
  }
  // default procedure
  return [
    {id:"n1",type:"title",text:t},
    {id:"n2",type:"para",text:"Add a short description."},
    {id:"n3",type:"sectionTitle",text:"Procedure"},
    {id:"n4",type:"step",text:"Add the first action.",children:[
      {id:"n4a",type:"cmd",text:"Add command."}
    ]}
  ];
}

function makeDocument({id="d1", title, dmc, group="dataModules", kind="procedure", workflow="In Work", issue="001", historyText="Document created"}){
  const model=cloneDemo();
  model.meta.title=title;
  model.meta.dmc=dmc;
  model.meta.workflow=workflow;
  model.meta.issue=issue;
  model.applicability={
    product:"",
    variant:"All",
    swFrom:"",
    swTo:"",
    serial:"All serials",
    expression:""
  };
  model.nodes=starterNodesFor(kind, title);
  return {
    id, title, dmc, group, kind, model,
    comments:[],
    history:[{
      time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
      user:"Technical Writer",
      text:historyText
    }]
  };
}

function createProjectObject(name="Surface Sensor Software", template="software"){
  const id="p"+Math.random().toString(36).slice(2,9);
  const project={
    id,
    name,
    description: template==="software" ? "Structured technical documentation project" : "New TechAuthor project",
    created:new Date().toISOString(),
    documents:[],
    activeDocumentId:null,
    illustrations:[]
  };

  // Startup demo is handled separately. New Project templates never clone the startup demo.
  if(template==="software"){
    project.documents = [
      makeDocument({id:"d1", title:"Front matter", dmc:"00-00-00-000-001A-A", group:"publication", kind:"frontmatter", historyText:"Document created from Front Matter template"}),
      makeDocument({id:"d2", title:"System description", dmc:"00-10-00-010-001A-A", group:"publication", kind:"system", historyText:"Document created from System Description template"}),
      makeDocument({id:"d3", title:"Operator information", dmc:"00-20-00-110-001A-A", group:"publication", kind:"operator", historyText:"Document created from Operator Information template"}),
      makeDocument({id:"d4", title:"Software maintenance procedure", dmc:"NEW-DM-001", group:"dataModules", kind:"procedure", historyText:"Document created from Procedure template"}),
      makeDocument({id:"d5", title:"Fault isolation", dmc:"23-31-01-310-801A-A", group:"faultIsolation", kind:"fault", historyText:"Document created from Fault Isolation template"}),
      makeDocument({id:"d6", title:"Safety instructions", dmc:"00-30-00-000-001A-A", group:"safety", kind:"safety", historyText:"Document created from Safety template"}),
      makeDocument({id:"d7", title:"Software package reference", dmc:"23-31-01-410-801A-A", group:"softwarePackages", kind:"software", historyText:"Document created from Software Package template"}),
      makeDocument({id:"d8", title:"Reference data", dmc:"23-31-01-510-801A-A", group:"references", kind:"reference", historyText:"Document created from Reference template"})
    ];
    project.activeDocumentId="d4";
    project.illustrations=[
      {name:"ICN-23-31-RPU-001 — Maintenance laptop connection", status:"green"},
      {name:"ICN-23-31-RPU-002 — Software update flow", status:"green"}
    ];
  }

  return project;
}


function createStartupDemoProject(){
  const p={
    id:"demo-project",
    name:"Surface Sensor Software — Demo",
    description:"Built-in TechAuthor demonstration project",
    created:new Date().toISOString(),
    documents:[],
    activeDocumentId:"d4",
    isDemo:true,
    illustrations:[
      {name:"ICN-23-31-RPU-001 — Maintenance laptop connection", status:"green"},
      {name:"ICN-23-31-RPU-002 — Software update flow", status:"green"}
    ]
  };
  p.documents=[
    makeDocument({id:"d1",title:"Front matter",dmc:"00-00-00-000-001A-A",group:"publication",kind:"frontmatter",workflow:"Approved",historyText:"Demo front matter created"}),
    makeDocument({id:"d2",title:"System description",dmc:"00-10-00-010-001A-A",group:"publication",kind:"system",workflow:"Approved",historyText:"Demo system description created"}),
    makeDocument({id:"d3",title:"Operator information",dmc:"00-20-00-110-001A-A",group:"publication",kind:"operator",workflow:"In Review",historyText:"Demo operator information created"}),
    {id:"d4",title:demoModel.meta.title,dmc:demoModel.meta.dmc,group:"dataModules",kind:"procedure",model:cloneDemo(),comments:[],history:[
      {time:"16:03",user:"Technical Writer",text:"Demo document opened"},
      {time:"16:06",user:"Technical Writer",text:"Issue metadata reviewed"}
    ]},
    makeDocument({id:"d5",title:"Fault isolation",dmc:"23-31-01-310-801A-A",group:"faultIsolation",kind:"fault",workflow:"In Work",historyText:"Demo fault isolation created"}),
    makeDocument({id:"d6",title:"Safety instructions",dmc:"00-30-00-000-001A-A",group:"safety",kind:"safety",workflow:"Approved",historyText:"Demo safety instructions created"}),
    makeDocument({id:"d7",title:"Software package reference",dmc:"23-31-01-410-801A-A",group:"softwarePackages",kind:"software",workflow:"Approved",historyText:"Demo software package reference created"}),
    makeDocument({id:"d8",title:"Reference data",dmc:"23-31-01-510-801A-A",group:"references",kind:"reference",workflow:"Approved",historyText:"Demo reference data created"})
  ];

  // Add realistic cross references so References / Where Used has something to show.
  const proc=p.documents.find(d=>d.id==="d4");
  proc.model.nodes.push({id:"xref1",type:"note",text:"For fault isolation, refer to 23-31-01-310-801A-A. For safety precautions, refer to 00-30-00-000-001A-A."});
  const fault=p.documents.find(d=>d.id==="d5");
  fault.model.nodes.push({id:"xref2",type:"para",text:"After corrective action, verify the software installation with 23-31-01-110-801A-A."});
  return p;
}
function ensureProjects(){
  if(state.projects.length)return;
  const p=createStartupDemoProject();
  state.projects=[p];
  state.activeProjectId=p.id;
}
function getActiveProject(){return state.projects.find(p=>p.id===state.activeProjectId)}
function getActiveDocument(){
  const p=getActiveProject(); if(!p)return null;
  if(!p.activeDocumentId)return null;
  return p.documents.find(d=>d.id===p.activeDocumentId)||null;
}
function persistCurrentDocument(){
  const d=getActiveDocument();
  if(!d || !state.model)return;
  d.model=JSON.parse(JSON.stringify(state.model));
  d.history=JSON.parse(JSON.stringify(state.history||[]));
  d.title=state.model.meta.title;
  d.dmc=state.model.meta.dmc;
}
function loadActiveDocument(){
  const p=getActiveProject();
  const d=getActiveDocument();

  renderProjectSelect();

  if(!p || !d){
    state.model=null;
    state.history=[];
    state.selectedId=null;
    state.issues=[];
    state.dirty=false;
    $("#dirtyMark").textContent="";
    $("#currentDocLabel").textContent="No document open";
    $("#docTabTitle").textContent="No document open";
    $("#docTabTitle").classList.add("no-doc-tab");
    $("#authorEditor").innerHTML="";
    $("#authorEditor").classList.add("hidden");
    $("#sourceEditor").classList.add("hidden");
    $("#previewPane").classList.add("hidden");
    $("#emptyState").classList.remove("hidden");
    $("#lineNumbers").innerHTML="";
    $("#contextPath").textContent="project";
    $("#elementHint").textContent="Create or import a document";
    renderValidation();
    renderTree();
    applyWorkflowLockUi();
    $("#cursorStatus").textContent="Project open — no document";
    return;
  }

  state.model=JSON.parse(JSON.stringify(d.model));
  state.history=JSON.parse(JSON.stringify(d.history||[]));
  state.selectedId=state.model.nodes[0]?.id||null;
  state.dirty=false;
  state.issues=[];
  $("#dirtyMark").textContent="";
  $("#docTabTitle").classList.remove("no-doc-tab");
  $("#emptyState").classList.add("hidden");
  $("#authorEditor").classList.remove("hidden");
  syncControlsFromModel();
  renderAuthor();
  renderValidation();
  syncTitles();
  renderTree();
  applyWorkflowLockUi();
}function renderProjectSelect(){}
function saveProjects(options={}){
  if(options.persistCurrent!==false) persistCurrentDocument();
  localStorage.setItem("techauthorProjectsV24",JSON.stringify({projects:state.projects,activeProjectId:state.activeProjectId}));
}
function loadProjects(){
  try{
    const raw=localStorage.getItem("techauthorProjectsV24");
    if(!raw)return false;
    const p=JSON.parse(raw);
    if(!Array.isArray(p.projects)||!p.projects.length)return false;
    state.projects=p.projects;state.activeProjectId=p.activeProjectId||p.projects[0].id;
    return true;
  }catch(e){return false}
}
function newProject(){
  showModal("New project",`
    <div class="project-dialog-grid">
      <label>Project name</label><input id="npName" value="New Technical Publication Project">
      <label>Template</label><select id="npTemplate">
        <option value="software">Software maintenance demo</option>
        <option value="blank">Blank project (no documents)</option>
      </select>
      <label>Description</label><input id="npDesc" value="Structured authoring project">
    </div>`,
    `<button class="btn" data-close>Cancel</button><button class="btn accent" id="createProjectConfirm">Create project</button>`);
  $("#createProjectConfirm").onclick=()=>{
    persistCurrentDocument();
    const p=createProjectObject($("#npName").value.trim()||"Untitled Project",$("#npTemplate").value);
    p.description=$("#npDesc").value.trim();
    // New Project behaves like a normal desktop authoring app:
    // the new project becomes the only open project in this sandbox session.
    state.projects=[p];
    state.activeProjectId=p.id;
    saveProjects({persistCurrent:false});
    loadActiveDocument();
    $("#modalBackdrop").classList.add("hidden");
    $("#cursorStatus").textContent=p.documents.length ? "Project created" : "Blank project created — no document open";
    toast(p.documents.length ? `Project created: ${p.name}` : `Blank project created: ${p.name}`);
  };
}
function showProjectMenu(){
  const p=getActiveProject();
  showModal("Project",`
    <div class="project-list">
      ${state.projects.map(pr=>`<div class="project-card ${pr.id===state.activeProjectId?"active":""}">
        <div><strong>${esc(pr.name)}</strong><div class="meta">${pr.documents.length} document(s) · ${esc(pr.description||"")}</div></div>
        <button class="btn" data-open-project="${pr.id}">${pr.id===state.activeProjectId?"Active":"Open"}</button>
      </div>`).join("")}
    </div>
    <hr>
    <div class="export-grid">
      <button class="export-option" id="renameProject"><strong>Project Properties</strong><span>Rename and edit description</span></button>
      <button class="export-option" id="newDocProject"><strong>New Document</strong><span>Add another structured document</span></button>
      <button class="export-option" id="exportProject"><strong>Export Project JSON</strong><span>All project documents and history</span></button>
      <button class="export-option" id="deleteProject"><strong>Close/Delete Project</strong><span>Remove project from browser storage</span></button>
    </div>`);
  $$("[data-open-project]").forEach(b=>b.onclick=()=>{
    if(b.dataset.openProject===state.activeProjectId)return;
    persistCurrentDocument();state.activeProjectId=b.dataset.openProject;saveProjects();loadActiveDocument();$("#modalBackdrop").classList.add("hidden");
  });
  $("#renameProject").onclick=()=>editProjectProperties();
  $("#newDocProject").onclick=()=>{ $("#modalBackdrop").classList.add("hidden"); newDocumentInProject(); };
  $("#exportProject").onclick=()=>exportWholeProject();
  $("#deleteProject").onclick=()=>deleteActiveProject();
}
function editProjectProperties(){
 const p=getActiveProject();
 showModal("Project Properties",`
 <div class="project-dialog-grid">
   <label>Name</label><input id="ppName" value="${esc(p.name)}">
   <label>Description</label><input id="ppDesc" value="${esc(p.description||"")}">
   <label>Documents</label><input value="${p.documents.length}" readonly>
 </div>`,
 `<button class="btn" data-close>Cancel</button><button class="btn accent" id="saveProjectProps">Save</button>`);
 $("#saveProjectProps").onclick=()=>{p.name=$("#ppName").value.trim()||p.name;p.description=$("#ppDesc").value.trim();saveProjects();renderProjectSelect();$("#modalBackdrop").classList.add("hidden")};
}

function newDocumentInProject(){
 const p=getActiveProject();
 if(!p){alert("No active project. Create or open a project first.");return;}
 showModal("New document",`
  <div class="project-dialog-grid">
    <label>Document type</label>
    <select id="ndType">
      <option value="procedure">Procedure</option>
      <option value="frontmatter">Front matter</option>
      <option value="system">System description</option>
      <option value="operator">Operator information</option>
      <option value="safety">Safety</option>
      <option value="fault">Fault isolation</option>
      <option value="software">Software package reference</option>
      <option value="reference">Reference data</option>
    </select>
    <label>DMC</label><input id="ndDmc" value="23-31-01-999-801A-A">
    <label>Title</label><input id="ndTitle" value="New procedure">
  </div>`,
  `<button class="btn" data-close>Cancel</button><button class="btn accent" id="createDocProject">Create document</button>`);

 const typeSelect=$("#ndType");
 const dmcInput=$("#ndDmc");
 const titleInput=$("#ndTitle");
 function applySuggestions(){
   const map={
     procedure:{title:"New procedure", dmc:"23-31-01-999-801A-A"},
     frontmatter:{title:"Front matter", dmc:"00-00-00-000-001A-A"},
     system:{title:"System description", dmc:"00-10-00-010-001A-A"},
     operator:{title:"Operator information", dmc:"00-20-00-110-001A-A"},
     safety:{title:"Safety instructions", dmc:"00-30-00-000-001A-A"},
     fault:{title:"Fault isolation", dmc:"23-31-01-310-801A-A"},
     software:{title:"Software package reference", dmc:"23-31-01-410-801A-A"},
     reference:{title:"Reference data", dmc:"23-31-01-510-801A-A"}
   };
   const s=map[typeSelect.value];
   if(s){ titleInput.value=s.title; dmcInput.value=s.dmc; }
 }
 typeSelect.addEventListener("change", applySuggestions);

 const createBtn=$("#createDocProject");
 if(!createBtn){alert("Could not open the New Document dialog.");return;}
 createBtn.addEventListener("click",()=>{
   try{
     persistCurrentDocument();

     const type=(typeSelect?.value||"procedure").trim();
     const title=(titleInput?.value||"New document").trim()||"New document";
     const dmc=(dmcInput?.value||"NEW-DM").trim()||"NEW-DM";
     const groupMap={
       procedure:"dataModules",
       frontmatter:"publication",
       system:"publication",
       operator:"publication",
       safety:"safety",
       fault:"faultIsolation",
       software:"softwarePackages",
       reference:"references"
     };
     const group=groupMap[type] || "dataModules";
     const id="d"+Math.random().toString(36).slice(2,8);
     const doc=makeDocument({
       id, title, dmc, group, kind:type,
       historyText:`Document created from ${type} template`
     });

     p.documents.push(doc);
     p.activeDocumentId=id;
     saveProjects({persistCurrent:false});
     loadActiveDocument();
     state.leftMode="document";
     $$(".left-pane .pane-tab").forEach(b=>b.classList.toggle("active",b.dataset.lefttab==="document"));
     renderTree();
     $("#modalBackdrop").classList.add("hidden");
     toast(`Created ${dmc} — ${title}`);
   }catch(err){
     console.error(err);
     alert("Could not create document: "+err.message);
   }
 });
}
function duplicateCurrentDocument(){
 const p=getActiveProject(),d=getActiveDocument();
 if(!p||!d){alert("No document is open to duplicate.");return;}
 persistCurrentDocument();
 const copy=JSON.parse(JSON.stringify(d));copy.id="d"+Math.random().toString(36).slice(2,8);copy.title=d.title+" — Copy";copy.model.meta.title=copy.title;copy.model.meta.dmc=d.dmc+"-COPY";
 copy.history=[hist("Document duplicated")];p.documents.push(copy);p.activeDocumentId=copy.id;saveProjects({persistCurrent:false});loadActiveDocument();
}


function validateImportedProjectObject(project){
 if(!project||typeof project!=="object")throw new Error("The JSON does not contain a project object.");
 if(!Array.isArray(project.documents))throw new Error("The project is missing a documents array.");
 if(!project.id)project.id="p"+Math.random().toString(36).slice(2,9);
 if(!project.name)project.name="Imported TechAuthor Project";
 project.documents.forEach((d,i)=>{
   if(!d||typeof d!=="object")throw new Error(`Document ${i+1} is invalid.`);
   if(!d.id)d.id="d"+Math.random().toString(36).slice(2,8);
   if(!d.model||!Array.isArray(d.model.nodes))throw new Error(`Document ${i+1} is missing a valid model.`);
   if(!Array.isArray(d.comments))d.comments=[];
   if(!Array.isArray(d.history))d.history=[];
 });
 if(project.documents.length&&!project.activeDocumentId)project.activeDocumentId=project.documents[0].id;
 if(project.activeDocumentId&&!project.documents.some(d=>d.id===project.activeDocumentId))
   project.activeDocumentId=project.documents[0]?.id||null;
 if(!Array.isArray(project.illustrations))project.illustrations=[];
 return project;
}
function validateImportedDocumentBackup(raw){
 if(!raw||typeof raw!=="object"||!raw.model||!Array.isArray(raw.model.nodes))
   throw new Error("The JSON is not a TechAuthor document backup.");
 return {
   model:JSON.parse(JSON.stringify(raw.model)),
   history:Array.isArray(raw.history)?JSON.parse(JSON.stringify(raw.history)):[],
   comments:Array.isArray(raw.comments)?JSON.parse(JSON.stringify(raw.comments)):[]
 };
}
function uniquifyImportedProject(project){
 const used=new Set(state.projects.map(p=>p.id));
 if(used.has(project.id))project.id="p"+Math.random().toString(36).slice(2,9);
 const seen=new Set();
 project.documents.forEach(d=>{
   if(seen.has(d.id))d.id="d"+Math.random().toString(36).slice(2,8);
   seen.add(d.id);
 });
 return project;
}
function restoreImportedProject(project,mode){
 persistCurrentDocument();
 project=validateImportedProjectObject(JSON.parse(JSON.stringify(project)));
 if(mode==="new"){
   project=uniquifyImportedProject(project);
   project.name=(project.name||"Imported TechAuthor Project")+" — Imported";
   state.projects.push(project);state.activeProjectId=project.id;
 }else{
   const idx=state.projects.findIndex(p=>p.id===state.activeProjectId);
   if(idx<0)throw new Error("No active project is available to replace.");
   project.id=state.projects[idx].id;
   state.projects[idx]=project;state.activeProjectId=project.id;
 }
 saveProjects({persistCurrent:false});
 loadActiveDocument();renderTree();
 toast(mode==="new"?"Imported project as new":"Replaced current project from backup");
}
function chooseProjectImportMode(project){
 const docCount=project.documents?.length||0;
 showModal("Import Project",`
  <p><strong>${esc(project.name||"Imported project")}</strong></p>
  <p>${docCount} document${docCount===1?"":"s"} found in the JSON backup.</p>
  <div class="learning-callout">Choose whether to keep your current project or restore this backup over it.</div>
  <div class="export-grid">
   <button class="export-option" id="importProjectNewBtn"><strong>Import as new project</strong><span>Keep the current project and add this backup separately</span></button>
   <button class="export-option" id="importProjectReplaceBtn"><strong>Replace current project</strong><span>Restore this backup over the current browser project</span></button>
  </div>`,
  `<button class="btn" data-close>Cancel</button>`);
 setTimeout(()=>{
  $("#importProjectNewBtn")?.addEventListener("click",()=>restoreImportedProject(project,"new"));
  $("#importProjectReplaceBtn")?.addEventListener("click",()=>{
   if(confirm("Replace the current project with the imported backup?"))restoreImportedProject(project,"replace");
  });
 },0);
}
function restoreImportedDocument(backup,mode){
 const p=getActiveProject();if(!p)throw new Error("No active project is open.");
 const model=JSON.parse(JSON.stringify(backup.model));
 const title=model.meta?.title||"Imported document";
 const dmc=model.meta?.dmc||"IMPORTED-DM";
 if(mode==="replace"){
   const d=getActiveDocument();if(!d)throw new Error("No active document is open.");
   d.model=model;
   d.title=title;
   d.dmc=dmc;
   d.history=JSON.parse(JSON.stringify(backup.history||[]));
   d.comments=JSON.parse(JSON.stringify(backup.comments||[]));
   state.model=JSON.parse(JSON.stringify(model));
   state.history=JSON.parse(JSON.stringify(d.history));
   state.selectedId=state.model.nodes[0]?.id||null;
 }else{
   let id="d"+Math.random().toString(36).slice(2,8);
   while(p.documents.some(d=>d.id===id))id="d"+Math.random().toString(36).slice(2,8);
   const d={id,title,dmc,group:"dataModules",kind:"procedure",model,comments:backup.comments||[],history:backup.history||[]};
   p.documents.push(d);p.activeDocumentId=id;
 }
 saveProjects({persistCurrent:false});
 loadActiveDocument();renderTree();
 $("#modalBackdrop")?.classList.add("hidden");
 toast(mode==="replace"?"Restored current document":"Imported document backup");
}
function chooseDocumentImportMode(backup){
 const title=backup.model?.meta?.title||"Imported document";
 const dmc=backup.model?.meta?.dmc||"";
 showModal("Import document backup",`
  <p><strong>${esc(title)}</strong>${dmc?`<br><span class="small-muted">${esc(dmc)}</span>`:""}</p>
  <div class="learning-callout">This JSON was created by <strong>Save As / Export → Project JSON</strong>. Despite the old label, it contains one document, not a whole project.</div>
  <div class="export-grid">
   <button class="export-option" id="importDocReplaceBtn"><strong>Replace current document</strong><span>Best for restoring work after an app update</span></button>
   <button class="export-option" id="importDocAddBtn"><strong>Add as new document</strong><span>Keep the current document and add this backup to the project</span></button>
  </div>`,
  `<button class="btn" data-close>Cancel</button>`);
 setTimeout(()=>{
  $("#importDocReplaceBtn")?.addEventListener("click",()=>{
   if(confirm("Replace the current document with this backup?"))restoreImportedDocument(backup,"replace");
  });
  $("#importDocAddBtn")?.addEventListener("click",()=>restoreImportedDocument(backup,"add"));
 },0);
}
function importProjectFromFile(){
 const input=$("#projectImportInput");
 if(!input)return alert("Import control is unavailable.");
 input.value="";input.click();
}
function handleProjectImportFile(file){
 if(!file)return;
 const reader=new FileReader();
 reader.onload=()=>{
  try{
   const raw=JSON.parse(String(reader.result||""));
   const candidate=(raw&&raw.project&&typeof raw.project==="object")?raw.project:raw;
   if(Array.isArray(candidate?.documents)){
     validateImportedProjectObject(candidate);
     chooseProjectImportMode(candidate);
     return;
   }
   if(candidate?.model&&Array.isArray(candidate.model.nodes)){
     chooseDocumentImportMode(validateImportedDocumentBackup(candidate));
     return;
   }
   throw new Error("The file is neither a project backup nor a document backup.");
  }catch(err){
   console.error(err);alert("Could not import backup: "+err.message);
  }
 };
 reader.onerror=()=>alert("Could not read the selected backup file.");
 reader.readAsText(file);
}

function exportWholeProject(){
 persistCurrentDocument();const p=getActiveProject();
 download((p.name||"TechAuthor_Project").replace(/[^\w-]+/g,"_")+".json",JSON.stringify(p,null,2),"application/json");
 $("#modalBackdrop").classList.add("hidden");
}
function deleteActiveProject(){
 if(state.projects.length===1)return alert("At least one project must remain. Create another project first.");
 const p=getActiveProject();if(!confirm(`Delete project "${p.name}" from this browser?`))return;
 state.projects=state.projects.filter(x=>x.id!==p.id);state.activeProjectId=state.projects[0].id;saveProjects();loadActiveDocument();$("#modalBackdrop").classList.add("hidden");
}
function showDocumentChooser(){
 const p=getActiveProject();if(!p)return;
 showModal("Open document",`<div class="project-list">${p.documents.map(d=>`<div class="project-card ${d.id===p.activeDocumentId?"active":""}">
 <div><strong>${esc(d.dmc)}</strong><div class="meta">${esc(d.title)}</div></div>
 <button class="btn" data-open-doc="${d.id}">${d.id===p.activeDocumentId?"Active":"Open"}</button></div>`).join("")}</div>`);
 $$("[data-open-doc]").forEach(b=>b.onclick=()=>{if(b.dataset.openDoc===p.activeDocumentId)return;persistCurrentDocument();p.activeDocumentId=b.dataset.openDoc;saveProjects();loadActiveDocument();$("#modalBackdrop").classList.add("hidden")});
}


function renderElementCoach(){
 const host=$("#elementCoachContent");if(!host)return;const r=getNodeById(state.selectedId),type=(state.rootSelected?"mainProcedure":r?.node?.type||"mainProcedure"),lesson=elementLessons[type],level=$("#learningLevelSelect")?.value||"beginner";
 if(!lesson){host.innerHTML=`<div class="learning-card"><h4>${esc(type)}</h4><p>No lesson yet.</p></div>`;return}
 const schemaAllowed=schema[type]||[],brexAllowed=validChildrenForSelected(),blocked=schemaAllowed.filter(x=>!brexAllowed.includes(x));
 host.innerHTML=`<div class="learning-card"><h4>&lt;${esc(type)}&gt;</h4><span class="learning-badge schema">Schema</span><span class="learning-badge brex">BREX</span><p>${esc(lesson.summary)}</p><p><strong>Role:</strong> ${esc(lesson.role)}</p><p><strong>Typical parent:</strong> ${esc((lesson.parents||[]).join(", ")||"—")}</p><p><strong>Schema children:</strong> ${esc(schemaAllowed.join(", ")||"None")}</p><p><strong>BREX permits:</strong> ${esc(brexAllowed.join(", ")||"None")}</p>${blocked.length?`<p><strong>Filtered by BREX:</strong> ${esc(blocked.join(", "))}</p>`:""}${level!=="assessment"?`<div class="learning-callout learning-hint"><strong>Good practice</strong><br>${esc(lesson.good)}</div>`:""}${level==="beginner"?`<div class="learning-callout learning-hint"><strong>Common mistake</strong><br>${esc(lesson.common)}</div>`:""}</div>`;
}
function showLearningView(name){
 const views=["beginnerDrillsView","arbortextBasicsView","structuredPracticeView","scenarioPracticeView","elementCoachView"];
 views.forEach(id=>$("#"+id)?.classList.add("hidden"));
 const buttons=["beginnerDrillsBtn","arbortextBasicsBtn","structuredPracticeBtn","scenarioPracticeBtn","elementCoachBtn"];
 buttons.forEach(id=>$("#"+id)?.classList.remove("active"));
 if(name==="beginner"){$("#beginnerDrillsView").classList.remove("hidden");$("#beginnerDrillsBtn").classList.add("active");}
 if(name==="arbortext"){$("#arbortextBasicsView").classList.remove("hidden");$("#arbortextBasicsBtn").classList.add("active");renderArbortextBasicDetail();}
 if(name==="structured"){$("#structuredPracticeView").classList.remove("hidden");$("#structuredPracticeBtn").classList.add("active");renderExerciseInfo();renderGuidedTask();}
 if(name==="scenario"){$("#scenarioPracticeView").classList.remove("hidden");$("#scenarioPracticeBtn").classList.add("active");if(typeof renderScenarioSelector==="function")renderScenarioSelector();}
 if(name==="element"){$("#elementCoachView").classList.remove("hidden");$("#elementCoachBtn").classList.add("active");renderElementCoach();}
}


function currentComments(){
  const d=getActiveDocument();
  if(!d)return [];
  d.comments=d.comments||[];
  return d.comments;
}
function renderComments(){
  const list=$("#commentList");
  if(!list)return;
  const comments=currentComments();
  list.innerHTML=comments.length?comments.map((c,i)=>`
    <div class="comment-item ${c.resolved?"resolved":""}">
      <div class="comment-meta">${esc(c.author||"Reviewer")} · ${esc(c.time||"")}</div>
      <div>${esc(c.text)}</div>
      <button class="btn" data-resolve-comment="${i}" style="margin-top:5px">${c.resolved?"Reopen":"Resolve"}</button>
    </div>`).join(""):`<div class="small-muted">No comments.</div>`;
  $$("[data-resolve-comment]").forEach(b=>b.onclick=()=>{
    const i=Number(b.dataset.resolveComment);comments[i].resolved=!comments[i].resolved;
    state.history.unshift(hist(`${comments[i].resolved?"Resolved":"Reopened"} review comment`));
    persistCurrentDocument();renderComments();markDirty();
  });
}
function addComment(){
  const text=($("#commentInput")?.value||"").trim();
  if(!text)return;
  const comments=currentComments();
  comments.push({
    author:state.model?.meta?.reviewer||"Reviewer",
    time:new Date().toLocaleString(),
    text,resolved:false
  });
  $("#commentInput").value="";
  state.history.unshift(hist("Added review comment"));
  state.lastLearningAction={kind:"comment"};
  state.drillEvidence=state.drillEvidence||{};
  state.drillEvidence.commentAdded=true;
  persistCurrentDocument();renderComments();markDirty();
}
function setWorkflowButtons(){
  const wf=state.model?.meta?.workflow;
  const hasDoc=!!state.model;
  const submit=$("#submitReviewBtn"),approve=$("#approveBtn"),ret=$("#returnBtn");
  if(submit)submit.disabled=!hasDoc||wf!=="In Work";
  if(approve)approve.disabled=!hasDoc||wf!=="In Review";
  if(ret)ret.disabled=!hasDoc||!(wf==="In Review"||wf==="Approved");
}
function findReferencesForActive(){
  const p=getActiveProject(),d=getActiveDocument();
  if(!p||!d||!state.model)return {outgoing:[],incoming:[]};
  const body=flattenText(state.model.nodes);
  const outgoing=[];
  (p.documents||[]).forEach(other=>{
    if(other.id!==d.id && body.includes(other.dmc)) outgoing.push(other);
  });
  const incoming=[];
  (p.documents||[]).forEach(other=>{
    if(other.id===d.id)return;
    const t=flattenText(other.model?.nodes||[]);
    if(t.includes(d.dmc))incoming.push(other);
  });
  return {outgoing,incoming};
}
function renderReferences(){
  const d=getActiveDocument(),summary=$("#refsSummary"),list=$("#refsList");
  if(!summary||!list)return;
  if(!d||!state.model){summary.textContent="No document open.";list.innerHTML="";return}
  const refs=findReferencesForActive();
  summary.textContent=`${refs.outgoing.length} outgoing · ${refs.incoming.length} incoming`;
  const block=(title,arr)=>`<div class="validation-item"><div class="kind">${title}</div>${
    arr.length?arr.map(x=>`<div class="ref-link" data-open-ref="${x.id}">${esc(x.dmc)} — ${esc(x.title)}</div>`).join(""):"<div>None</div>"
  }</div>`;
  list.innerHTML=block("Outgoing references",refs.outgoing)+block("Where used",refs.incoming);
  $$("[data-open-ref]").forEach(b=>b.onclick=()=>openDocumentById(b.dataset.openRef));
}
function openDocumentById(id){
 state.undoStack=[];state.redoStack=[];updateUndoRedoButtons();
 state.rootSelected=false;
 state.trainingExercise=null;
  const p=getActiveProject();if(!p)return;
  const d=p.documents.find(x=>x.id===id);if(!d)return;
  persistCurrentDocument();
  p.activeDocumentId=id;
  saveProjects({persistCurrent:false});
  loadActiveDocument();
  renderTree();
}
function openDocumentByDmc(dmc){
  const p=getActiveProject();if(!p)return false;
  const d=p.documents.find(x=>x.dmc===dmc);
  if(!d)return false;
  openDocumentById(d.id);return true;
}
function renderIllustrationAsset(name){
  $("#docTabTitle").textContent=name;
  $("#currentDocLabel").textContent="Illustration asset";
  $("#emptyState").classList.add("hidden");
  $("#sourceEditor").classList.add("hidden");
  $("#previewPane").classList.add("hidden");
  $("#authorEditor").classList.remove("hidden");
  $("#authorEditor").innerHTML=`<div class="asset-preview"><div class="asset-card"><strong>${esc(name)}</strong><div class="asset-placeholder">ICN / illustration preview</div><p class="small-muted">Demo asset placeholder. In a production tool this would show image metadata, revision, usage and links.</p></div></div>`;
  $("#cursorStatus").textContent="Illustration asset";
}

function showOpenFromCsdb(){
 const p=getActiveProject();
 showModal("Open from CSDB",`<div class="project-list">${
   (p?.documents||[]).map(d=>`<div class="project-card ${d.id===p.activeDocumentId?"active":""}">
     <div><strong>${esc(d.dmc)}</strong><div class="meta">${esc(d.title)} · ${esc(d.model?.meta?.workflow||"In Work")}</div></div>
     <button class="btn" data-open-csdb="${d.id}">${d.id===p.activeDocumentId?"Open":"Open"}</button>
   </div>`).join("")
 }</div>`);
 $$("[data-open-csdb]").forEach(b=>b.onclick=()=>{
   openDocumentById(b.dataset.openCsdb);
   $("#modalBackdrop").classList.add("hidden");
 });
}
function checkInCurrent(){
 if(!state.model)return;
 if(state.model.meta.workflow==="Approved")return alert("Approved documents are locked.");
 validate();
 if(state.issues.some(i=>i.type==="err"))return alert("Resolve validation errors before check-in.");
 persistCurrentDocument();
 state.history.unshift(hist("Checked in to CSDB"));
 state.dirty=false;$("#dirtyMark").textContent="";
 state.lastLearningAction={kind:"checkin"};
 state.drillEvidence=state.drillEvidence||{};
 state.drillEvidence.checkedIn=true;
 toast("DM checked in to CSDB");
 $("#cursorStatus").textContent="Checked in";
}
function backToCsdb(){
 showModal("CSDB integration",`<p>This sandbox simulates returning to the CSDB Manager.</p><p><strong>Current DM:</strong> ${esc(state.model?.meta?.dmc||"None")}</p><p>The separate CSDB app would own publication structure, lifecycle, where-used and project-level management.</p>`);
}

function showXrefDialog(){
 if(!state.model)return alert("No document open.");
 if(isLocked())return alert("Approved documents are locked.");
 state.lastLearningAction={kind:"xref"};
 state.drillEvidence=state.drillEvidence||{};
 state.drillEvidence.xrefOpened=true;
 const p=getActiveProject(),active=getActiveDocument();
 const docs=(p?.documents||[]).filter(d=>d.id!==active?.id);
 showModal("Insert cross-reference",`
   <div class="xref-browser">
     <div class="learning-callout"><strong>Managed reference</strong>Select a DM from the CSDB instead of typing a DMC manually. TechAuthor stores the link on the selected element.</div>
     <input id="xrefSearch" placeholder="Search DMC or title">
     <div id="xrefResults"></div>
   </div>`);
 const render=(q="")=>{
   const filtered=docs.filter(d=>(d.dmc+" "+d.title).toLowerCase().includes(q.toLowerCase()));
   $("#xrefResults").innerHTML=filtered.length?filtered.map(d=>`
     <div class="xref-result">
       <div><strong>${esc(d.dmc)}</strong><div class="meta">${esc(d.title)} · ${esc(d.model?.meta?.workflow||"In Work")}</div></div>
       <button class="btn accent" data-xref-doc="${d.id}">Insert</button>
     </div>`).join(""):`<div class="learning-card">No matching data modules.</div>`;
   $$("[data-xref-doc]").forEach(b=>b.onclick=()=>insertManagedXref(b.dataset.xrefDoc));
 };
 render();$("#xrefSearch").oninput=e=>render(e.target.value);
}
function insertManagedXref(docId){
 pushUndo("Insert cross-reference");
 const p=getActiveProject(),target=p?.documents.find(d=>d.id===docId),r=getNodeById(state.selectedId);
 if(!target||!r)return;
 // Put the managed reference on the selected element. Tables cannot carry inline refs in this demo.
 if(r.node.type==="table")return alert("Select a text, note, warning, step, or cmd element for the cross-reference.");
 r.node.xrefs=r.node.xrefs||[];
 if(r.node.xrefs.some(x=>x.dmc===target.dmc))return alert("This element already references that DM.");
 r.node.xrefs.push({dmc:target.dmc,title:target.title,docId:target.id});
 state.history.unshift(hist(`Inserted managed xref to ${target.dmc}`));
 markDirty();renderAuthor();renderReferences();syncSourcePassive();
 $("#modalBackdrop").classList.add("hidden");toast("Cross-reference inserted");
}

function showModifyAttributes(){
 if($("#cursorStatus"))$("#cursorStatus").textContent="Modify Attributes opened";
 state.drillEvidence=state.drillEvidence||{};
 state.drillEvidence.modifyAttributesOpened=true;
 // Ctrl+D sets lastLearningAction before this call; toolbar open does not count as the shortcut drill.
 if(state.lastLearningAction?.kind==="shortcut"&&state.lastLearningAction?.name==="modify-attributes"){
   state.drillEvidence.modifyAttributesViaShortcut=true;
   state.drillEvidence.shortcuts=state.drillEvidence.shortcuts||{};
   state.drillEvidence.shortcuts["modify-attributes"]=true;
 }
 if(!state.model)return alert("No document open.");
 if(isLocked())return alert("Approved documents are locked.");

 const s=currentSelectionContext();
 if(s.kind==="root"){
   showModal("Modify Attributes",`<div class="learning-card">Select an element first.</div>`);
   return;
 }

 const node=s.node;
 const defs=attributeSchemas[node.type]||[{name:"id",type:"text"}];
 const attrs=elementAttributes(node);

 const rows=defs.map(def=>{
   const cls=def.required?"attr-required":"";
   if(def.type==="select"){
     return `<div class="attr-row"><label class="${cls}">${esc(def.name)}</label>
       <select data-attr="${esc(def.name)}">${def.values.map(v=>`<option value="${esc(v)}" ${String(attrs[def.name]??"")===String(v)?"selected":""}>${esc(v||"(none)")}</option>`).join("")}</select></div>`;
   }
   return `<div class="attr-row"><label class="${cls}">${esc(def.name)}</label>
     <input data-attr="${esc(def.name)}" value="${esc(String(attrs[def.name]??""))}"></div>`;
 }).join("");

 const modal=$("#modal");
 const backdrop=$("#modalBackdrop");
 if(!modal||!backdrop)throw new Error("Modify Attributes dialog container is unavailable.");

 modal.innerHTML=`
   <div class="modal-head">Modify Attributes — &lt;${esc(node.type)}&gt;</div>
   <div class="modal-body">
     <div class="attr-dialog">
       <div class="learning-callout"><strong>Element attributes</strong>Only attributes valid for the selected element are shown.</div>
       ${rows}
       <div class="attr-help">Required attributes are marked with *.</div>
     </div>
   </div>
   <div class="modal-actions">
     <button type="button" class="btn" data-attr-cancel>Cancel</button>
     <button type="button" class="btn accent" data-attr-apply>Apply</button>
   </div>`;

 backdrop.dataset.menu="";
 backdrop.classList.remove("hidden");

 const cancel=modal.querySelector("[data-attr-cancel]");
 const apply=modal.querySelector("[data-attr-apply]");
 if(!cancel||!apply)throw new Error("Modify Attributes controls could not be created.");

 cancel.addEventListener("click",()=>{
   backdrop.classList.add("hidden");
 });

 apply.addEventListener("click",()=>{
   const next={...attrs};
   const missing=[];
   modal.querySelectorAll("[data-attr]").forEach(inp=>{
     next[inp.dataset.attr]=inp.value;
     const def=defs.find(x=>x.name===inp.dataset.attr);
     if(def?.required&&!String(inp.value).trim())missing.push(def.name);
   });

   if(missing.length){
     alert(`Required attribute(s) missing: ${missing.join(", ")}`);
     return;
   }

   pushUndo(`Modify <${node.type}> attributes`);
   node.attrs=next;
   if(next.id)node.xmlId=next.id;
   state.selectedId=node.id;
   state.lastLearningAction={kind:"attributes",type:node.type};
   state.drillEvidence=state.drillEvidence||{};
   state.drillEvidence.attributesApplied=true;
   // Keep modifyAttributesViaShortcut so Apply after Ctrl+D still passes the open-shortcut drill.

   markDirty();
   renderAuthor();
   renderTree();
   if(typeof renderDmcBreakdown==="function")renderDmcBreakdown();
   renderBrexPanel();
   renderElementCoach();
   syncSourcePassive();

   backdrop.classList.add("hidden");
   if($("#cursorStatus"))$("#cursorStatus").textContent=`Attributes updated on <${node.type}>`;
   toast("Attributes updated");
 });
}
function showTableEditor(){
 if(!state.model)return alert("No document open.");
 if(isLocked())return alert("Approved documents are locked.");
 state.lastLearningAction={kind:"table"};
 state.drillEvidence=state.drillEvidence||{};
 state.drillEvidence.tableOpened=true;
 let r=getNodeById(state.selectedId);
 if(!r||r.node.type!=="table"){
   const context=r?.node?.type||"mainProcedure";
   if(!validChildrenForContext(context).includes("table"))
     return alert("Select an existing <table>, or select a context where the schema/BREX permits a table.");
   insertElement("table");r=getNodeById(state.selectedId);
 }
 const node=r.node;
 let rows=(node.rows||[["Item","Value"],["Example","Value"]]).map(row=>[...row]);
 let header=node.headerRow!==false;
 const normalize=()=>{
   const cols=Math.max(1,...rows.map(r=>r.length));
   rows=rows.map(r=>Array.from({length:cols},(_,i)=>r[i]??""));
 };
 const draw=()=>{
   normalize();
   $("#tableEditorBody").innerHTML=`<table>${rows.map((row,ri)=>`<tr>${row.map((cell,ci)=>`<td><input data-r="${ri}" data-c="${ci}" value="${esc(String(cell))}"></td>`).join("")}</tr>`).join("")}</table>`;
   $$("[data-r]").forEach(inp=>inp.oninput=()=>{rows[+inp.dataset.r][+inp.dataset.c]=inp.value});
   $("#tableHeaderToggle").checked=header;
 };
 showModal("Table editor",`
   <div class="table-editor">
     <div class="learning-callout"><strong>Structured table</strong>Rows and columns are edited as table structure, not with spaces or tabs.</div>
     <div class="table-editor-toolbar">
       <button class="btn" id="addTableRow">+ Row</button>
       <button class="btn" id="removeTableRow">− Row</button>
       <button class="btn" id="addTableCol">+ Column</button>
       <button class="btn" id="removeTableCol">− Column</button>
     </div>
     <label class="table-editor-options"><input type="checkbox" id="tableHeaderToggle"> First row is header</label>
     <div id="tableEditorBody" class="table-editor-grid"></div>
   </div>`,
   `<button class="btn" data-close>Cancel</button><button class="btn accent" id="saveTableEditor">Apply table</button>`);
 draw();
 $("#addTableRow").onclick=()=>{normalize();rows.push(Array(rows[0]?.length||2).fill(""));draw()};
 $("#removeTableRow").onclick=()=>{if(rows.length>1){rows.pop();draw()}};
 $("#addTableCol").onclick=()=>{rows.forEach(r=>r.push(""));draw()};
 $("#removeTableCol").onclick=()=>{if((rows[0]?.length||0)>1){rows.forEach(r=>r.pop());draw()}};
 $("#tableHeaderToggle").onchange=e=>header=e.target.checked;
 $("#saveTableEditor").onclick=()=>{
   pushUndo("Edit table");
   node.rows=rows;node.headerRow=header;state.history.unshift(hist("Edited structured table"));
   markDirty();renderAuthor();syncSourcePassive();$("#modalBackdrop").classList.add("hidden");toast("Table updated");
 };
}

function showFindReplace(initialTab="text"){
  if(!state.model)return alert("No document open.");
  state.lastLearningAction={kind:"findreplace"};
  state.drillEvidence=state.drillEvidence||{};
  state.drillEvidence.findOpened=true;
  state.drillEvidence.findTab=initialTab;

  const tabs=[
    ["text","Find/Replace"],
    ["tag","Find Tag/Attribute"],
    ["entity","Find Entity"],
    ["pi","Find Processing Instruction"]
  ];

  const body=`
    <div class="arb-find-dialog">
      <div class="arb-find-tabs" role="tablist">
        ${tabs.map(([id,label])=>`<button type="button" class="arb-find-tab ${id===initialTab?"active":""}" data-find-tab="${id}">${label}</button>`).join("")}
      </div>

      <div class="arb-find-panel ${initialTab==="text"?"active":""}" data-find-panel="text">
        <div class="arb-find-grid">
          <label>Find What</label><input id="findText" value="${esc(state.lastFindText?.query||"")}">
          <label>Replace With</label><input id="replaceText" value="${esc(state.lastFindText?.replace||"")}">
        </div>
        <fieldset class="arb-find-group"><legend>Value Search Options</legend>
          <label><input type="checkbox" id="findMatchMarkup"> Match Markup</label>
          <label><input type="checkbox" id="findMatchCase"> Match Case</label>
          <label><input type="checkbox" id="findMatchPatterns"> Match Patterns</label>
        </fieldset>
        ${findDirectionHtml("text")}
      </div>

      <div class="arb-find-panel ${initialTab==="tag"?"active":""}" data-find-panel="tag">
        <div class="arb-find-grid">
          <label>Tag Name</label><input id="findTagName" value="${esc(state.lastFindTag?.tag||"")}" placeholder="step or <step>">
          <label>Attribute Name</label><input id="findAttrName" value="${esc(state.lastFindTag?.attr||"")}" placeholder="applicRefId">
          <label>Attribute Value</label><input id="findAttrValue" value="${esc(state.lastFindTag?.value||"")}" placeholder="APP-01">
        </div>
        <fieldset class="arb-find-group"><legend>Value Search Options</legend>
          <label><input type="checkbox" id="tagExactMatch" checked> Exact Match</label>
          <label><input type="checkbox" id="tagMatchCase"> Match Case</label>
          <label><input type="checkbox" id="tagMatchPatterns"> Match Patterns</label>
        </fieldset>
        ${findDirectionHtml("tag")}
      </div>

      <div class="arb-find-panel ${initialTab==="entity"?"active":""}" data-find-panel="entity">
        <div class="arb-find-grid">
          <label>Name</label><input id="findEntityName" placeholder="entity name">
        </div>
        <fieldset class="arb-find-group"><legend>Entity Types</legend>
          <label><input type="checkbox" id="entityText" checked> Text</label>
          <label><input type="checkbox" id="entityFile" checked> File</label>
          <label><input type="checkbox" id="entityGraphic"> Graphic</label>
        </fieldset>
        ${findDirectionHtml("entity")}
        <p class="menu-note">This training document does not currently contain declared SGML/XML entities. The tab is included to mirror Arbortext's Find/Replace dialog.</p>
      </div>

      <div class="arb-find-panel ${initialTab==="pi"?"active":""}" data-find-panel="pi">
        <div class="arb-find-grid">
          <label>PI Type</label>
          <select id="findPiType">
            <option value="">(any)</option>
            <option>Bookmark</option>
            <option>Generic PI</option>
            <option>Font</option>
            <option>Specified Horizontal Space</option>
          </select>
          <label>Field Name</label><input id="findPiFieldName">
          <label>Field Value</label><input id="findPiFieldValue">
        </div>
        <fieldset class="arb-find-group"><legend>Value Search Options</legend>
          <label><input type="checkbox" id="piExactMatch" checked> Exact Match</label>
          <label><input type="checkbox" id="piMatchCase"> Match Case</label>
          <label><input type="checkbox" id="piMatchPatterns"> Match Patterns</label>
        </fieldset>
        ${findDirectionHtml("pi")}
        <p class="menu-note">No processing instructions are present in the current training model.</p>
      </div>
    </div>`;

  showModal("Find/Replace",body,`
    <button class="btn" data-close>Close</button>
    <button class="btn" id="findNextBtn">Find Next</button>
    <button class="btn" id="replaceBtn">Replace</button>
    <button class="btn accent" id="replaceAllBtn">Replace All</button>`);

  const setTab=(tab)=>{
    $$(".arb-find-tab").forEach(b=>b.classList.toggle("active",b.dataset.findTab===tab));
    $$(".arb-find-panel").forEach(p=>p.classList.toggle("active",p.dataset.findPanel===tab));
    state.findDialogTab=tab;
    state.drillEvidence=state.drillEvidence||{};
    state.drillEvidence.findTab=tab;
    const replaceMode=tab==="text";
    $("#replaceBtn").disabled=!replaceMode;
    $("#replaceAllBtn").disabled=!replaceMode;
    setTimeout(()=>{
      const target=tab==="text"?$("#findText"):tab==="tag"?$("#findTagName"):tab==="entity"?$("#findEntityName"):$("#findPiType");
      target?.focus();
    },0);
  };

  $$(".arb-find-tab").forEach(b=>b.onclick=()=>setTab(b.dataset.findTab));
  setTab(initialTab);

  $("#findNextBtn").onclick=()=>runFindNextFromDialog();
  $("#replaceBtn").onclick=()=>replaceCurrentFind();
  $("#replaceAllBtn").onclick=()=>replaceAllTextFind();

  ["findText","replaceText","findTagName","findAttrName","findAttrValue"].forEach(id=>{
    $("#"+id)?.addEventListener("keydown",e=>{
      if(e.key==="Enter"){e.preventDefault();runFindNextFromDialog()}
    });
  });
}

function findDirectionHtml(prefix){
 return `<fieldset class="arb-find-group arb-direction"><legend>Direction</legend>
   <label><input type="radio" name="${prefix}Direction" value="up"> Up</label>
   <label><input type="radio" name="${prefix}Direction" value="down" checked> Down</label>
   <label class="arb-find-file-entities"><input type="checkbox" id="${prefix}SearchFileEntities"> Search File Entities</label>
 </fieldset>`;
}

function dialogDirection(prefix){
 return document.querySelector(`input[name="${prefix}Direction"]:checked`)?.value||"down";
}

function runFindNextFromDialog(){
 const tab=state.findDialogTab||"text";
 if(tab==="text"){
   const q=($("#findText")?.value||"").trim();
   if(!q)return;
   const options={
     matchCase:!!$("#findMatchCase")?.checked,
     matchPatterns:!!$("#findMatchPatterns")?.checked,
     matchMarkup:!!$("#findMatchMarkup")?.checked,
     direction:dialogDirection("text")
   };
   const hit=findTextNode(q,options);
   state.lastFindText={query:q,replace:$("#replaceText")?.value||"",...options};
   if(!hit)return alert("Text not found.");
   selectFindHit(hit,"text");
   state.lastLearningAction={kind:"find-text",query:q};
   state.drillEvidence=state.drillEvidence||{};
   state.drillEvidence.findTextHit=true;
   return;
 }
 if(tab==="tag"){
   const tag=$("#findTagName")?.value.trim()||"";
   const attr=$("#findAttrName")?.value.trim()||"";
   const value=$("#findAttrValue")?.value.trim()||"";
   return findTagAttribute(tag,attr,value,{
     exact:!!$("#tagExactMatch")?.checked,
     matchCase:!!$("#tagMatchCase")?.checked,
     patterns:!!$("#tagMatchPatterns")?.checked,
     direction:dialogDirection("tag")
   });
 }
 if(tab==="entity"){
   state.lastLearningAction={kind:"find-entity"};
   state.drillEvidence=state.drillEvidence||{};
   state.drillEvidence.findEntityTried=true;
   return alert("No matching entity found in this training document.");
 }
 state.lastLearningAction={kind:"find-pi"};
 state.drillEvidence=state.drillEvidence||{};
 state.drillEvidence.findPiTried=true;
 alert("No matching processing instruction found in this training document.");
}

function flattenSearchNodes(nodes=state.model?.nodes||[],out=[]){
 for(const n of nodes){
   out.push(n);
   if(n.children)flattenSearchNodes(n.children,out);
 }
 return out;
}

function orderedSearchNodes(direction="down"){
 const flat=flattenSearchNodes();
 if(!flat.length)return [];
 const idx=Math.max(-1,flat.findIndex(n=>n.id===state.selectedId));
 if(direction==="up"){
   const before=flat.slice(0,idx).reverse();
   const after=flat.slice(idx+1).reverse();
   return [...before,...after];
 }
 return [...flat.slice(idx+1),...flat.slice(0,Math.max(0,idx+1))];
}

function textMatches(haystack,needle,{matchCase=false,matchPatterns=false}={}){
 const h=String(haystack??""),n=String(needle??"");
 if(matchPatterns){
   try{return new RegExp(n,matchCase?"":"i").test(h)}catch(e){return false}
 }
 return matchCase?h.includes(n):h.toLowerCase().includes(n.toLowerCase());
}

function nodeSearchText(n,matchMarkup=false){
 let text=n.text||"";
 if(n.rows)text+=" "+n.rows.flat().join(" ");
 if(matchMarkup){
   const attrs=n.attrs?Object.entries(n.attrs).map(([k,v])=>` ${k}="${v}"`).join(""):"";
   text=`<${n.type}${attrs}> ${text} </${n.type}>`;
 }
 return text;
}

function findTextNode(q,options={}){
 return orderedSearchNodes(options.direction).find(n=>textMatches(nodeSearchText(n,options.matchMarkup),q,options))||null;
}

function selectFindHit(node,kind="text"){
 state.selectedId=node.id;state.rootSelected=false;
 renderAuthor();renderTree();revealSelectedInEditor();
 const el=$(`.xml-node[data-id="${CSS.escape(node.id)}"] .node-content`)||$(`.xml-node[data-id="${CSS.escape(node.id)}"]`);
 if(el){el.classList.add("find-hit");setTimeout(()=>el.classList.remove("find-hit"),1800)}
 if($("#cursorStatus"))$("#cursorStatus").textContent=kind==="tag"?`Found <${node.type}>`:`Find hit in <${node.type}>`;
}

function replaceCurrentFind(){
 const q=($("#findText")?.value||"").trim(),r=$("#replaceText")?.value||"";
 if(!q)return;
 const options={
   matchCase:!!$("#findMatchCase")?.checked,
   matchPatterns:!!$("#findMatchPatterns")?.checked,
   matchMarkup:!!$("#findMatchMarkup")?.checked,
   direction:dialogDirection("text")
 };
 const node=findTextNode(q,options);
 if(!node)return alert("Text not found.");
 if(options.matchMarkup)return alert("Trainer note: replacing markup is not implemented. Use Find Tag/Attribute or Change Markup.");
 if(typeof node.text!=="string")return;
 pushUndo("Find/Replace");
 if(options.matchPatterns){
   try{node.text=node.text.replace(new RegExp(q,options.matchCase?"":"i"),r)}catch(e){return alert("Invalid pattern.")}
 }else if(options.matchCase){
   node.text=node.text.replace(q,r);
 }else{
   const i=node.text.toLowerCase().indexOf(q.toLowerCase());
   if(i>=0)node.text=node.text.slice(0,i)+r+node.text.slice(i+q.length);
 }
 markDirty();renderAuthor();renderTree();syncSourcePassive();
 state.lastFindText={query:q,replace:r,...options};
 state.lastLearningAction={kind:"replace-text"};
 selectFindHit(node,"text");
}

function replaceAllTextFind(){
 const q=$("#findText")?.value||"",r=$("#replaceText")?.value||"";
 if(!q)return;
 const matchCase=!!$("#findMatchCase")?.checked;
 const patterns=!!$("#findMatchPatterns")?.checked;
 const matchMarkup=!!$("#findMatchMarkup")?.checked;
 if(matchMarkup)return alert("Trainer note: Replace All with Match Markup is not implemented.");
 let count=0;
 pushUndo("Replace All");
 const replaceValue=(value)=>{
   if(typeof value!=="string")return value;
   if(patterns){
     try{
       const re=new RegExp(q,matchCase?"g":"gi");
       const next=value.replace(re,()=>{count++;return r});
       return next;
     }catch(e){return value}
   }
   if(matchCase){
     const parts=value.split(q);if(parts.length>1)count+=parts.length-1;return parts.join(r);
   }
   const re=new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi");
   return value.replace(re,()=>{count++;return r});
 };
 const walk=(nodes)=>{
   (nodes||[]).forEach(n=>{
     if(typeof n.text==="string")n.text=replaceValue(n.text);
     if(n.rows)n.rows=n.rows.map(row=>row.map(replaceValue));
     if(n.children)walk(n.children);
   });
 };
 walk(state.model.nodes);
 renderAuthor();renderTree();markDirty();syncSourcePassive();
 state.history.unshift(hist(`Replace all: ${q} → ${r}`));
 state.lastFindText={query:q,replace:r,matchCase,matchPatterns:patterns,matchMarkup:false,direction:dialogDirection("text")};
 state.lastLearningAction={kind:"replace-all"};
 toast(`Replaced ${count} occurrence(s)`);
}

function normalizeTagQuery(tag){
 let t=String(tag||"").trim();
 t=t.replace(/^<\/?/,"").replace(/>$/,"").trim();
 return t;
}

function findTagAttribute(tag,attr,value,options={}){
 const wantedTag=normalizeTagQuery(tag);
 const exact=options.exact!==false,matchCase=!!options.matchCase,patterns=!!options.patterns;
 const cmp=(actual,wanted)=>{
   const a=String(actual??""),w=String(wanted??"");
   if(!w)return true;
   if(patterns){try{return new RegExp(w,matchCase?"":"i").test(a)}catch(e){return false}}
   if(exact)return matchCase?a===w:a.toLowerCase()===w.toLowerCase();
   return matchCase?a.includes(w):a.toLowerCase().includes(w.toLowerCase());
 };
 const ordered=orderedSearchNodes(options.direction||"down");
 const hit=ordered.find(n=>{
   if(wantedTag&&!cmp(n.type,wantedTag))return false;
   if(!attr)return true;
   const attrs={...(n.attrs||{})};
   if(n.xmlId&&!attrs.id)attrs.id=n.xmlId;
   if(!(attr in attrs))return false;
   return !value||cmp(attrs[attr],value);
 });
 if(!hit)return alert("No matching tag/attribute found.");
 selectFindHit(hit,"tag");
 state.lastFindTag={tag:wantedTag,attr,value,...options};
 state.lastLearningAction={kind:"find-tag"};
 state.drillEvidence=state.drillEvidence||{};
 state.drillEvidence.findTagHit=true;
 state.drillEvidence.findTagName=hit.type;
 state.drillEvidence.findTab="tag";
 return hit;
}

function showFindTagAttribute(){showFindReplace("tag")}
function showFindEntity(){showFindReplace("entity")}
function showFindProcessingInstruction(){showFindReplace("pi")}

function findAgain(){
 if(state.lastFindTag)return findTagAttribute(state.lastFindTag.tag,state.lastFindTag.attr,state.lastFindTag.value,state.lastFindTag);
 if(state.lastFindText){
   const hit=findTextNode(state.lastFindText.query,state.lastFindText);
   if(hit){selectFindHit(hit,"text");return}
   return alert("Text not found.");
 }
 toast("Nothing to find again");
}

function findFirstNodeContaining(q){
  let found=null;
  function walk(nodes){
    for(const n of nodes||[]){
      if((n.text||"").toLowerCase().includes(q.toLowerCase())){found=n;return}
      if(n.children){walk(n.children);if(found)return}
    }
  }
  walk(state.model.nodes);return found;
}
function applyWorkflowLockUi(){
  setWorkflowButtons();
  renderComments();
  renderReferences();
}
function renderTree(){
 const holder=$("#contentTree");
 if(!holder)return;
 const q=($("#treeSearch")?.value||"").trim().toLowerCase();
 holder.innerHTML="";
 if(state.leftMode==="resources") renderResources(holder,q);
 else renderDocumentMap(holder,q);
}
function renderProjectTree(holder,q){
 const p=getActiveProject();
 if(!p){holder.innerHTML='<div class="tree-section-label">No active project</div>';return}

 function statusForDoc(d){
   const wf=d.model?.meta?.workflow||"In Work";
   return wf==="Approved" ? "green" : wf==="In Review" ? "orange" : "yellow";
 }
 function addDocRow(parent, d, indent){
   const searchable=(d.dmc+" "+d.title).toLowerCase();
   if(q && !searchable.includes(q)) return;
   const row=document.createElement("div");
   row.className="tree-row document-row"+(d.id===p.activeDocumentId?" active-doc":"");
   row.style.paddingLeft=`${indent}px`;
   row.innerHTML=`<span class="tree-caret"></span><span class="tree-icon">▤</span><span class="tree-title">${esc(d.dmc)} — ${esc(d.title)}</span><span class="tree-status dot ${statusForDoc(d)}"></span>`;
   row.onclick=()=>{
     if(d.id===p.activeDocumentId)return;
     persistCurrentDocument();
     p.activeDocumentId=d.id;
     saveProjects({persistCurrent:false});
     loadActiveDocument();
     renderTree();
   };
   parent.appendChild(row);
 }
 function addGroup(title, groupKey, indent, emptyLabel="No items"){
   const docs=(p.documents||[]).filter(d=>d.group===groupKey);
   const hasMatches=docs.some(d=>((d.dmc+" "+d.title).toLowerCase().includes(q))) || !q;
   if(q && !title.toLowerCase().includes(q) && !hasMatches) return;

   const group=document.createElement("div");
   group.className="tree-node";
   const grow=document.createElement("div");
   grow.className="tree-row group-row";
   grow.style.paddingLeft=`${indent}px`;
   grow.innerHTML=`<span class="tree-caret">▾</span><span class="tree-icon">▣</span><span class="tree-title">${title}</span></span>`;
   group.appendChild(grow);

   if(!docs.length){
     const empty=document.createElement("div");
     empty.className="tree-row asset-row";
     empty.style.paddingLeft=`${indent+18}px`;
     empty.innerHTML=`<span class="tree-caret"></span><span class="tree-icon">·</span><span class="tree-title" style="font-style:italic">${emptyLabel}</span>`;
     group.appendChild(empty);
   } else {
     docs.forEach(d=>addDocRow(group,d,indent+18));
   }
   holder.appendChild(group);
 }

 const root=document.createElement("div");
 root.className="tree-node";
 const prow=document.createElement("div");
 prow.className="tree-row selected";
 prow.innerHTML=`<span class="tree-caret">▾</span><span class="tree-icon">▣</span><span class="tree-title">${esc(p.name)}</span>`;
 root.appendChild(prow);
 holder.appendChild(root);

 addGroup("Publication Module", "publication", 20, "No publication documents");
 addGroup("Data Modules", "dataModules", 20, "No data modules");
 addGroup("Fault Isolation", "faultIsolation", 20, "No fault-isolation document");
 addGroup("Safety", "safety", 20, "No safety document");

 // Illustrations as starter assets
 if((p.illustrations && p.illustrations.length) || !q || "illustrations".includes(q)){
   const grp=document.createElement("div");
   grp.className="tree-node";
   const row=document.createElement("div");
   row.className="tree-row group-row";
   row.style.paddingLeft="20px";
   row.innerHTML=`<span class="tree-caret">▾</span><span class="tree-icon">▣</span><span class="tree-title">Illustrations</span>`;
   grp.appendChild(row);
   if(p.illustrations?.length){
     p.illustrations.forEach(it=>{
       if(q && !("illustrations " + it.name).toLowerCase().includes(q)) return;
       const r=document.createElement("div");
       r.className="tree-row asset-row";
       r.style.paddingLeft="38px";
       r.innerHTML=`<span class="tree-caret"></span><span class="tree-icon">🖼</span><span class="tree-title">${esc(it.name)}</span><span class="tree-status dot ${it.status||"green"}"></span>`;
       r.onclick=()=>renderIllustrationAsset(it.name);
       grp.appendChild(r);
     });
   }else{
     const r=document.createElement("div");
     r.className="tree-row asset-row";
     r.style.paddingLeft="38px";
     r.innerHTML=`<span class="tree-caret"></span><span class="tree-icon">·</span><span class="tree-title" style="font-style:italic">No illustrations</span>`;
     grp.appendChild(r);
   }
   holder.appendChild(grp);
 }

 addGroup("Software Packages", "softwarePackages", 20, "No software-package document");
 addGroup("References", "references", 20, "No reference document");
}

function renderResources(holder,q){
 const groups=[
   {title:"Cross-references",items:[
     {name:"23-31-01-310-801A-A — Fault isolation",meta:"Data module · Approved",action:()=>openDocumentByDmc("23-31-01-310-801A-A")},
     {name:"00-30-00-000-001A-A — Safety instructions",meta:"Data module · Approved",action:()=>openDocumentByDmc("00-30-00-000-001A-A")}
   ]},
   {title:"Illustrations",items:[
     {name:"ICN-23-31-RPU-001 — Maintenance laptop connection",meta:"Illustration · Approved",action:()=>renderIllustrationAsset("ICN-23-31-RPU-001 — Maintenance laptop connection")},
     {name:"ICN-23-31-RPU-002 — Software update flow",meta:"Illustration · Approved",action:()=>renderIllustrationAsset("ICN-23-31-RPU-002 — Software update flow")}
   ]},
   {title:"Reusable content",items:[
     {name:"Approved software-installation warning",meta:"Common content · Safety",action:()=>insertReusableContent("warning")},
     {name:"Maintenance-mode prerequisite",meta:"Common content · Requirement",action:()=>insertReusableContent("prereq")}
   ]},
   {title:"Software assets",items:[
     {name:"RPU-4.3.1.pkg",meta:"Approved package · Baseline 4.x",action:()=>showResourceInfo("Software package","RPU-4.3.1.pkg","Signature: VALID · Applicability: Baseline 4.x")}
   ]}
 ];
 groups.forEach(g=>{
   const filtered=g.items.filter(it=>!q||(g.title+" "+it.name+" "+it.meta).toLowerCase().includes(q));
   if(!filtered.length)return;
   const wrap=document.createElement("div");wrap.className="resource-group";
   const h=document.createElement("div");h.className="resource-head";h.textContent=g.title;wrap.appendChild(h);
   filtered.forEach(it=>{
     const row=document.createElement("div");row.className="resource-item";
     row.innerHTML=`${esc(it.name)}<span class="meta">${esc(it.meta)}</span>`;
     row.onclick=it.action;wrap.appendChild(row);
   });
   holder.appendChild(wrap);
 });
}
function insertReusableContent(kind){
 if(!state.model||isLocked())return;
 pushUndo("Insert reusable content");
 if(kind==="warning"){
   state.model.nodes.splice(2,0,{id:uid(),type:"warning",text:"Make sure that the system is in MAINTENANCE mode before you start this procedure."});
   state.history.unshift(hist("Inserted reusable warning from CSDB"));
 }else{
   state.model.nodes.splice(2,0,{id:uid(),type:"para",text:"System condition: Radar system in MAINTENANCE mode"});
   state.history.unshift(hist("Inserted reusable prerequisite from CSDB"));
 }
 renderAuthor();renderTree();markDirty();toast("Reusable content inserted");
}
function showResourceInfo(title,name,meta){
 showModal(title,`<p><strong>${esc(name)}</strong></p><p>${esc(meta)}</p>`);
}
function renderDocumentMap(holder,q){
 if(!state.model){
   holder.innerHTML='<div class="tree-section-label">No document open</div>';
   return;
 }
 const root=document.createElement("div");root.className="tree-node";
 const rrow=document.createElement("div");rrow.className="tree-row";
 rrow.innerHTML=`<span class="tree-caret">▾</span><span class="tree-icon">&lt;&gt;</span><span class="tree-title">mainProcedure</span>`;
 rrow.classList.add("root-context-row");
 rrow.classList.toggle("active",!!state.rootSelected);
 rrow.onclick=()=>{
   state.rootSelected=true;state.selectedId=null;
   renderTree();refreshInsertOptions();updateContext();renderElementCoach();
   const editor=$("#authorEditor");
   if(editor)editor.scrollTo({top:0,behavior:"smooth"});
   $("#cursorStatus").textContent="Selected mainProcedure";
 };
 rrow.tabIndex=0;rrow.onkeydown=e=>{if(handleQuickTagsKey(e))return;if(e.key==="Enter"){e.preventDefault();state.rootSelected=true;state.selectedId=null;openQuickTags(rrow)}};
 rrow.addEventListener("dragover",e=>{if(isLocked())return;e.preventDefault();e.stopPropagation();rrow.classList.add("drop-target")});
 rrow.addEventListener("dragleave",()=>rrow.classList.remove("drop-target"));
 rrow.addEventListener("drop",e=>{e.preventDefault();e.stopPropagation();rrow.classList.remove("drop-target");moveNodeToRoot(e.dataTransfer.getData("text/plain"))});
 root.appendChild(rrow);

 let stepNo=0;
 function addNode(n,depth,parentEl){
   let label=n.type;
   if(n.type==="title"||n.type==="sectionTitle"||n.type==="para"||n.type==="warning"||n.type==="caution"||n.type==="note"||n.type==="cmd")
     label+=` — ${(n.text||"").replace(/\s+/g," ").slice(0,46)}`;
   if(n.type==="step"){stepNo++;label=`step ${stepNo} — ${(n.text||"").replace(/\s+/g," ").slice(0,42)}`}
   if(n.type==="table")label=`table — ${(n.rows?.[0]||[]).join(" / ").slice(0,42)}`;
   const searchable=label.toLowerCase();
   const row=document.createElement("div");
   row.className="tree-row element-row"+(n.id===state.selectedId?" selected":"");
   row.dataset.nodeId=n.id;row.style.paddingLeft=`${20+depth*16}px`;
   const kids=n.children?.length;
   row.innerHTML=`<span class="tree-caret">${kids?"▾":""}</span><span class="tree-icon">&lt;&gt;</span><span class="tree-title">${esc(label)}</span>`;
   if(q&&!searchable.includes(q)){
     const descendantMatch=n.children?.some(c=>JSON.stringify(c).toLowerCase().includes(q));
     if(!descendantMatch)row.style.display="none";
   }
   row.onclick=()=>{state.rootSelected=false;selectElement(n.id,{renderTree:false});renderTree();revealSelectedInEditor();};
   row.onkeydown=e=>{if(handleQuickTagsKey(e))return;if(e.key==="Enter"){e.preventDefault();state.rootSelected=false;state.selectedId=n.id;openQuickTags(row)}};
   row.tabIndex=0;
   row.draggable=!isLocked();
   row.addEventListener("dragstart",e=>{
     if(isLocked())return e.preventDefault();
     e.stopPropagation();row.classList.add("dragging");
     e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain",n.id);
   });
   row.addEventListener("dragend",()=>{$$(".tree-row").forEach(x=>x.classList.remove("dragging","drop-target","drop-invalid"))});
   row.addEventListener("dragover",e=>{
     if(isLocked())return;
     e.preventDefault();e.stopPropagation();
     const srcId=e.dataTransfer.getData("text/plain")||document.querySelector(".tree-row.dragging")?.dataset.nodeId;
     const verdict=canDropNode(srcId,n.id);
     row.classList.toggle("drop-target",verdict.ok);row.classList.toggle("drop-invalid",!verdict.ok);
     e.dataTransfer.dropEffect=verdict.ok?"move":"none";
   });
   row.addEventListener("dragleave",()=>row.classList.remove("drop-target","drop-invalid"));
   row.addEventListener("drop",e=>{
     e.preventDefault();e.stopPropagation();row.classList.remove("drop-target","drop-invalid");
     const srcId=e.dataTransfer.getData("text/plain")||document.querySelector(".tree-row.dragging")?.dataset.nodeId;
     moveNodeByDrop(srcId,n.id);
   });
   parentEl.appendChild(row);
   if(kids)n.children.forEach(c=>addNode(c,depth+1,parentEl));
 }
 state.model.nodes.forEach(n=>addNode(n,1,root));
 holder.appendChild(root);
 const help=document.createElement("div");help.className="drag-help";help.textContent="Training tip: drag elements in the Document Map. Schema and BREX decide whether the move is allowed.";holder.appendChild(help);
}

function nodeContainsId(node,id){
 if(!node)return false;
 if(node.id===id)return true;
 return (node.children||[]).some(c=>nodeContainsId(c,id));
}
function canDropNode(sourceId,targetId){
 if(!sourceId||!targetId||sourceId===targetId)return {ok:false,reason:"Same element"};
 const src=getNodeById(sourceId),target=getNodeById(targetId);
 if(!src||!target)return {ok:false,reason:"Unknown element"};
 if(nodeContainsId(src.node,targetId))return {ok:false,reason:"Cannot move an element inside its own descendant"};
 // Preferred behavior: drop INTO target when allowed.
 if(validChildrenForContext(target.node.type).includes(src.node.type))
   return {ok:true,mode:"child",context:target.node.type};
 // Otherwise drop AFTER target as a sibling if its parent context permits it.
 const parentContext=target.parent?.type||"mainProcedure";
 if(validChildrenForContext(parentContext).includes(src.node.type))
   return {ok:true,mode:"sibling",context:parentContext};
 return {ok:false,reason:`<${src.node.type}> is not permitted here by schema/BREX`};
}
function detachNode(id){
 const r=getNodeById(id);if(!r)return null;
 const [node]=r.nodes.splice(r.index,1);return node;
}
function moveNodeByDrop(sourceId,targetId){
 if(isLocked())return;
 pushUndo("Drag/drop element");
 const verdict=canDropNode(sourceId,targetId);
 if(!verdict.ok)return alert(`Move blocked: ${verdict.reason}.`);
 const src=getNodeById(sourceId),targetBefore=getNodeById(targetId);
 if(!src||!targetBefore)return;
 const moved=detachNode(sourceId);if(!moved)return;
 const target=getNodeById(targetId);
 if(!target){return alert("Move failed: target no longer exists.")}
 if(verdict.mode==="child"){
   target.node.children=target.node.children||[];
   target.node.children.push(moved);
 }else{
   target.nodes.splice(target.index+1,0,moved);
 }
 state.selectedId=moved.id;
 state.history.unshift(hist(`Moved <${moved.type}> by drag/drop (${verdict.mode})`));
 markDirty();renderAuthor();renderTree();revealSelectedInEditor();
 toast(`Moved <${moved.type}>`);
}
function moveNodeToRoot(sourceId){
 if(isLocked()||!sourceId)return;
 pushUndo("Move element to document root");
 const src=getNodeById(sourceId);if(!src)return;
 if(!validChildrenForContext("mainProcedure").includes(src.node.type))
   return alert(`BREX/schema blocks <${src.node.type}> at document root.`);
 const moved=detachNode(sourceId);if(!moved)return;
 state.model.nodes.push(moved);state.selectedId=moved.id;
 state.history.unshift(hist(`Moved <${moved.type}> to document root`));
 markDirty();renderAuthor();renderTree();revealSelectedInEditor();
}
function revealSelectedInEditor(){
 const el=$(`.xml-node[data-id="${state.selectedId}"]`);
 if(!el)return;
 el.scrollIntoView({behavior:"smooth",block:"center"});
 el.classList.add("nav-flash");
 setTimeout(()=>el.classList.remove("nav-flash"),650);
}
function expandAllTree(){
 // Current demo trees render expanded by default; keep as a semantic action.
 $("#cursorStatus").textContent=state.leftMode==="document"?"Document map expanded":"Resources expanded";
 renderTree();
}
function collapseAllTree(){
 if(state.leftMode==="document"){
   $("#contentTree").innerHTML='<div class="tree-node"><div class="tree-row"><span class="tree-caret">▸</span><span class="tree-icon">&lt;&gt;</span><span class="tree-title">mainProcedure</span></div></div>';
 }else{
   $("#contentTree").innerHTML='<div class="tree-section-label">Resources collapsed</div>';
 }
 $("#cursorStatus").textContent="Tree collapsed";
}
function getNodeById(id,nodes=null,parent=null){
 if(!state.model)return null;
 if(nodes===null)nodes=state.model.nodes;
 for(let i=0;i<nodes.length;i++){const n=nodes[i];if(n.id===id)return{node:n,parent,nodes,index:i};if(n.children){const r=getNodeById(id,n.children,n);if(r)return r}}
 return null;
}
function parentTypeOf(id){
 const r=getNodeById(id); if(!r)return"mainProcedure"; return r.parent?.type||"mainProcedure";
}

function cloneStructuredNode(node){
 const copy=JSON.parse(JSON.stringify(node));
 const reid=n=>{
   n.id=uid();
   // A structural copy must not reuse an XML ID from the source element.
   // The trainer can assign a new explicit XML ID later if the project requires one.
   if("xmlId" in n)n.xmlId="";
   if(n.attrs&&typeof n.attrs==="object"&&"id" in n.attrs)delete n.attrs.id;
   if(n.children)n.children.forEach(reid);
 };
 reid(copy);
 return copy;
}

function hasSelectedTextInEditor(){
 const sel=window.getSelection?.();
 if(!sel||sel.rangeCount===0||sel.isCollapsed)return false;
 const range=sel.getRangeAt(0);
 const editor=$("#authorEditor");
 return !!(editor&&editor.contains(range.commonAncestorContainer));
}

function copySelectedElement(){
 if(!state.model||!state.selectedId)return false;
 const r=getNodeById(state.selectedId);if(!r)return false;
 state.structClipboard=JSON.parse(JSON.stringify(r.node));
 state.lastLearningAction={kind:"copy-element",type:r.node.type};
 if($("#cursorStatus"))$("#cursorStatus").textContent=`Copied <${r.node.type}> element`;
 toast(`Copied <${r.node.type}>`);
 return true;
}

function pasteCopiedElement(){
 if(isLocked())return alert("Approved documents are locked.");
 if(!state.model||!state.structClipboard)return false;
 const target=getNodeById(state.selectedId);
 if(!target)return false;

 const type=state.structClipboard.type;
 let destNodes=null,destIndex=null,context=null,placement="after";

 // First preference: paste as a sibling after the selected element.
 context=target.parent?.type||"mainProcedure";
 if((schema[context]||[]).includes(type)){
   destNodes=target.nodes;
   destIndex=target.index+1;
 }else if((schema[target.node.type]||[]).includes(type)){
   // Fallback: paste inside the selected element when that is structurally valid.
   target.node.children=target.node.children||[];
   destNodes=target.node.children;
   destIndex=destNodes.length;
   context=target.node.type;
   placement="inside";
 }else{
   return alert(`Cannot paste <${type}> in the current <${context}> context.`);
 }

 if(type==="title"&&context==="mainProcedure"&&(state.model.nodes||[]).some(n=>n.type==="title"))
   return alert("A title already exists. This document allows exactly one top-level <title>.");

 pushUndo(`Paste <${type}>`);
 const copy=cloneStructuredNode(state.structClipboard);
 destNodes.splice(destIndex,0,copy);
 state.selectedId=copy.id;
 state.rootSelected=false;
 state.history.unshift(hist(`Pasted <${type}> ${placement} selected element`));
 state.lastLearningAction={kind:"paste-element",type};
 markDirty();
 renderAuthor();renderTree();refreshInsertOptions();updateContext();syncSourcePassive();renderPreview();renderElementCoach();
 revealSelectedInEditor();
 if($("#cursorStatus"))$("#cursorStatus").textContent=`Pasted <${type}> ${placement}`;
 toast(`Pasted <${type}>`);
 return true;
}



function cycleTagMode(){const order=["full","partial","none"],i=order.indexOf(currentTagMode());applyTagMode(order[(i+1)%3]);noteShortcut("tagcycle")}
function showDocumentMapView(){document.querySelector(".left-pane")?.classList.remove("normal-hidden");document.querySelector(".workspace")?.classList.remove("normal-view");state.leftMode="document";renderTree();noteShortcut("docmap")}
function showNormalView(){document.querySelector(".left-pane")?.classList.add("normal-hidden");document.querySelector(".workspace")?.classList.add("normal-view");noteShortcut("normal")}
function focusInsertMarkup(){
 const select=$("#elementSelect");
 if(!select)return;
 noteShortcut("markup-list");

 const existing=$("#insertMarkupPopup");
 if(existing){existing.remove();return}

 const opts=validElementsForInsertion(currentInsertPosition());
 const rect=select.getBoundingClientRect();
 const popup=document.createElement("div");
 popup.id="insertMarkupPopup";
 popup.className="insert-markup-popup";
 popup.style.left=`${Math.max(4,Math.min(rect.left,window.innerWidth-270))}px`;
 popup.style.top=`${Math.min(rect.bottom+2,window.innerHeight-260)}px`;

 popup.innerHTML=`<div class="insert-markup-title">Insert Markup <span>Ctrl+M</span></div>
   ${opts.length
     ? opts.map(x=>`<button type="button" class="insert-markup-option" data-markup-option="${esc(x)}">&lt;${esc(x)}&gt;</button>`).join("")
     : `<div class="insert-markup-empty">No valid markup at this location.</div>`}`;

 document.body.appendChild(popup);
 const first=popup.querySelector(".insert-markup-option");
 first?.focus();

 popup.querySelectorAll("[data-markup-option]").forEach(b=>b.addEventListener("click",()=>{
   const type=b.dataset.markupOption;
   select.value=type;
   popup.remove();
   try{
     insertElement(type);
     noteShortcut("markup-list",{inserted:type});
     if($("#cursorStatus"))$("#cursorStatus").textContent=`Inserted <${type}> from Insert Markup`;
   }catch(err){
     console.error("Insert Markup selection failed",err);
     if($("#cursorStatus"))$("#cursorStatus").textContent=`Insert Markup failed: ${err.message}`;
     alert(`Insert Markup failed: ${err.message}`);
   }
 }));

 popup.addEventListener("keydown",e=>{
   const items=[...popup.querySelectorAll(".insert-markup-option")];
   if(!items.length)return;
   const i=Math.max(0,items.indexOf(document.activeElement));
   if(e.key==="ArrowDown"){
     e.preventDefault();items[(i+1)%items.length].focus();
   }else if(e.key==="ArrowUp"){
     e.preventDefault();items[(i-1+items.length)%items.length].focus();
   }else if(e.key==="Escape"){
     e.preventDefault();popup.remove();select.focus();
   }
 });
 if($("#cursorStatus"))$("#cursorStatus").textContent="Insert Markup list opened (Ctrl+M)";
}
function showInsertMarkupDialog(){
 closeInsertMarkupPopup();
 const opts=validElementsForInsertion(currentInsertPosition());
 const context=$("#contextPath")?.textContent||"";
 showModal("Insert Markup",`
   <div data-training-dialog="insert-markup">
     <p>Context: <strong>${esc(context)}</strong></p>
     <p class="menu-note">Choose valid markup for the current position.</p>
     <div class="export-grid">
       ${opts.length
         ? opts.map(x=>`<button type="button" class="export-option" data-insert-dialog="${esc(x)}"><strong>&lt;${esc(x)}&gt;</strong><span>Valid at this location</span></button>`).join("")
         : `<div class="learning-callout">No markup is valid at this location.</div>`}
     </div>
   </div>`);
 state.lastLearningAction={kind:"shortcut",name:"markup-dialog"};
 state.drillEvidence=state.drillEvidence||{};
 state.drillEvidence.markupDialogOpened=true;
 $$("[data-insert-dialog]").forEach(b=>b.addEventListener("click",()=>{
   const type=b.dataset.insertDialog;
   $("#modalBackdrop").classList.add("hidden");
   state.drillEvidence=state.drillEvidence||{};
   state.drillEvidence.markupDialogChosen=type;
   const inserted=insertElement(type);
   if(inserted){
     state.drillEvidence.markupDialogInserted=type;
     state.drillEvidence.markupDialogInsertedId=inserted.id;
   }
 }));
 if($("#cursorStatus"))$("#cursorStatus").textContent="Insert Markup dialog opened (Ctrl+Shift+M)";
}
function insertTableShortcut(){const old=$("#elementSelect")?.value;try{if(validElementsForInsertion(currentInsertPosition()).includes("table"))insertElement("table");else showTableEditor()}finally{if($("#elementSelect")&&old)$("#elementSelect").value=old}noteShortcut("insert-table")}
function toggleContextRules(){state.contextRulesOn=!state.contextRulesOn;const s=$("#contextRulesStatus");if(s){s.classList.toggle("active",state.contextRulesOn);s.textContent=state.contextRulesOn?"CTX":"CTX OFF"}toast(`Context Rules ${state.contextRulesOn?"ON":"OFF"}`);state.lastLearningAction={kind:"context-rules",value:state.contextRulesOn}}
function showContextInfo(){const s=currentSelectionContext(),ic=insertionContextFor(currentInsertPosition()),opts=validElementsForInsertion(currentInsertPosition());showModal("Show Context",`<p>Selected: <strong>${esc(s.kind==="root"?"mainProcedure":s.node.type)}</strong></p><p>Insertion context: <strong>${esc(ic.context)}</strong></p><p>Valid markup:</p><div class="dtd-viewer">${opts.map(x=>`&lt;${esc(x)}&gt;`).join("  ")||"(none)"}</div>`);state.lastLearningAction={kind:"show-context"};
 state.drillEvidence=state.drillEvidence||{};state.drillEvidence.showContextOpened=true}
function showDocumentTypeViewer(){const current=currentSelectionContext();const rows=Object.entries(schema).map(([p,c])=>`<div class="${(current.kind==="root"?"mainProcedure":current.node.type)===p?"ctx":""}">&lt;${esc(p)}&gt; → ${c.length?c.map(x=>`&lt;${esc(x)}&gt;`).join(", "):"text / leaf"}</div>`).join("");showModal("Document Type Viewer",`<div class="dtd-viewer">${rows}</div><p class="menu-note">Training schema view. In Arbortext, Document Type Viewer exposes the document structure and helps insert markup at valid locations.</p>`);state.lastLearningAction={kind:"doctype-viewer"};
 state.drillEvidence=state.drillEvidence||{};state.drillEvidence.doctypeOpened=true}
function showShortcutReference(){showModal("Keyboard Shortcuts",`<div class="dtd-viewer"><b>Editing</b><br>Ctrl+Z Undo · Ctrl+Y Redo · Ctrl+S Save · Ctrl+F Find/Replace · Ctrl+D Modify Attributes<br><br><b>Markup</b><br>Enter Quick Tags · Ctrl+M Insert Markup list · Ctrl+Shift+M Insert Markup dialog<br><br><b>Views</b><br>Ctrl+Shift+L cycle tag display · Alt+Ctrl+O Document Map · Alt+Ctrl+N Normal · Ctrl+L Refresh · F6 cycle focus<br><br><b>Table</b><br>Alt+Shift+T Insert Table</div><p class="menu-note">These are based on PTC Arbortext Editor default mappings. The trainer implements the subset that maps cleanly to this browser simulation.</p>`)}

function findElementBoundary(which){
 const r=getNodeById(state.selectedId);
 if(!r)return alert("Select an element first.");
 revealSelectedInEditor();
 state.lastLearningAction={kind:"find-boundary",which};
 if($("#cursorStatus"))$("#cursorStatus").textContent=`Element ${which}: <${r.node.type}>`;
 $("#modalBackdrop")?.classList.add("hidden");
}
function showChangeMarkup(){const r=getNodeById(state.selectedId);if(!r)return alert("Select an element first.");const parent=r.parent?.type||"mainProcedure",allowed=(schema[parent]||[]).filter(t=>t!==r.node.type);showModal("Change Markup",`<p>Current: <strong>&lt;${esc(r.node.type)}&gt;</strong></p><select id="changeMarkupSelect">${allowed.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join("")}</select>`,`<button class="btn" data-close>Cancel</button><button class="btn accent" id="applyChangeMarkup">Change</button>`);$("#applyChangeMarkup").onclick=()=>{const t=$("#changeMarkupSelect").value;if(!t)return;pushUndo(`Change markup ${r.node.type} → ${t}`);r.node.type=t;if(!schema[t]?.length)delete r.node.children;renderAuthor();renderTree();refreshInsertOptions();syncSourcePassive();$("#modalBackdrop").classList.add("hidden");state.lastLearningAction={kind:"change-markup"};
 state.drillEvidence=state.drillEvidence||{};state.drillEvidence.changeMarkupApplied=true;
 toast("Markup changed")}}
function checkCompleteness(){
 const issues=validate();
 const hasErr=issues.some(i=>i.type==="err"),s=$("#completenessStatus");
 if(s){
   s.textContent=hasErr?"INC":"CMP";
   s.classList.toggle("incomplete",hasErr);
   s.classList.toggle("active",!hasErr);
 }
 state.lastLearningAction={kind:"completeness"};
 state.drillEvidence=state.drillEvidence||{};
 state.drillEvidence.completenessRan=true;
 state.drillEvidence.completenessCount=(state.drillEvidence.completenessCount||0)+1;

 if(!hasErr){
   const status=$("#cursorStatus");
   if(status){
     status.textContent="No completeness errors found";
     status.classList.add("completeness-ok-flash");
     setTimeout(()=>status.classList.remove("completeness-ok-flash"),2000);
   }
   if(s){
     s.classList.add("completeness-ok-flash");
     setTimeout(()=>s.classList.remove("completeness-ok-flash"),2000);
   }
   return;
 }

 showModal("Completeness Check Log",renderCompletenessLog(issues));
 $$("[data-complete-index]").forEach(row=>{
   row.ondblclick=()=>{
     const id=row.dataset.nodeId;
     if(id&&getNodeById(id)){
       state.selectedId=id;state.rootSelected=false;
       renderAuthor();renderTree();revealSelectedInEditor();
     }
     $("#modalBackdrop").classList.add("hidden");
     showRightTab("validation");
   };
 });
}
function refreshEditorScreen(){renderAuthor();renderTree();noteShortcut("refresh");$("#cursorStatus").textContent="Screen refreshed"}
function cycleFocus(){const targets=[$("#authorEditor"),$("#contentTree"),$("#elementSelect")].filter(Boolean);state.focusCycleIndex=(state.focusCycleIndex+1)%targets.length;targets[state.focusCycleIndex].focus?.();noteShortcut("focus");$("#cursorStatus").textContent=["Edit view","Document Map","Markup toolbar"][state.focusCycleIndex]||"Focus changed"}
function changeMagnification(delta){state.zoomLevel=Math.max(-1,Math.min(1,(state.zoomLevel||0)+delta));const e=$("#authorEditor");e?.classList.toggle("zoom-up",state.zoomLevel>0);e?.classList.toggle("zoom-down",state.zoomLevel<0);state.lastLearningAction={kind:"shortcut",name:delta>0?"zoom-in":"zoom-out"}}
function quickTagsCandidateGroups(){
 const s=currentSelectionContext();
 if(!state.model)return {above:[],below:[]};

 // PTC Quick Tags behavior is cursor-location based. In this simulator we use
 // the currently selected element plus insertion position as the cursor context.
 const insideContext=s.kind==="root"?"mainProcedure":s.node.type;
 const inside = applyDocumentOccurrenceConstraints(validChildrenForContext(insideContext),insideContext);
 let siblingContext = "mainProcedure";
 if(s.kind==="node") siblingContext = s.parent?.type||"mainProcedure";
 const siblings = applyDocumentOccurrenceConstraints(validChildrenForContext(siblingContext),siblingContext);

 // "Below divider" = child elements valid inside current element.
 const below = inside.map(type=>({type,mode:"inside",label:type,hint:"insert inside"}));

 // "Above divider" = useful split/sibling-style insertions at cursor location.
 const above = [];
 if(s.kind==="node"){
   siblings.forEach(type=>{
     if(type===s.node.type) above.push({type,mode:"after",label:`${type} split`,hint:"insert sibling after"});
     else above.push({type,mode:"after",label:type,hint:"insert after"});
   });
 }
 return {above,below};
}

function toggleQuickTags(anchorEl=null){
 const popup=$("#quickTagsPopup");
 if(popup){closeQuickTags();if($("#cursorStatus"))$("#cursorStatus").textContent="Quick Tags closed";return}
 openQuickTags(anchorEl);
}
function closeQuickTags(){
 const p=$("#quickTagsPopup");if(p)p.remove();
 state.quickTagsPopup=null;state.quickTagsIndex=0;
}
// data-quicktags-outside-close
document.addEventListener("mousedown",e=>{
 const popup=$("#quickTagsPopup");
 if(!popup)return;
 if(popup.contains(e.target))return;
 if(e.target.closest?.("#quickTagsBtn"))return;
 closeQuickTags();
},true);

function selectQuickTagItem(index){
 const items=$$(".quick-tag-item");
 items.forEach((el,i)=>el.classList.toggle("active",i===index));
 const active=items[index];if(active)active.scrollIntoView({block:"nearest"});
 state.quickTagsIndex=index;
}
function insertViaQuickTags(type,mode){
 state.drillEvidence=state.drillEvidence||{};
 state.drillEvidence.quickTagsUsed=true;
 state.drillEvidence.quickTagsType=type;
 closeQuickTags();
 const old=$("#insertPositionSelect")?.value||"inside";
 if($("#insertPositionSelect"))$("#insertPositionSelect").value=mode;
 refreshInsertOptions();
 insertElement(type);
 if($("#insertPositionSelect"))$("#insertPositionSelect").value=old;
 refreshInsertOptions();

 // In No Tags mode, mimic Arbortext's gray Tag Prompt for a newly inserted element.
 if(currentTagMode()==="none"){
   requestAnimationFrame(()=>{
     const el=document.querySelector(`.xml-node[data-id="${CSS.escape(state.selectedId||"")}"]`);
     if(el){
       const c=el.querySelector(".node-content");
       if(c && !(c.textContent||"").trim()){
         const prompt=document.createElement("span");
         prompt.className="tag-prompt";prompt.textContent=`${type}`;
         c.appendChild(prompt);
         const clear=()=>prompt.remove();
         c.addEventListener("beforeinput",clear,{once:true});
       }
     }
   });
 }
}
function openQuickTags(anchorEl=null){
 state.lastLearningAction={kind:"quickopen"};
 state.drillEvidence=state.drillEvidence||{};
 state.drillEvidence.quickTagsOpened=true;
 if(!state.quickTagsEnabled||!state.model||isLocked())return;
 closeQuickTags();
 const groups=quickTagsCandidateGroups();
 const all=[...groups.above,...groups.below];
 if(!all.length){$("#cursorStatus").textContent="Quick Tags: no valid elements at this location";return}

 const popup=document.createElement("div");
 popup.id="quickTagsPopup";popup.className="quick-tags-popup";
 popup.innerHTML=`<div class="quick-tags-title">Quick Tags — valid at current cursor location</div>`;
 const addItem=(item)=>{
   const row=document.createElement("div");row.className="quick-tag-item";
   row.dataset.type=item.type;row.dataset.mode=item.mode;
   row.innerHTML=`<span class="qt-name">${esc(item.label)}</span><span class="qt-hint">${esc(item.hint)}</span>`;
   row.onmousedown=e=>{e.preventDefault();insertViaQuickTags(item.type,item.mode)};
   popup.appendChild(row);
 };
 groups.above.forEach(addItem);
 if(groups.above.length&&groups.below.length){
   const d=document.createElement("div");d.className="quick-tag-divider";popup.appendChild(d);
 }
 groups.below.forEach(addItem);
 document.body.appendChild(popup);

 let rect;
 if(anchorEl?.getBoundingClientRect)rect=anchorEl.getBoundingClientRect();
 else{
   const selEl=state.selectedId?document.querySelector(`.xml-node[data-id="${CSS.escape(state.selectedId)}"]`):null;
   rect=selEl?.getBoundingClientRect()||{left:300,top:160,bottom:180};
 }
 popup.style.left=Math.min(window.innerWidth-340,Math.max(8,rect.left+20))+"px";
 popup.style.top=Math.min(window.innerHeight-340,Math.max(8,rect.bottom+2))+"px";
 state.quickTagsPopup=popup;state.quickTagsIndex=0;selectQuickTagItem(0);
 $("#cursorStatus").textContent="Quick Tags open — Enter selects, Esc closes";
}
function handleQuickTagsKey(e){
 const popup=$("#quickTagsPopup");
 if(!popup)return false;
 const items=$$(".quick-tag-item");
 if(e.key==="ArrowDown"){e.preventDefault();selectQuickTagItem((state.quickTagsIndex+1)%items.length);return true}
 if(e.key==="ArrowUp"){e.preventDefault();selectQuickTagItem((state.quickTagsIndex-1+items.length)%items.length);return true}
 if(e.key==="Escape"){e.preventDefault();closeQuickTags();return true}
 if(e.key==="Enter"){
   e.preventDefault();
   const item=items[state.quickTagsIndex];
   if(item)insertViaQuickTags(item.dataset.type,item.dataset.mode);
   return true;
 }
 return false;
}
function currentInsertPosition(){
 return $("#insertPositionSelect")?.value || "inside";
}
function currentSelectionContext(){
 if(state.rootSelected || !state.selectedId){
   return {kind:"root",context:"mainProcedure",node:null,parent:null,nodes:state.model?.nodes||[],index:-1};
 }
 const r=getNodeById(state.selectedId);
 if(!r)return {kind:"root",context:"mainProcedure",node:null,parent:null,nodes:state.model?.nodes||[],index:-1};
 return {kind:"node",context:r.node.type,node:r.node,parent:r.parent,nodes:r.nodes,index:r.index};
}
function insertionContextFor(position=currentInsertPosition()){
 const s=currentSelectionContext();
 if(s.kind==="root"){
   return {position:"inside",context:"mainProcedure",nodes:state.model?.nodes||[],index:(state.model?.nodes||[]).length-1,parent:null,selected:null};
 }
 if(position==="inside"){
   return {position,context:s.node.type,nodes:s.node.children||(s.node.children=[]),index:(s.node.children||[]).length-1,parent:s.node,selected:s.node};
 }
 const parentContext=s.parent?.type||"mainProcedure";
 return {position,context:parentContext,nodes:s.nodes,index:s.index,parent:s.parent,selected:s.node};
}
function applyDocumentOccurrenceConstraints(elements,context){
 let out=[...(elements||[])];
 // The training document type/BREX requires exactly one top-level title.
 // Normal authoring must not offer a second title; imported/invalid content
 // may still contain duplicates so Check Completeness can teach repair.
 if(context==="mainProcedure"){
   const hasTitle=(state.model?.nodes||[]).some(n=>n.type==="title");
   if(hasTitle)out=out.filter(el=>el!=="title");
 }
 return out;
}
function validElementsForInsertion(position=currentInsertPosition()){
 const ic=insertionContextFor(position);
 return applyDocumentOccurrenceConstraints(validChildrenForContext(ic.context),ic.context);
}
function validChildrenForContext(context){
 const schemaAllowed=[...(schema[context]||[])];
 const profile=activeBrexProfile();
 const blocked=new Set(profile.disallowedByContext?.[context]||[]);
 return schemaAllowed.filter(el=>!blocked.has(el));
}
function validChildrenForSelected(){
 return validElementsForInsertion();
}
function isLocked(){return state.model.meta.workflow==="Approved"}


function renderTrainingBanner(){
 const old=$("#trainingBanner");
 if(old)old.remove();
 if(!state.trainingExercise)return;
 const editor=$("#editorPane")||$("#authorPane")||$("#centerPane");
 const author=$("#author");
 if(!author)return;
 const banner=document.createElement("div");
 banner.id="trainingBanner";
 banner.className="training-banner";
 banner.innerHTML=`Training exercise loaded: ${esc(state.trainingExercise.title)} <span>Changes are local training data and are not checked in to the CSDB.</span>`;
 author.parentElement.insertBefore(banner,author);
}

function insertPlainTextAtCaret(target,text){
 if(!target)return;
 const clean=String(text??"")
   .replace(/\r\n?/g,"\n")
   .replace(/[ \t]*\n+[ \t]*/g," ")
   .replace(/[ \t]{2,}/g," ");
 const sel=window.getSelection?.();
 if(sel&&sel.rangeCount){
   const range=sel.getRangeAt(0);
   if(target.contains(range.commonAncestorContainer)){
     range.deleteContents();
     const node=document.createTextNode(clean);
     range.insertNode(node);
     range.setStartAfter(node);
     range.collapse(true);
     sel.removeAllRanges();
     sel.addRange(range);
     return;
   }
 }
 target.appendChild(document.createTextNode(clean));
}

function handleStructuredPaste(e,target,node){
 if(isLocked())return;
 const text=e.clipboardData?.getData("text/plain");
 if(text==null)return; // Let the browser handle unusual clipboard payloads.
 e.preventDefault();
 if(target.dataset.undoCaptured!=="1"){
   pushUndo(`Paste into <${node.type}>`);
   target.dataset.undoCaptured="1";
 }
 insertPlainTextAtCaret(target,text);
 node.text=target.innerText;
 markDirty();
 syncSourcePassive();
 if($("#cursorStatus"))$("#cursorStatus").textContent=`Pasted text into <${node.type}>`;
}

function renderAuthor(){
 const editor=$("#authorEditor");editor.innerHTML="";
 let stepCounter=0;
 function renderNode(n){
  const tagMode=currentTagMode();
  const el=document.createElement("div");
  el.className="xml-node";el.dataset.id=n.id;el.dataset.type=n.type;
  el.classList.add(tagMode==="full"?"full-tags":tagMode==="none"?"no-tags":"partial-tags");
  const attrs=elementAttributes(n);
  if(tagMode==="full"){const open=document.createElement("span");open.className="tag-open";const attrText=Object.entries(attrs).filter(([k,v])=>v!==""&&v!=null&&k!=="id").map(([k,v])=>` ${k}="${v}"`).join("");open.textContent=`<${n.type}${attrText}>`;el.appendChild(open);}

  if(n.type==="warning")el.classList.add("warning-node");
  if(n.type==="caution")el.classList.add("caution-node");
  if(n.type==="note")el.classList.add("note-node");
  if(n.type==="step")el.classList.add("step-node");
  if(n.type==="cmd")el.classList.add("cmd-node");
  if(n.type==="codeblock")el.classList.add("code-node");
  if(n.type==="table")el.classList.add("table-node");
  if(n.id===state.selectedId)el.classList.add("selected");
  el.innerHTML+=`<span class="xml-tag">${n.type}</span>`;
  if(tagMode==="partial"){
    const tag=el.querySelector(".xml-tag");
    const shown=Object.entries(attrs).filter(([k,v])=>v!==""&&v!=null&&k!=="id").slice(0,2);
    if(tag&&shown.length){const a=document.createElement("span");a.className="attr-inline";a.textContent=shown.map(([k,v])=>`${k}=${v}`).join(" ");tag.appendChild(a);}
  }
  if(n.type==="step"){stepCounter++;const num=document.createElement("div");num.className="step-number";num.textContent=stepCounter+".";el.appendChild(num)}
  const content=document.createElement("div");content.className="node-content";
  if(n.type==="table"){
   const table=document.createElement("table");
   (n.rows||[]).forEach((row,ri)=>{const tr=document.createElement("tr");row.forEach(cell=>{const c=document.createElement((ri===0&&n.headerRow!==false)?"th":"td");c.contentEditable=!isLocked();c.textContent=cell;c.oninput=()=>syncTableFromDom(n,table);tr.appendChild(c)});table.appendChild(tr)});
   content.appendChild(table);
   if(!isLocked()){
     const edit=document.createElement("button");edit.className="btn";edit.textContent="Edit table…";edit.style.marginTop="6px";
     edit.onclick=e=>{e.stopPropagation();state.selectedId=n.id;showTableEditor()};content.appendChild(edit);
   }
  }else{
   content.textContent=n.text||"";content.contentEditable=!isLocked();
   if(!isLocked()){
     content.addEventListener("dblclick",()=>{
       const sel=window.getSelection()?.toString()?.trim();
       if(sel && /^\d{2}-\d{2}-\d{2}-\d{3}-\d{4}[A-Z]-[A-Z]$/.test(sel)){
         openDocumentByDmc(sel);
       }
     });
   }
   content.onfocus=()=>{content.dataset.undoCaptured="0"};
  content.onbeforeinput=()=>{if(content.dataset.undoCaptured!=="1"){pushUndo(`Edit <${n.type}> text`);content.dataset.undoCaptured="1"}};
  content.addEventListener("keydown",e=>{
    if(handleQuickTagsKey(e))return;
    if(e.key==="Enter" && state.quickTagsEnabled){
      e.preventDefault();e.stopPropagation();
      state.rootSelected=false;state.selectedId=n.id;
      openQuickTags(content);
    }
  });
  content.addEventListener("paste",e=>handleStructuredPaste(e,content,n));
  content.oninput=()=>{n.text=content.innerText;markDirty();syncSourcePassive()};
  }
  el.appendChild(content);
  if(n.xrefs?.length){
    const refs=document.createElement("div");refs.className="xref-list";
    n.xrefs.forEach((xr,xi)=>{
      const chip=document.createElement("span");chip.className="xref-chip";chip.title=xr.title||xr.dmc;
      chip.innerHTML=`↗ ${esc(xr.dmc)}${isLocked()?"":` <button type="button" title="Remove reference">×</button>`}`;
      chip.onclick=e=>{e.stopPropagation();if(e.target.tagName!=="BUTTON")openDocumentByDmc(xr.dmc)};
      const del=chip.querySelector("button");if(del)del.onclick=e=>{e.stopPropagation();n.xrefs.splice(xi,1);state.history.unshift(hist(`Removed xref ${xr.dmc}`));markDirty();renderAuthor();renderReferences()};
      refs.appendChild(chip);
    });
    el.appendChild(refs);
  }
  if(n.children){const childWrap=document.createElement("div");childWrap.className="children";n.children.forEach(c=>childWrap.appendChild(renderNode(c)));el.appendChild(childWrap)}
  el.addEventListener("mousedown",e=>{
    e.stopPropagation();
    selectElement(n.id,{renderTree:false});
  });
  el.addEventListener("click",e=>{
    e.stopPropagation();
    if(e.altKey){el.classList.toggle("collapsed");noteShortcut("collapse-element");return;}
    if(state.leftMode==="document") renderTree();
  });
  if(tagMode==="full"){const close=document.createElement("span");close.className="tag-close";close.textContent=`</${n.type}>`;el.appendChild(close);}
  return el;
 }
 state.model.nodes.forEach(n=>editor.appendChild(renderNode(n)));
 document.body.classList.toggle("locked",isLocked());
 renderTrainingBanner();updateLines();refreshInsertOptions();updateContext();setWorkflowButtons();renderBrexPanel();
 if(state.leftMode==="document") renderTree();
}
function syncTableFromDom(n,table){n.rows=[...table.rows].map(r=>[...r.cells].map(c=>c.innerText));markDirty();syncSourcePassive()}

function selectElement(id, options={}){
 state.rootSelected=false;
 state.selectedId=id;

 // Update selection without rebuilding the editor DOM.
 $$(".xml-node.selected").forEach(el=>el.classList.remove("selected"));
 const current=$(`.xml-node[data-id="${id}"]`);
 if(current) current.classList.add("selected");

 refreshInsertOptions();
 updateContext();

 const r=getNodeById(id);
 if(r){
   $("#selectedElementName").value=r.node.type;
   $("#selectedElementId").value=r.node.xmlId||"";
   $("#selectedElementClass").value=r.node.className||"";
 }

 if(state.leftMode==="document" && options.renderTree!==false) renderTree();renderElementCoach();
}
function refreshInsertOptions(){
 const pos=currentInsertPosition();
 const s=currentSelectionContext();
 const ic=insertionContextFor(pos);
 const schemaAllowed=[...(schema[ic.context]||[])];
 const opts=validElementsForInsertion(pos);
 const sel=$("#elementSelect");
 sel.innerHTML='<option value="">Insert valid element…</option>';
 opts.forEach(o=>{const op=document.createElement("option");op.value=o;op.textContent=o;sel.appendChild(op)});
 let label;
 if(s.kind==="root"){
   label=`Inside mainProcedure`;
 }else if(pos==="inside"){
   label=`Inside <${s.node.type}>`;
 }else{
   label=`${pos==="after"?"After":"Before"} <${s.node.type}> as child of <${ic.context}>`;
 }
 $("#elementHint").textContent=opts.length
   ? `${label}: ${opts.join(", ")}`
   : `${label}: no valid elements`;
 renderBrexPanel();
}
function updateContext(){
 const c=$("#contextPath");if(!c)return;
 if(state.rootSelected||!state.selectedId){
   c.innerHTML='Context: <span>mainProcedure</span>';
   return;
 }
 const r=getNodeById(state.selectedId);if(!r)return;
 const parent=r.parent?.type?` › ${esc(r.parent.type)}`:"";
 c.innerHTML=`Context: <span>mainProcedure${parent} › ${esc(r.node.type)}</span>`;
}
function updateLines(){const lines=Math.max(25,Math.round($("#authorEditor").scrollHeight/24));$("#lineNumbers").innerHTML=Array.from({length:lines},(_,i)=>`${i+1}<br>`).join("")}
function markDirty(){if(isLocked())return;state.dirty=true;$("#dirtyMark").textContent=" •";$("#cursorStatus").textContent="Modified"}
function syncSourcePassive(){if(!$("#sourceEditor").classList.contains("hidden"))$("#sourceEditor").value=modelToXml()}

function insertElement(type){
 if(!state.model)throw new Error("No document is open.");
 if(isLocked())throw new Error("Approved documents are locked.");

 const pos=currentInsertPosition();
 const s=currentSelectionContext();
 const ic=insertionContextFor(pos);
 const schemaAllowed=[...(schema[ic.context]||[])];
 const allowed=validElementsForInsertion(pos);

 if(!schemaAllowed.includes(type))
   throw new Error(`Schema blocks <${type}> in <${ic.context}>.`);
 if(!allowed.includes(type)){
   if(type==="title"&&ic.context==="mainProcedure"&&(state.model?.nodes||[]).some(n=>n.type==="title"))
     throw new Error("A title already exists. This document allows exactly one top-level <title>.");
   throw new Error(`BREX/context rules block <${type}> in <${ic.context}>.`);
 }

 pushUndo(`Insert <${type}>`);

 const n={id:uid(),type,text:defaultText(type)};
 if(type==="table"){n.rows=[["Item","Value"],["Example","Value"]];n.headerRow=true;}
 if(type==="step")n.children=[];

 if(s.kind==="root"){
   state.model.nodes.push(n);
 }else if(pos==="inside"){
   s.node.children=s.node.children||[];
   s.node.children.push(n);
 }else if(pos==="before"){
   s.nodes.splice(s.index,0,n);
 }else{
   s.nodes.splice(s.index+1,0,n);
 }

 state.selectedId=n.id;
 state.rootSelected=false;
 state.history.unshift(hist(`Inserted <${type}> ${s.kind==="root"?"inside mainProcedure":pos+" selected element"}`));
 state.lastLearningAction={kind:"insert",type,position:pos};
 markDirty();

 // Refresh only renderers that definitely exist in this app.
 renderAuthor();
 renderTree();
 refreshInsertOptions();
 updateContext();
 syncSourcePassive();
 renderPreview();
 renderElementCoach();
 revealSelectedInEditor();
 if(typeof renderDmcBreakdown==="function")renderDmcBreakdown();
 if(state.drillSession)updateDrillStats();

 const status=$("#cursorStatus");
 if(status)status.textContent=`Inserted <${type}> ${pos}`;
 toast(`Inserted <${type}>`);
 return n;
}

function captureEditorSnapshot(label="Change"){
 return {
   label,
   model:JSON.parse(JSON.stringify(state.model)),
   selectedId:state.selectedId,
   rootSelected:!!state.rootSelected,
   trainingExercise:state.trainingExercise?JSON.parse(JSON.stringify(state.trainingExercise)):null
 };
}
function restoreEditorSnapshot(snap){
 if(!snap)return;
 state.model=JSON.parse(JSON.stringify(snap.model));
 state.selectedId=snap.selectedId;
 state.rootSelected=!!snap.rootSelected;
 state.trainingExercise=snap.trainingExercise?JSON.parse(JSON.stringify(snap.trainingExercise)):null;

 const activeDoc=getActiveDocument();
 if(activeDoc){
   activeDoc.model=JSON.parse(JSON.stringify(state.model));
   activeDoc.title=state.model.meta?.title||activeDoc.title;
   activeDoc.dmc=state.model.meta?.dmc||activeDoc.dmc;
 }

 state.dirty=true;
 $("#dirtyMark").textContent="•";
 renderAuthor();
 renderTree();
 if(typeof renderDmcBreakdown==="function")renderDmcBreakdown();
 if(typeof renderApplicabilityPreview==="function")renderApplicabilityPreview();
 renderReferences();
 renderBrexPanel();
 renderElementCoach();
 refreshInsertOptions();
 updateContext();
 syncSourcePassive();
 renderPreview();
 setWorkflowButtons();
 if($("#currentDocLabel"))$("#currentDocLabel").textContent=`DM ${state.model.meta?.dmc||""}`;
}
function pushUndo(label="Change"){
 if(!state.model)return;
 state.undoStack.push(captureEditorSnapshot(label));
 if(state.undoStack.length>state.historyLimit)state.undoStack.shift();
 state.redoStack=[];
 updateUndoRedoButtons();
}
function updateUndoRedoButtons(){
 const u=$("#undoBtn"),r=$("#redoBtn");
 if(u){u.disabled=state.undoStack.length===0;u.title=state.undoStack.length?`Undo: ${state.undoStack[state.undoStack.length-1].label}`:"Nothing to undo";}
 if(r){r.disabled=state.redoStack.length===0;r.title=state.redoStack.length?`Redo: ${state.redoStack[state.redoStack.length-1].label}`:"Nothing to redo";}
}
function undoAction(){
 if(!state.undoStack.length||!state.model)return;
 state.redoStack.push(captureEditorSnapshot("Redo"));
 const snap=state.undoStack.pop();
 restoreEditorSnapshot(snap);
 updateUndoRedoButtons();
 state.lastLearningAction={kind:"undo"};
 state.drillEvidence=state.drillEvidence||{};
 state.drillEvidence.undoUsed=true;
 $("#cursorStatus").textContent=`Undo: ${snap.label}`;
 toast(`Undo: ${snap.label}`);
}
function redoAction(){
 if(!state.redoStack.length||!state.model)return;
 state.undoStack.push(captureEditorSnapshot("Undo"));
 const snap=state.redoStack.pop();
 restoreEditorSnapshot(snap);
 updateUndoRedoButtons();
 state.lastLearningAction={kind:"redo"};
 state.drillEvidence=state.drillEvidence||{};
 state.drillEvidence.redoUsed=true;
 $("#cursorStatus").textContent=`Redo: ${snap.label}`;
 toast(`Redo: ${snap.label}`);
}
function defaultText(type){
 return {title:"New title",sectionTitle:"New section",para:"New paragraph.",warning:"Add warning text.",caution:"Add caution text.",note:"Add note text.",step:"Add procedure step.",cmd:"Add command.",codeblock:"command --option value"}[type]||"";
}
function deleteSelected(){
 if(isLocked())return alert("Approved documents are locked.");
 const r=getNodeById(state.selectedId);if(!r)return;

 // BREX requires exactly one title. Deleting an extra title is valid;
 // only deleting the last remaining title must be blocked.
 if(r.node.type==="title"){
   const titleCount=(state.model?.nodes||[]).filter(n=>n.type==="title").length;
   if(titleCount<=1)return alert("The title is required by the demo BREX rules.");
 }

 pushUndo("Delete element");
 r.nodes.splice(r.index,1);
 state.selectedId=r.parent?.id||state.model.nodes[0]?.id;
 state.history.unshift(hist(`Deleted <${r.node.type}>`));
 markDirty();
 renderAuthor();
 renderTree();
 refreshInsertOptions();
 updateContext();
}
function moveSelected(delta){
 if(isLocked())return;
 pushUndo(delta<0?"Move element up":"Move element down");
 const r=getNodeById(state.selectedId);if(!r){state.undoStack.pop();updateUndoRedoButtons();return;}const ni=r.index+delta;if(ni<0||ni>=r.nodes.length){state.undoStack.pop();updateUndoRedoButtons();return;}
 [r.nodes[r.index],r.nodes[ni]]=[r.nodes[ni],r.nodes[r.index]];state.history.unshift(hist(`Moved <${r.node.type}>`));markDirty();renderAuthor();
}
function hist(text){return{time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),user:state.model?.meta?.author||"Technical Writer",text}}

function modelToXml(){
 if(!state.model)return "";
 const m=state.model.meta,a=state.model.applicability;
 const nodeXml=n=>{
  const attr=[n.xmlId?` id="${esc(n.xmlId)}"`:"",n.className?` class="${esc(n.className)}"`:""].join("");
  if(n.type==="table")return `<table${attr}>${(n.rows||[]).map((r,ri)=>`<row>${r.map(c=>`<${ri===0?"entry":"entry"}>${esc(c)}</${ri===0?"entry":"entry"}>`).join("")}</row>`).join("")}</table>`;
  const map={title:"title",sectionTitle:"title",para:"para",warning:"warningAndCautionPara",caution:"warningAndCautionPara",note:"notePara",step:"proceduralStep",cmd:"para",codeblock:"codeblock"};
  const tag=map[n.type]||n.type;
  const xrefs=(n.xrefs||[]).map(x=>`<dmRef><dmRefIdent><dmCode demoDmc="${esc(x.dmc)}"/></dmRefIdent></dmRef>`).join("");
  const kids=xrefs+(n.children||[]).map(nodeXml).join("");
  if(n.type==="warning")return `<warning${attr}><warningAndCautionPara>${esc(n.text||"")}</warningAndCautionPara>${kids}</warning>`;
  if(n.type==="caution")return `<caution${attr}><warningAndCautionPara>${esc(n.text||"")}</warningAndCautionPara>${kids}</caution>`;
  if(n.type==="note")return `<note${attr}><notePara>${esc(n.text||"")}</notePara>${kids}</note>`;
  if(n.type==="step")return `<proceduralStep${attr}><para>${esc(n.text||"")}</para>${kids}</proceduralStep>`;
  return `<${tag}${attr}>${esc(n.text||"")}${kids}</${tag}>`;
 };
 return `<?xml version="1.0" encoding="UTF-8"?>
<dmodule>
  <identAndStatusSection>
    <dmAddress>
      <dmIdent>
        <dmCode modelIdentCode="DEMO" systemCode="23" subSystemCode="31" subSubSystemCode="01" assyCode="110" disassyCode="00" disassyCodeVariant="A" infoCode="801" infoCodeVariant="A" itemLocationCode="A"/>
        <language languageIsoCode="${esc(m.lang)}"/>
        <issueInfo issueNumber="${esc(m.issue)}"/>
      </dmIdent>
    </dmAddress>
    <dmStatus securityClassification="${esc(m.security)}">
      <responsiblePartnerCompany>${esc(m.responsible)}</responsiblePartnerCompany>
    </dmStatus>
  </identAndStatusSection>
  <applicCrossRefTable>
    <applic id="APP-001">
      <displayText><simplePara>${esc(a.expression)}</simplePara></displayText>
    </applic>
  </applicCrossRefTable>
  <content>
    <procedure>
      <mainProcedure>
        ${state.model.nodes.map(nodeXml).join("\n        ")}
      </mainProcedure>
    </procedure>
  </content>
</dmodule>`;
}
function esc(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}

function xmlToModel(xmlText){
 const x=new DOMParser().parseFromString(xmlText,"application/xml");if(x.querySelector("parsererror"))throw new Error("Invalid XML");
 const nodes=[];
 const children=[...x.querySelector("mainProcedure")?.children||[]];
 for(const el of children){
  const t=el.tagName;
  if(t==="warning"){nodes.push({id:uid(),type:"warning",text:el.querySelector("warningAndCautionPara")?.textContent||""});continue}
  if(t==="caution"){nodes.push({id:uid(),type:"caution",text:el.querySelector("warningAndCautionPara")?.textContent||""});continue}
  if(t==="note"){nodes.push({id:uid(),type:"note",text:el.querySelector("notePara")?.textContent||""});continue}
  if(t==="proceduralStep"){
   const direct=[...el.children];const firstPara=direct.find(c=>c.tagName==="para");
   const childCmds=direct.filter(c=>c.tagName==="para"&&c!==firstPara).map(c=>({id:uid(),type:"cmd",text:c.textContent}));
   nodes.push({id:uid(),type:"step",text:firstPara?.textContent||"",children:childCmds});continue
  }
  if(t==="table"){
   const rows=[...el.querySelectorAll(":scope > row")].map(r=>[...r.children].map(c=>c.textContent));
   nodes.push({id:uid(),type:"table",rows});continue
  }
  const type=t==="title"?(nodes.some(n=>n.type==="title")?"sectionTitle":"title"):t==="para"?"para":t==="codeblock"?"codeblock":"para";
  nodes.push({id:uid(),type,text:el.textContent,xmlId:el.getAttribute("id")||"",className:el.getAttribute("class")||""});
 }
 if(!nodes.length)throw new Error("No supported content found in <mainProcedure>.");
 state.model.nodes=nodes;
 const lang=x.querySelector("language")?.getAttribute("languageIsoCode");if(lang)state.model.meta.lang=lang;
 const issue=x.querySelector("issueInfo")?.getAttribute("issueNumber");if(issue)state.model.meta.issue=issue;
 const sec=x.querySelector("dmStatus")?.getAttribute("securityClassification");if(sec)state.model.meta.security=sec;
 const expr=x.querySelector("applic displayText simplePara")?.textContent;if(expr)state.model.applicability.expression=expr;
}

function renderSource(){ $("#sourceEditor").value=modelToXml() }
function applySource(){
 try{xmlToModel($("#sourceEditor").value);state.selectedId=state.model.nodes[0]?.id;syncControlsFromModel();renderAuthor();markDirty();$("#cursorStatus").textContent="XML applied to Content view"}
 catch(e){alert("XML could not be applied: "+e.message)}
}
function renderPreview(){
 const p=$("#previewPane");p.innerHTML="";
 const wrap=document.createElement("div");wrap.style.maxWidth="900px";wrap.style.margin="auto";
 state.model.nodes.forEach((n,i)=>{
  let e;if(n.type==="title"){e=document.createElement("h1");e.textContent=n.text}
  else if(n.type==="sectionTitle"){e=document.createElement("h2");e.textContent=n.text}
  else if(n.type==="warning"){e=document.createElement("div");e.className="xml-node warning-node";e.innerHTML=`<strong>WARNING</strong><br>${esc(n.text)}`}
  else if(n.type==="note"){e=document.createElement("div");e.className="xml-node note-node";e.innerHTML=`<strong>NOTE</strong><br>${esc(n.text)}`}
  else if(n.type==="step"){e=document.createElement("div");e.innerHTML=`<p><strong>${[...state.model.nodes].filter(x=>x.type==="step").indexOf(n)+1}. ${esc(n.text)}</strong></p>${(n.children||[]).map(c=>`<div style="margin-left:24px">• ${esc(c.text)}</div>`).join("")}`}
  else if(n.type==="codeblock"){e=document.createElement("pre");e.textContent=n.text;e.style.background="#222";e.style.color="#eee";e.style.padding="12px"}
  else if(n.type==="table"){
    e=document.createElement("table");
    e.style.borderCollapse="collapse";
    (n.rows||[]).forEach((r,ri)=>{
      const tr=document.createElement("tr");
      r.forEach(c=>{
        const td=document.createElement(ri===0?"th":"td");
        td.textContent=c;
        td.style.border="1px solid #888";
        td.style.padding="5px 7px";
        tr.appendChild(td);
      });
      e.appendChild(tr);
    });
  }
  else{e=document.createElement("p");e.textContent=n.text}
  wrap.appendChild(e);
 });p.appendChild(wrap);
}
function setMode(mode){
 try{
   if(!state.model)return;
   const author=$("#authorEditor"),source=$("#sourceEditor"),preview=$("#previewPane"),empty=$("#emptyState");
   empty?.classList.add("hidden");

   if(mode==="history"){
     showHistory();
     $$(".bottom-tab").forEach(b=>b.classList.toggle("active",b.dataset.mode==="history"));
     return;
   }
   if(mode==="issues"){
     showRightTab("validation");
     $$(".bottom-tab").forEach(b=>b.classList.toggle("active",b.dataset.mode==="issues"));
     return;
   }

   author?.classList.toggle("hidden",mode!=="content");
   source?.classList.toggle("hidden",mode!=="source");
   preview?.classList.toggle("hidden",mode!=="preview");
   $$(".bottom-tab").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));

   if(mode==="source")renderSource();
   if(mode==="preview")renderPreview();
   if($("#cursorStatus"))$("#cursorStatus").textContent=
      mode==="source"?"XML view":mode==="preview"?"Preview":"Content view";
 }catch(err){
   console.error("View switch failed",err);
   if($("#cursorStatus"))$("#cursorStatus").textContent=`View switch failed: ${err.message}`;
   alert(`View switch failed: ${err.message}`);
 }
}



function collectCompletenessStructureIssues(){
 const out=[];
 if(!state.model)return out;

 const add=(category,type,label,msg,nodeId=null)=>out.push({category,type,label,msg,nodeId});
 const allowedAttrsFor=(type)=>(attributeSchemas[type]||[]).map(a=>a.name);

 function walk(nodes,parentType="mainProcedure"){
   (nodes||[]).forEach((n,index)=>{
     const allowed=schema[parentType]||[];
     if(!allowed.includes(n.type)){
       add("Markup","err","Invalid element placement",
         `<${n.type}> is not permitted inside <${parentType}>.`,n.id);
     }

     const def=attributeSchemas[n.type]||[];
     const attrs=n.attrs||{};
     def.filter(a=>a.required).forEach(a=>{
       const val=attrs[a.name];
       if(val==null||String(val).trim()==="")
         add("Attributes","err","Required attribute",
           `<${n.type}> is missing required attribute ${a.name}.`,n.id);
     });

     Object.keys(attrs).forEach(name=>{
       if(!allowedAttrsFor(n.type).includes(name)){
         add("Attributes","err","Invalid attribute",
           `Attribute ${name} is not defined for <${n.type}> in the training schema.`,n.id);
       }
       const a=def.find(x=>x.name===name);
       if(a?.values?.length && String(attrs[name]||"") && !a.values.includes(String(attrs[name]))){
         add("Attributes","err","Invalid attribute value",
           `${name}="${attrs[name]}" is not an allowed value on <${n.type}>.`,n.id);
       }
     });

     const leafTypes=["title","sectionTitle","para","warning","note","cmd","codeblock"];
     if(leafTypes.includes(n.type) && !String(n.text||"").trim()){
       add("Empty elements","err","Empty element",
         `<${n.type}> has no content.`,n.id);
     }

     if(n.type==="table" && Array.isArray(n.rows) && n.rows.length){
       const cols=n.rows[0]?.length||0;
       if(!cols || n.rows.some(r=>r.length!==cols)){
         add("Table markup","err","Table structure",
           "Table rows do not contain a consistent number of cells.",n.id);
       }
     }

     if(n.children)walk(n.children,n.type);
   });
 }
 walk(state.model.nodes,"mainProcedure");

 // Duplicate explicit XML IDs / id attributes.
 const seen=new Map();
 const flat=[];
 const flatten=nodes=>(nodes||[]).forEach(n=>{flat.push(n);if(n.children)flatten(n.children)});
 flatten(state.model.nodes);
 flat.forEach(n=>{
   const explicit=(n.attrs?.id||n.xmlId||"").trim?.()||"";
   if(!explicit)return;
   if(seen.has(explicit)){
     add("IDs & references","err","Duplicate ID",
       `ID "${explicit}" is used more than once. IDs must be unique.`,n.id);
   }else seen.set(explicit,n.id);
 });

 return out;
}

function completenessCategory(issue){
 if(issue.category)return issue.category;
 const label=String(issue.label||"");
 const msg=String(issue.msg||"");
 if(/^STE\b/i.test(label))return "Language / STE";
 if(/^References\b/i.test(label))return "IDs & references";
 if(/^Workflow\b/i.test(label))return "Workflow";
 if(/^BREX\b/i.test(label)){
   if(/required|must contain|exactly one|at least one|missing/i.test(msg))return "Completeness";
   if(/classification|applicability|issue number/i.test(msg))return "Metadata / BREX";
   return "Project / BREX";
 }
 return issue.type==="info"?"Information":"Other";
}

function completenessCategoryHelp(category){
 const help={
  "Completeness":"Required content is missing or the document is not structurally complete.",
  "Markup":"An element is in a location that the document type does not permit.",
  "Attributes":"A required attribute is missing, unknown, or has an invalid value.",
  "IDs & references":"An ID is duplicated or a reference/identifier cannot be resolved.",
  "Empty elements":"An element that should contain content is empty.",
  "Table markup":"The table structure is incomplete or inconsistent.",
  "Metadata / BREX":"Required project metadata or applicability does not satisfy the active BREX profile.",
  "Project / BREX":"A project-specific business rule is not satisfied.",
  "Language / STE":"A language/style rule needs attention; this is separate from XML structural validity.",
  "Workflow":"The document state conflicts with the current edit state.",
  "Information":"Informational result; it does not make the document incomplete.",
  "Other":"Another enabled validation rule reported an issue."
 };
 return help[category]||help.Other;
}

function renderCompletenessLog(issues){
 const order=["Completeness","Markup","Attributes","IDs & references","Empty elements","Table markup","Metadata / BREX","Project / BREX","Language / STE","Workflow","Information","Other"];
 const grouped={};
 issues.forEach((issue,index)=>{
   const cat=completenessCategory(issue);
   (grouped[cat]||(grouped[cat]=[])).push({issue,index});
 });
 return `<div class="completeness-summary">
   <strong>${issues.filter(i=>i.type==="err").length} error(s)</strong>
   <span>${issues.filter(i=>i.type==="warn").length} warning(s)</span>
   <span>${issues.filter(i=>i.type==="info").length} info</span>
 </div>
 <div class="completeness-log grouped">
 ${order.filter(cat=>grouped[cat]?.length).map(cat=>`
   <section class="completeness-category">
    <div class="completeness-category-head">
      <strong>${esc(cat)}</strong>
      <span>${grouped[cat].length}</span>
    </div>
    <div class="completeness-category-help">${esc(completenessCategoryHelp(cat))}</div>
    ${grouped[cat].map(({issue,index})=>`
      <div class="issue ${issue.type}" data-complete-index="${index}" data-node-id="${esc(issue.nodeId||"")}">
       <div class="completeness-issue-label"><span class="severity">${issue.type==="err"?"ERROR":issue.type==="warn"?"WARNING":"INFO"}</span> <strong>${esc(issue.label)}</strong></div>
       <div>${esc(issue.msg)}</div>
      </div>`).join("")}
   </section>`).join("")}
 </div>`;
}

function tagCheckSource(issues,source){
 return (issues||[]).map(i=>({...i,source:i.source||source}));
}

function collectSchemaValidationIssues(){
 const structural=collectCompletenessStructureIssues();
 // Validation is the XML/schema-facing pass: element placement, attributes,
 // identifiers/references and table markup. Required-content/empty-content
 // findings are deliberately left to Check Completeness.
 return tagCheckSource(structural.filter(i=>{
   const cat=completenessCategory(i);
   return ["Markup","Attributes","IDs & references","Table markup"].includes(cat);
 }),"SCHEMA");
}

function collectCompletenessOnlyIssues(){
 const structural=collectCompletenessStructureIssues();
 const issues=tagCheckSource(structural.filter(i=>{
   const cat=completenessCategory(i);
   return ["Completeness","Empty elements"].includes(cat);
 }),"COMPLETENESS");

 if($("#xrefToggle")?.checked){
   const text=flattenText(state.model?.nodes||[]);
   const refs=[...text.matchAll(/\b\d{2}-\d{2}-\d{2}-\d{3}-\d{4}[A-Z]-[A-Z]\b/g)].map(m=>m[0]);
   const managed=(state.model?.nodes||[]).some(n=>(n.xrefs||[]).length||(n.children||[]).some(c=>(c.xrefs||[]).length));
   if(!refs.length&&!managed)issues.push({type:"info",label:"References",msg:"No DMC-like or managed cross-reference detected.",source:"COMPLETENESS"});
 }

 if(state.model?.meta?.workflow==="Approved"&&state.dirty)
   issues.push({type:"err",label:"Workflow",msg:"Approved content must not contain unsaved modifications.",source:"COMPLETENESS"});

 return issues;
}

function collectBrexCheckIssues(){
 if(!state.model)return [];
 const issues=[],m=state.model.meta,text=flattenText(state.model.nodes),profile=activeBrexProfile();
 profile.rules.forEach(rule=>{
   if(rule.type==="required"&&rule.target==="document"){
     const titles=state.model.nodes.filter(n=>n.type==="title");
     if(titles.length!==1)issues.push({type:"err",label:`BREX ${rule.id}`,msg:rule.message,source:"BREX"});
   }
   if(rule.type==="required"&&rule.target==="procedure"){
     if(!state.model.nodes.some(n=>n.type==="step"))
       issues.push({type:profile===brexProfiles.saab_strict?"err":"warn",label:`BREX ${rule.id}`,msg:rule.message,source:"BREX"});
   }
   if(rule.type==="required"&&rule.target==="step"){
     state.model.nodes.filter(n=>n.type==="step").forEach((n,i)=>{
       if(!(n.children||[]).some(c=>c.type==="cmd"))
         issues.push({type:"err",label:`BREX ${rule.id}`,msg:`Step ${i+1}: ${rule.message}`,source:"BREX"});
     });
   }
   if(rule.type==="requiredText"&&!new RegExp(rule.pattern,"i").test(text))
     issues.push({type:"warn",label:`BREX ${rule.id}`,msg:rule.message,source:"BREX"});
   if(rule.type==="metadata"&&!String(m[rule.field]||"").trim())
     issues.push({type:"err",label:`BREX ${rule.id}`,msg:rule.message,source:"BREX"});
   if(rule.type==="allowedValue"&&!rule.values.includes(String(m[rule.field]||"")))
     issues.push({type:"err",label:`BREX ${rule.id}`,msg:rule.message,source:"BREX"});
   if(rule.type==="applicability"&&!String(state.model.applicability?.expression||"").trim())
     issues.push({type:"err",label:`BREX ${rule.id}`,msg:rule.message,source:"BREX"});
 });
 return issues;
}

function collectLanguageIssues(){
 if(!$("#steToggle")?.checked||!state.model)return [];
 const text=flattenText(state.model.nodes||[]),issues=[];
 const rules=[
  [/\butilize\b/i,"Prefer “use” instead of “utilize”."],
  [/\bprior to\b/i,"Prefer “before” instead of “prior to”."],
  [/;/,"Avoid semicolons in procedural text."],
  [/\bshould\b/i,"Avoid ambiguous modal “should” in mandatory procedures."],
  [/\bmake sure\b/i,"Review “make sure”; a direct verification verb can be clearer."]
 ];
 rules.forEach(([re,msg])=>{if(re.test(text))issues.push({type:"warn",label:"STE",msg,source:"LANGUAGE"})});
 return issues;
}

function showCheckResults(name,issues){
 state.issues=issues;
 renderValidation();
 renderBrexPanel();
 showRightTab("validation");
 if($("#issueBadge"))$("#issueBadge").textContent=issues.length;
 if($("#cursorStatus"))$("#cursorStatus").textContent=`${name}: ${issues.length} issue(s)`;
 return issues;
}

function runValidateCheck(){
 state.lastLearningAction={kind:"validate",check:"schema"};
 if(!state.model)return showCheckResults("Validate",[{type:"info",label:"Document",msg:"No document is open.",source:"SCHEMA"}]);
 return showCheckResults("Validate",collectSchemaValidationIssues());
}

function runBrexCheck(){
 state.lastLearningAction={kind:"brex-check"};
 if(!state.model)return showCheckResults("BREX Check",[{type:"info",label:"Document",msg:"No document is open.",source:"BREX"}]);
 return showCheckResults("BREX Check",collectBrexCheckIssues());
}

function runCompletenessCheck(){
 // Keep kind=validate for the existing Check Completeness learning drills.
 state.lastLearningAction={kind:"validate",check:"completeness"};
 if(!state.model)return showCheckResults("Check Completeness",[{type:"info",label:"Document",msg:"No document is open.",source:"COMPLETENESS"}]);
 const issues=collectCompletenessOnlyIssues();
 showCheckResults("Check Completeness",issues);
 if(!issues.length){
   const cmp=$("#completenessStatus");
   if(cmp){
     cmp.classList.add("check-success-flash");
     setTimeout(()=>cmp.classList.remove("check-success-flash"),2000);
   }
   if($("#cursorStatus"))$("#cursorStatus").textContent="No completeness errors found";
 }
 return issues;
}

function runAllChecks(){
 state.lastLearningAction={kind:"validate",check:"all"};
 if(!state.model)return showCheckResults("Run all checks",[{type:"info",label:"Document",msg:"No document is open.",source:"ALL"}]);
 const issues=[
   ...collectSchemaValidationIssues(),
   ...($("#structureToggle")?.checked?collectBrexCheckIssues():[]),
   ...collectCompletenessOnlyIssues(),
   ...collectLanguageIssues()
 ];
 return showCheckResults("All checks",issues);
}

// Backward-compatible entry point used by workflow, check-in and older drills.
function validate(){
 return runAllChecks();
}

function flattenText(nodes){return nodes.map(n=>[n.text||"",...(n.xrefs||[]).map(x=>x.dmc+" "+(x.title||"")),...(n.children?[flattenText(n.children)]:[])].join(" ")).join(" ")}
function renderValidation(){
 const c={err:0,warn:0,info:0};state.issues.forEach(i=>c[i.type]++);
 $("#errCount").textContent=c.err;$("#warnCount").textContent=c.warn;$("#infoCount").textContent=c.info;
 $("#validationList").innerHTML=state.issues.length?state.issues.map(i=>`<div class="validation-item ${i.type}">
   <div class="kind"><span class="check-source">${esc(i.source||"CHECK")}</span>${esc(i.label)}</div>
   <div>${esc(i.msg)}</div>
 </div>`).join(""):`<div class="validation-item"><div class="kind">No issues</div><div>The current document passed the selected check.</div></div>`;
}

function setWorkflow(next){
 const cur=state.model.meta.workflow;
 const allowed={ "In Work":["In Review"], "In Review":["Approved","In Work"], "Approved":["In Work"] };
 if(!allowed[cur]?.includes(next))return alert(`Transition ${cur} → ${next} is not allowed.`);
 if(next==="In Review"||next==="Approved"){
   const issues=validate();
   if(issues.some(i=>i.type==="err"))return alert("Resolve validation errors before this workflow transition.");
 }
 state.model.meta.workflow=next;$("#workflowInput").value=next;state.history.unshift(hist(`Workflow changed: ${cur} → ${next}`));state.dirty=false;$("#dirtyMark").textContent="";renderAuthor();applyWorkflowLockUi();$("#cursorStatus").textContent=`Workflow: ${next}`;
}


function evaluateBrexRule(rule){
 if(!state.model)return {state:"warn",text:"No document open"};
 const m=state.model.meta,text=flattenText(state.model.nodes);
 if(rule.type==="required"&&rule.target==="document")
   return state.model.nodes.filter(n=>n.type==="title").length===1?{state:"pass",text:"Pass"}:{state:"block",text:"Violation"};
 if(rule.type==="required"&&rule.target==="procedure")
   return state.model.nodes.some(n=>n.type==="step")?{state:"pass",text:"Pass"}:{state:"block",text:"Violation"};
 if(rule.type==="required"&&rule.target==="step"){
   const bad=state.model.nodes.filter(n=>n.type==="step").filter(n=>!(n.children||[]).some(c=>c.type==="cmd"));
   return bad.length?{state:"block",text:`${bad.length} violation(s)`}:{state:"pass",text:"Pass"};
 }
 if(rule.type==="requiredText")
   return new RegExp(rule.pattern,"i").test(text)?{state:"pass",text:"Pass"}:{state:"warn",text:"Missing"};
 if(rule.type==="metadata")
   return String(m[rule.field]||"").trim()?{state:"pass",text:"Pass"}:{state:"block",text:"Missing"};
 if(rule.type==="allowedValue")
   return rule.values.includes(String(m[rule.field]||""))?{state:"pass",text:"Pass"}:{state:"block",text:"Invalid value"};
 if(rule.type==="applicability")
   return String(state.model.applicability?.expression||"").trim()?{state:"pass",text:"Pass"}:{state:"block",text:"Missing"};
 if(rule.type==="forbidElement")return {state:"pass",text:"Authoring filter"};
 return {state:"pass",text:"Active"};
}
function renderBrexPanel(){
 const list=$("#brexRulesList");if(!list)return;
 const profile=activeBrexProfile();
 const r=getNodeById(state.selectedId);
 const context=r?.node?.type||"mainProcedure";
 const schemaAllowed=[...(schema[context]||[])];
 const brexAllowed=validChildrenForSelected();
 const blocked=schemaAllowed.filter(x=>!brexAllowed.includes(x));

 $("#brexDmLabel").textContent=profile.brexDm;
 $("#brexSchemaLabel").textContent="S1000D procedure schema";
 $("#brexContextLabel").textContent=context;
 $("#brexAllowedLabel").textContent=brexAllowed.length?brexAllowed.join(", "):"None";
 if($("#brexProfileSelect"))$("#brexProfileSelect").value=$("#ruleProfileInput")?.value||"saab_strict";

 const filterNote=blocked.length
   ? `<div class="brex-filter-note">Schema also allows: <strong>${blocked.map(esc).join(", ")}</strong>, but the active BREX profile filters ${blocked.length===1?"it":"them"} out in this context.</div>`
   : `<div class="brex-filter-note">The active BREX profile does not further restrict the schema in this context.</div>`;

 list.innerHTML=filterNote+profile.rules.map(rule=>{
   const ev=evaluateBrexRule(rule);
   return `<div class="brex-rule ${ev.state}">
     <div class="rule-top"><span class="rule-id">${esc(rule.id)}</span><span class="rule-state">${esc(ev.text)}</span></div>
     <div>${esc(rule.message)}</div>
   </div>`;
 }).join("");
}
function showRightTab(name){
 $$(".right-pane .pane-tab").forEach(b=>b.classList.toggle("active",b.dataset.righttab===name));
 $("#propertiesTab").classList.toggle("hidden",name!=="properties");$("#applicabilityTab").classList.toggle("hidden",name!=="applicability");$("#referencesTab").classList.toggle("hidden",name!=="references");$("#brexTab").classList.toggle("hidden",name!=="brex");$("#learningTab").classList.toggle("hidden",name!=="learning");$("#validationTab").classList.toggle("hidden",name!=="validation");

 // Durable evidence for Learning drills: the learner must be able to
 // open another right-hand tab, return to Learning, and then click Check.
 state.drillEvidence=state.drillEvidence||{};
 state.drillEvidence.rightTabsOpened=state.drillEvidence.rightTabsOpened||{};
 state.drillEvidence.rightTabsOpened[name]=true;
 state.lastLearningAction={kind:"righttab",name};

 if(name==="references")renderReferences();
 if(name==="brex")renderBrexPanel();
 if(name==="learning")updateLearningModeUi();
}
function syncControlsFromModel(){
 if(!state.model)return;
 const m=state.model.meta,a=state.model.applicability;
 const map={dmc:"dmcInput",issue:"issueInput",lang:"langInput",title:"titleInput",security:"securityInput",workflow:"workflowInput",author:"authorInput",responsible:"responsibleInput",reviewer:"reviewerInput"};
 Object.entries(map).forEach(([k,id])=>$("#"+id).value=m[k]??"");
 $("#appProduct").value=a.product;$("#appVariant").value=a.variant;$("#appSwFrom").value=a.swFrom;$("#appSwTo").value=a.swTo;$("#appSerial").value=a.serial;$("#appExpression").value=a.expression;syncTitles();renderApplicabilityPreview();
}
function syncModelFromControls(){
 if(!state.model)return;
 const m=state.model.meta;m.dmc=$("#dmcInput").value;m.issue=$("#issueInput").value;m.lang=$("#langInput").value;m.title=$("#titleInput").value;m.security=$("#securityInput").value;m.workflow=$("#workflowInput").value;m.author=$("#authorInput").value;m.responsible=$("#responsibleInput").value;m.reviewer=$("#reviewerInput").value;syncTitles();
}
function syncTitles(){$("#currentDocLabel").textContent=`DM ${state.model.meta.dmc}`;$("#docTabTitle").textContent=`${state.model.meta.dmc} — ${state.model.meta.title}`}
function buildApplicabilityExpression({product="",variant="All",swFrom="",swTo=""}={}){
 const parts=[];
 if(product)parts.push(`product == "${product}"`);
 if(variant&&variant!=="All"){
   const variantCode=/^Variant\s+(.+)$/i.exec(variant)?.[1]||variant;
   parts.push(`variant == "${variantCode}"`);
 }
 if(swFrom)parts.push(`software >= "${swFrom}"`);
 if(swTo)parts.push(`software <= "${swTo}"`);
 return parts.join(" AND ");
}
function compareVersionStrings(a,b){
 const pa=String(a||"").split(".").map(x=>parseInt(x,10)||0);
 const pb=String(b||"").split(".").map(x=>parseInt(x,10)||0);
 const len=Math.max(pa.length,pb.length);
 for(let i=0;i<len;i++){const d=(pa[i]||0)-(pb[i]||0);if(d)return d}
 return 0;
}
function renderApplicabilityPreview(){const a=state.model.applicability;$("#applicabilityPreview").innerHTML=`<strong>Current applicability</strong><br>Product: ${esc(a.product)}<br>Variant: ${esc(a.variant)}<br>Software: ${esc(a.swFrom)} → ${esc(a.swTo)}<br>Effectivity: ${esc(a.serial)}<br><br><code>${esc(a.expression)}</code>`}

function saveLocal(){
 syncModelFromControls();persistCurrentDocument();saveProjects();
 state.dirty=false;$("#dirtyMark").textContent="";
 state.history.unshift(hist("Saved project"));
 state.lastLearningAction={kind:"save"};
 state.drillEvidence=state.drillEvidence||{};
 state.drillEvidence.saved=true;
 $("#cursorStatus").textContent="Project saved for this session";
}
function loadLocal(){return loadProjects()}

function modelToMarkdown(){
 if(!state.model)return "";
 let o=`# ${state.model.meta.title}\n\n`;
 state.model.nodes.forEach(n=>{
  if(n.type==="title")return;
  if(n.type==="sectionTitle")o+=`## ${n.text}\n\n`;
  else if(n.type==="para")o+=`${n.text}\n\n`;
  else if(n.type==="warning")o+=`> **WARNING:** ${n.text}\n\n`;
  else if(n.type==="caution")o+=`> **CAUTION:** ${n.text}\n\n`;
  else if(n.type==="note")o+=`> **NOTE:** ${n.text}\n\n`;
  else if(n.type==="step"){o+=`1. ${n.text}\n`; (n.children||[]).forEach(c=>o+=`   - ${c.text}\n`);o+="\n"}
  else if(n.type==="codeblock")o+=`\`\`\`text\n${n.text}\n\`\`\`\n\n`;
  else if(n.type==="table"){const r=n.rows||[];if(r.length){o+=`| ${r[0].join(" | ")} |\n| ${r[0].map(()=> "---").join(" | ")} |\n`;r.slice(1).forEach(x=>o+=`| ${x.join(" | ")} |\n`);o+="\n"}}
 });return o;
}
function markdownToModel(md){
 const lines=md.replace(/\r/g,"").split("\n"),nodes=[];let inCode=false,buf=[];
 for(const l of lines){
  if(l.startsWith("```")){if(inCode){nodes.push({id:uid(),type:"codeblock",text:buf.join("\n")});buf=[];inCode=false}else inCode=true;continue}
  if(inCode){buf.push(l);continue}
  if(/^# /.test(l)){state.model.meta.title=l.slice(2);nodes.push({id:uid(),type:"title",text:l.slice(2)})}
  else if(/^## /.test(l))nodes.push({id:uid(),type:"sectionTitle",text:l.slice(3)});
  else if(/^>\s*\*\*WARNING:\*\*/i.test(l))nodes.push({id:uid(),type:"warning",text:l.replace(/^>\s*\*\*WARNING:\*\*\s*/i,"")});
  else if(/^>\s*\*\*NOTE:\*\*/i.test(l))nodes.push({id:uid(),type:"note",text:l.replace(/^>\s*\*\*NOTE:\*\*\s*/i,"")});
  else if(/^\d+\.\s+/.test(l))nodes.push({id:uid(),type:"step",text:l.replace(/^\d+\.\s+/,""),children:[{id:uid(),type:"cmd",text:"Add command."}]});
  else if(l.trim())nodes.push({id:uid(),type:"para",text:l.trim()});
 }state.model.nodes=nodes.length?nodes:[{id:uid(),type:"title",text:"Imported Markdown"}];
}


function resetDemo(){
 state.undoStack=[];state.redoStack=[];updateUndoRedoButtons();
 state.rootSelected=false;
 state.trainingExercise=null;
 if(!confirm("Restore the built-in demo project? Current sandbox projects and unsaved changes will be discarded."))return;
 const demo=createStartupDemoProject();
 state.projects=[demo];
 state.activeProjectId=demo.id;
 state.model=null;
 state.history=[];
 state.selectedId=null;
 state.issues=[];
 state.dirty=false;
 localStorage.removeItem("techauthorProjectsV24");
 saveProjects({persistCurrent:false});
 loadActiveDocument();
 setMode("content");
 $("#cursorStatus").textContent="Demo project restored";
 toast("Built-in demo restored");
}

function showModal(title,body,actions=`<button class="btn" data-close>Close</button>`){$("#modal").innerHTML=`<div class="modal-head">${title}</div><div class="modal-body">${body}</div><div class="modal-actions">${actions}</div>`;$("#modalBackdrop").classList.remove("hidden");$$("[data-close]").forEach(b=>b.onclick=()=>{$("#modalBackdrop").classList.add("hidden");$("#modalBackdrop").dataset.menu=""})}
function showExport(){showModal("Export document",`<div class="export-grid">
<button class="export-option" data-export="xml"><strong>S1000D-style XML</strong><span>Structured demo XML</span></button>
<button class="export-option" data-export="md"><strong>Markdown</strong><span>Software documentation format</span></button>
<button class="export-option" data-export="json"><strong>Document JSON</strong><span>Current document + metadata + history</span></button>
<button class="export-option" data-export="html"><strong>Standalone HTML</strong><span>Readable publication preview</span></button></div>`);$$("[data-export]").forEach(b=>b.onclick=()=>doExport(b.dataset.export))}
function download(name,content,type="text/plain"){const blob=new Blob([content],{type}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function doExport(k){const b=(state.model.meta.dmc||"document").replace(/[^\w-]+/g,"_");if(k==="xml")download(b+".xml",modelToXml(),"application/xml");if(k==="md")download(b+".md",modelToMarkdown(),"text/markdown");if(k==="json")download(b+".json",JSON.stringify({model:state.model,history:state.history},null,2),"application/json");if(k==="html"){renderPreview();download(b+".html",`<!doctype html><meta charset="utf-8"><title>${esc(state.model.meta.title)}</title><body style="font-family:Arial;max-width:900px;margin:40px auto;line-height:1.5">${$("#previewPane").innerHTML}</body>`,"text/html")}$("#modalBackdrop").classList.add("hidden")}
function showHistory(){showModal("Document history",`<div class="history-list">${state.history.map(h=>`<div class="history-item"><strong>${h.time} — ${esc(h.user)}</strong><br>${esc(h.text)}</div>`).join("")}</div>`);$$(".bottom-tab").forEach(b=>b.classList.toggle("active",b.dataset.mode==="content"))}
function showHelp(){showModal("TechAuthor Learner — Help",`
<div class="learning-card">
  <h4>What this is</h4>
  <p>A browser-based <strong>Arbortext-like structured authoring trainer</strong> (v7.13). Practice Document Map navigation, Quick Tags, context-sensitive insert, Modify Attributes, Check Completeness, and an S1000D-style workflow without a full CSDB.</p>
</div>
<div class="learning-card" style="margin-top:8px">
  <h4>Learning Mode</h4>
  <ul style="margin:6px 0 0 18px;padding:0;font-size:12px;line-height:1.45">
    <li><strong>Beginner Drills</strong> — 5 chapters / 100 outcome-checked drills</li>
    <li><strong>Arbortext Basics</strong> — Tag Display, Quick Tags, Modify Attributes, Document Map</li>
    <li><strong>S1000D Practice</strong> — schema, BREX, STE, applicability, references, workflow</li>
  </ul>
</div>
<div class="learning-card" style="margin-top:8px">
  <h4>What this is not</h4>
  <p>Not PTC Arbortext. Not a complete S1000D implementation, official BREX ruleset, or production CSDB. Approved documents are locked until returned to the author.</p>
</div>
<p class="small-muted" style="margin-top:10px">See README.md for the full version history (v2 → v7.13).</p>`)}




// v2.8: Always start from a clean built-in demo after a browser reload.
// This prevents old test documents/copies in localStorage from appearing again.
localStorage.removeItem("techauthorProjectsV24");
const startupDemo=createStartupDemoProject();
state.projects=[startupDemo];
state.activeProjectId=startupDemo.id;
saveProjects({persistCurrent:false});
loadActiveDocument();
renderTree();

if($("#emptyNewDocBtn"))$("#emptyNewDocBtn").onclick=newDocumentInProject;
if($("#emptyImportBtn"))$("#emptyImportBtn").onclick=()=>$("#fileInput")?.click();
if($("#treeSearch"))$("#treeSearch").oninput=renderTree;
if($("#clearTreeSearch"))$("#clearTreeSearch").onclick=()=>{$("#treeSearch").value="";renderTree()};
$$(".left-pane .pane-tab").forEach(b=>b.onclick=()=>{state.leftMode=b.dataset.lefttab;$$(".left-pane .pane-tab").forEach(x=>x.classList.toggle("active",x===b));renderTree()});
if($("#expandTreeBtn"))$("#expandTreeBtn").onclick=expandAllTree;
if($("#collapseTreeBtn"))$("#collapseTreeBtn").onclick=collapseAllTree;
if($("#syncTreeBtn"))$("#syncTreeBtn").onclick=()=>{if(state.leftMode==="document")revealSelectedInEditor();else renderTree()};
if($("#backToCsdbBtn"))$("#backToCsdbBtn").onclick=backToCsdb;
if($("#checkInBtn"))$("#checkInBtn").onclick=checkInCurrent;
if($("#insertFromCsdbBtn"))$("#insertFromCsdbBtn").onclick=()=>{state.leftMode="resources";$$(".left-pane .pane-tab").forEach(b=>b.classList.toggle("active",b.dataset.lefttab==="resources"));renderTree()};
if($("#saveBtn"))$("#saveBtn").onclick=saveLocal;
if($("#resetDemoBtn"))$("#resetDemoBtn").onclick=resetDemo;
if($("#openBtn"))$("#openBtn").onclick=()=>$("#fileInput")?.click();
if($("#exportBtn"))$("#exportBtn").onclick=showExport;
if($("#addCommentBtn"))$("#addCommentBtn").onclick=addComment;
if($("#findReplaceBtn"))$("#findReplaceBtn").onclick=showFindReplace;

function renderElementCoach(){
 const host=$("#elementCoachContent");if(!host)return;
 const r=getNodeById(state.selectedId),type=r?.node?.type||"mainProcedure",lesson=elementLessons[type],level="beginner",lp=activeLearningProfile();
 const ctx=`<div class="learning-context-card"><strong>${esc(lp.label)} · ${esc(lp.focus)}</strong>${esc(lp.goals[0])}</div>`;
 if(!lesson){host.innerHTML=ctx+`<div class="learning-card"><h4>${esc(type)}</h4><p>No element-specific lesson yet.</p><ul>${lp.goals.map(g=>`<li>${esc(g)}</li>`).join("")}</ul></div>`;return}
 const schemaAllowed=schema[type]||[],brexAllowed=validChildrenForSelected(),blocked=schemaAllowed.filter(x=>!brexAllowed.includes(x));
 host.innerHTML=ctx+`<div class="learning-card"><h4>&lt;${esc(type)}&gt;</h4><span class="learning-badge schema">Schema</span><span class="learning-badge brex">BREX</span><p>${esc(lesson.summary)}</p><p><strong>Role:</strong> ${esc(lesson.role)}</p><p><strong>Typical parent:</strong> ${esc((lesson.parents||[]).join(", ")||"—")}</p><p><strong>Schema children:</strong> ${esc(schemaAllowed.join(", ")||"None")}</p><p><strong>BREX permits:</strong> ${esc(brexAllowed.join(", ")||"None")}</p>${blocked.length?`<p><strong>Filtered by BREX:</strong> ${esc(blocked.join(", "))}</p>`:""}${level!=="assessment"?`<div class="learning-callout learning-hint"><strong>Good practice</strong><br>${esc(lesson.good)}</div>`:""}${level==="beginner"?`<div class="learning-callout learning-hint"><strong>Common mistake</strong><br>${esc(lesson.common)}</div>`:""}</div>`;
}

function renderArbortextBasicDetail(){
 const key=state.selectedBasic||"tags",m=arbortextBasicModules[key],host=$("#arbortextBasicDetail");
 if(!host||!m)return;
 $$("[data-basic]").forEach(b=>b.classList.toggle("active",b.dataset.basic===key));
 host.innerHTML=`<h4>${esc(m.title)}</h4><p>${esc(m.intro)}</p><ol>${m.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol><div class="learning-callout"><strong>Trainer focus</strong>Repeat the interaction until the editor behavior feels predictable.</div>`;
}
function loadExerciseByKey(key){
  const ex=key?exercises[key]:null;
  if(!ex||!state.model)return false;
  pushUndo(`Load exercise: ${ex.title}`);

  state.trainingExercise={id:key,title:ex.title};
  state.model.meta.title=ex.title;
  state.model.meta.dmc="TRAINING-"+String(key).toUpperCase();
  state.model.meta.workflow="In Work";
  state.model.nodes=JSON.parse(JSON.stringify(ex.nodes()));
  state.selectedId=state.model.nodes[0]?.id||null;
  state.rootSelected=false;
  state.issues=[];
  markDirty();

  renderAuthor();renderTree();syncControlsFromModel();
  if(typeof renderDmcBreakdown==="function")renderDmcBreakdown();
  if(typeof renderApplicabilityPreview==="function")renderApplicabilityPreview();
  renderReferences();renderBrexPanel();renderElementCoach();
  refreshInsertOptions();updateContext();syncSourcePassive();renderPreview();
  if($("#currentDocLabel"))$("#currentDocLabel").textContent=`DM ${state.model.meta.dmc}`;
  if($("#cursorStatus"))$("#cursorStatus").textContent=`Exercise loaded: ${ex.title}`;
  if($("#exerciseScore"))$("#exerciseScore").innerHTML="";
  toast("Exercise loaded");
  return true;
}

function startSelectedBasicExercise(){
 const m=arbortextBasicModules[state.selectedBasic||"tags"];if(!m)return;
 // Arbortext Basics has its own exercise IDs. Do not route them through the
 // hidden S1000D Practice selector, whose context filter can remove those IDs.
 if(!loadExerciseByKey(m.exercise))return alert("This Arbortext exercise is unavailable.");
 showLearningView("arbortext");
 renderArbortextBasicDetail();
 toast(`${m.title} exercise loaded`);
}

function loadExercise(){
  const select=$("#exerciseSelect");
  const key=select?.value;
  if(!loadExerciseByKey(key))return alert("Select an exercise first.");
}
function exerciseRequirements(key){
 const text=()=>flattenText(state.model?.nodes||[]);
 const allStepsHaveCmd=()=>state.model?.nodes.filter(n=>n.type==="step").every(n=>(n.children||[]).some(c=>c.type==="cmd"));
 const maps={
  rollback:guidedTask.requirements.map(r=>[r.label,r.test]),
  schema:[
   ["One title",()=>state.model?.nodes.filter(n=>n.type==="title").length===1],
   ["At least one step",()=>state.model?.nodes.some(n=>n.type==="step")],
   ["Every step has a cmd",allStepsHaveCmd]
  ],
  brex:[
   ["One title",()=>state.model?.nodes.filter(n=>n.type==="title").length===1],
   ["Every step has a cmd",allStepsHaveCmd],
   ["State MAINTENANCE mode",()=>/MAINTENANCE mode/i.test(text())],
   ["Applicability is stated",()=>!!String(state.model?.applicability?.expression||"").trim()]
  ],
  ste:[
   ["No “prior to”",()=>!/\bprior to\b/i.test(text())],
   ["No “should”",()=>!/\bshould\b/i.test(text())],
   ["No “utilize”",()=>!/\butilize\b/i.test(text())],
   ["No semicolon",()=>!/[;]/.test(text())]
  ],
  xref:[
   ["Fault Isolation DM is referenced",()=>text().includes("23-31-01-310-801A-A")||state.model?.nodes.some(n=>(n.xrefs||[]).some(x=>x.dmc==="23-31-01-310-801A-A"))]
  ],
  mixed:[
   ["Every step has a cmd",allStepsHaveCmd],
   ["No “prior to”",()=>!/\bprior to\b/i.test(text())],
   ["No “should”",()=>!/\bshould\b/i.test(text())],
   ["No “utilize”",()=>!/\butilize\b/i.test(text())],
   ["State MAINTENANCE mode",()=>/MAINTENANCE mode/i.test(text())]
  ],
  "ctx-procedure":[
   ["At least one step",()=>state.model?.nodes.some(n=>n.type==="step")],
   ["Every step has a cmd",allStepsHaveCmd],
   ["Safety context is present",()=>state.model?.nodes.some(n=>n.type==="warning"||n.type==="note")]
  ],
  "ctx-fault":[
   ["Contains troubleshooting action",()=>state.model?.nodes.some(n=>n.type==="step")],
   ["Every step has a cmd",allStepsHaveCmd],
   ["Has a managed or textual DM reference",()=>/\d{2}-\d{2}-\d{2}-\d{3}-\d{4}[A-Z]-[A-Z]/.test(text())||state.model?.nodes.some(n=>(n.xrefs||[]).length)]
  ],
  "ctx-safety":[
   ["Contains warning or note",()=>state.model?.nodes.some(n=>n.type==="warning"||n.type==="note")],
   ["Warning precedes the first step",()=>{const w=state.model?.nodes.findIndex(n=>n.type==="warning"),s=state.model?.nodes.findIndex(n=>n.type==="step");return w>=0&&(s<0||w<s)}]
  ],
  "ctx-system":[
   ["Contains descriptive paragraph",()=>state.model?.nodes.some(n=>n.type==="para")],
   ["Contains section heading",()=>state.model?.nodes.some(n=>n.type==="sectionTitle")]
  ],
  "ctx-operator":[
   ["Contains operational step",()=>state.model?.nodes.some(n=>n.type==="step")],
   ["Every step has a cmd",allStepsHaveCmd]
  ],
  "ctx-software":[
   ["Contains structured table",()=>state.model?.nodes.some(n=>n.type==="table")],
   ["Applicability is stated",()=>!!String(state.model?.applicability?.expression||"").trim()],
   ["Has a managed or textual DM reference",()=>/\d{2}-\d{2}-\d{2}-\d{3}-\d{4}[A-Z]-[A-Z]/.test(text())||state.model?.nodes.some(n=>(n.xrefs||[]).length)]
  ],
  "ctx-reference":[
   ["Contains structured table",()=>state.model?.nodes.some(n=>n.type==="table")],
   ["Contains a reference",()=>/\d{2}-\d{2}-\d{2}-\d{3}-\d{4}[A-Z]-[A-Z]/.test(text())||state.model?.nodes.some(n=>(n.xrefs||[]).length)]
  ]
 };
 return maps[key]||[];
}

function renderExerciseInfo(){
 const select=$("#exerciseSelect");if(!select)return;
 const catalog=contextExerciseCatalog(),prev=select.value;
 select.innerHTML=catalog.map(x=>`<option value="${x.id}">${esc(x.label)}</option>`).join("");
 if(catalog.some(x=>x.id===prev))select.value=prev;
 const ex=exercises[select.value],lp=activeLearningProfile();
 if(!ex)return;
 const goals=exerciseRequirements(select.value).map(([label])=>label);
 $("#exerciseInfo").innerHTML=`<div class="learning-context-card"><strong>${esc(lp.label)}</strong>${esc(lp.focus)}</div>
 <h4>${esc(ex.title)}</h4>
 <p>${esc(ex.description)}</p>
 <div class="s1000-goals"><strong>Goals</strong>${goals.map((g,i)=>`<div class="learning-goal"><span class="num">${i+1}.</span><span>${esc(g)}</span></div>`).join("")}</div>
 <div class="learning-callout learning-hint"><strong>How it works</strong><br>Load the exercise, edit the DM with the normal authoring tools, then use Check progress.</div>`;
 if($("#exerciseScore"))$("#exerciseScore").innerHTML="";
}

function scoreSelectedExercise(){
 if(!state.model)return;
 const key=state.trainingExercise?.id||$("#exerciseSelect")?.value;
 const tests=exerciseRequirements(key);
 if(!tests.length)return;
 const results=tests.map(([label,test])=>{let pass=false;try{pass=!!test()}catch(e){}return{label,pass}});
 const passed=results.filter(r=>r.pass).length;
 const score=Math.round(passed/results.length*100);
 if($("#exerciseScore"))$("#exerciseScore").innerHTML=`<div class="score-total">${score}%</div>${results.map(r=>`<div class="score-row ${r.pass?"pass":"fail"}"><strong>${r.pass?"✓":"✕"} ${esc(r.label)}</strong></div>`).join("")}`;
}

function renderGuidedTask(){
 const lp=activeLearningProfile(),type=inferLearningDmType(),card=$("#guidedTaskCard");if(!card)return;
 const goals=type==="procedure"?guidedTask.requirements.map(r=>r.label):lp.goals;
 card.innerHTML=`<div class="learning-context-card"><strong>Detected DM type: ${esc(lp.label)}</strong>${esc(lp.focus)}</div><h4>${esc(type==="procedure"?guidedTask.title:lp.challenge)}</h4><p>${esc(type==="procedure"?guidedTask.scenario:"Use the currently open DM as the training object. The coach adapts its goals to this DM type.")}</p>${goals.map((g,i)=>`<div class="learning-goal"><span class="num">${i+1}.</span><span>${esc(g)}</span></div>`).join("")}<div class="learning-callout learning-hint"><strong>Hint</strong><br>Use the normal authoring tools; Learning Mode follows the open DM.</div>`;
}
function startGuidedTask(){
 state.rootSelected=false;
 pushUndo("Start guided task");
 if(!state.model)return;
 const type=inferLearningDmType(),lp=activeLearningProfile();
 if(type==="procedure"){
   state.trainingExercise={id:"guided-procedure",title:"Guided task — Software rollback procedure"};state.model.meta.title="Software rollback procedure";state.model.meta.dmc="TRAINING-ROLLBACK-001";state.model.meta.workflow="In Work";state.model.applicability.expression='product == "Surface Sensor Software"';
   state.model.nodes=[{id:uid(),type:"title",text:"Software rollback procedure"},{id:uid(),type:"para",text:"Create the rollback procedure from this starter structure."},{id:uid(),type:"sectionTitle",text:"Procedure"}];state.selectedId=state.model.nodes[0].id;renderAuthor();renderTree();markDirty();$("#guidedScore").innerHTML="";toast("Guided task started");
 }else{
   $("#guidedScore").innerHTML=`<div class="learning-card"><strong>${esc(lp.label)} coaching started.</strong><p>Edit the current DM and use the goals above.</p></div>`;
   toast(`${lp.label} coaching started`);
 }
}
function scoreGuidedTask(){
 if(!state.model)return;
 const type=inferLearningDmType(),lp=activeLearningProfile(),text=flattenText(state.model.nodes||[]);
 let tests;
 if(type==="procedure")tests=guidedTask.requirements.map(r=>[r.label,r.test]);
 else tests={
  fault:[["Has a title",()=>state.model.nodes.some(n=>n.type==="title")],["Contains troubleshooting action",()=>state.model.nodes.some(n=>n.type==="step"||n.type==="para")],["Has a DM reference",()=>/\d{2}-\d{2}-\d{2}-\d{3}-\d{4}[A-Z]-[A-Z]/.test(text)||state.model.nodes.some(n=>(n.xrefs||[]).length)]],
  safety:[["Has a title",()=>state.model.nodes.some(n=>n.type==="title")],["Contains warning or note",()=>state.model.nodes.some(n=>n.type==="warning"||n.type==="note")],["Warning is before first step",()=>{const w=state.model.nodes.findIndex(n=>n.type==="warning"),s=state.model.nodes.findIndex(n=>n.type==="step");return w>=0&&(s<0||w<s)}]],
  system:[["Has a title",()=>state.model.nodes.some(n=>n.type==="title")],["Contains descriptive paragraph",()=>state.model.nodes.some(n=>n.type==="para")],["Contains section heading",()=>state.model.nodes.some(n=>n.type==="sectionTitle")]],
  operator:[["Has a title",()=>state.model.nodes.some(n=>n.type==="title")],["Contains operational step",()=>state.model.nodes.some(n=>n.type==="step")],["Steps contain cmd",()=>state.model.nodes.filter(n=>n.type==="step").every(n=>(n.children||[]).some(c=>c.type==="cmd"))]],
  software:[["Has a title",()=>state.model.nodes.some(n=>n.type==="title")],["Contains structured table",()=>state.model.nodes.some(n=>n.type==="table")],["Applicability is stated",()=>!!String(state.model.applicability?.expression||"").trim()],["Has a DM reference",()=>/\d{2}-\d{2}-\d{2}-\d{3}-\d{4}[A-Z]-[A-Z]/.test(text)||state.model.nodes.some(n=>(n.xrefs||[]).length)]],
  reference:[["Has a title",()=>state.model.nodes.some(n=>n.type==="title")],["Contains structured table",()=>state.model.nodes.some(n=>n.type==="table")],["Contains reference",()=>/\d{2}-\d{2}-\d{2}-\d{3}-\d{4}[A-Z]-[A-Z]/.test(text)||state.model.nodes.some(n=>(n.xrefs||[]).length)]]
 }[type]||[];
 const results=tests.map(([label,test])=>{let pass=false;try{pass=!!test()}catch(e){}return{label,pass}});
 const passed=results.filter(r=>r.pass).length,score=results.length?Math.round(passed/results.length*100):0;
 $("#guidedScore").innerHTML=`<div class="score-total">${score}% · ${esc(lp.label)}</div>${results.map(r=>`<div class="score-row ${r.pass?"pass":"fail"}"><strong>${r.pass?"✓":"✕"} ${esc(r.label)}</strong></div>`).join("")}`;
}
function updateLearningModeUi(){
 try{
   const lp=activeLearningProfile();
   if($("#learningDmType"))$("#learningDmType").textContent=`DM type: ${lp.label} · ${lp.focus}`;
   if(typeof renderElementCoach==="function")renderElementCoach();
   if(typeof renderExerciseInfo==="function")renderExerciseInfo();
   if(typeof arbortextBasicModules!=="undefined"&&typeof renderArbortextBasicDetail==="function")renderArbortextBasicDetail();
   if(typeof renderDrillSelectors==="function")renderDrillSelectors();
   if(typeof updateDrillStats==="function")updateDrillStats();
   if(typeof renderBeginnerStartState==="function")renderBeginnerStartState();
   if(typeof renderScenarioSelector==="function")renderScenarioSelector();
 }catch(err){
   console.error("Learning Mode initialization failed",err);
   if($("#cursorStatus"))$("#cursorStatus").textContent=`Learning error: ${err.message}`;
   const card=$("#drillCard");
   if(card)card.innerHTML=`<div class="drill-feedback wrong"><strong>Learning Mode error</strong><div>${esc(err.message)}</div></div>`;
 }
}
$$(".right-pane .pane-tab").forEach(b=>b.onclick=()=>showRightTab(b.dataset.righttab));
$("#learningModeBtn").onclick=()=>{showRightTab("learning");showLearningView("beginner");updateLearningModeUi()};
$("#beginnerDrillsBtn").onclick=()=>showLearningView("beginner");
$("#arbortextBasicsBtn").onclick=()=>showLearningView("arbortext");
$("#structuredPracticeBtn").onclick=()=>showLearningView("structured");
$("#scenarioPracticeBtn").onclick=()=>showLearningView("scenario");
$("#elementCoachBtn").onclick=()=>showLearningView("element");
$("#scenarioStartBtn").onclick=()=>startScenario();
$("#scenarioCheckBtn").onclick=()=>checkScenario();
$("#scenarioHintBtn").onclick=()=>showScenarioHint();
$("#scenarioNextBtn").onclick=()=>nextScenario();
$("#startDrillsBtn").onclick=startBeginnerDrills;
$("#checkDrillBtn").onclick=checkCurrentDrill;
$("#nextDrillBtn").onclick=nextBeginnerDrill;
$$("[data-basic]").forEach(b=>b.onclick=()=>{state.selectedBasic=b.dataset.basic;renderArbortextBasicDetail()});
$("#startBasicExerciseBtn").onclick=startSelectedBasicExercise;

$("#loadExerciseBtn").onclick=loadExercise;
$("#exerciseSelect").onchange=renderExerciseInfo;
$("#scoreExerciseBtn").onclick=scoreSelectedExercise;
$("#validateSideBtn").onclick=runAllChecks;$("#tagModeSelect").value=state.tagMode||"partial";$("#quickTagsBtn").onclick=()=>toggleQuickTags($("#quickTagsBtn"));$("#modifyAttributesBtn").onclick=showModifyAttributes;
$("#previewBtn").onclick=()=>setMode("preview");
$("#elementSelect").onchange=()=>{};
if($("#insertPositionSelect"))$("#insertPositionSelect").onchange=()=>{refreshInsertOptions();updateContext();};
$("#insertXrefBtn").onclick=showXrefDialog;$("#tableEditorBtn").onclick=showTableEditor;
$("#deleteElementBtn").onclick=deleteSelected;$("#moveUpBtn").onclick=()=>moveSelected(-1);$("#moveDownBtn").onclick=()=>moveSelected(1);

$("#undoBtn").onclick=undoAction;$("#redoBtn").onclick=redoAction;updateUndoRedoButtons();




function updateResponsiveLearningLayout(){
 const app=document.querySelector(".app")||document.body;
 const w=window.innerWidth||document.documentElement.clientWidth||1400;
 app.classList.toggle("auto-compact-learning",w<=1280);
 app.classList.toggle("auto-tight-learning",w<=1120);
}
window.addEventListener("resize",updateResponsiveLearningLayout);
if(document.readyState==="loading"){
 document.addEventListener("DOMContentLoaded",updateResponsiveLearningLayout,{once:true});
}else{
 updateResponsiveLearningLayout();
}


function closeChecksMenu(){
 $("#checksMenu")?.classList.add("hidden");
 $("#checksBtn")?.classList.remove("active");
}
function toggleChecksMenu(){
 const menu=$("#checksMenu");if(!menu)return;
 const opening=menu.classList.contains("hidden");
 if(opening){menu.classList.remove("hidden");$("#checksBtn")?.classList.add("active")}
 else closeChecksMenu();
}
document.addEventListener("click",e=>{
 const action=e.target.closest?.("[data-check-action]")?.dataset.checkAction;
 if(action){
   e.preventDefault();e.stopPropagation();
   closeChecksMenu();
   if(action==="validate")return runValidateCheck();
   if(action==="brex")return runBrexCheck();
   if(action==="completeness")return runCompletenessCheck();
   if(action==="all")return runAllChecks();
 }
 if(!e.target.closest?.("#checksDropdown"))closeChecksMenu();
},true);

function closeInsertMarkupPopup(){$("#insertMarkupPopup")?.remove()}
document.addEventListener("mousedown",e=>{
 const p=$("#insertMarkupPopup");if(!p)return;
 if(p.contains(e.target)||e.target.closest?.("#elementSelect"))return;
 p.remove();
},true);

document.addEventListener("keydown",e=>{
 const k=e.key.toLowerCase(),mod=e.ctrlKey||e.metaKey;
 if(mod&&e.shiftKey&&k==="l"){e.preventDefault();return cycleTagMode()}
 if(mod&&k==="s"){e.preventDefault();noteShortcut("save");return saveLocal()}
 if(mod&&k==="f"&&!e.shiftKey){e.preventDefault();noteShortcut("find");return showFindReplace("text")}
 if(mod&&e.shiftKey&&k==="f"){e.preventDefault();return findAgain()}
 if(mod&&k==="d"){e.preventDefault();noteShortcut("modify-attributes");return showModifyAttributes()}
 if(mod&&k==="m"&&!e.shiftKey){if(e.ctrlKey&&!e.metaKey)return; e.preventDefault();return focusInsertMarkup()}
 if(mod&&e.shiftKey&&k==="m"){if(e.ctrlKey&&!e.metaKey)return; e.preventDefault();return showInsertMarkupDialog()}
 if(e.altKey&&mod&&k==="o"){e.preventDefault();return showDocumentMapView()}
 if(e.altKey&&mod&&k==="n"){e.preventDefault();return showNormalView()}
 if(mod&&k==="l"){e.preventDefault();return refreshEditorScreen()}
 if(e.key==="F6"){e.preventDefault();return cycleFocus()}
 if(e.altKey&&e.shiftKey&&k==="t"){e.preventDefault();return insertTableShortcut()}
 if(mod&&e.key===">"){e.preventDefault();return changeMagnification(1)}
 if(mod&&e.key==="<"){e.preventDefault();return changeMagnification(-1)}
},true);
document.addEventListener("keydown",e=>{
 if(handleQuickTagsKey(e))return;
 const active=document.activeElement;
 const typing=active && (active.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(active.tagName));
 if(e.key==="Enter" && !typing && state.quickTagsEnabled && (state.selectedId||state.rootSelected)){
   e.preventDefault();openQuickTags(active);
 }
 if(e.key==="Escape"){closeQuickTags();closeInsertMarkupPopup();const mb=$("#modalBackdrop");if(mb&&!mb.classList.contains("hidden")){mb.classList.add("hidden");mb.dataset.menu="";}}
});

document.addEventListener("keydown",e=>{
 const mod=e.metaKey||e.ctrlKey;
 if(!mod)return;
 const k=String(e.key||"").toLowerCase();
 if(k!=="c"&&k!=="v")return;

 const active=document.activeElement;
 const typing=active&&(active.isContentEditable||/INPUT|TEXTAREA/.test(active.tagName));

 if(k==="c"){
   // Preserve normal text copy when the learner has highlighted text.
   if(hasSelectedTextInEditor()||typing&&window.getSelection?.()?.toString())return;
   if(copySelectedElement())e.preventDefault();
   return;
 }

 if(k==="v"){
   // Inside editable text, use the normal/plain-text paste handler.
   if(active?.isContentEditable)return;
   if(/INPUT|TEXTAREA/.test(active?.tagName||""))return;
   if(state.structClipboard&&pasteCopiedElement())e.preventDefault();
 }
},true);

document.addEventListener("keydown",e=>{
 if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==="z"){
   e.preventDefault();
   if(e.shiftKey)redoAction();else undoAction();
 }
 if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==="y"){
   e.preventDefault();redoAction();
 }
});
$("#themeBtn").onclick=()=>document.body.classList.toggle("compact");
$("#submitReviewBtn").onclick=()=>setWorkflow("In Review");$("#approveBtn").onclick=()=>setWorkflow("Approved");$("#returnBtn").onclick=()=>setWorkflow("In Work");
$("#workflowInput").onchange=()=>{$("#workflowInput").value=state.model.meta.workflow;alert("Use the workflow action buttons to change state.")};
$("#applyElementPropsBtn").onclick=()=>{const r=getNodeById(state.selectedId);if(!r)return;r.node.xmlId=$("#selectedElementId").value.trim();r.node.className=$("#selectedElementClass").value.trim();state.history.unshift(hist(`Updated properties on <${r.node.type}>`));markDirty();syncSourcePassive()};
$("#applyApplicabilityBtn").onclick=()=>{}; // handled by the capture-phase critical dispatcher
$("#ruleProfileInput").addEventListener("change",()=>{
  if($("#brexProfileSelect"))$("#brexProfileSelect").value=$("#ruleProfileInput").value;
  refreshInsertOptions();renderBrexPanel();validate();
});
$("#brexProfileSelect").addEventListener("change",()=>{
  $("#ruleProfileInput").value=$("#brexProfileSelect").value;
  refreshInsertOptions();renderBrexPanel();validate();
});$$(".prop-header").forEach(b=>b.onclick=()=>b.closest(".prop-section").classList.toggle("open"));
["dmcInput","issueInput","langInput","titleInput","securityInput","authorInput","responsibleInput","reviewerInput"].forEach(id=>$("#"+id).addEventListener("change",()=>{syncModelFromControls();markDirty();syncSourcePassive()}));

$("#sourceEditor").addEventListener("input",()=>{$("#cursorStatus").textContent="XML modified — press Apply XML in Edit menu";markDirty()});

$("#fileInput").addEventListener("change",async e=>{
 const f=e.target.files[0];if(!f)return;const t=await f.text(),ext=f.name.toLowerCase().split(".").pop();
 try{
  if(ext==="xml"||ext==="dita")xmlToModel(t);
  else if(ext==="md"||ext==="markdown")markdownToModel(t);
  else if(ext==="json"){const p=JSON.parse(t);if(p.model)state.model=p.model;else if(p.nodes)state.model=p;if(p.history)state.history=p.history}
  else state.model.nodes=[{id:uid(),type:"title",text:f.name},{id:uid(),type:"codeblock",text:t}];
  state.selectedId=state.model.nodes[0]?.id;syncControlsFromModel();renderAuthor();state.history.unshift(hist(`Imported ${f.name}`));markDirty();persistCurrentDocument();setMode("content");
 }catch(err){alert("Import failed: "+err.message)} e.target.value="";
});

$$(".menubar button").forEach(b=>b.onclick=()=>{
 const m=b.dataset.menu;
 if(m==="file")showModal("File",`<div class="export-grid">
<button class="export-option" id="fileOpenFromCsdb"><strong>Open from CSDB</strong><span>Browse managed data modules</span></button>
<button class="export-option" id="fileSave"><strong>Save</strong><span>Save current checked-out DM</span></button>
<button class="export-option" id="fileCheckIn"><strong>Check in</strong><span>Return updated DM to CSDB</span></button>
<button class="export-option" id="fileExport"><strong>Export</strong><span>XML, Markdown, JSON or HTML</span></button>
<button class="export-option" id="fileReset"><strong>Reload demo DM</strong><span>Restore startup authoring example</span></button>
</div>`);
 else if(m==="edit")showModal("Edit",`<div class="export-grid">
   <button class="export-option" id="applyXmlModal"><strong>Apply XML to Content</strong><span>Parse current XML source into the structured model</span></button>
   <button class="export-option" id="saveCheckpointModal"><strong>Save checkpoint</strong><span>Store current project in this browser</span></button></div>`);
 else if(m==="insert")showModal("Insert",`<p>Current context: <strong>${esc($("#contextPath").textContent)}</strong></p><p><strong>Position:</strong> ${esc(currentInsertPosition())}</p><div class="export-grid">
 <button class="export-option" id="menuInsertXref"><strong>Cross-reference</strong><span>Select a managed DM from the CSDB</span></button>
 <button class="export-option" id="menuTableEditor"><strong>Table editor</strong><span>Create or edit structured rows and columns</span></button>
 ${validChildrenForSelected().map(k=>`<button class="export-option" data-ins="${k}"><strong>${k}</strong><span>Insert as valid child</span></button>`).join("")||"<p>No child elements allowed in this context.</p>"}</div>`);
 else if(m==="review")showModal("Review workflow",`<p>Current state: <strong>${state.model.meta.workflow}</strong></p><p>Use the buttons in Properties → Document State to submit, approve, or return the document.</p>`);
 else if(m==="tools")validate();
 else if(m==="help")showHelp();
 setTimeout(()=>{
  $("#fileOpenFromCsdb")?.addEventListener("click",()=>{$("#modalBackdrop").classList.add("hidden");showOpenFromCsdb()});
  $("#menuInsertXref")?.addEventListener("click",()=>{$("#modalBackdrop").classList.add("hidden");showXrefDialog()});
  $("#menuTableEditor")?.addEventListener("click",()=>{$("#modalBackdrop").classList.add("hidden");showTableEditor()});
  $("#fileCheckIn")?.addEventListener("click",()=>{checkInCurrent();$("#modalBackdrop").classList.add("hidden")});
    $("#fileImport")?.addEventListener("click",()=>{$("#modalBackdrop").classList.add("hidden");$("#fileInput").click()});
  $("#fileExport")?.addEventListener("click",()=>{showExport()});
  $("#fileSave")?.addEventListener("click",()=>{saveLocal();$("#modalBackdrop").classList.add("hidden")});
  $("#fileReset")?.addEventListener("click",()=>{$("#modalBackdrop").classList.add("hidden");resetDemo()});
  $("#applyXmlModal")?.addEventListener("click",()=>{applySource();$("#modalBackdrop").classList.add("hidden")});
  $("#saveCheckpointModal")?.addEventListener("click",()=>{saveLocal();$("#modalBackdrop").classList.add("hidden")});
  $$("[data-ins]").forEach(x=>x.onclick=()=>{insertElement(x.dataset.ins);$("#modalBackdrop").classList.add("hidden")});
 },0);
});

window.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="s"){e.preventDefault();saveLocal()}});
window.addEventListener("beforeunload",e=>{if(state.dirty){e.preventDefault();e.returnValue=""}});

$("#projectImportInput")?.addEventListener("change",e=>{
 const file=e.target.files?.[0];
 if(file)handleProjectImportFile(file);
});
