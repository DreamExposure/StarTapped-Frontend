function saveCredentials(json) {
	//Set defaults...
	cookie.defaults.secure = true;
	cookie.defaults.domain = "www.startapped.com";


	if (document.getElementById("sign-in-remember").checked) {
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

		//TODO: Re auth with new keys, then redirect.
		window.location.replace("/dashboard");
	}
}

function initOnDashboard() {
	if (cookie.get("access") == null) {
		//User is logged out
		window.location.replace("/");
	}
}