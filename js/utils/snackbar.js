function showSnackbar(textToDisplay) {
	// Get the snackbar DIV
	let x = document.getElementById("snackbar");
    x.innerText = textToDisplay;

	// Add the "show" class to DIV
	x.className = "show";

	// After 3 seconds, remove the show class from DIV
	setTimeout(function () {
		x.className = x.className.replace("show", "");
	}, 3000);
}

function showLoading() {
	$('.loading-modal').modal('show');
}

function hideLoading() {
	$('.loading-modal').modal('hide');
}