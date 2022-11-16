#!/usr/bin/env node
import 'source-map-support/register.js';
import * as cdk from 'aws-cdk-lib';
import { ExampleStack } from '../lib/example-stack.js';

const app = new cdk.App();
new ExampleStack(app, 'ExampleStack', {
});
