function TimeIndex() {
    this.month = new Date().getMonth();
    this.year = new Date().getFullYear();

    this.getStart = function () {
        let d = new Date(this.year, this.month, 1);
        d.setHours(0, 0, 0, 0);

        return d;
    };

    this.getStop = function () {
        let d = new Date(this.year, this.month + 1, 1);
        d.setHours(0, 0, 0 ,0);

        return d;
    };

    this.forwardOneMonth = function () {
        if (this.month === 11) {
            this.month = 0;
            this.year++;
        } else {
            this.month++;
        }
    };

    this.backwardOneMonth = function () {
        if (this.month === 0) {
            this.month = 11;
            this.year--;
        } else {
            this.month--;
        }
    }
}