class Reloj {
    constructor(id, modelo, precio = 0, stock = 0) {
        this.id = id;
        this.modelo = modelo;
        this.precio = precio;
        this.stock = stock;
    }
}

let carritoLocal = [];
var totalCarrito = 0;

function verCarrito() {

    document.write(`Factura de compra </br>
    ------------------------------------------------ </br>`);

    for (contador = 0; contador < carritoLocal.length; contador++) {
        document.write("producto " + (contador + 1) + ":  " + carritoLocal[contador].modelo + ", cantidad: " + carritoLocal[contador].cantidad + ", precio: $" + carritoLocal[contador].precio + "</br>");
    }

    document.write(`------------------------------------------------ </br>
    Total: \$${totalCarrito}`);
    localStorage.clear();
}

function calcularInteres(cuotas) {
    switch (cuotas) {
        case '3':
            totalCarrito = totalCarrito + (totalCarrito * 0.08);
            break;
        case '6':
            totalCarrito = totalCarrito + (totalCarrito * 0.13);
            break;
        case '9':
            totalCarrito = totalCarrito + (totalCarrito * 0.17);
            break;
        default:
            break;
    }
}

function calcularTotalCarrito() {
    totalCarrito = 0;
    for (let index = 0; index < carritoLocal.length; index++) {
        totalCarrito += carritoLocal[index].precio;
    }
}

function pagar() {
    calcularTotalCarrito();

    let pago;
    if (totalCarrito > 0) {
        var eleccion = prompt(`El total a pagar es: \$${totalCarrito}
    Seleccione el medio de pago: 
    1 - Debito (sin recargo).
    2 - Credito (financiacion con recargo)`);

        pago = prompt('Ingrese el numero de la tarjeta(5 digitos): ');

        while (pago.length != 5) {
            pago = prompt('Ingrese el numero de la tarjeta(5 digitos) : ');
        }

        switch (eleccion) {
            case '1':
                alert(`Su pago de \$${totalCarrito} fue aprobado!, a continuacion seras redirigido a la factura de tu compra`)
                break;
            case '2':
                let cuotas = prompt(`Indique como quiere pagar: 
            1 - 3 cuotas (%8 interes)
            2 - 6 cuotas (%13 interes)
            3 - 9 cuotas (%17 interes)`);
                calcularInteres(cuotas);
                alert(`Su pago de \$${totalCarrito} (${cuotas} cuotas de \$${totalCarrito / cuotas}) fue aprobado!, a continuacion seras redirigido a la factura de tu compra`)
                break;
            default:
                eleccion = prompt(`El total a pagar es: \$${totalCarrito}
    Por favor, intente nuevamente. Seleccione el medio de pago: 
    1 - Debito (sin recargo).
    2 - Credito (financiacion con recargo)`)
                break;
        }
        verCarrito();
    } else {
        Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'No hay productos en el carrito',
            showConfirmButton: false,
            timer: 750
        })
    }

}


function agregarAlCarrito(seleccion) {
    let existente = false;
    fetch("./productos.json")
        .then((resp) => resp.json())
        .then((data) => {
            for (let index = 0; index < carritoLocal.length; index++) {
                carritoLocal[index].id == seleccion && (existente = true);//checkea que no exista en el carrito
            }
            if (data[seleccion - 1].stock > 0) {
                if (!existente) {
                    let precio = parseFloat(data[seleccion - 1].precio);
                    carritoLocal.push({
                        id: data[seleccion - 1].id,
                        modelo: data[seleccion - 1].modelo,
                        precio: precio,
                        cantidad: 1
                    })
                    actualizarLocalStorage(carritoLocal);
                } else {
                    carritoLocal[carritoLocal.findIndex((x) => x.id == seleccion)].precio += parseFloat(data[seleccion - 1].precio);
                    carritoLocal[carritoLocal.findIndex((x) => x.id == seleccion)].cantidad++;
                    actualizarLocalStorage(carritoLocal);
                }
                data[seleccion - 1].stock -= 1;
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Producto agregado',
                    showConfirmButton: false,
                    timer: 750
                })
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Stock insuficiente',
                    showConfirmButton: false,
                    timer: 750
                })
            }
            carrito();
        })

}

function eliminarDelCarrito(id) {
    let indice = carritoLocal.findIndex((x) => x.id == id);
    carritoLocal.splice(indice, 1);
    actualizarLocalStorage(carritoLocal);
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Producto quitado',
        iconColor: 'red',
        showConfirmButton: false,
        timer: 750
    })
    carrito();
}


function RestarDelCarrito(id) {
    fetch("./productos.json")
        .then((resp) => resp.json())
        .then((data) => {
            let indice = carritoLocal.findIndex((x) => x.id == id);
            if (carritoLocal[indice].cantidad > 1) {
                carritoLocal[indice].precio -= data[id - 1].precio;
                carritoLocal[indice].cantidad--;
                data[id - 1].stock++;
                actualizarLocalStorage(carritoLocal);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Producto quitado',
                    iconColor: 'red',
                    showConfirmButton: false,
                    timer: 750
                })
            } else {
                eliminarDelCarrito(id);
            }
            carrito();
        })
}
//main 
let main = document.createElement("main");
document.body.append(main);
//titulo
let tituloLogo = document.createElement("div");
tituloLogo.setAttribute('id', 'tituloLogo');
tituloLogo.innerHTML = `<a id="imgLogo"><img src="./img/logo.png" alt="imgLogo"></a>
                <h1>Tienda de relojes JS</h1>
                `;
main.append(tituloLogo);
//contenedor de productos
let contenedorProductos = document.createElement("div");
contenedorProductos.setAttribute('id', 'container');
main.append(contenedorProductos);
//PRODUCTOS DEL MAIN
const pedirProductos = async () => {
    const resp = await fetch("./productos.json");
    const data = await resp.json();
    data.forEach((reloj) => {
        let contenedor = document.getElementById("container");
        contenedor.innerHTML += `<div class="card">
                                <img src="${reloj.imagen}" class="card-img-top" alt="${reloj.modelo}">
                                <div class="card-body">
                                <h5 class="card-title">${reloj.modelo}</h5>
                                <p class="card-text">\$${Intl.NumberFormat().format(reloj.precio)},00</p>
                                <a href="#" class="btn btn-primary" id="btnCart" onclick="agregarAlCarrito(${reloj.id})">añadir</a>
                                </div>
                            </div>`
        main.append(contenedor);
    }
    )
}
//FOOTER
let footer = document.createElement("footer");
footer.innerHTML += `<a href="http://www.facebook.com" id="iconsFooter"><img src="./img/facebook-icon.ico" alt="facebook"></a>
                     <a href="http://www.instagram.com" id="iconsFooter"><img src="./img/instagram-icon.ico" alt="instagram"></a>
                     <a href="https://web.whatsapp.com/" id="iconsFooter"><img src="./img/whatsapp-icon.ico" alt="whatsapp"></a>
                        `
document.body.append(footer);
//CARRITO
let cartNavbar = document.getElementById("offcanvasNavbar");
let contenedorCart = document.createElement("div");
contenedorCart.setAttribute('id', 'cartBody');
contenedorCart.className = "offcanvas-body";
cartNavbar.append(contenedorCart);
//ELEMENTOS DEL CARRITO
function carrito() {
    let cartBody = document.getElementById("cartBody");
    cartBody.innerHTML = "";
    if (carritoLocal.length > 0) {
        for (const obj of carritoLocal) {
            cartBody.innerHTML += `<div id="divCart"><h3> ${obj.modelo}</h3>
                               <p>Precio: \$${Intl.NumberFormat().format(obj.precio)},00</p>
                               <p><i class="bi bi-plus-circle-fill" onclick="agregarAlCarrito(${obj.id})"></i>${obj.cantidad}<i class="bi bi-dash-circle-fill" onclick="RestarDelCarrito(${obj.id})"></i> </p>
                               <button class="btn btn-secondary" id="eliminarCarrito" onclick="eliminarDelCarrito(${obj.id})">eliminar</button></div>
                               `;
            cartNavbar.appendChild(cartBody);
        }
    } else {
        cartBody.innerHTML += `<div id="emptyCart">
                            <img src="./img/emptyCart.png" class="imgEmptyCart" alt="emptyCart">
                        </div>`;
    }
}
//botones carrito
let botonVaciar = document.getElementById("btnVaciar");
botonVaciar.addEventListener("click", confirmarVaciar)

function confirmarVaciar() {
    calcularTotalCarrito();
    if (totalCarrito > 0) {
        Swal.fire({
            title: 'Desea vaciar el carrito?',
            text: "Se eliminaran todos los productos",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    vaciarCarrito()
                )
            }
        })
    } else {
        Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'No hay productos en el carrito',
            showConfirmButton: false,
            timer: 750
        })
    }
}

function vaciarCarrito() {
    localStorage.clear();
    totalCarrito = 0;
    location.reload();
    carrito();
}
//actualiza cada vez que se modifica algo
function actualizarLocalStorage(local) {
    localStorage.setItem("carritoStorage", JSON.stringify(local));
}
//si al iniciar la pagina ya hay algo en el carrito de localStorage, lo copia al local
localStorage.getItem("carritoStorage") && (carritoLocal = JSON.parse(localStorage.getItem("carritoStorage")));
pedirProductos();
carrito();