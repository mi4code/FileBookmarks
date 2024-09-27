console.log("file-bookmark");

let data = document.querySelector("pre").innerText;
document.body.replaceWith( render(data) );