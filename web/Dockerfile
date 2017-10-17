FROM nginx:1.13.5-alpine

ENV API_ENDPOINT http://api:3000

COPY ./app /usr/share/nginx/html

COPY ./start.sh /start.sh

WORKDIR /

CMD ./start.sh
