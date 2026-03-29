import os
import shutil
import re

base_dir = r"d:\tazaura\frontend\tazaura-frontend\src"

def process_dir(target_dir):
    for filename in os.listdir(target_dir):
        if not filename.endswith(".jsx"): continue
        if filename in ["App.jsx", "main.jsx"]: continue
        
        name = filename[:-4]
        filepath = os.path.join(target_dir, filename)
        csspath = os.path.join(target_dir, f"{name}.css")
        
        # skip if it's already in an index.jsx
        if name == "index": continue
        
        folder = os.path.join(target_dir, name)
        os.makedirs(folder, exist_ok=True)
        
        # Read contents and fix imports
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        # We will prepend "../" to every relative import EXCEPT for `./Name.css`
        # Because we move Name.css into the same folder!
        
        def replacer(match):
            quot = match.group(1)
            path = match.group(2)
            if path == f"./{name}.css":
                # Keep it as is
                return f"{quot}{path}{quot}"
            # Otherwise prepend '../' to the path (but handle path starting with ./ vs ../)
            if path.startswith("./"):
                # './api' -> '../api'
                new_path = "../" + path[2:]
            elif path.startswith("../"):
                # '../api' -> '../../api'
                new_path = "../" + path
            else:
                new_path = path

            return f"{quot}{new_path}{quot}"

        # Match exactly the contents of from '...' or import '...'
        # This regex matches  from './something'  or  import '../something'
        new_content = re.sub(r"(['\"])([\.\/]+[^\'\"]+)(['\"])", replacer, content)

        # Write to index.jsx
        with open(os.path.join(folder, "index.jsx"), "w", encoding="utf-8") as f:
            f.write(new_content)
        
        # Move CSS if it exists
        if os.path.exists(csspath):
            shutil.move(csspath, os.path.join(folder, f"{name}.css"))
            
        # Delete original jsx
        os.remove(filepath)
        print(f"Refactored {name}")

process_dir(os.path.join(base_dir, "components"))
process_dir(os.path.join(base_dir, "pages"))
process_dir(os.path.join(base_dir, "pages", "admin")) # AdminDashboard

# Now we must fix any App.jsx imports because they point to specific filenames without 'index.jsx'
# Actually, node/vite resolves `import Navbar from './components/Navbar'` to `./components/Navbar/index.jsx` automatically!
# BUT inside App.jsx:
# import Landing       from './pages/Landing'; -> Will work!
# Wait, Auth.css wasn't moved. Let's check who imports Auth.css.
# Login.jsx and Register.jsx.
# In original files they had `import './Auth.css';`
# Which becomes `import '../Auth.css';` which is correct since Auth.css stayed in `pages/`!

print("Done")
