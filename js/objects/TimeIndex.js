function TimeIndex(month, year) {
    this.month = month;
    this.year = year;

    this.getStart = function () {
        let d = new Date(this.year, this.month, 1);
        d.setHours(0, 0, 0, 0);

        return d;
    };

    this.getStop = function () {
        let d = this.getStart();
        d.setMonth(d.getMonth() + 1);

        return d;
    };

    this.forwardOneMonth = function () {
        if (month === 11) {
            month = 0;
            year++;
        } else {
            month++;
        }
    };

    this.backwardOneMonth = function () {
        if (month === 0) {
            month = 11;
            year--;
        } else {
            month--;
        }
    }
}