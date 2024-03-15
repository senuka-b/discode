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

    save (data) {
        
        return new Promise((resolve, reject) => {fetch(this.url+"/save" , {
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

    getProject (path) {
        console.log("PATH", path)

        return new Promise((resolve, reject) => {fetch(this.url+"/getProject", {
            method: "POST",
            body: JSON.stringify({ path : path}),
            headers: {
                "Content-Type": "application/json"
            }
        

        }).then((value) => {
            console.log("value: ",value)


            value.json().then((_data) => {
                resolve(_data)
            })
        })
    })
    }

    getExtension (path, name) {
        return new Promise((resolve, reject) => {fetch(this.url+"/getExtension", {
            method: "POST",
            body: JSON.stringify({ path, name}),
            headers: {
                "Content-Type": "application/json"
            }
        

        }).then((value) => {
            console.log(value)

            value.json().then((_data) => {
                

                resolve(_data)
            })
        })
    })
    }
}

export default DiscodeAPI;