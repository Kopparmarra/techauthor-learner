/* TechAuthor Learner — Beginner Drills curriculum (5×20)
 * Depends on runtime globals from app.js when tests run:
 * state, getNodeByType, getNodesByType, hasChild, $, document, etc.
 * makeDrill only builds closures; they execute after app.js has loaded.
 */
const drillChapterSpecs=[{"id":"ch1","title":"1. Navigate & Display","focus":"Document Map, Edit view, tag display and PTC keyboard navigation","specs":[["select","title","Select the title in Document Map."],["select","para","Select the paragraph in Document Map."],["select","step","Select the step in Document Map."],["select","cmd","Select the cmd in Document Map."],["root",null,"Select mainProcedure in Document Map."],["tag","full","Switch to Full Tags."],["tag","partial","Switch to Partial Tags."],["tag","none","Switch to No Tags."],["shortcut","tagcycle","Use Ctrl+Shift+L to cycle the tag display."],["shortcut","docmap","Use Alt+Ctrl+O to show Document Map."],["shortcut","normal","Use Alt+Ctrl+N for Normal view (hide Document Map)."],["shortcut","refresh","Use Ctrl+L to refresh the editor display."],["shortcut","focus","Press F6 to cycle focus between Edit view, Document Map and markup controls."],["shortcut","collapse-element","Alt-click the selected step to collapse its content."],["view","source","Open XML/source view."],["view","content","Return to Content/Edit view."],["view","preview","Open Preview."],["lefttab","resources","Open Resources in the left pane."],["lefttab","document","Return to Document Map."],["navtop",null,"Navigate from the selected step to the title using Document Map."]]},{"id":"ch2","title":"2. Insert Markup & Quick Tags","focus":"PTC-style Quick Tags, Insert Markup and context-sensitive structure","specs":[["shortcut","markup-list","Press Control+M, then choose a valid element to insert it."],["shortcut","markup-dialog","Press Control+Shift+M, then insert any valid element from the dialog into the selected step."],["quickopen",null,"Press Enter to open Quick Tags on the selected step."],["quickinsert","cmd","Use Quick Tags to insert cmd inside the selected step."],["quickinsert","note","Use Quick Tags to insert note inside the selected step."],["quickinsert","warning","Use Quick Tags to insert warning inside the selected step."],["insert","inside","cmd","step","Insert cmd INSIDE the selected step."],["insert","inside","note","step","Insert note INSIDE the selected step."],["insert","inside","codeblock","step","Insert codeblock INSIDE the selected step."],["insert","after","para","title","Insert para AFTER the title."],["insert","after","sectionTitle","para","Insert sectionTitle AFTER the paragraph."],["insert","after","step","sectionTitle","Insert step AFTER sectionTitle."],["insert","before","warning","step","Insert warning BEFORE the step."],["leafcheck","para","With para selected, confirm no child markup is offered."],["stepchoices",null,"Select step and confirm cmd, note, warning and codeblock are valid children."],["rootinsert","para","Select mainProcedure and insert a top-level para."],["sequence",null,"Build step → cmd from the sectionTitle."],["shortcut","insert-table","Use Alt+Shift+T to insert/open a table at a valid location."],["showcontext",null,"Use Tools > Show Context for the current position."],["doctype",null,"Open Tools > Document Type Viewer."]]},{"id":"ch3","title":"3. Edit Markup & Attributes","focus":"Modify Attributes, change markup, structural movement and editing shortcuts","specs":[["shortcut","modify-attributes","Use Ctrl+D to open Modify Attributes for the selected step."],["attr","step","applicRefId","APP-01","Set applicRefId=APP-01 on the step."],["attr","para","changeMark","1","Set changeMark=1 on the paragraph."],["changemarkup",null,"Use Edit > Change Markup on the selected note."],["delete","para","Delete the selected extra paragraph."],["moveup","note","Move the note above the cmd."],["movedown","warning","Move the warning below the paragraph."],["undo",null,"Undo the accidental note with Ctrl+Z (or the Undo button)."],["redo",null,"Insert a note, undo it, then redo with Ctrl+Y."],["shortcut","save","Use Ctrl+S to save the document."],["shortcut","find","Use Ctrl+F to open the Find/Replace dialog on the Find/Replace tab."],["findtag","step","Open Find/Replace, switch to Find Tag/Attribute, enter step, and click Find Next."],["text","para","New paragraph text.","Change the paragraph text to “New paragraph text.”"],["text","cmd","Verify the system status.","Change the cmd text to “Verify the system status.”"],["elementprops",null,"Set Selected Element ID to ELEM-01 and apply it."],["table",null,"Open the Table editor."],["xref",null,"Open the Xref picker."],["comment",null,"Add a review comment (trainer workflow extension)."],["tag","full","Switch to Full Tags before structural editing."],["view","content","Return to Content/Edit view."]]},{"id":"ch4","title":"4. Find, Context & Completeness","focus":"Context Rules, Check Completeness, structural search and correction","specs":[["contexton",null,"Make sure Tools > Context Rules is ON."],["showcontext",null,"Use Tools > Show Context on the selected step."],["doctype",null,"Open Tools > Document Type Viewer."],["completeness",null,"Run Tools > Check Completeness on an incomplete step."],["fixcomplete",null,"Run Check Completeness, add the missing cmd, then run it again."],["issues",null,"Run Check Completeness, then open the Issues tab at the bottom."],["completeness",null,"Run Check Completeness again after reviewing the Issues tab."],["findtag","warning","Open Find/Replace on Find Tag/Attribute and find the next warning element."],["leafcheck","title","Select title and confirm it has no child insertions."],["stepchoices",null,"Select step and inspect its valid children."],["deletesecondtitle",null,"An imported document contains two title elements. Delete the extra title so only one remains."],["addtitle",null,"Insert the missing title before the paragraph."],["emptycleanup",null,"Delete the empty note."],["tag","full","Use Full Tags to inspect an incomplete structure."],["maintenance",null,"Add MAINTENANCE mode text to satisfy the project rule."],["applicability",null,"Set the project applicability expression and apply it."],["righttab","brex","Open the BREX Rules tab and inspect the active project rules. Then return to Learning and click Check."],["profile","balanced","Switch the active Project BREX profile to Balanced."],["profile","saab_strict","Switch the active Project BREX profile back to Strict."],["referencescheck",null,"Open References, inspect the tab, then return to Learning and click Check."]]},{"id":"ch5","title":"5. Everyday Professional Flow","focus":"A realistic authoring rhythm: navigate, insert, edit, check, save and hand off","specs":[["view","content","Make sure Content/Edit view is active."],["tag","partial","Use Partial Tags for normal editing."],["shortcut","markup-list","Press Control+M and inspect the valid markup list."],["quickinsert","cmd","Use Quick Tags to complete an empty step with cmd."],["attr","step","applicRefId","APP-01","Set applicRefId=APP-01 on the step."],["shortcut","modify-attributes","Re-open Modify Attributes with Ctrl+D."],["shortcut","find","Open the Find/Replace dialog with Ctrl+F."],["findtag","step","In the same Find/Replace dialog, switch to Find Tag/Attribute and find the next step."],["shortcut","tagcycle","Cycle tag display with Ctrl+Shift+L."],["view","source","Inspect XML/source."],["view","content","Return to Content/Edit view."],["view","preview","Preview the document."],["completeness",null,"Run Check Completeness."],["fixcomplete",null,"Fix an incomplete step and rerun Check Completeness."],["undo",null,"Undo the accidental note with Ctrl+Z (or the Undo button)."],["redo",null,"Insert a note, undo it, then redo with Ctrl+Y."],["shortcut","save","Save with Ctrl+S."],["submit",null,"In Properties > Document State, click Submit for review."],["returnauthor",null,"In Properties > Document State, click Return to author."],["checkin",null,"Click Check in in the top bar to return the DM to the CSDB."]]}];
function drillSetupBase(selectType=null,variant=0){
 const base=[{type:"title",text:"Training document"},{type:"sectionTitle",text:"Procedure"},{type:"para",text:"System description."},{type:"warning",text:"Disconnect power before maintenance."},{type:"step",text:"Check system status.",children:[{type:"cmd",text:"Verify status."},{type:"note",text:"Record the result."}]},{type:"table",rows:[["Item","Value"],["Mode","Normal"]]}];
 if(selectType==="cmd"||selectType==="note") return drillModel(base,selectType);
 if(selectType==="title"||selectType==="sectionTitle"||selectType==="para"||selectType==="warning"||selectType==="step"||selectType==="table")return drillModel(base,selectType,variant);
 return drillModel(base,selectType);
}
function makeDrill(spec){
 const k=spec[0],p=spec.slice(1),prompt=spec[spec.length-1];
 const d={skill:k,title:prompt.replace(/[<>]/g,"").replace(/\.$/,""),prompt,why:"Practice the structured-authoring action until the context and result feel predictable."};
 if(k==="select"){
   d.setup=()=>{
     const m=drillSetupBase(p[0]);
     m.neutralSelection=true;
     return m;
   };
   d.test=()=>getNodeById(state.selectedId)?.node.type===p[0]
 }
 else if(k==="root"){
   d.setup=()=>{
     const m=drillSetupBase("para");
     m.forceNodeSelection="para";
     return m;
   };
   d.test=()=>state.rootSelected===true
 }
 else if(k==="tag"){d.setup=()=>{state.tagMode=p[0]==="partial"?"full":"partial";return drillSetupBase("para")};d.test=()=>currentTagMode()===p[0]}
 else if(k==="view"){d.setup=()=>drillSetupBase("para");d.test=()=>document.querySelector(`.bottom-tab[data-mode="${p[0]}"]`)?.classList.contains("active")}
 else if(k==="righttab"){
   const tab=p[0];
   d.setup=()=>drillSetupBase("para");
   d.test=()=>!!state.drillEvidence?.rightTabsOpened?.[tab] || state.lastLearningAction?.kind==="righttab"&&state.lastLearningAction?.name===tab;
 }
 else if(k==="lefttab"){d.setup=()=>drillSetupBase("para");d.test=()=>state.leftMode===p[0]}
 else if(k==="reveal"){d.setup=()=>drillSetupBase("cmd");d.test=()=>state.lastLearningAction?.kind==="reveal"}
 else if(k==="navtop"){
   d.setup=()=>{
     const m=drillSetupBase("step");
     m.afterSetup="scroll-selected";
     return m;
   };
   d.test=()=>getNodeById(state.selectedId)?.node.type==="title"
 }
 else if(k==="quickopen"){d.setup=()=>drillSetupBase("step");d.test=()=>!!state.drillEvidence?.quickTagsOpened}
 else if(k==="insert"){
   const [pos,type,sel]=p;
   d.setup=()=>{
     const m=drillSetupBase(sel);
     const count=getNodesByType(type,m.nodes).length;
     m.trainingBaseline={type,pos,count};
     return m;
   };
   d.test=()=>{
     const base=state.drillBaseline||{};
     const count=getNodesByType(base.type||type).length;
     const grew=count>(base.count??0);
     const actionOk=state.lastLearningAction?.kind==="insert"
       && state.lastLearningAction?.type===(base.type||type)
       && (!base.pos||state.lastLearningAction?.position===base.pos);
     // Outcome-first: structure must grow. Action is secondary evidence.
     return grew || actionOk;
   }
 }
 else if(k==="quickinsert"){const type=p[0];d.setup=()=>{const m=drillSetupBase("step");m.nodes.find(n=>n.type==="step").children=[];return m};d.test=()=>hasChild("step",type)}
 else if(k==="leafcheck"){const type=p[0];d.setup=()=>drillSetupBase(type);d.test=()=>/no valid elements/i.test($("#elementHint")?.textContent||"")}
 else if(k==="rootinsert"){
   const type=p[0];
   d.setup=()=>{
     const m=drillSetupBase("title");
     m.trainingBaseline={type,count:getNodesByType(type,m.nodes).length};
     return m;
   };
   d.test=()=>{
     const base=state.drillBaseline||{};
     const count=getNodesByType(base.type||type).length;
     return count>(base.count??0);
   }
 }
 else if(k==="complete"){d.setup=()=>{const m=drillSetupBase("step");m.nodes.find(n=>n.type==="step").children=[];return m};d.test=()=>hasChild("step","cmd")}
 else if(k==="sequence"){d.setup=()=>drillModel([{type:"title",text:"Mini procedure"},{type:"sectionTitle",text:"Procedure"}],"sectionTitle");d.test=()=>state.model.nodes.some(n=>n.type==="step"&&hasChildNode(n,"cmd"))}
 else if(k==="attr"){const [type,name,value]=p;d.setup=()=>drillSetupBase(type);d.test=()=>getNodeByType(type)?.attrs?.[name]===value}
 else if(k==="delete"){const type=p[0];d.setup=()=>type==="para"?drillModel([{type:"title",text:"Delete"},{type:"para",text:"Keep."},{type:"para",text:"Delete."}],"para",1):drillSetupBase(type);d.test=()=>type==="para"?state.model.nodes.filter(n=>n.type==="para").length===1:!getNodeByType(type)}
 else if(k==="moveup"){d.setup=()=>drillSetupBase("note");d.test=()=>getNodeByType("step")?.children?.[0]?.type==="note"}
 else if(k==="movedown"){d.setup=()=>drillModel([{type:"title",text:"Move"},{type:"warning",text:"Warning."},{type:"para",text:"Paragraph."}],"warning");d.test=()=>state.model.nodes.findIndex(n=>n.type==="warning")>state.model.nodes.findIndex(n=>n.type==="para")}
 else if(k==="undo"){
   d.setup=()=>{
     // Document already contains an accidental note. seedUndo places a prior snapshot
     // on the undo stack so Ctrl+Z removes it without requiring a prior insertion.
     const m=drillModel([{type:"title",text:"Undo"},{type:"para",text:"Keep."},{type:"note",text:"Accidental note."}],"note");
     m.trainingBaseline={noteCount:1,nodeCount:3,seedUndo:true};
     return m;
   };
   d.test=()=>{
     const notes=getNodesByType("note").length;
     const undid=!!state.drillEvidence?.undoUsed || state.lastLearningAction?.kind==="undo";
     return notes===0 && undid;
   }
 }
 else if(k==="redo"){
   d.setup=()=>{
     const m=drillModel([{type:"title",text:"Redo"},{type:"para",text:"Keep."}],"para");
     m.trainingBaseline={nodeCount:2};
     return m;
   };
   d.test=()=>{
     // Outcome: a note was re-inserted after undo, or redo evidence is present with structural growth.
     const notes=getNodesByType("note").length;
     const redid=!!state.drillEvidence?.redoUsed || state.lastLearningAction?.kind==="redo";
     return notes>0 && redid;
   }
 }
 else if(k==="find"){
   d.setup=()=>drillSetupBase("para");
   d.test=()=>{
     const a=state.lastLearningAction;
     return a?.kind==="findreplace" || (a?.kind==="shortcut"&&a?.name==="find") || !!state.drillEvidence?.findOpened;
   }
 }
 else if(k==="table"){d.setup=()=>drillSetupBase("table");d.test=()=>state.lastLearningAction?.kind==="table"||!!state.drillEvidence?.tableOpened}
 else if(k==="xref"){d.setup=()=>drillSetupBase("para");d.test=()=>state.lastLearningAction?.kind==="xref"||!!state.drillEvidence?.xrefOpened}
 else if(k==="text"){const [type,value]=p;d.setup=()=>drillSetupBase(type);d.test=()=>getNodeByType(type)?.text.trim()===value}
 else if(k==="elementprops"){d.setup=()=>drillSetupBase("para");d.test=()=>getNodeByType("para")?.xmlId==="ELEM-01"}
 else if(k==="comment"){
   d.setup=()=>{
     const m=drillSetupBase("para");
     m.trainingBaseline={commentCount:(state.model?.comments||currentComments?.()||[]).length};
     return m;
   };
   d.test=()=>{
     const comments=typeof currentComments==="function"?currentComments():(state.model?.comments||[]);
     const base=state.drillBaseline?.commentCount??0;
     return comments.length>base || state.lastLearningAction?.kind==="comment" || !!state.drillEvidence?.commentAdded;
   }
 }
 else if(k==="validate"){d.setup=()=>{const m=drillSetupBase("step");m.nodes.find(n=>n.type==="step").children=[];return m};d.test=()=>state.lastLearningAction?.kind==="validate"}
 else if(k==="fixcmd"||k==="validatefix"){d.setup=()=>{const m=drillSetupBase("step");m.nodes.find(n=>n.type==="step").children=[];return m};d.test=()=>hasChild("step","cmd")&&(k!=="validatefix"||state.lastLearningAction?.kind==="validate")}
 else if(k==="maintenance"){d.setup=()=>drillSetupBase("para");d.test=()=>/MAINTENANCE mode/i.test(flattenText(state.model.nodes))}
 else if(k==="applicability"){d.setup=()=>drillSetupBase("para");d.test=()=>!!String(state.model.applicability?.expression||"").trim()}
 else if(k==="profile"){
   const target=p[0];
   d.setup=()=>{
     // Start from a different profile so the learner must actually perform the change.
     const startProfile=target==="saab_strict"?"balanced":"saab_strict";
     if($("#brexProfileSelect"))$("#brexProfileSelect").value=startProfile;
     if($("#ruleProfileInput"))$("#ruleProfileInput").value=startProfile;
     const m=drillSetupBase("para");
     setTimeout(()=>{
       if($("#brexProfileSelect"))$("#brexProfileSelect").value=startProfile;
       if($("#ruleProfileInput"))$("#ruleProfileInput").value=startProfile;
       if(typeof renderBrexPanel==="function")renderBrexPanel();
       if(typeof refreshInsertOptions==="function")refreshInsertOptions();
     },0);
     return m;
   };
   d.test=()=>$("#brexProfileSelect")?.value===target;
 }
 else if(k==="toggle"){d.setup=()=>drillSetupBase("para");d.test=()=>!!$("#"+p[0])?.checked}
 else if(k==="stepchoices"){d.setup=()=>drillSetupBase("step");d.test=()=>["cmd","note","warning","codeblock"].every(x=>($("#elementHint")?.textContent||"").includes(x))}
 else if(k==="deletesecondtitle"){d.setup=()=>drillModel([{type:"title",text:"One"},{type:"title",text:"Two"},{type:"para",text:"Text"}],"title",1);d.test=()=>state.model.nodes.filter(n=>n.type==="title").length===1}
 else if(k==="addtitle"){d.setup=()=>drillModel([{type:"para",text:"No title"}],"para");d.test=()=>state.model.nodes[0]?.type==="title"}
 else if(k==="emptycleanup"){d.setup=()=>drillModel([{type:"title",text:"Cleanup"},{type:"note",text:""}],"note");d.test=()=>!getNodeByType("note")}
 else if(k==="issues"){d.setup=()=>drillSetupBase("step");d.test=()=>document.querySelector('.bottom-tab[data-mode="issues"]')?.classList.contains("active")}
 else if(k==="referencescheck"){
   d.setup=()=>drillSetupBase("para");
   d.test=()=>!!state.drillEvidence?.rightTabsOpened?.references || state.lastLearningAction?.kind==="righttab"&&state.lastLearningAction?.name==="references";
 }
 else if(k==="save"){
   d.setup=()=>drillSetupBase("para");
   d.test=()=>{
     const a=state.lastLearningAction;
     return a?.kind==="save" || (a?.kind==="shortcut"&&a?.name==="save") || !!state.drillEvidence?.saved;
   }
 }
 else if(k==="submit"){d.setup=()=>{const m=drillSetupBase("step");return m};d.test=()=>state.model.meta.workflow==="In Review"}
 else if(k==="returnauthor"){d.setup=()=>{state.model.meta.workflow="In Review";return drillSetupBase("step")};d.test=()=>state.model.meta.workflow==="In Work"}
 else if(k==="checkin"){d.setup=()=>drillSetupBase("para");d.test=()=>state.lastLearningAction?.kind==="checkin"||!!state.drillEvidence?.checkedIn}
 else if(k==="shortcut"){
   const name=p[0];
   d.setup=()=>{
     if(name==="modify-attributes"||name==="markup-list"||name==="markup-dialog"){
       const m=drillSetupBase("step");
       if(name==="markup-dialog"){
         const step=m.nodes.find(n=>n.type==="step");
         m.trainingBaseline={stepChildCount:(step?.children||[]).length};
       }
       if(name==="markup-list"){
         const step=m.nodes.find(n=>n.type==="step");
         m.trainingBaseline={stepChildCount:(step?.children||[]).length};
       }
       return m;
     }
     return drillSetupBase("para");
   };
   d.test=()=>{
     const ev=state.drillEvidence||{};
     const sc=ev.shortcuts||{};
     const a=state.lastLearningAction;
     const usedShortcut=!!sc[name]||(a?.kind==="shortcut"&&a?.name===name);

     if(name==="modify-attributes"){
       // Must use Ctrl+D (viaShortcut). Apply after that still passes — evidence is durable.
       return !!ev.modifyAttributesViaShortcut || !!sc["modify-attributes"];
     }
     if(name==="markup-list"){
       // "inspect the list" → open is enough. "choose/insert" → must insert.
       const needsInsert=/insert/i.test(prompt);
       if(!usedShortcut) return false;
       if(!needsInsert) return true;
       const step=getNodeByType("step");
       const base=state.drillBaseline?.stepChildCount ?? 0;
       const childCount=(step?.children||[]).length;
       const grew=childCount>base;
       const inserted=!!a?.inserted || !!sc["markup-list_inserted"];
       return grew || inserted;
     }
     if(name==="markup-dialog"){
       const step=getNodeByType("step");
       const base=state.drillBaseline?.stepChildCount ?? 0;
       const childCount=(step?.children||[]).length;
       const insertedId=ev.markupDialogInsertedId;
       const insertedStillExists=insertedId?!!getNodeById(insertedId):childCount>base;
       return childCount>base && insertedStillExists;
     }
     if(name==="save"){
       return a?.kind==="save"||(a?.kind==="shortcut"&&a?.name==="save")||!!ev.saved||!!sc.save;
     }
     if(name==="find"){
       // Ctrl+F should open the unified dialog on its text Find/Replace tab.
       const opened=a?.kind==="findreplace"||(a?.kind==="shortcut"&&a?.name==="find")||!!ev.findOpened||!!sc.find;
       const tab=(state.findDialogTab||ev.findTab||"text");
       return opened && tab==="text";
     }
     if(name==="insert-table"){
       return usedShortcut || a?.kind==="table" || !!ev.tableOpened;
     }
     // Generic shortcut drills (tagcycle, docmap, normal, refresh, focus, collapse-element):
     // durable shortcut evidence — later clicks must not erase a successful shortcut.
     return usedShortcut;
   }
 }
 else if(k==="showcontext"){
   d.setup=()=>drillSetupBase("step");
   d.test=()=>state.lastLearningAction?.kind==="show-context"||!!state.drillEvidence?.showContextOpened
 }
 else if(k==="doctype"){
   d.setup=()=>drillSetupBase("step");
   d.test=()=>state.lastLearningAction?.kind==="doctype-viewer"||!!state.drillEvidence?.doctypeOpened
 }
 else if(k==="contexton"){d.setup=()=>{state.contextRulesOn=false;const m=drillSetupBase("step");setTimeout(()=>{const s=$("#contextRulesStatus");if(s){s.textContent="CTX OFF";s.classList.remove("active")}},0);return m};d.test=()=>state.contextRulesOn===true}
 else if(k==="completeness"){
   d.setup=()=>{const m=drillSetupBase("step");m.nodes.find(n=>n.type==="step").children=[];return m};
   d.test=()=>state.lastLearningAction?.kind==="completeness"||!!state.drillEvidence?.completenessRan
 }
 else if(k==="fixcomplete"){
   // Logical: incomplete step fixed (cmd present) AND completeness was run at least once.
   // Running completeness only after the fix is OK; requiring it as *last* action was too brittle.
   d.setup=()=>{const m=drillSetupBase("step");m.nodes.find(n=>n.type==="step").children=[];return m};
   d.test=()=>hasChild("step","cmd")&&(!!state.drillEvidence?.completenessRan||state.lastLearningAction?.kind==="completeness")
 }
 else if(k==="findtag"){
   const expected=p[0]||"step";
   d.setup=()=>drillSetupBase("para");
   d.test=()=>{
     const hit=state.lastLearningAction?.kind==="find-tag"||!!state.drillEvidence?.findTagHit;
     const tag=state.drillEvidence?.findTagName;
     return hit && (!expected||tag===expected);
   }
 }
 else if(k==="changemarkup"){
   // Task is Change Markup on the note — must actually change the element type (or durable apply evidence).
   d.setup=()=>{
     const m=drillSetupBase("note");
     m.trainingBaseline={noteCount:getNodesByType("note",m.nodes).length};
     return m;
   };
   d.test=()=>{
     const notes=getNodesByType("note").length;
     const base=state.drillBaseline?.noteCount??1;
     const changed=notes<base || !!state.drillEvidence?.changeMarkupApplied;
     return changed && (state.lastLearningAction?.kind==="change-markup"||!!state.drillEvidence?.changeMarkupApplied);
   }
 }
 return d;
}
const drillChapters=drillChapterSpecs.map(c=>({...c,drills:c.specs.map(makeDrill)}));
function hydrateDrillNode(n){const out={id:uid(),type:n.type,text:n.text||""};if(n.children)out.children=n.children.map(hydrateDrillNode);if(n.rows){out.rows=JSON.parse(JSON.stringify(n.rows));out.headerRow=true}return out}
function drillModel(nodes,selectType=null,selectIndex=0){return{nodes:nodes.map(hydrateDrillNode),selectType,selectIndex}}
function getNodesByType(type,nodes,out){nodes=nodes||state.model?.nodes||[];out=out||[];for(const n of nodes){if(n.type===type)out.push(n);getNodesByType(type,n.children||[],out)}return out}
function getNodeByType(type,nodes=state.model?.nodes||[]){for(const n of nodes){if(n.type===type)return n;const c=getNodeByType(type,n.children||[]);if(c)return c}return null}
function hasChildNode(n,type){return !!n?.children?.some(c=>c.type===type)} function hasChild(p,c){return hasChildNode(getNodeByType(p),c)}
function drillProgressKey(){return "techauthorLearnerDrillsV712"} function loadDrillProgress(){try{return JSON.parse(localStorage.getItem(drillProgressKey())||"{}")}catch(e){return{}}} function saveDrillProgress(){localStorage.setItem(drillProgressKey(),JSON.stringify(state.drillProgress||{}))}
function currentDrillChapter(){return drillChapters[state.drillChapterIndex||0]} function currentDrillItem(){return currentDrillChapter()?.drills[state.drillIndex||0]} function drillStatus(c,i){return state.drillProgress?.[`${c}:${i}`]||""} function setDrillStatus(c,i,v){state.drillProgress=state.drillProgress||{};state.drillProgress[`${c}:${i}`]=v;saveDrillProgress()}
function applyDrillSetup(setup){
 const spec=setup();
 state.drillBaseline=spec.trainingBaseline||null;
 state.trainingExercise={id:"beginner-drill",title:"Beginner Drill"};
 state.model.meta.title="Beginner Drill";
 state.model.meta.dmc="TRAINING-CORE-SKILLS";
 state.model.meta.workflow=state.model.meta.workflow||"In Work";
 state.model.nodes=spec.nodes;
 state.issues=[];
 state.dirty=true;

 // Selection drills must not start with the answer already selected.
 if(spec.neutralSelection){
   state.rootSelected=false;
   state.selectedId=null;
 }else if(spec.forceNodeSelection){
   state.rootSelected=false;
   const matches=getNodesByType(spec.forceNodeSelection);
   state.selectedId=matches[0]?.id||null;
 }else{
   state.rootSelected=false;
   if(spec.selectType){
     const a=getNodesByType(spec.selectType);
     state.selectedId=a[spec.selectIndex||0]?.id||a[0]?.id||null;
   }else{
     state.selectedId=state.model.nodes[0]?.id||null;
   }
 }

 if($("#tagModeSelect"))$("#tagModeSelect").value=state.tagMode||"partial";
 renderAuthor();
 renderTree();
 syncControlsFromModel();
 renderReferences();
 renderBrexPanel();
 renderElementCoach();
 refreshInsertOptions();
 updateContext();
 syncSourcePassive();
 renderPreview();
 if(spec.selectType){
   const wanted=getNodesByType(spec.selectType)[spec.selectIndex||0];
   if(wanted){
     state.rootSelected=false;
     state.selectedId=wanted.id;
     renderTree();
     selectElement(wanted.id,{renderTree:false});
   }
 }
 if($("#currentDocLabel"))$("#currentDocLabel").textContent="DM TRAINING-CORE-SKILLS";
 if(spec.afterSetup==="scroll-selected"){
   setTimeout(()=>revealSelectedInEditor(),0);
 }
 // Seed undo stack for drills that start mid-edit (e.g. accidental note already present).
 if(spec.trainingBaseline?.seedUndo){
   const before=JSON.parse(JSON.stringify(state.model));
   before.nodes=(before.nodes||[]).filter(n=>n.type!=="note");
   state.undoStack=[{
     label:"Insert note",
     model:before,
     selectedId:state.selectedId,
     rootSelected:!!state.rootSelected,
     trainingExercise:state.trainingExercise?JSON.parse(JSON.stringify(state.trainingExercise)):null
   }];
   state.redoStack=[];
   if(typeof updateUndoRedoButtons==="function")updateUndoRedoButtons();
 }
}


function renderDrillSelectors(){
 const chapterSelect=$("#drillChapterSelect");
 const drillSelect=$("#drillJumpSelect");
 if(!chapterSelect||!drillSelect)return;
 if(!state.drillProgress)state.drillProgress=loadDrillProgress();

 chapterSelect.innerHTML=drillChapters.map((c,i)=>`<option value="${i}">${esc(c.title)}</option>`).join("");
 chapterSelect.value=String(state.drillChapterIndex||0);

 const c=currentDrillChapter();
 if(!c)return;
 drillSelect.innerHTML=c.drills.map((d,i)=>{
   const status=drillStatus(c.id,i);
   const prefix=status==="done"?"✓ ":status==="skipped"?"↷ ":"";
   return `<option value="${i}">${prefix}${i+1}. ${esc(d.title)}</option>`;
 }).join("");
 drillSelect.value=String(state.drillIndex||0);

 const start=$("#startDrillsBtn");
 if(start)start.textContent=`Start ${c.title}`;
}

function updateDrillStats(){
 const c=currentDrillChapter();if(!c)return;
 if(!state.drillProgress)state.drillProgress=loadDrillProgress();

 const done=c.drills.filter((d,i)=>drillStatus(c.id,i)==="done").length;
 const s=state.drillSession;
 const progress=$("#drillProgress");
 const score=$("#drillScore");
 const streak=$("#drillStreak");

 if(progress)progress.textContent=`${done} / ${c.drills.length}`;
 if(score)score.textContent=`${s?.attempted?Math.round((s.correct/s.attempted)*100):0}%`;
 if(streak)streak.textContent=String(s?.streak||0);
}

function renderBeginnerStartState(){
 if(!state.drillProgress)state.drillProgress=loadDrillProgress();
 renderDrillSelectors();
 updateDrillStats();
 if(state.drillSession)return;
 const c=currentDrillChapter(),card=$("#drillCard");
 if(!c||!card)return;
 card.classList.add("drill-card-emphasis");
 card.innerHTML=`<div class="drill-header"><span class="drill-number">${esc(c.title)}</span><span class="drill-skill">20 drills</span></div>
 <div class="drill-instruction">${esc(c.focus)}</div>
 <div class="drill-do-this"><strong>Navigation</strong>Use Chapter and Jump to drill. Use Skip to move past an exercise you already know.</div>`;
 const start=$("#startDrillsBtn");
 if(start){start.classList.remove("hidden");start.textContent=`Start ${c.title}`;}
 $("#checkDrillBtn")?.classList.add("hidden");
 $("#nextDrillBtn")?.classList.add("hidden");
}

function startBeginnerDrills(){
 if(!state.drillProgress)state.drillProgress=loadDrillProgress();
 const c=currentDrillChapter();if(!c)return;
 state.drillSession={chapter:c.id,correct:0,attempted:0,streak:0,answered:false};
 $("#startDrillsBtn")?.classList.add("hidden");
 $("#checkDrillBtn")?.classList.remove("hidden");
 loadCurrentDrill();
}

function loadCurrentDrill(){
 const c=currentDrillChapter(),d=currentDrillItem(),s=state.drillSession;
 if(!c||!d)return;
 if(s)s.answered=false;
 state.lastLearningAction=null;
 state.drillEvidence={};
 state.undoStack=[];
 state.redoStack=[];
 if(typeof updateUndoRedoButtons==='function')updateUndoRedoButtons();
 closeQuickTags();
 closeInsertMarkupPopup();
 const drillModal=$("#modalBackdrop");
 if(drillModal&&!drillModal.classList.contains("hidden")){
   drillModal.classList.add("hidden");
   drillModal.dataset.menu="";
 }

 const hintMap={
   select:"Nothing is selected for you. Find and click the requested element in Document Map.",
   root:"Select mainProcedure in Document Map.",
   tag:"Use the tag-display selector or documented shortcut.",
   view:"Use the bottom Content / XML / Preview tabs.",
   righttab:"Use the named tab on the right.",
   lefttab:"Use the named tab on the left.",
   reveal:"Use Reveal above Document Map.",
   navtop:"Click the title near the top of Document Map. The Edit view should scroll there automatically.",
   quickopen:"Press Enter at the selected structural position.",
   insert:"Use Inside / Before / After and Insert valid element.",
   quickinsert:"Use Quick Tags and select the requested valid element.",
   leafcheck:"Inspect the context hint / Insert Markup list.",
   rootinsert:"Select mainProcedure first, then insert the requested element.",
   complete:"Add the missing required child.",
   sequence:"Build the requested structure in order.",
   attr:"Open Modify Attributes and set the exact attribute/value shown in the task.",
   delete:"Use Delete on the selected structural element.",
   moveup:"Use ↑ to move the selected element.",
   movedown:"Use ↓ to move the selected element.",
   undo:"Use Ctrl+Z / Undo.",
   redo:"Use Ctrl+Y / Redo.",
   find:"Use Find / Replace.",
   table:"Use Table.",
   xref:"Use Xref.",
   text:"Edit the text directly in the selected element.",
   validate:"Use Check Completeness.",
   completeness:"Use Tools → Check Completeness.",
   shortcut:"Use the keyboard shortcut named in the task.",
   submit:"Open Properties > Document State and use the workflow button.",
   returnauthor:"Open Properties > Document State and use the workflow button.",
   checkin:"Use Check in in the top bar."
 };
 const hint=hintMap[d.skill]||"Perform the requested authoring action, then click Check.";

 const card=$("#drillCard");
 if(card){
   card.classList.add("drill-card-emphasis");
   card.innerHTML=`<div class="drill-header"><span><span class="drill-chapter-label">${esc(c.title)}</span><br><span class="drill-number">Drill ${(state.drillIndex||0)+1} / ${c.drills.length}</span></span><span class="drill-skill">${esc(d.skill)}</span></div>
   <div class="drill-instruction">${esc(d.prompt)}</div>
   <div class="drill-do-this"><strong>Do this</strong>${esc(hint)}</div>
   <div class="drill-status-hint">When you think it is correct, click <strong>Check</strong>.</div>`;
 }
 if($("#drillFeedback"))$("#drillFeedback").innerHTML="";
 $("#checkDrillBtn")?.classList.remove("hidden");
 $("#nextDrillBtn")?.classList.add("hidden");

 try{applyDrillSetup(d.setup)}
 catch(err){
   console.error("Drill setup failed",err);
   if($("#drillFeedback"))$("#drillFeedback").innerHTML=`<div class="drill-feedback wrong"><strong>Trainer setup error</strong><div>${esc(err.message)}</div></div>`;
 }
 updateDrillStats();
 renderDrillSelectors();
}

function checkCurrentDrill(){
 const c=currentDrillChapter(),d=currentDrillItem(),s=state.drillSession;if(!c||!d)return;
 let ok=false;try{ok=!!d.test()}catch(e){console.error("Drill test failed",e)}
 if(ok){
   setDrillStatus(c.id,state.drillIndex||0,"done");
   if(s){s.correct++;s.attempted++;s.streak++;s.answered=true}
   if($("#drillFeedback"))$("#drillFeedback").innerHTML=`<div class="drill-feedback correct"><strong>✓ Correct</strong><div>${esc(d.why)}</div></div>`;
   $("#checkDrillBtn")?.classList.add("hidden");
   $("#nextDrillBtn")?.classList.remove("hidden");
 }else{
   if(s){s.attempted++;s.streak=0}
   if($("#drillFeedback"))$("#drillFeedback").innerHTML=`<div class="drill-feedback wrong"><strong>✕ Not yet</strong><div>${esc(d.why)}</div><div style="margin-top:6px"><strong>Task:</strong> ${esc(d.prompt)}</div></div>`;
 }
 updateDrillStats();renderDrillSelectors();
}

function nextBeginnerDrill(){
 const c=currentDrillChapter();if(!c)return;
 if((state.drillIndex||0)<c.drills.length-1){
   state.drillIndex++;
   loadCurrentDrill();
 }else{
   if($("#drillFeedback"))$("#drillFeedback").innerHTML=`<div class="drill-feedback correct"><strong>Chapter complete</strong><div>You reached the end of this chapter.</div></div>`;
   $("#nextDrillBtn")?.classList.add("hidden");
 }
 renderDrillSelectors();
}

function skipBeginnerDrill(){
 const c=currentDrillChapter();if(!c)return;
 if(drillStatus(c.id,state.drillIndex||0)!=="done")setDrillStatus(c.id,state.drillIndex||0,"skipped");
 nextBeginnerDrill();
}

function jumpToDrill(index){
 const c=currentDrillChapter();if(!c)return;
 state.drillIndex=Math.max(0,Math.min(Number(index)||0,c.drills.length-1));
 state.drillSession={chapter:c.id,correct:0,attempted:0,streak:0,answered:false};
 loadCurrentDrill();renderDrillSelectors();
}
;




/* v7.27 Scenario Practice — outcome-based authoring tasks */
const scenarioPractice=[
 {
  id:"sc1",title:"Complete an unfinished procedure",
  level:"Foundation",
  scenario:"A procedure was checked in before authoring was complete. Two procedural steps are unfinished and one note contains no text.",
  task:"Complete the procedure and make the document ready to pass Check Completeness.",
  setup:()=>({
   nodes:[
    {type:"title",text:"Verify software service status"},
    {type:"para",text:"Set the system to MAINTENANCE mode before you do this procedure."},
    {type:"sectionTitle",text:"Procedure"},
    {type:"step",text:"Open the maintenance application.",children:[{type:"cmd",text:"Start the Radar Maintenance application."}]},
    {type:"step",text:"Check the service status.",children:[]},
    {type:"step",text:"Record the result.",children:[]},
    {type:"note",text:""}
   ],
   meta:{title:"Verify software service status",dmc:"TRAINING-SCENARIO-01",security:"UNCLASSIFIED",issue:"001",workflow:"In Work"},
   applicability:{expression:'product == "Surface Sensor Software"',variant:"All",swFrom:"4.0",swTo:"4.9",serial:"All serials"}
  }),
  criteria:[
   ["Every step has a cmd",()=>getNodesByType("step").every(n=>(n.children||[]).some(c=>c.type==="cmd"))],
   ["No empty note remains",()=>getNodesByType("note").every(n=>String(n.text||"").trim())],
   ["Document has one title",()=>getNodesByType("title").length===1]
  ],
  hints:["Inspect the step elements in Document Map.","Check which child element a step requires.","Check Completeness is useful when you think the structure is finished."]
 },
 {
  id:"sc2",title:"Repair imported content",
  level:"Foundation",
  scenario:"An imported XML file contains duplicate document content and unfinished markup. Context Rules did not create these errors; they arrived with the imported file.",
  task:"Repair the imported document so that its structure is complete and unambiguous.",
  setup:()=>({
   nodes:[
    {type:"title",text:"Restore network connection"},
    {type:"title",text:"Restore network connection — old copy"},
    {type:"para",text:"Set the system to MAINTENANCE mode."},
    {type:"step",text:"Examine the network status.",children:[]},
    {type:"note",text:""}
   ],
   meta:{title:"Restore network connection",dmc:"TRAINING-SCENARIO-02",security:"UNCLASSIFIED",issue:"001",workflow:"In Work"},
   applicability:{expression:'product == "Surface Sensor Software"',variant:"All",swFrom:"4.0",swTo:"4.9",serial:"All serials"}
  }),
  criteria:[
   ["Exactly one title remains",()=>getNodesByType("title").length===1],
   ["The step contains a cmd",()=>getNodesByType("step").every(n=>(n.children||[]).some(c=>c.type==="cmd"))],
   ["No empty note remains",()=>getNodesByType("note").every(n=>String(n.text||"").trim())]
  ],
  hints:["Imported content can contain states that normal Context Rules would prevent.","Check Completeness can tell you whether something is missing as well as whether there is too much.","Do not keep an empty element merely because it came from the source file."]
 },
 {
  id:"sc3",title:"Update software applicability",
  level:"Foundation",
  scenario:"Engineering has restricted this procedure. It now applies only to Variant B and software versions 4.5 through 4.9.",
  task:"Update the document applicability so it accurately represents the new configuration.",
  setup:()=>({
   nodes:[
    {type:"title",text:"Install display service update"},
    {type:"para",text:"Set the system to MAINTENANCE mode before installation."},
    {type:"step",text:"Install the approved package.",children:[{type:"cmd",text:"Select Install."}]}
   ],
   meta:{title:"Install display service update",dmc:"TRAINING-SCENARIO-03",security:"UNCLASSIFIED",issue:"002",workflow:"In Work"},
   applicability:{product:"Surface Sensor Software",variant:"All",swFrom:"4.0",swTo:"4.9",serial:"All serials",expression:'product == "Surface Sensor Software"'}
  }),
  criteria:[
   ["Variant is B",()=>String(state.model.applicability?.variant||"").trim().toUpperCase()==="B"],
   ["Software from is 4.5",()=>String(state.model.applicability?.swFrom||"").trim()==="4.5"],
   ["Software to is 4.9",()=>String(state.model.applicability?.swTo||"").trim()==="4.9"],
   ["Applicability expression identifies Variant B",()=>/variant\s*==?\s*["']?B/i.test(String(state.model.applicability?.expression||""))]
  ],
  hints:["Applicability is edited separately from ordinary element text.","The visible fields and the expression should tell the same story.","The task gives you both the variant and the software range."]
 },
 {
  id:"sc4",title:"Find and update terminology",
  level:"Intermediate",
  scenario:"The product terminology changed from “Radar Processor” to “Radar Processing Unit”. The document contains several old occurrences. A warning must remain exactly as written.",
  task:"Update every old product-name occurrence and verify the warning element is unchanged.",
  setup:()=>({
   nodes:[
    {type:"title",text:"Radar Processor software update"},
    {type:"para",text:"The Radar Processor hosts the processing service."},
    {type:"warning",text:"Do not disconnect electrical power during installation."},
    {type:"step",text:"Connect to the Radar Processor.",children:[{type:"cmd",text:"Open the Radar Processor maintenance interface."}]},
    {type:"note",text:"Record the Radar Processor software version."}
   ],
   meta:{title:"Radar Processor software update",dmc:"TRAINING-SCENARIO-04",security:"UNCLASSIFIED",issue:"003",workflow:"In Work"},
   applicability:{expression:'product == "Surface Sensor Software"',variant:"All",swFrom:"4.0",swTo:"4.9",serial:"All serials"},
   baseline:{warning:"Do not disconnect electrical power during installation."}
  }),
  criteria:[
   ["Old term no longer appears",()=>!/Radar Processor(?! Unit)/.test(flattenText(state.model.nodes||[]))],
   ["New term appears",()=>/Radar Processing Unit/.test(flattenText(state.model.nodes||[]))],
   ["Warning text is unchanged",()=>getNodeByType("warning")?.text===state.scenarioBaseline?.warning]
  ],
  hints:["This is a good candidate for Find/Replace rather than editing each occurrence manually.","Markup search and text search are different tools.","Use Find Tag/Attribute if you want to navigate directly to the warning."]
 },
 {
  id:"sc5",title:"Make the DM comply with Project BREX",
  level:"Intermediate",
  scenario:"This software procedure was drafted outside the project. The XML structure is usable, but it has not yet been brought into line with the active Strict Project BREX.",
  task:"Make the DM comply with the active Project BREX profile.",
  setup:()=>({
   profile:"saab_strict",
   nodes:[
    {type:"title",text:"Install processing service patch"},
    {type:"para",text:"Install the approved patch package."},
    {type:"step",text:"Install the patch.",children:[]}
   ],
   meta:{title:"Install processing service patch",dmc:"TRAINING-SCENARIO-05",security:"",issue:"",workflow:"In Work"},
   applicability:{product:"Surface Sensor Software",variant:"All",swFrom:"4.0",swTo:"4.9",serial:"All serials",expression:""}
  }),
  criteria:[
   ["Security classification supplied",()=>["UNCLASSIFIED","RESTRICTED"].includes(String(state.model.meta?.security||""))],
   ["Issue number supplied",()=>!!String(state.model.meta?.issue||"").trim()],
   ["Applicability expression supplied",()=>!!String(state.model.applicability?.expression||"").trim()],
   ["MAINTENANCE mode is stated",()=>/MAINTENANCE mode/i.test(flattenText(state.model.nodes||[]))],
   ["Every step has a cmd",()=>getNodesByType("step").every(n=>(n.children||[]).some(c=>c.type==="cmd"))]
  ],
  hints:["Read the BREX Rules tab instead of guessing what the project requires.","Some BREX rules concern metadata, not the body structure.","The active Strict profile contains more requirements than the Balanced profile."]
 },
 {
  id:"sc6",title:"Clean up procedural language",
  level:"Intermediate",
  scenario:"The technical content is correct, but the draft contains language that should be cleaned up before review.",
  task:"Prepare the procedure for technical review without changing its technical meaning.",
  setup:()=>({
   nodes:[
    {type:"title",text:"Verify update package"},
    {type:"para",text:"Prior to installation, you should utilize the approved maintenance laptop; make sure the package is correct."},
    {type:"step",text:"Verify the package.",children:[{type:"cmd",text:"You should verify the package signature."}]},
    {type:"note",text:"Record the package identifier for traceability."}
   ],
   meta:{title:"Verify update package",dmc:"TRAINING-SCENARIO-06",security:"UNCLASSIFIED",issue:"001",workflow:"In Work"},
   applicability:{expression:'product == "Surface Sensor Software"',variant:"All",swFrom:"4.0",swTo:"4.9",serial:"All serials"}
  }),
  criteria:[
   ["No “utilize” remains",()=>!/\butilize\b/i.test(flattenText(state.model.nodes||[]))],
   ["No “prior to” remains",()=>!/\bprior to\b/i.test(flattenText(state.model.nodes||[]))],
   ["No “should” remains",()=>!/\bshould\b/i.test(flattenText(state.model.nodes||[]))],
   ["No semicolon remains",()=>!/[;]/.test(flattenText(state.model.nodes||[]))],
   ["No “make sure” remains",()=>!/\bmake sure\b/i.test(flattenText(state.model.nodes||[]))]
  ],
  hints:["The enabled STE-style checks can identify several of the phrases.","Prefer short direct verbs such as use, verify and before.","A language warning is different from a structural completeness error."]
 },
 {
  id:"sc7",title:"Add the correct Fault Isolation reference",
  level:"Intermediate",
  scenario:"If installation fails, the maintainer must continue in the managed Fault Isolation DM. The correct DM is already available in the CSDB.",
  task:"Add the correct Fault Isolation cross-reference at the failure note and verify that the managed reference is present.",
  setup:()=>({
   nodes:[
    {type:"title",text:"Install software package"},
    {type:"para",text:"Set the system to MAINTENANCE mode."},
    {type:"step",text:"Install the package.",children:[{type:"cmd",text:"Select Install."}]},
    {type:"note",text:"If the installation fails, continue with fault isolation."}
   ],
   meta:{title:"Install software package",dmc:"TRAINING-SCENARIO-07",security:"UNCLASSIFIED",issue:"001",workflow:"In Work"},
   applicability:{expression:'product == "Surface Sensor Software"',variant:"All",swFrom:"4.0",swTo:"4.9",serial:"All serials"},
   selectType:"note"
  }),
  criteria:[
   ["Fault Isolation DM is referenced",()=>getNodesByType("note").some(n=>(n.xrefs||[]).some(x=>x.dmc==="23-31-01-310-801A-A"))],
   ["Reference is attached to the failure note",()=>getNodeByType("note")?.xrefs?.some(x=>x.dmc==="23-31-01-310-801A-A")]
  ],
  hints:["Use the managed Xref picker rather than typing a DMC as ordinary text.","The target is the Fault Isolation DM in the CSDB.","Attach the reference to the note that tells the maintainer what to do after a failure."]
 },
 {
  id:"sc8",title:"Implement an engineering change",
  level:"Advanced",
  scenario:"Engineering change EC-042: from software 4.7, a manual restart is no longer required. After installation, the author must instead verify that the Radar Processing Service status is Running.",
  task:"Update the procedure to implement EC-042.",
  setup:()=>({
   nodes:[
    {type:"title",text:"Install Radar Processing Service update"},
    {type:"para",text:"Set the system to MAINTENANCE mode."},
    {type:"step",text:"Install the update.",children:[{type:"cmd",text:"Select Install."}]},
    {type:"step",text:"Restart the processing service.",children:[{type:"cmd",text:"Select Restart."}]},
    {type:"step",text:"Complete the installation.",children:[{type:"cmd",text:"Record the installed version."}]}
   ],
   meta:{title:"Install Radar Processing Service update",dmc:"TRAINING-SCENARIO-08",security:"UNCLASSIFIED",issue:"004",workflow:"In Work"},
   applicability:{product:"Surface Sensor Software",variant:"All",swFrom:"4.7",swTo:"4.9",serial:"All serials",expression:'software >= "4.7"'}
  }),
  criteria:[
   ["Obsolete restart instruction removed",()=>!/\brestart\b/i.test(flattenText(state.model.nodes||[]))],
   ["Service status verification added",()=>/Radar Processing Service.*status|status.*Radar Processing Service/i.test(flattenText(state.model.nodes||[]))],
   ["Running state is specified",()=>/\bRunning\b/i.test(flattenText(state.model.nodes||[]))],
   ["All remaining steps contain cmd",()=>getNodesByType("step").every(n=>(n.children||[]).some(c=>c.type==="cmd"))]
  ],
  hints:["Treat the engineering change as requirements, not as text to paste verbatim.","Remove the obsolete action rather than leaving contradictory instructions.","The new verification should be an actionable command in the procedure."]
 },
 {
  id:"sc9",title:"Prepare the DM for review",
  level:"Advanced",
  scenario:"This DM is almost finished. It contains several small issues left by the author. No checklist has been supplied by engineering.",
  task:"Prepare this DM for review and submit it when you are satisfied.",
  setup:()=>({
   profile:"saab_strict",
   nodes:[
    {type:"title",text:"Verify processing service baseline"},
    {type:"para",text:"Set the system to MAINTENANCE mode before verification."},
    {type:"step",text:"Open the service status page.",children:[{type:"cmd",text:"You should select Service Status."}]},
    {type:"step",text:"Verify the baseline.",children:[{type:"cmd",text:"Verify that the displayed baseline is approved."}]},
    {type:"note",text:""}
   ],
   meta:{title:"Verify processing service baseline",dmc:"TRAINING-SCENARIO-09",security:"UNCLASSIFIED",issue:"005",workflow:"In Work"},
   applicability:{product:"Surface Sensor Software",variant:"All",swFrom:"4.0",swTo:"4.9",serial:"All serials",expression:""}
  }),
  criteria:[
   ["No empty elements remain",()=>getNodesByType("note").every(n=>String(n.text||"").trim())],
   ["Applicability is supplied",()=>!!String(state.model.applicability?.expression||"").trim()],
   ["Procedural language no longer uses should",()=>!/\bshould\b/i.test(flattenText(state.model.nodes||[]))],
   ["DM submitted for review",()=>state.model.meta?.workflow==="In Review"]
  ],
  hints:["A review-ready DM should satisfy both structural/project checks and obvious language issues.","Check Completeness and BREX Rules answer different questions.","Submitting for review is a workflow action, not the same thing as Check in."]
 },
 {
  id:"sc10",title:"Resolve a returned DM and check it in",
  level:"Advanced",
  scenario:"The reviewer returned this DM with three findings: clarify the verification action, restrict applicability to Variant B, and remove the obsolete note.",
  task:"Return the DM to authoring, resolve the review findings, verify the document, resolve the review comments, and check the DM back in.",
  setup:()=>({
   profile:"balanced",
   nodes:[
    {type:"title",text:"Verify operator display service"},
    {type:"para",text:"Set the system to MAINTENANCE mode."},
    {type:"step",text:"Verify the display service.",children:[{type:"cmd",text:"Check the service."}]},
    {type:"note",text:"Obsolete: restart the display computer after verification."}
   ],
   meta:{title:"Verify operator display service",dmc:"TRAINING-SCENARIO-10",security:"UNCLASSIFIED",issue:"006",workflow:"In Review"},
   applicability:{product:"Surface Sensor Software",variant:"All",swFrom:"4.0",swTo:"4.9",serial:"All serials",expression:'product == "Surface Sensor Software"'},
   comments:[
    {author:"Reviewer",time:"Review",text:"Clarify the verification action and expected result.",resolved:false},
    {author:"Reviewer",time:"Review",text:"Restrict applicability to Variant B.",resolved:false},
    {author:"Reviewer",time:"Review",text:"Remove the obsolete restart note.",resolved:false}
   ]
  }),
  criteria:[
   ["Returned to authoring",()=>state.model.meta?.workflow==="In Work"],
   ["Verification states the expected result",()=>/Running|active|operational/i.test(flattenText(state.model.nodes||[]))],
   ["Applicability restricted to Variant B",()=>String(state.model.applicability?.variant||"").trim().toUpperCase()==="B"&&/variant\s*==?\s*["']?B/i.test(String(state.model.applicability?.expression||""))],
   ["Obsolete restart note removed",()=>!/Obsolete:|restart the display computer/i.test(flattenText(state.model.nodes||[]))],
   ["All review comments resolved",()=>{const d=getActiveDocument();return !!d&&(d.comments||[]).length>=3&&(d.comments||[]).every(c=>c.resolved)}],
   ["DM checked in",()=>!!state.drillEvidence?.checkedIn]
  ],
  hints:["Start with the workflow state: content in review is not ready for normal authoring.","Use the review comments as requirements and resolve them after making the changes.","Check in is the final hand-back action; it is separate from Save and workflow state."]
 }
];

function scenarioProgressKey(){return "techauthorScenarioProgressV727"}
function loadScenarioProgress(){try{return JSON.parse(localStorage.getItem(scenarioProgressKey())||"{}")}catch(e){return{}}}
function saveScenarioProgress(){localStorage.setItem(scenarioProgressKey(),JSON.stringify(state.scenarioProgress||{}))}
function currentScenario(){return scenarioPractice[state.scenarioIndex||0]}

function hydrateScenarioNode(n){
 const out={id:uid(),type:n.type,text:n.text||""};
 if(n.attrs)out.attrs=JSON.parse(JSON.stringify(n.attrs));
 if(n.children)out.children=n.children.map(hydrateScenarioNode);
 if(n.rows){out.rows=JSON.parse(JSON.stringify(n.rows));out.headerRow=n.headerRow!==false}
 if(n.xrefs)out.xrefs=JSON.parse(JSON.stringify(n.xrefs));
 return out;
}

function applyScenarioSetup(scenario){
 const spec=scenario.setup();
 state.trainingExercise={id:scenario.id,title:`Scenario — ${scenario.title}`};
 state.scenarioAttempts=0;
 state.scenarioHintIndex=0;
 state.scenarioBaseline=spec.baseline||{};
 state.drillEvidence={};
 state.lastLearningAction=null;
 state.undoStack=[];state.redoStack=[];
 state.issues=[];

 state.model.meta={...state.model.meta,...(spec.meta||{})};
 state.model.applicability={
   product:"Surface Sensor Software",variant:"All",swFrom:"",swTo:"",
   serial:"All serials",expression:"",...(spec.applicability||{})
 };
 state.model.nodes=(spec.nodes||[]).map(hydrateScenarioNode);
 state.model.meta.workflow=state.model.meta.workflow||"In Work";

 if(spec.profile){
   if($("#brexProfileSelect"))$("#brexProfileSelect").value=spec.profile;
   if($("#ruleProfileInput"))$("#ruleProfileInput").value=spec.profile;
 }

 const active=getActiveDocument();
 if(active){
   active.comments=JSON.parse(JSON.stringify(spec.comments||[]));
   active.model=JSON.parse(JSON.stringify(state.model));
   active.title=state.model.meta.title;
   active.dmc=state.model.meta.dmc;
 }
 state.rootSelected=false;
 const selectType=spec.selectType;
 state.selectedId=selectType?getNodeByType(selectType)?.id:state.model.nodes[0]?.id||null;
 state.dirty=true;

 renderAuthor();renderTree();syncControlsFromModel();renderReferences();renderComments();
 renderBrexPanel();renderElementCoach();refreshInsertOptions();updateContext();
 syncSourcePassive();renderPreview();setWorkflowButtons();updateUndoRedoButtons();
 if($("#currentDocLabel"))$("#currentDocLabel").textContent=`DM ${state.model.meta.dmc}`;
 if($("#docTabTitle"))$("#docTabTitle").textContent=`${state.model.meta.dmc} — ${state.model.meta.title}`;
}

function renderScenarioSelector(){
 const sel=$("#scenarioSelect");if(!sel)return;
 state.scenarioProgress=state.scenarioProgress||loadScenarioProgress();
 sel.innerHTML=scenarioPractice.map((s,i)=>`<option value="${i}">${state.scenarioProgress[s.id]?"✓ ":""}${i+1}. ${esc(s.title)}</option>`).join("");
 sel.value=String(state.scenarioIndex||0);
 renderScenarioIntro();
}

function renderScenarioIntro(){
 const s=currentScenario(),host=$("#scenarioCard");if(!s||!host)return;
 const done=!!state.scenarioProgress?.[s.id];
 host.innerHTML=`
   <div class="scenario-head"><span>Scenario ${(state.scenarioIndex||0)+1} / ${scenarioPractice.length}</span><span class="scenario-level">${esc(s.level)}</span></div>
   <h4>${esc(s.title)}</h4>
   <div class="scenario-section"><strong>Scenario</strong><p>${esc(s.scenario)}</p></div>
   <div class="scenario-section task"><strong>Your task</strong><p>${esc(s.task)}</p></div>
   ${done?'<div class="scenario-complete-badge">✓ Previously completed</div>':""}`;
 $("#scenarioStartBtn")?.classList.remove("hidden");
 $("#scenarioCheckBtn")?.classList.add("hidden");
 $("#scenarioHintBtn")?.classList.add("hidden");
 $("#scenarioNextBtn")?.classList.add("hidden");
 if($("#scenarioFeedback"))$("#scenarioFeedback").innerHTML="";
}

function startScenario(){
 const s=currentScenario();if(!s)return;
 applyScenarioSetup(s);
 $("#scenarioStartBtn")?.classList.add("hidden");
 $("#scenarioCheckBtn")?.classList.remove("hidden");
 $("#scenarioHintBtn")?.classList.add("hidden");
 $("#scenarioNextBtn")?.classList.add("hidden");
 if($("#scenarioFeedback"))$("#scenarioFeedback").innerHTML=`<div class="scenario-status">Scenario loaded. Work in the editor and use any tools you think are appropriate.</div>`;
}

function evaluateScenario(){
 const s=currentScenario();if(!s)return [];
 return s.criteria.map(([label,test])=>{
   let pass=false;try{pass=!!test()}catch(e){}
   return {label,pass};
 });
}

function checkScenario(){
 const s=currentScenario();if(!s)return;
 state.scenarioAttempts=(state.scenarioAttempts||0)+1;
 const results=evaluateScenario(),failed=results.filter(r=>!r.pass);
 const fb=$("#scenarioFeedback");
 if(!failed.length){
   state.scenarioProgress=state.scenarioProgress||loadScenarioProgress();
   state.scenarioProgress[s.id]=true;saveScenarioProgress();
   if(fb)fb.innerHTML=`<div class="scenario-result pass"><strong>✓ Scenario complete</strong><div>All ${results.length} acceptance criteria are satisfied.</div><div class="scenario-criteria">${results.map(r=>`<div>✓ ${esc(r.label)}</div>`).join("")}</div></div>`;
   $("#scenarioCheckBtn")?.classList.add("hidden");
   $("#scenarioHintBtn")?.classList.add("hidden");
   $("#scenarioNextBtn")?.classList.toggle("hidden",(state.scenarioIndex||0)>=scenarioPractice.length-1);
   renderScenarioSelector();
   $("#scenarioStartBtn")?.classList.add("hidden");
   $("#scenarioCheckBtn")?.classList.add("hidden");
   $("#scenarioNextBtn")?.classList.toggle("hidden",(state.scenarioIndex||0)>=scenarioPractice.length-1);
   return;
 }
 if(fb)fb.innerHTML=`<div class="scenario-result fail"><strong>Not ready yet</strong><div>${failed.length} of ${results.length} acceptance criteria are not yet satisfied.</div><div class="scenario-attempt">Attempt ${state.scenarioAttempts}. The criteria stay hidden so you still have to diagnose the document.</div></div>`;
 if(state.scenarioAttempts>=2&&s.hints?.length)$("#scenarioHintBtn")?.classList.remove("hidden");
}

function showScenarioHint(){
 const s=currentScenario();if(!s?.hints?.length)return;
 const i=Math.min(state.scenarioHintIndex||0,s.hints.length-1);
 const fb=$("#scenarioFeedback");
 if(fb)fb.innerHTML+=`<div class="scenario-hint"><strong>Hint ${i+1}</strong><div>${esc(s.hints[i])}</div></div>`;
 state.scenarioHintIndex=Math.min(i+1,s.hints.length-1);
}

function nextScenario(){
 if((state.scenarioIndex||0)>=scenarioPractice.length-1)return;
 state.scenarioIndex++;
 state.scenarioAttempts=0;state.scenarioHintIndex=0;
 renderScenarioSelector();
}


// Expose curriculum globals for classic multi-script load and Node smoke tests.
(function(g){
  g.drillChapterSpecs = drillChapterSpecs;
  g.drillChapters = drillChapters;
  g.makeDrill = makeDrill;
  g.drillSetupBase = drillSetupBase;
  g.drillModel = drillModel;
  g.getNodesByType = getNodesByType;
  g.getNodeByType = getNodeByType;
  g.hasChild = hasChild;
  g.hasChildNode = hasChildNode;
  g.applyDrillSetup = applyDrillSetup;
  g.checkCurrentDrill = checkCurrentDrill;
  g.loadCurrentDrill = loadCurrentDrill;
  g.startBeginnerDrills = startBeginnerDrills;
  g.scenarioPractice = scenarioPractice;
  g.renderScenarioSelector = renderScenarioSelector;
  g.renderScenarioIntro = renderScenarioIntro;
  g.startScenario = startScenario;
  g.checkScenario = checkScenario;
  g.showScenarioHint = showScenarioHint;
  g.nextScenario = nextScenario;
})(typeof globalThis !== "undefined" ? globalThis : window);
