import * as cdk from '@aws-cdk/core'
import { GayaBotStack } from '../lib/gaya-bot-stack'
import { bundleLayer } from '../lib/layerSetup'

bundleLayer()

const app = new cdk.App()
new GayaBotStack(app, 'GayaBotStack')
