//noinspection Duplicates
function Blog() {
    this.id = "Unassigned";

    this.baseUrl = "unassigned";
    this.completeUrl = "https://unassigned.startapped.com";

    this.blogType = "PERSONAL";

    this.name = "Unassigned";
    this.description = "Unassigned";

    this.iconImage = new UploadedFile();
    this.backgroundColor = "#ffffff";
    this.backgroundImage = new UploadedFile();

    this.allowUnder18 = true;
    this.nsfw = false;

    this.followers = [];

//For personal blogs
    this.ownerId = "Unassigned";
    this.displayAge = true;

//For group blogs
    this.owners = [];


    this.fromJson = function (json) {
        this.id = json.id;
        this.baseUrl = json.base_url;
        this.completeUrl = json.complete_url;
        this.blogType = json.type;
        this.name = json.name;
        this.description = json.description;
        this.iconImage = new UploadedFile().fromJson(json.icon_image);
        this.backgroundColor = json.background_color;
        this.backgroundImage = new UploadedFile().fromJson(json.background_image);
        this.allowUnder18 = json.allow_under_18;
        this.nsfw = json.nsfw;

        this.followers = json.followers;

        if (this.blogType === "PERSONAL") {
            this.ownerId = json.owner_id;
            this.displayAge = json.display_age
        } else if (this.blogType === "GROUP") {
            this.owners = json.owners;
        }

        return this;
    };

    this.toJson = function () {
        let json = {
            "id": this.id,
            "base_url": this.baseUrl,
            "complete_url": this.completeUrl,
            "type": this.blogType,
            "name": this.name,
            "description": this.description,
            "icon_image": this.iconImage.toJson(),
            "background_color": this.backgroundColor,
            "background_image": this.backgroundImage.toJson(),
            "allow_under_18": this.allowUnder18,
            "nsfw": this.nsfw,
            "followers": this.followers
        };
        if (this.blogType === "PERSONAL") {
            json.owner_id = this.ownerId;
            json.display_age = this.displayAge;
        } else if (this.blogType === "GROUP") {
            json.owners = this.owners;
        }

        return json;
    }
}