var filename = "cars_25_U.csv"
filename = getUrlParameter("filename");

//initial plot parameters x_center,y_center are x and y coordinates. Radius is outer ring radius and innerRadius is inner ring radius
//
var x_center = 350;
var y_center = 320;
var radius = 300;
var innerRadius = 20;
var totalplotlevels = 1;
var origin = 0;
var circlegroup;
var highlightcounter = 0; 

//svg is a DOM element from HTML first we need to read that element and then attach star plot to this element
var svg = $('svg');

//Arrays for manipulating the data.
var rarray = new Array();
var farray = new Array();
var farray_bck = new Array();
//Events 

//This function reads url in a browser and get filename parameter. This way we understand which datafile is used
//if only one file is used then this function is not required.
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? 'cars_25_U.csv' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

//This is a starting point of a program. Ajax script reads file provided by url and save into data array.
//After reading file is complted init function is called where data array is passed.
$.ajax({
    url: "https://ingale88s.github.io/Starplot/"  + filename,
    async: false,
    success: function (csvd) {
        data = $.csv.toArrays(csvd);
        init(data);
    }
});
//When HTML file is completely loaded into a browser then this function is called. 
$(document).ready(function () {

    $(".legendLabels").hide();

    //This is left hand side vertical menu function.
    $("#vertical-menu h3").click(function () {
        //slide up all the link lists
            $("#vertical-menu ul ul").slideUp();
            $('.plus', this).html('+');
        //slide down the link list below the h3 clicked - only if its closed
            if (($(this).find("input:checked").length) > 0) {

                //logic to slide down once variable is clicked
                if (!$(this).next().is(":visible")) {
                    $(this).next().slideDown();
                    //$(this).remove("span").append('<span class="minus">-</span>');
                    $('.plus').html('+');
                    $('.plus', this).html('-');
                }

                //logic to add variable back if it's removed
                var index = $(this).attr('id').split('_');
                if (farray.indexOf(Number(index[1])) < 0) {
                    farray.push(Number(index[1]));
                    farray.sort((a, b) =>a - b);
                    Array.prototype.diff = function (a) {
                        return this.filter(function (i) { return a.indexOf(i) < 0; });
                    };

                    var farray_inverse = farray_bck.diff(farray);

                    rarray = data.map(function (arr) {
                        return arr.slice();
                    });

                    farray_inverse.forEach(function (e) {
                        rarray = rarray.map(function (item) {
                            // the 0,2 tells the splice function to remove (skip) the last item in this array
                            return item.filter(function (el, idx) { return idx !== e });
                        });
                    })
                }
                console.log(rarray);
                $(this).css("background", "linear-gradient(#003040, #002535)");

                $(Axisgroup).remove();
                $(circlegroup).remove();
                $(background).remove();

                //radius = 300;
                CreateDatapath(svg, rarray);
            }
            else {
                var index = $(this).attr('id').split('_');
                i = Number(index[1]);
                farray.indexOf(i);
                rarray = rarray.map(function (item) {
                    // the 0,2 tells the splice function to remove (skip) the last item in this array
                    return item.filter(function (el, idx) { return idx !== (farray.indexOf(i)) });
                    
                });
                farray.splice(farray.indexOf(i), 1);
                $(this).css("background", "lightslategrey");
                $(Axisgroup).remove();
                $(circlegroup).remove();
                $(background).remove();
                if(window.foreground)
                    $(foreground).remove();
                //radius = 300;
                CreateDatapath(svg, rarray);
            }
    })

    //selectfile id is for select file dropdown on right hand side
    $("#selectfile").change(function () {
        filename = $(this).find('option:selected').val();
        window.open("https://ingale88s.github.io/Starplot?filename=" + filename)
    });

    //cbox1 id is for enable grid checkbox on right hand side. After clicking this check box, 10 smallers circles are plotted on top of starplot
    //
    $("#cbox1").change(function () {
        if (this.checked) {
            //grid element is created for grid and this grid is appended to the main svg variable.
            grid = document.createElementNS("http://www.w3.org/2000/svg", "g");
            svg.append(grid);
            for (i = 0; i < 10; i++) {
                var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                //here circle center is fixed and which is already defined, radius r is calculated by dividing radius * i/10 and rest is css parameters.
                $(circle).attr({ "cx": x_center, "cy": y_center, "r": 300 * i / 10, "stroke": "lightgrey", "stroke-width": 1, "fill": "none", "stroke-opacity": 0.3 })
                $(grid).append(circle);
            }
        }
        else {
            $(grid).remove();
        }
    });

    //resetcbox is for Regular star plot checkbox on right hand side. This checkbox just reloads the page so everything is resetted
    $("#resetcbox").change(function () {
        if (this.checked) {
            location.reload();
        }
    })

    //What should happen when we point our mouse on a star plot. Following code answers that. '.data' and '.axis' are classes created for showing
    //datapoints and radial axis. mouseover event is attached to it so that whenever user points on data following code runs.
    $("svg")
    .on("mouseover", ".data", function (event) {

        //when user takes mouse to a data mouser cursor becomes pointer.
        document.body.style.cursor = "pointer";
        //this keyword is used for getting whatever data is highlighted. Once mouse is on that data point width of that datapoint will change to 5

        $(this).css("stroke-width", "5")
        // and a label is attached to it. x and y coordinates then color yellow and then what should be name of the label.
        // name of a label is coming from name of a datapoint. If you inspect any datapoint using google browser, for every datapoint 
        //there is a name property. 
        label1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label1.setAttributeNS(null, "x", event.pageX - 380);
        label1.setAttributeNS(null, "y", event.pageY - 27);
        label1.setAttribute('fill', 'yellow');
        var index = $(this).attr('name').split('_');
        i = index[1];
        label1.textContent = data[i][0];
        $(svg).append(label1);
    })

    // same as data, the axis class is used to point axes. Here coloumn headers we need to grab so index is passed as data[0][i].
    //Data array is a two-dimentional array.
    .on("mouseover", ".axis", function (event) {
        document.body.style.cursor = "pointer";
        axislabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        axislabel.setAttributeNS(null, "x", event.pageX - 380);
        axislabel.setAttributeNS(null, "y", event.pageY - 27);
        axislabel.setAttribute('fill', 'yellow');
        var index = $(this).attr('id').split('_');
        i = index[1];
        axislabel.textContent = data[0][i];
        $(svg).append(axislabel);
    })
    //what should happen when mouse out.
    .on("mouseout", ".axis", function () {
        axislabel.remove();
    })
    //what should happen when mouse out.
    .on("mouseout", ".data", function () {
        document.body.style.cursor = "auto";
        $(this)
        .css("stroke-width", "1")
        label1.remove();
    })

    //mouse click event.When ever user clicks on a datapoint all the data points with same name is highlighted.
    // In regular star plot, all the datapoints will have unique names.
    // In 2-level plot, same datapoints are divided into two levels. Still their name remains same. So there will be 2 datapoints with same name
    // Task is to highlight both the data points with same color but with different opacity. inner datapoint with higher opacity and outer with 
    //low opacity value.
    .on("click", ".data", function () {
        elmsid = $(this).attr("name");
        //.css("fill", "#daf7a6").css("fill-opacity", "0.4");
        var elms = document.getElementsByName(elmsid);

        color1 = getRandomColor();

        for (var i = 0; i < elms.length; i++) {
            $(elms[i]).removeClass();
             if ($('.btn-toggle').find('.active').attr('name') == "stroke") {
                elms[i].style.stroke = color1;
                $(elms[i]).css("stroke-width", 3);

            }
            else {
                $(elms[i]).css("fill", color1);
                opac = 1 / (i + 1.5);
                elms[i].style.opacity = opac;

            }
        }
        $(".data").css("stroke", "none");
        $(".axis").css("opacity", "0.4");
        highlightcounter = highlightcounter + 1;
    })

    //cbox2 id is for highlight background data checkbox. This is to highlights background data when already one datapoint is highlighted.
    //This is useful for comparing purpose. 
    //data DOM class is already present we just need to change stroke and opacity parameters to display on screen.
    
    $("#cbox2").change(function () {
        if (this.checked) {
            $(".data").css("stroke", "white");
            $(".data").css("opacity", "0.5");

        }
        else {
            $(".data").css("stroke", "none");
        }
    })

    //This code toggles brushing options from stroke to fill. Stroke means when user clicks on a datapoint it will highlight
    //with line and and Fill means area under the datapoint is also highlighted using some color.
    $('.btn-toggle').click(function () {
        $(this).find('.btn').toggleClass('active');
        $(this).find('.btn').toggleClass('btn-primary');
        $(this).find('.btn').toggleClass('btn-default');
    });

    // .filters is a class for dropdown menu on lefthand side. Every dimension of a data has filter which will have all the unique values of the data.
    $(".filters").change(function () {
        var filter_value = $(this).find('option:selected').text();
        var index = $(this).attr('id').split('_');
        i = Number(index[1]);
        //i variable tells us which filter is selected. For cars dataset make, engine-location, fuel-types are dimensions
        //if make filter is selected then i will be 0, we then pass i to Arraysubset function to get only datapoints which are filtered.
        var subset_data = ArraySubset(farray.indexOf(i), rarray, filter_value);
        subset_data.splice(0, 0, rarray[0])
        var subset_datadimensions = subset_data[0].length - 1;
        $(Axisgroup).hide();
        $(circlegroup).hide();
        $(background).hide();

        //create datapath function gets array and plots the star plot
        CreateDatapath1(svg, subset_data);
    });
    // Similar to a dimension filter there is a range filter.Range filter is useful for numerical data.When we give range a Arraysubset function
    // return a subset of data within a range.
    $('.rangefilter').click(function () {
        var index = $(this).attr('id').split('_');
        var i = Number(index[1]);
        var fromTextboxValue = $('#fromTextbox_' + index[1]).val();
        var toTextboxValue = $('#toTextbox_' + index[1]).val();
        //console.log(farray)
        //console.log(farray.indexOf(i));
        //console.log(rarray);
        var subset_data = ArraySubset1(farray.indexOf(i), rarray, fromTextboxValue,toTextboxValue)
        //console.log(subset_data);
        subset_data.splice(0, 0, rarray[0])
        var subset_datadimensions = subset_data[0].length - 1;
        $(Axisgroup).hide();
        $(circlegroup).hide();
        $(background).hide();
        CreateDatapath1(svg, subset_data);
    })
    //Control outer radius. Botton side of a screen you will see two zoom-in and zoom-out buttons for changing outer radius and inner radius
    $("#qty").change(function () {
        radius = $("#qty").val();
        ResetPlot();
    })

    $("#btn-plus").click(function () {
        radius = radius + 10;
        $("#qty").val(radius);
        ResetPlot();
    })

    $("#btn-minus").click(function () {
        radius = radius - 10;
        $("#qty").val(radius);
        ResetPlot();
    })

    //Control inner radius
    $("#qty1").change(function () {
        if ($('#cbox:checked').length > 0) {
            innerRadius = $("#qty1").val();
            ResetPlot();
        }
    })

    $("#btn-plus1").click(function () {
        if ($('#cbox:checked').length > 0) {
            innerRadius = innerRadius + 5;
            $("#qty1").val(innerRadius);
            ResetPlot();
        }

    })

    $("#btn-minus1").click(function () {
        if ($('#cbox:checked').length > 0) {
            innerRadius = innerRadius - 5;
            $("#qty1").val(innerRadius);
            ResetPlot();
        }
    })

    //Zoom-in/out can be controlled on mousewheel
    $(svg).bind('mousewheel', function (e) {
        if (e.originalEvent.wheelDelta / 120 > 0) {
            radius = radius + 10;
            $("#qty").val(radius);
            ResetPlot();
        }
        else {
            radius = radius - 10;
            $("#qty").val(radius);
            ResetPlot();
        }
    });


})

function highlightColor(highlightcounter) {
    colorArr = ["#ce398c", "yellow", "#3ddc5c"];
    color = colorArr[highlightcounter];
    return (color);
}

function ResetFilter() {
    location.reload();
}

//Random color generator function
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 3; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function SetValues() {
    totalplotlevels = document.getElementById("levels").value;
    origin = ($('#cbox:checked').length > 0) ? 0.1 : 0;
    ResetPlot();
}

// Find Transpose matrix of data array. 
function Transpose(data) {
    var transposeArray = data[0].map(function (col, i) {
        return data.map(function (row) {
            return row[i]
        })
    });
    unique = Array.from(new Set(transposeArray))
    return transposeArray;
}

function SetFilter(transpose_data) {
    var leftsidebar = document.getElementById("leftsidebar");
    var filtDiv = document.createElement('div');
    filtDiv.setAttribute("id", "vertical-menu");
    leftsidebar.appendChild(filtDiv);

    //This will create a list of all the variables and append it to filter div

    var ul1 = document.createElement("ul"); 
    filtDiv.appendChild(ul1); 
    
    // Go through the variables one by one for all the variables

    for (i = 0; i < transpose_data.length; i++) {

        //Only take unique values for data to display in dropdown box
        uniqueFilterValues = Array.from(new Set(transpose_data[i])); //ES6 set dropdown values
        farray.push(i);
        farray_bck.push(i);

        // This creates list elements 
        var li1 = document.createElement("li");

        // This is header of the variable 
        var header = document.createElement('h3');
        header.setAttribute("id", "Filteraxis_" + i)
        var dspan = document.createElement('span');
        dspan.setAttribute("class", "plus");
        dspan.innerHTML = "+";
        header.appendChild(dspan);
        dspan = document.createElement('span');
        dspan.innerHTML = i;
        header.appendChild(dspan);
        dspan = document.createElement('span');
        dspan.innerHTML = uniqueFilterValues[0];
        header.appendChild(dspan);

        var chkbox = document.createElement('input');
        chkbox.type = 'checkbox';
        chkbox.checked = true;  
        chkbox.setAttribute("class","visible_axis")
        header.appendChild(chkbox);
        li1.appendChild(header);

        var section = document.createElement('div');
        var list = document.createElement('ul');

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

        var label1 = document.createElement('span');
        label1.innerHTML = "Select Data point: ";

        var listmember1 = document.createElement('li');
        listmember1.appendChild(label1);
        listmember1.appendChild(s);
        list.appendChild(listmember1);

        var label2 = document.createElement('span');
        label2.innerHTML = "Select Range: ";

        var fromTextbox = document.createElement('input');
        fromTextbox.id = 'fromTextbox_' + i;
        fromTextbox.type = "text";
        fromTextbox.style['width'] = '50px';

        var toTextbox = document.createElement('input');
        toTextbox.id = 'toTextbox_' + i;
        toTextbox.type = "text";
        toTextbox.style['width'] = '50px';

        var listmember2 = document.createElement('li');
        listmember2.appendChild(label2);
        listmember2.appendChild(fromTextbox);

        label2 = document.createElement('span');
        label2.style['padding'] = '10px'
        label2.innerHTML = "To";

        listmember2.appendChild(label2);
        listmember2.appendChild(toTextbox);

        var filterbutton = document.createElement('button');
        filterbutton.innerHTML = 'Filter';
        filterbutton.style['width'] = '80px';
        filterbutton.style['color'] = 'black';
        filterbutton.style['margin-left'] = '15px';
        filterbutton.className = "rangefilter";
        filterbutton.id = "rangefilter_" + i;
        listmember2.appendChild(filterbutton);

        list.appendChild(listmember2);

        li1.appendChild(list);
        ul1.appendChild(li1);
    }

}

// This function returns subset of data. This function is called from rangefiler. is this useful to filter numerical data using range.
// This is standard code on internet if we find how to get subset of array using javascript we get this code.
function ArraySubset1(index, data, fromvalue, tovalue ) {
    var result = $.grep(data, function (v, i) {
        return (v[index] >= fromvalue && v[index] <= tovalue);
    });
    return (result);
}
// Similarly, ArraySubset gives subset for dimension filter.
function ArraySubset(index, data, filter_value) {
    var result = $.grep(data, function (v, i) {
        return v[index] === filter_value;
    });
    return (result);
    
}

//This is a first function get called after data file reading is completed using ajax call.
function init(data) {
    var color = ["red", "black", "orange", "yellow"]

    //setting up left hand side data filters
    transpose_data = Transpose(data);
    SetFilter(transpose_data);

    //create a regular starplot
    CreateDatapath(svg, data);

    // create a copy of main data array in rarray, at this point rarray and data array are two arrays with same exact data copy.
    // In javascript a copy of array cannot be created like rarray = data, because this will just assign reference of data.
    //if we try to manipulate rarray then data array will also change so we copy data using following code. Again this is a standard code on internet
    rarray = data.map(function (arr) {
        return arr.slice();
    });
}

//Reset plot will remove all the svg elements and again redraw the starplot.
function ResetPlot() {
    $(Axisgroup).remove();
    $(circlegroup).remove();
    $(background).remove();
    if (window.foreground)
        $(foreground).remove();
    CreateDatapath(svg, data);
}

//This function will normalize data. Idea behind nomalization is that, find maximum data value in a dimension and then divide every datavalue of that column 
// by maximum value. By doing this we can normalize data between 0 and 1. 
function NormalizeData(data, dimensions) {
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

// This function will draw inner and outer ring circles. This functions is called when creteAxis function is executing.
function circle(svg, level, tempradius) {
    var circle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    // if Shited Origin checkbox is checked and but starplot level is 1 then use following code
    if (($('#cbox:checked').length) > 0 && (level == 1)) {
        $(circle1).attr({ "cx": x_center, "cy": y_center, "r": tempradius * (innerRadius/100), "stroke": "#666563", "stroke-width": 1, "fill": "none" })
        $(circlegroup).append(circle1);
    }
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    $(circle).attr({ "cx": x_center, "cy": y_center, "r": tempradius * level, id: "circle_" + level, "stroke": "#666563", "stroke-width": 1, "fill": "none" })
    $(circlegroup).append(circle);
}

//This function will create starplot Axes. 
function CreateAxis(svg, dimensions, tempradius) {

    //create Axisgroup svg element to while we will attach our starplot. Attach this axisgroup to svg variable
    Axisgroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.append(Axisgroup);

    //initial plot parameters
    var levelofplotting = 1; // this variable increment depends upon which level is currently being drawn
    var axisLabelCounter = 1;
    var totaldimensioncounted = 0; //We need to keep track of total dimensions are currently drawn.
    for (i = 1; i <= totalplotlevels; i++) {

        // calculate dimensioncount using the formula. In last plot level take all the dimensionas which are remaining
        if (i < totalplotlevels) {
            dimensioncount = dimensions * levelofplotting / (totalplotlevels * totalplotlevels); //counting dimensions
            dimensioncount = Math.floor(dimensioncount);
            totaldimensioncounted = totaldimensioncounted + dimensioncount;
        }
        else {
            dimensioncount = dimensions - totaldimensioncounted;
        }

        //We need to shift the origin depends upon the plot level.
        origin = ((i <= 1 && ($('#cbox:checked').length > 0)) ? (innerRadius/100) : 0);  //Shifting origin

        for (j = 1; j <= (dimensioncount) ; j++) {

            var theta = (j / dimensioncount) * Math.PI * 2;
            x = x_center + Math.cos(theta) * tempradius * (i - 1) + Math.cos(theta) * tempradius * origin;
            y = y_center + Math.sin(theta) * tempradius * (i - 1) + Math.sin(theta) * tempradius * origin;

            var cos_theta = x_center + Math.cos(theta) * tempradius * i;
            var sin_theta = y_center + Math.sin(theta) * tempradius * i;
            newpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            newpath.setAttributeNS(null, "id", "axisid_" + j);
            newpath.setAttributeNS(null, "class", "axis");
            newpath.setAttributeNS(null, "d", "M" + (x) + " " + (y) + "L" + cos_theta + " " + sin_theta);

            $(Axisgroup).append(newpath);
            //Here label is a dimension number.
            label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("class", "label")
            if (sin_theta < y) {
                label.setAttributeNS(null, "x", cos_theta + 2);
                label.setAttributeNS(null, "y", sin_theta - 5);
            }
            else{
                label.setAttributeNS(null, "x", cos_theta + 2);
                label.setAttributeNS(null, "y", sin_theta +5);
            }
            
            label.textContent = farray[axisLabelCounter];
            $(Axisgroup).append(label);
            axisLabelCounter++;
        }
        circle(svg, i, tempradius);
        levelofplotting = 2 * i + 1;
    }
}

// This function will create background starplot
function CreateDatapath(svg, data) {
    //calculating a radius
    var tempradius;
    if (totalplotlevels > 1) {
        tempradius = (radius / totalplotlevels);
        
    }
    else {
        tempradius = radius;
    }
    
    //calculating dimensions. 
    dimensions = data[0].length - 1;

    //creating circle
    circlegroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.append(circlegroup);

    //createAxis function is called
    CreateAxis(svg, dimensions, tempradius);

    //then data normalization happens

    normalize_data = NormalizeData(data, dimensions);//normalize data between 1 and 0
    background = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.append(background);

    //background svg element is created with class name background.
    background.setAttributeNS(null, "class", "background");
        var levelofplotting = 1;
        dp = 0;   //dimensionposition
        var totaldimensioncounted = 0;
    //Once all the dimension axes are plotted then for every plot level draw each data point.
    for (k = 1; k <= totalplotlevels; k++) {
        if (k < totalplotlevels) {
            dimensioncount = dimensions * levelofplotting / (totalplotlevels * totalplotlevels); //counting dimensions
            dimensioncount = Math.floor(dimensioncount);
            totaldimensioncounted = totaldimensioncounted + dimensioncount;
        }
        else {
            dimensioncount = dimensions - totaldimensioncounted;
        }
        origin = ((k <= 1 && ($('#cbox:checked').length > 0)) ? (innerRadius/100 + 0.1) : 0);  //Shifting origin by 10px more than inner radius

        // For each plot level draw all the datapoints. To understand following code read how to a ldraw ine using two points in svg on internet.
        for (i = 1; i < normalize_data.length; i++) {

            var newpath, dataline;
            newpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            newpath.setAttributeNS(null, "name", "dataid_" + i);
            newpath.setAttributeNS(null, "class", "data");
            newpath.setAttributeNS(null, "opacity", 0.5);
            newpath.setAttributeNS(null, "fill", "none");
            newpath.setAttributeNS(null, "shape-rendering", "geometricPrecision");
            
            dataline = "M";
                    
            for (j = 1; j <= (dimensioncount) ; j++) {
                var theta = (j / dimensioncount) * Math.PI * 2;
                var cos_theta, sin_theta;
                
                x = x_center + Math.cos(theta) * (tempradius + 5) * (k - 1) + Math.cos(theta) * (tempradius) * origin;// moving to point where graph can begin
                y = y_center + Math.sin(theta) * (tempradius + 5) * (k - 1) + Math.sin(theta) * (tempradius) * origin;

                if (j < 2) {
                    cos_theta = x + Math.cos(theta) * Math.abs(normalize_data[i][dp + j] - origin) * (tempradius - 20);
                    sin_theta = y + Math.sin(theta) * Math.abs(normalize_data[i][dp + j] - origin) * (tempradius - 20);
                    dataline = dataline + cos_theta + " " + sin_theta;

                    legendLabels = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    legendLabels.setAttribute("class", "data");
                    legendLabels.setAttributeNS(null, "x", cos_theta);
                    legendLabels.setAttributeNS(null, "y", sin_theta);
                    legendLabels.textContent = normalize_data[i][dp + j];
                    
                }
                else {
                    cos_theta = x + Math.cos(theta) * Math.abs(normalize_data[i][dp + j] - origin) * (tempradius - 20);
                    sin_theta = y + Math.sin(theta) * Math.abs(normalize_data[i][dp + j] - origin) * (tempradius - 20);
                    dataline = dataline + "L" + cos_theta + " " + sin_theta;
                   
                }

            }
            newpath.setAttributeNS(null, "stroke", "#F0FFF0")
            newpath.setAttributeNS(null, "d", dataline + "z");
            $(background).append(newpath);
        }
        dp = dp + dimensioncount;
                
        levelofplotting = 2 * k + 1;
    }
}

// This function will create foreground starplot similar CreateDatapath background datapath
function CreateDatapath1(svg, subset_data) {

    var tempradius;
    if (totalplotlevels > 1) {
        tempradius = (radius / totalplotlevels);

    }
    else {
        tempradius = radius;
    }

    dimensions = subset_data[0].length - 1;
    //creating circle
    circlegroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.append(circlegroup);
    CreateAxis(svg, dimensions, tempradius);
    color = getRandomColor();

    var normalize_data = subset_data.map(function (arr) {
        return arr.slice();
    });  //copying data to normalize_data array so that subset_data array remains untouched

    for (i = 1; i <= dimensions; i++) {
        var max = 0, min = 1, sum = 0;
        for (j = 1; j < rarray.length; j++) {
            max = Math.max(max, rarray[j][i]);
        }
        for (j = 1; j < subset_data.length; j++) {
            normalize_data[j][i] = (subset_data[j][i] / max).toFixed(2);
        }
    }

    foreground = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.append(foreground);
    foreground.setAttributeNS(null, "class", "foreground");
    var levelofplotting = 1;
    dp = 0;   //dimensionposition
    var totaldimensioncounted = 0;
    for (k = 1; k <= totalplotlevels; k++) {
        if (k < totalplotlevels) {
            dimensioncount = dimensions * levelofplotting / (totalplotlevels * totalplotlevels); //counting dimensions
            dimensioncount = Math.floor(dimensioncount);
            totaldimensioncounted = totaldimensioncounted + dimensioncount;
        }
        else {
            dimensioncount = dimensions - totaldimensioncounted;
        }

        origin = ((k <= 1 && ($('#cbox:checked').length > 0)) ? (innerRadius/100) : 0);  //Shifting origin
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
                x = x_center + Math.cos(theta) * (tempradius + 5) * (k - 1) + Math.cos(theta) * tempradius * origin;// moving to point where graph can begin
                y = y_center + Math.sin(theta) * (tempradius + 5) * (k - 1) + Math.sin(theta) * tempradius * origin;
                count_datapoint = 0;
                

                if (j < 2) {
                    cos_theta = x + Math.cos(theta) * Math.abs(normalize_data[i][dp + j] - origin) * (tempradius - 20);
                    sin_theta = y + Math.sin(theta) * Math.abs(normalize_data[i][dp + j] - origin) * (tempradius - 20);
                    dataline = dataline + cos_theta + " " + sin_theta;
                }
                else {
                    cos_theta = x + Math.cos(theta) * Math.abs(normalize_data[i][dp + j] - origin) * (tempradius - 20);
                    sin_theta = y + Math.sin(theta) * Math.abs(normalize_data[i][dp + j] - origin) * (tempradius - 20);
                    dataline = dataline + "L" + cos_theta + " " + sin_theta;
                }
                
            }


            newpath.setAttributeNS(null, "stroke", color)
            newpath.setAttributeNS(null, "d", dataline + "z");
            $(foreground).append(newpath);
        }
        dp = dp + dimensioncount;

        levelofplotting = 2 * k + 1;
    }

}

