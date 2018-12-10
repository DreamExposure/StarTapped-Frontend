function signIn() {
	var bodyRaw = {
		"email": document.getElementById("sign-in-email").value,
		"password": document.getElementById("sign-in-password").value,
		"gcap": grecaptcha.getResponse()
	};

	$.ajax({
		url: "https://api.startapped.com/v1/account/login",
		headers: {
			"Content-Type": "application/json"
		},
		method: "POST",
		dataType: "json",
		data: JSON.stringify(bodyRaw),
		success: function (data) {
			window.location.replace("/account");
		},
		error: function (jqXHR, textStatus, errorThrown) {
			showSnackbar(jqXHR.responseText);

			grecaptcha.reset();
		}
	});
}