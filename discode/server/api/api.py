from flask import Flask, jsonify, request

from config.config import Configuration
from extension.extension_handler import ExtensionHandler
from flask_cors import CORS

from discord.ext import commands

from bot.bot import DiscodeBot
from nodetocode.nodetocode import NodeToCode

from .socket import SocketMessenger

from flask_socketio import SocketIO


app = Flask(__name__)

CORS(app)


socket = SocketIO(app, cors_allowed_origins="*")

messenger = SocketMessenger(socket)


config = Configuration(debug=True)

node_to_code = NodeToCode()

bot: DiscodeBot = None

COMPONENTS = {
    "Special components": ["Command", "Event"],
    "Action components": ["Say", "Kick user", "Ban user"],
    "Variable components": ["Get server", "Get user", "Get role", "Get channel"],
    "Check components": ["Permissions check", "Role check", "User check"],
}


@app.route("/")
async def home():
    return "App is working!"


@app.route("/projects/recent")
async def recent_projects():
    return config.fetch_projects()


@app.route("/projects/create", methods=["POST"])
async def create_project():
    if request.method == "POST":

        data = request.get_json()

        extension = ExtensionHandler(**data)

        return_value = extension.create_project()

        if return_value == "file_exists":
            return return_value, 200

        config.create_project(
            data["project_name"], data["path"] + "/" + data["project_name"]
        )

        return return_value, 200


@app.route("/components")
async def get_components():

    return COMPONENTS


@app.route("/commands/create", methods=["POST"])
async def create_command():

    if request.method == "POST":
        data = request.get_json()

        parsed_commands_and_events = node_to_code.parse(data)

        bot.validate_commands_and_events()

        for command in parsed_commands_and_events["commands"]:

            await bot.create_command(
                messenger, parsed_commands_and_events["commands"][command]
            )

        return "success", 200

        # await bot.create_event(parsed_commands_and_events['events']) TODO


@app.route("/projects/get", methods=["POST"])
async def get_project():
    if request.method == "POST":
        data = request.get_json()

        extension = ExtensionHandler(**data)

        return extension.get_project()


@app.route("/extensions/get", methods=["POST"])
async def get_extension():
    if request.method == "POST":
        data = request.get_json()

        extension = ExtensionHandler(**data)

        return extension.get_extension(data["name"])


@app.route("/extensions/create", methods=["POST"])
async def create_extension():
    if request.method == "POST":
        data = request.get_json()

        print(":DAta", data)

        extension = ExtensionHandler(**data)

        return extension.create_extension(data["name"], data["description"])


def run_api(bot_instance: commands.Bot):
    global bot
    bot = bot_instance

    socket.run(app)
