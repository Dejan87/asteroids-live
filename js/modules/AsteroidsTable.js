class AsteroidsTable {
    constructor() {
        this.asteroid = document.getElementById("asteroidList");
        this.selectedAsteroids = document.getElementById("selectedAsteroids");
        this.asteroidsMessage = document.getElementById("asteroidsMessage");
        this.inputMessage = document.getElementById("inputMessage");

        // Pagination variables
        this.currentPage = 0;
        this.pageSize = 10;
        this.currentPageItems = [];
        this.previousPageItems = [];

        // Create empty array in the localStorage, use it to store selected asteroids
        this.asteroidArray = [];
        localStorage.setItem("asteroids", JSON.stringify(this.asteroidArray));

        document.getElementById("closeApproaches").onclick = this.closeApproaches.bind(this);
        document.getElementById("asteroidList").onchange = this.addAsteroidToTheList.bind(this);

        // Pagination references
        this.next = document.getElementById("nextPageButton");
        this.prev = document.getElementById("previousPageButton");
        this.next.onclick = this.navigateToNextPage.bind(this);
        this.prev.onclick = this.navigateToPrevoiusPage.bind(this);

        // Sorting references
        document.getElementById("thSpeed").onclick = this.sortBySpeed.bind(this);
        document.getElementById("thName").onclick = this.sortByName.bind(this);

        this.previousSearch(); // If there is data in local storage, use it
    }

    addAsteroidToTheList() {
        let asteroid = this.asteroid.value;

        // Check if asteroid is already selected, already exist in the list
        let check = this.checkValidity.call(this, asteroid);
        
        if(asteroid) {

            // Check if asteroid is already selected, already exist in the list
            if( check ) {
                let asteroidArray = JSON.parse(localStorage.getItem("asteroids"));
                asteroidArray.push(asteroid); // Add selected asteroid to the array
                
                // Create div element and set his id (name of the asteroid)
                let div = document.createElement("div");
                div.setAttribute("id", this.asteroid.value);

                //Create the first span, set the class to "name" and text to asteroid name. Append to the div element
                let firstSpan = document.createElement("span");
                firstSpan.setAttribute("class", "name");
                let text = document.createTextNode(this.asteroid.value);
                firstSpan.appendChild(text);
                div.appendChild(firstSpan);

                // Create the second span, set the class to delete and text to "x". Append to the div element
                let secondSpan = document.createElement("span");
                secondSpan.setAttribute("class", "delete");
                let text2 = document.createTextNode("x");
                secondSpan.appendChild(text2);
                div.appendChild(secondSpan);

                // Append the div element to the selectedAsteroids list
                this.selectedAsteroids.appendChild(div);

                // Add eventListener to all elements with the class name delete
                let elements = document.getElementsByClassName("delete");
                for(let i = 0; i < elements.length; i++) {
                    elements[i].addEventListener("click", this.deleteAsteroid);
                }

                this.asteroid.value = ""; // Clear the field

                localStorage.setItem("asteroids", JSON.stringify(asteroidArray)); // Save the array to the local storage for future use

                this.inputMessage.innerHTML = ""; // Clear existing data, if any

            } else {
                this.inputMessage.innerHTML = ""; // Clear existing data, if any
                this.asteroid.value = ""; // Clear the field

                this.inputMessage.innerHTML = "<p>Selected asteroid is already in the list, or you have entered asteroid name that does not exist.</p>";
            }         
        } else {
            this.inputMessage.innerHTML = ""; // Clear existing data, if any

            this.inputMessage.innerHTML = "<p>Please select one of the asteroids.</p>";
        }
    }

    deleteAsteroid() {
        // Get the id of the element that user wants to delete from the list, id is equal to asteroid name
        let id = this.parentNode.getAttribute("id");

        // Find the index of that asteroid in the asteroidArray
        let asteroidArray = JSON.parse(localStorage.getItem("asteroids"));
        let index = asteroidArray.indexOf(id);

        // Remove that element/asteroid from the array/list
        asteroidArray.splice(index, 1);

        // Update the array in the localStorage after deleting
        localStorage.setItem("asteroids", JSON.stringify(asteroidArray));

        // Update user's list
        AsteroidsTable.prototype.updateUserList();
    }

    updateUserList() {
        // Get the asteroid array from localStorage
        let asteroidArray = JSON.parse(localStorage.getItem("asteroids"));
        let selected = document.getElementById("selectedAsteroids");

        // First, clear the existing list
        selected.innerHTML = "";
        
        // Display updated elements to the list
        for(let i = 0; i < asteroidArray.length; i++) {
            // Create div element and set his id (name of the asteroid)
            let div = document.createElement("div");
            div.setAttribute("id", asteroidArray[i]);

            //Create the first span, set the class to "name" and text to asteroid name. Append to the div element
            let firstSpan = document.createElement("span");
            firstSpan.setAttribute("class", "name");
            let text = document.createTextNode(asteroidArray[i]);
            firstSpan.appendChild(text);
            div.appendChild(firstSpan);

            // Create the second span, set the class to delete and text to "x". Append to the div element
            let secondSpan = document.createElement("span");
            secondSpan.setAttribute("class", "delete");
            let text2 = document.createTextNode("x");
            secondSpan.appendChild(text2);
            div.appendChild(secondSpan);

            // Append the div element to the selectedAsteroids list
            selected.appendChild(div);
        }

        // Add eventListener to all elements with the class name delete
        let elements = document.getElementsByClassName("delete");
        for(let j = 0; j < elements.length; j++) {
            elements[j].addEventListener("click", this.deleteAsteroid);
        }

    }

    checkValidity(selectedAsteroid) {
        // Retrieve the array from local storage
        let asteroidArray = JSON.parse(localStorage.getItem("asteroids"));

        // Check if asteroid is already in the list
        let position = asteroidArray.indexOf(selectedAsteroid);
        
        // Check if the entered value is one of the asteroids in the table
        let tableOfAsteroids = JSON.parse(localStorage.getItem("hazardousAsteroids"));

        let arrayOfNames = [];
        for(let i = 0; i < tableOfAsteroids.length; i++) {
            arrayOfNames.push(tableOfAsteroids[i].name);
        }

        let checkName = arrayOfNames.indexOf(selectedAsteroid);
        
        if(position === -1 && checkName > -1) {
            return true;
        } else {
            return false;
        }
    }

    fetchAsteroidsData(start_date, end_date) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', "https://api.nasa.gov/neo/rest/v1/feed?start_date=" 
                        + start_date + "&end_date=" 
                        + end_date 
                        + "&api_key=x0HeIJzRCLm3lj0zrfXt2LltusKVCO7aoHmRkVq2");
    
        xhr.send(null);

        let self = this; // Save a reference of "this" keyword for future use

        xhr.onreadystatechange = function () {
            let DONE = 4;
            let OK = 200;
            if (xhr.readyState === DONE) {
                if (xhr.status === OK) {
                    let res = JSON.parse(xhr.responseText);
                    let days = Object.keys(res.near_earth_objects); // Collect all the keys/days, so you can access all asteroids by day

                    let hazardousAsteroids = self.fetchHazardousAsteroids.call(self, res, days); // Store only hazardous asteroids
                    
                    // Save the resulting array to local storage for future use
                    localStorage.setItem("hazardousAsteroids", JSON.stringify(hazardousAsteroids));

                    self.createTable.call(self, hazardousAsteroids);
                    self.createAsteroidsList.call(self, hazardousAsteroids);
                } else {
                    console.log('Error: ' + xhr.status); // An error occurred during the request.
                }
            }
        };
    }

    fetchHazardousAsteroids(response, days) {
        let results = []; // Store all hazardous asteroids here

        for (let i = 0; i < days.length; i++) {

            let asteroidsOnEachDay = response.near_earth_objects[days[i]]; // Check all asteroids on a given day

            for(let j = 0; j < asteroidsOnEachDay.length; j++) {
                // Look for a asteroid that is hazardous
                if(asteroidsOnEachDay[j].is_potentially_hazardous_asteroid === true) {
                    results.push(asteroidsOnEachDay[j]); // Add hazardous asteroid to a resulting array
                }
            }
        }

        return results;
    }

    createTable(array) {
        let tableBody = document.getElementById("table-body");
    
        // Before creating a table make sure to clear existing data, if any
        tableBody.innerHTML = "";

        // Create a new row for each hazardous asteroid
        for(let i = 0; i < array.length; i++) {
            let tr = document.createElement("tr"); // Create table row

            // Create all table cells and append them to table row, five in total
            let date = document.createElement("td");
            let dateText = document.createTextNode(array[i].close_approach_data["0"].close_approach_date);
            date.appendChild(dateText);
            tr.appendChild(date);

            let name = document.createElement("td");
            let nameText = document.createTextNode(array[i].name);
            name.appendChild(nameText);
            tr.appendChild(name);

            let speed = document.createElement("td");
            let speedText = document.createTextNode(array[i].close_approach_data["0"].relative_velocity.kilometers_per_hour);
            speed.appendChild(speedText);
            tr.appendChild(speed);

            let min = document.createElement("td");
            let minText = document.createTextNode(array[i].estimated_diameter.meters.estimated_diameter_min);
            min.appendChild(minText);
            tr.appendChild(min);

            let max = document.createElement("td");
            let maxText = document.createTextNode(array[i].estimated_diameter.meters.estimated_diameter_max);
            max.appendChild(maxText);
            tr.appendChild(max);

            // Append the whole row to the table
            tableBody.appendChild(tr);

            // Show the preview
            let asteroidSection = document.getElementById("asteroids-preview");
            asteroidSection.style.display = "block";

            // Clear the input field, if there is any data from previous search
            document.getElementById("asteroidList").value = "";
        }

        let pageText = document.createTextNode("1");
        let text = document.getElementById("pageNumber");
        text.innerText = "";
        text.appendChild(pageText);

        if(array.length > 10) {
            this.initializeTable.call(this);
            document.getElementById('nextPageButton').disabled = false;
            document.getElementById('previousPageButton').disabled = true;
        } else {
            document.getElementById('nextPageButton').disabled = true;
            document.getElementById('previousPageButton').disabled = true;
        }
    }

    createAsteroidsList(array) {
        let dropdown = document.getElementById("asteroids");
    
        // Before creating a dropdown make sure to clear existing data, if any
        dropdown.innerHTML = "";

        for(let i = 0; i < array.length; i++) {

            let option = document.createElement("option"); // Create the option tag

            option.setAttribute("value", array[i].name); // Set the value

            // Append all the options to the dropdown
            dropdown.appendChild(option);
        }
    }

    closeApproaches() {
        // Redirect user to a new page
        window.location = "asteroids-data.html";
    }

    /**
     * If there is data in local storage, show that data to the user (on index page)
     * When user visits the chart page, he/she can see previous search results after returning to index
     */

    previousSearch() {
        let previousSearch = localStorage.getItem("hazardousAsteroids");

        if(previousSearch) {
            previousSearch = JSON.parse(localStorage.getItem("hazardousAsteroids"));
            this.createTable.call(this, previousSearch); // Show previous search results
            this.createAsteroidsList.call(this, previousSearch); // Populate dropdown
        }
    }

    /******************************************
     *         PAGINATION LOGIC
     *****************************************/
    initializeTable() {
        let asteroids = JSON.parse(localStorage.getItem("hazardousAsteroids"));
        if (asteroids.length > this.pageSize) {
            this.currentPageItems = asteroids.slice(0, this.pageSize);
            document.getElementById('nextPageButton').disabled = false;
            document.getElementById('previousPageButton').disabled = true;
        } else {
            this.currentPageItems = asteroids;
            document.getElementById('nextPageButton').disabled = true;
            document.getElementById('previousPageButton').disabled = true;
        }
    
        this.fillCurrentPageItems.call(this);
    }

    fillCurrentPageItems() {
        let tableBody = document.getElementById('table-body');
        this.clearTable.call(this);

        // Create a new row for each hazardous asteroid
        for(let i = 0; i < this.currentPageItems.length; i++) {

            let tr = document.createElement("tr"); // Create table row

            // Create all table cells and append them to table row, five in total
            let date = document.createElement("td");
            let dateText = document.createTextNode(this.currentPageItems[i].close_approach_data["0"].close_approach_date);
            date.appendChild(dateText);
            tr.appendChild(date);

            let name = document.createElement("td");
            let nameText = document.createTextNode(this.currentPageItems[i].name);
            name.appendChild(nameText);
            tr.appendChild(name);

            let speed = document.createElement("td");
            let speedText = document.createTextNode(this.currentPageItems[i].close_approach_data["0"].relative_velocity.kilometers_per_hour);
            speed.appendChild(speedText);
            tr.appendChild(speed);

            let min = document.createElement("td");
            let minText = document.createTextNode(this.currentPageItems[i].estimated_diameter.meters.estimated_diameter_min);
            min.appendChild(minText);
            tr.appendChild(min);

            let max = document.createElement("td");
            let maxText = document.createTextNode(this.currentPageItems[i].estimated_diameter.meters.estimated_diameter_max);
            max.appendChild(maxText);
            tr.appendChild(max);

            // Append the whole row to the table
            tableBody.appendChild(tr);
        }
    }

    clearTable() {
        let table = document.getElementById('table-body');
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
    }

    navigateToNextPage() {
        let asteroids = JSON.parse(localStorage.getItem("hazardousAsteroids"));
        let numberOfElementsToPlaceInNextPage = ((asteroids.length > this.currentPage * this.pageSize + this.pageSize) ? this.pageSize : asteroids.length - this.currentPage * this.pageSize);
        
        if (this.currentPageItems) {
            this.previousPageItems = this.currentPageItems;
        }
        this.currentPage++;
        this.currentPageItems = asteroids.slice(this.currentPage * this.pageSize, this.currentPage * this.pageSize + numberOfElementsToPlaceInNextPage);
    
        if (asteroids.indexOf(this.currentPageItems[this.currentPageItems.length-1]) == asteroids.length-1) {
            document.getElementById('nextPageButton').disabled = true;       
        }
        document.getElementById('previousPageButton').disabled = false;
        
        this.fillCurrentPageItems.call(this);

        let number = this.currentPage + 1;
        let pageText = document.createTextNode("" + number);
        let text = document.getElementById("pageNumber");
        text.innerText = "";
        text.appendChild(pageText);
        
    }

    navigateToPrevoiusPage() {
        let asteroids = JSON.parse(localStorage.getItem("hazardousAsteroids"));
        this.currentPageItems = this.previousPageItems;
        this.fillCurrentPageItems.call(this);
        document.getElementById('nextPageButton').disabled = false;
        this.currentPage--;
    
        if (this.currentPage == 0) {        
            document.getElementById('previousPageButton').disabled = true;
            this.previousPageItems = [];
        } else {
            this.previousPageItems = asteroids.slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize);
        }

        let number = this.currentPage + 1;
        let pageText = document.createTextNode("" + number);
        let text = document.getElementById("pageNumber");
        text.innerText = "";
        text.appendChild(pageText);
    }

    /******************************************
     *         SORTING LOGIC
     *****************************************/
    sortBySpeed() {
        // Get the copy of hazardous asteroids from local storage
        let array = JSON.parse(localStorage.getItem("hazardousAsteroids"));
        let speedArray = [];
        let updatedArray = [];

        // Loop through all asteroids and get their speed values
        for(let i = 0; i < array.length; i++) {
            let number = +array[i].close_approach_data["0"].relative_velocity.kilometers_per_hour; // Turn each string into number
            speedArray.push(number);
        }

        // Sort the speed Array from max to min speed
        let sortedArray = this.sortMax.call(this, speedArray);

        // Loop through sortedArray and sort elements by their speed
        for(let j = 0; j < sortedArray.length; j++) {
            let text = "" + sortedArray[j]; // Turn each number back to string value
            
            for(let k = 0; k < array.length; k++) {
                // Find that asteriod object by checking its speed value
                if(text === array[k].close_approach_data["0"].relative_velocity.kilometers_per_hour) {  
                    updatedArray.push(array[k]); // push the asteroid object to udatedArray
                }

            }
        }
        localStorage.setItem("hazardousAsteroids", JSON.stringify(updatedArray)); // Update the localStorage

        this.createTable.call(this, updatedArray); // Update the table
    }

    sortByName() {
        // Get the copy of hazardous asteroids from local storage
        let array = JSON.parse(localStorage.getItem("hazardousAsteroids"));
        let nameArray = [];
        let sortedNameArray = [];

        // Loop through all asteroids and get their name values
        for(let i = 0; i < array.length; i++) {
            nameArray.push(array[i].name);
        }

        // Sort the name array
        nameArray.sort();

        for(let j = 0; j < nameArray.length; j++) {
            
            for(let k = 0; k < array.length; k++) {
                // Find that asteriod object by checking its name
                if(nameArray[j] === array[k].name) {
                    sortedNameArray.push(array[k]); // push the asteroid object to sortedNameArray
                }

            }
        }

        localStorage.setItem("hazardousAsteroids", JSON.stringify(sortedNameArray)); // Update the localStorage

        this.createTable.call(this, sortedNameArray); // Update the table

    }

    sortMax(array) {
        array.sort(this.sortNumber.bind(this));

        return array;
    }

    sortNumber(a,b) {
        return b - a;
    }


}

export default AsteroidsTable;