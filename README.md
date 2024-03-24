# Discode

> [!IMPORTANT]  
> This is my attempt to learn React. Please read [note](#note)




## What is  Discode

Discode is an application that allows you to create Discord bots without having to write any code. The app works by simply connecting nodes graphically to create simple logic that would allow users to create simple commands, respond to events and so on.

Discode is created with React on top of electron. It uses python as it's backend.

## Showcase

Something like this:

https://github.com/yetimeh/discode/assets/111502106/5d4d9f14-d2d3-4f30-b9bf-803be96a44e6

Concept Video:

Check it out on YouTube -> https://youtu.be/H8Y8U3d_Mk4?si=BSsmyLlX0VemFCaw



## Features

- Create Discord bots graphically
- Design simple logic by connecting nodes
- Implement commands and event responses effortlessly

## Technologies Used

- React
- Electron
- Python (Flask)

## Installation

Currently the app is not production ready, yet. If you want to try it out you can clone this repo (see [Development](#development)).

The upcoming [BETA release](#beta-001-coming-soon) would have the features listed at [features](#features-1)


## Development

Clone the repo

```bash
git clone https://github.com/yetimeh/discode && cd discode

```

Install dependencies

```bash
cd client && npm install
```

```bash
cd ../
cd server && pip install -r requirements.txt
```

Run the development server

```bash
cd server
python main.py
```

Run the client 
```bash
cd client
npm run electron:serve
```

## Usage

Documentation will be out soon!


## Note

> [!NOTE]  
> Discode is primarily developed as an experiment to learn React and explore Python's Flask module. So, it might not have all the fancy features(which I'd try to add as much as I could) and strong performance you'd find in professional apps. You won't find production-grade code in here since I'm learning as I'm creating the project. However, feel free to contribute to the project by submitting bug reports, feature requests, or pull requests, and suggestions on how I can improve my code. If you want to reach out to me personally you can [add me on Discord](https://discordapp.com/users/652407551849267200)


## Releases

### BETA 0.0.1 (Coming soon)

Initial release

#### Features

##### Special

- Prefix command support + parameters
- Auto-update feature 
- Auto-save .discode files
- Extension support


##### Actions

- Say action
- Get Channel action
- Clear messages action
- Kick user action
- Ban user action

##### Interface actions

- Console
- Reload bot
- Stop bot
- Help linking to documentation

##### Bug fixes

- none


## Planned features

[] - Logical actions
    
    [] - if-then-else action
    [] - loop action

[] - Command checks

[] - Slash command support

[] - Hybrid command support

[] - Database functionality (for storing data)

[] - Action components

    [x] - Say action
    [x] - Get Channel action
    [x] - Clear messages action
    [x] - Kick user action
    [x] - Ban user action
    [] - Embed action
    [] - Send embed action
    [] - Send file action
    [] - ...

[] - Error handling
    
    [] - Per command
    [] - Global error handling

[] - Help command

[] - Help templated extension

[] - Error handler templated extension






## License

This project is licensed under the [MIT License](LICENSE).
