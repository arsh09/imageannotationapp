
// Refereces from toolbar pallete
const openFileIcon = document.getElementById("openIcon");
const editIcon = document.getElementById("editIcon");
const cursorIcon = document.getElementById("cursorIcon");
const pencilIcon = document.getElementById("pencilIcon");
const lineIcon = document.getElementById("lineIcon");
const rectangleIcon = document.getElementById("rectangleIcon");
const circleIcon = document.getElementById("circleIcon");
const hexagonIcon = document.getElementById("hexagonIcon");
const allDrawElemets = ['openIcon','editIcon','cursorIcon','pencilIcon', 'lineIcon', 'rectangleIcon', 'circleIcon', 'hexagonIcon'];
var selectedDrawElement = 0;

// Buttons to save SVG file
const downloadSVGBtn = document.getElementById("uploadImage_btn");
var dowloadedFileName = "annotated.svg";

// Get canvas element and make a fabric
var canvas = new fabric.Canvas("imageCanvas" , {"selection": true});
// Set canvas height and widht
canvas.setHeight(750);
canvas.setWidth(872);

// Some variables to draw on canvas properly
var rect, isDown, origX, origY ;
var isDraw = true;
var isEdit = false;
var count = 0;

// These varuiables help in displaying the annotation
// ID and removing the childs from list and on image
var allRectIds = new Array();
var allRectangles = new Map();

/*
Set up onclick event on each toolbar buttons
*/
openFileIcon.addEventListener('click', function() {
  fileInp.click();  // Fire up the hidden input tag
});

// Opens the file and set the background to the selected file
var fileInp = document.getElementById('inputForFiles');
fileInp.addEventListener("change" , function(e) {
  var file = e.target.files[0];
  var filenameArray = (file.name.split('.')[0]) ;
  dowloadedFileName = filenameArray + "_" + dowloadedFileName;


  var reader = new FileReader();
  reader.onload = function (f) {
    var data = f.target.result;
    fabric.Image.fromURL(data,function (img) {
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas),{
           scaleX: canvas.width/img.width,
           scaleY: canvas.height/img.height
         });
       },
     );
  };
  reader.readAsDataURL(file);
  removeAllAnnotationFromImage();
});

editIcon.addEventListener('click', function(){
  isEdit = true;
  isDraw = false;
  canvas.isDrawingMode = false;
  selectedDrawElement = 1;
  onClickGlowOn();
});

cursorIcon.addEventListener('click', function(){
  selectedDrawElement = 2;
  canvas.isDrawingMode = false;
  onClickGlowOn();

  removeAllAnnotationFromImage();
  });

function removeAllAnnotationFromImage(){
  // REMOVES every child of the UL (i.e. all the annotations);
  var all_tags = document.getElementsByTagName("li"); // Get alll list item
  var nlen = all_tags.length;
  var parentList = document.getElementById("myUL");
    if (nlen>0){
      while (parentList.firstChild){
        canvas.remove( allRectangles.get(parentList.firstChild.textContent) );
        allRectangles.delete( (parentList.firstChild.textContent) );
        parentList.removeChild(parentList.firstChild);
        canvas.renderAll();
      }
    }
}

pencilIcon.addEventListener('click', function(){
    selectedDrawElement = 3;
    isDraw = true;
    isEdit = false;
    onClickGlowOn();
});

lineIcon.addEventListener('click', function(){
  selectedDrawElement = 4;
   isDraw = true;
   isEdit = false;
  onClickGlowOn();
});

rectangleIcon.addEventListener('click', function(){
  selectedDrawElement = 5;
   isDraw = true;
   isEdit = false;
  onClickGlowOn();
});

circleIcon.addEventListener('click', function(){
  selectedDrawElement = 6;
   isDraw = true;
   isEdit = false;
  onClickGlowOn();
});

hexagonIcon.addEventListener('click', function(){
  selectedDrawElement = 7;
   isDraw = true;
   isEdit = false;
  onClickGlowOn();
});


// Download the svg file. HEre I used the library FileSaver.min.js
downloadSVGBtn.addEventListener("click", function (){
  saveAs(new Blob([canvas.toSVG()], {type:"application/svg+xml"}), dowloadedFileName)
});

// Some very useful functions for changing the icons glows
// and cursor type
function onClickGlowOn(){
  document.getElementById(allDrawElemets[selectedDrawElement]).classList.add('green-glow')
  for (var i = 0; i < allDrawElemets.length; i++){
    if (i != selectedDrawElement){
      document.getElementById(allDrawElemets[i]).classList.remove('green-glow')
    }
  }
}

canvas.on('mouse:down', function(o) {

  if (isDraw && selectedDrawElement > 3){

    isDown = true;
    var pointer = canvas.getPointer(o.e);
    origX = pointer.x;
    origY = pointer.y;
    var pointer = canvas.getPointer(o.e);

    if (selectedDrawElement == 4){
      rect = new fabric.Line([pointer.x, pointer.y,pointer.x, pointer.y],{
          stroke: "red",
          strokeWidth : 4,
          id: "Annotation: " + count
      });
    }

    if (selectedDrawElement == 5){
      rect = new fabric.Rect({
          left: origX,
          top: origY,
          originX: 'left',
          originY: 'top',
          width: pointer.x-origX,
          height: pointer.y-origY,
          angle: 0,
          fill: 'rgba(255,0,0,0.1)',
          stroke: "red",
          // transparentCorners: true,
          id: "Annotation: " + count
      });
    }

    if (selectedDrawElement == 6){
      rect = new fabric.Circle({
          left: origX,
          top: origY,
          originX: 'center',
          originY: 'center',
          width: Math.pow( (Math.pow((pointer.x - origX),2) + Math.pow((pointer.y-origY),2)),0.5),
          angle: 0,
          fill: 'rgba(255,0,0,0.1)',
          stroke: "red",
          // transparentCorners: true,
          id: "Annotation: " + count
      });
    }
    canvas.add(rect);
  }
});

canvas.on('mouse:move', function(o){

  if (isDraw && selectedDrawElement==3){
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.width = 2;
    canvas.freeDrawingBrush.color = "#ff0000";

  }

  if (isDraw && selectedDrawElement == 4){
    canvas.isDrawingMode = false;
    if (!isDown) return;
    var pointer = canvas.getPointer(o.e);
    rect.set({ x2:  pointer.x });
    rect.set({ y2: pointer.y });
    canvas.renderAll();
  }

  if (isDraw && selectedDrawElement == 5){
    canvas.isDrawingMode = false;
    if (!isDown) return;
    var pointer = canvas.getPointer(o.e);
    if(origX>pointer.x){
        rect.set({ left: Math.abs(pointer.x) });
    }
    if(origY>pointer.y){
        rect.set({ top: Math.abs(pointer.y) });
    }
    rect.set({ width: Math.abs(origX - pointer.x) });
    rect.set({ height: Math.abs(origY - pointer.y) });
    canvas.renderAll();
  }

  if (isDraw && selectedDrawElement == 6){
    canvas.isDrawingMode = false;
    if (!isDown) return;
    var pointer = canvas.getPointer(o.e);
    var r = Math.pow( (Math.pow((origX - pointer.x),2) + Math.pow((origY-pointer.y),2)),0.5);
    rect.set({'radius': r});
    canvas.renderAll();
  }
});

canvas.on("path:created", function(opt){
  opt.path.id = "Annotation: " + count;
  opt.path.selectable = false;
  rect = opt.path;
});

canvas.on('mouse:up', function(o){

  if (selectedDrawElement == 3){
    isDown = false;
    canvas.getObjects().forEach(o => {
      if (o.id == rect.id){
        o.set({"fill":"rgba(255,0,0,0.1)"});
      }
    });
    canvas.renderAll();
    // Adding the annotation in the variable allRectangles (only the specific one)
    if ( !(allRectIds.includes(rect.get("id"))) ){
      addItemInAnnoteList(rect.get("id"))
      allRectangles.set(  rect.get("id") , rect );
      annotationPopUp(rect.get("id"));
    }
    allRectIds.push (rect.get("id"));
    count = count + 1;

  }

  if (isDraw && selectedDrawElement > 3){
  isDown = false;
  // Adding the annotation in the variable allRectangles (only the specific one)
  if ( (rect.get("width") != 0 & rect.get("height") != 0 ) & ! (allRectIds.includes(rect.get("id"))) ){
    addItemInAnnoteList(rect.get("id"))
    allRectangles.set(  rect.get("id") , rect );
    annotationPopUp(rect.get("id"));
  }
  allRectIds.push (rect.get("id"));
  count = count + 1;
  }

});


function exportSVGFile (){
  // var svg = canvas.toSVG();
  //   var data = "data:image/svg+xml," + encodeURIComponent(svg);
  //   console.log(data);
  //   window.open(data);
  // var d=canvas.toDataURL("image/png");
  // var w=window.open('about:blank','image from canvas');
  // w.document.write("<img src='"+d+"' alt='from canvas'/>");
  localStorage.setItem(canvas, canvas.toDataURL);
}

var saveButton = document.getElementById("openIcon");

saveButton.onclick = function(event){
  exportSVGFile();
}

/* FROM HERE CODE LIST of ANNOTATION STARTS */

/* This function adds an item in list for
each annotation in the image */
function addItemInAnnoteList(name){

  // create a img div
  var div_img = document.createElement("div");
  div_img.setAttribute("class", "imgSrc");
  div_img.setAttribute("float", "right");
  // Create the add icon (img tag) on each list item
  var img_li = document.createElement("IMG");
  img_li.setAttribute("src","images/pngs/plus.png");
  img_li.setAttribute("height","25");
  img_li.setAttribute("id","addMe");
  div_img.appendChild(img_li);

  // create a img div
  var div_img2 = document.createElement("div");
  div_img2.setAttribute("class", "imgSrc");
  div_img2.setAttribute("float", "right");
  // Create the add icon (img tag) on each list item
  var img_li1 = document.createElement("IMG");
  img_li1.setAttribute("src","images/pngs/sketchbook.png");
  img_li1.setAttribute("height","25");
  img_li1.setAttribute("id","showMe");
  div_img2.appendChild(img_li1);

  // Create the text node for the list item
  var t = document.createTextNode(name);

  // Create a parent div
  var div_parent = document.createElement("div");
  div_parent.setAttribute("class", "liDiv");
  div_parent.appendChild(div_img);
  div_parent.appendChild(div_img2);

  // div_parent.appendChild(t);

  // Get the list elememt
  var li = document.createElement("li");
  li.appendChild(div_parent);
  li.appendChild(t);

  document.getElementById("myUL").appendChild(li);  // Append the list item in the list element (sorted)
}

/* This function removes the item which
was removed from the canvas*/
function removeItemInAnnoteList(name){
    var all_tags = document.getElementsByTagName("li"); // Get alll list item
    // Search in the list item exactly that item whose name matches where we clicked on the list
    for (var i = 0; i < all_tags.length; i++){
      if (all_tags[i].textContent == name){
        document.getElementById("myUL").removeChild(all_tags[i]);
      }
    }
}


/*  Set up an event trigger on the list as follow*/
function getListItemEvent(e){
  e = e||window.event;
  return e.target || e.srcElement;
}

// This attach a onclick event on the list (for removing and eddting the annotation)
var myUL = document.getElementById("myUL");
myUL.onclick = function(event) {
  // Get the target when a list item is clicked
  var target = getListItemEvent(event);
   // canvas.setActiveObject(canvas.item(0));
   canvas.discardActiveObject();
   canvas.renderAll();

   if (!isDraw && (target.tagName == "LI" || target.tagName == "IMG") )
  {
    if (target.tagName == "IMG"){
      if (target.id == "showMe"){
        showAnnotationPopUp("Annotation");
      }
      target = target.parentElement.parentElement.parentElement;
    }
    // Changing the color
    changeListItemColorOnSelect(target);

    // Get the same elements from the saved annotation array
    // Remember that list items are listed with annotation ID which is also the
    // key values in allRectangles
    var selectedAnnotation = allRectangles.get(target.textContent);

    // Once the element on the canvas is found, we change its
    // evented and selected and stroke color (showing that it can be
    // editted)
    if (selectedAnnotation != undefined){

      canvas.setActiveObject(selectedAnnotation);
      selectedAnnotation.set("selectable", true);
      selectedAnnotation.set("fill", "rgba(0,255,0,0.1)");
      selectedAnnotation.set("stroke", "green");
    }
    // We also need to undo the same thing for previously selected items
    for (let [ key, value] of allRectangles){
      if (target.textContent != key){
        allRectangles.get(key).set("selectable", false);
        allRectangles.get(key).set("fill", "rgba(255,0,0,0.1)");
        allRectangles.get(key).set("stroke", "red");
        canvas.renderAll();
      }

      /*  Delete the annotation using the delete button*/
      var deleteIcon = document.getElementById("deleteIcon");
      deleteIcon.onclick = function (evt){
        if (document.getElementById("myUL").contains(target)){
          document.getElementById("myUL").removeChild(target);
          canvas.remove(selectedAnnotation);
          allRectangles.delete( target.textContent );
          canvas.renderAll();
        }
      }
    }
  }

}

function annotationPopUp(anId){

  const {value: text} =  Swal.fire({
    title: anId,
  input: 'textarea',
  inputPlaceholder: 'Type your annotation here...',
  background: "#fff",
})

if (text) {
  Swal.fire(text)
  console.log(text);
}
console.log(text);
}

function showAnnotationPopUp(text){
  Swal.fire({
    title: 'Description',
    text: text,
    position: 'bottom-end',
    confirmButtonColor: "rgba(0,255,0,0.5)",
  })
}


function changeListItemColorOnSelect(target){

  var all_tags = document.getElementsByTagName("li"); // Get alll list item
  for (var i = 0; i < all_tags.length; i++){
    // console.log(all_tags[i]);
    if (all_tags[i].textContent != target.textContent){
      if (i%2 == 0){
        all_tags[i].style.background = "#f9f9f9";
      }
      else{
          all_tags[i].style.background = "#eee";
      }
    }
     target.style.background = 'rgba(0,255,0,0.4)';
  }
}
