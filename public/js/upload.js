var fileSelect1 = document.getElementById("fileSelect1");
var fileElem1 = document.getElementById("fileElem1");
var fileSelect2 = document.getElementById("fileSelect2");
var fileElem2 = document.getElementById("fileElem2");
var pg = document.getElementById("progressBar");
var fs = document.getElementById("fileSelect");
var close = document.getElementById("close");
var count = 0;

// function handleFiles1(files) {
// 	console.log('1', files.length);
// 	fileSelect1.innerText = files[0].name;
// }

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

function handleFiles1(files) {
	console.log('1', files.length);
	let file = files[0];
	$('#here').append('<p id="title' + count.toString() + '" style="font-size:15px;"></p><div id="progressBar' + count.toString() + '" style="display:none"><div class="bs-component"><div class="progress progress-striped active"><div class="progress-bar" style="width:0%" id="percentage' + count.toString() + '"></div></div></div></div>')
	$('#title' + count.toString()).text('正在上傳 ' + file.name);
	$('#progressBar' + count.toString()).show();
	$('#fileName').val($('#fileName').val() + ',' + file.name);
	uploadFile(file, count.toString());
	count ++;
	// $('#progressBar').hide();
	// $('#title').text('Succeed');
	// $('#close').show();
}

function uploadFile(file, id) {
	var formData = new FormData();
	formData.append('file', file);
	var xhr = new XMLHttpRequest();

	// your url upload
	xhr.open('post', '/uploadfile', true);

	let percentage;

	xhr.upload.onprogress = function (e) {
		if (e.lengthComputable) {
			percentage = (e.loaded / e.total) * 100;
			$('#percentage' + id).css('width', (percentage).toString() + '%');
			console.log(percentage);
			if(percentage == 100){
				$('#progressBar' + id).hide();
				console.log('hide: ',id);
				$('#title' + id).text(file.name);
			}
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
	xhr.send(formData);

}
