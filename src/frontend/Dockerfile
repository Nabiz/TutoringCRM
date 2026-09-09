FROM node:24.15-bookworm AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration=production

FROM nginx:1.29-alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist /tmp/dist
RUN set -eux; \
    if [ -d /tmp/dist/Frontend/browser ]; then \
        cp -a /tmp/dist/Frontend/browser/. /usr/share/nginx/html/; \
    elif [ -d /tmp/dist/frontend/browser ]; then \
        cp -a /tmp/dist/frontend/browser/. /usr/share/nginx/html/; \
    elif [ -d /tmp/dist/browser ]; then \
        cp -a /tmp/dist/browser/. /usr/share/nginx/html/; \
    elif [ -d /tmp/dist/Frontend ]; then \
        cp -a /tmp/dist/Frontend/. /usr/share/nginx/html/; \
    elif [ -d /tmp/dist/frontend ]; then \
        cp -a /tmp/dist/frontend/. /usr/share/nginx/html/; \
    else \
        echo "Angular build output not found"; \
        find /tmp/dist -maxdepth 4 -print; \
        exit 1; \
    fi

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]