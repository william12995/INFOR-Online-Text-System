let fileSelect1 = document.getElementById("fileSelect1");
let fileElem1 = document.getElementById("fileElem1");
let fileSelect2 = document.getElementById("fileSelect2");
let fileElem2 = document.getElementById("fileElem2");
let dropbox = document.getElementById("fileSelect1");

function handleFiles1(files) {
	var formData = new FormData();

	let file = files[0];
	console.log('1', file);
	formData.append('file', file);
	fileSelect1.innerText = file.name;
	var xhr = new XMLHttpRequest();

	// your url upload
	xhr.open('post', '/uploadfile', true);

	xhr.upload.onprogress = function (e) {
		if (e.lengthComputable) {
			var percentage = (e.loaded / e.total) * 100;
			console.log(percentage + "%");
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
	// upload_file(file);
	// fileUpload(file);
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

uploader.addEventListener("click", (e) => {
	if (fileElem2 && e.target.id == 'fileSelect2') {
		fileElem2.click();
	}
	e.preventDefault();
}, false);

// dropbox.addEventListener("dragenter", noop(e), false);
// dropbox.addEventListener("dragexit", noop(e), false);
// dropbox.addEventListener("dragover", nnop(e), false);
// dropbox.addEventListener("drop", (e) => {
//     e.stopPropagation();
//     e.preventDefault();
//
//     var dt = e.dataTransfer;
//     var files = dt.files;
//
//     console.log('drop!');
//     handleFiles(files);
// }, false);
//
// function noop(e) {
//     e.stopPropagation();
//     e.preventDefault();
// }

// function upload_file(file) {
//     var reader = new FileReader();
//     // var info = {
// 	// 	name: file.name,
// 	// 	size: file.size,
// 	// 	type: file.type,
// 	// };
//     // xhr.setRequestHeader('X-sampleWeb-fileinfo', JSON.stringify(info));
//     reader.onload = function (e) {
//
//         var data = e.target.result;
//         //https://gist.github.com/HenrikJoreteg/2502497
//         //以XHR上傳原始格式
//         $.ajax({
//             type: "POST",
//             url: "uploadfile",
//             contentType: "application/octect-stream",
//             processData: false, //不做任何處理，只上傳原始資料
//             data: data,
//             xhr: function () {
//                 //建立XHR時，加掛onprogress事件
//                 var xhr = $.ajaxSettings.xhr();
//                 // xhr.upload.onprogress = function (evt) {
//                 //     file.uploadedBytes(evt.loaded);
//                 // };
//                 return xhr;
//             }
//         });
//     };
//     reader.readAsArrayBuffer(file);

// var reader = new FileReader();
// var info = {
// 	name: file.name,
// 	size: file.size,
// 	type: file.type,
// };
// console.log(info);
// var xhr = new XMLHttpRequest();
// xhr.open("POST", "/uploadfile", true);
// xhr.setRequestHeader('X-sampleWeb-fileinfo', JSON.stringify(info));
// xhr.send(file);
// xhr.onreadystatechange = function () {
// 	if (this.readyState == 4) {
// 		if (this.status == 200) {
// 			// so far so good
// 		} else {
// 			// fetched the wrong page or network error...
// 		}
// 	}
// };
// }

// $(function () {
// 	function viewModel() {
// 		var self = this;
// 		self.files = ko.observableArray();
// 		self.selectorChange = function (item, e) {
// 			self.files.removeAll();
// 			$.each(e.target.files, function (i, file) {
// 				//加入額外屬性
// 				file.uploadedBytes = ko.observable(0); //已上傳Bytes
// 				file.percentage = ko.computed(function () { //上傳百分比
// 					return (file.uploadedBytes() * 100 / file.size).toFixed(1);
// 				});
// 				file.widthStyle = ko.computed(function () {
// 					return "right:" + (100 - file.percentage()) + "%";
// 				});
// 				//上傳進度數字顯示
// 				file.progress = ko.computed(function () {
// 					var perc = file.percentage();
// 					return file.uploadedBytes.peek() + "/" + file.size +
// 						"(" + perc + "%)";
// 				});
// 				file.message = ko.observable();
// 				file.status = ko.computed(function () {
// 					var msg = file.message(),
// 						perc = file.percentage();
// 					if (msg) return msg;
// 					if (perc == 0) return "Waiting";
// 					else if (perc == 100) return "Done";
// 					else return "Uploading...";
// 				});
// 				self.files.push(file);
// 			});
// 		};
// 		self.upload = function () {
// 			$.each(self.files(), function (i, file) {
// 				var reader = new FileReader();
// 				reader.onload = function (e) {
// 					var data = e.target.result;
// 					//https://gist.github.com/HenrikJoreteg/2502497
// 					//以XHR上傳原始格式
// 					$.ajax({
// 						type: "POST",
// 						url: "uploadfile",
// 						contentType: "application/octect-stream",
// 						processData: false, //不做任何處理，只上傳原始資料
// 						data: data,
// 						xhr: function () {
// 							//建立XHR時，加掛onprogress事件
// 							var xhr = $.ajaxSettings.xhr();
// 							xhr.upload.onprogress = function (evt) {
// 								file.uploadedBytes(evt.loaded);
// 							};
// 							return xhr;
// 						}
// 					});
// 				};
// 				reader.readAsArrayBuffer(file);
// 			});
// 		};
// 	}
// 	var vm = new viewModel();
// 	ko.applyBindings(vm);
// });
