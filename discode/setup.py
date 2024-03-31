import subprocess, shutil, os

VERSION = "v0.0.1"


# Bundle the server
os.chdir("server/")

subprocess.call(["pyinstaller", "main.py", "--noconsole", "-n", "server"], shell=True)

# pyinstaller's add-data didn't seem to work
shutil.copy("config.json", "dist/server/")

# Bundle the client
os.chdir("../client/")

subprocess.call(["npm", "run", "electron:build"], shell=True)

# Bundle the launcher
os.chdir("../launcher/")

subprocess.call(
    [
        "pyinstaller",
        "launch.py",
        "--onefile",
        "-n",
        "launcher",
        "-i",
        "../client/public/icon.ico",
    ],
    shell=True,
)

os.chdir("../bundled")

if not os.path.exists(VERSION):

    shutil.copytree("../server/dist/", VERSION + "/", dirs_exist_ok=True)
    shutil.copytree("../client/dist/win-unpacked/", VERSION, dirs_exist_ok=True)
    shutil.copy("../launcher/dist/launcher.exe", VERSION)

    with open(f"{VERSION}/VERSION.txt", "w") as f:
        f.write(VERSION)
