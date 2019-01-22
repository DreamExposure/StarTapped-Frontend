function Post() {
    this.id = "Unassigned";

    this.creator = new Account();
    this.originBlog = new Blog();

    this.permalink = "Unassigned";
    this.fullUrl = "Unassigned";

    this.postType = "TEXT";

    this.timestamp = new Date().getMilliseconds();

    this.title = "Unassigned";
    this.body = "Unassigned";
    this.nsfw = false;

    this.parent = "Unassigned";

    //Post type specific..
    this.imageUrl = "Unassigned";
    this.audioUrl = "Unassigned";
    this.videoUrl = "Unassigned";


    this.toJson = function () {
        let json = {
            "id": this.id,
            "creator": this.creator.toJson(),
            "origin_blog": this.originBlog.toJson(),
            "permalink": this.permalink,
            "full_url": this.fullUrl,
            "timestamp": this.timestamp,
            "type": this.postType,
            "title": this.title,
            "body": this.body,
            "nsfw": this.nsfw
        };
        if (this.parent !== "Unassigned") {
            json.parent = this.parent;
        }

        if (this.postType === "IMAGE") {
            json.image_url = this.imageUrl;
        } else if (this.postType === "AUDIO") {
            json.audio_url = this.audioUrl;
        } else if (this.postType === "VIDEO") {
            json.video_url = this.videoUrl;
        }

        return json;
    };

    this.fromJson = function (json) {
        this.id = json.id;
        this.creator = new Account().fromJson(json.creator);
        this.originBlog = new Blog().fromJson(json.origin_blog);
        this.permalink = json.permalink;
        this.fullUrl = json.full_url;
        this.timestamp = json.timestamp;
        this.postType = json.type;
        this.title = json.title;
        this.body = json.body;
        this.nsfw = json.nsfw;

        if (json.hasOwnProperty('parent')) {
            this.parent = json.parent;
        }

        if (this.postType === "IMAGE" && json.hasOwnProperty('image_url')) {
            this.imageUrl = json.image_url;
        } else if (this.postType === "AUDIO" && json.hasOwnProperty('audio_url')) {
            this.audioUrl = json.audio_url;
        } else if (this.postType === "VIDEO" && json.hasOwnProperty('video_url')) {
            this.videoUrl = json.video_url;
        }

        return this;
    };
}