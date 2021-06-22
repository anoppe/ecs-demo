#ECS Fargate Demo
Spring Boot sample application instrumented with AWS X-Ray and corresponding AWS CDK infrastructure to deploy on AWS ECS Fargate

#How to build
```shell
$ ./mvnw clean verify
$ docker build -t <your docker repo>/ecs-demo:latest .
$ docker push <your docker repo>/ecs-demo:latest
$ cd infra
$ npm install
$ npm run build
```

To first be able to inspect the resulting infra, assuming [CDK SDK is installed](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_install), execute:
```shell
$ npx cdk synth
```

To deploy the infra:
```shell
$ npx cdk deply
```
