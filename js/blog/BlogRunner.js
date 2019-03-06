let timeIndex = new TimeIndex();
let keepChecking = true;
let isGenerating = false;
let isBlocking = false;

let blog = null;
let account = null;

function doLoadBlog() {
    initOnBlogPage();

    getOwnAccount(); //So that we can validate on the frontend NSFW settings and such...
}

// noinspection Duplicates
function showBlog() {
    let rootLayout = document.getElementById("post-container");

    //Create container....
    let container = document.createElement("div");
    container.className = "blog-container rounded";
    container.id = "blog-" + blog.id;
    container.style.backgroundColor = blog.backgroundColor;
    rootLayout.appendChild(container);

    if (account.safeSearch && blog.nsfw) {
        //Blog is NSFW and the account has safe search enabled, show NSFW block
        isBlocking = true;

        //Content alert box
        let alert = document.createElement("p");
        alert.className = "blog-content-alert-header text-light bg-danger rounded-top";
        alert.innerText = "Content Alert";
        container.appendChild(alert);

        //Description of issue
        let desc = document.createElement("p");
        desc.className = "blog-content-alert-description text-dark";
        desc.innerText = "This blog is marked as NSFW (Not Safe For Work). Please disable safe search to view this blog.";
        container.appendChild(desc);
    } else if (!account.allowUnder18 && account.age < 18) {
        //User is under 18 and blog does not allow minors to view.
        isBlocking = true;

        //Content alert box
        let alert = document.createElement("p");
        alert.className = "blog-content-alert-header text-light bg-danger rounded-top";
        alert.innerText = "Content Alert";
        container.appendChild(alert);

        //Description of issue
        let desc = document.createElement("p");
        desc.className = "blog-content-alert-description text-dark";
        desc.innerText = "This blog does not allow minors to view. Please come back when you are at least 18 years old.";
        container.appendChild(desc);
    } else {

        //Header image
        let header = document.createElement("img");
        header.className = "blog-header-img rounded-top";
        header.src = blog.backgroundImage.url;
        header.alt = blog.backgroundImage.name;
        container.appendChild(header);

        //Create view link
        let viewButton = document.createElement("a");
        viewButton.className = "text-link-color underline-solid blog-link";
        viewButton.href = blog.completeUrl;
        viewButton.target = "_blank";
        viewButton.innerHTML = blog.baseUrl;
        container.appendChild(viewButton);

        //Icon image
        let icon = document.createElement("img");
        icon.className = "blog-profile-img rounded";
        icon.src = blog.iconImage.url;
        icon.alt = blog.iconImage.name;
        container.appendChild(icon);

        //NSFW badge
        if (blog.nsfw) {
            let nsfw = document.createElement("span");
            nsfw.className = "blog-nsfw-badge badge badge-danger";
            nsfw.innerHTML = "NSFW";
            container.appendChild(nsfw);
        }

        //18+ only badge
        if (!blog.allowUnder18) {
            let under = document.createElement("span");
            under.className = "blog-18-only-badge badge badge-danger";
            under.innerHTML = "18+ Only";
            container.appendChild(under);
        }
        //Age badge
        if (blog.blogType === "PERSONAL") {
            if (blog.displayAge) {
                let age = document.createElement("span");
                age.className = "blog-age-badge badge badge-danger";
                showAge(age);
                container.appendChild(age);
            }
        }

        //Blog text container
        let textContainer = document.createElement("div");
        textContainer.className = "blog-text-container";
        container.appendChild(textContainer);

        //Blog title
        let title = document.createElement("h3");
        title.className = "blog-title text-primary font-weight-bold";
        title.innerHTML = blog.name;
        textContainer.appendChild(title);

        //Blog Description
        let desc = document.createElement("p");
        desc.className = "blog-desc text-dark";
        desc.innerHTML = blog.description;
        textContainer.appendChild(desc);
        //Oh my god finally done!!!

        getPostsFromServer(); //Only gets called if we aren't blocking
    }

    setupNavBar();
}

function setupNavBar() {
    if (!isBlocking) {
        let navContainer = document.getElementById("navbar-container");

        if (blog.ownerId === account.id || blog.owners.indexOf(account.id) > -1) {
            //User owns blog...

            //Followers action
            let followers = document.createElement("button");
            followers.className = "btn btn-primary";
            followers.innerText = "Followers";
            followers.onclick = function (ignore) {
                showSnackbar(blog.followers.length + " follower(s)");
            };
            navContainer.appendChild(followers);
        } else {
            if (blog.followers.indexOf(account.id) > -1) {
                //Following...

                //Unfollow action
                let unfollow = document.createElement("button");
                unfollow.className = "btn btn-primary";
                unfollow.innerText = "Unfollow";
                unfollow.onclick = function (ignore) {
                    unfollowBlog();
                };
                navContainer.appendChild(unfollow);
            } else {
                //Not following...

                //Follow action
                let follow = document.createElement("button");
                follow.className = "btn btn-primary";
                follow.innerText = "Follow";
                follow.onclick = function (ignore) {
                    followBlog();
                };
                navContainer.appendChild(follow);

                //Report action
                let report = document.createElement("button");
                report.className = "btn btn-primary";
                report.innerText = "Report";
                report.onclick = function (ignore) {
                    //TODO: Handle report action
                };
                navContainer.appendChild(report);

                //Block action
                let block = document.createElement("button");
                block.className = "btn btn-primary";
                block.innerText = "Block";
                block.onclick = function (ignore) {
                    //TODO: Handle block action
                };
                navContainer.appendChild(block);
            }

            //TODO: Check if blocked and figure all that shit out.
        }
    }
}

//various shit

// noinspection Duplicates
function showPosts(json) {
    isGenerating = true; //Stop it from getting new data while generating.
    if (json.count <= 0) {
        keepChecking = false;

        showSnackbar("No most posts!");
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

            if (p.timestamp >= timeIndex.oldest && p.timestamp <= timeIndex.latest && p.originBlog.id === blog.id) {
                //Add posts to the hub view, at the bottom...
                if (p.parent !== "Unassigned") {
                    rootLayout.appendChild(generatePostTree(p, posts));
                } else {
                    let v = null;
                    if (p.postType === "TEXT") {
                        v = generateTextPost(p, null, true, true, true);
                    } else if (p.postType === "IMAGE") {
                        v = generateImagePost(p, null, true, true, true);
                    } else if (p.postType === "AUDIO") {
                        v = generateAudioPost(p, null, true, true, true);
                    } else if (p.postType === "VIDEO") {
                        v = generateVideoPost(p, null, true, true, true);
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

function getOwnAccount() {
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
            account = new Account().fromJson(json.account);

            getBlogByBaseUrl();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showSnackbar(JSON.parse(jqXHR.responseText).message);
        }
    })
}

function getBlogByBaseUrl() {
    let bodyRaw = {
        "url": window.location.host.split(".")[0]
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
            blog = new Blog().fromJson(json.blog);

            document.title = blog.baseUrl + " :: StarTapped";
            document.getElementById("navbar-brand").innerText = blog.baseUrl;

            showBlog();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showSnackbar(JSON.parse(jqXHR.responseText).message);
        }
    })
}

function getPostsFromServer() {
    if (!isGenerating && keepChecking && !isBlocking) {
        let bodyRaw = {
            "blog_id": blog.id,
            "before": timeIndex.before,
            "limit": 20
        };

        $.ajax({
            url: "https://api.startapped.com/v1/post/get/blog",
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

//Follower calls and handling stuffs.
function followBlog() {
    let bodyRaw = {
        "blog_id": blog.id
    };

    $.ajax({
        url: "https://api.startapped.com/v1/relation/follow",
        headers: {
            "Content-Type": "application/json",
            "Authorization_Access": getCredentials().access,
            "Authorization_Refresh": getCredentials().refresh
        },
        method: "POST",
        dataType: "json",
        data: JSON.stringify(bodyRaw),
        success: function (json) {
            showSnackbar("Success!");
            window.location.reload(false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showSnackbar(JSON.parse(jqXHR.responseText).message);
        }
    })
}

function unfollowBlog() {
    let bodyRaw = {
        "blog_id": blog.id
    };

    $.ajax({
        url: "https://api.startapped.com/v1/relation/unfollow",
        headers: {
            "Content-Type": "application/json",
            "Authorization_Access": getCredentials().access,
            "Authorization_Refresh": getCredentials().refresh
        },
        method: "POST",
        dataType: "json",
        data: JSON.stringify(bodyRaw),
        success: function (json) {
            showSnackbar("Success!");
            window.location.reload(false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showSnackbar(JSON.parse(jqXHR.responseText).message);
        }
    })
}


//Maths stuffs
function showAge(ageElement) {
    let bodyRaw = {
        "id": blog.ownerId
    };

    $.ajax({
        url: "https://api.startapped.com/v1/account/get/other",
        headers: {
            "Content-Type": "application/json",
            "Authorization_Access": getCredentials().access,
            "Authorization_Refresh": getCredentials().refresh
        },
        method: "POST",
        dataType: "json",
        data: JSON.stringify(bodyRaw),
        success: function (json) {
            let blogOwner = new Account().fromJson(json.account);

            ageElement.innerHTML = blogOwner.age;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showSnackbar(JSON.parse(jqXHR.responseText).message);
        }
    })
}

window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        getPostsFromServer();
    }
};