// console.log("Hola Mundo");
// console.error("Tenemos un error");
// console.warn("Informacion");

const comidasPreferidas = ["Milanesas Con pure", "Paella Valencia"];
let postresPreferidos = "Flan con dulce de leche";
var ensaldasPreferidas = "Ninguna!!!";

// console.log({ comidasPreferidas, postresPreferidos, ensaldasPreferidas });

// console.log("comidasPreferidas :", comidasPreferidas);
comidasPreferidas[0] = "Vacio";

// console.log("comidasPreferidas :", comidasPreferidas);

// saludarTradicional();

function saludarTradicional() {
  console.log("Hola Mundo comida preferida :" + comidasPreferidas[0]);
}

const SaludarFlecha = () =>
  console.log(
    `Hola Mundo ensada : ${ensaldasPreferidas}, y la comida preferida es ${comidasPreferidas[0]}`
  );
// SaludarFlecha();

function mostrarLista(lista) {
  if (lista.length === 0) {
    console.log("Lista Vacia");
    return;
  }
  console.log("Pasmos la validacion");

  for (const item of lista) {
    console.log(item);
  }
  console.log(`Cantidad de elementos : ${lista.length}`);
}
// mostrarLista([]);
// console.log("----------------------");
// mostrarLista(["Breaking Bad", "Dark", "Mr. Robot"]);

class Persona {
  static especie = "Humana";

  constructor(nombre) {
    this.nombre = nombre;
  }

  saludar() {
    console.log(`Hola, soy ${this.nombre}`);
  }
}

const p1 = new Persona("Ana");
const p2 = new Persona("Manuel");

// p1.saludar();
// p2.saludar();
// console.log(Persona.especie);

class Contador {
  static cuentaGlobal = 0;

  constructor(nombre) {
    this.nombre = nombre;
    this.cuentaIndividual = 0;
  }

  contar() {
    this.cuentaIndividual++;
    Contador.cuentaGlobal++;
  }

  getResponsable() {
    return this.nombre;
  }
  getCuentaIndividual() {
    return this.cuentaIndividual;
  }

  static getCuentaGlobal() {
    return Contador.cuentaGlobal;
  }
}

const juan = new Contador("Juan");
const ana = new Contador("Ana");

juan.contar();
juan.contar();
ana.contar();

console.log("juan :", juan.getCuentaIndividual());
console.log("Ana:", ana.getCuentaIndividual());
console.log("Cuanta global :", Contador.getCuentaGlobal());