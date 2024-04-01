import json, os


class Configuration:
    def __init__(
        self,
        debug=False,
    ):
        documents_dir = os.path.join(
            os.path.expanduser("~"), "Documents", "Discode Projects"
        )

        self.location = (
            documents_dir + "/config.json"
            if not debug
            else documents_dir + "/debug-config.json"
        )

        if not os.path.exists(self.location):
            os.makedirs(documents_dir, exist_ok=True)

            self.write_data(data={"settings": {}, "recent_projects": []})

        self.validate_project_paths()

    def validate_project_paths(self):
        data = self.load_data()

        for recent_project in data["recent_projects"]:
            if not os.path.exists(
                recent_project["path"] + f"/{recent_project['name']}.discode"
            ):

                print("Project path not found")

                data["recent_projects"].remove(recent_project)

        self.write_data(data)

    def load_data(self):
        with open(self.location, "r") as f:
            data = json.load(f)

        return data

    def write_data(self, data: dict):
        with open(self.location, "w") as f:
            json.dump(data, f, indent=4)

    def fetch_projects(self):
        self.validate_project_paths()

        data = self.load_data()

        return data["recent_projects"]

    def create_project(
        self,
        project_name: str,
        path: str,
    ):
        ...

        data = self.load_data()

        data["recent_projects"].append({"name": project_name, "path": path})

        self.write_data(data)
