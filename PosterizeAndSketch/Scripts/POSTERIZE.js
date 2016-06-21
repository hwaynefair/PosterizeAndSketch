
var colorList = []; //This will hold all our colors 

 
function posterizeIt(waynescanvas, img) {
    params = getFilterParameters();
    var buffer = waynescanvas;
// get the canvas context
var c = buffer.getContext('2d');
    // quick access to original element
    //var ref = toFilter[current];

    // original image copy naming convention
   
    // set buffer dimensions to image dimensions
    c.width = buffer.width;
    c.height = buffer.height;
    var filterType = "";

    if (c) {
        // create the temporary pixel array we'll be manipulating
        var pixels = initializeBuffer(c);

        if (pixels) {
       
            if (filterType == "filter-blur") {
                pixels = gaussianBlur(img, pixels, 1);
            }
            else {
            for (var i = 0, data = pixels.data, length = data.length; i < length >> 2; i++) {
                index = i << 2;

                // get each colour value of current pixel
                var thisPixel = { r: data[index], g: data[index + 1], b: data[index + 2] };

             
                // the biggie: if we're here, let's get some filter action happening
                pixels = applyFilters(pixels, index, thisPixel, c, params, "filter-posterize");
            }
            }



            // redraw the pixel data back to the working buffer


        //    var gcs = getColors(pixels.data);
 
            c.putImageData(pixels, 0, 0);


            // stash a copy and let the original know how to reference it
            //stashOriginal(img, originalSuffix, ref, buffer);

        }
    }


    function applyFilters(pixels, index, thisPixel, c, paramsapplyParams, filterType) {

    // speed up access
    var data = pixels.data;
    //var imgWidth = c.width;
    switch (filterType) {
 
 

     case "filter-posterize":
                data = setRGB(data, index,
					findColorDifference
                    (params.posterizeOpacity, parseInt(params.posterizeValues * parseInt(thisPixel.r / params.posterizeAreas)), thisPixel.r),
					findColorDifference(params.posterizeOpacity, parseInt(params.posterizeValues * parseInt(thisPixel.g / params.posterizeAreas)), thisPixel.g),
					findColorDifference(params.posterizeOpacity, parseInt(params.posterizeValues * parseInt(thisPixel.b / params.posterizeAreas)), thisPixel.b));

                break;
    }

    return (pixels);

};










function findColorDifference(dif, dest, src) {
    return (dif * dest + (1 - dif) * src);
};

function setRGB(data, index, r, g, b) {
    data[index] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    return data;
};

function initializeBuffer(c) {
    // clean up the buffer between iterations
    //////////////////////  c.clearRect(0, 0, c.width, c.height);
    // make sure we're drawing something
    if (c.width > 0 && c.height > 0) {

        // console.log(img.width, img.height, c.width, c.height);

        try {

            return (c.getImageData(0, 0, c.width, c.height));

        } catch (err) {
            // it's kinda strange, I'm explicitly checking for width/height above, but some attempts
            // throw an INDEX_SIZE_ERR as if I'm trying to draw a 0x0 or negative image, as per 
            // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#images
            //
            // AND YET, if I simply catch the exception, the filters render anyway and all is well.
            // there must be a reason for this, I just don't know what it is yet.
            //
            // console.log("exception: " + err);
        }
    }

};


function getFilterParameters() {

    // create the params object and set some default parameters up front
    var params = {
        "blurAmount": 1,		// 0 and higher
        "edgesAmount": 0,		// between 0 and 1
        "embossAmount": 1,	// between 0 and 1
        "greyscaleOpacity": 1,		// between 0 and 1
        "matrixAmount": 1,		// between 0 and 1
        "mosaicOpacity": 1,		// between 0 and 1
        "mosaicSize": 5,		// 1 and higher
        "noiseAmount": 0,		// 0 and higher
        "noiseType": "mono",	// mono or color

        "posterizeAmount": 10,		// 0 - 255, though 0 and 1 are relatively useless

        "posterizeOpacity": 1,		// between 0 and 1
        "sepiaOpacity": 0,		// between 0 and 1
        "sharpenAmount": 0,	// between 0 and 1
        "tintColor": "#FFF",	// any hex color
        "tintOpacity": 0		// between 0 and 1
    };



    // Posterize requires a couple more generated values, lets keep them out of the loop
    params['posterizeAreas'] = 256 / params.posterizeAmount;
    params['posterizeValues'] = 255 / (params.posterizeAmount - 1);

    return (params);
};



function getColors(canvasData) {
   
    var data = canvasData;

    // quickly iterate over all pixels
    for (var i = 0, n = data.length; i < n; i += 4) {
        var r = data[i];
        var g = data[i + 1];
        var b = data[i + 2];
        //If you need the alpha value it's data[i + 3]
        var hex = "rgb(" + r + "," + g + "," + b + ")";
        if ($.inArray(hex, colorList) == -1) {
 
            colorList.push(hex);
        }
    }
    return colorList;
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}



}

