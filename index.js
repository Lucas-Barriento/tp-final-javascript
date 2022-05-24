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

function calcularTotalCarrito() {
    totalCarrito = 0;
    for (let index = 0; index < carritoLocal.length; index++) {
        totalCarrito += carritoLocal[index].precio;
    }
}

function pagar() {
    calcularTotalCarrito();
    if (totalCarrito > 0) {
        document.getElementById("btnPagar").style.visibility = 'hidden';
        document.getElementById("btnVaciar").style.visibility = 'hidden';    
    cartBody.innerHTML = `  <div id= "totalCarrito">
                                <div class="mb-3">
                                    <label for="exampleFormControlInput1" class="form-label">Ingrese un correo electronico para finalizar la compra</label>
                                    <input type="email" class="form-control" id="imputMail" placeholder="name@example.com">
                                </div>
                                <div class="mb-3">
                                    <button type="submit" class="btn btn-primary mb-3" id="btnEnviar" onclick="enviarPorMail()">Enviar</button>
                                    <button type="submit" class="btn btn-primary mb-3" id="btnCancelar" onclick="carrito()">Ahora no</button>
                                </div>
                                    <p>Total: \$${Intl.NumberFormat().format(totalCarrito)} </p>
                            </div>
                        `
        cartNavbar.appendChild(cartBody);
    }else {
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
                        imagen: data[seleccion - 1].imagen,
                        modelo: data[seleccion - 1].modelo,
                        precio: precio,
                        cantidad: 1
                    })
                    actualizarLocalStorage(carritoLocal);
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Producto agregado',
                        showConfirmButton: false,
                        timer: 750
                    })
                } else {
                    carritoLocal[carritoLocal.findIndex((x) => x.id == seleccion)].precio += parseFloat(data[seleccion - 1].precio);
                    carritoLocal[carritoLocal.findIndex((x) => x.id == seleccion)].cantidad++;
                    actualizarLocalStorage(carritoLocal);
                }
                data[seleccion - 1].stock -= 1;
                
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
        let {imagen,modelo,precio,id}= reloj;
        let contenedor = document.getElementById("container");
        contenedor.innerHTML += `<div class="card">
                                    <img src="${imagen}" class="card-img-top" alt="${modelo}">
                                    <div class="card-body">
                                        <h5 class="card-title">${modelo}</h5>
                                        <p class="card-text">\$${Intl.NumberFormat().format(precio)},00</p>
                                        <a href="#" class="btn btn-primary" id="btnCart" onclick="agregarAlCarrito(${id})">añadir</a>
                                    </div>
                                </div>`
        main.append(contenedor);
    }
    )
}
//FOOTER
var currentTime = new Date();
var year = currentTime.getFullYear()
let footer = document.createElement("footer");
footer.innerHTML += `   <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                            <div class="col-md-4 d-flex align-items-center">
                                <a href="/" class="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                                    <svg class="bi" width="30" height="24"><use xlink:href="#bootstrap"></use></svg>
                                </a>
                                <span class="text-muted">© ${year} Tienda de relojes JS, S.A.</span>
                            </div>
                            <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
                                <li class="ms-3"><a class="text-muted" href="http://www.facebook.com" id="iconsFooter"><img src="./img/facebook-icon.ico" alt="facebook"></a></li>
                                <li class="ms-3"><a class="text-muted" href="http://www.instagram.com" id="iconsFooter"><img src="./img/instagram-icon.ico" alt="instagram"></a></li>
                                <li class="ms-3"><a class="text-muted" href="https://web.whatsapp.com" id="iconsFooter"><img src="./img/whatsapp-icon.ico" alt="whatsapp"></a></li>
                            </ul>
                        </footer>
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
    document.getElementById("btnPagar").style.visibility = 'visible';
    document.getElementById("btnVaciar").style.visibility = 'visible';
    let cartBody = document.getElementById("cartBody");
    cartBody.innerHTML = "";
    if (carritoLocal.length > 0) {
        for (const obj of carritoLocal) {
            let {id, imagen,modelo,precio,cantidad} = obj;
            cartBody.innerHTML += ` <div id="containerCart">
                                        <img src="${imagen}" class="card-img-top" alt="${modelo}">
                                        <div id="textCart">
                                            <h3> ${modelo}</h3>
                                            <p>\$${Intl.NumberFormat().format(precio)},00</p>
                                        </div>
                                        <div id="buttonCart">
                                            <p><i class="bi bi-plus-circle-fill" onclick="agregarAlCarrito(${id})"></i>${cantidad}<i class="bi bi-dash-circle-fill" onclick="RestarDelCarrito(${id})"></i> </p>
                                            <button class="btn btn-secondary" id="eliminarCarrito" onclick="eliminarDelCarrito(${id})">eliminar</button>
                                        </div>
                                    </div>
                                    `;
            cartNavbar.appendChild(cartBody);
        }
        calcularTotalCarrito();
        //TOTAL $ DEL CARRITO
        cartBody.innerHTML += ` <div id= "totalCarrito">
                                <p>Total: \$${Intl.NumberFormat().format(totalCarrito)} </p>
                                </div>`
        cartNavbar.appendChild(cartBody);

    } else {
        cartBody.innerHTML += ` <div id="emptyCart">
                                <img src="./img/emptyCart.png" class="imgEmptyCart" alt="emptyCart">
                                </div>
                                `;
    }
    //numero de productos en el icono de carrito
    let cantCarrito = document.getElementById("navbartogglericon");
    cantCarrito.innerHTML = "";
    let containerCantCarrito = document.createElement("div");
    containerCantCarrito.setAttribute('id', 'cartNumber');
    containerCantCarrito.innerHTML = ` <p>${carritoLocal.length}</p>
                                    `
    cantCarrito.appendChild(containerCantCarrito);
}
//botones carrito
let botonVaciar = document.getElementById("btnVaciar");
botonVaciar.addEventListener("click", confirmarVaciar)

let botonPagar= document.getElementById("btnPagar");
botonPagar.addEventListener("click",pagar)

//VACIAR CARRITO
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


function validarEmail(valor) {
    return(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(valor));

    }
function enviarPorMail() {
    let mail = document.getElementById("imputMail").value;
    if(validarEmail(mail)){
        Swal.fire({
            title: `Enviaremos un link al siguiente mail: ${mail}`,
            text: "¿Estas de acuerdo?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                vaciarCarrito()
            }
        })
    }
    else{
        Swal.fire({
            icon: 'error',
            title: 'Por favor ingrese un mail valido',
            text: '',
        })
    };
    
}