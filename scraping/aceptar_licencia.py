from huggingface_hub import HfApi
import os

hf_token = os.getenv("HF_API_TOKEN")
if not hf_token:
    raise RuntimeError("Define HF_API_TOKEN en tus variables de entorno")

api = HfApi()
api.set_access_token(hf_token)

# Reemplaza con el repo_id exacto
repo_id = "mistralai/Mistral-Small-3.1-24B-Instruct-2503"

# Esto marca la licencia como aceptada para tu cuenta
api.accept_repo_license(repo_id)

print(f"Licencia de {repo_id} aceptada ✅")
