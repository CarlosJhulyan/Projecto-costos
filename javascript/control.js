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
const configPlanillaRef = db.collection('dataConfigPlanilla').doc('N9cuT6iVfjBtwsxpnVuV');
const tableTipoRef = db.collection('dataConfigInventario').doc('SMi0qrSk9X5uHffEzID3');
const tableCodigoUnidadMedidaRef = db.collection('dataConfigInventario').doc('fAxRkJxHko6jkRqPK21K');
const tableTipoComprobanteRef = db.collection('dataConfigInventario').doc('XtPcykYChRmholGjVdQR');
const tableTipoOperacionRef = db.collection('dataConfigInventario').doc('iAmQMe7pEIufGcK7z8TI');
const dataControlInventarioRef = db.collection('dataControlInventario');
const dataHeaderInventarioRef = db.collection('dataHeaderInventario');

// DOM Constantes input Switch PEPS/PROMEDIO
const evaluacionSwitch = document.getElementById('evaluacion-switch');
const evaluacionSwitchLabel = document.getElementById('evaluacion-switch-label');
const spin = document.getElementById('spin');

// DOM constantes inputs encabezado
const razonSocial = document.getElementById('razon-social');
const ruc = document.getElementById('ruc');
const establecimiento = document.getElementById('Establecimiento');
const codigoExistencia = document.getElementById('codigo-existencia');
const tipo = document.getElementById('tipo');
const codigoMedida = document.getElementById('codigo-medida');
const descripcion = document.getElementById('descripcion');
const month = document.getElementById('month');
const year = document.getElementById('year');

//DOM Constantes inputs insertar
const fecha = document.getElementById('fecha');
const tipoComprobante = document.getElementById('tipo-comprobante');
const serie = document.getElementById('serie');
const numero = document.getElementById('numero');
const tipoOperacion = document.getElementById('tipo-operacion');
const entrada = document.getElementById('entrada');
const salida = document.getElementById('salida');
const cantidad = document.getElementById('cantidad');
const costoUnitario = document.getElementById('costo-unitario');
const costoUnitarioContent = document.getElementById('costo-unitario-content');

const formHeaderControl = document.getElementById('form-header-control');
const formInsertarControl = document.getElementById('form-insertar-control');


const periodoLabel = document.getElementById('periodo-label');
const rucLabel = document.getElementById('ruc-label');
const razonSocialLabel = document.getElementById('razon-social-label');
const establecimientoLabel = document.getElementById('establecimiento-label');
const codigoExistenciaLabel = document.getElementById('codigo-existencia-label');
const tipoTablaLabel = document.getElementById('tipo-tabla-label');
const descripcionlabel = document.getElementById('descripcion-label');
const codigoUnidadMedidaLabel = document.getElementById('codigo-unidad-medida-label');
const evaluacionLabel = document.getElementById('evaluacion-label');

const buttonFetchHeader = document.getElementById('button-fetch-header');
const tableContentControl = document.getElementById('table-content-control');


// Constantes y variables
const dataFormControl = {
  fecha: '',
  tipoComprobante: '01',
  serie: '',
  numero: '',
  tipoOperacion: '01',
  entradaSalida: 'entrada',
  cantidad: 0,
  costoUnitario: 90,
}

const dataFormHeader = {
  razonSocial: '',
  ruc: '',
  establecimiento: '',
  codigoExistencia: '',
  tipo:'01',
  codigoMedida: '01',
  descripcion: '',
  month: '01',
  year: '2022',
};


const listaInventario = [
  {
    fecha: '11/05/2022',
    tipoComprobante: '01',
    serie: '001',
    numero: '84738',
    tipoOperacion: '02',
    entradaSalida: 'entrada',
    cantidad: 4,
    cantidadReal: 4,
    costoUnitario: 40,
  },
  {
    fecha: '11/05/2022',
    tipoComprobante: '01',
    serie: '001',
    numero: '84739',
    tipoOperacion: '02',
    entradaSalida: 'entrada',
    cantidad: 10,
    cantidadReal: 10,
    costoUnitario: 42,
  },
  {
    fecha: '11/05/2022',
    tipoComprobante: '01',
    serie: '',
    numero: '00343',
    tipoOperacion: '01',
    entradaSalida: 'salida',
    cantidad: 12,
    cantidadReal: 12
  },
  {
    fecha: '11/05/2022',
    tipoComprobante: '01',
    serie: '001',
    numero: '84740',
    tipoOperacion: '02',
    entradaSalida: 'entrada',
    cantidad: 20,
    cantidadReal: 20,
    costoUnitario: 41
  },
  
  {
    fecha: '11/05/2022',
    tipoComprobante: '01',
    serie: '',
    numero: '00344',
    tipoOperacion: '01',
    entradaSalida: 'salida',
    cantidad: 9,
    cantidadReal: 9
  },
  {
    fecha: '11/05/2022',
    tipoComprobante: '01',
    serie: '',
    numero: '00344',
    tipoOperacion: '01',
    entradaSalida: 'salida',
    cantidad: 5,
    cantidadReal: 5
  },
  {
    fecha: '11/05/2022',
    tipoComprobante: '01',
    serie: '001',
    numero: '345234',
    tipoOperacion: '02',
    entradaSalida: 'entrada',
    cantidad: 10,
    cantidadReal: 10,
    costoUnitario: 43
  },
];

// const listaInventario = [
//   {
//     fecha: '11/05/2022',
//     tipoComprobante: '01',
//     serie: '001',
//     numero: '84738',
//     tipoOperacion: '02',
//     entradaSalida: 'entrada',
//     cantidad: 80,
//     costoUnitario: 90,
//   },
//   {
//     fecha: '11/05/2022',
//     tipoComprobante: '01',
//     serie: '001',
//     numero: '84739',
//     tipoOperacion: '02',
//     entradaSalida: 'entrada',
//     cantidad: 50,
//     costoUnitario: 87,
//   },
//   {
//     fecha: '11/05/2022',
//     tipoComprobante: '01',
//     serie: '',
//     numero: '00343',
//     tipoOperacion: '01',
//     entradaSalida: 'entrada',
//     cantidad: 70,
//     costoUnitario: 85,

//   },
//   {
//     fecha: '11/05/2022',
//     tipoComprobante: '01',
//     serie: '001',
//     numero: '84740',
//     tipoOperacion: '02',
//     entradaSalida: 'salida',
//     cantidad: 70,
//   },
  
//   {
//     fecha: '11/05/2022',
//     tipoComprobante: '01',
//     serie: '',
//     numero: '00344',
//     tipoOperacion: '01',
//     entradaSalida: 'salida',
//     cantidad: 40,
//   },
//   {
//     fecha: '11/05/2022',
//     tipoComprobante: '01',
//     serie: '',
//     numero: '00344',
//     tipoOperacion: '01',
//     entradaSalida: 'salida',
//     cantidad: 10,
//   },
//   {
//     fecha: '11/05/2022',
//     tipoComprobante: '01',
//     serie: '001',
//     numero: '345234',
//     tipoOperacion: '02',
//     entradaSalida: 'salida',
//     cantidad: 15,
//   },
//   {
//     fecha: '11/05/2022',
//     tipoComprobante: '01',
//     serie: '',
//     numero: '00344',
//     tipoOperacion: '01',
//     entradaSalida: 'entrada',
//     cantidad: 100,
//     costoUnitario: 95,
//   },
//   {
//     fecha: '11/05/2022',
//     tipoComprobante: '01',
//     serie: '001',
//     numero: '345234',
//     tipoOperacion: '02',
//     entradaSalida: 'salida',
//     cantidad: 60,
//   },
//   {
//     fecha: '11/05/2022',
//     tipoComprobante: '01',
//     serie: '',
//     numero: '00344',
//     tipoOperacion: '01',
//     entradaSalida: 'salida',
//     cantidad: 10,
//   },
//   {
//     fecha: '11/05/2022',
//     tipoComprobante: '01',
//     serie: '',
//     numero: '00344',
//     tipoOperacion: '01',
//     entradaSalida: 'entrada',
//     cantidad: 100,
//     costoUnitario: 98,
//   }
// ];

let tipoOptions = {};
let medidaOptions = {};

// App
document.addEventListener('DOMContentLoaded', App);

function App() {
  getTableTipo();
  getTableUnidadesMedida();
  getTableTipoComprobante();
  getTableTipoOperacion();

  formatListToPeps();

  if (localStorage.getItem('id-control')) {
    getDataHeaderControl();
    buttonFetchHeader.textContent = 'Actualizar';
  }

  evaluacionSwitch.addEventListener('change', handleChangeTipoEvaluacionDOM);
  formHeaderControl.addEventListener('submit', handleSubmitHeaderControl);
  formInsertarControl.addEventListener('submit', handleSubmitInsertarControl);

  razonSocial.addEventListener('input', handleChangeInputHeader);
  ruc.addEventListener('input', handleChangeInputHeader);
  establecimiento.addEventListener('input', handleChangeInputHeader);
  codigoExistencia.addEventListener('input', handleChangeInputHeader);
  tipo.addEventListener('input', handleChangeInputHeader);
  codigoMedida.addEventListener('input', handleChangeInputHeader);
  descripcion.addEventListener('input',handleChangeInputHeader);
  month.addEventListener('input', handleChangeInputHeader);
  year.addEventListener('input', handleChangeInputHeader);

  fecha.addEventListener('input', handleChangeInputInventoryControl);
  tipoComprobante.addEventListener('input', handleChangeInputInventoryControl);
  serie.addEventListener('input', handleChangeInputInventoryControl);
  numero.addEventListener('input', handleChangeInputInventoryControl);
  tipoOperacion.addEventListener('input', handleChangeInputInventoryControl);
  entrada.addEventListener('input', handleChangeInputInventoryControl);
  salida.addEventListener('input', handleChangeInputInventoryControl);
  cantidad.addEventListener('input', handleChangeInputInventoryControl);
  costoUnitario.addEventListener('input', handleChangeInputInventoryControl);
}


// Funciones y procesos

function handleSubmitHeaderControl(e) {
  e.preventDefault();
  const id = uuid.v4();
  if (validateInputs(formHeaderControl.id)) {
    showLoadingButtonHeader(true);
    if (localStorage.getItem('id-control'))
      dataHeaderInventarioRef
        .doc(localStorage.getItem('id-control'))
        .set(dataFormHeader)
        .then(() => {
          setControlDescriptionDOM(dataFormHeader);
          openNotification('Encabezado', '¡Encabezado actualizado!', 'success');
          e.target.reset();
          clearDataFormHeader();
          showLoadingButtonHeader(false);
        })
        .catch(e => console.error(e));
    else
      dataHeaderInventarioRef
      .doc(id)
      .set(dataFormHeader)
      .then(() => {
        setControlDescriptionDOM(dataFormHeader);

        dataControlInventarioRef
          .doc(id)
          .set({
            lista: []
          })
          .then(() => {
            openNotification('Encabezado', '¡Encabezado guardado!', 'success');
            localStorage.setItem('id-control', id);
            e.target.reset();
            clearDataFormHeader();
            showLoadingButtonHeader(false);
          })
          .catch(error => console.error(error));
      })
      .catch(e => console.error(e));
  } 
}

function handleSubmitInsertarControl(e) {
  e.preventDefault();
  
  if (validateInputs(formInsertarControl.id)) {
    insertInventarioToList();
    clearDataRemuneraciones();
    showInputCostoUnitario(true);
    e.target.reset();
  } else {
    console.log('no paso');
  }
}

function handleChangeInputHeader(e) {
  validateInputsDOM(formHeaderControl.id);
  dataFormHeader[e.target.name] = e.target.value;
}

function handleChangeInputInventoryControl(e) {
  validateInputsDOM(formInsertarControl.id);
  if (e.target.name === 'fecha')
    dataFormControl.fecha = moment(e.target.value, 'yyyy-MM-DD').format('DD-MM-yyyy');
  else if (e.target.name === 'entradaSalida') {
    dataFormControl.entradaSalida = e.target.value;
    showInputCostoUnitario(e.target.value === 'entrada');
  }
  else if (e.target.name === 'cantidad')
    dataFormControl.cantidad = Number(e.target.value);
  else if (e.target.name === 'costoUnitario')
    dataFormControl.costoUnitario = Number(e.target.value);
  else dataFormControl[e.target.name] = e.target.value;
}

function getTableTipo() {
  tableTipoRef.get()
    .then(doc => {
      const data = doc.data()
      insertItemtoSelectTipoDOM(data);
      tipoOptions = data;
    })
    .catch(error => console.error(error));
}

function getTableUnidadesMedida() {
  showSpin(true);
  tableCodigoUnidadMedidaRef.get()
    .then(doc => {
      const data = doc.data();
      insertItemtoSelectMedidaDOM(data);
      medidaOptions = data;
      showSpin(false);
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
  configPlanillaRef.get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      chargeDataConfig(data);
    } else openNotification('Base de datos', '¡No se encontró la collección!', 'error');
  }).catch((error) => console.error(error));
}

function getDataHeaderControl() {
  const id = localStorage.getItem('id-control');
  dataHeaderInventarioRef.doc(id).get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      setControlDescriptionDOM(data);
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

function validateInputs(form) {
  const formData = form === 'form-insertar-control' ? dataFormControl : dataFormHeader;
  validateInputsDOM(form);
  const list = Object.entries(formData);
  return list.every(item => {
    console.log(item[0], item[1]);
    switch (item[0]) {
      
      case 'razonSocial':
        return item[1].trim() !== '';
      case 'ruc':
        return item[1].length === 11;
      case 'establecimiento':
        return item[1].length <= 7 || item[1].length > 0;
      case 'codigoExistencia':
        return item[1].length <= 7 || item[1].length > 0;
      case 'descripcion':
          return item[1].trim() !== '';
      case 'codigoExistencia':
        return item[1].trim() !== '';
      case 'fecha':
        return item[1].trim() !== '';
      case 'numero':
        return item[1].trim() !== '';
      case 'cantidad':
        return item[1] > 0;
      case 'costoUnitario':
        return item[1] >= 0;
      default:
        return true;
    }
  })
}


function clearDataFormHeader() {
  dataFormHeader.razonSocial = '';
  dataFormHeader.ruc = '';
  dataFormHeader.establecimiento = '';
  dataFormHeader.codigoExistencia = '';
  dataFormHeader.tipo = '';
  dataFormHeader.codigoMedida = '';
  dataFormHeader.descripcion = '';
  dataFormHeader.month = '01';
  dataFormHeader.year = '2022';
}

function clearDataRemuneraciones(){
  dataFormControl.fecha = '',
  dataFormControl.tipoComprobante = '',
  dataFormControl.serie = '',
  dataFormControl.numero = '',
  dataFormControl.tipoOperacion = '',
  dataFormControl.entradaSalida = 'entrada',
  dataFormControl.cantidad = 0,
  dataFormControl.costoUnitario = 0;
}

function insertInventarioToList() {  
  listaInventario.push({
    ...dataFormControl
  });
}

function formatListToPeps() {
  const flagLista = [...listaInventario];
  const listFormat = [];
  
  for (const item of listaInventario) {
    let itemB;
    let itemA;
    let itemN = flagLista[0].cantidad;
    let item1;
    let flag = true;

    if (flagLista[0].entradaSalida === 'entrada') {
      const cantidad = flagLista[0].cantidad;
      const precioUnitario = flagLista[0].costoUnitario;
      listFormat.push({
        ...flagLista[0],
        total: cantidad * precioUnitario
      })
    } else {
      const listaSalidas = []
      item1 = listFormat[0].cantidad;
      
      listFormat.forEach((values, index) => {
        if (values.entradaSalida === 'entrada' && values.cantidad > 0 && flag) {
          if (itemN > values.cantidad) {
            itemB = itemN - values.cantidad;
            itemA = values.cantidad;
            item1 = 0;
            itemN = itemB;
            listFormat[index].cantidad = 0;
            listaSalidas.push({
              ...item,
              cantidad: itemA,
              costoUnitario: values.costoUnitario,
              total: itemA * values.costoUnitario
            });
            flag = true;
          } else {
            itemB = values.cantidad - itemN;
            itemA = itemN;
            itemN = itemB;
            item1 = itemB;
            listFormat[index].cantidad = item1;
            listaSalidas.push({
              ...item,
              cantidad: itemA,
              costoUnitario: values.costoUnitario,
              total: itemA * values.costoUnitario
            });
            flag = false;
          }
        }
      })
      listFormat.push(...listaSalidas);
    }

    flagLista.splice(0, 1)
  }
  insertItemsDOM(listFormat);
}

function formatListToPromedio() {
  const listaFormat = [];
  insertItemsDOM(listaFormat);
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
  if (e.target.checked) {
    evaluacionSwitchLabel.textContent = 'PROM';
    formatListToPromedio();
  } else {
    evaluacionSwitchLabel.textContent = 'PEPS';
    formatListToPeps();
  }
}

function validateInputsDOM(form) {
  if (form === 'form-header-control') {
    validateInputDOM(razonSocial, razonSocial.value.trim() === '');
    validateInputDOM(ruc, ruc.value.length !== 11);
    validateInputDOM(establecimiento, establecimiento.value.length >= 7 || establecimiento.value.length <= 0);
    validateInputDOM(codigoExistencia, codigoExistencia.value.length >= 7 || codigoExistencia.value.length <=0);
    validateInputDOM(descripcion, descripcion.value.trim() === '');
  } else {
    validateInputDOM(fecha, fecha.value.trim() === '');
    validateInputDOM(numero, numero.value.trim() === '');
    validateInputDOM(cantidad, Number(cantidad.value) <= 0);
    validateInputDOM(costoUnitario, Number(costoUnitario.value) <= 0 && costoUnitario.value.trim() !== '');
  }
}

function showSpin(flag) {
  if (flag) spin.style.display = 'flex';
  else spin.style.display = 'none';
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

function openNotification(title, text, icon) {
  Swal.fire({
    title,
    text,
    icon,
    timer: 1500,
    showConfirmButton: false,
  });
}

function setControlDescriptionDOM(data) {
  periodoLabel.textContent = `${data.month}-${data.year}`;
  rucLabel.textContent = data.ruc;
  razonSocialLabel.textContent = data.razonSocial;
  establecimientoLabel.textContent =  data.establecimiento;
  codigoExistenciaLabel.textContent = data.codigoExistencia;
  tipoTablaLabel.textContent = Object.entries(tipoOptions).find(item => {
    return item[0] === data.tipo;
  })[1];
  descripcionlabel.textContent = data.descripcion;
  codigoUnidadMedidaLabel.textContent = Object.entries(medidaOptions).find(item => {
    return item[0] === data.codigoMedida;
  })[1];
  // evaluacionLabel.textContent = evaluacionSwitchLabel.textContent;
}

function showLoadingButtonHeader(flag) {
  if (flag) buttonFetchHeader.innerHTML = `
    <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    Cargando...
  `;
  else buttonFetchHeader.textContent = 'Actualizar';
}


function showInputCostoUnitario(flag) {
  if (flag) costoUnitarioContent.removeAttribute('hidden');
  else costoUnitarioContent.setAttribute('hidden', '');
}

function itemTableControlDOM(data) {
  const {
    key,
    fecha,
    tipoComprobante,
    serie,
    numero,
    tipoOperacion,
    entradaSalida,
    cantidad,
    costoUnitario,
    total,
    cantidadReal
  } = data;
  
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${fecha}</td>
    <td>${tipoComprobante}</td>
    <td>${serie}</td>
    <td>${numero}</td>
    <td>${tipoOperacion}</td>
    ${entradaSalida === 'entrada' ? `
      <td class="text-end">${cantidadReal}</td>
      <td class="text-end">${costoUnitario}</td>
      <td class="text-end">${total}</td>
      <td class="text-end"></td>
      <td class="text-end"></td>
      <td class="text-end"></td>
    ` : `
      <td class="text-end"></td>
      <td class="text-end"></td>
      <td class="text-end"></td>
      <td class="text-end">${cantidad}</td>
      <td class="text-end">${costoUnitario}</td>
      <td class="text-end">${total}</td>
    `}
    ${entradaSalida === 'entrada' ? 
      `<td class="text-end">${cantidadReal}</td>` : 
      `<td class="text-end">${cantidad}</td>`}
    <td class="text-end">${costoUnitario}</td>
    <td class="text-end">${total}</td>
  `;

  // const button = document.createElement('button');
  // const td = document.createElement('td');

  // td.classList.add('text-center');
  // button.classList.add('btn', 'btn-danger', 'btn-sm');
  // button.innerHTML = `
  //   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  //     <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
  //     <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  //   </svg>
  // `;
  // button.onclick = () => clearItemList(key);

  // td.appendChild(button);
  // tr.appendChild(td);

  
  return tr;
}

function insertItemsDOM(lista) {
  clearTableControlDOM();
  console.log(lista);
  lista.map((item, key) => {
    tableContentControl.appendChild(itemTableControlDOM({
      ...item,
      key,
    }));
    lista[key] = {
      ...item,
      key,
    };
  });
  // showdButtonsActions(listaRemuneraciones.length === 0);
}

function clearTableControlDOM() {
  tableContentControl.innerHTML = '';
}