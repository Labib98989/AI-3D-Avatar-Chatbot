# 1. Use python 3.11
FROM python:3.11-slim

# 2. Set the build directory
WORKDIR /code

# 3. Copy requirements and install
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 4. Copy the app code
COPY ./app /code/app

# --- THE FIX STARTS HERE ---
# 5. Change the working directory to inside the app folder
WORKDIR /code/app

# 6. Expose the port
EXPOSE 8000

# 7. Run the command (Notice we removed 'app.' from app.main:app)
# Because we are now inside the folder, we just call "main:app"
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
