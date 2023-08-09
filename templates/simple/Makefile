CDK = npm run cdk --

.PHONY: nop
nop:

.PHONY: synth
synth:
	$(CDK) synth --quiet

.PHONY: diff
diff:
	$(CDK) --app cdk.out diff

.PHONY: deploy
deploy:
	$(CDK) --app cdk.out deploy --require-approval=never --all
