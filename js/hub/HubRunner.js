let timeIndex = new TimeIndex();
let keepChecking = true;
let isGenerating = false;

function doLoadHub() {
    initOnHub();

    getPostsFromServer();
}

function showPosts(json) {
    isGenerating = true; //Stop it from getting new data while generating.
    if (json.count <= 0) {
        keepChecking = false;
    } else {
        //TODO: Sort latest to earliest

        //TODO: loop through only posts within the start/stop times...
        //TODO: Add posts to the hub view, at the bottom...
    }
    timeIndex.forwardOneMonth();
    isGenerating = false;
}

function getPostsFromServer() {
    if (!isGenerating && keepChecking) {
        let bodyRaw = {
            "year": timeIndex.year,
            "month": timeIndex.month
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

window.onscroll = function (ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        getPostsFromServer();
    }
};