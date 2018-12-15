var encodedFiles = new Map();

function encodeImageFileAsBase64(element) {

	var filesSelected = element.files;
	if (filesSelected.length > 0) {
		var fileToLoad = filesSelected[0];

		var fileReader = new FileReader();

		fileReader.onload = function(fileLoadedEvent) {
			var srcData = fileLoadedEvent.target.result; // <--- data: base64

			var result = {
				type: srcData.split(",")[0].split(":")[1].split(";")[0],
				encoded: srcData.split(",")[1]
			};
			removeEncodedResults(element.id); //Just in case the user changes the image
			encodedFiles.set(element.id, result);
		};
		fileReader.readAsDataURL(fileToLoad);
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