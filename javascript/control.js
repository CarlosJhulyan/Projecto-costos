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
const buttonSave = document.getElementById('button-save');
const buttonClear = document.getElementById('button-clear');

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

const inicial = document.getElementById('inicial');
const compras = document.getElementById('compras');
const iFinal = document.getElementById('iFinal');
const cVentas = document.getElementById('cVentas');


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

const totalesPeps = {
  totalEntradas: 0,
  totalSalidas: 0,
  totalFinal: 0,
  inicial: 0
};

const totalesProm = {

}

const listaInventario = [];

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
    getDataControlInventario();
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

  buttonSave.addEventListener('click', saveListControl);
  buttonClear.addEventListener('click', clearTableInventario);
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
    insertInventarioToList(dataFormControl);
    showInputCostoUnitario(true);
    openNotification('Inventario', '¡Documento insertado en la tabla!', 'success');
    e.target.reset();
    clearDataRemuneraciones();
  } else {
    console.log('no paso');
  }
}

function saveListControl() {
  console.log(listaInventario);
  if (localStorage.getItem('id-control')) {
    showLoadingButtonSave(true);
    if (listaInventario.length !== 0)
      dataControlInventarioRef
        .doc(localStorage.getItem('id-control'))
        .set({ 
          lista: [...listaInventario]
        })
        .then(() => {
          showLoadingButtonSave(false);
          openNotification('Inventario', '¡Lista de control de inventario guardado!', 'success');
        })
        .catch(error => console.error(error));
    else {
      openNotification('Inventario', '¡La lista esta vacia!', 'warning');
      showLoadingButtonSave(false);
    }
    
  } else openNotification('Inventario', '¡Configurar la cabecera de planilla!', 'warning');
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
  else if (e.target.name === 'cantidad') {
    dataFormControl.cantidad = Number(e.target.value);
    dataFormControl.cantidadReal = Number(e.target.value);
  }
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

function getDataControlInventario() {
  const id = localStorage.getItem('id-control');
  dataControlInventarioRef.doc(id).get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      listaInventario.push(...data.lista);
      formatListToPeps();
    } else openNotification('Base de datos', '¡No se encontró la collección!', 'error');
  }).catch((error) => console.error(error));
}

function validateInputs(form) {
  const formData = form === 'form-insertar-control' ? dataFormControl : dataFormHeader;
  validateInputsDOM(form);
  const list = Object.entries(formData);
  return list.every(item => {
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
      // case 'numero':
      //   return item[1].trim() !== '';
      case 'cantidad':
        return item[1] > 0;
      case 'costoUnitario':
        return item[1] >= 0;
      default:
        return true;
    }
  })
}

function clearTableInventario(){
  clearTableControlDOM();
  listaInventario.splice(0, listaInventario.length);
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

function insertInventarioToList(item) {
  listaInventario.push({
    ...item
  });
  formatListToPeps();
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
            // console.log(values);
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

  // Calculo de totales
  
  totalesPeps.totalEntradas = listFormat.reduce((previusValue, current) => {
    const inicial = current.tipoOperacion === '16' &&
      current.tipoComprobante === '00' &&
      current.serie.length === 0 &&
      current.numero.length === 0 &&
      current.entradaSalida === 'entrada' ? false : true;

    if (current.entradaSalida === 'entrada' && inicial) return previusValue + current.total;
    return previusValue;
  }, 0);

  totalesPeps.totalSalidas = listFormat.reduce((previusValue, current) => {
    if (current.entradaSalida === 'salida') return previusValue + current.total;
    return previusValue;
  }, 0);

  totalesPeps.totalFinal = listFormat.reduce((previusValue, current) => {
    if (current.entradaSalida === 'entrada' && current.cantidad > 0) return previusValue + (current.cantidad * current.costoUnitario);
    return previusValue;
  }, 0);

  totalesPeps.inicial = listFormat[0]?.total;

  insertItemsDOM(listFormat);
}

function formatListToPromedio() {
  const flagLista = [...listaInventario];
  const listFormat = [];
  let itemsEntrada = [];
  // debugger;
  for (const item of listaInventario) {
    let totalCantidad = 0;
    let totalCosto = 0;
    let totalTotal = 0;
    let flag = true;

    if (flagLista[0].entradaSalida === 'entrada') {
      const cantidad = flagLista[0].cantidad;
      const precioUnitario = flagLista[0].costoUnitario;
      itemsEntrada.push({
        ...flagLista[0],
        total: cantidad * precioUnitario
      });
      // console.log(listFormat);
    } else {
      itemsEntrada.map(itemN => {
        if (itemN.entradaSalida === 'entrada' && flag) {
          totalCantidad += itemN.cantidad;
          totalCosto += itemN.costoUnitario;
          totalTotal += itemN.total;
          flag = true;
        } else {
          totalCantidad = 0;
          totalCosto = 0;
          flag = false;
        }
      })
      listFormat.push(...itemsEntrada);
      listFormat.push({
        total: totalTotal,
        cantidad: totalCantidad,
        costoUnitario: totalTotal / totalCantidad,
        entradaSalida: 'saldoFinal'
      });
      listFormat.push({
        ...item,
        costoUnitario: totalCosto,
        total: item.cantidad * totalCosto
      });
      listFormat.forEach(itemA => {
        if (itemA.entradaSalida === 'saldoFinal') {
          console.log(itemA);
        }
      })
      itemsEntrada = [];
      // console.log('-----------------------------');
      // console.log(itemsEntrada);
    }
    // console.log(totalCantidad, totalCosto);
    flagLista.splice(0,1);
  }

  insertItemsPromedioDOM(listFormat);
}

function roundNumber(value = 0) {
  const t = value.toString();
  const regex=/(\d*.\d{0,2})/;
  return t.match(regex)[0];
}

// DOM Funciones


function itemEndTableTotal() {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <th class="text-primary">TOTAL</th>
    <td></td>
    <td></td>
    <td class="text-info text-end">${totalesPeps.totalEntradas}</td>
    <td></td>
    <td></td>
    <td class="text-success text-end">${totalesPeps.totalSalidas}</td>
    <td></td>
    <td></td>
    <td class="text-warning text-end">${totalesPeps.totalFinal}</td>
  `;

  inicial.textContent = totalesPeps.inicial;
  compras.textContent = totalesPeps.totalEntradas;
  iFinal.textContent = totalesPeps.totalFinal;
  cVentas.textContent = totalesPeps.inicial + totalesPeps.totalEntradas - totalesPeps.totalFinal;

  return tr;
}



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
    // validateInputDOM(numero, numero.value.trim() === '');
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

  const inicial = tipoOperacion === '16' && tipoComprobante === '00' && serie.length === 0 && numero.length === 0 && entradaSalida === 'entrada' ? false : true;
  
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${fecha}</td>
    <td>${tipoComprobante}</td>
    <td>${serie}</td>
    <td>${numero}</td>
    <td>${tipoOperacion}</td>
    ${entradaSalida === 'entrada' ? `
      <td class="text-end">${inicial ? cantidadReal : ''}</td>
      <td class="text-end">${inicial ? costoUnitario : ''}</td>
      <td class="text-end">${inicial ? total : ''}</td>
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
  
  return tr;
}

function itemTableControlPromedioDOM(data) {
  const {
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
  if (entradaSalida === 'entrada') {
    tr.innerHTML = `
      <td>${fecha}</td>
      <td>${tipoComprobante}</td>
      <td>${serie}</td>
      <td>${numero}</td>
      <td>${tipoOperacion}</td>
      <td class="text-end">${cantidad}</td>
      <td class="text-end">${costoUnitario}</td>
      <td class="text-end">${total}</td>
      <td class="text-end"></td>
      <td class="text-end"></td>
      <td class="text-end"></td>
      <td class="text-end">${cantidad}</td>
      <td class="text-end">${costoUnitario}</td>
      <td class="text-end">${total}</td>
    `;
  } else if (entradaSalida === 'salida') {
    tr.innerHTML = `
      <td>${fecha}</td>
      <td>${tipoComprobante}</td>
      <td>${serie}</td>
      <td>${numero}</td>
      <td>${tipoOperacion}</td>
      <td class="text-end"></td>
      <td class="text-end"></td>
      <td class="text-end"></td>
      <td class="text-end">${cantidad}</td>
      <td class="text-end">${costoUnitario}</td>
      <td class="text-end">${total}</td>
      <td class="text-end">${cantidad}</td>
      <td class="text-end">${costoUnitario}</td>
      <td class="text-end">${total}</td>
    `;
  } else if (entradaSalida === 'saldoFinal') {
    tr.innerHTML = `
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td class="text-end text-warning">${cantidad}</td>
      <td class="text-end text-warning">${roundNumber(costoUnitario)}</td>
      <td class="text-end text-warning">${total}</td>
    `;
  }
  
  return tr;
}

function insertItemsDOM(lista) {
  clearTableControlDOM();
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
  tableContentControl.appendChild(itemEndTableTotal());
  showdButtonsActions(listaInventario.length === 0);
}

function insertItemsPromedioDOM(lista) {
  clearTableControlDOM();
  lista.map((item, key) => {
    tableContentControl.appendChild(itemTableControlPromedioDOM({
      ...item,
      key,
    }));
    lista[key] = {
      ...item,
      key,
    };
  });

  tableContentControl.appendChild(itemEndTableTotal());
}

function clearTableControlDOM() {
  tableContentControl.innerHTML = '';
  inicial.textContent = '-';
  compras.textContent = '-';
  iFinal.textContent = '-';
  cVentas.textContent = '-';
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