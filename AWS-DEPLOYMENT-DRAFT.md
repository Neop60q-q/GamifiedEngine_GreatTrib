# AWS Deployment Draft

## Suggested services

- **Application Load Balancer** – routes HTTPS traffic.
- **ECS Fargate** – runs Laravel, Creation Engine and XP Engine containers.
- **Amazon ECR** – stores container images.
- **Amazon RDS for MySQL** – production database.
- **AWS Secrets Manager** – database credentials and service/API secrets.
- **CloudWatch** – logs, metrics and alarms.
- **S3** – optional storage for achievement artwork or submission attachments.
- **SQS** – optional later addition for reliable asynchronous completion/recalculation events.

## Logical flow

```text
Internet / Alumable
       |
       v
Application Load Balancer
       |
       +--> Laravel Integration Container
       |          |
       |          +--> Creation Engine (Python)
       |          +--> XP Engine (Python)
       |
       +-----------------------> RDS MySQL

CloudWatch monitors all services.
Secrets Manager provides credentials.
```
