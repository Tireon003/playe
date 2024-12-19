FROM python:3.12

RUN mkdir -p /app/content

WORKDIR /app/server

COPY server/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY server .

ENV PYTHONPATH=/app/server

CMD alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 8000