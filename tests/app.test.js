const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const appSource = fs.readFileSync(
    path.join(__dirname, "..", "js", "app.js"),
    "utf8"
);

class Element {
    constructor() {
        this.value = "";
        this.children = [];
        this.listeners = {};
        this.style = {};
        this.textContent = "";
    }

    addEventListener(type, listener) {
        this.listeners[type] = listener;
    }

    appendChild(child) {
        this.children.push(child);
    }

    replaceChildren(...children) {
        this.children = children;
    }
}

function loadApp(storedIncidencias) {
    const elements = new Map();
    [
        "formIncidencia",
        "listaIncidencias",
        "mensaje",
        "buscarTitulo",
        "filtroEstado",
        "titulo",
        "descripcion",
        "categoria",
        "prioridad",
        "estado"
    ].forEach((id) => elements.set(id, new Element()));
    const writes = [];
    const errors = [];
    const storage = new Map();
    if (storedIncidencias !== undefined) {
        storage.set("incidencias", storedIncidencias);
    }

    const document = {
        getElementById(id) {
            if (!elements.has(id)) {
                elements.set(id, new Element());
            }
            return elements.get(id);
        },
        createElement() {
            return new Element();
        }
    };

    const localStorage = {
        getItem(key) {
            return storage.has(key) ? storage.get(key) : null;
        },
        setItem(key, value) {
            writes.push([key, value]);
            storage.set(key, value);
        }
    };

    vm.runInNewContext(appSource, {
        document,
        localStorage,
        window: { addEventListener() {} },
        console: { error(...args) { errors.push(args); } }
    });

    return { elements, storage, writes, errors };
}

test("malformed saved JSON shows an error and is not overwritten on submit", () => {
    const original = "[invalid";
    const app = loadApp(original);
    const message = app.elements.get("mensaje");
    const list = app.elements.get("listaIncidencias");

    assert.match(message.textContent, /Los datos no fueron modificados/);
    assert.match(list.children[0].children[0].textContent, /Revise los datos guardados/);
    assert.equal(app.errors.length, 1);

    app.elements.get("titulo").value = "Error de acceso";
    app.elements.get("descripcion").value = "No se puede iniciar sesión";
    app.elements.get("categoria").value = "Software";
    app.elements.get("prioridad").value = "Alta";
    app.elements.get("estado").value = "Pendiente";
    app.elements.get("formIncidencia").listeners.submit({
        preventDefault() {}
    });

    assert.deepEqual(app.writes, []);
    assert.equal(app.storage.get("incidencias"), original);
    assert.match(message.textContent, /Los datos no fueron modificados/);
});

test("valid saved records still render normally", () => {
    const app = loadApp(JSON.stringify([{
        id: 1,
        titulo: "Error de acceso",
        descripcion: "No se puede iniciar sesión",
        categoria: "Software",
        prioridad: "Alta",
        estado: "Pendiente"
    }]));

    assert.equal(app.elements.get("listaIncidencias").children.length, 1);
    assert.match(app.elements.get("listaIncidencias").children[0].children[1].textContent, /Error de acceso/);
    assert.equal(app.errors.length, 0);
});

test("valid JSON with a non-list value reports an error without changing storage", () => {
    const original = JSON.stringify({ titulo: "Registro inválido" });
    const app = loadApp(original);

    assert.match(app.elements.get("mensaje").textContent, /Los datos no fueron modificados/);
    assert.equal(app.storage.get("incidencias"), original);
    assert.equal(app.errors.length, 1);
});
