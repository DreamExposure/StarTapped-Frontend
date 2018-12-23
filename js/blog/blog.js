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
			var mainContainer = document.getElementById("blog-container");
			//First make sure to clear the container
			while (mainContainer.firstChild) {
				mainContainer.removeChild(mainContainer.firstChild);
			}

			//Actually create the HTML for all the blogs and shit.
			for (var i = 0; i < json.count; i++) {
				var blog = json.blogs[i];

				//Create container....
				var container = document.createElement("div");
				container.className = "column blog-container rounded";
				container.id = "blog-" + blog.id;
				container.style.backgroundColor = blog.background_color;
				mainContainer.appendChild(container);

				//Header image
				var header = document.createElement("img");
				header.className = "blog-header-img rounded-top";
				header.src = blog.background_url;
				container.appendChild(header);

				//Create view link
				var viewButton = document.createElement("a");
				viewButton.className = "text-link-color underline-solid blog-link";
				viewButton.href = blog.complete_url;
				viewButton.target = "_blank";
				viewButton.innerHTML = blog.base_url;
				container.appendChild(viewButton);

				//Create edit button
				var editButton = document.createElement("img");
				editButton.className = "blog-edit-button";
				editButton.setAttribute("data-toggle", "modal");
				editButton.setAttribute("data-target", "#modal-" + blog.id);
				editButton.alt = "Edit";
				editButton.src = "/img/icon/edit_256px.png";
				container.appendChild(editButton);

				//Icon image
				var icon = document.createElement("img");
				icon.className = "blog-profile-img rounded";
				icon.src = blog.icon_url;
				container.appendChild(icon);

				//NSFW badge
				if (blog.nsfw) {
					var nsfw = document.createElement("span");
					nsfw.className = "blog-nsfw-badge badge badge-danger";
					nsfw.innerHTML = "NSFW";
					container.appendChild(nsfw);
				}

				//18+ only badge
				if (!blog.allow_under_18) {
					var under = document.createElement("span");
					under.className = "blog-18-only-badge badge badge-danger";
					under.innerHTML = "18+ Only";
					container.appendChild(under);
				}
				//Age badge
				if (blog.type === "PERSONAL") {
					if (blog.display_age) {
						var age = document.createElement("span");
						age.className = "blog-age-badge badge badge-danger";
						showAgeSelf(age);
						container.appendChild(age);
					}
				}

				//Blog title
				var title = document.createElement("h3");
				title.className = "blog-title text-primary font-weight-bold";
				title.innerHTML = blog.name;
				container.appendChild(title);

				//Blog Description
				var desc = document.createElement("p");
				desc.className = "blog-desc text-dark";
				desc.innerHTML = blog.description;
				container.appendChild(desc);

				//Create modal for editing
				//Create modal container
				var modalContainer = document.createElement("div");
				modalContainer.className = "modal fade";
				modalContainer.id = "modal-" + blog.id;
				modalContainer.role = "dialog";
				container.appendChild(modalContainer);

				//Create modal-dialog
				var modalDia = document.createElement("div");
				modalDia.className = "modal-dialog";
				modalContainer.appendChild(modalDia);

				//Create Modal Content
				var modalCon = document.createElement("div");
				modalCon.className = "modal-content bg-dark";
				modalDia.appendChild(modalCon);

				//Create modal header and title
				var modalHeader = document.createElement("div");
				modalHeader.className = "modal-header";
				modalCon.appendChild(modalHeader);
				var modalTitle = document.createElement("h4");
				modalTitle.className = "modal-title text-light";
				modalTitle.innerHTML = "Editing " + blog.base_url;
				modalHeader.appendChild(modalTitle);

				//Create Modal Body
				var modalBody = document.createElement("div");
				modalBody.className = "modal-body";
				modalCon.appendChild(modalBody);

				var form = document.createElement("form");
				modalBody.appendChild(form);

				//Blog title
				var titleLabel = document.createElement("label");
				titleLabel.className = "text-light";
				titleLabel.innerHTML = "Title";
				titleLabel.appendChild(document.createElement("br"));
				form.appendChild(titleLabel);
				var titleEdit = document.createElement("input");
				titleEdit.className = "rounded";
				titleEdit.name = "title";
				titleEdit.type = "text";
				titleEdit.value = blog.name;
				titleEdit.id = "edit-title-" + blog.id;
				titleLabel.appendChild(titleEdit);
				form.appendChild(document.createElement("br"));

				//Blog Description
				var descriptionLabel = document.createElement("label");
				descriptionLabel.className = "text-light";
				descriptionLabel.innerHTML = "Description";
				descriptionLabel.appendChild(document.createElement("br"));
				form.appendChild(descriptionLabel);
				var description = document.createElement("input");
				description.className = "rounded";
				description.name = "edit-description";
				description.type = "text";
				description.value = blog.description;
				description.id = "edit-description-" + blog.id;
				descriptionLabel.appendChild(description);
				form.appendChild(document.createElement("br"));

				//Icon image
				var iconLabel = document.createElement("label");
				iconLabel.className = "text-light";
				iconLabel.innerHTML = "Icon Image";
				iconLabel.appendChild(document.createElement("br"));
				form.appendChild(iconLabel);
				var iconFile = document.createElement("input");
				iconFile.className = "rounded";
				iconFile.name = "edit-icon-image";
				iconFile.type = "file";
				iconFile.id = "edit-icon-image-" + blog.id;
				iconFile.onchange = function (ignore) { encodeImageFileAsBase64(this) };
				iconLabel.appendChild(iconFile);
				form.appendChild(document.createElement("br"));

				//Background color
				var colorLabel = document.createElement("label");
				colorLabel.className = "text-light";
				colorLabel.innerHTML = "Background Color";
				colorLabel.appendChild(document.createElement("br"));
				form.appendChild(colorLabel);
				var color = document.createElement("input");
				color.className = "rounded";
				color.name = "background-color";
				color.type = "color";
				color.value = blog.background_color;
				color.id = "edit-background-color-" + blog.id;
				colorLabel.appendChild(color);
				form.appendChild(document.createElement("br"));

				//Background image
				var backgroundImageLabel = document.createElement("label");
				backgroundImageLabel.className = "text-light";
				backgroundImageLabel.innerHTML = "Background Image";
				backgroundImageLabel.appendChild(document.createElement("br"));
				form.appendChild(backgroundImageLabel);
				var backgroundFile = document.createElement("input");
				backgroundFile.className = "rounded";
				backgroundFile.name = "edit-background-image";
				backgroundFile.type = "file";
				backgroundFile.id = "edit-background-image-" + blog.id;
				backgroundFile.onchange = function (ignore) {encodeImageFileAsBase64(this)};
				backgroundImageLabel.appendChild(backgroundFile);
				form.appendChild(document.createElement("br"));

				//Is NSFW
				var nsfwLabel = document.createElement("label");
				nsfwLabel.className = "text-light";
				nsfwLabel.innerHTML = "Contains NSFW Content";
				nsfwLabel.appendChild(document.createElement("br"));
				form.appendChild(nsfwLabel);
				var nsfwBox = document.createElement("input");
				nsfwBox.className = "rounded";
				nsfwBox.name = "nsfw";
				nsfwBox.type = "checkbox";
				nsfwBox.checked = blog.nsfw;
				nsfwBox.id = "edit-nsfw-" + blog.id;
				nsfwLabel.appendChild(nsfwBox);
				form.appendChild(document.createElement("br"));

				//Allow under 18
				var under18Label = document.createElement("label");
				under18Label.className = "text-light";
				under18Label.innerHTML = "Allow Minors To View Blog";
				under18Label.appendChild(document.createElement("br"));
				form.appendChild(under18Label);
				var under18Box = document.createElement("input");
				under18Box.className = "rounded";
				under18Box.name = "under_18";
				under18Box.type = "checkbox";
				under18Box.checked = blog.allow_under_18;
				under18Box.id = "edit-under-18-" + blog.id;
				under18Label.appendChild(under18Box);
				form.appendChild(document.createElement("br"));

				//Display age
				if (blog.type === "PERSONAL") {
					var showAgeLabel = document.createElement("label");
					showAgeLabel.className = "text-light";
					showAgeLabel.innerHTML = "Display your age";
					showAgeLabel.appendChild(document.createElement("br"));
					form.appendChild(showAgeLabel);
					var showAgeBox = document.createElement("input");
					showAgeBox.className = "rounded";
					showAgeBox.name = "show_age";
					showAgeBox.type = "checkbox";
					showAgeBox.checked = blog.display_age;
					showAgeBox.id = "edit-display-age-" + blog.id;
					showAgeLabel.appendChild(showAgeBox);
					form.appendChild(document.createElement("br"));
				}

				//Submit button
				var submit = document.createElement("button");
				submit.className = "btn btn-primary";
				submit.type = "button";
				submit.id = "edit.submit." + blog.id;
				submit.innerHTML = "Confirm Edits!";
				submit.onclick = function (ignore) {
					//Call edit blog function
					updateBlog(this.id);
				};
				form.appendChild(submit);

				//Create modal footer
				var modalFooter = document.createElement("div");
				modalFooter.className = "modal-footer";
				modalCon.appendChild(modalFooter);

				var closeButton = document.createElement("button");
				closeButton.className = "btn btn-primary btn-sm";
				closeButton.type = "button";
				closeButton.setAttribute("data-dismiss", "modal");
				modalFooter.appendChild(closeButton);
				var closeIcon = document.createElement("img");
				closeIcon.className = "icon-custom-small";
				closeIcon.src = "/img/icon/close_256px.png";
				closeIcon.alt = "Close";
				closeButton.appendChild(closeIcon);
				//Oh my god finally done!!!
			}

			mainContainer.appendChild(document.createElement("br"));
			mainContainer.appendChild(document.createElement("br"));
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
			"Authorization_Refresh": getCredentials().refresh,
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

function updateBlog(editId) {
	var blogId = editId.split(".")[2];
	//TODO: Support show age, and url changing

	var bodyRaw = {
		"id": blogId,
		"name": document.getElementById("edit-title-" + blogId).value,
		"description": document.getElementById("edit-description-" + blogId).value,
		"nsfw": document.getElementById("edit-nsfw-" + blogId).checked,
		"allow_under_18": document.getElementById("edit-under-18-" + blogId).checked,
		"background_color": document.getElementById("edit-background-color-" + blogId).value
	};

	if (hasEncodedResults("edit-icon-image-" + blogId)) {
		bodyRaw.icon_image = getEncodedResults("edit-icon-image-" + blogId);
	}
	if (hasEncodedResults("edit-background-image-" + blogId)) {
		bodyRaw.background_image = getEncodedResults("edit-background-image-" + blogId);
	}
	if (document.getElementById("edit-display-age-" + blogId) !== null) {
		bodyRaw.display_age = document.getElementById("edit-display-age-" + blogId).checked;
	}

	$.ajax({
		url: "https://api.startapped.com/v1/blog/update",
		headers: {
			"Content-Type": "application/json",
			"Authorization_Access": getCredentials().access,
			"Authorization_Refresh": getCredentials().refresh
		},
		method: "POST",
		dataType: "json",
		data: JSON.stringify(bodyRaw),
		success: function (json) {
			//Close Modal...
			$('#modal-' + blogId).modal('hide');

			showSnackbar(json.message);

			//Clear the encoded images...
			removeEncodedResults("edit-icon-image-" + blogId);
			removeEncodedResults("edit-background-image-" + blogId);

			//Refresh the blog view
			getAllBlogsSelf();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			showSnackbar(JSON.parse(jqXHR.responseText).message);
		}
	})
}

function showAgeSelf(ageElement) {
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
			var birth = json.account.birthday;

			ageElement.innerHTML = getAge(birth).toString();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			showSnackbar(JSON.parse(jqXHR.responseText).message);
		}
	})
}