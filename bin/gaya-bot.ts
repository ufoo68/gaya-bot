#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { GayaBotStack } from '../lib/gaya-bot-stack';

const app = new cdk.App();
new GayaBotStack(app, 'GayaBotStack');
