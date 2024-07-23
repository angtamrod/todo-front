//TAREA.JS gestionará todo lo que son componentes 

//Gracias a la class cada componente es independiente son programas distintos, estás dando instruciones o recetas para crear componentes con unas características específicas las veces que sean

class Tarea{
    constructor(id,texto,estado,contenedor){//Esto lo que hará es añadir tareas al html (id, el texto, el estado de la tarea y el contenedor donde irá el contenido) No necesitaremos ni el estado ni el contenedor
        this.id = id;
        this.texto = texto;
        this.editando = false;
        this.crearDOM(estado,contenedor);
    }
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
    async actualizarTexto(){
        if(this.editando){//Determinamos 2 acciones con una propiedad interna en este caso this.editando
            let textoTemporal = this.DOM.children[1].value.trim();//Extraemos el texto temporal del input
            if(textoTemporal != "" && textoTemporal != this.texto){//Preguntamos si el usuario lo ha editado y si esa edición es correcta
                let{error} = await fetch("https://api-postgres-todo.onrender.com/tareas/actualizar/1/" + this.id,{
                    method : "PUT",
                    body : JSON.stringify({ tares : textoTemporal}),
                    headers : {
                        "Content-type" : "application/json"
                    }
                }).then(respuesta => respuesta.json())

                if(!error){
                    this.texto = textoTemporal;
                }else{
                    console.log("...error al usuario")
                }
                this.texto = textoTemporal; //Si esa condición se cumple hacemos el cambio (Aquí deberíamso hacer el fetch)
            }

            this.DOM.children[1].classList.remove("visible");
            this.DOM.children[0].innerText = this.texto;
            this.DOM.children[0].classList.add("visible");
            this.DOM.children[2].innerText = "editar";

        }else{//Si no estamos editando lo que hacemos es cambiar el DOM para que se permita editar 
            this.DOM.children[0].classList.remove("visible");
            this.DOM.children[1].value = this.texto;//Para coger el value de un input de formulario una vez el usuario ha modificado algo, tenemos que hacerlo directamente con el .value ya que la acción del usuario manda más que el JS (en la mayoría de los navegadores)
            this.DOM.children[1].classList.add("visible");
            this.DOM.children[2].innerText = "guardar";
        }
        this.editando = !this.editando; //ES UN TOGGLE si estaba true se tendría que poner false y si no no
    }
    actualizarEstado(){
       return new Promise((ok,ko) => {
        // ok();
         fetch("https://api-postgres-todo.onrender.com/tareas/actualizar/2/" + this.id, {
            method : "PUT"
         })
         .then(respuesta => respuesta.json())
         .then(({error}) => {
            !error ? ok() : ko(); //Si no hay error invocaremos ok() si no invocaremos ko()
         });
       });
    }
    borrarTarea(){
        // this.DOM.remove(); Hasta este punto cuando borrabamos la tarea solo se borraba momentáneamente en el front, pero no en el back.

        fetch("https://api-postgres-todo.onrender.com/tareas/borrar/" + this.id, {//Esto la borra SOLO del back
            method : "DELETE"
        })
        .then(respuesta => respuesta.json())
        .then(({resultado,error}) => {
            if(!error){
                return this.DOM.remove();
            }
            console.log("...mostrar error al usarlo");
        });
       
    }
}



// postgresql://bbdd_tareas_sy1q_user:L0mXclFk4O742IU72rGBRD0al1Z2HJoV@dpg-cqf9ec0gph6c73ba7ij0-a.frankfurt-postgres.render.com/bbdd_tareas_sy1q

//postgresql://bbdd_tareas_sy1q_user:L0mXclFk4O742IU72rGBRD0al1Z2HJoV@dpg-cqf9ec0gph6c73ba7ij0-a/bbdd_tareas_sy1q