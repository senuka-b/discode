from flask import Flask, jsonify, request

from database.database import Database
from extension.extension_handler import ExtensionHandler
from flask_cors import CORS

from discord.ext import commands

from bot.bot import DiscodeBot
from nodetocode.nodetocode import NodeToCode


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

db = Database()
extension = ExtensionHandler()
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


@app.route("/commands/create", methods=["POST"])
async def create_command():

    if request.method == "POST":
        data = request.get_json()

        parsed_commands_and_events = node_to_code.parse(data)

        for command in parsed_commands_and_events["commands"]:

            await bot.create_command(parsed_commands_and_events["commands"][command])

        # await bot.create_event(parsed_commands_and_events['events']) TODO

        return "success", 200


@app.errorhandler(500)
def internal_server_error(error):
    print("ERROR", error)
    return "ASDASD", 500


def run_api(bot_instance: commands.Bot):
    global bot
    bot = bot_instance

    app.run()
