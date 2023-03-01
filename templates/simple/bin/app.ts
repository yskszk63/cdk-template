#!/usr/bin/env -S npx tsx
import * as cdk from "aws-cdk-lib";
import { Stack } from "../lib/stack.js";

const app = new cdk.App();
new Stack(app, "{{name.camelCase}}Stack", {});
