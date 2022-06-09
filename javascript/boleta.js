'use strict';

const firebaseConfig = {
  apiKey: "AIzaSyBEl7-KkDTFg2l8i1VOwMI77rmYeJapwx4",
  authDomain: "proyecto-costos-13e03.firebaseapp.com",
  projectId: "proyecto-costos-13e03",
  storageBucket: "proyecto-costos-13e03.appspot.com",
  messagingSenderId: "135704243594",
  appId: "1:135704243594:web:cf6177de9f55267e79ec73",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

// URL data
const headerPlanillaRef = db.collection('dataHeaderPlanilla');
const remuneracionesPlanillaRef = db.collection('dataRemuneracionPlanilla');
const configPlanillaRef = db.collection('dataConfigPlanilla').doc('N9cuT6iVfjBtwsxpnVuV');

// DOM Constantes
const rucLabel = document.getElementById('ruc-label');
const empleadorLabel = document.getElementById('empleador-label');
const periodoLabel = document.getElementById('periodo-label');
const numeroOrdenLabel = document.getElementById('numero-orden-label');

const spin = document.getElementById('spin');

// Constantes y variables

const dataFormHeader = {
  razonSocial: '',
  ruc: '',
  year: '2022',
  month: '01',
};


// App

document.addEventListener('DOMContentLoaded', App);

function App() {
  if (localStorage.getItem('id')) {
    getDataHeaderPlanilla();
    getDataRemuneracionPlanilla();
  } else {
    openNotification('Boleta de pagos', 'Tiene que generar su planilla de remuneraciones para previsualizar esta página.', 'warning');
  }
}


// Funciones y procesos

function getDataHeaderPlanilla() {
  showSpin(true);
  const id = localStorage.getItem('id');
  headerPlanillaRef.doc(id).get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      setPlanillaDescriptionHeaderDOM(data);
      generateOrderDOM();
      showSpin(false);
    } else openNotification('Base de datos', '¡No se encontró la collección!', 'error');
  }).catch((error) => console.error(error));
}

function getDataRemuneracionPlanilla() {
  const id = localStorage.getItem('id');
  remuneracionesPlanillaRef.doc(id).get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      console.log(data);
    } else openNotification('Base de datos', '¡No se encontró la collección!', 'error');
  }).catch((error) => console.error(error));
}

// DOM Funcciones

function setPlanillaDescriptionHeaderDOM(data) {
  rucLabel.textContent = data.ruc;
  empleadorLabel.textContent = data.razonSocial;
  periodoLabel.textContent = `${data.year} - ${data.month}`;
}

function generateOrderDOM() {
  const serie = new Date().getFullYear();
  const numero = Date.now();

  numeroOrdenLabel.textContent = `${String(serie).substring(1)}-${String(numero).substring(9)}`;
}

function openNotification(title, text, icon, timer) {
  Swal.fire({
    title,
    text,
    icon,
    timer,
    showConfirmButton: false,
  });
}

function showSpin(flag) {
  if (flag) spin.style.display = 'flex';
  else spin.style.display = 'none';
}
