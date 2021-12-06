FROM python:3.9.9

# MAINTAINER Brad Rogers "brad12rogers@gmail.com"

COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip install -r requirements.txt

COPY . /app
