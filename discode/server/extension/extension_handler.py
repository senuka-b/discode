from pathlib import Path
import json

class ExtensionHandler:

    def create_project(self, **kwargs): 
        path = kwargs.get("path")
        
        try:
            Path(path+f"/{kwargs.get("project_name")}/assets").mkdir(parents=True,)
        except FileExistsError:
            return "file_exists" 
        
        with open(path+f'/{kwargs.get("project_name")}/{kwargs.get("project_name")}.discode', 'w') as file:
            json.dump({
                "metadata": kwargs
            }, file, indent=4 )
        
        return 'success'
        
        
        
        
        
