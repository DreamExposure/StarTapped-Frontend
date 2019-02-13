let encodedFiles = new Map();

function encodeImageFileAsBase64(element) {

	let filesSelected = element.files;
	if (filesSelected.length > 0) {
		let fileToLoad = filesSelected[0];

		if (validateFileSize(element)) {

			let fileReader = new FileReader();

			fileReader.onload = function (fileLoadedEvent) {
				let srcData = fileLoadedEvent.target.result; // <--- data: base64

				let result = {
					type: srcData.split(",")[0].split(":")[1].split(";")[0],
					name: element.value.split(/([\\/])/g).pop(),
					encoded: srcData.split(",")[1]
				};
				removeEncodedResults(element.id); //Just in case the user changes the image
				encodedFiles.set(element.id, result);
			};
			fileReader.readAsDataURL(fileToLoad);
		}
	}
}

function encodeFileAsBase64WithId(element, id) {

	let filesSelected = element.files;
	if (filesSelected.length > 0) {
		let fileToLoad = filesSelected[0];

		if (validateFileSize(element)) {

			let fileReader = new FileReader();

			fileReader.onload = function (fileLoadedEvent) {
				let srcData = fileLoadedEvent.target.result; // <--- data: base64

				let result = {
					type: srcData.split(",")[0].split(":")[1].split(";")[0],
					name: element.value.split(/([\\/])/g).pop(),
					encoded: srcData.split(",")[1]
				};
				removeEncodedResults(id); //Just in case the user changes the image
				encodedFiles.set(id, result);
			};
			fileReader.readAsDataURL(fileToLoad);
		}
	}
}

function getEncodedResults(id) {
	if (encodedFiles.has(id)) {
		return encodedFiles.get(id);
	}
	return null;
}

function removeEncodedResults(id) {
	if (encodedFiles.has(id)) {
		encodedFiles.delete(id);
	}
}

function hasEncodedResults(id) {
	return encodedFiles.has(id);
}

function validateFileSize(file) {
	let FileSize = file.files[0].size / 1024 / 1024;
	if (FileSize > 10) {
		showSnackbar("File is too big! (Max 10 MB)");
		$(file).val('');

		return false;
	} else {
		return true;
	}
}