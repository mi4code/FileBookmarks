//import {create} from '../file_bookmarks.js'

if (typeof browser == 'undefined') { browser = chrome;}


function image_from_url(url){
	let canvas = document.querySelector('#betabrowser-bookmark-saver div div').appendChild(document.createElement("canvas"));
	var img = new Image();
	img.crossOrigin="anonymous";
	img.onload = function () {
		var ctx = canvas.getContext('2d');
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);
	};
	img.src = url;
}

function image_from_file(file){
	var fr = new FileReader();
	fr.onload = function(e){
		image_from_url(fr.result);
		//image_from_url( "data:"+file.type+";base64,"+btoa(e.target.result) );
	};
	fr.readAsDataURL(file);
	//fr.readAsBinaryString(file);
}

function image_from_html(element){ // its slow + img too big
	let canvas = document.querySelector('#betabrowser-bookmark-saver div div').appendChild(document.createElement("canvas"));
	canvas.width = element.offsetWidth;
	canvas.height = element.offsetHeight;
	document.querySelector('#betabrowser-bookmark-saver').style.display = "none";
	html2canvas(element, {canvas: canvas}).then(function (canvas) {document.querySelector('#betabrowser-bookmark-saver').style.display = "";});
	// <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
}




document.addEventListener('DOMContentLoaded', function() {

	//console.log("ok");
	//document.querySelector("h1").onclick = function(){chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => { console.log(tabs[0].url); document.querySelector('h1').innerText = tabs[0].url; });};
	
	browser.tabs.query({ active: true, currentWindow: true }).then(function(tabs){
		document.querySelector("#betabrowser-bookmark-saver div #title").value = tabs[0].title;
		document.querySelector("#betabrowser-bookmark-saver div #url").value = tabs[0].url;
	});


	document.querySelector("#betabrowser-bookmark-saver").onpaste = function(e){
		image_from_file( e.clipboardData.files[0] );
	};

	document.querySelector("#betabrowser-bookmark-saver").ondragover = function(e){e.preventDefault();};
	document.querySelector("#betabrowser-bookmark-saver").ondrop = function(e){
		e.preventDefault();
		
		let file_ = null;
		
		if (e.dataTransfer.items) {

			[...e.dataTransfer.items].forEach((item, i) => {
				if (item.kind === "file") {
					file = item.getAsFile();
					file_ = file;
					console.log(`… file[${i}].name = ${file.name}`);
				}
			});
		} 
		else {
			[...e.dataTransfer.files].forEach((file, i) => {
				file_ = file;
				console.log(`… file[${i}].name = ${file.name}`);
			});
		}

		if (file_ != null) { image_from_file( file_ ); }
		else { image_from_url( e.dataTransfer.getData('URL') ); }
	};

	document.querySelector("#betabrowser-bookmark-saver div #save").onclick = function(){ 
	
		let filename = document.querySelector("#betabrowser-bookmark-saver div #title").value+".htmlfb";
		let data = create(document.querySelector("#betabrowser-bookmark-saver div #title").value,document.querySelector("#betabrowser-bookmark-saver div #url").value,document.querySelectorAll("#betabrowser-bookmark-saver div div canvas"));
		
		if (navigator.userAgent.toLowerCase().includes('firefox') && navigator.platform.toLowerCase().includes("android")){
			window.open('data:text/htmlfb;charset=utf-8,' + encodeURIComponent(data), "_blank");
		}
		
		var element = document.createElement('a');
		//element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
		element.setAttribute('href', 'data:text/htmlfb;charset=utf-8,' + encodeURIComponent(data));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);

	};
	
	document.querySelector("#betabrowser-bookmark-saver div #more").onclick = function(){
		
		let input = document.createElement("input");
		input.type = "file";
		input.onchange = function(){
			var fr = new FileReader();
			fr.onload = function(e){
				window.open("","").document.body.replaceWith( render(e.target.result) );
			};
			fr.readAsText(input.files[0]);
		};
		input.click();
		
	};

	document.querySelector("#betabrowser-bookmark-saver div div p").oncontextmenu = function(e) {
		e.preventDefault();
		
		let input = document.createElement("input");
		input.type = "file";
		input.onchange = function(){
			image_from_file(input.files[0]);
		};
		input.click();
	}

});

	
