FROM nginx:alpine3.22
LABEL authors="torevalujano"

COPY *.html /usr/share/nginx/html/

COPY common/ /usr/share/nginx/html/common/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]