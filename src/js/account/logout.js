function logOut() {
	$.ajax({
		url: "https://api.startapped.com/v1/account/logout",
		headers: {
			"Content-Type": "application/json",
			"Authorization_Access": getCredentials().access,
			"Authorization_Refresh": getCredentials().refresh
		},
		method: "POST",
		dataType: "json",
		success: function (json) {
			removeCredentials();

			window.location.replace("/");
		},
		error: function (jqXHR, textStatus, errorThrown) {
			showSnackbar(JSON.parse(jqXHR.responseText).message);
		}
	});
}