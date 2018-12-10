function signUp() {
	var bodyRaw = {
		"email": document.getElementById("sign-up-email").value,
		"username": document.getElementById("sign-up-username").value,
		"password": document.getElementById("sign-up-password").value,
		"birthday": document.getElementById("sign-up-birthday").value,
		"gcap": grecaptcha.getResponse()
	};

	$.ajax({
		url: "https://api.startapped.com/v1/account/register",
		headers: {
			"Content-Type": "application/json"
		},
		method: "POST",
		dataType: "json",
		data: JSON.stringify(bodyRaw),
		success: function (data) {
			window.location.replace("/account/create-blog");
		},
		error: function (jqXHR, textStatus, errorThrown) {
			showSnackbar(jqXHR.responseText);
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