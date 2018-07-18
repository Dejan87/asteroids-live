class AsteroidsData {
    constructor() {
        // Retrieve the hazardous asteroids array from the local storage
        this.asteroidArray = JSON.parse(localStorage.getItem("hazardousAsteroids"));
        // Retrieve the selected asteroid from the local storage
        this.selectedAsteroids = JSON.parse(localStorage.getItem("asteroids"));
        
        // Loop through all selected asteroids
        for(let j = 0; j < this.selectedAsteroids.length; j++) {


            for(let i = 0; i < this.asteroidArray.length; i++) {
                // Find the selected asteroid and its data
                if(this.asteroidArray[i].name === this.selectedAsteroids[j]) {
                    // Fetch all close encounters from 1900 to 1999 for selected asteroid
                    this.fetchCloseEncounters(this.asteroidArray[i].links.self, this.selectedAsteroids[j]);
                }
            
            }
        }

        document.getElementById("goBack").onclick = this.goBack.bind(this);
    }

    fetchCloseEncounters(url, asteroidName) {
        let dataFrom1900To1999 = [];
    
        let xhr2 = new XMLHttpRequest();
        xhr2.open('GET', url);
        
        xhr2.send(null);

        let self = this; // Save a reference of "this" keyword for future use
    
        xhr2.onreadystatechange = function () {
            let DONE = 4;
            let OK = 200;
            if (xhr2.readyState === DONE) {
                if (xhr2.status === OK) {
                    let res = JSON.parse(xhr2.responseText);
                    let closeApproaches = res.close_approach_data; // Store all close approaches
    
                    // Find all close approaches from 1900 to 1999
                    for(let i = 0; i < closeApproaches.length; i++) {
                        let date = closeApproaches[i].close_approach_date; // Extract the date of close approach
                        let year = +date.substring(0, 4); // Extract only the year from a date and turn it into number with + operator
                        
                        if(year >= 1900 && year <= 1999) {
                            dataFrom1900To1999.push(closeApproaches[i]); // Save only those in the time span from 1900 to 1999
                        }
                    }
    
                    // Get the number of close approaches
                    let numberOfCloseApproaches = dataFrom1900To1999.length;
    
                    // Pick the color based on the number of the approaches
                    let color = self.pickColor.call(self, numberOfCloseApproaches);
    
                    // Create the chart based on a number
                    self.createChart.call(this, numberOfCloseApproaches, color, asteroidName);
                } else {
                    console.log('Error: ' + xhr2.status); // An error occurred during the request.
                }
            }
        };
    }

    pickColor(number) {
        let color;
    
        if(number < 25) {
            color = "green";
        } else if(number > 25 && number < 45) {
            color = "yellow";
        } else if(number > 45 && number < 75) {
            color = "orange";
        } else {
            color = "red";
        }
    
        return color;
    }

    createChart(closeApproaches, color, asteroidName) {
        // Save a reference to a chartName and chartAsteroid elements
        let chartName = document.getElementById("chart__name");
        let chartAsteroid = document.getElementById("chart__asteroid");
        

        let span = document.createElement("span");
        span.setAttribute("class", "selectedAsteroid");
        let nameText = document.createTextNode(asteroidName);
        span.appendChild(nameText);
        chartName.appendChild(span);
        let br = document.createElement("br");
        chartName.appendChild(br);

        // Create div with the class "chart__asteroid"
        let div = document.createElement("div");
        div.setAttribute("class", "chart__asteroid");
    
        // Create inner div with the class "chart__number", text with number of close approaches, append it to div
        let innerDiv = document.createElement("div");
        innerDiv.setAttribute("class", "chart__number");
        div.appendChild(innerDiv);

        // Append the final div to chartAsteroid element
        chartAsteroid.appendChild(div);
        
        // Add width and background color
        if(closeApproaches <= 100) {
            innerDiv.style.width = "" + closeApproaches + "%";
            innerDiv.style.backgroundColor = color;
            innerDiv.innerHTML = "" + closeApproaches + "";
        } else {
            innerDiv.style.width = "100%";
            innerDiv.style.backgroundColor = color;
            innerDiv.innerHTML = "" + closeApproaches + "";
        }
    }

    goBack() {
        window.location = "index.html"; // Go back to index page
    }
}

export default AsteroidsData;