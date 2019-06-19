function Account() {
    this.id = "Unassigned";
    this.username = "Unassigned";
    this.birthday = "1970-01-01";
    this.safeSearch = false;
    this.verified = false;
    this.admin = false;
    this.age = -1;

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
        if (json.hasOwnProperty("birthday")) {
            this.birthday = json.birthday;
            this.age = calculateAge(this.birthday);
        }
        if (json.hasOwnProperty("age")) {
            this.age = json.age;
        }
        this.safeSearch = json.safe_search;
        this.verified = json.verified;
        this.admin = json.admin;

        return this;
    };


    function calculateAge(dateString) {
        let today = new Date();
        let birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}