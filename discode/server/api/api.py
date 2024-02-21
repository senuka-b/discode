from flask import Flask, jsonify, request

from database.database import Database
from extension.extension_handler import ExtensionHandler
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

db = Database()
extension = ExtensionHandler()

COMPONENTS = {
    "Special components": ["Command", "Event"],
    "Action components": ["Say", "Kick user"],
    "Variable components": ["Get server", "Get user", "Get role"],
}


@app.route("/")
async def home():
    return "App is working!"


@app.route("/recentProjects")
async def recent_projects():
    return await db.fetch_projects()


@app.route("/createProject", methods=["POST"])
async def create_project():
    if request.method == "POST":
        data = request.get_json()

        return_value = extension.create_project(**data)

        if return_value == "file_exists":
            return return_value, 200

        await db.create_project(**data)

        return return_value, 200


@app.route("/components")
async def get_components():

    return COMPONENTS


def run_api():

    app.run(debug=True)
