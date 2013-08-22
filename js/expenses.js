var drawPie = function(pie, data) {
    // Remove old chart
    if (pie != null) {
	r.clear();
    }
    // and draw new one

    tmp_cal = [];
    tmp_item = [];

    for (var i = 0; i < data.length; i++) {
	tmp_cal.push(data[i].calculated);
	tmp_item.push(data[i].item);
    }
    
    var pie = r.piechart(400, 120, 120,
                         tmp_cal,
                         {
                             legend: tmp_item,
			     strokewidth: 2,
			     colors: ['#06A2CB', '#DD1E2F', '#218559', '#EBB035', '#D0C6B1', '#192823']
                         });

    pie.attr({ opacity : 0 });
    pie.show().animate({ opacity : 1 }, 1500);
    return pie;
}

var drawBar = function(bar, data) {
    tmp_cal = [];

    for (var i = 0; i < data.length; i++) {
	tmp_cal.push(data[i].calculated);
    }

    var bar = r.barchart(0, 0, 200, 260,
			 tmp_cal,
			 {
			     // Switches colours in pie for some reason... Use monchrome.
			     colors: ['#AAAAAA', '#AAAAAA', '#AAAAAA', '#AAAAAA', '#AAAAAA', '#AAAAAA', '#AAAAAA', '#AAAAAA', '#AAAAAA', '#AAAAAA']
			 });

    bar.attr({ opacity : 0 });
    bar.show().animate({ opacity : 1 }, 1500);
    return bar;
}




var addData = function(data, item, amount, period) {
    var calculated = null;
    switch(period){
	case 'yearly':
	calculated = amount/12.0;
	break;
	case 'monthly':
	calculated = amount*1.0;
	break;
	case 'weekly':
	calculated = amount*4.333;
	break
	case 'daily':
	calculated = amount*30.5;
	break;
	default:
	alert("Critical error!");
	break;
    }
    
    data.push({id: lowest_id, item: item, amount: amount, period: period, calculated: calculated})
    return data.slice(-1)[0];
}

var tableAddRow = function(id, item, amount, period, calculated) {
    var capitalized = period.charAt(0).toUpperCase() + period.slice(1);
    $('#table > tbody > tr:first').after('<tr id="row_'+id+'"><td>'+item+'</td><td>£'+amount.toFixed(2)+'</td><td>'+capitalized+'</td><td>£'+calculated.toFixed(2)+'</td><td><button class="btn" onclick="tableDeleteRow('+id+')"><i class="icon-trash" /></button></td></tr>');
}


var updateJSON = function(data) {
    $("#json").val(JSON.stringify(data));
}

var loadFromJSONBox = function() {
    loadFromJSON($("#json").val());
}

var loadFromJSON = function(json) {
    clearAll();
    data = JSON.parse(json);
    lowest_id = 0;
    for (var i = 0; i < data.length; i++) {
	var item = data[i]
	tableAddRow(lowest_id, item.item, item.amount, item.period, item.calculated);
	if (item.id >= lowest_id){
	    lowest_id = item.id + 1;
	}
    }
    updateEverything(data);
}

var loadFromCookie = function() {
    loadFromJSON($.cookie("data"));
}

var updateCookie = function(data) {
    $.cookie("data", JSON.stringify(data), { expires: 365 * 10 });
}

var formNewItem = function(period) {
    var amount = parseFloat(document.getElementById('formAmount').value);
    if (isNaN(amount)){
	$("#input_amount").addClass("control-group error");
	$("#input_amount > input").focus();
    }
    else{
	$("#input_amount").removeClass("control-group error");
	var capitalized = document.getElementById('formItem').value.charAt(0).toUpperCase() + document.getElementById('formItem').value.slice(1)
	addNewItem(capitalized, amount, period);
    }
}

var updateEverything = function(data) {
    drawPie(pie, data);
    drawBar(bar, data);
    updateJSON(data);
    updateCookie(data);
}


var addNewItem = function(item, amount, period) {
    var item = addData(data, item, amount, period);
    tableAddRow(lowest_id, item.item, item.amount, item.period, item.calculated);
    lowest_id = lowest_id + 1;
    updateEverything(data);
    document.getElementById("newItem").reset();
}

var tableDeleteRow = function(id) {
    $('#table > tbody > #row_'+id).remove();
    for (var i = 0; i < data.length; i++) {
	if (data[i].id == id){
	    data.splice(i, 1)
	}
    }
    // Leave old pie up, until we get a piece of data
    if (data.length > 0){
	updateEverything(data);
    }
}


var clearAll = function() {
    $('#table > tbody > tr').not(':first').not(':last').remove();
    data = [];
    lowest_id = 0;
    // Leave old pie up, until we get a piece of data
    updateJSON(data);
    $.removeCookie("data");
}



// Activate time period dropdowns
$('.dropdown-toggle').dropdown();

// Set up canvas and pie chart
var r = Raphael("chart-canvas", 800, 240);
var pie = null;
var bar = null;

// Set up data
var data = [] // {id: 0, item: 'Phone', amount: 40, period: 'weekly', calculated: 130}
var lowest_id = 0;

// Draw initial chart
pie = drawPie(pie, data);
bar = drawBar(bar, data);

if ($.cookie("data") != undefined) {
    loadFromCookie();
}
else {
    // Add example data
    addNewItem('Food', 5, 'daily')
    addNewItem('Internet', 15, 'monthly')
    addNewItem('Phone', 30, 'monthly')
    addNewItem('Insurance', 400, 'yearly')
}
