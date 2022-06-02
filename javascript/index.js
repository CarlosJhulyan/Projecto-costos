'use strict';

// TODO: Replace the following with your app's Firebase project configuration
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
const dataConfigPlanillaRef = db.collection('dataConfigPlanilla').doc('N9cuT6iVfjBtwsxpnVuV');


// DOM Constantes
const tableContentPlanilla = document.getElementById('table-content-planilla')

const rmv = document.getElementById('rmv');
const essalud = document.getElementById('essalud');
const familiar = document.getElementById('familiar');

// DOM Constantes de los aportes
const aporteONP = document.getElementById('aporte-onp');
const aportePrima = document.getElementById('aporte-prima');
const aporteHabitad = document.getElementById('aporte-habitat');
const aporteIntegra = document.getElementById('aporte-integra');
const aporteProfuturo = document.getElementById('aporte-profuturo');

//DOM constantes de comisiones
const comisionONP = document.getElementById('comision-onp');
const comisionPrima = document.getElementById('comision-prima');
const comisionHabitad = document.getElementById('comision-habitad');
const comisionIntegra = document.getElementById('comision-integra');
const comisionProfuturo = document.getElementById('comision-profuturo');

// DOM Constantes de prima seguro'
const primaONP = document.getElementById('prima-onp');
const primaPrima = document.getElementById('prima-prima');
const primaHabitad = document.getElementById('prima-habitat');
const primaIntegra = document.getElementById('prima-integra');
const primaProfuturo = document.getElementById('prima-profuturo');


const switchEdit = document.getElementById('edit-switch');
const botonGuardado = document.getElementById('btn-guardar');
const spin = document.getElementById('spin');
const inputsConfigPlanilla = document.querySelectorAll('.input-config-planilla');


// Constantes y variables
const dataItemTablePlanilla = {
  id: '',
  nombres: '',
  apellidos: '',
  dni: '',
  fecha: '',
  cargo: '',
  sueldo: '',
  asigna: '',
  otros: '',
  totalRem: '',
  afp: '',
  snp: '',
  quinta: '',
  totalReten: '',
  remunera: '',
  essalud: '',
  total: '',
};

const dataHeaderPlanilla = {
  razonSocial: '',
  ruc: '',
  year: moment().format('yyyy'),
  monthText: new Date().getMonth(),
  monthValue: new Date().getMonth(),
};

// App

document.addEventListener('DOMContentLoaded', App);

function App() {
  getDataConfigPlanilla();
  switchEdit.addEventListener('change', handleChangeEditPlanilla);
}


/* Funciones */

function chargeDataConfigPlanilla(dataConfigPlanilla) {
  rmv.value = dataConfigPlanilla.rmv;
  familiar.value = dataConfigPlanilla.familiar + '%';
  essalud.value = dataConfigPlanilla.essalud + '%';
  aporteONP.value = dataConfigPlanilla.aporteONP + '%';
  aportePrima.value = dataConfigPlanilla.aportePrima + '%';
  aporteHabitad.value = dataConfigPlanilla.aporteHabitad + '%';
  aporteIntegra.value = dataConfigPlanilla.aporteIntegra + '%';
  aporteProfuturo.value = dataConfigPlanilla.aporteProfuturo + '%';
  comisionONP.value = dataConfigPlanilla.comisionONP + '%';
  comisionPrima.value = dataConfigPlanilla.comisionPrima + '%';
  comisionHabitad.value = dataConfigPlanilla.comisionHabitad + '%';
  comisionIntegra.value = dataConfigPlanilla.comisionIntegra + '%';
  comisionProfuturo.value = dataConfigPlanilla.comisionProfuturo + '%';
  primaONP.value = dataConfigPlanilla.primaONP + '%';
  primaPrima.value = dataConfigPlanilla.primaPrima + '%';
  primaHabitad.value = dataConfigPlanilla.primaHabitad + '%';
  primaIntegra.value = dataConfigPlanilla.primaIntegra + '%';
  primaProfuturo.value = dataConfigPlanilla.primaProfuturo + '%';
}

function handleChangeEditPlanilla (e) {
  inputsConfigPlanilla.forEach(item => {
    if (e.target.checked) item.removeAttribute('disabled');
    else item.setAttribute('disabled', '');
  })
}

function getDataConfigPlanilla() {
  showSpin();
  dataConfigPlanillaRef.get().then((doc) => {
    if (doc.exists) {
      chargeDataConfigPlanilla(doc.data());
      hiddenSpin();
    } else {
        console.log("No se encontro la colleccion!");
    }
  }).catch((error) => {
      console.log("Error collection:", error);
  });
}


// DOM Acciones

function insertItemDOM() {
  
}

function itemTablePlanillaDOM(data) {
  const {
    id,
    nombres,
    apellidos,
    dni,
    fecha,
    cargo,
    sueldo,
    asigna,
    otros,
    totalRem,
    
  } = data;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${id}</td>
    <td>${nombres}</td>
  `;
}

function showSpin() {
  spin.style.display = 'flex';
}

function hiddenSpin() {
  spin.style.display = 'none';
}