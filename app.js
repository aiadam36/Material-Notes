let notes = JSON.parse(localStorage.getItem("my_notes")) || [];
let editingId = null;

const container = document.getElementById("notes-container");
const modal = document.getElementById("note-modal");
const titleInput = document.getElementById("note-title");
const contentInput = document.getElementById("note-content");
const modalTitle = document.getElementById("modal-title");

function renderNotes() {
  container.innerHTML = "";

  notes.sort((a, b) => new Date(b.date) - new Date(a.date));

  notes.forEach(note => {
    const card = document.createElement("div");
    card.className = "note-card";
    card.innerHTML = `
                    <h3 class="note-title">${note.title || "Untitled"}</h3>
                    <div class="note-content">${note.content}</div>
                    <div class="note-date">${new Date(note.date).toLocaleDateString()}</div>
                    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px;">
                        <button class="icon-btn" onclick="editNote(${note.id})" style="color:var(--md-sys-color-primary)">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="icon-btn" onclick="deleteNote(${note.id})" style="color:var(--md-sys-color-primary)">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                `;
    container.appendChild(card);
  });
}

function saveNote() {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title && !content) {
    closeModal();
    return;
  }

  if (editingId) {
    const index = notes.findIndex(n => n.id === editingId);
    notes[index] = {
      ...notes[index],
      title,
      content,
      date: new Date().toISOString()
    };
    editingId = null;
  } else {
    const newNote = {
      id: Date.now(),
      title,
      content,
      date: new Date().toISOString()
    };
    notes.push(newNote);
  }

  localStorage.setItem("my_notes", JSON.stringify(notes));
  renderNotes();
  closeModal();
}

function deleteNote(id) {
  if (confirm("Delete this note?")) {
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem("my_notes", JSON.stringify(notes));
    renderNotes();
  }
}

function editNote(id) {
  const note = notes.find(n => n.id === id);
  if (note) {
    editingId = id;
    titleInput.value = note.title;
    contentInput.value = note.content;
    modalTitle.innerText = "Edit Note";
    modal.classList.add("active");
  }
}

function openModal() {
  editingId = null;
  titleInput.value = "";
  contentInput.value = "";
  modalTitle.innerText = "New Note";
  modal.classList.add("active");
  titleInput.focus();
}

function closeModal() {
  modal.classList.remove("active");
}

modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

function exportNotes() {
  const dataStr = JSON.stringify(notes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `notes_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function importNotes(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedNotes = JSON.parse(e.target.result);
      if (Array.isArray(importedNotes)) {
        if (confirm("This will replace your current notes. Continue?")) {
          notes = importedNotes;
          localStorage.setItem("my_notes", JSON.stringify(notes));
          renderNotes();
          alert("Notes imported successfully!");
        }
      } else {
        alert("Invalid file format.");
      }
    } catch (err) {
      alert("Error reading file.");
    }
  };
  reader.readAsText(file);

  input.value = "";
}

renderNotes();
