FROM python:3.12.0-slim-bookworm

ENV PYTHONUNBUFFERED 1
ENV PYTHONWRITEBYTECODE 1
ENV APP=/app

WORKDIR $APP

# Install system dependencies for node + build tools
RUN apt-get update && \
    apt-get install -y curl build-essential && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Install Python dependencies
COPY requirements.txt $APP
RUN pip3 install -r requirements.txt

# Copy entire project
COPY . $APP

# 🟡 Build the frontend
WORKDIR $APP/frontend
RUN npm install && npm run build

# 🔵 Move the built frontend into Django's static folder
WORKDIR $APP
RUN cp -r frontend/build/* static/

# Collect Django static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]

CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "djangoproj.wsgi"]
