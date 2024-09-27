
/*export*/ function create (title, url, content=[], time=new Date()){
	
	function n(num) { num = num.toString(); if (num.length < 2) return '0' + num; return num; }
	
var data = `\
<time>`+ time.getFullYear()+"-"+n(time.getMonth()+1)+"-"+n(time.getDate()) +" "+ n(time.getHours())+':'+n(time.getMinutes())+':'+n(time.getSeconds())+".000 GMT+"+(-time.getTimezoneOffset()/60) +`</time>
<p>`+ title +`</p>
<a>`+ url +`</a>
`;

	for (const c of content){ // content can be: canvas element, [data url, File()] -- img, [video, html, file]
		
		if(c.tagName == "CANVAS") { // <img>  ...should always come as canvas so the image can be compressed
			if ( c.getContext('2d').getImageData(0, 0, c.width, c.height).data.some(channel => channel !== 0) ){
				data += "<img>data:"+c.toDataURL('image/webp', 0.6)+"</img>\n";
			}
		}
		
	}
	
	return data;
}


/*export*/ function render (data){
	
	data = data.split("\n");
	
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
	}
	
	let body = document.createElement("body");
	body.style = "display: inline-grid; padding: 20px;";
	for (const c of content){
		body.appendChild(c);
	}
	
	return body;
}