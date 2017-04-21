let fileSelect1 = document.getElementById("fileSelect1");
let fileElem1 = document.getElementById("fileElem1");
let fileSelect2 = document.getElementById("fileSelect2");
let fileElem2 = document.getElementById("fileElem2");

function handleFiles1(files) {
    console.log('1', files[0].name);
    fileSelect1.innerText = files[0].name;
}

function handleFiles2(files) {
    console.log('2', files.length);
    fileSelect2.innerText = files[0].name;
}

fileSelect1.addEventListener("click", (e) => {
    console.log(e.target.id);
    if(fileElem1 && e.target.id == 'fileSelect1'){
        fileElem1.click();
    }
    e.preventDefault();
}, false);

fileSelect2.addEventListener("click", (e) => {
    console.log(e.target.id);
    if(fileElem2 && e.target.id == 'fileSelect2'){
        fileElem2.click();
    }
    e.preventDefault();
}, false);
