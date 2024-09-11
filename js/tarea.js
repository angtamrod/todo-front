//TAREA.JS gestionará una clase tarea que representa cada tarea como un componente independiente dentro de la aplicación. Cada tarea se gestiona de manera autónoma mediante métodos que permiten crear, editar, actualizar el estado y borrar tareas. 

//Gracias a la class cada componente es independiente son programas distintos, estás dando instruciones o recetas para crear componentes con unas características específicas las veces que sean

//La clase Tarea construye un elemento div para cada tarea, que incluye texto, botones para editar, borrar y cambiar el estado.

class Tarea{
    constructor(id,texto,estado,contenedor){//Esto lo que hará es añadir tareas al html (id, el texto, el estado de la tarea y el contenedor donde irá el contenido) No necesitaremos ni el estado ni el contenedor
        this.id = id;
        this.texto = texto;
        this.editando = false;
        this.crearDOM(estado,contenedor);
    }//El método crearDOM se encarga de ensamblar y añadir estos elementos al contenedor especificado.
    crearDOM(estado,contenedor){
        this.DOM = document.createElement("div");
        this.DOM.className = "tarea";

        //texto tarea --> h3
        let textoTarea = document.createElement("h3");
        textoTarea.className = "visible";
        textoTarea.innerText = this.texto;

        //editor tarea --> input
        let editorTarea = document.createElement("input");
        editorTarea.setAttribute("type", "text");
        editorTarea.setAttribute("value",this.texto);

        //boton editar
        let botonEditar = document.createElement("button");
        botonEditar.className = "boton";
        botonEditar.innerText = "editar";

        botonEditar.addEventListener("click",() => this.actualizarTexto());

        //boton borrar
        let botonBorrar = document.createElement("button");
        botonBorrar.className = "boton";
        botonBorrar.innerText = "borrar";

        botonBorrar.addEventListener("click",() => this.borrarTarea());

        //boton estado
        let botonEstado = document.createElement("button");
        botonEstado.className = `estado ${ estado ? "terminada" : ""}`;
        botonEstado.appendChild(document.createElement("span"));

        botonEstado.addEventListener("click",() => {
            this.actualizarEstado().then(() => botonEstado.classList.toggle("terminada"));
        });

        this.DOM.appendChild(textoTarea);
        this.DOM.appendChild(editorTarea);
        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        this.DOM.appendChild(botonEstado);


        contenedor.appendChild(this.DOM);
    }
    //2. EDICIÓN DE TAREAS:
    //El método actualizarTexto permite editar el texto de una tarea. Si el usuario hace clic en el botón de editar, cambia el DOM para mostrar un campo de entrada (input) en lugar del texto. Es decir, cuando un usuario hace clic en el botón "editar", cambia el texto de la tarea a un campo editable (input). Una vez que el usuario edita el texto y hace clic en el botón "guardar", la función valida la entrada y, si es correcta, actualiza la tarea tanto en el frontend como en el backend.
    async actualizarTexto(){

        //La función utiliza una propiedad this.editando que actúa como un interruptor (toggle) para determinar si la tarea está en modo edición o en modo visualización. Si this.editando es true, significa que la tarea está en modo edición, y el usuario está viendo un campo input para modificar el texto.
        if(this.editando){//Determinamos 2 acciones con una propiedad interna en este caso this.editando
            //SI ESTAMOS EDITANDO:
            //Aquí estamos extrayendo el texto temporal: Si el modo de edición está activo, la función toma el valor actual del campo input (el nuevo texto de la tarea) y lo guarda en textoTemporal.
            let textoTemporal = this.DOM.children[1].value.trim();//Extraemos el texto temporal del input

            
            //Estamos preguntando si el usuario lo ha editado y si esa edición es correcta. Verificando que el textoTemporal no esté vacío(textoTemporal != "")  y que sea diferente (textoTemporal !=) al texto original (this.texto).
            if(textoTemporal != "" && textoTemporal != this.texto){
                //Si la validación es exitosa, envía una petición PUT al backend para actualizar el texto de la tarea en la base de datos:
                let{error} = await fetch("http://localhost:4000/tareas/actualizar/1/" + this.id,{ //url anterior: https://api-postgres-todo.onrender.com/tareas/actualizar/1/
                    method : "PUT",
                    body : JSON.stringify({ tares : textoTemporal}),
                    headers : {
                        "Content-type" : "application/json"
                    }
                }).then(respuesta => respuesta.json())

                //Si la respuesta del backend no contiene errores (!error), se actualiza this.texto con el nuevo valor de textoTemporal.
                if(!error){
                    this.texto = textoTemporal;
                }else{
                    console.log("...error al usuario")
                }
                this.texto = textoTemporal; 
            }
            // Actualiza el DOM para reflejar el texto actualizado y cambia la visibilidad
            this.DOM.children[1].classList.remove("visible"); // Oculta el input quitando la clase "visible"
            this.DOM.children[0].innerText = this.texto; // Muestra el texto actualizado
            this.DOM.children[0].classList.add("visible"); // Muestra el texto como visible
            this.DOM.children[2].innerText = "editar"; // Cambia el botón a "editar"

        //SI NO ESTAMOS EDITANDO(SIN modo edición):
        }else{ 
             // Cambia el DOM para permitir la edición
            this.DOM.children[0].classList.remove("visible"); //Oculta el texto quitandole la clase visible
            this.DOM.children[1].value = this.texto;//(Asigna el valor al input) Para coger el value de un input de formulario una vez el usuario ha modificado algo, tenemos que hacerlo directamente con el .value ya que la acción del usuario manda más que el JS (en la mayoría de los navegadores)
            this.DOM.children[1].classList.add("visible");// Muestra el input añadiendole la clase visible
            this.DOM.children[2].innerText = "guardar";// Cambia el texto del botón a "guardar"
        }
        this.editando = !this.editando; //ES UN TOGGLE que invierte el estado de edición, si estaba true se tendría que poner false y viceversa


    }//El método actualizarEstado() cambia visualmente el estado de la tarea en la interfaz de usuario y envía una petición PUT al backend para actualizar el estado en la base de datos. 
    actualizarEstado(){
        //La función devuelve una nueva promesa. Esto permite a otros métodos o funciones manejar el resultado de la actualización, ejecutando acciones adicionales si la actualización es exitosa o fallida.
       return new Promise((ok,ko) => {
        // ok();
        //Como la petición no envía un cuerpo JSON ya que solo necesita cambiar el estado (posiblemente un toggle entre completada y no completada).
         fetch("http://localhost:4000/tareas/actualizar/2/" + this.id, { //URL ANTERIOR https://api-postgres-todo.onrender.com/tareas/actualizar/2/
            method : "PUT"
         })
         .then(respuesta => respuesta.json()) //Esto convierte la respuesta a JSON
         .then(({error}) => {// Una vez que el servidor responde, se evalúa si la actualización fue exitosa o no utilizando la propiedad error de la respuesta JSON.

            //Si no hay error (!error), la promesa se resuelve invocando ok(), lo que indica que la actualización fue exitosa. Si hay un error, la promesa se rechaza invocando ko()
            !error ? ok() : ko(); 

         });
       });
    }borrarTarea(){ 
        // this.DOM.remove(); Hasta este punto cuando borrabamos la tarea solo se borraba momentáneamente en el front, pero no en el back.
        //La función utiliza fetch para enviar una petición DELETE al endpoint del backend https://api-postgres-todo.onrender.com/tareas/borrar/ seguido del ID de la tarea.
        fetch("http://localhost:4000/tareas/borrar/" + this.id, {//Esto la borra SOLO del back. Este endpoint está configurado para manejar la eliminación de la tarea en la base de datos. //URL ANTERIOR https://api-postgres-todo.onrender.com/tareas/borrar/
            method : "DELETE"
        })
        .then(respuesta => respuesta.json())//La respuesta del servidor se convierte a formato JSON utilizando .then(respuesta => respuesta.json()).
        .then(({resultado,error}) => {
            //La respuesta JSON del servidor se desestructura para obtener resultado y error.
            //Se verifica si no hay un error (!error). 
            if(!error){
                //Si no hay error, se procede a eliminar la tarea del frontend invocando this.DOM.remove().
                return this.DOM.remove();
            }//En caso de que haya un error, se imprime un mensaje en la consola (console.log("...mostrar error al usarlo");) para indicar que hubo un problema al intentar borrar la tarea.
            console.log("...mostrar error al usarlo");
        });
       
    }
}


/*La función borrarTarea() en la clase Tarea se encarga de eliminar una tarea tanto del frontend (la interfaz de usuario) como del backend (la base de datos):
        - Elimina visualmente la tarea del DOM en el frontend.
        - Envía una petición DELETE al backend para eliminar la tarea de la base de datos.

*/


// postgresql://bbdd_tareas_sy1q_user:L0mXclFk4O742IU72rGBRD0al1Z2HJoV@dpg-cqf9ec0gph6c73ba7ij0-a.frankfurt-postgres.render.com/bbdd_tareas_sy1q

//postgresql://bbdd_tareas_sy1q_user:L0mXclFk4O742IU72rGBRD0al1Z2HJoV@dpg-cqf9ec0gph6c73ba7ij0-a/bbdd_tareas_sy1q