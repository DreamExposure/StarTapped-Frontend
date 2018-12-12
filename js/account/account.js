function updateEmail() {
	var bodyRaw = {
		"email": document.getElementById("update-email-email").value,
		"password": document.getElementById("update-email-password").value,
		"gcap": grecaptcha.getResponse(1)
	};

	$.ajax({
		url: "https://api.startapped.com/v1/account/update",
		headers: {
			"Content-Type": "application/json",
			"Authorization_Access": getCredentials().access,
			"Authorization_Refresh": getCredentials().refresh
		},
		method: "POST",
		dataType: "json",
		data: JSON.stringify(bodyRaw),
		success: function (json) {
			grecaptcha.reset();
			$('#modal-update-email').modal('hide');
			showSnackbar(json.message);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			showSnackbar(JSON.parse(jqXHR.responseText).message);
			grecaptcha.reset();
		}
	});
}

function updatePassword() {
	var bodyRaw = {
		"old_password": document.getElementById("update-password-current").value,
		"password": document.getElementById("update-password-new").value,
		"gcap": grecaptcha.getResponse(0)
	};

	$.ajax({
		url: "https://api.startapped.com/v1/account/update",
		headers: {
			"Content-Type": "application/json",
			"Authorization_Access": getCredentials().access,
			"Authorization_Refresh": getCredentials().refresh
		},
		method: "POST",
		dataType: "json",
		data: JSON.stringify(bodyRaw),
		success: function (json) {
			//Delete cookies and use new credentials
			removeCredentials();
			saveCredentials(json.credentials, true);

			grecaptcha.reset();
			$('#modal-update-password').modal('hide');

			showSnackbar(json.message);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			showSnackbar(JSON.parse(jqXHR.responseText).message);
			grecaptcha.reset();
		}
	});
}

function updateSafeSearch() {
	var bodyRaw = {
		"safe_search": document.getElementById("update-safe-search").checked
	};

	$.ajax({
		url: "https://api.startapped.com/v1/account/update",
		headers: {
			"Content-Type": "application/json",
			"Authorization_Access": getCredentials().access,
			"Authorization_Refresh": getCredentials().refresh
		},
		method: "POST",
		dataType: "json",
		data: JSON.stringify(bodyRaw),
		success: function (json) {
			showSnackbar(json.message);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			showSnackbar(JSON.parse(jqXHR.responseText).message);
		}
	});
}

function initOnLoad() {
	initOnDashboard();

	$.ajax({
		url: "https://api.startapped.com/v1/account/get",
		headers: {
			"Content-Type": "application/json",
			"Authorization_Access": getCredentials().access,
			"Authorization_Refresh": getCredentials().refresh
		},
		method: "POST",
		dataType: "json",
		success: function (json) {
			document.getElementById("update-safe-search").checked = json.account.safe_search;
		},
		error: function (jqXHR, textStatus, errorThrown) {
			showSnackbar(JSON.parse(jqXHR.responseText).message)
		}
	});
}

function checkPasswordValidity(input) {
	if (input.value !== document.getElementById("update-password-new").value) {
		input.setCustomValidity("Passwords must match!");
	} else {
		input.setCustomValidity("");
	}
}