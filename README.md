# Discode

> [!IMPORTANT]  
> This is my attempt to learn React. Please read [note](#note)




## What is  Discode

Discode is an application that allows you to create Discord bots without having to write any code. The app works by simply connecting nodes graphically to create simple logic that would allow users to create simple commands, respond to events and so on.

Discode is created with React on top of electron. It uses python as it's backend.

## Showcase

Something like this:


https://github.com/yetimeh/discode/assets/111502106/5d4d9f14-d2d3-4f30-b9bf-803be96a44e6



## Features

- Create Discord bots graphically
- Design simple logic by connecting nodes
- Implement commands and event responses effortlessly

## Technologies Used

- React
- Electron
- Python (Flask)

## Getting Started

Clone the repo

```bash
git clone https://github.com/yetimeh/discode

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



## License

This project is licensed under the [MIT License](LICENSE).
