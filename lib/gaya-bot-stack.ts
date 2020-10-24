import * as cdk from '@aws-cdk/core'
import * as ssm from '@aws-cdk/aws-ssm'
import * as lambda from '@aws-cdk/aws-lambda'
import { LambdaApi } from 'cdk-lambda-api'

export class GayaBotStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const channelAccessToken = ssm.StringParameter.fromStringParameterAttributes(this, 'channel-access-token', {
      parameterName: 'gaya-channel-access-token',
    }).stringValue

    const channelSecret = ssm.StringParameter.fromStringParameterAttributes(this, 'channel-secret', {
      parameterName: 'gaya-channel-secret',
    }).stringValue

    const layer = new lambda.LayerVersion(this, 'layer', {
      compatibleRuntimes: [lambda.Runtime.NODEJS_12_X],
      code: lambda.Code.fromAsset('layer.out'),
    })

    new LambdaApi(this, 'gaya-bot', {
      lambdaPath: './bot',
      environment: {
        CHANNEL_ACCESS_TOKEN: channelAccessToken,
        CHANNEL_SECRET: channelSecret,
      },
      layer,
    })
  }
}
