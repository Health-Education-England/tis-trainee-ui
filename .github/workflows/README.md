# Deploy Workflow

## Required Permissions

### AWS

#### CloudFront

These permissions are required to manage the associated CloudFront distribution.

- `cloudfront:GetDistributionConfig`
- `cloudfront:UpdateDistribution`

#### Simple Storage Solution (S3)

##### Static Content

These permissions are required to deploy static website content to the relevant S3 buckets.

- `s3:ListBucket`
- `s3:GetObject`
- `s3:PutObject`
- `s3:DeleteObject`

##### Build Artifacts

These permissions are required to back up build artifacts to the relevant S3 buckets.

- `s3:ListBucket`
- `s3:GetObject`
- `s3:PutObject`
