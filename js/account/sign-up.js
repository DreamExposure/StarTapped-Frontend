function signUp() {
	var bodyRaw = {
		"email": document.getElementById("sign-up-email").value,
		"username": document.getElementById("sign-up-username").value,
		"password": document.getElementById("sign-up-password").value,
		"birthday": document.getElementById("sign-up-birthday").value,
		"gcap": grecaptcha.getResponse(1)
	};

	$.ajax({
		url: "https://api.startapped.com/v1/account/register",
		headers: {
			"Content-Type": "application/json"
		},
		method: "POST",
		dataType: "json",
		data: JSON.stringify(bodyRaw),
		success: function (json) {
			//Save credentials
			saveCredentials(json.credentials);

			window.location.replace("/account/create-blog");
		},
		error: function (jqXHR, textStatus, errorThrown) {
			showSnackbar(JSON.parse(jqXHR.responseText).message);
			grecaptcha.reset();
		}
	});
}

function checkPasswordValidity(input) {
	if (input.value !== document.getElementById("sign-up-password").value) {
		input.setCustomValidity("Passwords must match!");
	} else {
		input.setCustomValidity("");
	}
}