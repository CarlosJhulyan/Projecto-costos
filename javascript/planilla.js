'use strict';

const firebaseConfig = {
  apiKey: "AIzaSyBEl7-KkDTFg2l8i1VOwMI77rmYeJapwx4",
  authDomain: "proyecto-costos-13e03.firebaseapp.com",
  projectId: "proyecto-costos-13e03",
  storageBucket: "proyecto-costos-13e03.appspot.com",
  messagingSenderId: "135704243594",
  appId: "1:135704243594:web:cf6177de9f55267e79ec73"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

// URL Data
const headerPlanillaRef = db.collection('dataHeaderPlanilla');
const configPlanillaRef = db.collection('dataConfigPlanilla').doc('N9cuT6iVfjBtwsxpnVuV');

// DOM Constantes
const tableContentPlanilla = document.getElementById('table-content-planilla')
const spin = document.getElementById('spin');


// DOM constantes inputs encabezado
const formHeaderPlanilla = document.getElementById('form-header-planilla');
const razonSocial= document.getElementById('razon-social');
const ruc = document.getElementById('ruc');
const mes = document.getElementById('month');
const year = document.getElementById('year');

// DOM constantes de los inputs del formulario de insertar
const formInsertarPlanilla = document.getElementById('form-insertar-planilla');
const nombres = document.getElementById('nombres');
const apellidos = document.getElementById('apellidos');
const dni = document.getElementById('dni');
const fecha = document.getElementById('fecha');
const cargo = document.getElementById('cargo');
const sueldoBasico = document.getElementById('sueldo');
const asignacion = document.getElementById('asignacion');
const retencion = document.getElementById('retencion');

const razonSocialLabel = document.getElementById('razon-social-label');
const rucLabel = document.getElementById('ruc-label');
const periodoLabel = document.getElementById('periodo-label');
const botonFetchHeader = document.getElementById('boton-fetch-header');

// Constantes y variables
const dataFormRemuneracion = {
  key: '',
  nombres: '',
  apellidos: '',
  dni: '',
  fecha: '',
  cargo: '',
  sueldo: 0,
  asignacion: 'si',
  otros: '',
  totalRem: 0,
  afp: '',
  snp: '',
  quinta: '',
  totalReten: 0,
  remunera: 0,
  essalud: 0,
  total: 0,
  retencion: 'afp',
  asignacionValue: '',
}

const dataFormHeader = {
  razonSocial: '',
  ruc: '',
  year: '2022',
  month: '01',
};

const listaRemuneraciones = [];
const dataConfig = {
  aFamiliar: 0,
  essalud: 0,
  rmv: 0,
  aporteONP: 0,
}

// App

document.addEventListener('DOMContentLoaded', App);

function App() {
  getDataConfigPlanilla();

  if (localStorage.getItem('id')) {
    getDataHeaderPlanilla();
    botonFetchHeader.textContent = 'Actualizar';
  }

  formHeaderPlanilla.addEventListener('submit', handleSubmitHeaderPlanilla);
  razonSocial.addEventListener('input', handleChangeInputHeader);
  ruc.addEventListener('input', handleChangeInputHeader);
  year.addEventListener('input', handleChangeInputHeader);
  mes.addEventListener('input', handleChangeInputHeader);
  
  formInsertarPlanilla.addEventListener('submit',handleSubmitRemuneracionPlanilla);
  nombres.addEventListener('input', handleChangeInputRemuneracion);
  apellidos.addEventListener('input', handleChangeInputRemuneracion);
  dni.addEventListener('input', handleChangeInputRemuneracion);
  fecha.addEventListener('input', handleChangeInputRemuneracion);
  cargo.addEventListener('input', handleChangeInputRemuneracion);
  sueldoBasico.addEventListener('input', handleChangeInputRemuneracion);
  asignacion.addEventListener('input', handleChangeInputRemuneracion);
  retencion.addEventListener('input', handleChangeInputRemuneracion);
}

// Funciones

function handleChangeInputHeader(e) {
  validateInputsDOM(formHeaderPlanilla.id);
  dataFormHeader[e.target.name] = e.target.value;
}

function handleChangeInputRemuneracion(e) {
  validateInputsDOM(formInsertarPlanilla.id);
  if (e.target.name === 'fecha')
    dataFormRemuneracion.fecha = moment(e.target.value, 'yyyy-MM-DD').format('DD-MM-yyyy');
  else if (e.target.name === 'sueldo')
    dataFormRemuneracion.sueldo = Number(e.target.value);
  else {
    dataFormRemuneracion[e.target.name] = e.target.value;
  }
}

function handleSubmitHeaderPlanilla(e) {
  e.preventDefault();
  const id = uuid.v4();

  if (validateInputs(formHeaderPlanilla.id)) {
    showLoadingButtonHeader(true);
    if (localStorage.getItem('id'))
      headerPlanillaRef
        .doc(localStorage.getItem('id'))
        .set(dataFormHeader)
        .then(() => {
          showLoadingButtonHeader(false);
          e.target.reset();
        })
        .catch(error => console.error(error));
    else
      headerPlanillaRef
        .doc(id)
        .set(dataFormHeader)
        .then(() => {
          showLoadingButtonHeader(false);
          localStorage.setItem('id', id);
          e.target.reset();
        })
        .catch(error => console.error(error));
  }
}

function handleSubmitRemuneracionPlanilla(e) {
  e.preventDefault();
  if (validateInputs(formInsertarPlanilla.id)) {
    insertRemuneracionToList();
    insertItemsDOM();
    e.target.reset();
  }
}

function insertRemuneracionToList() {
  const asignacion = dataFormRemuneracion.asignacion;
  const sueldo = dataFormRemuneracion.sueldo;
  const asignacionValue = getAsignacionFamiliar(sueldo, asignacion);
  const totalRem = getTotalRem(sueldo, asignacionValue);
  // getRetenciones(totalRem, retencion);

  listaRemuneraciones.push({
    ...dataFormRemuneracion,
    totalRem,
    asignacionValue,
  });
}

function getDataConfigPlanilla() {
  showSpin(true);
  configPlanillaRef.get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      dataConfig.essalud = data.essalud;
      dataConfig.rmv = data.rmv;
      dataConfig.aFamiliar = data.familiar;
      dataConfig.aporteONP = data.aporteONP;
    } else {
        console.error("No se encontro la colleccion!");
    }
    showSpin(false);
  }).catch((error) => {
      console.error("Error collection:", error);
  });
}

function getDataHeaderPlanilla() {
  const id = localStorage.getItem('id');
  headerPlanillaRef.doc(id).get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      razonSocialLabel.textContent = data.razonSocial;
      rucLabel.textContent = data.ruc;
      periodoLabel.textContent = data.year;
    } else {
        console.error("No se encontro el documento!");
    }
  }).catch((error) => {
      console.error("Error collection:", error);
  });
}

function validateInputs(form) {
  const formData = form === 'form-insertar-planilla' ? dataFormRemuneracion : dataFormHeader;
  validateInputsDOM(form);
  const list = Object.entries(formData);
  return list.every(item => {
    switch (item[0]) {
      case 'ruc':
        return item[1].length === 11;
      case 'razonSocial':
        return item[1].trim() !== '';
      case 'nombres':
        return item[1].trim() !== '';
      case 'apellidos':
        return item[1].trim() !== '';
      case 'dni':
        return item[1].length === 8;
      case 'fecha':
        return item[1].trim() !== '';
      case 'cargo':
        return item[1].trim() !== '';
      case 'sueldo':
        return item[1] >= 0;
      default:
        return true;
    }
  })
}

// Funnciones para cálculos 

function getAsignacionFamiliar(sueldo, asigFamiliar) {
  return asigFamiliar === "si" ? sueldo * dataConfig.aFamiliar / 100 : 0;
}

function getOtros(){

}

function getTotalRem(sueldo, asigFamiliar){
  return Number(sueldo) + Number(asigFamiliar);
}

function getRetenciones(totalRemuneracion, tipoRetencion, tipoAFP){
  if (tipoRetencion === "snp") {
    return totalRemuneracion * dataConfig.aporteONP / 100;
  } else if (tipoRetencion === "afp") {
    if (tipoAFP === "integra") {
      
    } else {//habitat
      
    }
  } else if (tipoRetencion === "renta") {
    
  }
}


// DOM Funciones

function insertItemsDOM() {
  clearTableRemuneraciones();
  listaRemuneraciones.map((item, key) => {
    tableContentPlanilla.appendChild(itemTablePlanillaDOM({
      ...item,
      key,
    }));
    listaRemuneraciones[key] = {
      ...item,
      key,
    };
  });
  console.log(listaRemuneraciones);
}

function itemTablePlanillaDOM(data) {
  const {
    key,
    nombres,
    apellidos,
    dni,
    fecha,
    cargo,
    sueldo,
    asignacionValue,
    totalRem,
  } = data;  

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${key + 1}</td>
    <td>${nombres}</td>
    <td>${apellidos}</td>
    <td>${dni}</td>
    <td>${fecha}</td>
    <td>${cargo}</td>
    <td>${sueldo}</td>
    <td>${asignacionValue}</td>
    <td></td>
    <td>${totalRem}</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  `;
  return tr;
}

function showSpin(flag) {
  if (flag) spin.style.display = 'flex';
  else spin.style.display = 'none';
}

function showLoadingButtonHeader(flag) {
  if (flag) botonFetchHeader.innerHTML = `
    <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    Cargando...
  `;
  else botonFetchHeader.textContent = 'Actualizar';
}

function clearTableRemuneraciones() {
  tableContentPlanilla.innerHTML = '';
}

function validateInputsDOM(form) {
  if (form === 'form-header-planilla') {
    validateInputDOM(razonSocial, razonSocial.value.trim() === '');
    validateInputDOM(ruc, ruc.value.length !== 11);
  } else {
    validateInputDOM(nombres, nombres.value.trim() === '');
    validateInputDOM(apellidos, apellidos.value.trim() === '');
    validateInputDOM(dni, dni.value.length !== 8);
    validateInputDOM(fecha, fecha.value.trim() === '');
    validateInputDOM(cargo, cargo.value.trim() === '');
    validateInputDOM(sueldoBasico, sueldoBasico.value >= 0);
  }
}

function validateInputDOM(node, flag) {
  if (flag) {
    node.classList.add('is-invalid');
    node.classList.remove('is-valid');
  } else {
    node.classList.add('is-valid');
    node.classList.remove('is-invalid');
  }
}