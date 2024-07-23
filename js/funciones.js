// ESTE ARCHIVO JS SERVIRÁ PARA LEER LA TAREA Y PINTARLA EN EL ARCHIVO INDEX.HTML
const contTareas= document.querySelector(".tareas");
const formulario= document.querySelector("form");
const inputTexto= document.querySelector(`form input[type="text"]`);

//CARGA INICIAL DE LOS DATOS
//Lo primero que hay que hacer es una llamada a los datos
fetch("https://api-postgres-todo.onrender.com/tareas") //Aquí es donde he alojado los datos de mis tareas 
.then(respuesta => respuesta.json())
.then(tareas => {
    //console.log(tareas);lo primero que hacemos es que la consola lea las tareas 

    //POSTGRES cuando edita pone esa tarea al final, para evitar esto haremos:
    tareas.sort((a,b) => a.id - b.id).forEach(({id,tarea,terminada}) => {//en vez de hacer una función por cada tarea, vamos a desestructurar cada tarea, a través del id, tarea y terminada que son las cualidades disponibles de cada tarea
        new Tarea(id,tarea,terminada,contTareas); //De esta manera habiendo leído los datos del back, pintaremos una tarea en el front, con los datos de id, tarea y terminada (en este caso)
    });
})//Hacer esto en un principio nos dará error porque al cambiar de dominio, porque no podemos hacer peticiones de un dominio a otro, el navegador le pedirá permisos que figurarán como no concedidos
//PARA ELLO HAY QUE INSTALAR EL MÓDULO npm cors que sirve para conceder permisos desde nuestra API
//Esto puede generar problemas de seguridad, pero a este nivel no es necesario, de todas maneras existe jwt.io donde se puede codificar unas credenciales para poder autenticar 


//LO PRIMERO QUE QUEREMOS HACER ES DE LA CREACIÓN DE LA NUEVA TAREAS EN EL FRONT, Y SE AÑADEN AL BACK 


/* formulario.addEventListener("submit", evento => {
    evento.preventDefault();
   
    if(inputTexto.value.trim() != ""){
        new Tarea(1, inputTexto.value.trim(), false,contTareas);
        inputTexto.value = "";
    }
}); */


formulario.addEventListener("submit", evento => {
    evento.preventDefault();
   
    if(inputTexto.value.trim() != ""){
        let tarea = inputTexto.value.trim();

        fetch("https://api-postgres-todo.onrender.com/tareas/nueva", {//esto hará la petición a la base de datos 
            method : "POST", 
            body : JSON.stringify({tarea}),
            headers : {
                "Content-type" : "application/json"
            }
        })
        .then(respuesta => respuesta.json())//Esto nos traerá la respuesta 
        .then(({id,error}) => {
            if(!error){//si no hay erro crearemos una tarea en la base de datos 
                new Tarea(id,tarea,false,contTareas);
                return inputTexto.value = "";
            }
            console.log("...mostrar error al usuario");
        });
    }
});
