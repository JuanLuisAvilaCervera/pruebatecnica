import MeasureUnit from "./measureunit.js"

const ktm = new MeasureUnit("ktm","mtk", "Kilómetros a millas" , 0.621371)
const mtk = new MeasureUnit("mtk","ktm", "Millas a kilómetros" , 1.60934)
const mtp = new MeasureUnit("mtp","ptm", "Metros a pies" , 3.28084)
const ptm = new MeasureUnit("ptm","mtp", "Pies a metros" , 0.3048)
const ctp = new MeasureUnit("ctp","ptc", "Centímetros a pulgadas" , 0.393701)
const ptc = new MeasureUnit("ptc","ctp", "Pulgadas a centímetros" , 2.54)

const measurearray = new Array (ktm,mtk,mtp,ptm,ctp,ptc)

//Cargar la página
$(function(){
    setUnitSelect();

    convert();

    $("#measure-input").on("keyup", function(){ convert() })

    $("#unit-select").on("change", function(){ convert() })
})

//Mostrar todas las opciones de unidades en el elemento "select"
function setUnitSelect(){
    for(let i = 0 ; i < measurearray.length ; i++){
        $("#unit-select").append($('<option>', {
            value: measurearray[i].id,
            text: measurearray[i].name
        }));
    }
}

//Cambiar unidades por sus opuestas al pulsar el icono de cambio
function getOppositeUnit( id ){
    for(let i = 0 ; i < measurearray.length ; i++){
        if(measurearray[i].id == id){
            return measurearray[i].oppositeid;
        }
    }
}

function getConversion(id){
    for(let i = 0 ; i < measurearray.length ; i++){
        if(measurearray[i].id == id){
            return measurearray[i].conversion;
        }
    }
}

function convert(){
    let conversion = getConversion($("#unit-select").find(":selected").attr("value"));
    let result = (conversion * parseFloat($("#measure-input").val())).toFixed(2);
    if(isNaN(result)){
        result = 0;
    }
    $("#result-input-p").text(result) ;
}