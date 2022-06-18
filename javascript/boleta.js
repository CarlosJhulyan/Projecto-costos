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
const workers = document.getElementById('workers');

const spin = document.getElementById('spin');

const tipoLabel = document.getElementById('tipo-label');
const numeroLabel = document.getElementById('numero-label');
const nombreApellidoLabel = document.getElementById('nombre-apellido-label');
const situacionLavel = document.getElementById('situacion-lavel');
const fechaIngresoLavel = document.getElementById('fecha-ingreso-label');
const cargoTrabajadorLavel = document.getElementById('cargo-trabajador-label');
const regimeLableLavel = document.getElementById('regime-lable');

const remuneIngresos = document.getElementById('remune-ingresos');
const remDescuentos = document.getElementById('rem-descuentos');
const remNeto = document.getElementById('rem-neto');
const asgignacionFamiliarIngresos = document.getElementById('asignacion-familiar-ingresos');
const asignacionFamiliarDescuentos = document.getElementById('asignacion-familiar-descuentos');
const asignacionFamiliarNeto = document.getElementById('asignacion-familiar-neto');
const otrosIngresosIngresos = document.getElementById('otros-ingresos-ingresos');
const otrosIngresosDescuentos = document.getElementById('otros-ingresos-descuentos');
const otrosIngresosNeto = document.getElementById('otros-ingresos-neto');
const bolEssalud = document.getElementById('aportes-essalud');
const rentaDescuentos = document.getElementById('renta-descuentos');
const rentaNeto = document.getElementById('renta-neto');
const pensionesDescuentos = document.getElementById('pensiones-descuentos');
const pensionesNeto = document.getElementById('pensiones-neto');
const comisionPorcentualNeto = document.getElementById('comision-porcentual-neto');
const comisionPorcentualDescuentos = document.getElementById('comision-porcentual-descuentos');
const primaSegurosDescuentos = document.getElementById('prima-seguros-descuentos');
const aporteObligatorioDescuentos   = document.getElementById('aporte-obligatorio-descuentos');
const primaSegurosNeto = document.getElementById('prima-seguros-neto');
const aporteObligatorioNeto  = document.getElementById('aporte-obligatorio-neto');
const totalNeto  = document.getElementById('total-neto');



const contentMain = document.getElementById('content-main');
const buttonPrint = document.getElementById('btn-imprimir');

// Constantes y variables

const dataFormHeader = {
  razonSocial: '',
  ruc: '',
  year: '2022',
  month: '01',
};

const dataRemuneraciones = [];

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


// App

document.addEventListener('DOMContentLoaded', App);

function App() {
  getDataConfigPlanilla();

  if (localStorage.getItem('id')) {
    getDataHeaderPlanilla();
    getDataRemuneracionPlanilla();
  } else {
    openNotification('Boleta de pagos', 'Tiene que generar su planilla de remuneraciones para previsualizar esta página.', 'warning');
  }

  workers.addEventListener('change', handleChangeWorker);
  buttonPrint.addEventListener('click', printBoleta)
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
      dataRemuneraciones.push(...data.lista)
      setworkersDOM(data.lista);
    } else openNotification('Base de datos', '¡No se encontró la collección!', 'error');
  }).catch((error) => console.error(error));
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

function handleChangeWorker(e) {
  const dniValue = e.target.value;
  const selectedWorker = dataRemuneraciones.filter(item => item.dni === dniValue)[0];
  console.log(selectedWorker);
  const { 
    dni, 
    nombres, 
    apellidos, 
    cargo, 
    fecha,
    sueldo,
    otros,
    asignacionValue,
    essalud,
    retencion,
    retencionAfp,
    totalRem,
    totalReten,

  } = selectedWorker;
  setDetailsWorkerDOM(dni, `${apellidos} ${nombres}`, cargo, fecha);
  setIncomesWorkerDOM(sueldo, asignacionValue, otros);
  //setAportesEmpleadorDOM(essalud, retencion);
  setAportesEmpleadorDOM(essalud);
  setAportesEmpleadorComisionAfpDOM(retencion, retencionAfp,totalRem);
  setAporteNetoDOM(totalRem,totalReten)
}

function printBoleta() {
  if (typeof contentMain.print === 'undefined') {
    setTimeout(() => {
      console.log('no entro');
      printBoleta();
    }, 1000);
  } else {
    contentMain.print();
  }
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

// Funciones de calculos

function roundNumber(value = 0) {
  const t = value.toString();
  const regex=/(\d*.\d{0,2})/;
  return t.match(regex)[0]; 
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

function setworkersDOM(data = []) {
  data.map(item => {
    const option = document.createElement('option');
    option.textContent = item.dni;
    option.value = item.dni;
    workers.appendChild(option);
  });
}

function setDetailsWorkerDOM(dni, fullname, cargo, fechaIngreso) {
  tipoLabel.textContent = 'DNI';
  // numeroLabel.textContent = dni;
  nombreApellidoLabel.textContent = fullname;
  fechaIngresoLavel.textContent =fechaIngreso ;
  cargoTrabajadorLavel.textContent = cargo;
}

function setIncomesWorkerDOM(sueldo, asignacion, otros) {
  
  remuneIngresos.textContent = sueldo;
  asgignacionFamiliarIngresos.textContent = roundNumber(asignacion);
  otrosIngresosIngresos.textContent = roundNumber(otros);

  remDescuentos.textContent = "0.00";
  asignacionFamiliarDescuentos.textContent="0.00";
  otrosIngresosDescuentos.textContent="0.00";

  remNeto.textContent = sueldo;
  asignacionFamiliarNeto.textContent = roundNumber(asignacion);
  otrosIngresosNeto.textContent= roundNumber(otros);
}

function setAportesEmpleadorDOM(essalud) {
  bolEssalud.textContent = roundNumber(essalud);
  //comisionPorcentualDescuentos.textContent = retencion;
}

function setAporteNetoDOM(totalremuneracion,remNeta) {
  totalNeto.textContent = roundNumber(totalremuneracion-remNeta);
  //comisionPorcentualDescuentos.textContent = retencion;
}


function setAportesEmpleadorComisionAfpDOM(retencion, retencionAfp, totalRem) {
  if(retencion=="snp"){
    rentaDescuentos.textContent="0.00";
    pensionesDescuentos.textContent="0.00";
    comisionPorcentualDescuentos.textContent= "0.00";
    primaSegurosDescuentos.textContent="0.00";

    rentaNeto.textContent="0.00";
    pensionesNeto.textContent="0.00";
    comisionPorcentualNeto.textContent= "0.00";
    primaSegurosNeto.textContent="0.00";

    aporteObligatorioDescuentos.textContent=dataConfig.aporteONP*totalRem
    aporteObligatorioNeto.textContent="-"+dataConfig.aporteONP*totalRem

  }else{
  if (retencion=="afp" && retencionAfp=="prima") {
    rentaDescuentos.textContent="0.00";
    pensionesDescuentos.textContent="0.00";
    rentaNeto.textContent="0.00";
    pensionesNeto.textContent="0.00";

    comisionPorcentualDescuentos.textContent= dataConfig.comisionPrima*totalRem;
    primaSegurosDescuentos.textContent=dataConfig.primaPrima*totalRem;
    aporteObligatorioDescuentos.textContent=dataConfig.aportePrima*totalRem;

    comisionPorcentualNeto.textContent="-"+ dataConfig.comisionPrima*totalRem; 
    primaSegurosNeto.textContent="-"+dataConfig.primaPrima*totalRem;
    aporteObligatorioNeto.textContent="-"+dataConfig.aportePrima*totalRem;
  } 
  
  else if(retencion=="afp" && retencionAfp=="habitad") {
    rentaDescuentos.textContent="0.00";
    pensionesDescuentos.textContent="0.00";

    rentaNeto.textContent="0.00";
    pensionesNeto.textContent="0.00";

    comisionPorcentualDescuentos.textContent= dataConfig.comisionHabitad*totalRem;
    primaSegurosDescuentos.textContent=dataConfig.primaHabitad*totalRem;
    aporteObligatorioDescuentos.textContent=dataConfig.aporteHabitad*totalRem;

    comisionPorcentualNeto.textContent="-"+ dataConfig.comisionHabitad*totalRem;
    primaSegurosNeto.textContent="-"+dataConfig.primaHabitad*totalRem;
    aporteObligatorioNeto.textContent="-"+dataConfig.aporteHabitad*totalRem;

  }
  else if(retencion=="afp" && retencionAfp=="profuturo") {
    rentaDescuentos.textContent="0.00";
    pensionesDescuentos.textContent="0.00";
    rentaNeto.textContent="0.00";
    pensionesNeto.textContent="0.00";

    comisionPorcentualDescuentos.textContent= dataConfig.comisionProfuturo*totalRem;
    primaSegurosDescuentos.textContent=dataConfig.primaProfuturo*totalRem;
    aporteObligatorioDescuentos.textContent=dataConfig.aporteProfuturo*totalRem;
   
    comisionPorcentualNeto.textConten="-"+ dataConfig.comisionProfuturo*totalRem;
    primaSegurosNeto.textContent="-"+dataConfig.primaProfuturo*totalRem;
    aporteObligatorioNeto.textContent+"-"+dataConfig.aporteProfuturo*totalRem;
  }  
  else if(retencion=="afp" && retencionAfp=="integra") {
    rentaDescuentos.textContent="0.00";
    pensionesDescuentos.textContent="0.00";
    rentaNeto.textContent="0.00";
    pensionesNeto.textContent="0.00";
    comisionPorcentualDescuentos.textContent= dataConfig.comisionIntegra*totalRem;
    primaSegurosDescuentos.textContent=dataConfig.primaIntegra*totalRem;
    aporteObligatorioDescuentos.textContent=dataConfig.aporteIntegra*totalRem;

    comisionPorcentualNeto.textConten="-"+ dataConfig.comisionIntegra*totalRem;
    primaSegurosNeto.textContent="-"+dataConfig.primaIntegra*totalRem;
    aporteObligatorioNeto.textContent="-"+dataConfig.aporteIntegra*totalRem;

  }
}
}

