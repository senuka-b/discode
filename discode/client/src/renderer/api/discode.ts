import { Dispatch, SetStateAction } from "react";
import {Node, Edge} from "reactflow";

class DiscodeAPI {
    private readonly url: string;

    constructor () {
        this.url = "http://localhost:5000";
    }

    createNewProject (data: object) {

        return new Promise((resolve, reject) => {fetch(this.url+"/projects/create" , {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((value) => {

            value.text().then((_data: string) => {
               resolve(_data);
            })
        })})

    }

    async fetchRecentProjects() {
        const response = await fetch(this.url+"/projects/recent", {
            method: "GET"
        })

        const data: {name: string, path: string}[] = await response.json();

        return data;
    }

    async fetchComponents() {
        const response = await fetch(this.url+"/components", {
            method: "GET"
        })


        const data: string[] = await response.json()
        return data
    }

    reloadCommands (path: string, project_name: string) {
        return new Promise((resolve, reject) => {fetch(this.url+"/commands/reload/"+encodeURIComponent(path)+"?project_name="+encodeURIComponent(project_name) , {
            method: "GET",

        }).then((value) => {

            value.text().then((_data: string) => {
               resolve(_data);
            })
        })})
    }

    renameExtension (data: object) {

        return new Promise((resolve, reject) => {fetch(this.url+"/extensions/rename" , {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((value) => {

            value.text().then((_data: string) => {
               resolve(_data);
            })
        })})
    }

    deleteExtension (data: object) {

        return new Promise((resolve, reject) => {fetch(this.url+"/extensions/delete" , {
            method: "DELETE",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((value) => {

            value.text().then((_data: string) => {
               resolve(_data);
            })
        })})
    }

    getProject (path: string): Promise<{extensions: string[]}> {
        console.log("PATH", path)

        return new Promise((resolve, reject) => {fetch(this.url+"/projects/get", {
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

    getExtension (path: string, name: string): Promise<{nodes: Node[], edges: Edge[]}> {
        return new Promise((resolve, reject) => {fetch(this.url+"/extensions/get", {
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

    createExtension (data: object) {
        return new Promise((resolve, reject) => {fetch(this.url+"/extensions/create", {
            method: "POST",
            body: JSON.stringify(data),
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

    // stopBot () {

    //     return new Promise((resolve, reject) => {fetch(this.url+"/bot/stop" , {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     }).then((value) => {

    //         value.text().then((_data) => {
    //            resolve(_data);
    //         })
    //     })})
    // }



}

export default DiscodeAPI;
