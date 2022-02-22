# ReviewAPI
Part of a team tasked with building scalable microservices that replaced the legacy monolithic API for an e-commerce platform to handle the increase in growing traffic.
The products microservice was stress tested to ensure the service could handle increased traffic during sales and promotions for the e-commerce platform. All services were tested on EC2 t2.micro instances.


## Project Accomplishments
- Designed a read-optimized Postgres DB achieving queries under 5ms on over 10 million rows of product data
- Ensured low latency (69ms) and 0.00% error rate for fast reliable consumption of the Products Microservice
- Stress tested microservice to ensure it could handle over 10k requests per second with 0% error rate and low latency response.
- Utilized K6 and loader.io to pinpoint system bottlenecks in local development and in the cloud (AWS)
- Implemented Nginx to balance the traffic using a least connection load balancing strategy and caching

### [API Endpoints](https://github.com/legolas-sdc-project/Product-API/blob/main/APIEndpointGuide.md)

## Technologies
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
