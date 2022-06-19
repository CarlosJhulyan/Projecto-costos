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

// DOM constantes
const tableContentPlanilla = document.getElementById('table-content-planilla');
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
const retencionAfp = document.getElementById('retencion-afp');
const tiposAfp = document.getElementById('tipos-afp');
const otros = document.getElementById('otros');

const razonSocialLabel = document.getElementById('razon-social-label');
const rucLabel = document.getElementById('ruc-label');
const periodoLabel = document.getElementById('periodo-label');
const buttonFetchHeader = document.getElementById('button-fetch-header');
const buttonSave = document.getElementById('button-save');
const buttonClear = document.getElementById('button-clear');
const buttonFormat = document.getElementById('button-format');

const cpmoLabel = document.getElementById('cpmo-label');
const cepttLabel = document.getElementById('ceptt-label');


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
  otros: 0,
  totalRem: 0,
  afp: '',
  snp: '',
  quinta: '',
  totalReten: 0,
  remunera: 0,
  essalud: 0,
  total: 0,
  retencion: 'snp',
  totalAport: 0,
  asignacionValue: 0,
  retencionAfp: 'prima',
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
  aportePrima:0,
  comisionPrima:0,
  primaPrima:0,

  aporteHabitad:0,
  comisionHabitad:0,
  primaHabitad:0,

  aporteIntegra:0,
  comisionIntegra:0,
  primaIntegra:0,

  aporteProfuturo:0,
  comisionProfuturo:0,
  primaProfuturo:0,
}

const totales = {
  totalSueldos: 0,
  totalAsigna: 0,
  totalOtros: 0,
  totalTotalRem: 0,
  totalAfp: 0,
  totalSnp: 0,
  totalRenta: 0,
  totalTotalReten: 0,
  totalRemuneraNeta: 0,
  totalEssalud: 0,
  totalAportacion: 0,
}

// App

document.addEventListener('DOMContentLoaded', App);

function App() {
  getDataConfigPlanilla();

  if (localStorage.getItem('id')) {
    getDataHeaderPlanilla();
    getDataRemuneracionPlanilla();
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
  retencionAfp.addEventListener('input', handleChangeInputRemuneracion);
  otros.addEventListener('input', handleChangeInputRemuneracion);

  buttonSave.addEventListener('click', saveListRemuneraciones);
  buttonClear.addEventListener('click', clearTableRemuneraciones);
  buttonFormat.addEventListener('click', formatPage);
}


// Funciones y procesos

function formatPage() {
  Swal.fire({
    title: '¿Quieres generar una nueva plantilla?',
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: 'Yes',
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('id');
      window.location.reload();
    }
  });
}

function handleChangeInputHeader(e) {
  validateInputsDOM(formHeaderPlanilla.id);
  dataFormHeader[e.target.name] = e.target.value;
}

function handleChangeInputRemuneracion(e) {
  validateInputsDOM(formInsertarPlanilla.id);
  if (e.target.name === 'fecha')
    dataFormRemuneracion.fecha = moment(e.target.value, 'yyyy-MM-DD').format('DD-MM-yyyy')
  else if (e.target.name === 'sueldo')
    dataFormRemuneracion.sueldo = Number(e.target.value);
  else if (e.target.name === 'otros')
    dataFormRemuneracion.otros = Number(e.target.value);
  else if (e.target.name === 'retencion') {
    dataFormRemuneracion.retencion = e.target.value;
    showInputRetencionAfp(e.target.name === 'retencion' && e.target.value === "afp");
  } 
  else dataFormRemuneracion[e.target.name] = e.target.value;
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
          setPlanillaDescriptionDOM(dataFormHeader);
          openNotification('Encabezado', '¡Encabezado actualizado!', 'success');
          e.target.reset();
        })
        .catch(error => console.error(error));
    else
      headerPlanillaRef
        .doc(id)
        .set(dataFormHeader)
        .then(() => {
          setPlanillaDescriptionDOM(dataFormHeader);

          remuneracionesPlanillaRef
          .doc(id)
          .set({
            lista: [],
            totales
          })
          .then(() => {
            showLoadingButtonHeader(false);
            openNotification('Encabezado', '¡Encabezado guardado!', 'success');
            localStorage.setItem('id', id);
            e.target.reset();
          })
          .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
  }
}

function handleSubmitRemuneracionPlanilla(e) {
  e.preventDefault();
  if (validateInputs(formInsertarPlanilla.id)) {
    insertRemuneracionToList();
    insertTotalesToList();
    insertItemsDOM();
    clearDataRemuneraciones();
    openNotification('Remuneración', '¡Remuneración insertado en la tabla!', 'success');
    e.target.reset();
    showInputRetencionAfp(false);
  }
}

function saveListRemuneraciones() {
  if (localStorage.getItem('id')) {
    showLoadingButtonSave(true);
    if (listaRemuneraciones.length !== 0)
      remuneracionesPlanillaRef
        .doc(localStorage.getItem('id'))
        .set({ 
          lista: listaRemuneraciones,
          totales
        })
        .then(() => {
          showLoadingButtonSave(false);
          openNotification('Remuneración', '¡Lista de remuneraciones guardado!', 'success');
        })
        .catch(error => console.error(error));
    else openNotification('Remuneración', '¡La lista esta vacia!', 'warning');
  } else openNotification('Remuneración', '¡Configurar la cabecera de planilla!', 'warning');
}

function insertRemuneracionToList() {
  const asignacion = dataFormRemuneracion.asignacion;
  const sueldo = dataFormRemuneracion.sueldo;
  const asignacionValue = getAsignacionFamiliar(asignacion);
  const totalRem = getTotalRem(sueldo, asignacionValue, dataFormRemuneracion.otros);
  const snp = getRetenciones(totalRem, "snp", retencion.value, retencionAfp.value);
  const afp = getRetenciones(totalRem, "afp", retencion.value, retencionAfp.value);
  const quinta = getRetenciones(totalRem, "renta", retencion.value, retencionAfp.value);
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

function insertTotalesToList() {
  totales.totalSueldos = getTotalColumn('sueldo');
  totales.totalAsigna = getTotalColumn('asignacionValue');
  totales.totalOtros = getTotalColumn('otros');
  totales.totalTotalRem = getTotalColumn('totalRem');
  totales.totalAfp = getTotalColumn('afp');
  totales.totalSnp = getTotalColumn('snp');
  totales.totalRenta = getTotalColumn('quinta');
  totales.totalTotalReten = getTotalColumn('totalReten');
  totales.totalRemuneraNeta = getTotalColumn('remunera');
  totales.totalEssalud = getTotalColumn('essalud');
  totales.totalAportacion = getTotalColumn('totalAport');
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
  dataFormRemuneracion.nombres = '';
  dataFormRemuneracion.apellidos = '';
  dataFormRemuneracion.dni = '';
  dataFormRemuneracion.cargo = '';
  dataFormRemuneracion.asignacion = 'si';
  dataFormRemuneracion.retencion = 'snp';
  dataFormRemuneracion.retencionAfp = 'prima';
}

function clearTableRemuneraciones(){
  clearTableRemuneracionesDOM();
  listaRemuneraciones.splice(0, listaRemuneraciones.length);
}

function clearItemList(index) {
  listaRemuneraciones.splice(index, 1);
  insertItemsDOM();
}

function chargeDataConfig(data) {
  dataConfig.rmv = data.rmv;
  dataConfig.essalud = data.essalud / 100;
  dataConfig.aFamiliar = data.familiar / 100;
  dataConfig.aporteONP = data.aporteONP / 100;

  dataConfig.aportePrima=data.aportePrima/100;
  dataConfig.comisionPrima=data.comisionPrima/100;
  dataConfig.primaPrima=data.primaPrima/100;

  dataConfig.aporteIntegra=data.aporteIntegra/100;
  dataConfig.comisionIntegra=data.comisionIntegra/100;
  dataConfig.primaIntegra=data.primaIntegra/100;

  dataConfig.aporteHabitad=data.aporteHabitad/100;
  dataConfig.comisionHabitad=data.comisionHabitad/100;
  dataConfig.primaHabitad=data.primaHabitad/100;

  dataConfig.aporteProfuturo=data.aporteProfuturo/100;
  dataConfig.comisionProfuturo=data.comisionProfuturo/100;
  dataConfig.primaProfuturo=data.primaProfuturo/100;
}


// Funnciones para cálculos 

function getAsignacionFamiliar(asigFamiliar) {
  return asigFamiliar === "si" ? dataConfig.rmv * dataConfig.aFamiliar : 0;
}

function getTotalRem(sueldo, asigFamiliar,otros){
  return Number(sueldo) + Number(asigFamiliar)+Number(otros);
}

function getRetenciones(totalRemuneracion, tipo, tipoRetencion, tipoAFP) {
  if (tipoRetencion === "snp" && tipo === "snp")
    return totalRemuneracion * dataConfig.aporteONP;
  else if (tipoRetencion === "afp" && tipo === "afp") {
    if (tipoAFP === "prima")
      return (dataConfig.aportePrima+dataConfig.comisionPrima+dataConfig.primaPrima)*totalRemuneracion;
    else if (tipoAFP === "habitad")
      return (dataConfig.aporteHabitad+dataConfig.comisionHabitad+dataConfig.primaHabitad)*totalRemuneracion;
    else if (tipoAFP === "integra")
      return (dataConfig.aporteIntegra+dataConfig.comisionIntegra+dataConfig.primaIntegra)*totalRemuneracion;
    else if (tipoAFP === "profuturo")
      return (dataConfig.aporteProfuturo+dataConfig.comisionProfuturo+dataConfig.primaProfuturo)*totalRemuneracion;
  } else if (tipoRetencion === "renta" && tipo === "renta") {
    return 1000;
  } else {
    return 0;
  }
}

function roundNumber(value = 0) {
  const t = value.toString();
  const regex=/(\d*.\d{0,2})/;
  return t.match(regex)[0];
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

function getTotalColumn(type) {
  const t = listaRemuneraciones.reduce((current, item) => {
    const entries = Object.entries(item);
    const total = entries.reduce((currentValue, value) => {
      if (value[0] === type) return currentValue + Number(value[1]);
      return currentValue;
    }, 0);
    return current + total;
  }, 0);
  return t;
}


// DOM Funciones

function insertItemsDOM() {
  clearTableRemuneracionesDOM();
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
  tableContentPlanilla.appendChild(itemEndTableTotal());
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
    otros,
  } = data;
  
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${key + 1}</td>
    <td>${nombres}</td>
    <td>${apellidos}</td>
    <td>${dni}</td>
    <td>${fecha}</td>
    <td>${cargo}</td>
    <td class="text-end">${sueldo}</td>
    <td class="text-end">${roundNumber(asignacionValue)}</td>
    <td class="text-end">${otros}</td>
    <td class="text-end">${roundNumber(totalRem)}</td>
    <td class="text-end">${roundNumber(afp)}</td>
    <td class="text-end">${roundNumber(snp)}</td>
    <td class="text-end">${roundNumber(quinta)}</td>
    <td class="text-end">${roundNumber(totalReten)}</td>
    <td class="text-end">${roundNumber(remunera)}</td>
    <td class="text-end">${roundNumber(essalud)}</td>
    <td class="text-end">${roundNumber(totalAport)}</td>
  `;

  const button = document.createElement('button');
  const td = document.createElement('td');

  td.classList.add('text-center');
  button.classList.add('btn', 'btn-danger', 'btn-sm');
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
      <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
    </svg>
  `;
  button.onclick = () => clearItemList(key);

  td.appendChild(button);
  tr.appendChild(td);
  return tr;
}

function itemEndTableTotal() {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <th class="text-primary">TOTAL</th>
    <td class="text-end">${roundNumber(totales.totalSueldos)}</td>
    <td class="text-end">${roundNumber(totales.totalAsigna)}</td>
    <td class="text-end">${roundNumber(totales.totalOtros)}</td>
    <td class="text-success text-end">${roundNumber(totales.totalTotalRem)}</td>
    <td class="text-end">${roundNumber(totales.totalAfp)}</td>
    <td class="text-end">${roundNumber(totales.totalSnp)}</td>
    <td class="text-end">${roundNumber(totales.totalRenta)}</td>
    <td class="text-end">${roundNumber(totales.totalTotalReten)}</td>
    <td class="text-warning text-end">${roundNumber(totales.totalRemuneraNeta)}</td>
    <td class="text-end">${roundNumber(totales.totalEssalud)}</td>
    <td class="text-success text-end">${roundNumber(totales.totalAportacion)}</td>
    <td></td>
  `;

  cpmoLabel.textContent = "S/. "+roundNumber(totales.totalTotalRem + totales.totalAportacion);
  cepttLabel.textContent = "S/. "+roundNumber(totales.totalRemuneraNeta);

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

function clearTableRemuneracionesDOM() {
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

function openNotification(title, text, icon) {
  Swal.fire({
    title,
    text,
    icon,
    timer: 1500,
    showConfirmButton: false,
  });
}

function showInputRetencionAfp(flag) {
  if (flag) tiposAfp.removeAttribute('hidden');
  else tiposAfp.setAttribute('hidden', '');
}

function setPlanillaDescriptionDOM(data) {
  razonSocialLabel.textContent = data.razonSocial;
  rucLabel.textContent = data.ruc;
  periodoLabel.textContent = data.year;
}