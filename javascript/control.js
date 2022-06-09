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
const tableTipoRef = db.collection('dataConfigInventario').doc('SMi0qrSk9X5uHffEzID3');
const tableCodigoUnidadMedidaRef = db.collection('dataConfigInventario').doc('fAxRkJxHko6jkRqPK21K');
const tableTipoComprobanteRef = db.collection('dataConfigInventario').doc('XtPcykYChRmholGjVdQR');
const tableTipoOperacionRef = db.collection('dataConfigInventario').doc('iAmQMe7pEIufGcK7z8TI');

// DOM Constantes
const tipo = document.getElementById('tipo');
const codigoMedida = document.getElementById('codigo-medida');
const evaluacionSwitch = document.getElementById('evaluacion-switch');
const evaluacionSwitchLabel = document.getElementById('evaluacion-switch-label');
const tipoComprobante = document.getElementById('tipo-comprobante');
const tipoOperacion = document.getElementById('tipo-operacion');

// Constantes y variables


// App
document.addEventListener('DOMContentLoaded', App);

function App() {
  getTableTipo();
  getTableUnidadesMedida();
  getTableTipoComprobante();
  getTableTipoOperacion();

  if (localStorage.getItem('id')) {
  }

  evaluacionSwitch.addEventListener('change', handleChangeTipoEvaluacionDOM);
}


// Funciones y procesos

function getTableTipo() {
  tableTipoRef.get()
    .then(doc => {
      const data = doc.data()
      insertItemtoSelectTipoDOM(data);
    })
    .catch(error => console.error(error));
}

function getTableUnidadesMedida() {
  tableCodigoUnidadMedidaRef.get()
    .then(doc => {
      const data = doc.data();
      insertItemtoSelectMedidaDOM(data);
    })
    .catch(error => console.error(error));
}

function getTableTipoComprobante() {
  tableTipoComprobanteRef.get()
    .then(doc => {
      const data = doc.data();
      insertItemtoSelectTipoCompDOM(data);
    })
    .catch(error => console.error(error));
}

function getTableTipoOperacion() {
  tableTipoOperacionRef.get()
    .then(doc => {
      const data = doc.data();
      insertItemtoSelectTipoOperDOM(data);
    })
    .catch(error => console.error(error));
}

function getDataConfigPlanilla() {
  showSpin(true);
  configPlanillaRef.get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      chargeDataConfig(data);
    } else openNotification('Base de datos', '¡No se encontró la collección!', 'error');
    showSpin(false);
  }).catch((error) => console.error(error));
}

function getDataHeaderPlanilla() {
  const id = localStorage.getItem('id');
  headerPlanillaRef.doc(id).get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      setPlanillaDescriptionDOM(data);
    } else openNotification('Base de datos', '¡No se encontró la collección!', 'error');
  }).catch((error) => console.error(error));
}

function getDataRemuneracionPlanilla() {
  const id = localStorage.getItem('id');
  remuneracionesPlanillaRef.doc(id).get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      listaRemuneraciones.push(...data.lista);
      insertTotalesToList();
      insertItemsDOM();
    } else openNotification('Base de datos', '¡No se encontró la collección!', 'error');
  }).catch((error) => console.error(error));
}


// DOM Funciones

function insertItemtoSelectTipoDOM(data) {
  Object.entries(data).map(item => {
    const option = document.createElement('option');
    if (item[0] === '01') option.selected = 'selected';
    option.value = item[0];
    option.textContent = item[1];
    tipo.prepend(option);
  });
}

function insertItemtoSelectMedidaDOM(data) {
  Object.entries(data).map(item => {
    const option = document.createElement('option');
    if (item[0] === '01') option.selected = 'selected';
    option.value = item[0];
    option.textContent = item[1];
    codigoMedida.prepend(option);
  });
}

function insertItemtoSelectTipoOperDOM(data) {
  Object.entries(data).map(item => {
    const option = document.createElement('option');
    if (item[0] === '01') option.selected = 'selected';
    option.value = item[0];
    option.textContent = `${item[0]} ${item[1]}`;
    tipoOperacion.prepend(option);
  });
}

function insertItemtoSelectTipoCompDOM(data) {
  Object.entries(data).map(item => {
    const option = document.createElement('option');
    if (item[0] === '01') option.selected = 'selected';
    option.value = item[0];
    if (item[1].length < 45) option.textContent = `${item[0]} ${item[1]}`;
    else option.textContent = `${item[0]} ${item[1].substring(0, 45)}...`;
    tipoComprobante.prepend(option);
  });
}

function handleChangeTipoEvaluacionDOM(e) {
  if (e.target.checked) evaluacionSwitchLabel.textContent = 'PROM';
  else evaluacionSwitchLabel.textContent = 'PEPS';
}