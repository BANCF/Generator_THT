// State Management
let currentProblem = {
  title: "",
  code: "",
  level: "cap2",
  description: "",
  inputDesc: "",
  outputDesc: "",
  subtasks: [],
  sampleTests: [],
  solutionCodePython: "",
  solutionCodeCpp: ""
};

let generatedTestcases = [];

const RANDOM_CHARACTERS = ["Alice", "Bo", "Tèo", "Tí", "Vy", "Bình", "Nam", "An", "Lan", "Mai", "Minh", "Tâm", "Đạt", "Khoa"];
const RANDOM_CONTEXTS = ["vương quốc VNOI", "trang trại số học", "lớp học Tin học", "vương quốc phép thuật", "trại hè lập trình", "học viện tin học trẻ"];

// Helper function to extract function body text
function getFnBody(fn) {
  const codeStr = fn.toString();
  const firstBrace = codeStr.indexOf('{');
  const lastBrace = codeStr.lastIndexOf('}');
  return codeStr.substring(firstBrace + 1, lastBrace).trim();
}

// Helper function to clean AI-generated JavaScript source code
function cleanJSSourceCode(code) {
  if (!code) return "";
  let cleaned = code.trim();
  
  // Remove markdown code blocks if present (e.g., ```javascript ... ``` or ```js ... ```)
  cleaned = cleaned.replace(/^```(javascript|js)?\n/i, "");
  cleaned = cleaned.replace(/\n```$/, "");
  cleaned = cleaned.trim();
  
  // Check if it's wrapped in a function statement, like:
  // function name(args) { body }
  // or function(args) { body }
  // or (args) => { body }
  // or const name = (args) => { body }
  const functionRegex = /^(?:const\s+\w+\s*=\s*)?(?:function\s*\w*\s*\([^)]*\)|(?:\([^)]*\)|\w+)\s*=>)\s*\{([\s\S]*)\}$/;
  const match = cleaned.match(functionRegex);
  if (match) {
    return match[1].trim();
  }
  
  // If it's just a return statement without braces, or a single expression (arrow function short syntax)
  const shortArrowRegex = /^(?:\([^)]*\)|\w+)\s*=>\s*([^`{][\s\S]*)$/;
  const shortMatch = cleaned.match(shortArrowRegex);
  if (shortMatch) {
    return `return ${shortMatch[1].trim()};`;
  }
  
  return cleaned;
}

// Helper function to normalize various field naming styles from AI models
function normalizeAIResult(json) {
  if (!json) return null;
  
  return {
    title: json.title || json.problem_title || json.name || "Bài toán mới",
    description: json.description || json.problem_description || json.story || json.content || "",
    inputDesc: json.inputDesc || json.input_description || json.input || "",
    outputDesc: json.outputDesc || json.output_description || json.output || "",
    subtasks: json.subtasks || json.sub_tasks || json.subtask_list || [],
    sampleTests: json.sampleTests || json.sample_tests || json.samples || json.sample_testcases || [],
    generateInput: json.generateInput || json.generate_input || json.inputGenerator || json.input_generator || "",
    solve: json.solve || json.solver || json.solve_function || json.solveFunction || "",
    solutionCodePython: json.solutionCodePython || json.python_code || json.pythonCode || json.pythonSolution || json.python || "",
    solutionCodeCpp: json.solutionCodeCpp || json.cpp_code || json.cppCode || json.cppSolution || json.cpp || ""
  };
}


function randomizeProblemText(text, characterName, contextName) {
  if (!text) return "";
  let result = text;
  
  // Replace character names
  const characterPlaceholders = [
    /\bBo\b/g, /\bTèo\b/g, /\bTí\b/g, /\bVy\b/g, /\bBình\b/g, /\bNam\b/g, /\bAn\b/g, 
    /\bLan\b/g, /\bMai\b/g, /\bMinh\b/g, /\bTâm\b/g, /\bĐạt\b/g, /\bKhoa\b/g, 
    /\bAlice\b/g, /\bchú mèo Scratch\b/g, /\bmèo Scratch\b/g
  ];
  
  characterPlaceholders.forEach(ph => {
    if (ph.source === "chú\\smèo\\sScratch" || ph.source === "mèo\\sScratch") {
      result = result.replace(ph, `mèo ${characterName}`);
    } else {
      result = result.replace(ph, characterName);
    }
  });

  // Replace context names
  const contextPlaceholders = [
    /\bvương quốc VNOI\b/gi, /\btrang trại số học\b/gi, /\blớp học Tin học\b/gi, 
    /\bvương quốc phép thuật\b/gi, /\btrại hè lập trình\b/gi, /\bhọc viện tin học trẻ\b/gi
  ];
  contextPlaceholders.forEach(ph => {
    result = result.replace(ph, contextName);
  });

  return result;
}

// Populate template list based on selected level
function populateTemplates() {
  const levelSelect = document.getElementById("problem-level");
  if (!levelSelect) return;
  const selectedLevel = levelSelect.value;
  const select = document.getElementById("template-select");
  
  select.innerHTML = "";
  
  const filtered = window.examTemplates.filter(t => t.level === selectedLevel);
  filtered.forEach((template, index) => {
    const opt = document.createElement("option");
    opt.value = template.id;
    opt.textContent = template.title;
    if (index === 0) opt.selected = true;
    select.appendChild(opt);
  });

  if (filtered.length > 0) {
    loadTemplate(filtered[0].id);
  }
}

// Populate variation list based on selected template
function populateVariations(template) {
  const select = document.getElementById("variation-select");
  select.innerHTML = "";

  if (!template || !template.variations || template.variations.length === 0) {
    document.getElementById("variation-select-group").style.display = "none";
    return;
  }

  document.getElementById("variation-select-group").style.display = "block";

  // Add "Random" option first
  const optRand = document.createElement("option");
  optRand.value = "random";
  optRand.textContent = "🎲 Ngẫu nhiên (Chọn tự động)";
  select.appendChild(optRand);

  template.variations.forEach((variation, index) => {
    const opt = document.createElement("option");
    opt.value = index.toString();
    opt.textContent = `${index + 1}. ${variation.subTitle || "Biến thể " + (index + 1)}`;
    select.appendChild(opt);
  });
  
  select.value = "random";
}

// Initialize template list
function initTemplates() {
  populateTemplates();
}

// Load selected template data
function loadTemplate(templateId) {
  const template = window.examTemplates.find(t => t.id === templateId);
  if (!template) return;
  populateVariations(template);
  triggerProblemGeneration(template);
}

// Generates the problem from the generator functions
function triggerProblemGeneration(template) {
  let variationIndex = document.getElementById("variation-select")?.value;
  let variation;

  if (template.variations && template.variations.length > 0) {
    if (variationIndex === "random" || !variationIndex) {
      // Pick a random variation
      const randomIndex = Math.floor(Math.random() * template.variations.length);
      variation = template.variations[randomIndex];
    } else {
      const idx = parseInt(variationIndex);
      variation = template.variations[idx] || template.variations[0];
    }
  } else {
    variation = template;
  }

  // Randomize names/contexts automatically as requested
  const charName = RANDOM_CHARACTERS[Math.floor(Math.random() * RANDOM_CHARACTERS.length)];
  const contextName = RANDOM_CONTEXTS[Math.floor(Math.random() * RANDOM_CONTEXTS.length)];
  
  currentProblem.title = `${template.title}: ${variation.subTitle || ''}`;
  currentProblem.code = (document.getElementById("problem-code")?.value || template.id.replace("c1_", "").replace("c2_", "").toUpperCase()).toUpperCase();
  currentProblem.level = template.level;
  
  // Randomize text content
  currentProblem.description = randomizeProblemText(variation.description, charName, contextName);
  currentProblem.inputDesc = randomizeProblemText(variation.inputDesc, charName, contextName);
  currentProblem.outputDesc = randomizeProblemText(variation.outputDesc, charName, contextName);
  
  // Clone and randomize subtasks
  currentProblem.subtasks = JSON.parse(JSON.stringify(variation.subtasks || []));
  currentProblem.subtasks.forEach(s => {
    s.desc = randomizeProblemText(s.desc, charName, contextName);
  });
  
  // Clone and randomize sample tests
  currentProblem.sampleTests = JSON.parse(JSON.stringify(variation.sampleTests || []));
  currentProblem.sampleTests.forEach(st => {
    st.explain = randomizeProblemText(st.explain, charName, contextName);
  });

  currentProblem.solutionCodePython = variation.solutionCodePython;
  currentProblem.solutionCodeCpp = variation.solutionCodeCpp;

  // Set basic inputs in editor
  document.getElementById("problem-title").value = currentProblem.title;
  document.getElementById("problem-code").value = currentProblem.code;
  const problemLevelEl = document.getElementById("problem-level");
  if (problemLevelEl) problemLevelEl.value = currentProblem.level;
  document.getElementById("problem-description").value = currentProblem.description;
  document.getElementById("problem-input-desc").value = currentProblem.inputDesc;
  document.getElementById("problem-output-desc").value = currentProblem.outputDesc;

  // Set JS generator & solver editors
  document.getElementById("js-input-generator").value = getFnBody(variation.generateInput);
  document.getElementById("js-solver").value = getFnBody(variation.solve);

  // Set Solutions
  document.getElementById("sol-code-py").value = currentProblem.solutionCodePython;
  document.getElementById("sol-code-cpp").value = currentProblem.solutionCodeCpp;

  // Render lists
  renderSubtasksList();
  renderSamplesList();
  
  // Render Preview
  renderProblemDocument();
  
  // Auto-generate testcases on generation trigger
  generateTestcases();
}

// Render subtask editor list
function renderSubtasksList() {
  const listContainer = document.getElementById("subtasks-list");
  listContainer.innerHTML = "";

  currentProblem.subtasks.forEach((subtask, index) => {
    const card = document.createElement("div");
    card.className = "subtask-card";
    card.dataset.index = index;

    card.innerHTML = `
      <div class="subtask-card-header">
        <span>Subtask ${index + 1}</span>
        <button type="button" class="btn btn-outline-danger btn-sm delete-subtask-btn">
          <i class="bi bi-trash"></i> Xóa
        </button>
      </div>
      <div class="form-row">
        <div class="form-group col-4">
          <label>Phần trăm điểm (%)</label>
          <input type="number" class="form-control subtask-percent" value="${subtask.percent}" min="0" max="100">
        </div>
        <div class="form-group col-8">
          <label>Giới hạn (Ví dụ: ~1 \\le N \\le 10^6~)</label>
          <input type="text" class="form-control subtask-limit" value="${subtask.limit}">
        </div>
      </div>
      <div class="form-group">
        <label>Mô tả thuật toán đích</label>
        <input type="text" class="form-control subtask-desc" value="${subtask.desc}">
      </div>
      <div class="form-row">
        <div class="form-group col-6">
          <label>Tham số Min (cho sinh test)</label>
          <input type="text" class="form-control subtask-minval" value="${subtask.minVal || ''}">
        </div>
        <div class="form-group col-6">
          <label>Tham số Max (cho sinh test)</label>
          <input type="text" class="form-control subtask-maxval" value="${subtask.maxVal || ''}">
        </div>
      </div>
    `;

    // Listeners for subtask changes
    card.querySelector(".subtask-percent").addEventListener("input", (e) => {
      currentProblem.subtasks[index].percent = parseInt(e.target.value) || 0;
      renderProblemDocument();
    });
    card.querySelector(".subtask-limit").addEventListener("input", (e) => {
      currentProblem.subtasks[index].limit = e.target.value;
      renderProblemDocument();
    });
    card.querySelector(".subtask-desc").addEventListener("input", (e) => {
      currentProblem.subtasks[index].desc = e.target.value;
      renderProblemDocument();
    });
    card.querySelector(".subtask-minval").addEventListener("input", (e) => {
      currentProblem.subtasks[index].minVal = isNaN(e.target.value) ? e.target.value : Number(e.target.value);
    });
    card.querySelector(".subtask-maxval").addEventListener("input", (e) => {
      currentProblem.subtasks[index].maxVal = isNaN(e.target.value) ? e.target.value : Number(e.target.value);
    });
    card.querySelector(".delete-subtask-btn").addEventListener("click", () => {
      currentProblem.subtasks.splice(index, 1);
      renderSubtasksList();
      renderProblemDocument();
    });

    listContainer.appendChild(card);
  });
}

// Render sample test editor list
function renderSamplesList() {
  const listContainer = document.getElementById("samples-list");
  listContainer.innerHTML = "";

  currentProblem.sampleTests.forEach((sample, index) => {
    const card = document.createElement("div");
    card.className = "sample-card";
    card.dataset.index = index;

    card.innerHTML = `
      <div class="sample-card-header">
        <span>Ví dụ ${index + 1}</span>
        <button type="button" class="btn btn-outline-danger btn-sm delete-sample-btn">
          <i class="bi bi-trash"></i> Xóa
        </button>
      </div>
      <div class="form-row">
        <div class="form-group col-6">
          <label>Input mẫu</label>
          <textarea class="form-control code-font sample-input" rows="2">${sample.input}</textarea>
        </div>
        <div class="form-group col-6">
          <label>Output mẫu</label>
          <textarea class="form-control code-font sample-output" rows="2">${sample.output}</textarea>
        </div>
      </div>
      <div class="form-group">
        <label>Giải thích ví dụ (nếu có)</label>
        <input type="text" class="form-control sample-explain" value="${sample.explain || ''}">
      </div>
    `;

    // Listeners for sample changes
    card.querySelector(".sample-input").addEventListener("input", (e) => {
      currentProblem.sampleTests[index].input = e.target.value;
      renderProblemDocument();
    });
    card.querySelector(".sample-output").addEventListener("input", (e) => {
      currentProblem.sampleTests[index].output = e.target.value;
      renderProblemDocument();
    });
    card.querySelector(".sample-explain").addEventListener("input", (e) => {
      currentProblem.sampleTests[index].explain = e.target.value;
      renderProblemDocument();
    });
    card.querySelector(".delete-sample-btn").addEventListener("click", () => {
      currentProblem.sampleTests.splice(index, 1);
      renderSamplesList();
      renderProblemDocument();
    });

    listContainer.appendChild(card);
  });
}

// Custom Markdown renderer leaving math delimiters intact for KaTeX
function formatMarkdown(text) {
  if (!text) return "";
  
  // Safe HTML escape
  let escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Format **text** as strong
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Format code blocks
  escaped = escaped.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Format backticks `code`
  escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Format newlines
  return escaped.replace(/\n/g, "<br>");
}

// Generate the Problem Statement preview (matching Mau_up_he_thong.txt)
function renderProblemDocument() {
  const container = document.getElementById("problem-document-render");
  container.innerHTML = "";

  // Title block
  const titleDiv = document.createElement("div");
  titleDiv.className = "problem-title-display";
  titleDiv.textContent = `BÀI: ${currentProblem.title}`;
  container.appendChild(titleDiv);

  // Description / Story
  const descP = document.createElement("p");
  descP.innerHTML = formatMarkdown(currentProblem.description);
  container.appendChild(descP);

  // ## Input Section
  const inputH2 = document.createElement("h2");
  inputH2.textContent = "## Input";
  container.appendChild(inputH2);

  const inputP = document.createElement("p");
  inputP.innerHTML = formatMarkdown(currentProblem.inputDesc);
  container.appendChild(inputP);

  // ## Output Section
  const outputH2 = document.createElement("h2");
  outputH2.textContent = "## Output";
  container.appendChild(outputH2);

  const outputP = document.createElement("p");
  outputP.innerHTML = formatMarkdown(currentProblem.outputDesc);
  container.appendChild(outputP);

  // Predefined samples
  currentProblem.sampleTests.forEach((sample, index) => {
    const sampleInH2 = document.createElement("h2");
    sampleInH2.textContent = `## Sample Input ${index + 1}`;
    container.appendChild(sampleInH2);

    const sampleInPre = document.createElement("pre");
    sampleInPre.innerHTML = `<code>${sample.input}</code>`;
    container.appendChild(sampleInPre);

    const sampleOutH2 = document.createElement("h2");
    sampleOutH2.textContent = `## Sample Output ${index + 1}`;
    container.appendChild(sampleOutH2);

    const sampleOutPre = document.createElement("pre");
    sampleOutPre.innerHTML = `<code>${sample.output}</code>`;
    container.appendChild(sampleOutPre);

    if (sample.explain) {
      const explainP = document.createElement("p");
      explainP.innerHTML = `<strong>Giải thích:</strong> ${formatMarkdown(sample.explain)}`;
      container.appendChild(explainP);
    }
  });

  // ## Subtask Section
  const subtaskH2 = document.createElement("h2");
  subtaskH2.textContent = "## Subtask";
  container.appendChild(subtaskH2);

  const subtaskUl = document.createElement("ul");
  currentProblem.subtasks.forEach(subtask => {
    const li = document.createElement("li");
    li.innerHTML = `~${subtask.percent}\%~ số điểm: ~${subtask.limit}~ ${subtask.desc}`;
    subtaskUl.appendChild(li);
  });
  
  container.appendChild(subtaskUl);

  // Update Solution codes in Tab 3
  document.getElementById("python-solution-code").textContent = currentProblem.solutionCodePython;
  document.getElementById("cpp-solution-code").textContent = currentProblem.solutionCodeCpp;

  // Trigger KaTeX math rendering on the entire document container
  if (window.renderMathInElement) {
    window.renderMathInElement(container, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '~', right: '~', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
      ],
      throwOnError: false
    });
  }
}

// Generate the 10+ Testcases
function generateTestcases() {
  let totalTestsInput = parseInt(document.getElementById("problem-num-tests").value) || 10;
  if (totalTestsInput < 10) {
    totalTestsInput = 10;
    document.getElementById("problem-num-tests").value = 10;
  }
  const numSubtasks = currentProblem.subtasks.length;
  
  if (numSubtasks === 0) {
    showToast("Vui lòng thêm ít nhất một Subtask để sinh testcase!", "error");
    return;
  }

  // Compile JS generator & solver input by user
  let genInputFn;
  let solveFn;
  
  try {
    const generatorBody = document.getElementById("js-input-generator").value;
    // We bind the generator function context to currentProblem so it can read subtask constraints
    genInputFn = new Function("subtaskId", `
      const subtasks = ${JSON.stringify(currentProblem.subtasks)};
      const thisSubtask = subtasks[subtaskId - 1];
      ${generatorBody}
    `);
  } catch (err) {
    showToast("Lỗi biên dịch Hàm Sinh Input: " + err.message, "error");
    return;
  }

  try {
    const solverBody = document.getElementById("js-solver").value;
    solveFn = new Function("inputStr", solverBody);
  } catch (err) {
    showToast("Lỗi biên dịch Hàm Giải bài toán: " + err.message, "error");
    return;
  }

  // Distribute testcase indexes to Subtasks
  // We want to make sure every subtask gets at least 1 testcase, and sum to totalTestsInput
  let testsPerSubtask = new Array(numSubtasks).fill(1);
  let remaining = totalTestsInput - numSubtasks;

  if (remaining < 0) {
    showToast(`Không đủ số lượng testcase để phân chia! Cần tối thiểu ${numSubtasks} testcases.`, "error");
    return;
  }

  // Distribute the remaining tests proportionally to the subtask percentages
  const totalPercent = currentProblem.subtasks.reduce((sum, s) => sum + s.percent, 0) || 1;
  for (let i = 0; i < numSubtasks; i++) {
    if (i === numSubtasks - 1) {
      testsPerSubtask[i] += remaining;
    } else {
      const share = Math.round((currentProblem.subtasks[i].percent / totalPercent) * (totalTestsInput - numSubtasks));
      testsPerSubtask[i] += share;
      remaining -= share;
    }
  }

  generatedTestcases = [];
  let testNum = 1;

  try {
    for (let sIdx = 0; sIdx < numSubtasks; sIdx++) {
      const numTestsForThisSubtask = testsPerSubtask[sIdx];
      const subtaskId = sIdx + 1;

      for (let t = 0; t < numTestsForThisSubtask; t++) {
        // Run input generator
        const inputVal = genInputFn.call(currentProblem, subtaskId);
        if (inputVal === undefined) {
          throw new Error(`Hàm sinh input trả về undefined ở Subtask ${subtaskId}`);
        }
        
        // Run solver
        const outputVal = solveFn.call(currentProblem, inputVal);
        if (outputVal === undefined) {
          throw new Error(`Hàm giải bài toán trả về undefined ở Subtask ${subtaskId} cho đầu vào: ${inputVal}`);
        }

        generatedTestcases.push({
          id: testNum,
          subtaskId: subtaskId,
          input: inputVal.toString().trim(),
          output: outputVal.toString().trim()
        });
        testNum++;
      }
    }
  } catch (err) {
    showToast("Lỗi khi sinh Testcase: " + err.message, "error");
    console.error(err);
    return;
  }

  // Update DOM Testcases view
  renderTestcasesTable();
  showToast(`Sinh thành công ${generatedTestcases.length} testcases bao trùm ${numSubtasks} subtasks!`, "success");
  
  // Automatically save to Question Bank
  saveCurrentProblemToBank();
}

// Render testcases inside Table
function renderTestcasesTable() {
  document.getElementById("testcases-count").textContent = generatedTestcases.length;
  
  const body = document.getElementById("testcases-table-body");
  body.innerHTML = "";

  generatedTestcases.forEach(tc => {
    const tr = document.createElement("tr");
    
    // Format input/output to show preview
    const inputPreview = tc.input.length > 150 ? tc.input.substring(0, 150) + "..." : tc.input;
    const outputPreview = tc.output.length > 150 ? tc.output.substring(0, 150) + "..." : tc.output;

    tr.innerHTML = `
      <td><strong>Test ${tc.id}</strong></td>
      <td><span class="badge badge-info">Subtask ${tc.subtaskId}</span></td>
      <td><pre class="testcase-io-preview"><code>${inputPreview}</code></pre></td>
      <td><pre class="testcase-io-preview"><code>${outputPreview}</code></pre></td>
    `;
    body.appendChild(tr);
  });
}

// Export raw Markdown text formatted like Mau_up_he_thong.txt
function generateMarkdownContent() {
  let md = `**BÀI ${currentProblem.code ? currentProblem.code : "1"} ( ${currentProblem.title} )**\n\n`;
  md += `${currentProblem.description}\n\n`;
  md += `## Input\n\n${currentProblem.inputDesc}\n\n`;
  md += `## Output\n\n${currentProblem.outputDesc}\n\n`;
  
  currentProblem.sampleTests.forEach((sample, index) => {
    md += `## Sample Input\n\`\`\`\n${sample.input}\n\`\`\`\n\n`;
    md += `## Sample Output\n\`\`\`\n${sample.output}\n\`\`\`\n\n`;
    if (sample.explain) {
      md += `Giải thích: ${sample.explain}\n\n`;
    }
  });

  md += `## Subtask\n\n`;
  currentProblem.subtasks.forEach(sub => {
    md += `- ~${sub.percent}\%~ số điểm: ~${sub.limit}~ ${sub.desc}\n\n`;
  });

  return md;
}

// Download unified ZIP package containing everything: md statement, python/cpp solutions, flat/themis testcases
function downloadFullZip() {
  if (generatedTestcases.length === 0) {
    showToast("Vui lòng sinh bộ testcase trước khi tải!", "error");
    return;
  }
  
  const zip = new JSZip();
  const problemCode = (currentProblem.code || "BAI").toUpperCase();
  
  // 1. Add Markdown problem statement
  const mdContent = generateMarkdownContent();
  zip.file(`${problemCode}.md`, mdContent);
  
  // 2. Add Solutions folder
  const solFolder = zip.folder("LoiGiai");
  if (currentProblem.solutionCodePython) {
    solFolder.file("solution.py", currentProblem.solutionCodePython);
  }
  if (currentProblem.solutionCodeCpp) {
    solFolder.file("solution.cpp", currentProblem.solutionCodeCpp);
  }
  
  // 3. Add Flat Testcases folder
  const flatFolder = zip.folder("Testcases_Flat");
  generatedTestcases.forEach(tc => {
    flatFolder.file(`${tc.id}.inp`, tc.input);
    flatFolder.file(`${tc.id}.out`, tc.output);
  });
  
  // 4. Add Themis Testcases folder
  const themisFolder = zip.folder("Testcases_Themis");
  generatedTestcases.forEach(tc => {
    const testFolder = themisFolder.folder(`Test${tc.id.toString().padStart(2, '0')}`);
    testFolder.file(`${problemCode}.INP`, tc.input);
    testFolder.file(`${problemCode}.OUT`, tc.output);
  });
  
  // 5. Generate and download ZIP
  zip.generateAsync({ type: "blob" }).then(content => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `${problemCode}_Full_Package.zip`;
    link.click();
    showToast(`Tải xuống trọn bộ tài nguyên ${problemCode} thành công!`, "success");
  });
}

// --- SAVED QUESTION BANK ENGINE ---

function saveCurrentProblemToBank() {
  if (!currentProblem.title || !currentProblem.description) return;
  
  let bank = [];
  try {
    bank = JSON.parse(localStorage.getItem("tin_hoc_tre_question_bank")) || [];
  } catch (e) {
    bank = [];
  }
  
  // Check if item already exists by title or code
  const existingIndex = bank.findIndex(item => item.title === currentProblem.title || (currentProblem.code && item.code === currentProblem.code));
  
  const newItem = {
    id: existingIndex >= 0 ? bank[existingIndex].id : Date.now().toString(),
    title: currentProblem.title,
    code: currentProblem.code || "BAI",
    level: currentProblem.level || "cap2",
    description: currentProblem.description,
    inputDesc: currentProblem.inputDesc,
    outputDesc: currentProblem.outputDesc,
    subtasks: currentProblem.subtasks,
    sampleTests: currentProblem.sampleTests,
    solutionCodePython: currentProblem.solutionCodePython,
    solutionCodeCpp: currentProblem.solutionCodeCpp,
    jsInputGenerator: document.getElementById("js-input-generator").value,
    jsSolver: document.getElementById("js-solver").value,
    testcases: generatedTestcases
  };
  
  if (existingIndex >= 0) {
    bank[existingIndex] = newItem;
  } else {
    bank.unshift(newItem);
  }
  
  localStorage.setItem("tin_hoc_tre_question_bank", JSON.stringify(bank));
  renderQuestionBankTable();
}

function loadProblemFromBank(id) {
  let bank = [];
  try {
    bank = JSON.parse(localStorage.getItem("tin_hoc_tre_question_bank")) || [];
  } catch (e) {
    return;
  }
  
  const item = bank.find(x => x.id === id);
  if (!item) return;
  
  currentProblem = {
    title: item.title,
    code: item.code,
    level: item.level,
    description: item.description,
    inputDesc: item.inputDesc,
    outputDesc: item.outputDesc,
    subtasks: item.subtasks || [],
    sampleTests: item.sampleTests || [],
    solutionCodePython: item.solutionCodePython || "",
    solutionCodeCpp: item.solutionCodeCpp || ""
  };
  
  generatedTestcases = item.testcases || [];
  
  // Set UI
  document.getElementById("problem-title").value = currentProblem.title;
  document.getElementById("problem-code").value = currentProblem.code;
  const problemLevelEl2 = document.getElementById("problem-level");
  if (problemLevelEl2) problemLevelEl2.value = currentProblem.level;
  document.getElementById("problem-description").value = currentProblem.description;
  document.getElementById("problem-input-desc").value = currentProblem.inputDesc;
  document.getElementById("problem-output-desc").value = currentProblem.outputDesc;
  
  document.getElementById("js-input-generator").value = item.jsInputGenerator || "";
  document.getElementById("js-solver").value = item.jsSolver || "";
  document.getElementById("sol-code-py").value = currentProblem.solutionCodePython;
  document.getElementById("sol-code-cpp").value = currentProblem.solutionCodeCpp;
  
  renderSubtasksList();
  renderSamplesList();
  renderProblemDocument();
  renderTestcasesTable();
  
  showToast(`Đã tải bài toán "${item.title}" từ ngân hàng đề!`, "success");
  
  // Switch to Preview tab
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
  
  const targetTab = document.querySelector('.tab-btn[data-tab="tab-doc"]');
  if (targetTab) targetTab.classList.add("active");
  const targetPane = document.getElementById("tab-doc");
  if (targetPane) targetPane.classList.add("active");
}

function deleteProblemFromBank(id, event) {
  if (event) event.stopPropagation();
  let bank = [];
  try {
    bank = JSON.parse(localStorage.getItem("tin_hoc_tre_question_bank")) || [];
  } catch (e) {
    return;
  }
  
  const filtered = bank.filter(x => x.id !== id);
  localStorage.setItem("tin_hoc_tre_question_bank", JSON.stringify(filtered));
  renderQuestionBankTable();
  showToast("Đã xóa đề bài khỏi ngân hàng!", "success");
}

function renderQuestionBankTable() {
  let bank = [];
  try {
    bank = JSON.parse(localStorage.getItem("tin_hoc_tre_question_bank")) || [];
  } catch (e) {
    bank = [];
  }
  
  const countEl = document.getElementById("bank-count");
  if (countEl) countEl.textContent = bank.length;
  
  const body = document.getElementById("bank-table-body");
  if (!body) return;
  body.innerHTML = "";
  
  if (bank.length === 0) {
    body.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 20px;">Ngân hàng đề đang trống. Hãy sinh đề bài để lưu tự động!</td></tr>`;
    return;
  }
  
  bank.forEach(item => {
    const tr = document.createElement("tr");
    tr.style.cursor = "pointer";
    tr.addEventListener("click", () => loadProblemFromBank(item.id));
    
    const levelBadge = item.level === "cap1" 
      ? '<span class="badge badge-info">Cấp 1 (Scratch)</span>' 
      : '<span class="badge badge-success">Cấp 2 (C++/Py)</span>';
      
    tr.innerHTML = `
      <td>
        <strong>${item.code}</strong><br>
        ${levelBadge}
      </td>
      <td>
        <span style="font-weight: 600; color: var(--accent);">${item.title}</span><br>
        <span style="font-size: 0.8rem; color: var(--text-muted);">${item.description.substring(0, 80)}...</span>
      </td>
      <td><strong>${item.testcases ? item.testcases.length : 0} tests</strong></td>
      <td>
        <button class="btn btn-sm btn-outline-primary load-btn" style="margin-right: 5px;"><i class="bi bi-folder2-open"></i> Mở</button>
        <button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash"></i> Xóa</button>
      </td>
    `;
    
    tr.querySelector(".load-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      loadProblemFromBank(item.id);
    });
    
    tr.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteProblemFromBank(item.id, e);
    });
    
    body.appendChild(tr);
  });
}

// Toast notification helper
function showToast(msg, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  
  // Style according to type
  if (type === "error") {
    toast.style.borderColor = "var(--accent-danger)";
  } else {
    toast.style.borderColor = "var(--accent)";
  }
  
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// UI Event Handlers Setup
function setupEventListeners() {
  // Theme Toggle
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const body = document.body;
    const icon = document.querySelector("#theme-toggle i");
    if (body.classList.contains("dark-theme")) {
      body.classList.remove("dark-theme");
      body.classList.add("light-theme");
      icon.className = "bi bi-moon-fill";
    } else {
      body.classList.remove("light-theme");
      body.classList.add("dark-theme");
      icon.className = "bi bi-sun";
    }
  });

  // Basic info change event listeners
  document.getElementById("problem-title").addEventListener("input", (e) => {
    currentProblem.title = e.target.value;
    renderProblemDocument();
  });
  
  document.getElementById("problem-code").addEventListener("input", (e) => {
    currentProblem.code = e.target.value;
    renderProblemDocument();
  });

  // Toggle advanced editor fields collapse/expand
  document.getElementById("toggle-editor-btn").addEventListener("click", () => {
    const fieldsDiv = document.getElementById("advanced-editor-fields");
    const btn = document.getElementById("toggle-editor-btn");
    
    if (fieldsDiv.style.display === "none") {
      fieldsDiv.style.display = "block";
      btn.innerHTML = '<i class="bi bi-chevron-up"></i> Ẩn tùy chỉnh chi tiết đề & Lời giải (Nâng cao)';
    } else {
      fieldsDiv.style.display = "none";
      btn.innerHTML = '<i class="bi bi-chevron-down"></i> Tùy chỉnh chi tiết đề & Lời giải (Nâng cao)';
    }
  });

  document.getElementById("problem-description").addEventListener("input", (e) => {
    currentProblem.description = e.target.value;
    renderProblemDocument();
  });

  document.getElementById("problem-input-desc").addEventListener("input", (e) => {
    currentProblem.inputDesc = e.target.value;
    renderProblemDocument();
  });

  document.getElementById("problem-output-desc").addEventListener("input", (e) => {
    currentProblem.outputDesc = e.target.value;
    renderProblemDocument();
  });

  // Add subtask button
  document.getElementById("add-subtask-btn").addEventListener("click", () => {
    const newSubtask = {
      id: currentProblem.subtasks.length + 1,
      percent: 10,
      limit: "1 \\le N \\le 100",
      desc: "dành cho thuật toán duyệt cơ bản.",
      minVal: 1,
      maxVal: 100
    };
    currentProblem.subtasks.push(newSubtask);
    renderSubtasksList();
    renderProblemDocument();
  });

  // Add sample button
  document.getElementById("add-sample-btn").addEventListener("click", () => {
    const newSample = {
      input: "Dữ liệu vào mẫu",
      output: "Kết quả mẫu",
      explain: ""
    };
    currentProblem.sampleTests.push(newSample);
    renderSamplesList();
    renderProblemDocument();
  });

  // Code editor text updates
  document.getElementById("sol-code-py").addEventListener("input", (e) => {
    currentProblem.solutionCodePython = e.target.value;
    renderProblemDocument();
  });

  document.getElementById("sol-code-cpp").addEventListener("input", (e) => {
    currentProblem.solutionCodeCpp = e.target.value;
    renderProblemDocument();
  });

  // Generate button
  document.getElementById("generate-tests-btn").addEventListener("click", () => {
    generateTestcases();
  });

  // Tabs switching logic
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Deactivate other tabs
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

      // Activate selected
      tab.classList.add("active");
      const targetId = tab.dataset.tab;
      document.getElementById(targetId).classList.add("active");
    });
  });

  // Exporters
  document.getElementById("export-full-zip-btn").addEventListener("click", downloadFullZip);

  // Copy buttons
  document.querySelectorAll(".btn-copy").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const text = document.getElementById(targetId).textContent;
      navigator.clipboard.writeText(text).then(() => {
        showToast("Đã sao chép mã nguồn vào bộ nhớ đệm!");
      }).catch(err => {
        showToast("Lỗi sao chép: " + err, "error");
      });
    });
  });

  // AI Provider change listener
  document.getElementById("ai-provider").addEventListener("change", (e) => {
    const prov = e.target.value;
    toggleEndpointField(prov);

    localStorage.setItem("ai_provider", prov);
    if (prov === "gemini") {
      updateGeminiModelsFromAPI();
    } else if (prov === "custom") {
      updateCustomModelsFromAPI();
    } else {
      populateAIModels(prov, localStorage.getItem("ai_model") || "");
    }
  });

  // AI Key input/change listeners to dynamically load models
  document.getElementById("ai-key").addEventListener("input", (e) => {
    const key = e.target.value.trim();
    localStorage.setItem("ai_key", key);
    const prov = document.getElementById("ai-provider").value;
    if (prov === "gemini" && key.length > 20) {
      updateGeminiModelsFromAPI();
    }
  });

  document.getElementById("ai-key").addEventListener("change", (e) => {
    const key = e.target.value.trim();
    localStorage.setItem("ai_key", key);
    const prov = document.getElementById("ai-provider").value;
    if (prov === "gemini") {
      updateGeminiModelsFromAPI();
    }
  });

  // AI Endpoint change listener
  document.getElementById("ai-endpoint").addEventListener("change", (e) => {
    const val = e.target.value.trim();
    localStorage.setItem("ai_endpoint", val);
    const prov = document.getElementById("ai-provider").value;
    if (prov === "custom") {
      updateCustomModelsFromAPI();
    }
  });

  // AI Model select change listener
  document.getElementById("ai-model-select").addEventListener("change", (e) => {
    const customInput = document.getElementById("ai-model-custom");
    if (e.target.value === "custom") {
      customInput.style.display = "block";
      customInput.value = "";
    } else {
      customInput.style.display = "none";
      localStorage.setItem("ai_model", e.target.value);
    }
  });

  // AI Custom Model input listener
  document.getElementById("ai-model-custom").addEventListener("input", (e) => {
    localStorage.setItem("ai_model", e.target.value.trim());
  });

  // AI Level change listener
  document.getElementById("ai-level").addEventListener("change", (e) => {
    populateAITopics(e.target.value);
  });

  // AI Generate button listener
  document.getElementById("ai-generate-btn").addEventListener("click", async () => {
    const provider = document.getElementById("ai-provider").value.trim();
    const model = getAIModel().trim();
    const apiKey = document.getElementById("ai-key").value.trim();
    const endpoint = document.getElementById("ai-endpoint").value.trim();
    const topic = document.getElementById("ai-topic").value.trim();
    const level = document.getElementById("ai-level").value.trim();
    const customPrompt = document.getElementById("ai-prompt").value.trim();

    if (!apiKey && provider !== "custom") {
      showToast("Vui lòng nhập API Key để sử dụng dịch vụ AI!", "error");
      return;
    }

    localStorage.setItem("ai_provider", provider);
    localStorage.setItem("ai_model", model);
    localStorage.setItem("ai_key", apiKey);
    localStorage.setItem("ai_endpoint", endpoint);

    const btnText = document.getElementById("ai-btn-text");
    const spinner = document.getElementById("ai-btn-spinner");
    const btn = document.getElementById("ai-generate-btn");

    btn.disabled = true;
    btnText.textContent = "ĐANG SINH ĐỀ VỚI AI...";
    spinner.style.display = "block";

    const systemPrompt = getAISystemPrompt(level, topic);
    const userPrompt = customPrompt 
      ? `Ý tưởng chi tiết: ${customPrompt}` 
      : `Hãy sinh một bài toán lập trình hấp dẫn, độ khó phù hợp với khối thi đã chọn.`;

    try {
      const rawResult = await callAIApi(provider, apiKey, model, endpoint, systemPrompt, userPrompt);
      const resultJson = normalizeAIResult(rawResult);
      
      if (!resultJson || !resultJson.title || !resultJson.description) {
        throw new Error("Dữ liệu trả về từ AI không đúng cấu trúc yêu cầu!");
      }

      currentProblem.title = resultJson.title;
      currentProblem.code = "AI_PROB";
      currentProblem.level = level;
      currentProblem.description = resultJson.description;
      currentProblem.inputDesc = resultJson.inputDesc;
      currentProblem.outputDesc = resultJson.outputDesc;
      currentProblem.subtasks = resultJson.subtasks || [];
      currentProblem.sampleTests = resultJson.sampleTests || [];
      currentProblem.solutionCodePython = resultJson.solutionCodePython || "";
      currentProblem.solutionCodeCpp = resultJson.solutionCodeCpp || "";

      document.getElementById("problem-title").value = currentProblem.title;
      document.getElementById("problem-code").value = currentProblem.code;
      const problemLevelEl3 = document.getElementById("problem-level");
      if (problemLevelEl3) problemLevelEl3.value = currentProblem.level;
      document.getElementById("problem-description").value = currentProblem.description;
      document.getElementById("problem-input-desc").value = currentProblem.inputDesc;
      document.getElementById("problem-output-desc").value = currentProblem.outputDesc;

      document.getElementById("js-input-generator").value = cleanJSSourceCode(resultJson.generateInput);
      document.getElementById("js-solver").value = cleanJSSourceCode(resultJson.solve);

      document.getElementById("sol-code-py").value = currentProblem.solutionCodePython;
      document.getElementById("sol-code-cpp").value = currentProblem.solutionCodeCpp;

      renderSubtasksList();
      renderSamplesList();
      renderProblemDocument();

      generateTestcases();

      showToast("AI đã sinh đề bài & lập trình testcase thành công!", "success");
    } catch (err) {
      console.error(err);
      showToast("Lỗi sinh đề bằng AI: " + err.message, "error");
    } finally {
      btn.disabled = false;
      btnText.textContent = "SINH ĐỀ & THIẾT LẬP BẰNG AI";
      spinner.style.display = "none";
    }
  });

  // Clear Question Bank button listener
  document.getElementById("clear-bank-btn").addEventListener("click", () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ ngân hàng đề bài đã lưu?")) {
      localStorage.removeItem("tin_hoc_tre_question_bank");
      renderQuestionBankTable();
      showToast("Đã xóa toàn bộ ngân hàng đề!");
    }
  });
}

// Start Application
window.addEventListener("DOMContentLoaded", () => {
  initAISettings();
  setupEventListeners();
  renderQuestionBankTable();
});

// Models & Topics Data for AI
const AI_MODELS_DATA = {
  gemini: [
    { value: "gemini-2.0-flash", text: "Gemini 2.0 Flash (Ổn định & Nhanh)" },
    { value: "gemini-1.5-flash", text: "Gemini 1.5 Flash (Tương thích 100%)" },
    { value: "gemini-2.0-flash-thinking-exp", text: "Gemini 2.0 Flash Thinking (Suy luận)" },
    { value: "gemini-1.5-pro", text: "Gemini 1.5 Pro" },
    { value: "gemini-3.5-flash", text: "Gemini 3.5 Flash (Thử nghiệm 2026)" },
    { value: "gemini-3.5-pro", text: "Gemini 3.5 Pro (Thử nghiệm 2026)" },
    { value: "gemini-3.0-flash", text: "Gemini 3.0 Flash (Thử nghiệm)" },
    { value: "custom", text: "⌨️ Nhập model tùy chỉnh..." }
  ],
  openai: [
    { value: "gpt-4o-mini", text: "GPT-4o Mini (Ổn định & Nhanh)" },
    { value: "gpt-4o", text: "GPT-4o (Đầy đủ sức mạnh)" },
    { value: "o3-mini", text: "o3-mini (Suy luận thông minh)" },
    { value: "o1-mini", text: "o1-mini (Suy luận chuyên sâu)" },
    { value: "gpt-5-mini", text: "GPT-5 Mini (Thử nghiệm 2026)" },
    { value: "gpt-5", text: "GPT-5 (Thử nghiệm 2026)" },
    { value: "custom", text: "⌨️ Nhập model tùy chỉnh..." }
  ],
  deepseek: [
    { value: "deepseek-chat", text: "DeepSeek V3 (Chat)" },
    { value: "deepseek-reasoner", text: "DeepSeek R1 (Suy luận chuyên sâu)" },
    { value: "custom", text: "⌨️ Nhập model tùy chỉnh..." }
  ],
  custom: [
    { value: "llama3", text: "Llama 3 (Mặc định local)" },
    { value: "qwen2.5-coder", text: "Qwen 2.5 Coder (Chuyên code)" },
    { value: "deepseek-r1:8b", text: "DeepSeek R1 8B (Local)" },
    { value: "custom", text: "⌨️ Nhập model tùy chỉnh..." }
  ]
};

const AI_TOPICS_DATA = {
  cap1: [
    { value: "scratch_draw_basic", text: "Vẽ hình: Cơ bản (Tròn, vuông, tam giác, đa giác...)" },
    { value: "scratch_draw_art", text: "Vẽ hình: Nghệ thuật hoa văn xoay tròn, hình thoi" },
    { value: "scratch_draw_spiral", text: "Vẽ hình: Đường xoắn ốc (Spiral) và đa giác đều đồng tâm" },
    { value: "scratch_math", text: "Số học: Dãy số cách đều, tìm quy luật số hạng thứ N" },
    { value: "scratch_counting", text: "Số học: Đếm số lượng, đếm chữ số, tìm số chia hết" },
    { value: "scratch_gcd_lcm", text: "Số học: Ước chung lớn nhất (UCLN) và Bội chung nhỏ nhất (BCNN)" },
    { value: "scratch_prime", text: "Số học: Nhận biết số nguyên tố, số chính phương" },
    { value: "scratch_word", text: "Xâu ký tự: Đảo ngược từ, đếm nguyên âm/phụ âm" },
    { value: "scratch_grid", text: "Vẽ hình: Di chuyển nhân vật, lưới tọa độ Scratch" },
    { value: "scratch_logic", text: "Toán cổ & Tư duy logic (Gà chó, trâu cỏ, đong nước)" },
    { value: "scratch_list", text: "Danh sách (List): Tìm Max, Min, TBC, đếm chẵn lẻ" },
    { value: "scratch_list_sort", text: "Danh sách (List): Lọc trùng, sắp xếp danh sách" },
    { value: "other", text: "Chủ đề khác..." }
  ],
  cap2: [
    { value: "c2_math_prime", text: "Số học: Kiểm tra nguyên tố, Sàng nguyên tố Euler/phân tích thừa số" },
    { value: "c2_math_divisors", text: "Số học: Ước số, ước số chung, Euclid nâng cao" },
    { value: "c2_math_base", text: "Số học: Hệ cơ số (2, 8, 10, 16) và Lũy thừa nhanh" },
    { value: "c2_math_combinatorics", text: "Số học: Tổ hợp, chỉnh hợp, giai thừa và số dư (Modulo)" },
    { value: "c2_math_fib", text: "Số học: Số Fibonacci, số hoàn hảo, số đối xứng" },
    { value: "c2_string_basic", text: "Xâu ký tự: Chuẩn hóa, đếm từ, sắp xếp từ điển" },
    { value: "c2_string_rle", text: "Xâu ký tự: Mã hóa nén chuỗi (RLE, Caesar, Vigenere)" },
    { value: "c2_string_palin", text: "Xâu ký tự: Đối xứng (Palindrome) - Quy hoạch động" },
    { value: "c2_string_matching", text: "Xâu ký tự: Tìm kiếm xâu con, xâu trùng lặp" },
    { value: "c2_array_sort", text: "Mảng: Sắp xếp, tìm kiếm nhị phân (Lower/Upper Bound)" },
    { value: "c2_array_pointers", text: "Mảng: Hai con trỏ, cửa sổ trượt (Sliding Window)" },
    { value: "c2_array_subarray", text: "Mảng: Tổng đoạn con liên tiếp lớn nhất (Kadane), mảng cộng dồn" },
    { value: "c2_dp_basic", text: "Quy hoạch động: Bài toán Balo (Knapsack), Đổi tiền xu" },
    { value: "c2_dp_lcs_lis", text: "Quy hoạch động: Xâu con chung dài nhất (LCS), Dãy con tăng dài nhất (LIS)" },
    { value: "c2_dp_grid", text: "Quy hoạch động: Đường đi trên lưới (Grid DP), tính số cách đi" },
    { value: "c2_dp_digit", text: "Quy hoạch động: Quy hoạch động chữ số (Digit DP) cơ bản" },
    { value: "c2_greedy", text: "Thuật toán tham lam (Greedy): Sắp xếp công việc, đổi tiền tối ưu" },
    { value: "c2_graph_search", text: "Đồ thị: Tìm kiếm BFS/DFS, đếm thành phần liên thông" },
    { value: "c2_graph_shortest", text: "Đồ thị: Tìm đường đi ngắn nhất (Dijkstra cơ bản / Bellman-Ford)" },
    { value: "c2_graph_mst", text: "Đồ thị: Cây khung nhỏ nhất (Kruskal/Prim)" },
    { value: "c2_data_structures", text: "Cấu trúc dữ liệu: Stack (dấu ngoặc hợp lệ), Queue, Priority Queue" },
    { value: "c2_data_structures_tree", text: "Cấu trúc dữ liệu: Segment Tree / Fenwick Tree (BIT) cơ bản" },
    { value: "other", text: "Chủ đề khác..." }
  ]
};

function populateAIModels(provider, savedModel = "") {
  const select = document.getElementById("ai-model-select");
  if (!select) return;
  select.innerHTML = "";

  const models = AI_MODELS_DATA[provider] || AI_MODELS_DATA.gemini;
  models.forEach(model => {
    const opt = document.createElement("option");
    opt.value = model.value;
    opt.textContent = model.text;
    select.appendChild(opt);
  });

  const customInput = document.getElementById("ai-model-custom");

  const match = models.find(m => m.value === savedModel);
  if (match) {
    select.value = savedModel;
    customInput.style.display = "none";
  } else if (savedModel && savedModel !== "custom") {
    select.value = "custom";
    customInput.value = savedModel;
    customInput.style.display = "block";
  } else {
    select.selectedIndex = 0;
    customInput.style.display = "none";
  }
}

function populateAITopics(level) {
  const select = document.getElementById("ai-topic");
  if (!select) return;
  select.innerHTML = "";

  const topics = AI_TOPICS_DATA[level] || AI_TOPICS_DATA.cap2;
  topics.forEach(topic => {
    const opt = document.createElement("option");
    opt.value = topic.value;
    opt.textContent = topic.text;
    select.appendChild(opt);
  });
}

function getAIModel() {
  const select = document.getElementById("ai-model-select");
  if (select.value === "custom") {
    return document.getElementById("ai-model-custom").value.trim();
  }
  return select.value;
}

async function updateGeminiModelsFromAPI() {
  const provider = document.getElementById("ai-provider").value;
  const apiKey = document.getElementById("ai-key").value.trim();
  
  if (provider !== "gemini") {
    populateAIModels(provider, localStorage.getItem("ai_model") || "");
    return;
  }
  
  if (!apiKey) {
    populateAIModels("gemini", localStorage.getItem("ai_model") || "");
    return;
  }
  
  const modelSelect = document.getElementById("ai-model-select");
  const savedModel = localStorage.getItem("ai_model") || "";
  
  modelSelect.innerHTML = "<option value='loading'>🔄 Đang tải danh sách model...</option>";
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API trả về mã lỗi ${response.status}`);
    }
    const data = await response.json();
    if (data.models && data.models.length > 0) {
      const apiModels = data.models
        .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
        .map(m => {
          let text = m.displayName || m.name;
          if (m.name.includes("gemini-2.5")) text += " (v2.5)";
          else if (m.name.includes("gemini-2.0")) text += " (v2.0)";
          else if (m.name.includes("gemini-1.5")) text += " (v1.5)";
          
          return {
            value: m.name,
            text: text
          };
        });
      
      if (apiModels.length > 0) {
        AI_MODELS_DATA.gemini = [
          ...apiModels,
          { value: "custom", text: "⌨️ Nhập model tùy chỉnh..." }
        ];
        
        populateAIModels("gemini", savedModel);
        showToast("Đã cập nhật danh sách model từ API Key!", "success");
        return;
      }
    }
    throw new Error("Không tìm thấy model nào hỗ trợ sinh nội dung.");
  } catch (err) {
    console.warn("Failed to fetch Gemini models:", err);
    // Giữ nguyên danh sách mặc định nếu lỗi
    AI_MODELS_DATA.gemini = [
      { value: "gemini-2.0-flash", text: "Gemini 2.0 Flash (Ổn định & Nhanh)" },
      { value: "gemini-1.5-flash", text: "Gemini 1.5 Flash (Tương thích 100%)" },
      { value: "gemini-2.0-flash-thinking-exp", text: "Gemini 2.0 Flash Thinking (Suy luận)" },
      { value: "gemini-1.5-pro", text: "Gemini 1.5 Pro" },
      { value: "gemini-3.5-flash", text: "Gemini 3.5 Flash (Thử nghiệm 2026)" },
      { value: "gemini-3.5-pro", text: "Gemini 3.5 Pro (Thử nghiệm 2026)" },
      { value: "gemini-3.0-flash", text: "Gemini 3.0 Flash (Thử nghiệm)" },
      { value: "custom", text: "⌨️ Nhập model tùy chỉnh..." }
    ];
    populateAIModels("gemini", savedModel);
  }
}

async function updateCustomModelsFromAPI() {
  const provider = document.getElementById("ai-provider").value;
  const endpoint = document.getElementById("ai-endpoint").value.trim();
  const apiKey = document.getElementById("ai-key").value.trim();
  
  if (provider !== "custom") {
    populateAIModels(provider, localStorage.getItem("ai_model") || "");
    return;
  }
  
  const modelSelect = document.getElementById("ai-model-select");
  const savedModel = localStorage.getItem("ai_model") || "";
  
  modelSelect.innerHTML = "<option value='loading'>🔄 Đang tải model từ Ollama...</option>";
  
  let url = endpoint.endsWith("/models") ? endpoint : `${endpoint}/models`;
  if (url.endsWith("/chat/completions/models")) {
    url = url.replace("/chat/completions/models", "/models");
  }
  
  const headers = { 
    "Content-Type": "application/json"
  };
  if (url && url.includes("loca.lt")) {
    headers["bypass-tunnel-reminder"] = "true";
  }
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }
  
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      const apiModels = data.data.map(m => {
        return {
          value: m.id,
          text: m.id
        };
      });
      
      if (apiModels.length > 0) {
        AI_MODELS_DATA.custom = [
          ...apiModels,
          { value: "custom", text: "⌨️ Nhập model tùy chỉnh..." }
        ];
        populateAIModels("custom", savedModel);
        showToast("Đã tải danh sách model chạy trong Ollama của bạn!", "success");
        return;
      }
    }
    throw new Error("Không tìm thấy model nào trong Ollama.");
  } catch (err) {
    console.warn("Failed to fetch Ollama models:", err);
    AI_MODELS_DATA.custom = [
      { value: "llama3", text: "Llama 3 (Mặc định local)" },
      { value: "qwen2.5-coder", text: "Qwen 2.5 Coder (Chuyên code)" },
      { value: "deepseek-r1:8b", text: "DeepSeek R1 8B (Local)" },
      { value: "custom", text: "⌨️ Nhập model tùy chỉnh..." }
    ];
    populateAIModels("custom", savedModel);
  }
}

// Load AI settings from localStorage
function initAISettings() {
  let provider = localStorage.getItem("ai_provider") || "custom";
  if (provider !== "custom") {
    provider = "custom";
    localStorage.setItem("ai_provider", "custom");
  }
  const model = localStorage.getItem("ai_model") || "";
  const apiKey = localStorage.getItem("ai_key") || "";
  const endpoint = localStorage.getItem("ai_endpoint") || "http://localhost:11434/v1";
  const aiLevel = document.getElementById("ai-level").value || "cap2";

  document.getElementById("ai-provider").value = provider;
  document.getElementById("ai-key").value = apiKey;
  document.getElementById("ai-endpoint").value = endpoint;

  populateAITopics(aiLevel);
  toggleEndpointField(provider);
  
  if (provider === "custom") {
    updateCustomModelsFromAPI();
  } else {
    populateAIModels(provider, model);
  }
}

function toggleEndpointField(provider) {
  const group = document.getElementById("ai-endpoint-group");
  const keyHint = document.getElementById("ai-key-hint-link");

  if (group) {
    group.style.display = provider === "custom" ? "block" : "none";
  }
  if (keyHint) {
    keyHint.style.display = provider === "custom" ? "none" : "inline";
    if (provider === "gemini") {
      keyHint.href = "https://aistudio.google.com/";
      keyHint.innerHTML = 'Lấy Key miễn phí <i class="bi bi-box-arrow-up-right"></i>';
    } else if (provider === "openai") {
      keyHint.href = "https://platform.openai.com/api-keys";
      keyHint.innerHTML = 'Lấy OpenAI Key <i class="bi bi-box-arrow-up-right"></i>';
    } else if (provider === "deepseek") {
      keyHint.href = "https://platform.deepseek.com/";
      keyHint.innerHTML = 'Lấy DeepSeek Key <i class="bi bi-box-arrow-up-right"></i>';
    }
  }
}

function getAISystemPrompt(level, topic) {
  let levelDesc = level === "cap1" 
    ? "Tiểu học (cấp 1) sử dụng ngôn ngữ Scratch. Các bài toán vẽ hình Scratch cần tính quãng đường, số bước vẽ hoặc góc xoay, hoặc các bài toán số học đơn giản."
    : "THCS (cấp 2) sử dụng ngôn ngữ C++ và Python. Thuật toán có thể từ cơ bản đến trung bình (Quy hoạch động, Số học, Tìm kiếm nhị phân, Hai con trỏ, Mảng, Xâu kí tự, Đồ thị...).";

  return `Bạn là một chuyên gia ra đề thi học sinh giỏi Tin học Trẻ cấp quốc gia và quốc tế.
Hãy tạo một đề bài lập trình thi đấu (Competitive Programming) bằng tiếng Việt cho đối tượng: ${levelDesc}
Chủ đề bài toán: ${topic}.

YÊU CẦU ĐẶC BIỆT VỀ NGÔN NGỮ LẬP TRÌNH TRONG CÁC TRƯỜNG DỮ LIỆU:
1. Trường 'generateInput' và 'solve' PHẢI là mã nguồn JavaScript chạy trên trình duyệt (client-side) để sinh dữ liệu và giải bài toán trực tiếp.
2. Trường 'solutionCodePython' PHẢI là mã nguồn giải mẫu hoàn chỉnh viết bằng ngôn ngữ PYTHON 3 (chạy được, không viết JavaScript hay mã giả ở đây).
3. Trường 'solutionCodeCpp' PHẢI là mã nguồn giải mẫu hoàn chỉnh viết bằng ngôn ngữ C++ (biên dịch được, không viết JavaScript hay mã giả ở đây).

Yêu cầu định dạng đề bài:
1. Đề bài phải có cốt truyện sinh động, lôi cuốn, có nhân vật và bối cảnh (như trong các đề thi VNOJ, Codeforces, LQDOJ).
2. Dùng ký hiệu dấu ngã (~) để bọc tất cả biểu thức toán học hoặc biến số (ví dụ: ~N~, ~1 \\le N \\le 10^5~, ~O(N \\log N)~).
3. Đề bài được chia làm các phần rõ ràng: Mô tả câu chuyện, ## Input, ## Output, Các ví dụ mẫu (Sample Tests), và ## Subtask.
4. Mỗi đề bài phải có tối thiểu 2 subtask phân bổ độ khó rõ ràng (ví dụ: Subtask 1 chiếm 40% điểm với giới hạn nhỏ để duyệt trâu, Subtask 2 chiếm 60% điểm với giới hạn lớn đòi hỏi thuật toán tối ưu).

Bạn CẦN trả về một đối tượng JSON khớp chính xác với cấu trúc sau:
{
  "title": "Tên bài toán bằng TIẾNG VIỆT (in hoa)",
  "description": "Nội dung câu chuyện đề bài chi tiết bằng tiếng Việt, có nhân vật, bối cảnh. Dùng ~ cho toán học.",
  "inputDesc": "Mô tả dữ liệu vào. Dùng ~ cho toán học.",
  "outputDesc": "Mô tả kết quả ra. Dùng ~ cho toán học.",
  "subtasks": [
    {
      "id": 1,
      "percent": 40,
      "limit": "Giới hạn subtask 1. Ví dụ: ~N \\le 100~",
      "desc": "Mô tả giải thuật tương ứng (ví dụ: duyệt trâu)",
      "minVal": 1,
      "maxVal": 100
    },
    {
      "id": 2,
      "percent": 60,
      "limit": "Giới hạn subtask 2. Ví dụ: ~N \\le 10^5~",
      "desc": "Mô tả giải thuật tối ưu",
      "minVal": 101,
      "maxVal": 100000
    }
  ],
  "sampleTests": [
    {
      "input": "Dữ liệu vào mẫu",
      "output": "Kết quả ra mẫu",
      "explain": "Giải thích kết quả mẫu nếu cần"
    }
  ],
  "generateInput": "Thân hàm JavaScript (dạng chuỗi) nhận vào tham số subtaskId và sinh ra dữ liệu đầu vào ngẫu nhiên và TRẢ VỀ chuỗi kết quả (chứa từ khóa return). LƯU Ý: Chỉ viết code JavaScript thuần túy chạy trên trình duyệt (client-side), không sử dụng cú pháp Python hay C++ hay Node.js. Ví dụ:
    const N = Math.floor(Math.random() * (thisSubtask.maxVal - thisSubtask.minVal + 1)) + thisSubtask.minVal;
    return N.toString();",
  "solve": "Thân hàm JavaScript (dạng chuỗi) nhận vào tham số inputStr và giải bài toán đó để trả về chuỗi kết quả đầu ra. LƯU Ý: Chỉ viết code JavaScript thuần túy chạy trên trình duyệt, không viết mã Python hay C++. Ví dụ:
    const N = parseInt(inputStr.trim());
    return (N * 2).toString();",
  "solutionCodePython": "Mã nguồn giải mẫu hoàn chỉnh viết bằng ngôn ngữ PYTHON 3 để giải bài toán này (đây PHẢI là code Python 3 thật sự chạy được, không viết code JavaScript, không để trống).",
  "solutionCodeCpp": "Mã nguồn giải mẫu hoàn chỉnh viết bằng ngôn ngữ C++ để giải bài toán này (đây PHẢI là code C++ thật sự biên dịch được, không viết code JavaScript, không để trống)."
}`;
}

async function callAIApi(provider, apiKey, model, endpoint, systemPrompt, userPrompt) {
  let responseText = "";
  
  if (provider === "gemini") {
    // Strip "models/" prefix if it's already there to construct URL cleanly
    let cleanModel = model;
    if (cleanModel.startsWith("models/")) {
      cleanModel = cleanModel.substring(7);
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;
    
    // Some models (like thinking models) don't support JSON Schema/mode and throw 400.
    const isThinkingModel = cleanModel.toLowerCase().includes("thinking");

    const schema = {
      type: "OBJECT",
      properties: {
        title: { type: "STRING" },
        description: { type: "STRING" },
        inputDesc: { type: "STRING" },
        outputDesc: { type: "STRING" },
        subtasks: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              id: { type: "INTEGER" },
              percent: { type: "INTEGER" },
              limit: { type: "STRING" },
              desc: { type: "STRING" },
              minVal: { type: "INTEGER" },
              maxVal: { type: "INTEGER" }
            },
            required: ["id", "percent", "limit", "desc", "minVal", "maxVal"]
          }
        },
        sampleTests: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              input: { type: "STRING" },
              output: { type: "STRING" },
              explain: { type: "STRING" }
            },
            required: ["input", "output"]
          }
        },
        generateInput: { type: "STRING" },
        solve: { type: "STRING" },
        solutionCodePython: { type: "STRING" },
        solutionCodeCpp: { type: "STRING" }
      },
      required: ["title", "description", "inputDesc", "outputDesc", "subtasks", "sampleTests", "generateInput", "solve", "solutionCodePython", "solutionCodeCpp"]
    };

    const payload = {
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\nYêu cầu cụ thể của người dùng: ${userPrompt}\n\nLƯU Ý QUAN TRỌNG: Trả về một đối tượng JSON hợp lệ duy nhất khớp chính xác cấu trúc yêu cầu.`
        }]
      }]
    };

    if (!isThinkingModel) {
      payload.generationConfig = {
        responseMimeType: "application/json",
        responseSchema: schema
      };
    }

    let response;
    let tryFallback = false;

    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 400 && !isThinkingModel) {
          console.warn("JSON schema not supported, trying fallback model query...");
          tryFallback = true;
        } else {
          let friendlyMessage = errText;
          try {
            const errJson = JSON.parse(errText);
            if (errJson.error && errJson.error.message) {
              friendlyMessage = `${errJson.error.message} (${errJson.error.status || response.status})`;
            }
          } catch (e) {}
          throw new Error(`Gemini API Error: ${friendlyMessage}`);
        }
      }
    } catch (err) {
      if (!tryFallback) throw err;
    }

    if (tryFallback) {
      // Fallback: normal generation request without schema constraints
      const fallbackPayload = {
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nYêu cầu cụ thể của người dùng: ${userPrompt}\n\nLƯU Ý QUAN TRỌNG: Bạn PHẢI phản hồi bằng một JSON Object duy nhất và hợp lệ (không chứa từ khóa markdown \`\`\`json).`
          }]
        }]
      };
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fallbackPayload)
      });
      if (!response.ok) {
        const errText = await response.text();
        let friendlyMessage = errText;
        try {
          const errJson = JSON.parse(errText);
          if (errJson.error && errJson.error.message) {
            friendlyMessage = `${errJson.error.message} (${errJson.error.status || response.status})`;
          }
        } catch (e) {}
        throw new Error(`Gemini API Error (Fallback): ${friendlyMessage}`);
      }
    }

    const data = await response.json();
    responseText = data.candidates[0].content.parts[0].text;
  } else {
    let url = "";
    if (provider === "openai") {
      url = "https://api.openai.com/v1/chat/completions";
    } else if (provider === "deepseek") {
      url = "https://api.deepseek.com/chat/completions";
    } else {
      url = endpoint.endsWith("/chat/completions") ? endpoint : `${endpoint}/chat/completions`;
    }

    const payload = {
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    };

    const headers = {
      "Content-Type": "application/json"
    };
    if (url && url.includes("loca.lt")) {
      headers["bypass-tunnel-reminder"] = "true";
    }
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    let response;
    let tryFallback = false;

    try {
      response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 400 || response.status === 422 || response.status === 500 || errText.toLowerCase().includes("format") || errText.toLowerCase().includes("schema") || errText.toLowerCase().includes("response_format")) {
          tryFallback = true;
        } else {
          throw new Error(`API Error: ${response.status} - ${errText}`);
        }
      }
    } catch (err) {
      if (!tryFallback) throw err;
    }

    if (tryFallback) {
      // Fallback: request without JSON response format constraint
      const fallbackPayload = {
        model: model,
        messages: [
          { role: "system", content: systemPrompt + "\n\nLƯU Ý QUAN TRỌNG: Bạn PHẢI phản hồi bằng một JSON Object duy nhất và hợp lệ." },
          { role: "user", content: userPrompt }
        ]
      };
      response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(fallbackPayload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`${provider.toUpperCase()} API Error (Fallback): ${response.status} - ${errText}`);
      }
    }

    const data = await response.json();
    responseText = data.choices[0].message.content;
  }

  try {
    return JSON.parse(responseText);
  } catch (e) {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Không thể phân tích cú pháp JSON trả về từ AI: " + e.message);
  }
}
