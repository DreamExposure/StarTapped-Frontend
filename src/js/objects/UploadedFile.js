function UploadedFile() {
    this.hash = "Unassigned";
    this.path = "Unassigned";
    this.type = "Unassigned";
    this.url = "Unassigned";
    this.uploader = "Unassigned";
    this.timestamp = 0;
    this.name = "Unassigned";

    this.toJson = function () {
        return {
            "hash": this.hash,
            "path": this.path,
            "type": this.type,
            "url": this.url,
            "uploader": this.uploader,
            "timestamp": this.timestamp,
            "name": this.name
        }
    };

    // noinspection Duplicates
    this.fromJson = function (json) {
        this.hash = json.hash;
        this.path = json.path;
        this.type = json.type;
        this.url = json.url;
        this.uploader = json.uploader;
        this.timestamp = json.timestamp;
        this.name = json.name;

        return this;
    };

}