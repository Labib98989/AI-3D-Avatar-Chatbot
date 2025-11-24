# 1. Use an official lightweight Python image
FROM python:3.11-slim

# 2. Set the working directory inside the container
WORKDIR /code

# 3. Copy the requirements first (to cache dependencies)
COPY ./requirements.txt /code/requirements.txt

# 4. Install the dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 5. Copy the rest of the application code
COPY ./app /code/app

# 6. Expose the port (Render needs to know where to look)
EXPOSE 8000

# 7. Run the application
# We use host 0.0.0.0 to allow external access
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]