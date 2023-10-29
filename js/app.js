//Constructores

function Seguro (marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

//PROTOTYPE Seguro: realiza la cotizacion con los datos recogidos por la funcion cotizarSeguro
Seguro.prototype.cotizarSeguro = function(){
    
    //MARCA: revisar la selecion de marca y aplicamos el incremento por marca a la base
    console.log(this.marca);

    let cantidad;
    const base = 2000;

    switch(this.marca){
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    //AÑO: reviso la selecion del año y saco la diferencia con respecto al año actual
    // por cada año de antiguedad se reducira "cantidad" un 3%
    const diferencia = new Date().getFullYear() - this.year;
    cantidad = cantidad - ( (3 * diferencia)* cantidad) /100;
    console.log(cantidad);

    //TIPO DE SEGURO si es basico se multiplica por 30% mas y si es completo en un 50% mas

    if( this.tipo === 'basico'){
        cantidad *= 1.3;
    } else {
        cantidad *= 1.5;
    }
    return cantidad;
}

//contructor UI
function UI () {}

//PROTOTYPE UI Crea las opciones para el select de años de form del HTML
UI.prototype.llenarOpciones = () => {
    //pa sacar la escala de años
    const max = new Date().getFullYear(),
          min = max - 20;

    const selectYear = document.querySelector('#year');

    for (let i = max; i > min; i-- ) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

//PROTOTYPE UI Muestra las alertas en pantalla
UI.prototype.mostrarMensaje = function(mensaje, tipo) {
    const div = document.createElement('div');

    if(tipo === 'error'){
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje' , 'mt-10');
    div.textContent = mensaje;

    //insertamos el div en el html
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    //le colocamos 3 segundos al mensaje
    setTimeout(()=>{
        div.remove();
    }, 3000);

}

//PROTOTYPE UI  muestra el resultado en la interfase
UI.prototype.mostrarResultado = (seguro, total) =>{
    const { marca, year, tipo } = seguro;

    let textoMarca;

    switch(marca){
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiatrico';
            break;
        case '3':
            textoMarca = 'Europero';
            break;
        default:
            break;
    }


    // creamos un div para insertar el resutlado en el html
    const div = document.createElement('div');
    div.classList.add('mt-10');
    div.innerHTML = `
        <p class="header"> Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal">$${total}</span></p>
    `;
    //selecionamos el padre para insertar el div hijo
    const resultadoDiv = document.querySelector('#resultado');

    //Mostrar el spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';
    setTimeout(()=>{
        spinner.style.display = 'none'; //cambia el estilo de display para que desaparezca 
        resultadoDiv.appendChild(div); //mostrar el resultado en el padre resutladoDiv
    }, 3000);

}

//Instanciar UI
const ui = new UI();
console.log(ui);

document.addEventListener ('DOMContentLoaded', () => {
    ui.llenarOpciones(); //llena el select con los años
})


// Creo el evento CoTizar seguro que corresponde al boton tipo submit
eventListener();
function eventListener() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

// Funcion que genera la cotizacion al presionar el boton submit del form
function cotizarSeguro (e) {
    e.preventDefault();

    //leer la marca selecionada
    const marca = document.querySelector('#marca').value;

    //leer el año  seleccionado
    const year = document.querySelector('#year').value;

    //leer el tipo de seguro
    const tipo = document.querySelector('input[name="tipo"]:checked').value; //REPASAR!

    //validacion de campos vacios
    if(marca ==='' || year ==='' || tipo === ''){
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }
    
    ui.mostrarMensaje('Cotizando...', 'exito')

    //Ocultar las cotizaciones previas
    const resultado = document.querySelector('#resultado div');
    if(resultado != null){
        resultado.remove();
    }

    //Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    
    //Utilizar el prototype del objeto seguro que va a cotizar
    const total = seguro.cotizarSeguro();

    //Utilizamos el prototype del objeto UI para mostrar el total del seguro con sus caracteristicas
    ui.mostrarResultado(seguro, total)
}