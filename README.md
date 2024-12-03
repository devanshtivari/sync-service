# Sync Service - NestJS

This project is a **NestJS-based Sync Service** designed to interact with web3 contracts. It listens for events emitted by the contract and pushes these events into a queue system (RabbitMQ) for further processing. The service is intended to run as a microservice and can be executed in development mode using `pnpm start:dev`.


## Table of Contents
1. [Folder Structure](#folder-structure)
2. [Installation](#installation)
3. [Running the Service](#running-the-service)
4. [Technologies Used](#technologies-used)
5. [Environment Variables](#environment-variables)
6. [Usage](#usage)
7. [Contributing](#contributing)
---

## Folder Structure

The project follows a modular approach, where each component is organized in its respective folder:

```bash
src/
├── cache/       # Cache management
├── config/      # Configurations of the application
├── constant/    # Constants used across the project
├── interface/   # Interfaces for the data models
├── providers/   # Service providers
├── queue/       # RabbitMQ queue handlers
├── services/    # Core business logic
├── utils/       # Utility functions
├── web3/        # Web3 integration and event handling
└── app.module.ts  # Main application module
```

Further, *cache*, *queue* and *web3* folders have their independent config folders to ensure modularity of configurations amoung resources. 


## Installation
Ensure that *node.js* is installed, then install all dependencies:

```bash
pnpm add .
```

## Running the service
To start the service in development mode, 
```bash
pnpm start:dev
```
For production, build the service first and then run the compiled files:
```bash
npm run build
npm run start:prod
```

#### Queue system
The service uses RabbitMQ to queue the events from the Web3 contract. Ensure that you have RabbitMQ running and accessible.

## Technologies Used

The project leverages several technologies to provide a robust and scalable sync service for web3 events. Below is an explanation of the key technologies used:

### 1. [NestJS](https://nestjs.com/)
NestJS is a progressive Node.js framework used for building efficient and scalable server-side applications. It is built with TypeScript and takes advantage of the latest JavaScript features while offering strong typing and a modular architecture. 

- **Why NestJS?** 
    - It provides a modular and organized structure for building complex applications.
    - Out-of-the-box support for dependency injection.
    - Powerful CLI tools to help generate modules, services, controllers, and more.
    - Easy integration with other tools and services, like RabbitMQ and Redis, via custom providers and modules.

### 2. [Web3.js](https://web3js.readthedocs.io/)
Web3.js is a collection of libraries used to interact with Ethereum smart contracts. In this sync service, Web3.js allows the service to connect to Ethereum nodes, subscribe to contract events, and listen for blockchain transactions.

- **Why Web3.js?**
    - Provides a high-level API for interacting with Ethereum.
    - Supports both HTTP and WebSocket connections to Ethereum nodes.
    - Handles interaction with smart contracts through ABI (Application Binary Interface).
    - Allows for real-time event listening and transaction monitoring.

### 3. [RabbitMQ](https://www.rabbitmq.com/)
RabbitMQ is an open-source message broker that enables asynchronous message queueing. In this service, RabbitMQ handles the queuing of web3 contract events for downstream processing.

- **Why RabbitMQ?**
    - It provides reliable, distributed, and scalable messaging for microservices architectures.
    - Supports a variety of messaging patterns such as work queues, pub/sub, and routing.
    - Offers easy integration with the `amqplib` package for Node.js applications.
    - Allows decoupling of services, improving the scalability and maintainability of the application.

### 4. [amqp-connection-manager](https://github.com/jwalton/node-amqp-connection-manager)
This package simplifies the connection management for RabbitMQ in Node.js applications. It handles connection retries and reconnection, ensuring the service can always push data to the queue even if RabbitMQ temporarily goes down.

- **Why amqp-connection-manager?**
    - Manages automatic reconnections to RabbitMQ.
    - Provides a simple API to send and consume messages from queues.
    - It’s lightweight and works seamlessly with `amqplib`.

### 5. [Redis](https://redis.io/)
Redis is an in-memory key-value store often used for caching purposes. In this project, Redis is utilized to store frequently accessed data, such as web3 contract states or queue jobs, to reduce the need for repeated database queries or external API calls.

- **Why Redis?**
    - Extremely fast due to its in-memory architecture, making it ideal for caching.
    - Simple key-value interface with support for more complex data structures.
    - Used for reducing latency in API responses and database queries.
    - Seamless integration with `cache-manager` in NestJS.

### 6. [cache-manager](https://github.com/BryanDonovan/node-cache-manager) & [cache-manager-ioredis-yet](https://github.com/dabroek/node-cache-manager-ioredis-yet)
`cache-manager` is a multi-store caching module for Node.js applications. In this project, it is combined with the `cache-manager-ioredis-yet` package, allowing for Redis-backed caching.

- **Why cache-manager?**
    - Provides a uniform API for caching data across different stores (memory, Redis, etc.).
    - Supports expiration times for cached data, allowing efficient resource management.
    - Allows for easy configuration in NestJS with minimal setup.

### 7. [RxJS](https://rxjs.dev/)
RxJS is a reactive programming library that provides an implementation of Observables, helping handle asynchronous events and streams. In the context of this service, RxJS is used to manage asynchronous data streams like contract events.

- **Why RxJS?**
    - Provides a declarative and composable way to handle async operations.
    - Integrates naturally with NestJS’s event-driven architecture.
    - Facilitates complex async workflows like retry logic, mapping, and chaining operations.

### 8. [nestjs-pino](https://github.com/iamolegga/nestjs-pino)
`nestjs-pino` integrates the Pino logging library into NestJS applications. Pino is a high-performance logger designed for extreme speed.

- **Why nestjs-pino?**
    - Offers a highly performant and low-overhead logging system.
    - Integrates well with NestJS modules.
    - Provides built-in support for structured logging, allowing for better observability and monitoring in production environments.
    - Supports `pino-pretty` for human-readable logs during development.

---

These technologies together enable a reliable, efficient, and scalable system for syncing web3 events with a queue-based system for further processing.


## Enviroment Variables
Create a .env file in the root directory and assign the values to the variables given in .env.example file.

## Usage

This sync service can be used in various web3-related applications where real-time synchronization of blockchain events is required. The service listens to events from Ethereum smart contracts and pushes them into a message queue for further processing. This is ideal for applications that need to:

- **Monitor blockchain transactions**: Track specific events like token transfers, approvals, or custom contract events.
- **Sync on-chain data with off-chain systems**: Keep databases or other systems in sync with blockchain state, ensuring that off-chain records reflect the latest on-chain data.
- **Enable event-driven architectures**: Decouple event producers and consumers, allowing for asynchronous and scalable processing using RabbitMQ.
- **Process blockchain events in batches**: Efficiently handle large volumes of contract events by pushing them into a queue for downstream processing (e.g., saving to a database, invoking business logic).

#### Key Components:

1. **Web3.js Integration**:
    - The service connects to an Ethereum node (Infura, Alchemy, or a local node) and listens for events emitted by your smart contracts.
    - Use this for real-time monitoring of blockchain activity.

2. **RabbitMQ for Queueing**:
    - Contract events are pushed to a RabbitMQ message queue for asynchronous processing by other services.
    - This allows the service to handle a large number of events without blocking the main process.

3. **Redis for Caching**:
    - Frequently accessed data (e.g., contract states or event logs) can be cached in Redis to reduce the load on external services.
    - Improves the performance of queries and reduces repetitive calls to the Ethereum node.

4. **Logging and Monitoring**:
    - With `nestjs-pino`, the service logs structured information about event processing, helping with debugging and performance monitoring.
    - Use this to keep track of event flow and ensure smooth operation in production environments.

#### Where Can It Be Used?

- **DeFi Applications**: Track and sync token transfers, liquidity pool changes, or governance voting events.
- **NFT Marketplaces**: Monitor minting, buying, selling, or transferring of NFTs.
- **GameFi Platforms**: Sync in-game assets or event-driven mechanics between blockchain and game servers.
- **Supply Chain Systems**: Record and sync product lifecycle events logged on the blockchain with off-chain databases.
- **General Blockchain Analytics**: Aggregate data from blockchain events for real-time dashboards or reporting tools.

---

This service provides the infrastructure needed for scalable event-driven applications that depend on reliable synchronization between blockchain and off-chain systems.


## Contributing
Feel free to contribute by creating pull requests, reporting issues, or suggesting improvements!


