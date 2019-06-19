function doLoadOnFollowing() {
    initOnHub();

    getFollowingBlogsFromServer();
}

function showFollowingBlogs(json) {
    let mainContainer = document.getElementById("following-container");

    //First make sure to clear the container
    while (mainContainer.firstChild) {
        mainContainer.removeChild(mainContainer.firstChild);
    }

    //Actually create the HTML for all the blogs and shit.
    for (let i = 0; i < json.count; i++) {
        let blog = new Blog().fromJson(json.blogs[i]);

        //Create container....
        let container = document.createElement("div");
        container.className = "following-container rounded";
        container.id = "blog-" + blog.id;
        container.style.backgroundColor = blog.backgroundColor;
        mainContainer.appendChild(container);

        //icon image
        let header = document.createElement("img");
        header.className = "following-blog-icon rounded-left";
        header.src = blog.iconImage.url;
        header.alt = blog.iconImage.name;
        container.appendChild(header);

        //Create view link
        let viewButton = document.createElement("a");
        viewButton.className = "following-blog-link text-link-color underline-solid";
        viewButton.href = blog.completeUrl;
        viewButton.target = "_blank";
        viewButton.innerHTML = blog.baseUrl;
        container.appendChild(viewButton);

        //Oh my god finally done!!!
    }
}

function getFollowingBlogsFromServer() {
    let bodyRaw = {};

    $.ajax({
        url: "https://api.startapped.com/v1/relation/get/following",
        headers: {
            "Content-Type": "application/json",
            "Authorization_Access": getCredentials().access,
            "Authorization_Refresh": getCredentials().refresh
        },
        method: "POST",
        dataType: "json",
        data: JSON.stringify(bodyRaw),
        success: function (json) {
            showFollowingBlogs(json);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showSnackbar(JSON.parse(jqXHR.responseText).message);
        }
    })
}