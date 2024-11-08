document.addEventListener("DOMContentLoaded", () => {
    const tableBodyJugadores = document.querySelector("#jugadoresTable tbody");
    const tableBodyEquipos = document.querySelector("#equiposTable tbody");

    let equipos = [];

    function fetchJugadores() {
        fetch('http://localhost:8080/api/jugador')
            .then(response => response.json())
            .then(data => {
                tableBodyJugadores.innerHTML = '';
                data.forEach(jugador => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${jugador.id}</td>
                        <td>${jugador.nombre}</td>
                        <td>${formatearFecha(jugador.fechaNacimiento)}</td>
                        <td>${jugador.numeroCamiseta}</td>
                        <td>${jugador.posicion}</td>
                        <td>${jugador.equipo.nombre}</td>
                        <td>
                            <button class="btn btn-warning btn-sm mr-2" onclick="showEditForm(${jugador.id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteJugador(${jugador.id})">Eliminar</button>
                        </td>
                    `;
                    tableBodyJugadores.appendChild(row);
                });
            })
            .catch(error => console.error('Error al obtener los jugadores:', error));
    }

    function fetchEquipos() {
        fetch('http://localhost:8080/api/equipo')
            .then(response => response.json())
            .then(data => {
                equipos = data;
                tableBodyEquipos.innerHTML = '';
                data.forEach(equipo => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${equipo.id}</td>
                        <td>${equipo.nombre}</td>
                        <td>${equipo.ciudad}</td>
                        <td>
                            <button class="btn btn-warning btn-sm mr-2" onclick="showEditEquipoForm(${equipo.id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteEquipo(${equipo.id})">Eliminar</button>
                        </td>
                    `;
                    tableBodyEquipos.appendChild(row);
                });
                actualizarSelectEquipos();
            })
            .catch(error => console.error('Error al obtener los equipos:', error));
    }

    window.showEditEquipoForm = function (id) {
        fetch(`http://localhost:8080/api/equipo/${id}`)
            .then(response => response.json())
            .then(equipo => {
                const editRow = document.createElement("tr");
                editRow.innerHTML = `
                    <td colspan="4">
                        <form id="editEquipoForm-${id}">
                            <input type="hidden" id="editEquipoId-${id}" value="${equipo.id}">
                            <div class="form-group">
                                <label for="editEquipoNombre-${id}">Nombre:</label>
                                <input type="text" class="form-control" id="editEquipoNombre-${id}" value="${equipo.nombre}" required>
                            </div>
                            <div class="form-group">
                                <label for="editEquipoCiudad-${id}">Ciudad:</label>
                                <input type="text" class="form-control" id="editEquipoCiudad-${id}" value="${equipo.ciudad}" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Guardar cambios</button>
                        </form>
                    </td>
                `;
                const equipoRow = document.querySelector(`button[onclick="showEditEquipoForm(${id})"]`).closest("tr");
                if (equipoRow.nextSibling && equipoRow.nextSibling.classList.contains("edit-form-row")) {
                    equipoRow.nextSibling.remove();
                }
                editRow.classList.add("edit-form-row");
                equipoRow.parentNode.insertBefore(editRow, equipoRow.nextSibling);

                document.querySelector(`#editEquipoForm-${id}`).addEventListener("submit", function (event) {
                    event.preventDefault();
                    const nombre = document.querySelector(`#editEquipoNombre-${id}`).value;
                    const ciudad = document.querySelector(`#editEquipoCiudad-${id}`).value;

                    fetch(`http://localhost:8080/api/equipo/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            nombre: nombre,
                            ciudad: ciudad
                        })
                    })
                        .then(() => {
                            fetchEquipos();
                        })
                        .catch(error => console.error('Error al actualizar el equipo:', error));
                });
            })
            .catch(error => console.error('Error al obtener los detalles del equipo:', error));
    };

    window.deleteEquipo = function (id) {
        console.log('Eliminando equipo con id:', id);
        fetch(`http://localhost:8080/api/equipo/${id}`, {
            method: 'DELETE',
        })
            .then(() => fetchEquipos())
            .catch(error => console.error('Error al eliminar el equipo:', error));
    };

    function crearEquipo(event) {
        event.preventDefault();

        const nombre = document.querySelector("#createEquipoNombre").value;
        const ciudad = document.querySelector("#createEquipoCiudad").value;

        if (!nombre || !ciudad) {
            alert("Por favor, ingrese todos los campos.");
            return;
        }

        const nuevoEquipo = {
            nombre: nombre,
            ciudad: ciudad
        };

        fetch('http://localhost:8080/api/equipo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoEquipo)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Equipo creado:', data);
                fetchEquipos();
                document.querySelector("#createEquipoForm").reset();
            })
            .catch(error => {
                console.error('Error al crear el equipo:', error);
                alert("Hubo un error al crear el equipo.");
            });
    }

    document.querySelector("#createEquipoForm").addEventListener("submit", crearEquipo);


    function actualizarSelectEquipos() {
        const equipoSelect = document.querySelector("#createEquipo");
        equipoSelect.innerHTML = '';

        const opcionSeleccionar = document.createElement("option");
        opcionSeleccionar.value = "";
        opcionSeleccionar.textContent = "Seleccionar equipo";
        opcionSeleccionar.disabled = true;
        opcionSeleccionar.selected = true;
        equipoSelect.appendChild(opcionSeleccionar);

        equipos.forEach(equipo => {
            const option = document.createElement("option");
            option.value = equipo.id;
            option.textContent = equipo.nombre;
            equipoSelect.appendChild(option);
        });
    }


    function formatearFecha(fecha) {
        const date = new Date(fecha);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    function formatearFecha2(fecha) {
        const date = new Date(fecha);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    window.showEditForm = function (id) {
        fetch(`http://localhost:8080/api/jugador/${id}`)
            .then(response => response.json())
            .then(jugador => {
                const editRow = document.createElement("tr");
                let formatoFecha = new Date(jugador.fechaNacimiento);
                editRow.innerHTML = `
                    <td colspan="7">
                        <form id="editForm-${id}">
                            <input type="hidden" id="editId-${id}" value="${jugador.id}">
                            <div class="form-group">
                                <label for="editNombre-${id}">Nombre:</label>
                                <input type="text" class="form-control" id="editNombre-${id}" value="${jugador.nombre}" required>
                            </div>
                            <div class="form-group">
                                <label for="editFechaNacimiento-${id}">Fecha de Nacimiento:</label>
                                <input type="date" class="form-control" id="editFechaNacimiento-${id}" value="${formatearFecha2(formatoFecha)}" required>
                            </div>
                            <div class="form-group">
                                <label for="editNumeroCamiseta-${id}">Número de Camiseta:</label>
                                <input type="number" class="form-control" id="editNumeroCamiseta-${id}" value="${jugador.numeroCamiseta}" required>
                            </div>
                            <div class="form-group">
                                <label for="editPosicion-${id}">Posición:</label>
                                <input type="text" class="form-control" id="editPosicion-${id}" value="${jugador.posicion}" required>
                            </div>
                            <div class="form-group">
                                <label for="editEquipo-${id}">Equipo:</label>
                                <select class="form-control" id="editEquipo-${id}" required>
                                    ${equipos.map(equipo => `
                                        <option value="${equipo.id}" ${equipo.id === jugador.equipo.id ? 'selected' : ''}>${equipo.nombre}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="editGoles-${id}">Goles:</label>
                                <input type="number" class="form-control" id="editGoles-${id}" value="${jugador.goles || 0}" required min="0">
                            </div>
                            <button type="submit" class="btn btn-primary">Guardar cambios</button>
                        </form>
                    </td>
                `;
                const jugadorRow = document.querySelector(`button[onclick="showEditForm(${id})"]`).closest("tr");
                if (jugadorRow.nextSibling && jugadorRow.nextSibling.classList.contains("edit-form-row")) {
                    jugadorRow.nextSibling.remove();
                }
                editRow.classList.add("edit-form-row");
                jugadorRow.parentNode.insertBefore(editRow, jugadorRow.nextSibling);

                document.querySelector(`#editForm-${id}`).addEventListener("submit", function (event) {
                    event.preventDefault();
                    const nombre = document.querySelector(`#editNombre-${id}`).value;
                    let fechaNacimiento = new Date(document.querySelector(`#editFechaNacimiento-${id}`).value);
                    fechaNacimiento.setDate(fechaNacimiento.getDate());
                    fechaNacimiento = fechaNacimiento.toISOString().split('T')[0];
                    const numeroCamiseta = document.querySelector(`#editNumeroCamiseta-${id}`).value;
                    const posicion = document.querySelector(`#editPosicion-${id}`).value;
                    const equipoId = document.querySelector(`#editEquipo-${id}`).value;
                    const goles = parseInt(document.querySelector(`#editGoles-${id}`).value);

                    fetch(`http://localhost:8080/api/jugador/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            nombre: nombre,
                            fechaNacimiento: fechaNacimiento,
                            numeroCamiseta: numeroCamiseta,
                            posicion: posicion,
                            equipo: { id: equipoId },
                            goles: goles

                        })
                    })
                        .then(() => {
                            fetchJugadores();
                            fetchGoleadores();
                        })
                        .catch(error => console.error('Error al actualizar el jugador:', error));
                });
            })
            .catch(error => console.error('Error al obtener el jugador:', error));
    };

    window.deleteJugador = function (id) {
        fetch(`http://localhost:8080/api/jugador/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    console.log("Jugador eliminado correctamente");
                    fetchJugadores();
                    fetchGoleadores();
                } else {
                    alert("Hubo un problema al eliminar el jugador.");
                }
            })
            .catch(error => console.error('Error al eliminar el jugador:', error));
    };

    // Función para crear un jugador
    function crearJugador(event) {
        event.preventDefault();


        const nombre = document.querySelector("#createNombre").value;
        const fechaNacimiento = document.querySelector("#createFechaNacimiento").value;
        const numeroCamiseta = document.querySelector("#createNumeroCamiseta").value;
        const posicion = document.querySelector("#createPosicion").value;
        const equipoId = document.querySelector("#createEquipo").value;
        const goles = document.querySelector("#createGoles").value;

        if (!nombre || !fechaNacimiento || !numeroCamiseta || !posicion || !equipoId || goles < 0) {
            alert("Por favor, ingrese todos los campos.");
            return;
        }

        // Crear el objeto jugador
        const nuevoJugador = {
            nombre: nombre,
            fechaNacimiento: fechaNacimiento,
            numeroCamiseta: numeroCamiseta,
            posicion: posicion,
            equipo: { id: equipoId },
            goles: parseInt(goles)
        };

        // Enviar la solicitud POST al servidor para crear el jugador
        fetch('http://localhost:8080/api/jugador', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoJugador)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Jugador creado:', data);
                fetchJugadores();
                fetchGoleadores();
                document.querySelector("#createForm").reset();
                document.querySelector("#createForm").reset();
                actualizarSelectEquipos()
            })
            .catch(error => {
                console.error('Error al crear el jugador:', error);
                alert("Hubo un error al crear el jugador.");
            });
    }

    document.querySelector("#createForm").addEventListener("submit", crearJugador);

    function fetchGoleadores() {
        fetch('http://localhost:8080/api/jugador/topscorers')
            .then(response => response.json())
            .then(data => {
                const tableBodyGoleadores = document.querySelector("#goleadoresTable tbody");
                tableBodyGoleadores.innerHTML = '';
    
                data.forEach(jugador => {

                    if (jugador.goles > 0) {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${jugador.nombre}</td>
                            <td>${jugador.equipo.nombre}</td>
                            <td>${jugador.goles}</td>
                        `;
                        tableBodyGoleadores.appendChild(row);
                    }
                });
            })
            .catch(error => console.error('Error al obtener los goleadores:', error));
    }

    fetchEquipos();
    fetchJugadores();
    fetchGoleadores();
});
