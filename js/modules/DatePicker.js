import AsteroidsTable from "./AsteroidsTable";

class DatePicker {

    constructor() {
        this.start_date = document.getElementById("start_date");
        this.end_date = document.getElementById("end_date");
        this.message = document.getElementById("message");

        document.getElementById("showAsteroids").onclick = this.showAsteroids.bind(this);
    }

    // Calculate the difference
    dateDiffInDays(date1, date2) {
        let dt1 = new Date(date1);
        let dt2 = new Date(date2);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
    }

    showAsteroids() {
        // Calculate the difference
        let difference = this.dateDiffInDays.call(this, start_date.value, end_date.value);

        if(this.start_date.value && this.end_date.value) {
            // Show the asteroids only if difference is no more than 7 days
            if(difference >= 0 && difference <= 7) {
                // Clear existing alert message
                this.message.innerHTML = "";
                
                // Fetch and show asteroids
                AsteroidsTable.prototype.fetchAsteroidsData(this.start_date.value, this.end_date.value);

            } else {
                message.innerHTML = "";
                message.innerHTML = "<p>Date difference must be between 0 and 7</p>";
            }
        } else {
            message.innerHTML = "";
            message.innerHTML = "<p>Please choose both start date and end date.</p>";
        }
    }

}

export default DatePicker;