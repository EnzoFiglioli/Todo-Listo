const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const fecha = document.getElementById("fecha");
const btnDeleteAccount = document.getElementById("deleteAccount");

const URI_PATH = "/api";

function cerrarSesion() {
  fetch(`${URI_PATH}/auth/logout`,{credentials: "include"})
    .then((response) => {
      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("Error during logout");
      }
    })
    .catch((err) => console.error("Logout error:", err));
}

function registerForm(event) {
  event.preventDefault();

  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;

  fetch(`${URI_PATH}/auth/crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, name, email }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data) {
        alert("Usuario creado exitosamente");
        location.href = URI_PATH;
      } else {
        console.log(data);
        alert(data.msg || "Error al registrarse");
      }
    })
    .catch((err) => {
      console.error("Error al registrarse:", err);
      alert("Hubo un error al intentar registrarse.");
    });
}

function updateTask(id, concepto, fecha) {
  const taskUpdate = prompt("Actualiza la tarea", concepto);
  if (!taskUpdate) return;

  fetch(`${URI_PATH}/tareas/actualizar/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ concepto: taskUpdate, fecha }),
    credentials: "include"
  })
    .then((resp) => {
      if (!resp.ok) throw new Error("Error al actualizar la tarea.");
      return resp.json();
    })
    .then(() => loadTasks())
    .catch((err) => {
      console.error("Error al actualizar la tarea:", err);
      alert("Error al actualizar la tarea. Inténtalo de nuevo más tarde.");
    });
}

function deleteTask(id) {
  if (!confirm("¿Estás seguro de que quieres eliminar esta tarea?")) return;

  fetch(`${URI_PATH}/tareas/eliminar/${id}`, {
    method: "DELETE",
    credentials: "include"
  })
    .then((resp) => {
      if (!resp.ok) throw new Error("Error al eliminar la tarea.");
      return resp.json();
    })
    .then(() => {
      loadTasks();
    })
    .catch((err) => {
      console.error("Error al eliminar la tarea:", err);
      alert("Error al eliminar la tarea. Inténtalo de nuevo más tarde.");
    });
}

function addCalendar(...fechas) {
  const hoy = new Date().getDay();
  const tareasPorDia = [0, 0, 0, 0, 0, 0, 0];

  // Si se pasaron tareas, las contamos
  if (fechas.length > 0 && Array.isArray(fechas[0])) {
    fechas[0].forEach((i) => {
      const dia = new Date(i.fecha).getDay();
      tareasPorDia[dia]++;
    });
  }

  document.querySelector("#diasSemana").innerHTML = `
    <h2 class="text-xl font-semibold text-teal-600">Días</h2>
    <ul class="mt-4 space-y-2">
      ${[
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ]
        .map((dia, index) => {
          const diaClase = hoy === index ? "400 font-bold" : "200";
          return `
            <li>
              <a href="#" class="block p-2 bg-teal-${diaClase} dark:text-black rounded-lg hover:bg-teal-300 transition">
                ${dia}
                ${
                  tareasPorDia[index] > 0
                    ? `<span class="bg-teal-600 text-white rounded-full px-3 py-1 text-sm shadow-md">${tareasPorDia[index]}</span>`
                    : ""
                }
              </a>
            </li>
          `;
        })
        .join("")}
    </ul>
  `;
}

function loadTasks() {
  addCalendar();
  taskForm.addEventListener("submit", addTask);

  fetch(`${URI_PATH}/tareas/`,{credentials: "include"})
    .then((response) => {
      if (!response.ok) {
        taskList.innerHTML = "";
        taskList.innerHTML += "<li>No hay tareas para mostrar</li>";
        return;
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        addCalendar(data);
        taskList.innerHTML = "";

        // Eliminar contenedores previos de hoy y otros
        const hoyContainer = document.querySelector("#hoy-container");
        if (hoyContainer) hoyContainer.remove();

        const otherTasksList = document.querySelector("#other-tasks-list");
        if (otherTasksList) otherTasksList.remove();

        const separator = document.querySelector("#other-tasks-separator");
        if (separator) separator.remove();

        data.forEach((task) =>
          addTaskToList(task.concepto, task.fecha, task._id)
        );
      }
    })
    .catch((error) => {
      console.error("Error al cargar las tareas:", error);
    });
}

if (window.location.pathname === "/dashboard") {
  loadTasks();
}

function addTaskToList(concepto, fecha, id) {
  const date = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const esHoy = date.getTime() === hoy.getTime();
  const timestamp = esHoy ? "Hoy" : date.toLocaleDateString();

  const taskElement = document.createElement("li");
  taskElement.classList.add(
    "bg-teal-100",
    "p-4",
    "rounded-lg",
    "flex",
    "justify-between",
    "items-center",
    "my-6"
  );

  taskElement.innerHTML = `
        <h5>${
          esHoy
            ? "<span class='text-green-500 font-bold dark:text-black'>Hoy</span>"
            : `<span class="text-gray font-bold dark:text-black">${timestamp}</span>`
        }</h5>
        <span class="dark:text-black">${concepto}</span>
        <div class="flex gap-5">
            <span onclick="updateTask('${id}', '${concepto}', '${fecha}')" class="cursor-pointer"><i class="fa-solid fa-pen dark:text-black"></i></span>
            <span onclick="deleteTask('${id}')" class="cursor-pointer"><i class="fa-solid fa-x dark:text-black"></i></span>
        </div>
    `;

  const containerId = esHoy ? "#hoy-container" : "#other-tasks-list";
  let container = document.querySelector(containerId);
  if (!container) {
    if (esHoy) {
      container = document.createElement("ul");
      container.id = "hoy-container";
      container.innerHTML = `<h4 class="text-lg font-bold text-green-500 mb-2">Tareas de Hoy</h4>`;
      taskList.prepend(container);
    } else {
      const separator = document.createElement("hr");
      separator.id = "other-tasks-separator";
      separator.classList.add("my-4", "border-t", "border-gray-300");
      taskList.appendChild(separator);

      container = document.createElement("ul");
      container.id = "other-tasks-list";
      taskList.appendChild(container);
    }
  }

  container.appendChild(taskElement);
}

function addTask(event) {
  event.preventDefault();

  const concepto = taskInput.value.trim();
  const fechaTarea = new Date(fecha.value.trim());
  fechaTarea.setDate(fechaTarea.getDate() + 1);
  if (fechaTarea == "Invalid Date") {
    alert("Fecha invalida");
  }
  if (fechaTarea.getFullYear() < new Date().getFullYear()) {
    alert("Fecha invalida: tiene que ser fecha actual o a futuro");
    return;
  }

  if (!concepto) return alert("Por favor, escribe una tarea.");
  const fechaISO = fechaTarea.toISOString().split("T")[0];

  fetch(`${URI_PATH}/tareas/crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ concepto, fecha: fechaISO }),
    credentials: "include"
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error al agregar tarea.");
      return response.json();
    })
    .then(() => {
      loadTasks();
      taskInput.value = "";
    })
    .catch((error) => {
      console.error("Error al agregar tarea:", error);
      alert("Error al agregar tarea.");
    });
}

function dashboardRoute(event) {
  event.preventDefault();

  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  if (!username || !password) {
    alert("Por favor, ingresa ambos campos.");
    return;
  }

fetch(`${URI_PATH}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ username, password }),
})
  .then(async (response) => {
    let data;

    try {
      data = await response.json();
    } catch (error) {
      throw new Error("El servidor devolvió una respuesta inválida o vacía.");
    }

    if (!response.ok) {
      throw new Error(data?.msg || "Error al iniciar sesión");
    }

    if (data.ok) {
      window.location.href = "/dashboard";
      return;
    }

    throw new Error("Respuesta inesperada del servidor");
  })
  .catch((err) => {
    alert(err.message);
  });


}

async function deleteAccount() {
  const option = confirm("Estas seguro que quieres eliminar esta cuenta?");

  if (!option) return;

  const response = await fetch(`${URI_PATH}/auth/delete`, {method:"DELETE", credentials: "include"});

  if(response.ok){
    alert("Cuenta eliminada exitosamente");
    window.location.href = "/"
  }
  if(response.msg){
    alert(response.msg);
    return
  }
  alert("Disculpa hubo un error al eliminar cuenta")
}
