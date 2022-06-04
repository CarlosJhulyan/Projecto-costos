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

// URL data
const headerPlanillaRef = db.collection('dataHeaderPlanilla');
const remuneracionesPlanillaRef = db.collection('dataRemuneracionPlanilla');
const configPlanillaRef = db.collection('dataConfigPlanilla').doc('N9cuT6iVfjBtwsxpnVuV');

// DOM constantes
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
const buttonFetchHeader = document.getElementById('button-fetch-header');
const buttonSave = document.getElementById('button-save');
const buttonClear = document.getElementById('button-clear');

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
  totalAport: 0,
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
    buttonFetchHeader.textContent = 'Actualizar';
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

  buttonSave.addEventListener('click', saveListRemuneraciones);
}



// Funciones y procesos

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
    clearDataRemuneraciones();
    e.target.reset();
  }
}

function saveListRemuneraciones() {
  if (localStorage.getItem('id')) {
    showLoadingButtonSave(true);
    if (listaRemuneraciones.length !== 0)
      remuneracionesPlanillaRef
      .doc(localStorage.getItem('id'))
      .set({ lista: listaRemuneraciones })
      .then(() => {
        showLoadingButtonSave(false);
        alert('Se guardo la lista');
      })
      .catch(error => console.error(error));
      else alert('La lista esta vacia.');
  } else alert('No se configuró la cabecera de planilla.');
}

function insertRemuneracionToList() {
  const asignacion = dataFormRemuneracion.asignacion;
  const sueldo = dataFormRemuneracion.sueldo;
  const asignacionValue = getAsignacionFamiliar(asignacion);
  const totalRem = getTotalRem(sueldo, asignacionValue);
  const snp = getRetenciones(totalRem, "snp", retencion.value);
  const afp = getRetenciones(totalRem, "afp", retencion.value);
  const quinta = getRetenciones(totalRem, "renta", retencion.value);
  const totalReten = getTotalRetenciones(afp, snp, quinta);
  const remunera = getRemuneAportacion(totalRem, totalReten);
  const essalud = getEssalud(totalRem);
  const totalAport = totalAportacion(totalRem);

  listaRemuneraciones.push({
    ...dataFormRemuneracion,
    totalRem,
    asignacionValue,
    snp,
    afp,
    quinta,
    totalReten,
    remunera,
    essalud,
    totalAport,
  });
}

function getDataConfigPlanilla() {
  showSpin(true);
  configPlanillaRef.get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      dataConfig.essalud = data.essalud / 100;
      dataConfig.rmv = data.rmv;
      dataConfig.aFamiliar = data.familiar / 100;
      dataConfig.aporteONP = data.aporteONP / 100;
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

function clearDataRemuneraciones() {
  dataFormRemuneracion.afp = 0;
  dataFormRemuneracion.apellidos = '';
}

// Funnciones para cálculos 

function getAsignacionFamiliar(asigFamiliar) {
  return asigFamiliar === "si" ? dataConfig.rmv * dataConfig.aFamiliar : 0;
}

function getTotalRem(sueldo, asigFamiliar){
  return Number(sueldo) + Number(asigFamiliar);
}

function getRetenciones(totalRemuneracion, tipo, tipoRetencion, tipoAFP) {
  if (tipoRetencion === "snp" && tipo === "snp") {
    return totalRemuneracion * dataConfig.aporteONP;
  } else if (tipoRetencion === "afp" && tipo === "afp") {
    if (tipoAFP === "integra") {
      return 345545;
    } else if (tipoAFP === "habitad") {
      return 384738943;
    }
  } else if (tipoRetencion === "renta" && tipo === "renta") {
    return 4385348;
  } else {
    return 0;
  }
}

function getTotalRetenciones(afp, snp, renta){
  return afp + snp + renta;
}

function getRemuneAportacion(totalRem, totalReten) {
  return totalRem - totalReten;
}

function getEssalud(totalRem) {
  return totalRem * dataConfig.essalud;
}

function totalAportacion(totalRem) {
  return getEssalud(totalRem);
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
  showdButtonsActions(listaRemuneraciones.length === 0);
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
    snp,
    afp,
    quinta,
    totalReten,
    remunera,
    totalAport,
    essalud,
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
    <td>${afp}</td>
    <td>${snp}</td>
    <td>${quinta}</td>
    <td>${totalReten}</td>
    <td>${remunera}</td>
    <td>${essalud}</td>
    <td>${totalAport}</td>
  `;
  return tr;
}

function showSpin(flag) {
  if (flag) spin.style.display = 'flex';
  else spin.style.display = 'none';
}

function showLoadingButtonHeader(flag) {
  if (flag) buttonFetchHeader.innerHTML = `
    <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    Cargando...
  `;
  else buttonFetchHeader.textContent = 'Actualizar';
}

function clearTableRemuneraciones() {
  tableContentPlanilla.innerHTML = '';
}

function showdButtonsActions(flag) {
  if (flag) {
    buttonSave.setAttribute('hidden', '');
    buttonClear.setAttribute('hidden', '');
  } else {
    buttonSave.removeAttribute('hidden');
    buttonClear.removeAttribute('hidden');
  }
}

function showLoadingButtonSave(flag) {
  if (flag) buttonSave.innerHTML = `
    <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    Guardando...
  `;
  else buttonSave.textContent = 'Guardar';
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
    validateInputDOM(sueldoBasico, Number(sueldoBasico.value) <= 0);
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