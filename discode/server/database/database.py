import aiosqlite, asyncio


class Database:
    def __init__(self):
        self.location = "./database/db.db"

        asyncio.run(self.connect())

    async def connect(self):
        self.db = await aiosqlite.connect("./database/db.db")

        await self.db.execute(
            """
                                                    
            CREATE TABLE IF NOT EXISTS projects (
                project_name TEXT NOT NULL,
                bot_token TEXT NOT NULL,
                default_command_prefix TEXT NOT NULL,
                path TEXT NOT NULL,
                description TEXT
                
            )
                                              
            """
        )

        await self.db.commit()

    async def fetch_projects(self):
        cursor = await self.db.execute("SELECT project_name FROM projects")
        return await cursor.fetchall()

    async def create_project(
        self,
        project_name: str,
        bot_token: str,
        default_command_prefix: str,
        path: str,
        description: str = "",
    ):

        await self.db.execute(
            "INSERT INTO projects VALUES (?, ?, ?, ?, ?)",
            (project_name, bot_token, default_command_prefix, path, description),
        )

        await self.db.commit()
