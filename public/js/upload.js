var fileSelect1 = document.getElementById("fileSelect1");
var fileElem1 = document.getElementById("fileElem1");
var fileSelect2 = document.getElementById("fileSelect2");
var fileElem2 = document.getElementById("fileElem2");
var pg = document.getElementById("progressBar");
var fs = document.getElementById("fileSelect");
var close = document.getElementById("close");

// let widget = document.createElement('div');
// widget.innerHTML = '<input type="file" name="pdf" id="fileElem1" class="form-control" onchange="upload(this.files)" style="display:none"><a href="#" id="fileSelect1" class="btn" style="width:80%;background-color:#ddd;text-transform:none">+</a>';

function handleFiles1(files) {
	console.log('1', files.length);
    let file = files[0];
    $('#fileSelect').hide();
	$('#title').text('Uploading ' + file.name);
    $('#progressBar').show();
    uploadFile(file);
	$('#progressBar').hide();
	$('#title').text('Succeed');
	$('#close').show();
}

function handleFiles2(files) {
	console.log('2', files.length);
	fileSelect2.innerText = files[0].name;
}

fileSelect1.addEventListener("click", (e) => {
	console.log(e.target.id);
	if (fileElem1 && e.target.id == 'fileSelect1') {
		fileElem1.click();
	}
	e.preventDefault();
}, false);

fileSelect2.addEventListener("click", (e) => {
	console.log(e.target.id);
	if (fileElem2 && e.target.id == 'fileSelect2') {
		fileElem2.click();
	}
	e.preventDefault();
}, false);

function uploadFile(file) {
    var formData = new FormData();
    formData.append('file', file);
	var xhr = new XMLHttpRequest();

	// your url upload
	xhr.open('post', '/uploadfile', true);

	xhr.upload.onprogress = function (e) {
        let percentage;
		if (e.lengthComputable) {
			percentage = ((e.loaded / e.total) * 100).toString() + '%';
            $('#percentage').css('width', percentage);
			console.log(percentage );
		}
	};

	xhr.onerror = function (e) {
		console.log('Error');
		console.log(e);
	};
	xhr.onload = function () {
		console.log(this.statusText);
	};

    console.log(formData);
    $('#percentage').css('width', '100%');
	xhr.send(formData);
}
