#!/usr/bin/env ts-node
import * as cdk from "aws-cdk-lib";
import { Stack } from "../lib/stack.js";

const app = new cdk.App();
new Stack(app, "{{name.camelCase}}Stack", {});
