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
    this.bookmarked = false;

    this.tags = [];

    //Post type specific..
    this.image = new UploadedFile();
    this.audio = new UploadedFile();
    this.video = new UploadedFile();


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
            "tags": this.tags,
            "nsfw": this.nsfw,
            "bookmarked": this.bookmarked
        };
        if (this.parent !== "Unassigned") {
            json.parent = this.parent;
        }

        if (this.postType === "IMAGE") {
            json.image = this.image.toJson();
        } else if (this.postType === "AUDIO") {
            json.audio = this.audio.toJson();
        } else if (this.postType === "VIDEO") {
            json.video = this.video.toJson();
        }

        return json;
    };

    // noinspection Duplicates
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

        this.bookmarked = json.bookmarked;

        if (json.hasOwnProperty('tags')) {
            this.tags = json.tags
        }

        if (this.postType === "IMAGE" && json.hasOwnProperty('image')) {
            this.image = new UploadedFile().fromJson(json.image);
        } else if (this.postType === "AUDIO" && json.hasOwnProperty('audio')) {
            this.audio = new UploadedFile().fromJson(json.audio);
        } else if (this.postType === "VIDEO" && json.hasOwnProperty('video')) {
            this.video = new UploadedFile().fromJson(json.video);
        }

        return this;
    };
}