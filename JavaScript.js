var x_center = 350;
var y_center = 350;
var radius = 300;
var totalplotlevels = 1;
var origin = 0;
var circlegroup;
var highlightcounter = 0; 
var filename = "cars.csv"
var svg = $('svg');
//Events 

$("#selectfile").change(function () {
    filename = $(this).find('option:selected').val();
    $.ajax({
        //url: "MissingChildren.csv",
        url: filename,
        async: false,
        success: function (csvd) {
            data = $.csv.toArrays(csvd);
            $("#svg").remove();
            init(data);
        }
    });
});

$("#cbox1").change(function () {
    if (this.checked) {
        grid = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svg.append(grid);
        for (i = 0; i < 10; i++) {
            var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            $(circle).attr({ "cx": x_center, "cy": y_center, "r": 300 * i / 10, "stroke": "lightgrey", "stroke-width": 1, "fill": "none", "stroke-opacity":0.3})
            $(grid).append(circle);
        }
    }
    else {
        $(grid).remove();
    }
});

$("svg").on("mouseover",".data", function (event) {
    document.body.style.cursor = "pointer";
    $(this)
        .css("stroke-width", "5")
        .css("stroke", "red")
    console.log(("pageX: " + event.pageX + ", pageY: " + event.pageY));
    label1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label1.setAttributeNS(null, "x", event.pageX-380);
    label1.setAttributeNS(null, "y", event.pageY-27);
    label1.setAttribute('fill', 'yellow');
    var index = $(this).attr('name').split('_');
    i = index[1];
    label1.textContent = data[i][0];
    $(svg).append(label1);
})

$("svg").on("mouseover", ".axis", function (event) {
    document.body.style.cursor = "pointer";
    console.log(("pageX: " + event.pageX + ", pageY: " + event.pageY));
    axislabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    axislabel.setAttributeNS(null, "x", event.pageX - 380);
    axislabel.setAttributeNS(null, "y", event.pageY - 27);
    axislabel.setAttribute('fill', 'yellow');
    var index = $(this).attr('id').split('_');
    i = index[1];
    axislabel.textContent = data[0][i];
    $(svg).append(axislabel);
})
.on("mouseout", ".axis", function () {
    axislabel.remove();
})
.on("mouseout", ".data", function () {
    document.body.style.cursor = "auto";
    $(this)
    .css("stroke-width", "1")
    .css("stroke", "white")
    label1.remove();
})

.on("click", ".data", function () {
    elmsid = $(this).attr("name");
    //.css("fill", "#daf7a6").css("fill-opacity", "0.4");
    var elms = document.getElementsByName(elmsid);

    console.log(elms.length)
    color1 = getRandomColor();

    for (var i = 0; i < elms.length; i++) {
        $(elms[i]).removeClass();
        elms[i].style.stroke = color1;
        $(elms[i]).css("stroke-width" , 3);
        //opac = 1 / (i + 1);
        //elms[i].style.opacity = opac;
    }
   $(".data").css("stroke","none");
    //$(".data").not(elms)
    //    .css("opacity", "0.2");
   $(".axis").css("opacity", "0.4");
   console.log("clicked");
   highlightcounter = highlightcounter + 1;
})

$("#cbox2").change(function () {
    if (this.checked) {
        $(".data").css("stroke", "white");
        $(".data").css("opacity", "0.2");

    }
    else {
        $(".data").css("stroke", "none");
    }
})
$.ajax({
    //url: "MissingChildren.csv",
    url:filename,
    async: false,
    success: function (csvd) {
        data = $.csv.toArrays(csvd);
        init(data);

    }
});

function highlightColor(highlightcounter) {
    colorArr = ["#ce398c", "yellow", "#3ddc5c"];
    color = colorArr[highlightcounter];
    return (color);
}
function resetFilter() {
    location.reload();
}
function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#4F';
    for (var i = 0; i < 1; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function setValues() {
    radius = document.getElementById("radius").value;
    totalplotlevels = document.getElementById("levels").value;
    origin = ($('#cbox:checked').length > 0) ? 0.1 : 0;
    $(Axisgroup).remove();
    $(circlegroup).remove();
    $(background).remove();
    createDatapath(svg,data);
}
function traspose(data) {
    var transposeArray = data[0].map(function (col, i) {
        return data.map(function (row) {
            return row[i]
        })
    });
    unique = Array.from(new Set(transposeArray))
    return transposeArray;
}
function setFilter(transpose_data) {
    var leftsidebar = document.getElementById("leftsidebar");
    var tbl = document.createElement('table');
    //tbl.setAttribute("class", "table");
    var tbdy = document.createElement('tbody');
    for (i = 0; i < transpose_data.length; i++) {
        uniqueFilterValues = Array.from(new Set(transpose_data[i])); //ES6 set dropdown values
        var tr = document.createElement('tr');

        var td = document.createElement('td');
        td.appendChild(document.createTextNode(i));
        tr.appendChild(td);

        var td = document.createElement('td');
        td.appendChild(document.createTextNode(uniqueFilterValues[0]));
        tr.appendChild(td);

        var s = document.createElement("select");
        s.setAttribute('class', 'filters');
        s.setAttribute('id', 'id_' + i);

        var a = uniqueFilterValues[i];
        uniqueFilterValues.splice(0, 1);
        uniqueFilterValues.sort((a, b) =>a - b);
        var t = document.createElement("option");
        t.value = 0;
        t.textContent = "Select value";
        s.append(t);

        for (j = 0; j < uniqueFilterValues.length; j++) {
            t = document.createElement("option");
            t.value = j;
            t.textContent = uniqueFilterValues[j];
            s.append(t);
        }
        var td = document.createElement('td');
        td.appendChild(s);
        tr.appendChild(td);
        tbdy.appendChild(tr);
        tbl.appendChild(tbdy);
        $('#table').append(tbl);
    }
}
function arraySubset(index, data, filter_value) {
    var result = $.grep(data, function (v, i) {
        return v[index] === filter_value;
    });
    return(result);
}
function init(data) {
    console.log(data)
    var color = ["red", "black", "orange", "yellow"]


    //setting up filters
    transpose_data = traspose(data);
    setFilter(transpose_data);

    //create starplot
    createDatapath(svg,data);

    $(".filters").change(function () {
        var filter_value = $(this).find('option:selected').text();
        var index = $(this).attr('id').split('_'); //id is in this form id_1, this will take index number
        var subset_data = arraySubset(index[1], data, filter_value);
        subset_data.splice(0,0,data[0])
        var subset_datadimensions = subset_data[0].length - 1;
        console.log(subset_data)
        $(Axisgroup).hide();
        $(circlegroup).hide();
        $(background).hide();

        createDatapath1(svg , subset_data);
    });
}
function normalizeData(data, dimensions) {
    var normalize_data = data.map(function (arr) {
        return arr.slice();
    });
    for (i = 1; i <= dimensions; i++) {
        var max = 0, min = 1, sum = 0;
        for (j = 1; j < data.length; j++) {
            max = Math.max(max, data[j][i]);
        }
        for (j = 1; j < data.length; j++) {
            normalize_data[j][i] = (data[j][i] / max).toFixed(2);
        }
    }
    return normalize_data;
}
function circle(svg, level) {
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    $(circle).attr({ "cx": x_center, "cy": y_center, "r": radius * level, id : "circle_"+ level,"stroke": "red", "stroke-width": 1, "fill": "none" })
    $(circlegroup).append(circle);
}
function point(svg, r, x,y) {
    var point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    $(point).attr({ "cx": x, "cy": y, "r": r*0.1, "stroke": "darkgrey", "stroke-width": 1, "fill": "grey" })
    svg.append(point);
}
function createAxis(svg, dimensions) {

    Axisgroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.append(Axisgroup);

    var levelofplotting = 1;
    var axisLabelCounter = 1;

    for (i = 1; i <= totalplotlevels; i++) {

        dimensioncount = dimensions * levelofplotting / (totalplotlevels * totalplotlevels); //counting dimensions

        origin = ((i <= 1 && ($('#cbox:checked').length > 0)) ? 0.2: 0);  //Shifting origin

        for (j = 1; j <= (dimensioncount) ; j++) {

            var theta = (j / dimensioncount) * Math.PI * 2;
            x = x_center + Math.cos(theta) * radius * (i - 1) + Math.cos(theta) * radius * origin;
            y = y_center + Math.sin(theta) * radius * (i - 1) + Math.sin(theta) * radius * origin;

            var cos_theta = x_center + Math.cos(theta) * radius * i;
            var sin_theta = y_center + Math.sin(theta) * radius * i;
            newpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            newpath.setAttributeNS(null, "id", "axisid_" + j);
            newpath.setAttributeNS(null, "class", "axis");
            newpath.setAttributeNS(null, "d", "M" + (x) + " " + (y) + "L" + cos_theta + " " + sin_theta);
            newpath.setAttributeNS(null, "stroke", "white");
            newpath.setAttributeNS(null, "stroke-width", 1);
            newpath.setAttributeNS(null, "opacity", 1);
            newpath.setAttributeNS(null, "fill", "none");
            $(Axisgroup).append(newpath);
            label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            if (sin_theta < y) {
                label.setAttributeNS(null, "x", cos_theta + 2);
                label.setAttributeNS(null, "y", sin_theta - 5);
            }
            else{
                label.setAttributeNS(null, "x", cos_theta + 2);
                label.setAttributeNS(null, "y", sin_theta +5);
            }
            
            label.setAttribute('fill', 'yellow');
            label.textContent = axisLabelCounter;
            $(Axisgroup).append(label);

            axisLabelCounter++;
            
        }
        circle(svg, i);
        levelofplotting = 2 * i + 1;
    }
}
function createDatapath(svg, data) {
    //calculating radius
    if (totalplotlevels > 1) {
        radius = (radius / totalplotlevels);
        
    }
   
    //calculating dimensions
    dimensions = data[0].length - 1;

    //creating circle
    circlegroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.append(circlegroup);
    createAxis(svg, dimensions);

    //radius = radius;
    normalize_data = normalizeData(data, dimensions);//normalize data between 1 and 0
    background = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.append(background);
    background.setAttributeNS(null, "class", "background");
        var levelofplotting = 1;
        dp = 0;   //dimensionposition
    for (k = 1; k <= totalplotlevels; k++) {
        dimensioncount = dimensions * levelofplotting / (totalplotlevels * totalplotlevels);
        dimensioncount = Math.round(dimensioncount);

        origin = ((k <= 1 && ($('#cbox:checked').length > 0)) ? 0.3 : 0);  //Shifting origin

        for (i = 1; i < normalize_data.length; i++) {

            var newpath, dataline;
            newpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            newpath.setAttributeNS(null, "name", "dataid_" + i);
            newpath.setAttributeNS(null, "class", "data");
            newpath.setAttributeNS(null, "opacity", 1);
            newpath.setAttributeNS(null, "fill", "none");

            dataline = "M";
                    
            for (j = 1; j <= (dimensioncount) ; j++) {
                var theta = (j / dimensioncount) * Math.PI * 2;
                var cos_theta, sin_theta;
                
                x = x_center + Math.cos(theta) * (radius + 5) * (k - 1) + Math.cos(theta) * (radius) * origin;// moving to point where graph can begin
                y = y_center + Math.sin(theta) * (radius + 5) * (k - 1) + Math.sin(theta) * (radius) * origin;
                //var count_datapoint;  
                //count_datapoint = 0;
                //counting datapoints
                //for (l = 1; l < normalize_data.length ; l++) {
                //    if (normalize_data[i][dp + j] == normalize_data[l][dp + j]) {
                //        count_datapoint++;
                //    }
                //}

                if (j < 2) {
                    cos_theta = x + Math.cos(theta) * Math.abs(normalize_data[i][dp + j] - origin) * (radius - 20);
                    sin_theta = y + Math.sin(theta) * Math.abs(normalize_data[i][dp + j] - origin) * (radius - 20);
                    dataline = dataline + cos_theta + " " + sin_theta;
                }
                else {
                    cos_theta = x + Math.cos(theta) * Math.abs(normalize_data[i][dp + j] - origin) * (radius - 20);
                    sin_theta = y + Math.sin(theta) * Math.abs(normalize_data[i][dp + j] - origin) * (radius - 20);
                    dataline = dataline + "L" + cos_theta + " " + sin_theta;
                }
                //if (count_datapoint > 1) {
                //    point(svg, count_datapoint, cos_theta, sin_theta);
                //}
            }

 
            newpath.setAttributeNS(null, "stroke", "#F0FFF0")
            newpath.setAttributeNS(null, "d", dataline + "z");
            $(background).append(newpath);
        }
        dp = dp + dimensioncount;
                
        levelofplotting = 2 * k + 1;
    }

}
function createDatapath1(svg, subset_data) {

    dimensions = subset_data[0].length - 1;
    //creating circle
    circlegroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.append(circlegroup);
    createAxis(svg, dimensions);
    color = getRandomColor();

    var normalize_data = subset_data.map(function (arr) {
        return arr.slice();
    });
    for (i = 1; i <= dimensions; i++) {
        var max = 0, min = 1, sum = 0;
        for (j = 1; j < data.length; j++) {
            max = Math.max(max, data[j][i]);
        }
        for (j = 1; j < subset_data.length; j++) {
            normalize_data[j][i] = (subset_data[j][i] / max).toFixed(2);
        }
    }

    console.log(normalize_data)
    foreground = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.append(foreground);
    foreground.setAttributeNS(null, "class", "foreground");
    var levelofplotting = 1;
    dp = 0;   //dimensionposition
    for (k = 1; k <= totalplotlevels; k++) {
        dimensioncount = dimensions * levelofplotting / (totalplotlevels * totalplotlevels);
        dimensioncount = Math.round(dimensioncount);

        origin = ((k <= 1 && ($('#cbox:checked').length > 0)) ? 0.2 : 0);  //Shifting origin

        for (i = 1; i < normalize_data.length; i++) {

            var newpath, dataline;
            newpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            newpath.setAttributeNS(null, "id", "data_id" + i);
            newpath.setAttributeNS(null, "class", "data");
            newpath.setAttributeNS(null, "opacity", 1);
            newpath.setAttributeNS(null, "fill", "none");

            dataline = "M";

            for (j = 1; j <= (dimensioncount) ; j++) {
                var theta = (j / dimensioncount) * Math.PI * 2;
                var cos_theta, sin_theta;
                var count_datapoint;
                x = x_center + Math.cos(theta) * (radius+5) * (k - 1) + Math.cos(theta) * radius * origin;// moving to point where graph can begin
                y = y_center + Math.sin(theta) * (radius+5) * (k - 1) + Math.sin(theta) * radius * origin;
                count_datapoint = 0;
                //counting datapoints
                //for (l = 1; l < normalize_data.length ; l++) {
                //    if (normalize_data[i][dp + j] == normalize_data[l][dp + j]) {
                //        count_datapoint++;
                //    }
                //}

                if (j < 2) {
                    cos_theta = x + Math.cos(theta) * Math.abs(normalize_data[i][dp + j] - origin) * (radius-20);
                    sin_theta = y + Math.sin(theta) * Math.abs(normalize_data[i][dp + j] - origin) * (radius-20);
                    dataline = dataline + cos_theta + " " + sin_theta;
                }
                else {
                    cos_theta = x + Math.cos(theta) * Math.abs(normalize_data[i][dp + j] - origin) * (radius-20);
                    sin_theta = y + Math.sin(theta) * Math.abs(normalize_data[i][dp + j] - origin) * (radius-20);
                    dataline = dataline + "L" + cos_theta + " " + sin_theta;
                }
                //if (count_datapoint > 1) {
                //    point(svg, count_datapoint, cos_theta, sin_theta);
                //}
            }


            newpath.setAttributeNS(null, "stroke", color)
            newpath.setAttributeNS(null, "d", dataline + "z");
            $(foreground).append(newpath);
        }
        dp = dp + dimensioncount;

        levelofplotting = 2 * k + 1;
    }

}
    
