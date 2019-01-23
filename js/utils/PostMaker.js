function generatePostTree(lowest, posts) {
    let root = document.createElement("div");
    root.className = "post-container";

    let postsInOrder = [];

    let current = lowest;

    while (current.parent !== "Unassigned") {
        let parent = getPostFromArray(posts, current.parent);

        if (parent != null) {
            postsInOrder.push(parent);

            current = parent;
        } else {
            break;
        }
    }

    //It should start with the highest parent and end with the second to last...

    let first = null;
    for (let i = 0; i < postsInOrder.length; i++) {
       let p = postsInOrder[i];
       let v = null;

       if (p.postType === "TEXT") {
            v = generateTextPost(p, null, false, false);
       } else if (p.postType === "IMAGE") {
            v = generateImagePost(p, null, false, false);
       } else if (p.postType === "AUDIO") {
            v = generateAudioPost(p, null, false, false);
       } else if (p.postType === "VIDEO") {
            v = generateVideoPost(p, null, false, false);
       }

       if (first == null) {
           first = v;
       }

       root.appendChild(v); //Don't think I need to add linebreaks here...
    }

    let child = null;
    if (lowest.postType === "TEXT") {
        child = generateTextPost(lowest, null, false, true);
    } else if (lowest.postType === "IMAGE") {
        child = generateImagePost(lowest, null, false, true);
    } else if (lowest.postType === "AUDIO") {
        child = generateAudioPost(lowest, null, false, true);
    } else if (lowest.postType === "VIDEO") {
        child = generateVideoPost(lowest, null, false, true);
    }
    root.appendChild(child);

    if (first != null) {
        let topBar = first.getElementsByClassName("post-top-bar");
        let blogUrlLatest = first.getElementsByClassName("blog-url-latest")[0];
        let blogUrlSecond = first.getElementsByClassName("blog-url-second")[0];
        let reblogIcon = first.getElementsByClassName("reblog-icon")[0];

        blogUrlLatest.innerHTML = lowest.originBlog.baseUrl;
        blogUrlSecond.innerHTML = postsInOrder[0].originBlog.baseUrl;

        topBar.style.display = '';
        blogUrlLatest.style.display = '';
        blogUrlSecond.style.display = '';
        reblogIcon.style.display = '';

        blogUrlLatest.href = lowest.originBlog.fullUrl;
        blogUrlLatest.target = "_blank";
        blogUrlSecond.href = postsInOrder[0].originBlog.fullUrl;
        blogUrlSecond.target = "_blank";
    }

    return root;
}

function generateTextPost(post, parent, showTopBar, showBottomBar) {
    //Load views
    let root = document.createElement("div");
    let topBar = document.createElement("div");
    let contents = document.createElement("div");
    let bottomBar = document.createElement("div");
    let blogUrlLatest = document.createElement("a");
    let blogUrlSecond = document.createElement("a");
    let reblogIcon = document.createElement("img");
    let postTitle = document.createElement("h3");
    let postBody = document.createElement("p");
    let source = document.createElement("a");
    let bookmark = document.createElement("button");
    let reblog = document.createElement("button");

    //Set view classes
    root.className = "post-container bg-light";
    topBar.className = "post-top-bar";
    contents.className = "post-contents";
    bottomBar.className = "post-bottom-bar";
    blogUrlLatest.className = "blog-url-latest text-link-color underline-solid";
    blogUrlSecond.className = "blog-url-second text-link-color underline-solid";
    reblogIcon.className = "reblog-icon";
    postTitle.className = "post-title text-primary text-center";
    postBody.className = "post-body text-dark";
    source.className = "post-source text-dark underline-solid";
    bookmark.className = "post-bookmark";
    reblog.className = "post-reblog";

    //Append all the views...
    root.appendChild(topBar);
    root.appendChild(contents);
    root.appendChild(bottomBar);
    topBar.appendChild(blogUrlLatest);
    topBar.appendChild(reblogIcon);
    topBar.appendChild(blogUrlSecond);
    contents.appendChild(postTitle);
    contents.appendChild(postBody);
    bottomBar.appendChild(source);
    bottomBar.appendChild(bookmark);
    bottomBar.appendChild(reblog);

    //Set default data stuff for the things that need it.
    reblogIcon.src = "https://www.startapped.com/img/icon/reblog_256px.png";
    blogUrlLatest.href = "#";
    blogUrlSecond.href = "#";
    source.href = "#";

    //Set data
    blogUrlLatest.innerText = post.originBlog.baseUrl;
    blogUrlLatest.href = "#";
    if (parent != null) {
        blogUrlSecond.innerText = parent.originBlog.baseUrl;
    } else {
        reblogIcon.style.display = 'none';
        blogUrlSecond.style.display = 'none';
    }

    postTitle.innerText = post.title;
    postBody.innerText = post.body;

    source.innerText = "Source: " + post.originBlog.baseUrl;

    //Hide TopBar views if needed...
    if (!showTopBar) {
        blogUrlLatest.style.display = 'none';
        blogUrlSecond.style.display = 'none';
        reblogIcon.style.display = 'none';
        topBar.style.display = 'none';
    }

    //Hide BottomBar views if needed...
    if (!showBottomBar) {
        source.style.display = 'none';
        bookmark.style.display = 'none';
        reblog.style.display = 'none';
        bottomBar.style.display = 'none';
    }

    //Set handlers for buttons and links...
    if (showTopBar) {
        blogUrlLatest.href = post.originBlog.fullUrl;
        blogUrlLatest.target = "_blank";

        if (parent != null) {
            blogUrlSecond.href = parent.originBlog.fullUrl;
            blogUrlSecond.target = "_blank";
        }
    }
    if (showBottomBar) {
        source.href = post.originBlog.fullUrl;
        source.target = "_blank";

        bookmark.onclick = function (ignore) {
            //TODO: Handle bookmark!!!!
        };

        reblog.onclick = function (ignore) {
            //TODO: Handle reblog!!!!!
        };
    }

    return root;
}

function generateImagePost(post, parent, showTopBar, showBottomBar) {
    //Load views
    let root = document.createElement("div");
    let topBar = document.createElement("div");
    let contents = document.createElement("div");
    let bottomBar = document.createElement("div");
    let blogUrlLatest = document.createElement("a");
    let blogUrlSecond = document.createElement("a");
    let reblogIcon = document.createElement("img");
    let imageContainer = document.createElement("div");
    let image = document.createElement("img");
    let postTitle = document.createElement("h3");
    let postBody = document.createElement("p");
    let source = document.createElement("a");
    let bookmark = document.createElement("button");
    let reblog = document.createElement("button");

    //Set view classes
    root.className = "post-container";
    topBar.className = "post-top-bar";
    contents.className = "post-contents";
    bottomBar.className = "post-bottom-bar";
    blogUrlLatest.className = "blog-url-latest";
    blogUrlSecond.className = "blog-url-second";
    reblogIcon.className = "reblog-icon";
    imageContainer.className = "post-image-container";
    image.className = "post-image";
    postTitle.className = "post-title";
    postBody.className = "post-body";
    source.className = "post-source";
    bookmark.className = "post-bookmark";
    reblog.className = "post-reblog";

    //Append all the views...
    root.appendChild(topBar);
    root.appendChild(contents);
    root.appendChild(bottomBar);
    topBar.appendChild(blogUrlLatest);
    topBar.appendChild(reblogIcon);
    topBar.appendChild(blogUrlSecond);
    imageContainer.appendChild(image);
    contents.appendChild(imageContainer);
    contents.appendChild(postTitle);
    contents.appendChild(postBody);
    bottomBar.appendChild(source);
    bottomBar.appendChild(bookmark);
    bottomBar.appendChild(reblog);

    //Set default data stuff for the things that need it.
    reblogIcon.src = "https://www.startapped.com/img/icon/reblog_256px.png";

    //Set data
    blogUrlLatest.innerText = post.originBlog.baseUrl;
    if (parent != null) {
        blogUrlSecond.innerText = parent.originBlog.baseUrl;
    } else {
        reblogIcon.style.display = 'none';
        blogUrlSecond.style.display = 'none';
    }

    postTitle.innerText = post.title;
    postBody.innerText = post.body;

    source.innerText = "Source: " + post.originBlog.baseUrl;

    image.src = post.imageUrl;

    //Hide TopBar views if needed...
    if (!showTopBar) {
        blogUrlLatest.style.display = 'none';
        blogUrlSecond.style.display = 'none';
        reblogIcon.style.display = 'none';
        topBar.style.display = 'none';
    }

    //Hide BottomBar views if needed...
    if (!showBottomBar) {
        source.style.display = 'none';
        bookmark.style.display = 'none';
        reblog.style.display = 'none';
        bottomBar.style.display = 'none';
    }

    //Set handlers for buttons and links...
    if (showTopBar) {
        blogUrlLatest.href = post.originBlog.fullUrl;
        blogUrlLatest.target = "_blank";

        if (parent != null) {
            blogUrlSecond.href = parent.originBlog.fullUrl;
            blogUrlSecond.target = "_blank";
        }
    }
    if (showBottomBar) {
        source.href = post.originBlog.fullUrl;
        source.target = "_blank";

        bookmark.onclick = function (ignore) {
            //TODO: Handle bookmark!!!!
        };

        reblog.onclick = function (ignore) {
            //TODO: Handle reblog!!!!!
        };
    }

    //TODO: setup modal/popup for image....

    return root;
}

function generateAudioPost(post, parent, showTopBar, showBottomBar) {
    //Load views
    //TODO: Load audio container!!!
    let root = document.createElement("div");
    let topBar = document.createElement("div");
    let contents = document.createElement("div");
    let bottomBar = document.createElement("div");
    let blogUrlLatest = document.createElement("a");
    let blogUrlSecond = document.createElement("a");
    let reblogIcon = document.createElement("img");
    let postTitle = document.createElement("h3");
    let postBody = document.createElement("p");
    let source = document.createElement("a");
    let bookmark = document.createElement("button");
    let reblog = document.createElement("button");

    //Set view classes
    root.className = "post-container";
    topBar.className = "post-top-bar";
    contents.className = "post-contents";
    bottomBar.className = "post-bottom-bar";
    blogUrlLatest.className = "blog-url-latest";
    blogUrlSecond.className = "blog-url-second";
    reblogIcon.className = "reblog-icon";
    postTitle.className = "post-title";
    postBody.className = "post-body";
    source.className = "post-source";
    bookmark.className = "post-bookmark";
    reblog.className = "post-reblog";

    //Append all the views...
    root.appendChild(topBar);
    root.appendChild(contents);
    root.appendChild(bottomBar);
    topBar.appendChild(blogUrlLatest);
    topBar.appendChild(reblogIcon);
    topBar.appendChild(blogUrlSecond);
    contents.appendChild(postTitle);
    contents.appendChild(postBody);
    bottomBar.appendChild(source);
    bottomBar.appendChild(bookmark);
    bottomBar.appendChild(reblog);

    //Set default data stuff for the things that need it.
    reblogIcon.src = "https://www.startapped.com/img/icon/reblog_256px.png";

    //Set data
    blogUrlLatest.innerText = post.originBlog.baseUrl;
    if (parent != null) {
        blogUrlSecond.innerText = parent.originBlog.baseUrl;
    } else {
        reblogIcon.style.display = 'none';
        blogUrlSecond.style.display = 'none';
    }

    postTitle.innerText = post.title;
    postBody.innerText = post.body;

    source.innerText = "Source: " + post.originBlog.baseUrl;

    //Hide TopBar views if needed...
    if (!showTopBar) {
        blogUrlLatest.style.display = 'none';
        blogUrlSecond.style.display = 'none';
        reblogIcon.style.display = 'none';
        topBar.style.display = 'none';
    }

    //Hide BottomBar views if needed...
    if (!showBottomBar) {
        source.style.display = 'none';
        bookmark.style.display = 'none';
        reblog.style.display = 'none';
        bottomBar.style.display = 'none';
    }

    //Set handlers for buttons and links...
    if (showTopBar) {
        blogUrlLatest.href = post.originBlog.fullUrl;
        blogUrlLatest.target = "_blank";

        if (parent != null) {
            blogUrlSecond.href = parent.originBlog.fullUrl;
            blogUrlSecond.target = "_blank";
        }
    }
    if (showBottomBar) {
        source.href = post.originBlog.fullUrl;
        source.target = "_blank";

        bookmark.onclick = function (ignore) {
            //TODO: Handle bookmark!!!!
        };

        reblog.onclick = function (ignore) {
            //TODO: Handle reblog!!!!!
        };
    }

    //TODO: Setup all of the audio player controls and src!!!

    return root;
}

function generateVideoPost(post, parent, showTopBar, showBottomBar) {
    //Load views
    //TODO: load video container!!!!!!!!
    let root = document.createElement("div");
    let topBar = document.createElement("div");
    let contents = document.createElement("div");
    let bottomBar = document.createElement("div");
    let blogUrlLatest = document.createElement("a");
    let blogUrlSecond = document.createElement("a");
    let reblogIcon = document.createElement("img");
    let postTitle = document.createElement("h3");
    let postBody = document.createElement("p");
    let source = document.createElement("a");
    let bookmark = document.createElement("button");
    let reblog = document.createElement("button");

    //Set view classes
    root.className = "post-container";
    topBar.className = "post-top-bar";
    contents.className = "post-contents";
    bottomBar.className = "post-bottom-bar";
    blogUrlLatest.className = "blog-url-latest";
    blogUrlSecond.className = "blog-url-second";
    reblogIcon.className = "reblog-icon";
    postTitle.className = "post-title";
    postBody.className = "post-body";
    source.className = "post-source";
    bookmark.className = "post-bookmark";
    reblog.className = "post-reblog";

    //Append all the views...
    root.appendChild(topBar);
    root.appendChild(contents);
    root.appendChild(bottomBar);
    topBar.appendChild(blogUrlLatest);
    topBar.appendChild(reblogIcon);
    topBar.appendChild(blogUrlSecond);
    contents.appendChild(postTitle);
    contents.appendChild(postBody);
    bottomBar.appendChild(source);
    bottomBar.appendChild(bookmark);
    bottomBar.appendChild(reblog);

    //Set default data stuff for the things that need it.
    reblogIcon.src = "https://www.startapped.com/img/icon/reblog_256px.png";

    //Set data
    blogUrlLatest.innerText = post.originBlog.baseUrl;
    if (parent != null) {
        blogUrlSecond.innerText = parent.originBlog.baseUrl;
    } else {
        reblogIcon.style.display = 'none';
        blogUrlSecond.style.display = 'none';
    }

    postTitle.innerText = post.title;
    postBody.innerText = post.body;

    source.innerText = "Source: " + post.originBlog.baseUrl;

    //Hide TopBar views if needed...
    if (!showTopBar) {
        blogUrlLatest.style.display = 'none';
        blogUrlSecond.style.display = 'none';
        reblogIcon.style.display = 'none';
        topBar.style.display = 'none';
    }

    //Hide BottomBar views if needed...
    if (!showBottomBar) {
        source.style.display = 'none';
        bookmark.style.display = 'none';
        reblog.style.display = 'none';
        bottomBar.style.display = 'none';
    }

    //Set handlers for buttons and links...
    if (showTopBar) {
        blogUrlLatest.href = post.originBlog.fullUrl;
        blogUrlLatest.target = "_blank";

        if (parent != null) {
            blogUrlSecond.href = parent.originBlog.fullUrl;
            blogUrlSecond.target = "_blank";
        }
    }
    if (showBottomBar) {
        source.href = post.originBlog.fullUrl;
        source.target = "_blank";

        bookmark.onclick = function (ignore) {
            //TODO: Handle bookmark!!!!
        };

        reblog.onclick = function (ignore) {
            //TODO: Handle reblog!!!!!
        };
    }

    //TODO: Setup all of the video player controls and src!!!!!

    return root;
}

function getPostFromArray(posts, id) {
    for (let i = 0; i < posts.length; i++) {
        let post = posts[i];
        if (post.id === id) {
            return post;
        }
    }
    return null;
}