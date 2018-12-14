function saveCredentials(json, remember) {
	//Set defaults...
	cookie.defaults.secure = true;
	cookie.defaults.domain = "www.startapped.com";


	if (remember) {
		cookie.set({
			"auth": "auth",
			"access": json.access_token,
			"refresh": json.refresh_token,
			"expire": json.expire
		}, {
			secure: true,
			expires: 7
		});
	} else {
		cookie.set({
			"auth": "auth",
			"access": json.access_token,
			"refresh": json.refresh_token,
			"expire": json.expire
		}, {
			secure: true
		});
	}
}

function getCredentials() {
	return {
		"access": cookie.get("access"),
		"refresh": cookie.get("refresh"),
		"expire": cookie.get("expire")
	};
}

function removeCredentials() {
	cookie.removeSpecific(['auth', 'access', 'refresh', 'expire'], { domain: 'www.startapped.com', path: '/' });
}

function initOnLandingPage() {
	if (cookie.get("access") != null) {
		//User is logged in...
		if (parseInt(getCredentials().expire) < Date().now) {
			$.ajax({
				url: "https://api.startapped.com/v1/auth/refresh",
				headers: {
					"Content-Type": "application/json",
					"Authorization_Access": getCredentials().access,
					"Authorization_Refresh": getCredentials().refresh
				},
				method: "POST",
				dataType: "json",
				success: function (json) {
					//Save credentials
					if (json.message === "Success") {
						removeCredentials();
						saveCredentials(json.credentials, true);
					}

					window.location.replace("/dashboard");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					showSnackbar(JSON.parse(jqXHR.responseText).message);
				}
			});
		} else {
			window.location.replace("/dashboard");
		}
	}
}

function initOnDashboard() {
	if (cookie.get("access") == null) {
		//User is logged out
		window.location.replace("/");
	} else {
		//Refresh auth if needed.
		if (parseInt(getCredentials().expire) < Date().now) {
			$.ajax({
				url: "https://api.startapped.com/v1/auth/refresh",
				headers: {
					"Content-Type": "application/json",
					"Authorization_Access": getCredentials().access,
					"Authorization_Refresh": getCredentials().refresh
				},
				method: "POST",
				dataType: "json",
				success: function (json) {
					//Save credentials
					if (json.message === "Success") {
						removeCredentials();
						saveCredentials(json.credentials, true);
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					showSnackbar(JSON.parse(jqXHR.responseText).message);
				}
			});
		}
	}
}