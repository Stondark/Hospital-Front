const url = "http://localhost:3001";
const table = document.getElementById("table-citas");
const add_btn = document.getElementById("add-btn");


function getJWT(){
    return localStorage.getItem("jwt");
}

function redirectSession(response){
    if(response.includes("INVALID SESSION")){
        localStorage.removeItem("jwt");
        window.location.href = "index.html";
    }
}

function convertDate(fecha_in){
    const fecha = new Date(fecha_in);

    const dia = fecha.getDate();
    const mes = fecha.toLocaleString('default', { month: 'long' }); // 'long' para el nombre completo del mes
    const año = fecha.getFullYear();

    return `${dia} ${mes} ${año}`;
}

function poblateSelect(json, field) {
    let field_id = document.getElementById(field);
    json.forEach((data) => {
      let option_clasificacion = document.createElement("option");
      option_clasificacion.value = Number(data.cedula);
      option_clasificacion.text = data.nombre;
      field_id.appendChild(option_clasificacion);
    });
  }

add_btn.addEventListener("click", async () => {
    await Swal.fire({
      title: "Agendar cita",
      html:
        '<input id="fecha_cita" type="datetime-local" class="swal2-input" placeholder="Cédula">' + 
        '<select id="medico" class="swal2-select" ><option value="" disabled="" selected>Seleccione un médico</option></select>'+
        '<select id="paciente" class="swal2-select" ><option value="" disabled="" selected>Seleccione un paciente</option></select>',
      focusConfirm: false,
      didOpen: async () => {
        const getClas = await getAllMedicos();
        poblateSelect(getClas, 'medico');
        const getPac = await getAllPacientes();
        poblateSelect(getPac, 'paciente');
      },
      preConfirm: async () =>{
        let fecha = new Date(document.getElementById('fecha_cita').value);
        let medico = document.getElementById('medico').value;
        let paciente = document.getElementById('paciente').value;

        let bodyContent = JSON.stringify({
          "data": {
                "fechaHora": fecha.toISOString(),
                "idPaciente": paciente,
                "idMedico": medico
          }
        });
        
        try {
          await insertCita(bodyContent);
          location.reload();
        } catch (error) {
          await Swal.fire('Ocurrió un error al insertar', '', 'error');
        }

      }
    });
});


async function insertCita(bodyContent){
    try {
        let end_point = "cita";

        const token = getJWT();
        let headersOpt = {
            "Authorization" : "Bearer " + token,
            "Content-Type": "application/json"
            
        }


       const response = await fetch(`${url}/${end_point}`, {
            method: "POST",
            headers: headersOpt,
            body: bodyContent
       })

       const data = await response.json();

        if (!data.success) {
            redirectSession(data.error);
            let str = JSON.stringify(data.error);
            throw new Error(str);
        }
        return data.data;
    } catch (error) {
        throw error;
    }
}


async function deleteCitaById(id){
    try {
        let end_point = "cita";

        const token = getJWT();

        let headersOpt = {
            "Authorization" : "Bearer " + token
        }

       const response = await fetch(`${url}/${end_point}/${id}`, {
            method: "DELETE",
            headers: headersOpt
       })

       const data = await response.json();

        if (!data.success) {
            redirectSession(data.error);
            let str = JSON.stringify(data.error);
            throw new Error(str);
        }
        return data;
    } catch (error) {
        throw error;
    }
}

async function getAllMedicos(){
    try {
        let end_point = "medico";

        const token = getJWT();
        console.log(token)
        let headersOpt = {
            "Authorization" : "Bearer " + token
        }

       const response = await fetch(`${url}/${end_point}`, {
            method: "GET",
            headers: headersOpt
       })

       const data = await response.json();

        if (!data.success) {
            redirectSession(data.error);
            let str = JSON.stringify(data.error);
            throw new Error(str);
        }
        return data.data;
    } catch (error) {
        throw error;
    }
}


async function getAllCitas(){
    try {
        let end_point = "cita";

        const token = getJWT();
        console.log(token)
        let headersOpt = {
            "Authorization" : "Bearer " + token
        }

       const response = await fetch(`${url}/${end_point}`, {
            method: "GET",
            headers: headersOpt
       })

       const data = await response.json();

        if (!data.success) {
            redirectSession(data.error);
            let str = JSON.stringify(data.error);
            throw new Error(str);
        }
        return data.data;
    } catch (error) {
        throw error;
    }
}


async function addAllCitas() {
    let citas = await getAllCitas();
    citas.forEach((data) => {
      const fila = table.insertRow();
      fila.insertCell().innerText = data.idCita;
      fila.insertCell().innerText = convertDate(data.fechaHora);
      fila.insertCell().innerText = `${data.paciente.nombre} ${data.paciente.apellido}`;
      fila.insertCell().innerText = `${data.medico.nombre} ${data.medico.apellido}`;
      let eliminarBtn = document.createElement('button');
      eliminarBtn.innerText = 'Eliminar';
      eliminarBtn.setAttribute('class', 'btn btn-danger btn-sm');
      eliminarBtn.addEventListener('click', () => {
        deleteCitaById(data.idCita).then((data) =>{
            location.reload();
        }).catch(error => {})
      });
      
      fila.insertCell().appendChild(eliminarBtn);
  
    });

  }

  async function getAllPacientes(){
    try {
        let end_point = "paciente";

        const token = getJWT();
        console.log(token)
        let headersOpt = {
            "Authorization" : "Bearer " + token
        }

       const response = await fetch(`${url}/${end_point}`, {
            method: "GET",
            headers: headersOpt
       })

       const data = await response.json();

        if (!data.success) {
            redirectSession(data.error);
            let str = JSON.stringify(data.error);
            throw new Error(str);
        }
        return data.data;
    } catch (error) {
        throw error;
    }
}

// Crear tabla
addAllCitas().then((data) =>{}).catch(error => {})