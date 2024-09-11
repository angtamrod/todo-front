// ESTE ARCHIVO JS SERVIRÁ PARA LEER LA TAREA Y PINTARLA EN EL ARCHIVO INDEX.HTML
//El archivo funciones.js es crucial para la funcionalidad de la aplicación, ya que maneja la carga, visualización y creación de tareas en la interfaz de usuario desde y hacia un backend. A continuación, te explico detalladamente cómo funciona cada parte de este archivo:

//1. SELECCIÓN DE LOS ELEMENTOS DEL DOM
const contTareas= document.querySelector(".tareas");//Contenedor donde se muestran las tareas
const formulario= document.querySelector("form");//Formulario para añadir nuevas tareas
const inputTexto= document.querySelector(`form input[type="text"]`);//Campo de texto para introducir una nueva tarea

//2. CARGA INICIAL DE LOS DATOS
//Lo primero que hay que hacer es una llamada a los datos. Se realiza una llamada fetch a la API para obtener las tareas guardadas en el backend, a través de una URL 
fetch("http://localhost:4000/tareas") //En esta URL es donde he alojado los datos de mis tareas. url anterior: https://api-postgres-todo.onrender.com/tareas
.then(respuesta => respuesta.json())//La respuesta de la API es convertida a JSON.
.then(tareas => {
    //POSTGRES cuando edita pone esa tarea al final, para evitar esto haremos:
    //en vez de hacer una función por cada tarea, vamos a desestructurar cada tarea, a través del id, tarea y terminada que son las cualidades disponibles de cada tarea
    //Las tareas obtenidas son ordenadas por su id para asegurar un orden consistente:
    tareas.sort((a,b) => a.id - b.id).forEach(({id,tarea,terminada}) => {
        new Tarea(id,tarea,terminada,contTareas); //De esta manera habiendo leído los datos del back, pintaremos una tarea en el front, con los datos de id, tarea y terminada (en este caso)
    });
})//Hacer esto en un principio nos dará error porque al cambiar de dominio, porque no podemos hacer peticiones de un dominio a otro, el navegador le pedirá permisos que figurarán como no concedidos PARA ELLO HAY QUE INSTALAR EL MÓDULO npm cors en nuestro backend que sirve para conceder permisos desde nuestra API

//Esto puede generar problemas de seguridad, pero a este nivel no es necesario, de todas maneras existe jwt.io donde se puede codificar unas credenciales para poder autenticar 


//LO PRIMERO QUE QUEREMOS HACER ES DE LA CREACIÓN DE LA NUEVA TAREAS EN EL FRONT, Y SE AÑADEN AL BACK 


/* formulario.addEventListener("submit", evento => {
    evento.preventDefault();
   
    if(inputTexto.value.trim() != ""){
        new Tarea(1, inputTexto.value.trim(), false,contTareas);
        inputTexto.value = "";
    }
}); */

//3. MANEJO DE LA CREACIÓN DE NUEVAS TAREAS

//Se escucha el evento submit del formulario. Cuando envíamos un formulario
formulario.addEventListener("submit", evento => {
    //Cuando el formulario es enviado, se previene la acción por defecto (recargar la página).
    evento.preventDefault();
   
    //Este if() verifica que el campo de texto no esté vacío y, de ser así, se crea una nueva tarea.
    if(inputTexto.value.trim() != ""){
        let tarea = inputTexto.value.trim();

        //Se utiliza fetch con el método POST para enviar la nueva tarea a la API:
        //esto hará la petición a la base de datos (Enviará el texto de la nueva tarea)
        fetch("http://localhost:4000/tareas/nueva", { //url anterior: https://api-postgres-todo.onrender.com/tareas/nueva
            method : "POST", 
            body : JSON.stringify({tarea}),
            headers : {
                "Content-type" : "application/json" // Se especifica el tipo de contenido como JSON
            }
        })
        .then(respuesta => respuesta.json())//La respuesta se convierte a JSON y, si no hay errores, se instancia y muestra la nueva tarea en el frontend.
        //De esa respuesta desestructuramos tanto el id como elerror 
        .then(({id,error}) => {
            if(!error){
                //si no hay error crearemos una tarea en la base de datos y la mostraremos en el front
                new Tarea(id,tarea,false,contTareas);
                return inputTexto.value = ""; //Esta línea limpia el campo del texto una vez hayamos creado una tarea

            }// Muestra un mensaje en caso de error
            console.log("...mostrar error al usuario");
        });
    }
});
