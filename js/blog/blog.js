function getAllBlogsSelf() {
	var getBlogsBodyRaw = {
		"all": true
	};

	$.ajax({
		url: "https://api.startapped.com/v1/blog/get",
		headers: {
			"Content-Type": "application/json",
			"Authorization_Access": getCredentials().access,
			"Authorization_Refresh": getCredentials().refresh
		},
		method: "POST",
		dataType: "json",
		data: JSON.stringify(getBlogsBodyRaw),
		success: function (json) {
			//TODO: First make sure to clear the container

			//TODO: Actually create the HTML for all the blogs and shit.
		},
		error: function (jqXHR, textStatus, errorThrown) {
			showSnackbar(JSON.parse(jqXHR.responseText).message);
		}
	});
}

function createNewBlog(recapIndex) {
	var bodyRaw = {
		"url": document.getElementById("blog-create-url").value,
		"type": "PERSONAL",
		"gcap": grecaptcha.getResponse(recapIndex)
	};

	$.ajax({
		url: "https://api.startapped.com/v1/blog/create",
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
			$('#modal-create-blog').modal('hide');

			showSnackbar(json.message);

			//Get all the blogs and refresh the page with them...
			getAllBlogsSelf();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			showSnackbar(JSON.parse(jqXHR.responseText).message);
			grecaptcha.reset();
		}
	});
}