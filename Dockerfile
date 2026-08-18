FROM node:18-alpine
WORKDIR /app
COPY app.js .
COPY index.html .
EXPOSE 3000
CMD ["node", "app.js"]
