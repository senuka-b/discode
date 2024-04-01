import requests, progressbar, subprocess, os, sys, signal
from urllib.request import urlretrieve
import win32.lib.win32con as win32con
import win32.win32gui as win32gui

import psutil

is_hidden = False
pbar = None


def kill(proc_pid):
    process = psutil.Process(proc_pid)
    for proc in process.children(recursive=True):
        proc.send_signal(signal.SIGTERM)
    process.send_signal(signal.SIGTERM)


def show_progress(block_num, block_size, total_size):
    global pbar
    if pbar is None:
        pbar = progressbar.ProgressBar(maxval=total_size)
        pbar.start()

    downloaded = block_num * block_size
    if downloaded < total_size:
        pbar.update(downloaded)
    else:
        pbar.finish()
        pbar = None


def get_version():

    with open("./VERSION.txt", "r") as f:
        return f.read()


def toggle_hide_show():
    global is_hidden

    win32gui.ShowWindow(
        win32gui.GetForegroundWindow(),
        win32con.SW_SHOW if is_hidden else win32con.SW_HIDE,
    )
    is_hidden = not is_hidden


def check_for_updates():
    version = get_version()

    response = requests.get(
        "https://api.github.com/repos/yetimeh/discode/releases/latest"
    )

    data = response.json()
    if len(data) == 2:
        return

    if data["tag_name"] != version:
        return data

    return None


def download_update(data):
    for asset in data["assets"]:
        if asset["name"].lower() == "discode-setup.exe":
            print("Downloading:\n")
            urlretrieve(
                asset["browser_download_url"],
                filename="temp-discode-setup.exe",
                reporthook=show_progress,
            )

            return


def execute_setup():
    subprocess.call(["temp-discode-setup.exe"])
    os.remove("temp-discode-setup.exe")
    sys.exit(0)


def start_processes():
    os.chdir("discode-server/")

    print("Opening server")

    server = subprocess.Popen(["discode-server.exe"], shell=False)
    os.chdir("../")

    print("Opening client")
    client = subprocess.Popen(["discode.exe"], shell=False)

    client.wait()
    kill(server.pid)


def main():
    print(
        """
          
          DISCODE LAUNCHER </> v0.0.1
          
          Checking for updates hold on...
          
          """
    )

    updates = check_for_updates()

    if updates:
        print("Update found!\n\nAttempting to update...")

        download_update(updates)

        print("\n\nDownloaded succesfully! Running setup file...")

        execute_setup()

    else:
        start_processes()


main()
