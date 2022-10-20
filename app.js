document.addEventListener('DOMContentLoaded', () => {
    // Selectores
    const contenedorJuego = document.querySelector('.contenedor-juego');
    const juego = document.querySelector('.juego');
    const resultado = document.querySelector('.resultado-juego');
    const contadorBanderas = document.getElementById('num-banderas');
    const contadorBanderasRestantes = document.getElementById('banderas-restantes');
    const botonGenerar = document.querySelector('.btn-generar');


    // Listeners
    botonGenerar.addEventListener('click', crearJuego);
    var contador = 0;


    // Variables GLOBALES
    let width = 10;             // => Factor de tamaño del juego (40rem) y las casillas (4rem). Se modifica en crearJuego().
    let numBombas = 10;         // => Número de bombas. Se modifica en crearJuego().
    let numBanderas = 0;        // => Número de banderas marcadas
    let casillas = [];          // => Array con las casillas
    let finPartida = false;     // => Marca de si se ha picado en una bomba

    /**
     * @description Añade los números a las casillas cerca de bomba
     **/
    function añadeNumeros() {
        for (let i=0; i < casillas.length; i++) {
            let total = 0;                                      // => Nº de bombas contiguas a una casilla
            const estaBordeIzq = (i % width === 0);             // => Casilla está en el borde izq
            const estaBordeDech = (i % width === width - 1);    // => Casilla está en el borde dech

            if (casillas[i].classList.contains('vacio')) {
                // Vemos si hay bomba en la casilla anterior
                if (i > 0 && !estaBordeIzq && casillas[i-1].classList.contains('bomba')) total++;
                
                // Vemos si hay bomba en la casilla siguiente
                if (i < (width*width-1) && !estaBordeDech && casillas[i+1].classList.contains('bomba')) total++;

                // Vemos si hay bomba en la casilla superior
                if (i > width && casillas[i-width].classList.contains('bomba')) total++;
                
                // Vemos si hay bomba en la casilla siguiente de la fila anterior
                if (i > (width-1) && !estaBordeDech && casillas[i+1-width].classList.contains('bomba')) total++;
                
                // Vemos si hay bomba en la casilla anterior de la fila anterior
                if (i > width && !estaBordeIzq && casillas[i-1-width].classList.contains('bomba')) total++;

                // Vemos si hay bomba en la casilla inferior
                if (i < (width*(width-1)) && casillas[i+width].classList.contains('bomba')) total++;

                // Vemos si hay bomba en la casilla siguiente de la fila siguiente
                if (i < (width*(width-1)) && !estaBordeDech && casillas[i+1+width].classList.contains('bomba')) total++;
                
                // Vemos si hay bomba en la casilla anterior de la fila siguiente
                if (i < (width*(width-1)) && !estaBordeIzq && casillas[i-1+width].classList.contains('bomba')) total++;

                // Guardamos el nº de bombas en atributo data
                casillas[i].setAttribute('data', total);
            }
        }
    }

    /**
     * @description Revela las casillas cuando se pica en una sin bombas cerca
     * @param casilla Casilla vacía donde se hizo click
     **/
    function revelarCasillas(casilla) {
        const idCasilla = parseInt(casilla.id);
        const estaBordeIzq = (idCasilla % width === 0);             // => Casilla está en el borde izq
        const estaBordeDech = (idCasilla % width === width - 1);    // => Casilla está en el borde dech

        setTimeout(() => {
            // Simulamos clik en la casilla anterior
            if (idCasilla > 0 && !estaBordeIzq) click(casillas[idCasilla-1]);
                    
            // Simulamos clik en la casilla siguiente
            if (idCasilla < (width*width-2) && !estaBordeDech) click(casillas[idCasilla+1]);

            // Simulamos clik en la casilla superior
            if (idCasilla >= width) click(casillas[idCasilla-width]);
            
            // Simulamos clik en la casilla siguiente de la fila anterior
            if (idCasilla > (width-1) && !estaBordeDech) click(casillas[idCasilla+1-width]);
            
            // Simulamos clik en la casilla anterior de la fila anterior
            if (idCasilla > (width+1) && !estaBordeIzq) click(casillas[idCasilla-1-width]);

            // Simulamos clik en la casilla inferior
            if (idCasilla < (width*(width-1))) click(casillas[idCasilla+width]);

            // Simulamos clik en la casilla siguiente de la fila siguiente
            if (idCasilla < (width*width-width-2) && !estaBordeDech) click(casillas[idCasilla+1+width]);
            
            // Simulamos clik en la casilla anterior de la fila siguiente
            if (idCasilla < (width*width-width) && !estaBordeIzq) click(casillas[idCasilla-1+width]);

        }, 10);
    }


    /**
     * @description Función que se ejecuta cuando se pica en una bomba
     * @param casillaClickeada Casilla donde si hizo click
     */
    function bomba(casillaClickeada) {
        cerrarModal();
        finPartida = true;
        casillaClickeada.classList.add('back-red');

        // Desvelamos todas las bombas
        casillas.forEach((casilla, index, array) => {
            if (casilla.classList.contains('bomba')) {
                casilla.innerHTML =  "<img src=/imgs/1.png>";
                casilla.classList.remove('bomba');
                casilla.classList.add('marcada');
            }
        });

        resultado.textContent = 'Lo siento, PERDISTE!!!';
        resultado.classList.add('back-red');
    }


    /**
     * @description Añade bandera a la casilla seleccionada con el botón derecho
     * @param casilla Casilla sobre la que se hizo click con botón derecho
     */
    function añadirBandera(casilla) {
        if (finPartida) return;

        if (!casilla.classList.contains('marcada') && numBanderas < numBombas) {
            if (!casilla.classList.contains('bandera')) {
                casilla.classList.add('bandera');
                casilla.innerHTML = "<img src=/imgs/acsendo.png>";
                numBanderas++;
                actualizaNumBanderas();
                if (numBanderas == 10){
                    compruebaPartida();
                }
            } else {
                casilla.classList.remove('bandera');
                casilla.innerHTML = '';
                numBanderas--;
            }
        }
    }

    /**
     * @description Comprueba si se ha ganado o no una partida
     */
    function compruebaPartida() {
        let aciertos = 0;

        for (let i = 0; i < casillas.length; i++) {
            if (casillas[i].classList.contains('bandera') && casillas[i].classList.contains('bomba'))
                aciertos++;
        }

        if (aciertos === numBombas) {
            finPartida = true;
            resultado.textContent = 'Muy bien GANASTE!!!';
            resultado.classList.add('back-green');
        }
        else{
            finPartida = true;
            resultado.textContent = 'Muy bien PERDISTE!!!';
            resultado.classList.add('back-red');
            
            casillas.forEach((casilla, index, array) => {
                if (casilla.classList.contains('bomba')) {
                    casilla.innerHTML = "<img src=/imgs/1.png>";
                    casilla.classList.remove('bomba');
                    casilla.classList.add('marcada');
                }
            });
        }
    }


    /**
     * @description Actualizar el contador de banderas
     */
    function actualizaNumBanderas() {
        contadorBanderas.textContent = numBanderas;
        contadorBanderasRestantes.textContent = (numBombas - numBanderas);
    }

        
    /**
     * @description Función al hacer CLICK
     * @param casilla Casilla sobre la que se hizo click
     **/
     
    function click(casilla) {
        // Comprobamos si la casilla no es clickeable
        if (casilla.classList.contains('marcada') || casilla.classList.contains('bandera') || finPartida) return;

        if (casilla.classList.contains('bomba')) {
            // Casilla bomba
             /*bomba(casilla);*/
             contador++;
             console.log(contador)
            if(contador == 1){
                document.getElementById("modal").style.display = "flex";
                document.getElementById("modalTitulo").innerHTML = "Manolo";
                const Modalbutton = document.querySelector('#modalButton');
                const Modalbutton2 = document.querySelector('#modalButton2');
                Modalbutton.addEventListener('click', cerrarModal);
                Modalbutton2.addEventListener('click', (event) =>  bomba(casilla));
             } else if(contador == 2){
                document.getElementById("modal").style.display = "flex";
                document.getElementById("modalTitulo").innerHTML = "Diego";
                const Modalbutton = document.querySelector('#modalButton');
                const Modalbutton2 = document.querySelector('#modalButton2');
                Modalbutton.addEventListener('click', cerrarModal);
                Modalbutton2.addEventListener('click', (event) =>  bomba(casilla));
             }else if(contador == 3){
                document.getElementById("modal").style.display = "flex";
                document.getElementById("modalTitulo").innerHTML = "Daniela";
                const Modalbutton = document.querySelector('#modalButton');
                const Modalbutton2 = document.querySelector('#modalButton2');
                Modalbutton.addEventListener('click', cerrarModal);
                Modalbutton2.addEventListener('click', (event) =>  bomba(casilla));
             }
            
        } else {
            let total = casilla.getAttribute('data');
            if (total != 0) {
                // Casilla con bombas cerca
                casilla.classList.add('marcada');
                casilla.innerHTML = total;
                return;
            }
            casilla.classList.add('marcada');
                
            // Casilla sin bombas cerca
            revelarCasillas(casilla);

        }
        if (contador > 3) {
            bomba(casilla)
        }
    }

    /**
     * @description Función al hacer DOBLE-CLICK. Sólo se puede hacer sobre una casilla marcada
     * @param casilla Casilla sobre la que se hizo doble-click
     **/ 
    function dobleClick(casilla) {
         // Comprobamos si la casilla no es clickeable
         if (!casilla.classList.contains('marcada') || finPartida) return;

         revelarCasillas(casilla);
    }

    function cerrarModal(){
        document.getElementById("modal").style.display = "none";
    }

    /** 
     * @description Función principal que crea el juego 
     **/
    function crearJuego() {
        document.getElementById("instrucciones").style.display = "none";
        document.getElementById("btn-generar").style.display = "none";
        width = 10;
        numBombas = 10;


        if (contenedorJuego.classList.contains('hidden')) {
            // Si tiene la clase 'hidden' es porque no hay ningún juego
            contenedorJuego.classList.remove('hidden');
        } else {
            // Si no tiene clase 'hidden' es porque estamos generando un nuevo juego => borramos el anterior y reiniciamos valores
            juego.innerHTML = "";
            resultado.innerHTML = "";
            resultado.className = "resultado-juego";
            casillas = [];
            finPartida = false;
            numBanderas = 0;
        }

        // Damos dimensiones al juego, según en número de casillas
        juego.style.width = (width * 4) + 'rem';
        resultado.style.width = (width * 4) + 'rem';

        // Creamos un matriz con bombas aleatorias
        const arrayBombas = Array(numBombas).fill('bomba');
        const arrayVacios = Array(width*width - numBombas).fill('vacio');
        const arrayCompleto = arrayVacios.concat(arrayBombas);
        arrayCompleto.sort(() =>  Math.random() - 0.5 );    // => Mezclamos vacíos con bombas
        
        for(let i=0; i < width*width; i++) {
            const casilla = document.createElement('div');
            casilla.setAttribute('id', i);
            casilla.classList.add(arrayCompleto[i]);
            juego.appendChild(casilla);
            casillas.push(casilla);
            
            // Añadimos función al hacer click
            casilla.addEventListener('click', () => {
                click(event.target);
            });

            // Añadimos función al hacer click derecho
            casilla.oncontextmenu = function(event) {
                event.preventDefault();
                añadirBandera(casilla);
            }

            // Añadimos función al hacer doble-click
            casilla.addEventListener('dblclick', () => {
                dobleClick(event.target);
            });
        }

        añadeNumeros();
        actualizaNumBanderas();
    }

});