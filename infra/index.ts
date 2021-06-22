import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');
import cdk = require('@aws-cdk/core');
import {AwsLogDriver, Protocol} from "@aws-cdk/aws-ecs";
import {RetentionDays} from "@aws-cdk/aws-logs";
import {Role, ServicePrincipal} from "@aws-cdk/aws-iam";
import {Duration} from "@aws-cdk/core";

class MyFargate extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC and Fargate Cluster
    const vpc = new ec2.Vpc(this, 'MyVpc', { maxAzs: 2 });
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });
    const taskRole = new Role(this, 'TaskRole', {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    taskRole.addManagedPolicy({
      managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
    });
    taskRole.addManagedPolicy({
      managedPolicyArn: 'arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess',
    });

    const taskDef = new ecs.FargateTaskDefinition(this, 'ecs-demo-taskDef', {
      memoryLimitMiB: 512,
      cpu: 256,
      taskRole: taskRole,
    });

    taskDef.addContainer('myWebApp', {
      image: ecs.ContainerImage.fromRegistry("anoppe/ecs-demo:latest"),
      portMappings: [
        {
          containerPort: 8080,
          protocol: Protocol.TCP
        }
      ],
      logging: new AwsLogDriver({
        streamPrefix: 'myWebApp-Stream',
        logRetention: RetentionDays.ONE_WEEK
      })
    });

    taskDef.addContainer('myXRayDaemon', {
      image: ecs.ContainerImage.fromRegistry("public.ecr.aws/xray/aws-xray-daemon:latest"),
      memoryReservationMiB: 256,
      portMappings: [
        {
          containerPort: 2000,
          protocol: Protocol.UDP
        }
      ],
      logging: new AwsLogDriver({
        streamPrefix: 'myXRay-Stream',
        logRetention: RetentionDays.ONE_WEEK
      }),
    });

    // Instantiate Fargate Service with just cluster and image
    const fargateAndLoadbalancerService =
        new ecs_patterns.ApplicationLoadBalancedFargateService(this, "FargateService", {
      cluster,
      taskDefinition: taskDef,
      assignPublicIp: false,
      publicLoadBalancer: true,
      desiredCount: 3
    });

    fargateAndLoadbalancerService.targetGroup.configureHealthCheck({
      port: '8080',
      path: '/actuator/health',
      healthyHttpCodes: '200,404',
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 5,
      interval: Duration.seconds(30)
    });

  }
}

const app = new cdk.App();

new MyFargate(app, 'ecs-demo');

app.synth();
