FROM python:3.11.2-buster

WORKDIR /app

COPY requirements.txt ./

RUN pip install -r requirements.txt

RUN apt-get update

COPY . ./

EXPOSE 5601

CMD [ "python", "llama-index.py" ]