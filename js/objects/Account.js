function Account() {
    this.id = "Unassigned";
    this.username = "Unassigned";
    this.birthday = "1970-01-01";
    this.safeSearch = false;
    this.verified = false;
    this.admin = false;

    this.toJson = function () {
        return {
            "id": this.id,
            "username": this.username,
            "birthday": this.birthday,
            "safe_search": this.safeSearch,
            "verified": this.verified,
            "admin": this.admin
        };
    };

    this.fromJson = function (json) {
        this.id = json.id;
        this.username = json.username;
        this.birthday = json.birthday;
        this.safeSearch = json.safe_search;
        this.verified = json.verified;
        this.admin = json.admin;

        return this;
    };
}