# Etapa 1: Copiar assets do Swagger UI
FROM swaggerapi/swagger-ui:v5.9.1 AS swagger-ui

# Etapa 2: Configuração do ambiente Python
FROM python:3.10-slim AS base

# Diretório de trabalho no container
WORKDIR /app

# Copiar dependências do projeto
COPY ./requirements.txt /app/requirements.txt

# Instalar dependências do Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Copiar assets do Swagger UI
COPY --from=swagger-ui /usr/share/nginx/html/swagger-ui.css /app/swagger-ui-assets/swagger-ui.css
COPY --from=swagger-ui /usr/share/nginx/html/swagger-ui-bundle.js /app/swagger-ui-assets/swagger-ui-bundle.js

# Copiar o restante do código do projeto
COPY . /app

# Definir o PYTHONPATH para garantir que o módulo seja encontrado
ENV PYTHONPATH="/app"

# Expor a porta
EXPOSE 9001

# Comando para iniciar o Gunicorn com UvicornWorker
CMD ["gunicorn", "--bind", "0.0.0.0:9001", "--workers", "1", "--timeout", "0", "images.webservice:app", "-k", "uvicorn.workers.UvicornWorker"]
