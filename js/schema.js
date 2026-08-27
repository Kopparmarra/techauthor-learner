/* TechAuthor Learner — schema & BREX profiles
 * Loaded before app.js (classic script, no bundler).
 */
const schema = {
  mainProcedure:["title","sectionTitle","para","warning","note","step","codeblock","table"],
  title:[],
  sectionTitle:[],
  para:[],
  warning:[],
  note:[],
  step:["cmd","note","warning","codeblock"],
  cmd:[],
  codeblock:[],
  table:[]
};

const brexProfiles = {
  saab_strict:{
    label:"Project BREX — Strict",
    brexDm:"BREX-DM-DEMO-001",
    rules:[
      {id:"BR-001",type:"required",target:"document",message:"Exactly one title is required."},
      {id:"BR-002",type:"required",target:"procedure",message:"A procedure must contain at least one step."},
      {id:"BR-003",type:"required",target:"step",message:"Each step must contain at least one cmd child."},
      {id:"BR-004",type:"requiredText",pattern:"MAINTENANCE mode",message:"Software maintenance procedures must state MAINTENANCE mode."},
      {id:"BR-005",type:"metadata",field:"security",message:"Security classification is required."},
      {id:"BR-006",type:"metadata",field:"issue",message:"Issue number is required."},
      {id:"BR-007",type:"applicability",message:"Applicability expression is required for software procedures."},
      {id:"BR-008",type:"forbidElement",element:"sectionTitle",context:"step",message:"sectionTitle is not permitted inside a step."},
      {id:"BR-009",type:"forbidElement",element:"table",context:"step",message:"table is not permitted directly inside a step."},
      {id:"BR-010",type:"allowedValue",field:"security",values:["UNCLASSIFIED","RESTRICTED"],message:"Security classification must use an approved value."}
    ],
    disallowedByContext:{
      mainProcedure:[],
      step:["title","sectionTitle","table","para"],
      warning:["title","sectionTitle","step","cmd","table","codeblock","para","note","warning"],
      note:["title","sectionTitle","step","cmd","table","codeblock","para","note","warning"]
    }
  },
  balanced:{
    label:"Project BREX — Balanced",
    brexDm:"BREX-DM-DEMO-002",
    rules:[
      {id:"BR-101",type:"required",target:"document",message:"Exactly one title is required."},
      {id:"BR-102",type:"required",target:"procedure",message:"A procedure should contain at least one step."},
      {id:"BR-103",type:"metadata",field:"security",message:"Security classification is required."}
    ],
    disallowedByContext:{
      mainProcedure:[],
      step:["title","sectionTitle","table"],
      warning:["title","sectionTitle","step","cmd","table","codeblock","para","note","warning"],
      note:["title","sectionTitle","step","cmd","table","codeblock","para","note","warning"]
    }
  },
  training:{
    label:"Training profile",
    brexDm:"BREX-DM-TRAINING-001",
    rules:[
      {id:"TR-001",type:"required",target:"document",message:"Keep one title in the document."}
    ],
    disallowedByContext:{
      mainProcedure:[],
      step:["title"],
      warning:[],
      note:[]
    }
  }
};


const elementLessons={
 mainProcedure:{summary:"The document root contains the top-level structured content of the current DM.",role:"Document root",parents:[],good:"Use Inside to add top-level elements such as sections, paragraphs and steps.",common:"Do not try to insert top-level siblings by selecting a leaf element and using Inside."},
 title:{summary:"The title identifies the purpose of the current data module.",role:"Document identification",parents:["mainProcedure"],good:"Keep the title short and aligned with the DM scope.",common:"Do not use the title as a paragraph."},
 sectionTitle:{summary:"A sectionTitle introduces a logical subsection.",role:"Section heading",parents:["mainProcedure"],good:"Use it for meaningful information divisions.",common:"Do not add headings only for visual styling."},
 para:{summary:"A para contains explanatory or supporting prose.",role:"General text",parents:["mainProcedure"],good:"Keep one purpose per paragraph.",common:"Do not hide actions inside long prose."},
 warning:{summary:"A warning communicates a safety-critical condition.",role:"Safety information",parents:["mainProcedure","step"],good:"Place it before the relevant action.",common:"Do not overuse warnings."},
 note:{summary:"A note gives supplementary information, not the main instruction.",role:"Supporting information",parents:["mainProcedure","step"],good:"Use for clarification or useful context.",common:"Do not put mandatory actions inside a note."},
 step:{summary:"A step groups one procedural action and its subordinate commands.",role:"Procedure structure",parents:["mainProcedure"],good:"Keep one clear action per step.",common:"Do not combine unrelated actions."},
 cmd:{summary:"A cmd is the direct action the user must perform.",role:"Instruction",parents:["step"],good:"Start with an imperative verb.",common:"Avoid vague descriptive wording."},
 codeblock:{summary:"A codeblock preserves command-line or software output.",role:"Literal software content",parents:["mainProcedure","step"],good:"Use for commands, logs, or configuration.",common:"Do not use it for ordinary prose."},
 table:{summary:"A table presents structured values for comparison.",role:"Reference data",parents:["mainProcedure"],good:"Use for versions, parameters, or applicability.",common:"Avoid narrative procedures inside tables."}
};
const guidedTask={title:"Create a software rollback procedure",scenario:"Roll back Radar Processing Service from 4.3.1 to approved baseline 4.2.7.",requirements:[
 {label:"One title",test:()=>state.model?.nodes.filter(n=>n.type==="title").length===1},
 {label:"A warning",test:()=>state.model?.nodes.some(n=>n.type==="warning")},
 {label:"At least four steps",test:()=>state.model?.nodes.filter(n=>n.type==="step").length>=4},
 {label:"Every step has a cmd",test:()=>state.model?.nodes.filter(n=>n.type==="step").every(n=>(n.children||[]).some(c=>c.type==="cmd"))},
 {label:"At least one codeblock",test:()=>hasNodeType(state.model?.nodes||[],"codeblock")},
 {label:"Reference Fault Isolation DM",test:()=>flattenText(state.model?.nodes||[]).includes("23-31-01-310-801A-A")},
 {label:"State MAINTENANCE mode",test:()=>/MAINTENANCE mode/i.test(flattenText(state.model?.nodes||[]))}
]};
const exercises={
 rollback:{title:"Build a software rollback procedure",description:"Create a software rollback procedure for Radar Processing Service from 4.3.1 to approved baseline 4.2.7.",nodes:()=>[
   {id:uid(),type:"title",text:"Software rollback procedure"},
   {id:uid(),type:"para",text:"Create the rollback procedure from this starter structure."},
   {id:uid(),type:"sectionTitle",text:"Procedure"}
 ]},
 mixed:{title:"Mixed validation challenge",description:"Correct a mixture of BREX, STE and structure problems.",nodes:()=>[{id:uid(),type:"title",text:"Install update package"},{id:uid(),type:"para",text:"Prior to installation, you should utilize the maintenance laptop; make sure the package is correct."},{id:uid(),type:"step",text:"Install the package.",children:[]},{id:uid(),type:"note",text:"If installation fails, repeat as necessary."}]},
 schema:{title:"Schema challenge",description:"Repair an incomplete procedure structure.",nodes:()=>[{id:uid(),type:"title",text:"Verify software baseline"},{id:uid(),type:"step",text:"Verify the software version.",children:[]}]},
 brex:{title:"BREX challenge",description:"Make this procedure comply with the active project BREX.",nodes:()=>[{id:uid(),type:"title",text:"Replace software package"},{id:uid(),type:"step",text:"Replace the package.",children:[{id:uid(),type:"cmd",text:"Select Install."}]}]},
 ste:{title:"STE challenge",description:"Improve procedural language without changing meaning.",nodes:()=>[{id:uid(),type:"title",text:"Check software package"},{id:uid(),type:"para",text:"Prior to installation, you should utilize the approved utility; make sure the status is valid."},{id:uid(),type:"step",text:"Check the package.",children:[{id:uid(),type:"cmd",text:"You should verify the package signature."}]}]},
 xref:{title:"Cross-reference challenge",description:"Add the correct Fault Isolation reference.",nodes:()=>[{id:uid(),type:"title",text:"Recover from installation failure"},{id:uid(),type:"warning",text:"Set the system to MAINTENANCE mode before recovery."},{id:uid(),type:"step",text:"Record the installation failure.",children:[{id:uid(),type:"cmd",text:"Record the displayed fault message."}]},{id:uid(),type:"note",text:"Refer to the applicable fault-isolation data module."}]}
};





(function(g){
  g.schema = schema;
  g.brexProfiles = brexProfiles;
  if (typeof elementLessons !== "undefined") g.elementLessons = elementLessons;
  if (typeof guidedTask !== "undefined") g.guidedTask = guidedTask;
  if (typeof exercises !== "undefined") g.exercises = exercises;
})(typeof globalThis !== "undefined" ? globalThis : window);
