
/*export*/ function create (title, url, content=[], time=new Date()){
	
	function n(num) { num = num.toString(); if (num.length < 2) return '0' + num; return num; }
	
var data = `\
<time>`+ time.getFullYear()+"-"+n(time.getMonth()+1)+"-"+n(time.getDate()) +" "+ n(time.getHours())+':'+n(time.getMinutes())+':'+n(time.getSeconds())+".000 GMT+"+(-time.getTimezoneOffset()/60) +`</time>
<p>`+ title +`</p>
<a>`+ url +`</a>
`;

	for (const c of content){ // content can be: canvas element, File() object; is converted to types: img, video, file, html
		
		if (c instanceof File) { // File() object
			// asynchronous (would break too much things now)
			/*const reader = new FileReader();
			reader.onload = () => {
				let cc = c.name+":"+reader.result;
				if (cc.includes("data:video/")){
					data += "<video>"+cc.substr(cc.indexOf("data:"))+"</video>\n";
				}
				else if (cc.includes("data:image/")){
					data += "<img>"+cc.substr(cc.indexOf("data:"))+"</img>\n";
				}
				else if (cc.includes("data:text/html")){
					data += "<html>"+cc.substr(cc.indexOf("data:"))+"</html>\n";
				}
				else {
					data += "<file>"+cc+"</file>\n";
				}
			};
			reader.readAsDataURL(c);*/
			
			// synchronous (from https://stackoverflow.com/questions/17068610/read-a-file-synchronously-in-javascript)
			readSyncDataURL=function(file){
				var url=URL.createObjectURL(file);//Create Object URL
				var xhr=new XMLHttpRequest();
				xhr.open("GET",url,false);//Synchronous XMLHttpRequest on Object URL
				xhr.overrideMimeType("text/plain; charset=x-user-defined");//Override MIME Type to prevent UTF-8 related errors
				xhr.send();
				URL.revokeObjectURL(url);
				var returnText="";
				for (var i=0;i<xhr.responseText.length;i++){
				returnText+=String.fromCharCode(xhr.responseText.charCodeAt(i)&0xff);};//remove higher byte
				return "data:"+file.type+";base64,"+btoa(returnText);//Generate data URL
			}
			
			let cc = c.name+":"+readSyncDataURL(c);
			if (cc.includes("data:video/")){
				data += "<video>"+cc.substr(cc.indexOf("data:"))+"</video>\n";
			}
			else if (cc.includes("data:image/")){
				data += "<img>"+cc.substr(cc.indexOf("data:"))+"</img>\n";
			}
			else if (cc.includes("data:text/html")){
				data += "<html>"+cc.substr(cc.indexOf("data:"))+"</html>\n";
			}
			else {
				data += "<file>"+cc+"</file>\n";
			}
			
		}
		
		if (c.tagName == "CANVAS") { // <img>  ...should always come as canvas so the image can be compressed BUT it would be much better if the image could be file/dataurl and size reduction was done independently on ui
			if ( c.getContext('2d').getImageData(0, 0, c.width, c.height).data.some(channel => channel !== 0) ){
				data += "<img>"+c.toDataURL('image/webp', 0.6)+"</img>\n";
			}
		}
		
	}
	
	return data;
}


/*export*/ function render (data){
	
	data = data.split("\n");  // input is the string of the file
	
	let time = document.createElement("p");
	time.innerText = data[0].substr(data[0].indexOf("<time>")+6,data[0].lastIndexOf("</time>")-6);
	
	let title = document.createElement("p");
	title.innerText = data[1].substr(data[1].indexOf("<p>")+3,data[1].lastIndexOf("</p>")-3);
	
	let url = document.createElement("a");
	url.href = data[2].substr(data[2].indexOf("<a>")+3,data[2].lastIndexOf("</a>")-3);
	url.innerText = url.href;
	
	let content = [time, title, url];
	for (const d of data.slice(3)){
		
		if (d.startsWith("<img>")){
			let e = document.createElement("img");
			e.src = d.substr(d.indexOf("<img>")+5,d.lastIndexOf("</img>")-5);
			e.style = "width: 100%;";
			content.push(e);
		}
		
		else if (d.startsWith("<video>")){
			let e = document.createElement("video");
			e.src = d.substr(d.indexOf("<video>")+7,d.lastIndexOf("</video>")-7);
			e.controls = true;
			e.autoplay = false;
			e.style = "width: 100%;";
			content.push(e);
		}
		
		else if (d.startsWith("<html>")){
			let e = document.createElement("iframe");
			if (d.includes("data:text/html;base64,")){
				e.srcdoc = atob(d.substr(d.indexOf("<html>data:text/html;base64,")+28,d.lastIndexOf("</html>")-28));
			}
			else {
				e.srcdoc = d.substr(d.indexOf("<html>")+6,d.lastIndexOf("</html>")-6);
			}
			e.style = "width: 100%; heigth: 400px;";
			content.push(e);
		}
		
		else if (d.startsWith("<file>")){
			let e = document.createElement("a");
			let tmp = d.substr(d.indexOf("<file>")+6,d.lastIndexOf("</file>")-6);
			if (tmp.startsWith("data:")){
				e.href = tmp;
				e.download = "FILE";
				e.textContent = "FILE";
			}
			else {
				e.href = tmp.substr(tmp.indexOf(":data:")+1);
				e.download = tmp.substr(0, tmp.indexOf(":data:"));
				e.textContent = tmp.substr(0, tmp.indexOf(":data:"));
			}
			content.push(e);
		}
		
	}
	
	let body = document.createElement("body");
	body.style = "display: inline-grid; padding: 20px;";
	for (const c of content){
		body.appendChild(c);
	}
	
	return body;
}