let timeIndex = new TimeIndex();
let keepChecking = true;
let isGenerating = false;

let blogIcons = new Map();

function doLoadHub() {
    initOnHub();

    getPostsFromServer();

    getBlogsFromServerForSelection();

    handleTypeChange(null);
}

function showPosts(json) {
    isGenerating = true; //Stop it from getting new data while generating.
    if (json.count <= 0) {
        keepChecking = false;
    } else {
        if (json.range.latest > 0) {
            timeIndex.latest = json.range.latest;
            timeIndex.oldest = json.range.oldest;
        }

        let posts = [];
        //Turn json array to post array...
        for (let i = 0; i < json.count; i++) {
            posts.push(new Post().fromJson(json.posts[i]));
        }

        //Sort latest to earliest (I hope)
        posts.sort(function (a, b) {
            return new Date(b.timestamp) - new Date(a.timestamp);
        });

        let rootLayout = document.getElementById("post-container");

        //loop through only posts within the start/stop times...
        for (let i = 0; i < posts.length; i++) {
            let p = posts[i];

            if (p.timestamp >= timeIndex.oldest && p.timestamp <= timeIndex.latest) {
                //Add posts to the hub view, at the bottom...
                if (p.parent !== "Unassigned") {
                    rootLayout.appendChild(generatePostTree(p, posts));
                } else {
                    let v = null;
                    if (p.postType === "TEXT") {
                        v = generateTextPost(p, null, true, true);
                    } else if (p.postType === "IMAGE") {
                        v = generateImagePost(p, null, true, true);
                    } else if (p.postType === "AUDIO") {
                        v = generateAudioPost(p, null, true, true);
                    } else if (p.postType === "VIDEO") {
                        v = generateVideoPost(p, null, true, true);
                    }
                    if (v != null) {
                        rootLayout.appendChild(v);
                    }
                }
            }
        }
    }
    timeIndex.before = timeIndex.oldest - 1;
    isGenerating = false;
}

function getPostsFromServer() {
    if (!isGenerating && keepChecking) {
        let bodyRaw = {
            "before": timeIndex.before,
            "limit": 20
        };

        $.ajax({
            url: "https://api.startapped.com/v1/post/get/hub",
            headers: {
                "Content-Type": "application/json",
                "Authorization_Access": getCredentials().access,
                "Authorization_Refresh": getCredentials().refresh
            },
            method: "POST",
            dataType: "json",
            data: JSON.stringify(bodyRaw),
            success: function (json) {
                showPosts(json);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showSnackbar(JSON.parse(jqXHR.responseText).message);
            }
        })
    }
}

function getBlogsFromServerForSelection() {
    let bodyRaw = {
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
        data: JSON.stringify(bodyRaw),
        success: function (json) {
            let dropdown = document.getElementById("create-post-blog-select");

            for (let i = 0; i < json.count; i++) {
                let blog = new Blog().fromJson(json.blogs[i]);

                blogIcons.set(blog.id, blog.iconImage.url);

                let opt = document.createElement("option");
                opt.value = blog.id;
                opt.innerText = blog.baseUrl;

                dropdown.appendChild(opt);
            }

            let iconImage = document.getElementById("create-post-blog-icon");
            iconImage.src = blogIcons.get(dropdown.options[dropdown.selectedIndex].value);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showSnackbar(JSON.parse(jqXHR.responseText).message);
        }
    })
}

function onBlogSelectChange() {
    let dropdown = document.getElementById("create-post-blog-select");
    let iconImage = document.getElementById("create-post-blog-icon");
    iconImage.src = blogIcons.get(dropdown.options[dropdown.selectedIndex].value);
}

function createNewPost() {
    let blogSelect = document.getElementById("create-post-blog-select");
    let tagText = document.getElementById("create-post-tags").value;

    let tags = [];

    let tagSplit = tagText.split(",");
    for (let i = 0; i < tagSplit.length; i++) {
        let t = tagSplit[i].trim();
        if (t.length > 0) {
            tags.push(t);
        }
    }

    let bodyRaw = {
        "blog_id": blogSelect.options[blogSelect.selectedIndex].value,
        "type": getPostTypeForCreate(null),
        "title": document.getElementById("create-post-title").value,
        "body": document.getElementById("create-post-body").value,
        "tags": tags,
        "nsfw": false //This will be added later. But it is also handled internally.
    };

    //Handle the actual media files for the post.
    if (hasEncodedResults("post-create-media")) {
        let postMedia = getEncodedResults("post-create-media");
        switch (getPostTypeForCreate(null)) {
            case "IMAGE":
                bodyRaw.image = postMedia;
                break;
            case "AUDIO":
                bodyRaw.audio = postMedia;
                break;
            case "VIDEO":
                bodyRaw.video = postMedia;
                break;
            default:
                //Unsupported
                break;
        }
    } else {
        switch (getPostTypeForCreate(null)) {
            case "IMAGE":
                //Show error and don't create post.
                showSnackbar("Image posts must have an image.");
                return;
            case "AUDIO":
                // Show error and don't create post.
                showSnackbar("Audio posts must have an audio file.");
                break;
            case "VIDEO":
                //Show error and don't create post.
                showSnackbar("Video posts must have a video.");
                break;
            default:
                //Unsupported
                break;
        }
    }


    //TODO: Add loading icon and disable interaction...

    $.ajax({
        url: "https://api.startapped.com/v1/post/create",
        headers: {
            "Content-Type": "application/json",
            "Authorization_Access": getCredentials().access,
            "Authorization_Refresh": getCredentials().refresh
        },
        method: "POST",
        dataType: "json",
        data: JSON.stringify(bodyRaw),
        success: function (json) {
            //TODO: Remove loading icon and enabled interaction...

            //Close modal...
            $('#modal-post-create').modal('hide');
            showSnackbar("Success!");

            //Reset form.
            resetPostTypeForCreate();
            handleTypeChange(null);
            document.getElementById("create-post-title").value = "";
            document.getElementById("create-post-body").value = "";
            document.getElementById("create-post-tags").value = "";

            //Remove the encoded media from memory.
            removeEncodedResults("post-create-media");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showSnackbar(JSON.parse(jqXHR.responseText).message);

            //TODO: Remove loading icon and enabled interaction...
        }
    })

}

function handleTypeChange(element) {
    let imageLabel = document.getElementById("post-create-image-label");
    let audioLabel = document.getElementById("post-create-audio-label");
    let videoLabel = document.getElementById("post-create-video-label");

    let imageInput = document.getElementById("post-create-image-file");
    let audioInput = document.getElementById("post-create-audio-file");
    let videoInput = document.getElementById("post-create-video-file");

    //Clear file inputs...
    imageInput.value = "";
    audioInput.value = "";
    videoInput.value = "";
    removeEncodedResults("post-create-media");

    //Show the correct elements
    switch (getPostTypeForCreate(element)) {
        case "TEXT":
            imageLabel.hidden = true;
            audioLabel.hidden = true;
            videoLabel.hidden = true;
            break;
        case "IMAGE":
            imageLabel.hidden = false;
            audioLabel.hidden = true;
            videoLabel.hidden = true;
            break;
        case "AUDIO":
            imageLabel.hidden = true;
            audioLabel.hidden = false;
            videoLabel.hidden = true;
            break;
        case "VIDEO":
            imageLabel.hidden = true;
            audioLabel.hidden = true;
            videoLabel.hidden = false;
            break;
        default:
            //Unsupported
            break;
    }
}

function getPostTypeForCreate(element) {
    if (element === null) {
        if ($("#text-option-label").hasClass("active")) {
            return "TEXT";
        } else if ($("#image-option-label").hasClass("active")) {
            return "IMAGE";
        } else if ($("#audio-option-label").hasClass("active")) {
            return "AUDIO";
        } else if ($("#video-option-label").hasClass("active")) {
            return "VIDEO";
        } else {
            return "TEXT";
        }
    } else {
        if (element.id === "text-option-label") {
            return "TEXT";
        } else if (element.id === "image-option-label") {
            return "IMAGE";
        } else if (element.id === "audio-option-label") {
            return "AUDIO";
        } else if (element.id === "video-option-label") {
            return "VIDEO";
        } else {
            return "TEXT";
        }
    }
}

function resetPostTypeForCreate() {
    $("#text-option-label").removeClass("active");
    $("#image-option-label").removeClass("active");
    $("#audio-option-label").removeClass("active");
    $("#video-option-label").removeClass("active");

    //Clear inputs
    let imageInput = document.getElementById("post-create-image-file");
    let audioInput = document.getElementById("post-create-audio-file");
    let videoInput = document.getElementById("post-create-video-file");

    //Clear file inputs...
    imageInput.value = "";
    audioInput.value = "";
    videoInput.value = "";
    removeEncodedResults("post-create-media");
}

window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        getPostsFromServer();
    }
};