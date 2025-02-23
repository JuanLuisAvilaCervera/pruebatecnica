import MeasureUnit from "./measureunit.js"

const ktm = new MeasureUnit("km","millas", "Kilómetros a millas" , 0.621371)
const mtk = new MeasureUnit("millas","km", "Millas a kilómetros" , 1.60934 )
const mtp = new MeasureUnit("m","pies", "Metros a pies" , 3.28084)
const ptm = new MeasureUnit("pies","m", "Pies a metros" , 0.3048)
const ctp = new MeasureUnit("cm","pulgadas", "Centímetros a pulgadas" , 0.393701)
const ptc = new MeasureUnit("pulgadas","cm", "Pulgadas a centímetros" , 2.54)

const measurearray = new Array (ktm,mtk,mtp,ptm,ctp,ptc)

//Cargar la página
$(function(){


    setUnitSelect();

    convert();

    $("#measure-input").on("keyup", function(){ convert() })

    $("#unit-select").on("change", function(){ 
        convert() 
    })

    $("#changeUnits").on("click", function(){ setOppositeUnit() })
    $("#favorite-icon").on("click", function(){ save() })

    $("#heart-icon").on("mouseenter", function(){
        $("#heart-icon").attr("name", "heart");
    }).on("mouseleave", function(){
        $("#heart-icon").attr("name", "heart-empty");
    })

    listSaved();
})

//Calcular conversión
function convert(){
    let selected = $("#unit-select").find(":selected");
    let conversion = selected.attr("value");
    let unit = selected.attr("id");
    let opunit = selected.attr("opposite");
    let result = (parseFloat(conversion) * parseFloat($("#measure-input").val())).toFixed(2);
    
    if(isNaN(result)){
        result = 0;
    }
    
    $("#measure-unit-p").text(unit);
    $("#result-unit-p").text(opunit);
    $("#result-input-p").text(result);
}

//Mostrar todas las opciones de unidades en el elemento "select"
function setUnitSelect(){
    for(let i = 0 ; i < measurearray.length ; i++){
        $("#unit-select").append($('<option>', {
            value: measurearray[i].conversion,
            text: measurearray[i].name,
            opposite: measurearray[i].oppositeid,
            id: measurearray[i].id
        }));
    }
}

function setOppositeUnit(){
    
    let opposite = $("#unit-select").find(":selected").attr("opposite");
    //FALLO: Al pulsar 2 veces el botón de cambio habiendo seleccionado una unidad distinta a km/millas o millas/km cambiaba automáticamente a una de estas.
    // Si volvías a seleccionar la opuesta a la seleccionada en primer lugar, se paraba
    // SOLUCIÓN: Necesita ambas para cambiar correctamente

    let result = $("#result-input-p").text();

    $("#"+opposite).attr("selected","selected");
    $("#"+opposite).prop("selected","selected");

    $("#measure-input").val(result);
    
    convert();
}

function save(){


    let id =  $("#unit-select").find(":selected").attr("id");
    let opposite = $("#unit-select").find(":selected").attr("opposite");

    let measure = $("#measure-input").val();
    let result = $("#result-input-p").text();

    
    if( measure != 0){
        let savedConversion = { 'id' : id , 'opposite': opposite, 'measure' : measure, 'result' : result}

        //Guardar por fecha

        let date = new Date()

        let savedID = "savedConversion" + date.getFullYear() + date.getMonth()  + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();

        localStorage.setItem(savedID, JSON.stringify(savedConversion));

        $("#measure-input").val(0);
        convert();

        listSaved();
    }
}

function listSaved(){
    let savedHTML = `<div class="saved-div"><div class="saved ">
                <div class="data">[MEASURE][UNITM]<ion-icon name="arrow-forward"></ion-icon>[RESULT][UNITR]</div>
                <div class="delete" id="[ID]"><ion-icon name="close" class="close-icon"></ion-icon></div>
            </div></div>`;
    let storageList = {...localStorage}

    $("#savedList").text("");
    for(var key in storageList){
        if(key.includes('savedConversion')){
            let savedMeasure = JSON.parse(storageList[key])
            let saved = savedHTML.replace('[MEASURE]', savedMeasure.measure)
                                .replace('[UNITM]', savedMeasure.id)
                                .replace('[RESULT]', savedMeasure.result)
                                .replace('[UNITR]', savedMeasure.opposite)
                                .replace('[ID]', key);

            document.getElementById('savedList').innerHTML+=saved;

            $(".delete").on("click", function(){
                deleteSaved($(this).attr("id"));
            })
            
        }
        
    }
}

function deleteSaved( id){
    localStorage.removeItem(id);
    listSaved();
}