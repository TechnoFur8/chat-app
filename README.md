# chat-app  

## 📋 Технические требования  

- [Docker](https://www.docker.com/) (версия 20.10.0+)  
- [Docker Compose](https://docs.docker.com/compose/)  
- [Node.js](https://nodejs.org/) (версия 18+)  
- [PostgreSQL](https://www.postgresql.org/) (версия 15+)  

## 🚀 Быстрый старт  

```bash copy  
git clone https://github.com/your-username/chat-app.git  

cd chat-app  

docker-compose up --build  
```  

После успешного запуска откройте в браузере:  
🔹 [http://localhost:3000](http://localhost:3000) - фронтенд приложение  
🔹 [http://localhost:5000](http://localhost:5000) - бэкенд API  

## 📽️ Проекты  

- [chat-server](https://github.com/your-username/chat-server.git) (бэкенд)  
- [chat-client](https://github.com/your-username/chat-client.git) (фронтенд)  

## 🌟 Особенности  

✅ Реальный чат на Socket.IO  
✅ P2P аудиозвонки через WebRTC  
✅ Next.js 15 + TypeScript  
✅ Управление состоянием: RTK Query + Zustand  
✅ Уведомления через Hot Toast  

## 🛠️ Технологии  

**Frontend**: Next.js, TypeScript, shadcn/ui  
**Backend**: Node.js, Express, Socket.IO, WebRTC  
**База данных**: PostgreSQL, Sequelize ORM  
**Инфраструктура**: Docker, Docker Compose  

Для тестирования:  
1. Откройте два разных браузера  
2. Перейдите на [http://localhost:3000](http://localhost:3000) в каждом  
3. Проверьте чат и аудиозвонки между вкладками  
