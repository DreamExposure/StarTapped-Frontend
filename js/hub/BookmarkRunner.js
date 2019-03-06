let timeIndex = new TimeIndex();
let keepChecking = true;
let isGenerating = false;

function doLoadOnBookmarks() {
    initOnHub();

    getPostsFromServer();
}

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

            if (p.timestamp >= timeIndex.oldest && p.timestamp <= timeIndex.latest && p.bookmarked) {
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

function getPostsFromServer() {
    if (!isGenerating && keepChecking) {
        let bodyRaw = {
            "before": timeIndex.before,
            "limit": 20
        };

        $.ajax({
            url: "https://api.startapped.com/v1/post/get/bookmark",
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


window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        getPostsFromServer();
    }
};