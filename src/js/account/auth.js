function saveCredentials(json, remember) {
    //Set defaults...
    cookie.defaults.secure = true;
    cookie.defaults.domain = "startapped.com";


    if (remember) {
        cookie.set({
            "access": json.access_token,
            "refresh": json.refresh_token,
            "expire": json.expire
        }, {
            secure: true,
            expires: 7
        });
    } else {
        cookie.set({
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
    cookie.removeSpecific(['access', 'refresh', 'expire'], {domain: 'startapped.com', path: '/'});
}

function initOnLandingPage() {
	//TODO: Show alert if cookies are blocked!!!

    if (cookie.get("access") != null) {
        //User is logged in..
        $.ajax({
            url: "https://api.startapped.com/v1/auth/refresh",
            headers: {
                "Content-Type": "application/json",
                "Authorization_Access": getCredentials().access,
                "Authorization_Refresh": getCredentials().refresh
            },
            method: "POST",
            dataType: "json",
            success: function (json, xhr) {
                if (xhr.status === 201) {
                //Save credentials
                    removeCredentials();
                    saveCredentials(json.credentials, true);
                }

                window.location.replace("/hub");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showSnackbar(JSON.parse(jqXHR.responseText).message);
            }
        });
    }
}

function initOnHub() {
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
                success: function (json, xhr) {
                    if (xhr.status === 201) {
                        //Save credentials
                        removeCredentials();
                        saveCredentials(json.credentials, true);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    showSnackbar(JSON.parse(jqXHR.responseText).message);
                    removeCredentials();
                    window.location.replace("/")
                }
            });
        }
    }
}

function initOnBlogPage() {
    if (cookie.get("access") == null) {
        //User is logged out
        window.location.replace("https://www.startapped.com");
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
                success: function (json, xhr) {
                    if (xhr.status === 201) {
                        //Save credentials
                        removeCredentials();
                        saveCredentials(json.credentials, true);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    showSnackbar(JSON.parse(jqXHR.responseText).message);
                    removeCredentials();
                    window.location.replace("https://www.startapped.com")
                }
            });
        }
    }
}