class DiscodeAPI {
    constructor () {
        this.url = "http://localhost:5000";
    }

    createNewProject (data) {
       
        return new Promise((resolve, reject) => {fetch(this.url+"/createProject" , {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((value) => {
            
            value.text().then((_data) => {
               resolve(_data);
            })
        })})

    }

    async fetchRecentProjects() {
        const response = await fetch(this.url+"/recentProjects", {
            method: "GET"
        })

        const data = await response.json();

        return data;
    }

    async fetchComponents() {
        const response = await fetch(this.url+"/components", {
            method: "GET"
        })


        return await response.json()
    }

    createNewCommand (data) {
        return new Promise((resolve, reject) => {fetch(this.url+"/commands/create" , {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((value) => {
            
            value.text().then((_data) => {
               resolve(_data);
            })
        })})
    }
}

export default DiscodeAPI;