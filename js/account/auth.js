function saveCredentials(jsonRaw) {
	//Set defaults...
	cookie.defaults.expires = 7;
	cookie.defaults.secure = true;
	cookie.defaults.domain = "www.startapped.com";

	var json = JSON.parse(jsonRaw);


	cookie.set({
		"auth": "auth",
		"access": json.access_token,
		"refresh": json.refresh_token,
		"expire": json.expire
	});
}

function getCredentials() {
	return {
		"access": cookie.get("access"),
		"refresh": cookie.get("refresh"),
		"expire": cookie.get("expire")
	};
}

function removeCredentials() {
	cookie.remove(['auth', 'access', 'refresh', 'expire']);
}

function initOnLandingPage() {
	//TODO: Remember to remove these debug statements.
	if (cookie.get("access") != null) {
		console.log("user is already logged in.");
		//User is logged in...

		//TODO: Re auth with new keys, then redirect.
		window.location.replace("/dashboard");
	}
	console.log("User not logged in.")
}